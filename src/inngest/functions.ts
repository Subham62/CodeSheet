import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter";
import {
  gemini,
  openai,
  createAgent,
  createTool,
  createNetwork,
  // Tool,
  type Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";

import { inngest } from "./client";
import {
  getSandbox,
  lastAssistantTextMessageContent,
  parseAgentOutput,
} from "./utils";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";
import { SANDBOX_TIMEOUT } from "./types";

const openRouterModel = openai({
  // model: "meta-llama/llama-3.1-70b-instruct",  // Any OpenRouter model
  model: "openai/gpt-oss-20b:free",  // Any OpenRouter model
  // model: "openai/gpt-oss-120b:free",  // Any OpenRouter model
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: "https://openrouter.ai/api/v1",     // OpenRouter endpoint
  defaultParameters: {
    // temperature: 0.1,
    // top_p: 0.9,
    // max_completion_tokens: 2048,
  }
});

// Groq model configuration (OpenAI-compatible)
// Powerful model for complex coding tasks
const groqModel = openai({
  model: "llama-3.3-70b-versatile", // or "mixtral-8x7b-32768"
  // model: "qwen/qwen3-32b",
  apiKey: process.env.GROQ_API_KEY,
  baseUrl: "https://api.groq.com/openai/v1",
  defaultParameters: {
    // temperature: 0.1,  // Lower temperature = more precise, less creative
    // top_p: 0.9,
    // frequency_penalty: 0.2,  // Reduces repetitive errors
    // temperature: 0.2, // Medium = balanced creativity
    // top_p: 0.9, // Standard = good mix
    // frequency_penalty: 0.2, // Light repetition control
    // presence_penalty: 0.2, // Light topic diversity
  },
});

// Fast, cheaper model for simple tasks
const fastModel = openai({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
  baseUrl: "https://api.groq.com/openai/v1",
});

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("codesheet-nextjs-test");
      await sandbox.setTimeout(SANDBOX_TIMEOUT); // increase the sandbox time by 15 minutes
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];

        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc", //  TODO: Change to "asc" if AI does not understand what is the latest message
          },
          take: 10, //  it will limit the agent to take in consideration last 5 messages for current one
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      // model: gemini({ model: "gemini-2.0-flash" }),
      // model: groqModel,
      model: openRouterModel,

      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });

                return {
                  stdout: buffers.stdout,
                  stderr: buffers.stderr,
                  result,
                };
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                );
                return {
                  error: `Command failed: ${e}`,
                  stdout: buffers.stdout,
                  stderr: buffers.stderr,
                };
              }
            });
          },
        }),

        // createTool({
        //   name: "createOrUpdateFiles",
        //   description: "Create or update files in the sandbox",
        //   parameters: z.object({
        //     files: z.array(
        //       z.object({
        //         path: z.string(),
        //         content: z.string(),
        //       })
        //     ),
        //   }),
        //   handler: async ({ files }, { step, network } : Tool.Options<AgentState>) => {
        //     const newFiles = await step?.run("createOrUpdateFiles", async () => {
        //       // console.log("createOrUpdateFiles called with:", files);
        //       try {
        //         // const updateFiles = {...(network.state.data.files || {})};
        //         const updateFiles = (network.state.data.files || {});
        //         const sandbox = await getSandbox(sandboxId);
        //         for (const file of files) {
        //           await sandbox.files.write(file.path, file.content);
        //           updateFiles[file.path] = file.content;
        //         }

        //         // network.state.data.files = updateFiles;
        //         // return { updated: Object.keys(updateFiles) };
        //         return updateFiles;
        //       } catch (error) {
        //         console.error("Error writing files:", error);
        //         return { error: String(error) };
        //       }
        //     });

        //     if(typeof newFiles === "object"){
        //       network.state.data.files = newFiles;
        //     }
        //   },
        // }),

        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            // Helper: ensure sandbox is ready with retries
            async function getReadySandbox(
              sandboxId: string,
              retries = 5,
              delayMs = 500
            ) {
              for (let i = 0; i < retries; i++) {
                try {
                  const sandbox = await getSandbox(sandboxId);
                  // Simple connectivity test: check if root exists
                  await sandbox.files.exists("");
                  return sandbox;
                } catch (err) {
                  console.warn(`Sandbox not ready (attempt ${i + 1}):`, err);
                  await new Promise((r) => setTimeout(r, delayMs));
                }
              }
              throw new Error("Sandbox failed to connect after retries");
            }

            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  // Initialize network files object
                  network.state.data.files = network.state.data.files || {};

                  const sandbox = await getReadySandbox(sandboxId);

                  for (const file of files) {
                    try {
                      await sandbox.files.write(file.path, file.content);
                      network.state.data.files[file.path] = file.content;
                    } catch (writeError) {
                      console.error(
                        `Failed to write file ${file.path}:`,
                        writeError
                      );
                    }
                  }

                  // Return all updated files
                  return network.state.data.files;
                } catch (error) {
                  console.error("Error creating/updating files:", error);
                  return { error: String(error) };
                }
              }
            );

            // Ensure network state is updated
            if (typeof newFiles === "object" && !("error" in newFiles)) {
              network.state.data.files = newFiles;
            }
          },
        }),

        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];

                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }

                // return contents;
                return JSON.stringify(contents);
              } catch (error) {
                console.error("Error reading files:", error);
                return { error: String(error) };
              }
            });
          },
        }),
      ],

      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          console.log("Agent response:", lastAssistantMessageText);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          console.log("Summary already exists. Ending early.");
          return;
        }

        return codeAgent;
      },
    });

    // Run agent with user input
    const result = await network.run(event.data.value, { state });
    // this above line replaced by below couples of lines(from --------- starts)

    // -----------------
    // async function runAgentWithRetry(network: ReturnType<typeof createNetwork<AgentState>> , input: string, retries = 3) {
    //   for (let i = 0; i < retries; i++) {
    //     try {
    //       return await network.run(input);
    //     } catch (err) {
    //       console.warn(`AI request failed (attempt ${i + 1}):`, err);
    //       await new Promise((r) => setTimeout(r, 500)); // wait 500ms before retry
    //     }
    //   }
    //   throw new Error("AI request failed after retries");
    // }

    // const result = await runAgentWithRetry(network, event.data.value);
    // -----------------

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      // model: gemini({ model: "gemini-2.0-flash-lite" }),
      // model: fastModel,
      model: openRouterModel,
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      // model: gemini({ model: "gemini-2.0-flash-lite" }),
      // model: fastModel,
      model: openRouterModel,
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary
    );

    // const generateFragmentTitle = () => {
    //   const output = fragmentTitleOutput[0];
    //   if(output.type !== "text") {
    //     return "Fragment";
    //   }

    //   if(Array.isArray(output.content)){
    //     return output.content.map((txt) => txt).join("");
    //   }else {
    //     return output.content;
    //   }
    // }
    // const generateResponse = () => {
    //   const output = responseOutput[0];
    //   if(output.type !== "text") {
    //     return "Here you go";
    //   }

    //   if(Array.isArray(output.content)){
    //     return output.content.map((txt) => txt).join("");
    //   }else {
    //     return output.content;
    //   }
    // }

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    // Get sandbox URL
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Somrthing went wrong. Please try again",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          // content: generateResponse(),
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              // files: result?.state?.data?.files ?? {}, // This must be a valid JSON field or null
              files: result.state.data.files,
            },
          },
        },
      });
    });

    // Prepare final response
    const response = {
      url: sandboxUrl,
      title: "Fragment",
      files: result?.state?.data?.files ?? {},
      summary: result?.state?.data?.summary ?? "No summary generated.",
    };

    // console.log("Returning response:", response);

    return response;
  }
);

// Key insight: How step.run() manages network.state internally

// The step.run() method isolates the state during the step execution.

// It gives you a sandboxed or proxied version of network.state.data inside the step handler.

// Changes you make inside the step function to network.state.data only affect this isolated copy, not the global shared state.

// When the step finishes, only the returned value or explicit outside updates get merged back into the real network.state.data.

// -------------Analogy:---------------

// Think of step.run() like:

// You get a copy of a notebook page (network.state.data) to write notes on.

// Inside the step, you write your notes on the copy.

// When done, unless you explicitly copy those notes back to the original notebook, the main notebook remains unchanged.

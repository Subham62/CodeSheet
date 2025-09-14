import { gemini, createAgent } from "@inngest/agent-kit";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer.  You write readable, maintainable code . You write simple Next.js & React snippets.",
      // model: gemini({ model: "gemini-2.0-flash", apiKey: process.env.GEMINI_API_KEY }),
      model: gemini({ model: "gemini-2.0-flash"}),
    });

    
    // Run the agent with an input.  This automatically uses steps
    // to call your AI model.
    const { output } = await codeAgent.run(`Write the following snippet: ${event.data.val}`);
    console.log(output);
    return {output};
  },
);
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Imagine this is a download step
    await step.sleep("wait-a-moment", "30s");

    // Imagine this is transcript step
    await step.sleep("wait-transcript", "10s");

    // Imagine  this is a summury
    await step.sleep("wait-summary", "5s");
    return { message: `Hello ${event.data.email}!` };
  },
);
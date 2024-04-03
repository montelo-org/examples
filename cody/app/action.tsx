import "server-only";

import { createAI, createStreamableValue } from "ai/rsc";
import { Agent, Crew, Montelo, Task } from "montelo";

async function submitMessage(message: string, openaiKey: string) {
  "use server";

  const montelo = new Montelo({
    openai: {
      apiKey: openaiKey,
    },
  });

  const reply = createStreamableValue<{
    role: "user" | "assistant";
    content: string;
  }>();

  /**
   * Agents
   */
  const codyAgent = new Agent({
    name: "Cody",
    role: "You are Cody. You are an expert programmer.",
    model: "gpt-3.5-turbo",
  });

  /**
   * Tasks
   */
  const codeWriter = new Task({
    name: "Write Code",
    description: "Write the code for the given message: {message}",
    expectedOutput: "A proper code.",
    agent: codyAgent,
  });

  /**
   * Crew
   */
  const crew = new Crew({
    name: "Cody Crew",
    agents: [codyAgent],
    tasks: [codeWriter],
    process: "sequential",
    stepCallback: async (output: string, agentName?: string) => {
      reply.update({
        role: "assistant",
        content: output,
      });
    },
  });

  crew.start({ monteloClient: montelo, promptInputs: { message } }).then((result) => {
    reply.done({
      role: "assistant",
      content: result.result,
    });
  });

  return reply.value;
}

const initialAIState: {
  role: string;
  content: string;
}[] = [];

const initialUIState: {
  role: "user" | "assistant";
  content: string;
}[] = [
  {
    role: "assistant",
    content:
      "Hey! I'm Cody, a Software Engineering Intern built by Montelo. I'm like GPT-4 or Opus, but better. Try asking me to refactor some code, help with designing a new feature, or optimizing a database query. I'm here to help!",
  },
];

export const AI = createAI({
  actions: {
    submitMessage,
  },
  initialUIState,
  initialAIState,
});

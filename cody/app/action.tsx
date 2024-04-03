import "server-only";

import { createAI, createStreamableValue } from "ai/rsc";
import { Agent, Crew, Montelo, Task, Tools } from "montelo";
import { ProductFinderTool } from "@/components/tools/ProductFinderTool";

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
  }>({
    role: "assistant",
    content: "Sure! Give me a second while I assemble the Crew.",
  });

  /**
   * Agents
   */
  const productFinder = new Agent({
    name: "Product Finder",
    role: "You're an expert product finder. You help people find the hottest new products on Product Hunt to do with {message}.",
    tools: [ProductFinderTool],
    model: "gpt-3.5-turbo",
  });

  const PerplexitySearchTool = Tools.PerplexitySearchTool({ model: "sonar-small-online" });
  const productResearcher = new Agent({
    name: "Product Researcher",
    role: "You're a product researcher. you find more information about ALL the products given to you and summarize them using Perplexity.",
    tools: [PerplexitySearchTool],
    model: "gpt-3.5-turbo",
  });

  const writer = new Agent({
    name: "Writer",
    role: "You're a passionate writer. You write engaging and informative posts in the format given to you.",
    model: "gpt-3.5-turbo",
  });

  /**
   * Tasks
   */
  const findProductsTask = new Task({
    name: "Find Products",
    description: "Find a list of the top 5 hot products launching today about {message} on Product Hunt.",
    expectedOutput: "a list of 5 hot new products",
    agent: productFinder,
  });
  const researchProductsTask = new Task({
    name: "Research Products",
    description: "Research all the products found and summarize them.",
    expectedOutput: "A list of summaries of what each product does",
    agent: productResearcher,
  });
  const writePostsTask = new Task({
    name: "Write Posts",
    description:
      "Write 2 engaging and informative posts about the hottest products launching today. One short post for Twitter and one long markdown post for a blog.",
    expectedOutput:
      "1. A short post for Twitter\n2. Long post for a blog (in markdown)\nFormatted in this JSON format: { twitter: '...', blog: '...' }",
    agent: writer,
  });

  /**
   * Crew
   */
  const crew = new Crew({
    name: "Product Hunt Crew",
    agents: [productFinder, productResearcher, writer],
    tasks: [findProductsTask, researchProductsTask, writePostsTask],
    process: "sequential",
    stepCallback: async (output: string, agentName?: string) => {
      reply.update({
        role: "assistant",
        content: output,
      });
    },
  });

  crew.start({ monteloClient: montelo, promptInputs: { category: message } }).then((result) => {
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

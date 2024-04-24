import "dotenv/config";
import { DEvaluation, DInput, DOutput, Sentiment } from "./types";
import { CLASSIFICATION_SYSTEM_PROMPT } from "./prompts";
import { montelo } from "./montelo";

// helper function to make the request to the model
const llmRequest = async (sentence: string, model: "gpt-4-turbo" | "gpt-3.5-turbo"): Promise<Sentiment> => {
  const completion = await montelo.openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: CLASSIFICATION_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: `Sentence: ${sentence}`
      }
    ],
    response_format: {
      type: "json_object",
    }
  });
  
  const message = completion.choices[0].message.content;
  if (!message) {
    throw new Error("Model returned null message");
  }
  
  const parsed = JSON.parse(message) as { reasoning: string; label: string };
  return parsed.label.toLowerCase() as Sentiment;
};

const evaluator = async (expectedSentiment: string, actualSentiment: string): Promise<DEvaluation> => {
  return {
    isCorrect: expectedSentiment === actualSentiment,
  }
};

// run the gpt-3.5 and gpt-4 experiments
const experiment = async () => {
  const dataset = "financial-phrase-bank";
  
  await montelo.experiments.createAndRun<DInput, DOutput, DEvaluation>({
    name: "Run 1: GPT-4 Turbo",
    description: "Running GPT-4 Turbo",
    dataset,
    runner: async ({ input }) => {
      const gpt4 = await llmRequest(input.sentence, "gpt-4-turbo");
      return { sentiment: gpt4 }
    },
    evaluator: async ({ expectedOutput, actualOutput }) => {
      return evaluator(expectedOutput.sentiment, actualOutput.sentiment);
    },
    options: { parallelism: 20 }
  });
  
  await montelo.experiments.createAndRun<DInput, DOutput, DEvaluation>({
    name: "Run 2: GPT-3.5 Turbo",
    description: "Running GPT-3.5 Turbo",
    dataset,
    runner: async ({ input }) => {
      const gpt3 = await llmRequest(input.sentence, "gpt-3.5-turbo");
      return { sentiment: gpt3 }
    },
    evaluator: async ({ expectedOutput, actualOutput }) => {
      return evaluator(expectedOutput.sentiment, actualOutput.sentiment);
    },
    options: { parallelism: 20 }
  });
};

void experiment();

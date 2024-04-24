import "dotenv/config";
import { DEvaluation, FineTuneDInput, FineTuneDOutput } from "./types";
import { CLASSIFICATION_SYSTEM_PROMPT } from "./prompts";
import { montelo } from "./montelo";

const llmRequest = async (sentence: string): Promise<FineTuneDOutput> => {
  const completion = await montelo.openai.chat.completions.create({
    model: "ft:gpt-3.5-turbo-0125:personal::9HdYgA27",
    messages: [
      {
        role: "system",
        content: CLASSIFICATION_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Sentence: ${sentence}`,
      }
    ],
    response_format: {
      type: "json_object",
    },
  });
  
  const message = completion.choices[0].message;
  if (!message) {
    throw new Error("Model returned null message");
  }
  
  return {
    messages: [{
      role: "assistant",
      content: message.content!
    }]
  };
};

const experiment = async () => {
  await montelo.experiments.createAndRun<FineTuneDInput, FineTuneDOutput, DEvaluation>({
    name: "Run 3: Fine-tuned GPT-3.5 ",
    description: "Running a fine-tune of GPT-3.5",
    dataset: "fine-tuning-financial-phrase-bank",
    runner: ({ metadata }) => {
      return llmRequest(metadata.sentence);
    },
    evaluator: async ({ actualOutput, metadata }) => {
      const expectedSentiment = metadata.sentiment as string;
      const actualSentiment = JSON.parse(actualOutput.messages[0].content).label as string;
      
      return {
        isCorrect: expectedSentiment === actualSentiment,
      }
    },
    options: {
      parallelism: 20,
      // because this dataset has been fine-tuned on the train set, only run on the test split
      onlyTestSplit: true,
    }
  });
};

void experiment();

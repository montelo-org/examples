import "dotenv/config";
import { FineTuneDInput, FineTuneDOutput, HuggingFaceDatapoint } from "./types";
import async from 'async';
import { CLASSIFICATION_SYSTEM_PROMPT, SYNTHETIC_DATA_SYSTEM_PROMPT } from "./prompts";
import { montelo } from "./montelo";
import { chunk, readHuggingFaceDataset } from "./utils";
import { Datapoint } from "@montelo/core/dist/bundle-node/core/MonteloDatapoints.types";

const getSyntheticData = async (datapoint: HuggingFaceDatapoint): Promise<string> => {
  const completion = await montelo.openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: SYNTHETIC_DATA_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Sentence: ${datapoint.sentence}\n\nLabel: ${datapoint.sentiment}`,
      }
    ],
    response_format: { type: "json_object" },
  });
  
  return completion.choices[0].message.content!;
}

const upload = async () => {
  const dataset = await montelo.datasets.createFineTune({
    name: "Fine-Tuning Financial Phrase Bank",
    description: "For Fine-Tuning. This is only the subset for all agree.",
  });
  
  const datapoints = readHuggingFaceDataset();
  
  const chunks = chunk(datapoints, 10);
  let idx = 0;
  
  await async.each(chunks, async (chunk) => {
    const syntheticData = await Promise.all(chunk.map(getSyntheticData));
    
    const datapoints: Array<Datapoint<FineTuneDInput, FineTuneDOutput>> = chunk.map((datapoint, index) => {
      return {
        input: {
          messages: [
            {
              role: "system" as const,
              content: CLASSIFICATION_SYSTEM_PROMPT
            },
            {
              role: "user" as const,
              content: `Sentence: ${datapoint.sentence}`
            }
          ],
        },
        expectedOutput: {
          messages: [
            {
              role: "assistant" as const,
              content: syntheticData[index],
            }
          ],
        },
        split: Math.random() < 0.7 ? "TRAIN" as const : "TEST" as const,
        // this will be helpful when running evals
        metadata: {
          sentence: datapoint.sentence,
          sentiment: datapoint.sentiment,
        }
      }
    });
    
    await montelo.datapoints.createMany<FineTuneDInput, FineTuneDOutput>({
      dataset: dataset.slug,
      datapoints,
    });
    
    console.log(`Processed chunk ${idx++}/${chunks.length}`);
  });
};

void upload();

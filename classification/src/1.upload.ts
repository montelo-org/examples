import "dotenv/config";
import { readHuggingFaceDataset } from "./utils";
import { montelo } from "./montelo";
import { DInput, DOutput } from "./types";

// upload the hugging face dataset to montelo
const upload = async () => {
  // create the dataset on montelo
  const dataset = await montelo.datasets.create({
    name: "Financial Phrase Bank",
    description: "This is only the subset for all agree.",
    inputSchema: { sentence: "string" },
    outputSchema: { sentiment: "string" },
  });
  
  // read the datapoints from the hugging face dataset
  const datapoints = readHuggingFaceDataset();
  
  // format the hugging face datapoints for montelo
  const formattedDatapoints = datapoints.map((datapoint) => ({
    input: { sentence: datapoint.sentence },
    expectedOutput: { sentiment: datapoint.sentiment },
    split: Math.random() < 0.7 ? "TRAIN" as const : "TEST" as const,
  }));
  
  // upload to montelo
  await montelo.datapoints.createMany<DInput, DOutput>({
    dataset: dataset.slug,
    datapoints: formattedDatapoints,
  });
};

void upload();

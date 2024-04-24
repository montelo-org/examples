import fs from "fs";
import { HuggingFaceDatapoint, Sentiment } from "./types";

export const readHuggingFaceDataset = (): HuggingFaceDatapoint[] => {
  const filePath = "./FinancialPhraseBank-v1.0/Sentences_AllAgree.txt";
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const allLines = fileContent.split('\n');
  
  // only taking 200 samples
  return shuffle(allLines).slice(0, 200).reduce((accum, line) => {
    const trimmed = line.trim();
    const parts = trimmed.split('@');
    if (parts.length !== 2) {
      return accum;
    }
    const sentence = parts[0].trim();
    const sentiment = parts[1].trim() as Sentiment;
    return [...accum, {
      sentence,
      sentiment,
    }];
  }, [] as HuggingFaceDatapoint[]);
};

export const chunk = <T>(arr: T[], size: number): Array<T[]> =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_: any, i: number) =>
    arr.slice(i * size, i * size + size)
  );

export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  
  while (currentIndex != 0) {
    
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  
  return array;
};

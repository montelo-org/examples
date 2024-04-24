export type Sentiment = "neutral" | "positive" | "negative";

export type HuggingFaceDatapoint = {
  sentence: string;
  sentiment: Sentiment;
};

// the dataset input on montelo
export type DInput = {
  sentence: string;
};

// the dataset output on montelo
export type DOutput = {
  sentiment: Sentiment;
};

// the evaluation type
export type DEvaluation = {
  isCorrect: boolean;
};

export type FineTuneDInput = {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
};

export type FineTuneDOutput = {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
};

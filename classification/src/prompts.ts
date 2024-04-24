export const CLASSIFICATION_SYSTEM_PROMPT = `
You are given the task of classifying a sentence as "neutral", "negative", or "positive".
First, try to reason over the problem, then come up with the answer.
Return your answer in JSON format as type { reasoning: string, label: string }.
Be brief and concise in your reasoning.
`;

export const SYNTHETIC_DATA_SYSTEM_PROMPT = `
You are tasked with creating synthetic data.
You will be given a sentence, and it's label, and you need to return the reasoning behind the label.
Return your answer in JSON format as { reasoning: string; label: string }.
Be brief and concise in your reasoning.
`;

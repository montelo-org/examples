export const eventMessages = {
  startedPlanning: {
    role: "assistant" as const,
    content:
      "Understood. I'm first going to go into a deep think, and come up with a plan to complete this task.",
  },
  startedCoding: {
    role: "assistant" as const,
    content:
      "Now that I have a plan, I'm going to write the code to complete the task.",
  },
  startedReviewing: {
    role: "assistant" as const,
    content:
      "I'm going to double-check the code to make sure it all looks okay.",
  },
};

import "server-only";

import { createAI, createStreamableValue } from "ai/rsc";
import { Agent, Crew, Montelo, Task } from "montelo";

async function submitMessage({ message, openaiKey, model }: { message: string; openaiKey: string; model: string }) {
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

  const agentRoles = {
    PLANNER:
      "You're an expert code planner. Read the following user requirements carefully and reply with a clear and detailed step-by-step plan for your coworkers to complete the task with every point addressed. Write in markdown. No yapping",
    ENGINEER:
      "You're a senior software engineer who takes a user's requirements, a step-by-step plan and will respond with the code needed to complete the task. Make sure to address every point in the plan. Write in markdown. No yapping",
    REVIEWER:
      "You're a meticulous code reviewer. Review the code below and provide feedback on whether or not that user's requirements have been met. Write in markdown. No yapping",
  };

  /**
   * Agents
   */
  const planner = new Agent({ name: "Planner", role: agentRoles.PLANNER, model });
  const engineer = new Agent({ name: "Software Engineer", role: agentRoles.ENGINEER, model });
  const reviewer = new Agent({ name: "Code Reviewer", role: agentRoles.REVIEWER, model });

  /**
   * Tasks
   */
  const planTask = new Task({
    name: "Planning",
    description:
      "Look at the user requirements and provide a step-by-step plan for your coworkers to complete the task. User Requirements:\n{userRequirements}",
    expectedOutput: "A step-by-step plan for your coworkers to complete the task.",
    agent: planner,
    allowDelegation: true,
  });
  const codeTask = new Task({
    name: "Coding",
    description:
      "Take the user requirements and the plan provided and write the code needed to complete the task. User Requirements:\n{userRequirements}",
    expectedOutput: "The code needed to complete the task.",
    agent: engineer,
    allowDelegation: true,
  });
  const reviewTask = new Task({
    name: "Code Review",
    description:
      "Review the code provided and provide feedback on whether the user's requirements have been met. If they haven't been met, provide suggestions for improvement. User Requirements:\n{userRequirements}",
    expectedOutput: "Feedback on whether the user's requirements have been met.",
    agent: reviewer,
    allowDelegation: true,
  });
  const finalAnswerTask = new Task({
    name: "Final Answer",
    description:
      "Provide the FULL final answer/code to the user based on the feedback provided. MAKE SURE TO RESPOND WITH THE FULL CODE!",
    expectedOutput: "The FULL final answer/code to the user.",
    agent: engineer,
    allowDelegation: false,
  });

  // send first message
  reply.update({
    role: "assistant",
    content:
      "Understood. I'm first going to go into a deep think, and come up with a plan to complete this task. Stay on standby.",
  });

  const crew = new Crew({
    name: "Cody The Intern",
    agents: [planner, engineer, reviewer],
    tasks: [planTask, codeTask, reviewTask, finalAnswerTask],
    process: "sequential",
    stepCallback: async (output: string, agentName) => {
      // reply.update({
      //   role: "assistant",
      //   content: output,
      // });

      if (agentName === "Software Engineer") {
        reply.update({
          role: "assistant",
          content: "Now that I have a plan, I'm going to write the code to complete the task. Stay tuned!",
        });
      } else if (agentName === "Code Reviewer") {
        reply.update({
          role: "assistant",
          content: "I'm going to double-check the code to make sure it meets the user's requirements. Hang tight!",
        });
      }
    },
  });

  void crew.start({ monteloClient: montelo, promptInputs: { userRequirements: message } }).then((result) => {
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
    content: `Hey! I'm Cody, a Software Engineering Intern built by Montelo. I'm like GPT-4 or Opus, but better.\n\nTry asking me to refactor some code, help with designing a new feature, or optimizing a database query. I'm here to help!`,
  },
];

export const AI = createAI({
  actions: {
    submitMessage,
  },
  initialUIState,
  initialAIState,
});

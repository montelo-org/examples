import { Agent, Crew, Montelo, Task } from "montelo";

type Params = {
  message: string;
  openaiKey: string;
  model: string;
};
export const handleMessage = async ({ message, openaiKey, model }: Params) => {
  const montelo = new Montelo({
    openai: {
      apiKey: openaiKey,
    },
  });

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
  const planner = new Agent({
    name: "Planner",
    role: agentRoles.PLANNER,
    model,
  });
  const engineer = new Agent({
    name: "Software Engineer",
    role: agentRoles.ENGINEER,
    model,
  });
  const reviewer = new Agent({
    name: "Code Reviewer",
    role: agentRoles.REVIEWER,
    model,
  });

  /**
   * Tasks
   */
  const planTask = new Task({
    name: "Planning",
    description:
      "Look at the user requirements and provide a step-by-step plan for your coworkers to complete the task. User Requirements:\n{userRequirements}",
    expectedOutput:
      "A step-by-step plan for your coworkers to complete the task.",
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
    expectedOutput:
      "Feedback on whether the user's requirements have been met.",
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

  const crew = new Crew({
    name: "Cody The Intern",
    agents: [planner, engineer, reviewer],
    tasks: [planTask, codeTask, reviewTask, finalAnswerTask],
    process: "sequential",
    verbose: true,
  });

  /**
   const messagesArr = [
      {
        role: 'assistant' as const,
        content: "Understood. I'm first going to go into a deep think, and come up with a plan to complete this task.",
      },
      {
        role: 'assistant' as const,
        content: "Now that I have a plan, I'm going to write the code to complete the task.",
      },
      {
        role: 'assistant' as const,
        content: "I'm going to double-check the code to make sure it all looks okay.",
      },
    ];
   */

  const result = await crew.start({
    monteloClient: montelo,
    promptInputs: { userRequirements: message },
  });

  return result.result;
};

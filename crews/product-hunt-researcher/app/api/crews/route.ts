import { experimental_StreamData, OpenAIStream, StreamingTextResponse, Tool, ToolCallPayload } from "ai";
import { Agent, Crew, Montelo, Task, Tools } from "montelo";
import OpenAI from "openai";
import { ProductFinderTool } from "./tools/ProductFinderTool";

const montelo = new Montelo();

// IMPORTANT! Set the runtime to edge
// export const runtime = "edge";

export async function POST(req: Request) {
  const request = await req.json();
  const messages = request.messages as OpenAI.ChatCompletionMessageParam[];
  const category = messages.reverse().find(({ role }) => role === "user")?.content || "AI";
  console.log("category", category);

  /**
   * Agents
   */
  const productFinder = new Agent({
    name: "Product Finder",
    role: "You're an expert product finder. You help people find the hottest new products on Product Hunt to do with {category}.",
    tools: [ProductFinderTool],
    model: "gpt-3.5-turbo",
  });

  const PerplexitySearchTool = Tools.PerplexitySearchTool({ model: "sonar-small-online" });
  const productResearcher = new Agent({
    name: "Product Researcher",
    role: "You're a product researcher. you find more information about ALL the products given to you and summarize them using Perplexity.",
    tools: [PerplexitySearchTool],
    model: "gpt-3.5-turbo",
  });

  const writer = new Agent({
    name: "Writer",
    role: "You're a passionate writer. You write engaging and informative posts in the format given to you.",
    model: "gpt-3.5-turbo",
  });

  /**
   * Tasks
   */
  const findProductsTask = new Task({
    name: "Find Products",
    description: "Find a list of the top 5 hot products launching today about {category} on Product Hunt.",
    expectedOutput: "a list of 5 hot new products",
    agent: productFinder,
  });
  const researchProductsTask = new Task({
    name: "Research Products",
    description: "Research all the products found and summarize them.",
    expectedOutput: "A list of summaries of what each product does",
    agent: productResearcher,
  });
  const writePostsTask = new Task({
    name: "Write Posts",
    description:
      "Write 2 engaging and informative posts about the hottest products launching today. One short post for Twitter and one long markdown post for a blog.",
    expectedOutput:
      "1. A short post for Twitter\n2. Long post for a blog (in markdown)\nFormatted in this JSON format: { twitter: '...', blog: '...' }",
    agent: writer,
  });

  /**
   * Crew
   */
  const crew = new Crew({
    name: "Product Hunt Crew",
    agents: [productFinder, productResearcher, writer],
    tasks: [findProductsTask, researchProductsTask, writePostsTask],
    process: "sequential",
    stepCallback: async (output: string, agentName?: string) => {
      // TODO: show output to user
      console.log("[Agent - ", agentName, "] Output:", output.slice(0, 20) + (output.length > 20 ? "..." : ""));
    },
  });
  const { result } = await crew.start({ monteloClient: montelo, promptInputs: { category } });

  // Format: { twitter: string, blog: string}
  const response = typeof result === "string" ? JSON.parse(result) : result;
  return new Response(response, { status: 200 });

  // const data = new experimental_StreamData();
  // const stream = OpenAIStream(response, {
  //   experimental_onToolCall: async (call: ToolCallPayload, appendToolCallMessage) => {
  //     for (const toolCall of call.tools) {
  //       // Note: this is a very simple example of a tool call handler
  //       // that only supports a single tool call function.
  //       if (toolCall.func.name === "get_current_weather") {
  //         // Call a weather API here
  //         const weatherData = {
  //           temperature: 20,
  //           unit: toolCall.func.arguments.format === "celsius" ? "C" : "F",
  //         };

  //         const newMessages = appendToolCallMessage({
  //           tool_call_id: toolCall.id,
  //           function_name: "get_current_weather",
  //           tool_call_result: weatherData,
  //         });

  //         return trace.openai.chat.completions.create({
  //           messages: [...messages, ...newMessages],
  //           model,
  //           stream: true,
  //           tools,
  //           tool_choice: "auto",
  //         });
  //       }
  //     }
  //   },
  //   onCompletion(completion) {
  //     console.log("completion", completion);
  //   },
  //   onFinal(completion) {
  //     data.close();
  //   },
  //   experimental_streamData: true,
  // });

  // data.append({
  //   text: "Hello, how are you?",
  // });

  // return new StreamingTextResponse(stream, {}, data);
}

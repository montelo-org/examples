import {StreamingTextResponse, OpenAIStream} from 'ai';
import { Montelo } from 'montelo';

const { openai } = new Montelo();

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages,
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

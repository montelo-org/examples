import { OpenAIStream } from "ai";
import { Suspense } from "react";
import { Montelo } from "montelo";
import { PageLayout } from "@/app/pageLayout";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

export default async function Page({
  searchParams,
}: {
  // note that using searchParams opts your page into dynamic rendering. See https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
  searchParams: Record<string, string>;
}) {
  const { openai } = new Montelo();

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "user",
        content: searchParams["prompt"] ?? "Give me code for generating a JSX button",
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  const reader = stream.getReader();

  // We recursively render the stream as it comes in
  return (
    <PageLayout title={"Server Components"}>
      <Suspense>
        <Reader reader={reader} />
      </Suspense>
    </PageLayout>
  );
}

async function Reader({ reader }: { reader: ReadableStreamDefaultReader<any> }) {
  const { done, value } = await reader.read();

  if (done) {
    return null;
  }

  const text = new TextDecoder().decode(value);

  return (
    <span className={"mt-12 text-white"}>
      {text}
      <Suspense>
        <Reader reader={reader} />
      </Suspense>
    </span>
  );
}

"use client";

import { useChat } from "ai/react";
import { PageLayout } from "@/app/pageLayout";

export function Chat({ handler }: { handler: any }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: handler,
  });

  return (
    <PageLayout title={"Stream React Response"}>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch text-white">
        <ul>
          {messages.map((m, index) => (
            <li key={index}>
              {m.role === "user" ? "User: " : "AI: "}
              {m.role === "user" ? m.content : m.ui}
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-4 w-full max-w-md p-4 mb-8 border border-gray-500 rounded-2xl shadow-xl bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="What is the weather in Toronto?"
            value={input}
            onChange={handleInputChange}
            autoFocus
          />
        </form>
      </div>
    </PageLayout>
  );
}

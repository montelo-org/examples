"use client";

import { useChat } from "ai/react";
import { PageLayout } from "@/app/pageLayout";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <PageLayout title={"Basic Chat"}>
      <div className="flex flex-col w-full max-w-md py-32 mx-auto stretch">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap text-white">
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-4 w-full max-w-md p-4 mb-8 border border-gray-500 rounded-2xl shadow-xl bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </PageLayout>
  );
}

"use client";

import { useChat } from "ai/react";
import { useState } from "react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/crews",
    initialMessages: [
      {
        id: "0",
        role: "assistant",
        content: "",
        ui: "Hey there! What Product Hunt research are you looking to do today?",
      },
    ],
  });

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch h-full justify-between gap-4">
      <ul className="flex flex-col gap-4 text-sm">
        {messages.map((m, index) => (
          <li key={index} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="flex items-center">
                <span role="img" aria-label="Robot" className="text-2xl mr-2">
                  🤖
                </span>
                <div className="max-w-xs p-4 rounded-xl bg-gray-50 bg-opacity-50 shadow-2xl">{m.ui}</div>
              </div>
            )}
            {m.role === "user" && (
              <div className="flex items-center">
                <div className="max-w-xs p-4 rounded-xl bg-purple-300 bg-opacity-50 shadow-2xl">{m.content}</div>
                <span role="img" aria-label="Person" className="text-2xl ml-2">
                  🐙
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className={"absolute bottom-[64px]"}>
        <input
          className="w-[448px] p-4 rounded-2xl shadow-xl bg-neutral-800 bg-opacity-10 backdrop-blur placeholder-neutral-700 focus:ring-4 focus:ring-opacity-10 focus:ring-white focus:outline-none focus:shadow-2xl"
          placeholder={isFocused ? "" : "Send a message..."}
          value={input}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus
        />
      </form>
    </div>
  );
}

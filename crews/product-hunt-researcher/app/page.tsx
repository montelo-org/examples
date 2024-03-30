"use client";

import React from "react";
import { handler } from "./action";
import { useChat } from "ai/react";

export default function Page() {
  const { messages, append } = useChat({
    api: "/api/crews",
    initialMessages: [
      {
        id: "0",
        role: "assistant",
        content: "",
        ui: "Hey there! I can help you research the top products on Product Hunt today. 🚀 Simply select a category, and I'll get started!",
      },
    ],
  });

  const CategoryOptions = [
    "AI",
    "Travel",
    "Fitness",
    "Marketing & Sales",
    "Engineering & Development",
    "Physical Products",
  ];
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    append({
      role: "user",
      content: category,
    });
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch h-full justify-between gap-4">
      <ul className="flex flex-col gap-4 text-sm">
        {messages.map((m, index) => (
          <React.Fragment key={index}>
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
            {index === 0 && (
              <div className="grid grid-cols-3 items-center ml-8 gap-2">
                {CategoryOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleCategorySelect(option)}
                    className={`px-4 py-2 bg-purple-300 bg-opacity-50 rounded-lg shadow-md hover:bg-purple-400 hover:bg-opacity-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out font-medium ${selectedCategory === option ? "bg-purple-400 bg-opacity-50 shadow-lg" : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

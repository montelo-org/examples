"use client";

import React from "react";
import { readStreamableValue, useActions, useAIState } from "ai/rsc";
import { type AI } from "@/app/action";
import ReactMarkdown from "react-markdown";

export default function Page() {
  const [history, setHistory] = useAIState<typeof AI>();
  const { submitCategory } = useActions<typeof AI>();

  const CategoryOptions = [
    "AI",
    "Travel",
    "Fitness",
    "Marketing & Sales",
    "Engineering & Development",
    "Physical Products",
  ];
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);

    const responseStream = await submitCategory(category);
    const streamableValue = readStreamableValue(responseStream);

    for await (const v of streamableValue) {
      if (!v) return;
      setHistory((currentMessages) => [
        ...currentMessages,
        {
          role: v.role,
          content: v.content,
        },
      ]);
    }
  };

  console.log(history);

  const IconMap: Record<string, string> = {
    assistant: "🤖",
    "Product Finder": "🔍",
    "Product Researcher": "🔬",
    Writer: "📝",
    final: "🤖",
  };

  const RenderFinalContent = (content: string) => {
    const parsed = JSON.parse(content) as { twitter: string; blog: string };

    return (
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-gray-50 bg-opacity-50 shadow-2xl">
          Here's the Tweet and Blog Post for you!
        </div>
        <div className="p-4 rounded-xl bg-gray-50 bg-opacity-50 shadow-2xl">
          <h2 className="text-lg font-semibold">Twitter Post</h2>
          <p>{parsed.twitter}</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50 bg-opacity-50 shadow-2xl">
          <h2 className="text-lg font-semibold">Blog Post</h2>
          <ReactMarkdown>{parsed.blog}</ReactMarkdown>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch h-full justify-between gap-4">
      <ul className="flex flex-col gap-4 text-sm">
        {history.map((m, index) => (
          <React.Fragment key={index}>
            <li key={index} className={"flex justify-start"}>
              <div className="flex flex-col gap-1">
                <p className={"text-2xl"}>{`${IconMap[m.role]} ${(m.role !== "final" && m.role !== "assistant") ? m.role : ""}`}</p>
                {m.role !== "final" ? (
                  <div className="p-4 rounded-xl bg-gray-50 bg-opacity-50 shadow-2xl">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  RenderFinalContent(m.content)
                )}
              </div>
            </li>
            {index === 0 && (
              <div className="grid grid-cols-3 items-center gap-2">
                {CategoryOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleCategorySelect(option)}
                    className={`px-4 py-2 bg-gray-50 bg-opacity-50 rounded-lg shadow-md hover:bg-gray-200 hover:bg-opacity-50 hover:shadow-lg focus:outline-none transition-colors duration-200 ease-in-out font-medium ${selectedCategory === option ? "bg-purple-400 bg-opacity-50 shadow-lg hover:bg-purple-500 hover:bg-opacity-50 hover:shadow-xl text-white" : "text-gray-600"}`}
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

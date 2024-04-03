import React, { FormEventHandler, useState } from "react";
import ReactMarkdown from "react-markdown";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { useLocalStorage } from "@uidotdev/usehooks";

export const MainState = () => {
  const [localKey] = useLocalStorage<string>("openai-api-key", "");
  const { submitMessage } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();
  const [inputMessage, setInputMessage] = useState<string>("");

  const IconMap: Record<string, string> = {
    assistant: "🤖",
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        content: inputMessage,
      },
    ]);
    setInputMessage("");

    const responseStream = await submitMessage(inputMessage, localKey);
    const streamableValue = readStreamableValue(responseStream);

    for await (const v of streamableValue) {
      if (!v) return;
      setMessages((currentMessages) => [
        ...currentMessages,
        v,
      ]);
    }
  };

  return (
    <div className="flex flex-col w-[80%] h-[98%] mx-auto justify-between gap-4">
      <ul className="flex flex-col gap-4 text-sm overflow-auto">
        {messages.map((m, index) => (
          <React.Fragment key={index}>
            <li key={index} className={"flex justify-start"}>
              <div className="flex flex-row items-center gap-1">
                <p
                  className={"text-2xl"}>{`${IconMap[m.role]} ${m.role !== "assistant" ? m.role : ""}`}</p>
                <div className="p-4 rounded-xl bg-gray-50 bg-opacity-50 shadow-2xl">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </li>
          </React.Fragment>
        ))}
      </ul>

      <form
        onSubmit={handleSubmit}>
        <textarea
          className="border-gray-300 rounded-lg shadow-xl w-full p-4 bg-opacity-80 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-colors duration-200 ease-in-out"
          value={inputMessage}
          placeholder="Ask me anything..."
          onChange={(event) => setInputMessage(event.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
};
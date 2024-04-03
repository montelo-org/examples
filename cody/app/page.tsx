"use client";

import React, { useState } from "react";
import { Key } from "@/components/icons/key";
import { MainState } from "@/components/states/main";
import { ApiKeysState } from "@/components/states/apikeys";
import { useLocalStorage } from "@uidotdev/usehooks";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import dynamic from "next/dynamic";

function Page() {
  const [localKey] = useLocalStorage<string>("openai-api-key", "");
  const { submitMessage } = useActions<typeof AI>();
  const [_messages, setMessages] = useUIState<typeof AI>();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-3.5-turbo-0125");

  const timeout = selectedModel === "gpt-3.5-turbo-0125" ? 10000 : 20000;

  const [appState, setAppState] = useState<"main" | "apikeys">("main");
  const setMainState = () => setAppState("main");
  const setApiKeysState = () => setAppState("apikeys");

  const isTextAreaDisabled = localKey === "" || isChatting;

  const StateMap: Record<string, JSX.Element> = {
    main: <MainState isChatting={isChatting} timeout={timeout} />,
    apikeys: <ApiKeysState onBack={setMainState} />,
  };

  const handleSubmit = async () => {
    setIsChatting(true);
    setInputMessage("");
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        content: inputMessage,
      },
    ]);

    const responseStream = await submitMessage({ message: inputMessage, openaiKey: localKey, model: selectedModel });
    const streamableValue = readStreamableValue(responseStream);

    const messagesArr = [
      {
        role: "assistant" as const,
        content:
          "Understood. I'm first going to go into a deep think, and come up with a plan to complete this task.",
      },
      {
        role: "assistant" as const,
        content: "Now that I have a plan, I'm going to write the code to complete the task.",
      },
      {
        role: "assistant" as const,
        content: "I'm going to double-check the code to make sure it all looks okay.",
      },
    ];

    for (const message of messagesArr) {
      setMessages((currentMessages) => [...currentMessages, message]);
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }

    for await (const v of streamableValue) {
      if (!v) return;
      setMessages((currentMessages) => [...currentMessages, v]);
    }
    setIsChatting(false);
  };

  return (
    <div className={"grainy-paper w-[90%] h-[90%] mx-auto rounded-lg flex flex-col"}>
      <div className={"grainy-header w-full p-4 grid grid-cols-3 rounded-t-xl border-b-[1px] border-gray-400"}>
        <a
          href={"https://montelo.ai"}
          target={"_blank"}
          rel="noopener noreferrer"
          className={"flex w-fit flex-row gap-1 items-center hover:opacity-85"}
        >
          <img src={"/MonteloLogo.svg"} alt={"MonteloAI Logo"} className={"h-6"} />
          <p>MonteloAI</p>
        </a>
        <p className="text-center">Cody</p>
        <div className={"flex gap-4 justify-end items-center"}>
          <div className="max-w-sm">
            <select
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value)}
              className="bg-transparent p-1 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
            >
              <option value="gpt-3.5-turbo-0125">GPT-3.5-Turbo</option>
              <option value="gpt-4-0125-preview">GPT-4</option>
            </select>
          </div>

          <div
            className={"flex flex-row gap-1 cursor-pointer hover:text-gray-500 items-center text-sm italic"}
            onClick={setApiKeysState}
          >
            {localKey === "" ? <p className={"text-sm italic"}>Set API Key First</p> : null}
            <Key />
          </div>
        </div>
      </div>
      <div className={"flex h-full overflow-auto flex-col-reverse sm:flex-row"}>
        <textarea
          className="flex-1 max-w-full sm:max-w-[50%] p-4 bg-opacity-80 bg-gray-200 focus:outline-none focus:border-transparent rounded-bl-xl"
          value={inputMessage}
          placeholder="Ask Cody anything..."
          onChange={(event) => setInputMessage(event.target.value)}
          autoFocus
          onKeyUp={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              void handleSubmit();
            }
          }}
          disabled={isTextAreaDisabled}
        />
        <div className={"px-2 py-4 h-full max-w-full sm:max-w-[50%] overflow-auto flex-1"}
             suppressHydrationWarning={true}>
          {StateMap[appState]}
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});

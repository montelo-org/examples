"use client";

import React, { useState } from "react";
import { Key } from "@/components/icons/key";
import { MainState } from "@/components/states/main";
import { ApiKeysState } from "@/components/states/apikeys";
import { useLocalStorage } from "@uidotdev/usehooks";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";

export default function Page() {
  const [localKey] = useLocalStorage<string>("openai-api-key", "");
  const { submitMessage } = useActions<typeof AI>();
  const [_messages, setMessages] = useUIState<typeof AI>();
  const [inputMessage, setInputMessage] = useState<string>("");

  const [appState, setAppState] = useState<"main" | "apikeys">("main");

  const setMainState = () => setAppState("main");

  const setApiKeysState = () => setAppState("apikeys");

  const StateMap: Record<string, JSX.Element> = {
    main: <MainState />,
    apikeys: <ApiKeysState onBack={setMainState} />,
  };

  const handleSubmit = async () => {
    setInputMessage("");
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        content: inputMessage,
      },
    ]);

    const responseStream = await submitMessage(inputMessage, localKey);
    const streamableValue = readStreamableValue(responseStream);

    for await (const v of streamableValue) {
      console.log(v);
      if (!v) return;
      setMessages((currentMessages) => [
        ...currentMessages,
        v,
      ]);
    }
  };

  return (
    <div className={"grainy-paper w-[80%] h-[90%] mx-auto rounded-lg flex flex-col"}>
      <div className={"grainy-header p-4 flex justify-between items-center rounded-t-xl border-b-[1px] border-gray-400"}>
        <a href={"https://montelo.ai"} target={"_blank"} rel="noopener noreferrer"
           className={"flex flex-row gap-1 items-center"}>
          <img src={"/MonteloLogo.svg"} alt={"MonteloAI Logo"} className={"h-6"} />
          <p>MonteloAI</p>
        </a>
        <p>Cody</p>
        <div className={"flex gap-2"}>
          {/*<HistoryIcon className={"cursor-pointer hover:text-gray-500"} />*/}
          <div className={"flex flex-row gap-1 cursor-pointer hover:text-gray-500 items-center"}
               onClick={setApiKeysState}>
            {localKey === "" ? <p className={"text-sm italic"}>Set API Key First</p> : null}
            <Key />
          </div>
        </div>
      </div>
      <div className={"grid grid-cols-2 h-[100%]"}>
        <textarea
          className="p-4 bg-opacity-80 bg-gray-200 focus:outline-none focus:border-transparent resize-none rounded-bl-xl"
          value={inputMessage}
          placeholder="Ask Cody anything..."
          onChange={(event) => setInputMessage(event.target.value)}
          autoFocus
          onKeyUp={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              void handleSubmit();
            }
          }}
        />
        <div className={"p-4 h-[94%] overflow-auto"} suppressHydrationWarning={true}>
          {StateMap[appState]}
        </div>
      </div>
    </div>
  );
}

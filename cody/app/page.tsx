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
      setMessages((currentMessages) => [...currentMessages, v]);
    }
  };

  return (
    <div className={"grainy-paper w-[80%] h-[90%] mx-auto rounded-lg flex flex-col"}>
      <div className={"grainy-header w-full p-4 grid grid-cols-3 rounded-t-xl border-b-[1px] border-gray-400"}>
        <a
          href={"https://montelo.ai"}
          target={"_blank"}
          rel="noopener noreferrer"
          className={"flex flex-row gap-1 items-center"}
        >
          <img src={"/MonteloLogo.svg"} alt={"MonteloAI Logo"} className={"h-6"} />
          <p>MonteloAI</p>
        </a>
        <p className="text-center">Cody</p>
        <div className={"flex gap-2 justify-end"}>
          {/*<HistoryIcon className={"cursor-pointer hover:text-gray-500"} />*/}
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
        />
        <div className={"p-4 h-full max-w-full sm:max-w-[50%] overflow-auto flex-1"} suppressHydrationWarning={true}>
          {StateMap[appState]}
        </div>
      </div>
    </div>
  );
}

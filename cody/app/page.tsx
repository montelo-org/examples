"use client";

import React, { useState } from "react";
import { Key } from "@/components/icons/key";
import { MainState } from "@/components/states/main";
import { ApiKeysState } from "@/components/states/apikeys";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function Page() {
  const [localKey] = useLocalStorage<string>("openai-api-key", "");

  const [appState, setAppState] = useState<"main" | "apikeys">("main");

  const setMainState = () => setAppState("main");

  const setApiKeysState = () => setAppState("apikeys");

  const StateMap: Record<string, JSX.Element> = {
    main: <MainState />,
    apikeys: <ApiKeysState onBack={setMainState} />,
  };

  return (
    <div className={"grainy-paper w-[50%] h-[95%] mx-auto rounded-lg"}>
      <div className={"bg-gray-200 bg-opacity-80 p-4 flex justify-between items-center rounded-t-xl mb-2"}>
        <a href={"https://montelo.ai"} target={"_blank"} rel="noopener noreferrer" className={"flex flex-row gap-1 items-center"}>
          <img src={"/MonteloLogo.svg"} alt={"MonteloAI Logo"} className={"h-6"} />
          <p>MonteloAI</p>
        </a>
        <p>Cody</p>
        <div className={"flex gap-2"}>
          {/*<HistoryIcon className={"cursor-pointer hover:text-gray-500"} />*/}
          <div className={"flex flex-row gap-1 cursor-pointer hover:text-gray-500 items-center"} onClick={setApiKeysState}>
            {localKey === "" ? <p className={"text-sm italic"}>Set API Key First</p> : null}
            <Key />
          </div>
        </div>
      </div>
      <div className={"p-4 h-[94%]"}>
        {StateMap[appState]}
      </div>
    </div>
  );
}

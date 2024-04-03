"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React, { FC, FormEventHandler, useEffect, useRef, useState } from "react";

export const ApiKeysState: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [localValue, setLocalValue] = useLocalStorage<string>("openai-api-key", "");
  const [inputValue, setInputValue] = useState<string>(localValue);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (inputRef.current) {
      setLocalValue(inputValue);
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    if (localValue === "" && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col w-[85%] mx-auto h-full gap-4">
      <a onClick={onBack} className={"w-fit cursor-pointer hover:text-gray-500"}>
        Back
      </a>
      <p className={"self-center text-lg font-medium"}>Your OpenAI Key</p>

      <form
        className={"flex flex-col"}
        onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="text-sm border-gray-300 rounded-lg shadow-xl w-full p-4 bg-opacity-80 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-colors duration-200 ease-in-out"
          value={inputValue}
          placeholder="sk-..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit"
                className="self-end w-1/6 mt-4 bg-[#3139FB] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Save
        </button>
      </form>

      <p>Your API key never gets sent to our servers. You can check the full source code for Cody&nbsp;
        {/*TODO add source code link*/}
        <a href="" target={"_blank"} rel="noopener noreferrer"
           className={"cursor-pointer text-blue-700 underline"}>here</a>.
      </p>
    </div>
  );
};
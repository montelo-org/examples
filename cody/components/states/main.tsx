import React, { FC, useState } from "react";
import ReactMarkdown from "react-markdown";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { useCopyToClipboard, useLocalStorage } from "@uidotdev/usehooks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard } from "@/components/icons/clipboard";
import { ClipboardCheck } from "@/components/icons/clipboard-check";

export const MainState = () => {
    const [copiedText, copyToClipboard] = useCopyToClipboard();
    const [localKey] = useLocalStorage<string>("openai-api-key", "");
    const { submitMessage } = useActions<typeof AI>();
    const [messages, setMessages] = useUIState<typeof AI>();
    const [inputMessage, setInputMessage] = useState<string>("");

    const IconMap: Record<string, string> = {
      assistant: "🤖",
      user: "👤",
    };

    const handleSubmit = async () => {
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

    const Markdown: FC<{ children: string; }> = ({ children }) => {
      const replaced = children.replaceAll("```", "~~~");

      return <ReactMarkdown className={"text-sm"} components={{
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");

          const CodeSnippet = ({ match }: { match: RegExpExecArray }) => (
            <div className={"flex flex-col"}>
              <div className={"self-end"}>
                {copiedText === children ? <ClipboardCheck /> : <Clipboard onClick={() => {
                  void copyToClipboard(children as string);
                }} />}
              </div>
              {/* @ts-ignore */}
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={oneDark}
              />
            </div>
          );

          return (
            match ? (
              <CodeSnippet match={match} />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          );
        },
      }
      }>{replaced}</ReactMarkdown>;
    };

    const AssistantMessage = (m: { content: string }) => (
      <li className={"flex justify-start"}>
        <div className="flex flex-row items-center gap-1">
          <p
            className={"text-2xl"}>{IconMap["assistant"]}</p>
          <div className="p-4 rounded-xl bg-gray-50 bg-opacity-50 shadow">
            <Markdown>{m.content}</Markdown>
          </div>
        </div>
      </li>
    );

    const UserMessage = (m: { content: string }) => (
      <li className={"flex justify-end"}>
        <div className="flex flex-row items-center gap-1">
          <div className="p-4 rounded-xl bg-gray-50 bg-opacity-50 shadow">
            <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
          <p className={"text-2xl"}>{IconMap["user"]}</p>
        </div>
      </li>
    );

    return (
      <div className="flex flex-col w-[80%] h-[98%] mx-auto justify-between gap-4">
        <ul className="flex flex-col gap-4 text-sm overflow-auto">
          {messages.map((m, index) => (
            <React.Fragment key={index}>
              {m.role === "assistant" ? <AssistantMessage content={m.content} /> : <UserMessage content={m.content} />}
            </React.Fragment>
          ))}
        </ul>

        <div className={"flex flex-row gap-2"}>
        <textarea
          className="border-gray-300 rounded-lg shadow-xl w-full p-4 bg-opacity-80 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-colors duration-200 ease-in-out"
          value={inputMessage}
          placeholder="Ask me anything..."
          onChange={(event) => setInputMessage(event.target.value)}
          autoFocus
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              void handleSubmit();
            }
          }}
        />
        </div>
      </div>
    );
  }
;
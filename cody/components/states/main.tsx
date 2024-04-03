import React, { FC, ReactNode, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useUIState } from "ai/rsc";
import { Bot, User } from "lucide-react";
import type { AI } from "@/app/action";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard } from "@/components/icons/clipboard";
import { ClipboardCheck } from "@/components/icons/clipboard-check";

export const MainState: FC<{ isChatting: boolean; timeout: number }> = ({ isChatting, timeout }) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [messages] = useUIState<typeof AI>();

  const IconMap: Record<string, ReactNode> = {
    assistant: <Bot />,
    user: <User />,
  };

  const Markdown: FC<{ children: string }> = ({ children }) => {
    // Replace triple backticks with tildes and handle new lines
    const replaced = children.replaceAll("```", "~~~");

    return (
      <ReactMarkdown
        className={"text-sm"}
        components={{
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");

            const CodeSnippet = ({ match }: { match: RegExpExecArray }) => (
              <div className={"flex flex-col w-full h-full relative text-xs"}>
                <div className={"self-end absolute top-3 right-[6px] text-white text-xs opacity-50"}>
                  {copiedText === children ? (
                    <ClipboardCheck className={"cursor-pointer"} />
                  ) : (
                    <Clipboard
                      className={"cursor-pointer"}
                      onClick={() => {
                        void copyToClipboard(children as string);
                      }}
                    />
                  )}
                </div>
                {/*@ts-ignore*/}
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match ? match[1] : ""}
                  style={oneDark}
                />
              </div>
            );

            return match ? (
              <CodeSnippet match={match} />
            ) : (
              <code {...rest} className={`max-w-full ${className}`}>
                {children}
              </code>
            );
          },
        }}
      >
        {replaced}
      </ReactMarkdown>
    );
  };

  const AssistantMessage = (m: { content: string }) => (
    <li className={"flex justify-start items-center gap-1 max-w-[100%]"}>
      <p className={"text-2xl -ml-[26px]"}>{IconMap["assistant"]}</p>
      <div className="p-4 rounded-xl bg-gray-50 bg-opacity-55 shadow max-w-full flex-1">
        <Markdown>{m.content}</Markdown>
      </div>
    </li>
  );

  const UserMessage = (m: { content: string }) => (
    <li className={"flex justify-end gap-1 items-center max-w-[100%]"}>
      <div className="p-4 rounded-xl bg-gray-50 bg-opacity-30 shadow max-w-[100%] overflow-auto">
        <ReactMarkdown>{m.content}</ReactMarkdown>
      </div>
      <p className={"text-2xl -mr-[26px]"}>{IconMap["user"]}</p>
    </li>
  );

  const Countdown: FC<{ timeout: number }> = ({ timeout }) => {
    const [countdown, setCountdown] = useState(timeout / 1000);

    useEffect(() => {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className={"flex justify-center items-center bg-[#3139FB] bg-opacity-50 px-4 py-2 w-1/3 mx-auto rounded-xl font-medium"}>
        <p>Loading&nbsp;{countdown}s</p>
      </div>
    );
  };

  return (
    <ul className="flex flex-col w-[80%] mx-auto h-[98%] gap-4 text-sm max-w-full mb-4">
      {messages.map((m, index) => (
        <React.Fragment key={index}>
          {m.role === "assistant" ? <AssistantMessage content={m.content} /> : <UserMessage content={m.content} />}
          {isChatting && (index === messages.length - 1) && <Countdown timeout={timeout} />}
        </React.Fragment>
      ))}
    </ul>
  );
};

import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard } from "@/components/icons/clipboard";
import { ClipboardCheck } from "@/components/icons/clipboard-check";

export const MainState = () => {
    const [copiedText, copyToClipboard] = useCopyToClipboard();
    const [messages] = useUIState<typeof AI>();

    const IconMap: Record<string, string> = {
      assistant: "🤖",
      user: "👤",
    };

    const Markdown: FC<{ children: string; }> = ({ children }) => {
      // Replace triple backticks with tildes and handle new lines
      const replaced = children.replaceAll("```", "~~~");

      return <ReactMarkdown className={"text-sm"} components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");

          const CodeSnippet = ({ match }: { match: RegExpExecArray }) => (
            <div className={"flex flex-col w-[96%]"}>
              <div className={"self-end"}>
                {copiedText === children ? <ClipboardCheck className={"cursor-pointer"} /> :
                  <Clipboard className={"cursor-pointer"} onClick={() => {
                    void copyToClipboard(children as string);
                  }} />}
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

          return (
            match ? (
              <CodeSnippet match={match} />
            ) : (
              <code {...rest} className={`max-w-fit ${className}`}>
                {children}
              </code>
            )
          );
        },
      }}>{replaced}</ReactMarkdown>;
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
      <div className="flex flex-col w-[80%] h-[98%] mx-auto gap-4">
        <ul className="flex flex-col gap-4 text-sm max-w-fit">
          {messages.map((m, index) => (
            <React.Fragment key={index}>
              {m.role === "assistant" ? <AssistantMessage content={m.content} /> : <UserMessage content={m.content} />}
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
  }
;
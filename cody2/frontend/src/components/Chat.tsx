import { useCopyToClipboard } from '@uidotdev/usehooks';
import { Bot, Clipboard, ClipboardCheck, User } from 'lucide-react';
import React, { FC, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage } from '../types';

export const Chat: FC<{ isChatting: boolean; messages: ChatMessage[] }> = ({ isChatting, messages }) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const IconMap: Record<string, ReactNode> = {
    assistant: <Bot />,
    user: <User />,
  };

  const Markdown: FC<{ children: string }> = ({ children }) => {
    // Replace triple backticks with tildes and handle new lines
    const replaced = children.replaceAll('```', '~~~');

    return (
      <ReactMarkdown
        className={'text-sm'}
        components={{
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');

            const CodeSnippet = ({ match }: { match: RegExpExecArray }) => (
              <div className={'flex flex-col w-full h-full relative text-xs'}>
                <div className={'self-end absolute top-3 right-[6px] text-white text-xs opacity-50'}>
                  {copiedText === children ? (
                    <ClipboardCheck className={'cursor-pointer'} />
                  ) : (
                    <Clipboard
                      className={'cursor-pointer'}
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
                  children={String(children).replace(/\n$/, '')}
                  language={match ? match[1] : ''}
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
    <li className={'flex justify-start items-center gap-1 max-w-[100%]'}>
      <p className={'text-2xl -ml-[26px]'}>{IconMap['assistant']}</p>
      <div className="p-4 rounded-xl bg-gray-50 bg-opacity-55 shadow max-w-full flex-1">
        <Markdown>{m.content}</Markdown>
      </div>
    </li>
  );

  const UserMessage = (m: { content: string }) => (
    <li className={'flex justify-end gap-1 items-center max-w-[100%]'}>
      <div className="p-4 rounded-xl bg-gray-50 bg-opacity-30 shadow max-w-[100%] overflow-auto">
        <ReactMarkdown>{m.content}</ReactMarkdown>
      </div>
      <p className={'text-2xl -mr-[26px]'}>{IconMap['user']}</p>
    </li>
  );

  return (
    <ul className="flex flex-col w-[80%] mx-auto h-[98%] gap-4 text-sm max-w-full mb-4">
      {messages.map((m, index) => (
        <React.Fragment key={index}>
          {m.role === 'assistant' ? <AssistantMessage content={m.content} /> : <UserMessage content={m.content} />}
        </React.Fragment>
      ))}
    </ul>
  );
};

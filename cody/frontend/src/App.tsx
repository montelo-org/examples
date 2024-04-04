import { useLocalStorage } from '@uidotdev/usehooks';
import { useContext, useEffect, useState } from 'react';
import { ApiKeys } from './components/ApiKeys';
import { Chat } from './components/Chat';
import Header from './components/Header';
import { ChatMessage } from './types';
import { SocketContext } from './contexts/SocketContext';

const DEFAULT_MESSAGE = {
  role: 'assistant',
  content: `Hey! I'm Cody, a Software Engineering Intern built by Montelo. I'm like GPT-4 or Opus, but better.\n\nTry asking me to refactor some code, help with designing a new feature, or optimizing a database query. I'm here to help!`,
} as ChatMessage;

export default function App() {
  const [localKey] = useLocalStorage<string>('openai-api-key', '');
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_MESSAGE]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-3.5-turbo-0125');
  const { socket, socketEmit } = useContext(SocketContext);

  const [appState, setAppState] = useState<'chat' | 'apikeys'>('chat');
  const showChatView = () => setAppState('chat');
  const showApiKeysView = () => setAppState('apikeys');

  const isTextAreaDisabled = localKey === '' || isChatting;

  const StateMap: Record<string, JSX.Element> = {
    chat: <Chat messages={messages} isChatting={isChatting} />,
    apikeys: <ApiKeys onBack={showChatView} />,
  };

  const handleSubmit = async () => {
    setIsChatting(true);
    setInputMessage('');
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: 'user',
        content: inputMessage,
      },
    ]);

    socketEmit('message', { message: inputMessage, openaiKey: localKey, model: selectedModel });
  };

  const handleResponse = async ({ message, status }: { status: string; message: ChatMessage }) => {
    setMessages((currentMessages) => [...currentMessages, message]);

    if (status === 'done') {
      setIsChatting(false);
    }
  };

  useEffect(() => {
    socket.on('response', handleResponse);
    return () => {
      socket.off('response', handleResponse);
    };
  }, [socket]);

  return (
    <div className={`grainy-background w-screen h-screen flex justify-center items-center`}>
      <div className={'grainy-paper w-[90%] h-[90%] rounded-lg flex flex-col'}>
        <Header
          localKey={localKey}
          setApiKeysState={showApiKeysView}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />

        <div className={'flex h-full overflow-auto flex-col-reverse sm:flex-row'}>
          <textarea
            className="flex-1 max-w-full sm:max-w-[50%] p-4 bg-opacity-80 bg-gray-200 focus:outline-none focus:border-transparent rounded-bl-xl"
            value={inputMessage}
            placeholder={isChatting ? 'Running please wait...' : 'Ask Cody anything...'}
            onChange={(event) => setInputMessage(event.target.value)}
            autoFocus
            onKeyUp={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                void handleSubmit();
              }
            }}
            disabled={isTextAreaDisabled}
          />
          <div
            className={'px-2 py-4 h-full max-w-full sm:max-w-[50%] overflow-auto flex-1'}
            suppressHydrationWarning={true}
          >
            {StateMap[appState]}
          </div>
        </div>
      </div>
    </div>
  );
}

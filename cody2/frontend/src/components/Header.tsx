import { Key } from 'lucide-react';

type Props = {
  setSelectedModel: (value: string) => void;
  selectedModel: string;
  setApiKeysState: () => void;
  localKey: string;
};
export default function Header({ localKey, selectedModel, setSelectedModel, setApiKeysState }: Props) {
  return (
    <div className={'grainy-header w-full p-4 grid grid-cols-3 rounded-t-xl border-b-[1px] border-gray-400'}>
      <a
        href={'https://montelo.ai'}
        target={'_blank'}
        rel="noopener noreferrer"
        className={'flex w-fit flex-row gap-1 items-center hover:opacity-85'}
      >
        <img src={'/MonteloLogo.svg'} alt={'MonteloAI Logo'} className={'h-6'} />
        <p>MonteloAI</p>
      </a>

      <p className="text-center">Cody</p>

      <div className={'flex gap-4 justify-end items-center'}>
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
          className={'flex flex-row gap-1 cursor-pointer hover:text-gray-500 items-center text-sm italic'}
          onClick={setApiKeysState}
        >
          {localKey === '' ? <p className={'text-sm italic'}>Set API Key First</p> : null}
          <Key />
        </div>
      </div>
    </div>
  );
}

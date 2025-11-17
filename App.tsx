import React, { useState } from 'react';
import EmailPanel from './components/EmailPanel';
import CoinsPanel from './components/CoinsPanel';
import EntryPanel from './components/EntryPanel';
import ExitPanel from './components/ExitPanel';
import { ALL_COINS } from './constants';

type Tab = 'E-mail' | 'Moedas' | 'Entrada' | 'Saída';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Entrada');
  const [coins, setCoins] = useState<string[]>(ALL_COINS);

  const tabs: Tab[] = ['E-mail', 'Moedas', 'Entrada', 'Saída'];

  const renderContent = () => {
    switch (activeTab) {
      case 'E-mail':
        return <EmailPanel />;
      case 'Moedas':
        return <CoinsPanel coins={coins} setCoins={setCoins} />;
      case 'Entrada':
        return <EntryPanel coins={coins} />;
      case 'Saída':
        return <ExitPanel coins={coins} setCoins={setCoins} />;
      default:
        return <EntryPanel coins={coins} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-[#ff7b1b] mb-6">AUTOTRADER</h1>
        <nav className="flex border-b border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium transition-colors duration-200 ease-in-out whitespace-nowrap
                ${
                  activeTab === tab
                    ? 'text-[#ff7b1b] border-b-2 border-[#ff7b1b]'
                    : 'text-[#e7edf3] hover:text-[#ff7b1b]'
                }
              `}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>
      <main className="flex-grow flex items-start justify-center">
        <div className="w-full">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

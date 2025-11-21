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
        return <EntryPanel />;
      case 'Saída':
        return <ExitPanel coins={coins} />;
      default:
        return <EntryPanel />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#001326] text-white flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#ff7b1b] mb-4">
            AUTOTRADER
          </h1>

          <nav className="flex border-b border-slate-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-colors duration-200 whitespace-nowrap
                  ${
                    activeTab === tab
                      ? 'text-[#ff7b1b] border-b-2 border-[#ff7b1b]'
                      : 'text-[#e7edf3] hover:text-[#ff7b1b]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <main className="pb-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;

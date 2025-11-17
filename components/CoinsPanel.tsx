import React, { useState, useMemo } from 'react';

interface CoinsPanelProps {
  coins: string[];
  setCoins: React.Dispatch<React.SetStateAction<string[]>>;
}

const CoinsPanel: React.FC<CoinsPanelProps> = ({ coins, setCoins }) => {
  const [newCoinInput, setNewCoinInput] = useState('');
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set(['ALGO']));

  const handleAddCoins = () => {
    const newCoins = newCoinInput
      .split(/[\s,]+/)
      .map(c => c.trim().toUpperCase())
      .filter(c => c && !coins.includes(c));

    if (newCoins.length > 0) {
      setCoins(prevCoins => [...prevCoins, ...newCoins].sort());
      setNewCoinInput('');
    }
  };

  const handleRemoveSelected = () => {
    setCoins(prevCoins => prevCoins.filter(c => !selectedCoins.has(c)));
    setSelectedCoins(new Set());
  };

  const toggleSelection = (coin: string) => {
    setSelectedCoins(prevSelected => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(coin)) {
        newSelection.delete(coin);
      } else {
        newSelection.add(coin);
      }
      return newSelection;
    });
  };
  
  const sortedCoins = useMemo(() => [...coins].sort(), [coins]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-lg bg-[#0a202c] border border-gray-700">
      <h2 className="text-2xl font-bold text-[#ff7b1b] mb-8 text-left">PAINEL DE MOEDAS</h2>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-x-4 mb-6">
          <label htmlFor="new-coin" className="text-nowrap text-lg text-[#ff7b1b]">Nova:</label>
          <input
              id="new-coin"
              type="text"
              value={newCoinInput}
              onChange={(e) => setNewCoinInput(e.target.value)}
              placeholder="ex.: BTC, ETH, SOL"
              className="w-64 bg-[#1e3a4c] text-[#e7edf3] border border-gray-600 rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
          />
          <button
              onClick={handleAddCoins}
              className="px-6 py-2 bg-[#1e3a4c] text-[#ff7b1b] font-semibold rounded-md border border-[#ff7b1b] hover:bg-[#ff7b1b] hover:text-white transition-colors duration-200"
          >
              Adicionar
          </button>
        </div>

        <div className="flex items-start gap-x-8">
          <div className="flex flex-col">
              <div className="bg-[#0b2533] border-2 border-[#ff7b1b] rounded-md h-80 w-48 overflow-y-auto p-1">
                  {sortedCoins.map(coin => (
                      <div
                          key={coin}
                          onClick={() => toggleSelection(coin)}
                          className={`px-3 py-1 rounded cursor-pointer
                              ${selectedCoins.has(coin) ? 'bg-[#3b82f6] bg-opacity-75 text-white' : 'hover:bg-[#1e3a4c]'}`
                          }
                      >
                          {coin}
                      </div>
                  ))}
              </div>
              <p className="mt-2 text-sm text-gray-300">
                  Total: {coins.length} pares (ordem alfabética)
              </p>
          </div>
          
          <button
              onClick={handleRemoveSelected}
              disabled={selectedCoins.size === 0}
              className="px-6 py-2 bg-[#1e3a4c] text-[#ff7b1b] font-semibold rounded-md border border-[#ff7b1b] hover:bg-[#ff7b1b] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Remover selecionadas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinsPanel;
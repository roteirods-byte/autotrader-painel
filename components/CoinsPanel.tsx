import React, { useState } from 'react';

interface CoinsPanelProps {
  coins: string[];
  setCoins: (coins: string[]) => void;
}

const CoinsPanel: React.FC<CoinsPanelProps> = ({ coins, setCoins }) => {
  const [newCoinsText, setNewCoinsText] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const sortedCoins = [...coins].sort();

  const handleAdd = () => {
    if (!newCoinsText.trim()) return;

    const parts = newCoinsText
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    if (!parts.length) return;

    const merged = Array.from(new Set([...coins, ...parts])).sort();
    setCoins(merged);
    setNewCoinsText('');
  };

  const handleToggle = (coin: string) => {
    setSelected((prev) => ({ ...prev, [coin]: !prev[coin] }));
  };

  const handleRemoveSelected = () => {
    const toRemove = new Set(
      Object.entries(selected)
        .filter(([, value]) => value)
        .map(([key]) => key),
    );

    if (!toRemove.size) return;

    const remaining = coins.filter((c) => !toRemove.has(c));
    setCoins(remaining);
    setSelected({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-sm sm:text-base">
      <h2 className="text-2xl font-semibold text-[#ff7b1b] mb-4">
        PAINEL DE MOEDAS
      </h2>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-white mr-2">
          Nova(s):{' '}
          <input
            type="text"
            value={newCoinsText}
            onChange={(e) => setNewCoinsText(e.target.value)}
            placeholder="ex.: BTC, ETH, SOL"
            className="px-2 py-1 text-black text-sm w-64"
          />
        </label>
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-[#1d4ed8] text-white text-sm"
        >
          Adicionar
        </button>
      </div>

      <div className="border border-gray-700 p-3 max-h-[420px] overflow-y-auto bg-[#020617]">
        <ul className="space-y-1">
          {sortedCoins.map((coin) => (
            <li key={coin} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selected[coin]}
                onChange={() => handleToggle(coin)}
              />
              <span className="text-white">{coin}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <span className="text-white">
          Total: {sortedCoins.length} pares (ordem alfabética)
        </span>
        <button
          onClick={handleRemoveSelected}
          className="px-3 py-1 bg-[#7f1d1d] text-white text-sm"
        >
          Remover selecionadas
        </button>
      </div>
    </div>
  );
};

export default CoinsPanel;

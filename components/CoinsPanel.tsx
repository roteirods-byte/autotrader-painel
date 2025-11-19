// components/CoinsPanel.tsx
import React, { useState, useEffect } from 'react';

interface CoinsPanelProps {
  coins: string[];
  setCoins: React.Dispatch<React.SetStateAction<string[]>>;
}

const CoinsPanel: React.FC<CoinsPanelProps> = ({ coins, setCoins }) => {
  const [newCoins, setNewCoins] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Mantém seleção somente para moedas que ainda existem
  useEffect(() => {
    setSelected((prev) => {
      const next: Record<string, boolean> = {};
      coins.forEach((c) => {
        if (prev[c]) next[c] = true;
      });
      return next;
    });
  }, [coins]);

  const handleAdd = () => {
    if (!newCoins.trim()) return;

    const parsed = newCoins
      .split(/[,\s]+/)
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length > 0);

    if (parsed.length === 0) return;

    const current = new Set(coins);
    parsed.forEach((c) => current.add(c));

    const updated = Array.from(current).sort();
    setCoins(updated);
    setNewCoins('');
  };

  const handleToggle = (coin: string) => {
    setSelected((prev) => ({
      ...prev,
      [coin]: !prev[coin],
    }));
  };

  const handleRemoveSelected = () => {
    const remaining = coins.filter((c) => !selected[c]);
    setCoins(remaining);
    setSelected({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#081f2c] border border-gray-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-[#ff7b1b] mb-6">PAINEL DE MOEDAS</h2>

      {/* Linha de entrada */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-sm font-semibold text-[#ff7b1b]">Nova(s):</span>
        <input
          type="text"
          value={newCoins}
          onChange={(e) => setNewCoins(e.target.value)}
          placeholder="ex: BTC, ETH, SOL"
          className="h-9 w-64 px-3 text-sm rounded-md bg-[#0b2533] border border-gray-600 text-[#e7edf3] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="h-9 px-4 text-sm font-semibold rounded-md bg-[#0b2533] text-[#ff7b1b] border border-[#ff7b1b] hover:bg-[#102b3a] transition"
        >
          Adicionar
        </button>
      </div>

      {/* Caixa de lista de moedas */}
      <div className="mt-2">
        <div className="rounded-lg border border-gray-700 bg-[#020f1a] px-3 py-2 max-h-64 overflow-y-auto w-full md:w-[460px]">
          {coins.map((coin) => (
            <label
              key={coin}
              className="flex items-center gap-2 text-sm text-[#e7edf3] py-0.5"
            >
              <input
                type="checkbox"
                checked={!!selected[coin]}
                onChange={() => handleToggle(coin)}
                className="accent-[#ff7b1b]"
              />
              <span>{coin}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between mt-2 w-full md:w-[460px]">
          <span className="text-xs text-gray-300">
            Total:{' '}
            <span className="text-[#ff7b1b] font-semibold">
              {coins.length} pares
            </span>{' '}
            (ordem alfabética)
          </span>

          <button
            type="button"
            onClick={handleRemoveSelected}
            className="h-8 px-4 text-xs sm:text-sm font-semibold rounded-md bg-[#0b2533] text-[#ff7b1b] border border-[#ff7b1b] hover:bg-[#102b3a] transition"
          >
            Remover selecionadas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinsPanel;

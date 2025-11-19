import React, { useState } from 'react';

interface CoinsPanelProps {
  coins: string[];
  setCoins: (coins: string[]) => void;
}

const CoinsPanel: React.FC<CoinsPanelProps> = ({ coins, setCoins }) => {
  const [newCoinsInput, setNewCoinsInput] = useState('');
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);

  const handleAddCoins = () => {
    const parsed = newCoinsInput
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length > 0);

    if (parsed.length === 0) return;

    const merged = Array.from(new Set([...coins, ...parsed]));
    merged.sort();
    setCoins(merged);
    setNewCoinsInput('');
  };

  const toggleSelectCoin = (coin: string) => {
    setSelectedCoins((prev) =>
      prev.includes(coin)
        ? prev.filter((c) => c !== coin)
        : [...prev, coin]
    );
  };

  const handleRemoveSelected = () => {
    if (selectedCoins.length === 0) return;
    const remaining = coins.filter((c) => !selectedCoins.includes(c));
    setCoins(remaining);
    setSelectedCoins([]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#ff7b1b] mb-6">PAINEL DE MOEDAS</h2>

      <div className="bg-[#0b2533] rounded-xl border border-gray-700 p-6 sm:p-8">
        {/* Linha de entrada de novas moedas */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex flex-col md:flex-1 max-w-xs">
            <label className="mb-2 text-sm font-semibold text-[#ff7b1b]">
              Nova(s):
            </label>
            <input
              type="text"
              value={newCoinsInput}
              onChange={(e) => setNewCoinsInput(e.target.value)}
              placeholder="ex.: BTC, ETH, SOL"
              className="w-full rounded-md bg-[#1e3a4c] border border-gray-600 px-4 py-2 text-sm text-[#e7edf3] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
            />
          </div>

          <button
            type="button"
            onClick={handleAddCoins}
            className="h-[38px] px-6 rounded-md bg-[#ff7b1b] text-sm font-semibold text-[#0b2533] self-start md:self-auto hover:bg-[#ffa24d] transition-colors"
          >
            Adicionar
          </button>
        </div>

        {/* Lista de moedas */}
        <div className="bg-[#0b2533] rounded-md border border-gray-700 max-h-72 overflow-y-auto px-4 py-3">
          {coins.length === 0 ? (
            <p className="text-sm text-gray-300">Nenhuma moeda cadastrada.</p>
          ) : (
            <ul className="space-y-1 text-sm text-[#e7edf3]">
              {coins.map((coin) => (
                <li key={coin} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCoins.includes(coin)}
                    onChange={() => toggleSelectCoin(coin)}
                    className="accent-[#ff7b1b]"
                  />
                  <span>{coin}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rodapé: total + botão remover */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-[#ff7b1b]">
            Total: {coins.length} pares (ordem alfabética)
          </span>

          <button
            type="button"
            onClick={handleRemoveSelected}
            className="px-4 py-2 rounded-md bg-red-600 text-xs sm:text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-40"
            disabled={selectedCoins.length === 0}
          >
            Remover selecionadas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinsPanel;

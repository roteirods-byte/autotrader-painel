import React, { useCallback, useEffect, useState } from 'react';
import { EntryData } from '../types';
import { getSwingData, getPosicionalData } from '../api/mock';

interface EntryPanelProps {
  coins: string[];
}

// URL do backend da automação (Python).
// Ex.: VITE_BACKEND_URL="https://seu-backend.com"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;

const EntryPanel: React.FC<EntryPanelProps> = ({ coins }) => {
  const [swingData, setSwingData] = useState<EntryData[]>([]);
  const [posicionalData, setPosicionalData] = useState<EntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Filtra pelas moedas cadastradas no painel MOEDAS
  const filterByCoins = useCallback(
    (data: EntryData[]) => data.filter((d) => coins.includes(d.par)),
    [coins]
  );

  // Carrega dados de exemplo (mock) – usado como fallback
  const loadFromMock = useCallback(() => {
    const initialSwing = filterByCoins(getSwingData());
    const initialPosicional = filterByCoins(getPosicionalData());
    setSwingData(initialSwing);
    setPosicionalData(initialPosicional);
    setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
  }, [filterByCoins]);

  // Busca dados no backend da automação
  const fetchAndUpdateData = useCallback(async () => {
    setError('');
    setLoading(true);

    // Se backend não estiver configurado, usa apenas mock
    if (!BACKEND_URL || BACKEND_URL.length < 5) {
      loadFromMock();
      setError(
        'AVISO: backend da automação (VITE_BACKEND_URL) não está configurado. Exibindo dados de exemplo.'
      );
      setLoading(false);
      return;
    }

    try {
      const url = `${BACKEND_URL.replace(/\/$/, '')}/entrada`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      const swing: EntryData[] = Array.isArray(json.swing) ? json.swing : [];
      const posicional: EntryData[] = Array.isArray(json.posicional)
        ? json.posicional
        : [];

      if (!swing.length && !posicional.length) {
        throw new Error('Resposta da automação vazia ou em formato inesperado.');
      }

      setSwingData(filterByCoins(swing));
      setPosicionalData(filterByCoins(posicional));
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
    } catch (e) {
      console.error('Erro ao buscar dados de entrada:', e);
      loadFromMock();
      let msg = 'Falha ao conectar na automação. Exibindo dados de exemplo.';
      if (e instanceof Error) {
        msg = `Falha ao conectar na automação: ${e.message}. Exibindo dados de exemplo.`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filterByCoins, loadFromMock]);

  // Atualiza na carga da página e a cada 10 minutos
  useEffect(() => {
    fetchAndUpdateData();

    const intervalId = setInterval(fetchAndUpdateData, 10 * 60 * 1000); // 10 min
    return () => clearInterval(intervalId);
  }, [fetchAndUpdateData]);

  const renderTable = (title: string, data: EntryData[]) => (
    <div className="w-full">
      <h3 className="text-xl font-bold text-[#ff7b1b] mb-4 text-center">
        {title}
      </h3>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full bg-[#0b2533] text-sm text-left text-[#e7edf3]">
          <thead className="bg-[#1e3a4c] text-xs uppercase text-[#ff7b1b]">
            <tr>
              <th scope="col" className="px-4 py-3 w-[60px]">
                PAR
              </th>
              <th scope="col" className="px-4 py-3 w-[120px]">
                SINAL
              </th>
              <th scope="col" className="px-4 py-3 w-[100px]">
                PREÇO
              </th>
              <th scope="col" className="px-4 py-3 w-[100px]">
                ALVO
              </th>
              <th scope="col" className="px-4 py-3 w-[80px]">
                GANHO%
              </th>
              <th scope="col" className="px-4 py-3 w-[80px]">
                ASSERT%
              </th>
              <th scope="col" className="px-4 py-3 w-[100px]">
                DATA
              </th>
              <th scope="col" className="px-4 py-3 w-[96px]">
                HORA
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr
                key={index}
                className="border-t border-gray-700 hover:bg-[#1e3a4c]"
              >
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  {entry.par}
                </td>
                <td
                  className={`px-4 py-2 font-bold ${
                    entry.sinal === 'LONG'
                      ? 'text-green-400'
                      : entry.sinal === 'SHORT'
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {entry.sinal}
                </td>
                <td className="px-4 py-2 font-semibold text-yellow-300">
                  {entry.preco.toFixed(4)}
                </td>
                <td className="px-4 py-2">{entry.alvo.toFixed(4)}</td>
                <td
                  className={`px-4 py-2 ${
                    entry.ganho > 0 ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {entry.ganho.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  {entry.assert_pct.toFixed(2)}
                </td>
                <td className="px-4 py-2">{entry.data}</td>
                <td className="px-4 py-2">{entry.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading && swingData.length === 0 && posicionalData.length === 0) {
    return (
      <div className="text-center text-lg text-gray-300">
        Carregando dados de entrada...
      </div>
    );
  }

  if (error && swingData.length === 0 && posicionalData.length === 0) {
    return (
      <p className="text-center text-red-400 bg-red-900 bg-opacity-30 p-3 rounded-md mb-4">
        {error}
      </p>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <p className="text-center text-yellow-300 bg-yellow-900 bg-opacity-20 p-3 rounded-md mb-4 text-sm">
          {error}
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {renderTable('ENTRADA 4H - SWING', swingData)}
        {renderTable('ENTRADA 1H - POSICIONAL', posicionalData)}
      </div>

      {lastUpdated && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Dados atualizados às: {lastUpdated}
        </p>
      )}
    </div>
  );
};

export default EntryPanel;

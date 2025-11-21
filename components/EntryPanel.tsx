import React, { useEffect, useState } from 'react';

type EntryData = {
  par: string;
  sinal: string;
  preco: number;
  alvo: number;
  ganho: number;      // ganho em %
  assert_pct: number; // assertividade em %
  data: string;
  hora: string;
};

type EntradaResponse = {
  swing: EntryData[];
  posicional: EntryData[];
};

async function carregarEntrada(): Promise<EntradaResponse> {
  const resp = await fetch('/api/entrada');

  if (!resp.ok) {
    throw new Error(`Erro ao buscar /api/entrada: ${resp.status} ${resp.statusText}`);
  }

  const json = await resp.json();

  const normalizar = (item: any): EntryData => ({
    par: String(item.par ?? ''),
    sinal: String(item.sinal ?? ''),
    preco: Number(item.preco ?? 0),
    alvo: Number(item.alvo ?? 0),
    ganho: Number(item.ganho_pct ?? item.ganho ?? 0),
    assert_pct: Number(item.assert_pct ?? 0),
    data: String(item.data ?? ''),
    hora: String(item.hora ?? ''),
  });

  const swing = Array.isArray(json.swing) ? json.swing.map(normalizar) : [];
  const posicional = Array.isArray(json.posicional) ? json.posicional.map(normalizar) : [];

  swing.sort((a, b) => a.par.localeCompare(b.par));
  posicional.sort((a, b) => a.par.localeCompare(b.par));

  return { swing, posicional };
}

type TabelaProps = {
  titulo: string;
  dados: EntryData[];
};

const TabelaEntrada: React.FC<TabelaProps> = ({ titulo, dados }) => {
  return (
    <div className="bg-[#002238] rounded-2xl p-3 shadow-lg text-xs">
      <h2 className="text-orange-400 font-semibold mb-2">{titulo}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-orange-300 border-b border-slate-600">
            <th className="px-1 py-1 text-left w-[60px]">PAR</th>
            <th className="px-1 py-1 text-center w-[120px]">SINAL</th>
            <th className="px-1 py-1 text-right w-[100px]">PREÇO</th>
            <th className="px-1 py-1 text-right w-[100px]">ALVO</th>
            <th className="px-1 py-1 text-right w-[80px]">GANHO %</th>
            <th className="px-1 py-1 text-right w-[80px]">ASSERT %</th>
            <th className="px-1 py-1 text-center w-[100px]">DATA</th>
            <th className="px-1 py-1 text-center w-[96px]">HORA</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((linha, idx) => {
            const sinalUpper = (linha.sinal || '').toUpperCase();
            const isLong = sinalUpper === 'LONG';
            const isShort = sinalUpper === 'SHORT';

            const sinalClass = isLong
              ? 'text-green-400 font-semibold'
              : isShort
              ? 'text-red-400 font-semibold'
              : 'text-slate-100';

            const ganhoColor =
              linha.ganho > 0 ? 'text-green-400' : linha.ganho < 0 ? 'text-red-400' : 'text-slate-100';

            return (
              <tr
                key={`${linha.par}-${idx}`}
                className="border-b border-slate-700 last:border-0 text-[11px]"
              >
                <td className="px-1 py-1 text-left">{linha.par}</td>
                <td className={`px-1 py-1 text-center ${sinalClass}`}>{sinalUpper}</td>
                <td className="px-1 py-1 text-right">
                  {linha.preco.toFixed(3)}
                </td>
                <td className="px-1 py-1 text-right">
                  {linha.alvo.toFixed(3)}
                </td>
                <td className={`px-1 py-1 text-right ${ganhoColor}`}>
                  {linha.ganho.toFixed(2)}
                </td>
                <td className="px-1 py-1 text-right">
                  {linha.assert_pct.toFixed(2)}
                </td>
                <td className="px-1 py-1 text-center">{linha.data}</td>
                <td className="px-1 py-1 text-center">{linha.hora}</td>
              </tr>
            );
          })}

          {dados.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-2 py-4 text-center text-slate-400 italic"
              >
                Nenhum sinal disponível.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const EntryPanel: React.FC = () => {
  const [swing, setSwing] = useState<EntryData[]>([]);
  const [posicional, setPosicional] = useState<EntryData[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const atualizar = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await carregarEntrada();
      setSwing(dados.swing);
      setPosicional(dados.posicional);
    } catch (e: any) {
      console.error(e);
      setErro(e?.message ?? 'Erro ao carregar os dados de entrada.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    atualizar();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-orange-400">
          MONITORAMENTO DE ENTRADA
        </h2>
        <button
          onClick={atualizar}
          className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold"
        >
          ATUALIZAR
        </button>
      </div>

      {carregando && (
        <div className="mb-3 text-xs text-slate-300">Carregando dados...</div>
      )}

      {erro && (
        <div className="mb-3 text-xs text-red-400">
          Erro: {erro}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TabelaEntrada titulo="ENTRADA 4H – SWING" dados={swing} />
        <TabelaEntrada titulo="ENTRADA 1D – POSICIONAL" dados={posicional} />
      </div>
    </div>
  );
};

export default EntryPanel;

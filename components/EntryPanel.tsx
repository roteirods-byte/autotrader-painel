import React, { useEffect, useState } from 'react';

type EntryData = {
  par: string;
  sinal: string;
  preco: number;
  alvo: number;
  ganho: number;
  assert_pct: number;
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
            <th className="px-1 py-1 text-left">PAR</th>
            <th className="px-1 py-1 text-center">SINAL</th>
            <th className="px-1 py-1 text-center">DATA</th>
            <th className="px-1 py-1 text-center">HORA</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((linha, idx) => {
            const sinalClass =
              linha.sinal === 'LONG'
                ? 'text-green-400'
                : linha.sinal === 'SHORT'
                ? 'text-red-400'
                : '';

            return (
              <tr key={`${linha.par}-${idx}`} className="border-b border-slate-700 last:border-b-0">
                <td className="px-1 py-0.5">{linha.par}</td>
                <td className={`px-1 py-0.5 text-center font-semibold ${sinalClass}`}>{linha.sinal}</td>
                <td className="px-1 py-0.5 text-center">{linha.data || '--'}</td>
                <td className="px-1 py-0.5 text-center">{linha.hora || '--'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const EntryPanel: React.FC = () => {
  const [swing, setSwing] = useState<EntryData[]>([]);
  const [posicional, setPosicional] = useState<EntryData[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [horaAtualizacao, setHoraAtualizacao] = useState<string>('');

  useEffect(() => {
    const buscar = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const { swing, posicional } = await carregarEntrada();
        setSwing(swing);
        setPosicional(posicional);

        const agora = new Date();
        const hh = String(agora.getHours()).padStart(2, '0');
        const mm = String(agora.getMinutes()).padStart(2, '0');
        const ss = String(agora.getSeconds()).padStart(2, '0');
        setHoraAtualizacao(`${hh}:${mm}:${ss}`);
      } catch (e: any) {
        console.error(e);
        setErro(e.message ?? 'Erro ao carregar dados de entrada.');
      } finally {
        setCarregando(false);
      }
    };

    buscar();
  }, []);

  return (
    <div className="min-h-screen bg-[#001529] text-white p-4">
      <h1 className="text-lg font-semibold text-orange-400 mb-3">PAINEL ENTRADA</h1>

      <div className="text-xs mb-3">
        {horaAtualizacao && (
          <span>Dados atualizados às: {horaAtualizacao}</span>
        )}
        {carregando && <span className="ml-2">Carregando...</span>}
      </div>

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

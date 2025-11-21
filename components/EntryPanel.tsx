import React, { useEffect, useState } from "react";

type EntradaItem = {
  par: string;
  sinal: "LONG" | "SHORT";
  preco: number;
  alvo: number;
  ganho_pct: number;
  assert_pct: number;
  data: string;
  hora: string;
};

type EntradaResponse = {
  swing: EntradaItem[];
  posicional: EntradaItem[];
};

async function fetchEntrada(): Promise<EntradaResponse> {
  const resp = await fetch("/api/entrada");
  if (!resp.ok) {
    throw new Error(`Erro ao buscar /api/entrada: ${resp.status}`);
  }
  return resp.json();
}

function formatNumber(
  value: number,
  decimals: number,
  suffix: string | null = null
): string {
  const fmt = value.toFixed(decimals).replace(".", ",");
  return suffix ? `${fmt}${suffix}` : fmt;
}

function cellSignal(value: string) {
  const base = "font-semibold";
  if (value === "LONG") return <span className={`${base} text-green-400`}>LONG</span>;
  if (value === "SHORT") return <span className={`${base} text-red-400`}>SHORT</span>;
  return <span className={base}>{value}</span>;
}

function cellPercent(value: number) {
  const cls =
    value >= 0 ? "text-green-400 font-semibold" : "text-red-400 font-semibold";
  return <span className={cls}>{formatNumber(value, 2, "%")}</span>;
}

interface TableProps {
  titulo: string;
  dados: EntradaItem[];
}

const EntradaTable: React.FC<TableProps> = ({ titulo, dados }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 w-full">
      <h2 className="text-orange-400 font-semibold mb-2 text-sm">{titulo}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-100">
          <thead className="text-[11px] uppercase text-orange-400 border-b border-slate-700">
            <tr>
              <th className="px-2 py-1">PAR</th>
              <th className="px-2 py-1">SINAL</th>
              <th className="px-2 py-1 text-right">PREÇO</th>
              <th className="px-2 py-1 text-right">ALVO</th>
              <th className="px-2 py-1 text-right">GANHO %</th>
              <th className="px-2 py-1 text-right">ASSERT %</th>
              <th className="px-2 py-1 text-center">DATA</th>
              <th className="px-2 py-1 text-center">HORA</th>
            </tr>
          </thead>
          <tbody>
            {dados.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-2 py-3 text-center text-slate-400 italic"
                >
                  Nenhum sinal disponível.
                </td>
              </tr>
            ) : (
              dados.map((row) => (
                <tr
                  key={`${row.par}-${row.data}-${row.hora}`}
                  className="border-b border-slate-800 last:border-0"
                >
                  <td className="px-2 py-1 font-semibold text-slate-100">
                    {row.par}
                  </td>
                  <td className="px-2 py-1">{cellSignal(row.sinal)}</td>
                  <td className="px-2 py-1 text-right">
                    {formatNumber(row.preco, 3)}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {formatNumber(row.alvo, 3)}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {cellPercent(row.ganho_pct)}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {formatNumber(row.assert_pct, 2, "%")}
                  </td>
                  <td className="px-2 py-1 text-center">{row.data}</td>
                  <td className="px-2 py-1 text-center">{row.hora}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EntryPanel: React.FC = () => {
  const [dados, setDados] = useState<EntradaResponse | null>(null);
  const [status, setStatus] = useState<"carregando" | "ok" | "erro">(
    "carregando"
  );
  const [mensagemErro, setMensagemErro] = useState<string>("");

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        setStatus("carregando");
        const data = await fetchEntrada();
        if (!cancelado) {
          setDados(data);
          setStatus("ok");
        }
      } catch (err) {
        console.error(err);
        if (!cancelado) {
          setStatus("erro");
          setMensagemErro(String(err));
        }
      }
    }

    carregar();
    const id = setInterval(carregar, 60_000); // atualiza a cada 1min

    return () => {
      cancelado = True;
      clearInterval(id);
    };
  }, []);

  const agora = new Date();
  const horaPainel = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="px-6 py-6 text-slate-100">
      <h1 className="text-orange-400 text-lg font-bold mb-1">PAINEL ENTRADA</h1>
      <p className="text-xs text-slate-300 mb-4">
        Dados atualizados às: {horaPainel}
      </p>

      {status === "carregando" && (
        <p className="text-xs text-slate-300 mb-3">Carregando sinais...</p>
      )}

      {status === "erro" && (
        <p className="text-xs text-red-400 mb-3">
          Erro ao buscar /api/entrada: {mensagemErro}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EntradaTable
          titulo="ENTRADA 4H – SWING"
          dados={dados?.swing ?? []}
        />
        <EntradaTable
          titulo="ENTRADA 1D – POSICIONAL"
          dados={dados?.posicional ?? []}
        />
      </div>
    </div>
  );
};

export default EntryPanel;

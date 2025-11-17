import React, { useState, useEffect, useCallback } from 'react';
import { ExitData } from '../types';
import { getExitData, addExitData, removeExitData } from '../api/mock';

interface ExitPanelProps {
  coins: string[];
  setCoins: React.Dispatch<React.SetStateAction<string[]>>;
}

const ExitPanel: React.FC<ExitPanelProps> = ({ coins }) => {
  const [exitData, setExitData] = useState<ExitData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newOp, setNewOp] = useState({
    par: coins[0] || 'BTC',
    side: 'LONG' as 'LONG' | 'SHORT',
    modo: 'SWING',
    entrada: '',
    alav: '5',
    gain_pct: '2',
    stop_pct: '1',
  });

  const fetchExitData = useCallback(() => {
    setExitData(getExitData());
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetchExitData();
      setLoading(false);
    }, 300);
  }, [fetchExitData]);

  useEffect(() => {
    const interval = setInterval(() => {
      let alertInfo: ExitData | null = null;
      setExitData(prevData => {
        const newData = prevData.map(d => {
          if (d.situacao !== 'ABERTA') return d;
          
          const priceChange = (Math.random() - 0.5) * d.entrada * 0.01;
          const newPrice = d.precoAtual + priceChange;
          
          const pnl = d.side === 'LONG'
            ? ((newPrice - d.entrada) / d.entrada) * 100 * d.alav
            : ((d.entrada - newPrice) / d.entrada) * 100 * d.alav;

          let situacao = d.situacao;
          if ((d.side === 'LONG' && newPrice >= d.alvo) || (d.side === 'SHORT' && newPrice <= d.alvo)) {
              situacao = 'ALVO ATINGIDO';
              alertInfo = { ...d, precoAtual: newPrice, pnl, situacao };
          }
            
          return { ...d, precoAtual: newPrice, pnl, situacao };
        });
        
        if (alertInfo) {
            alert(`HORA DE SAIR: ${alertInfo.par} - PREÇO ATUAL ${alertInfo.precoAtual.toFixed(4)} - ALVO ${alertInfo.alvo.toFixed(4)} - PNL % ${alertInfo.pnl.toFixed(2)} - ${new Date().toLocaleDateString('pt-BR')} - ${new Date().toLocaleTimeString('pt-BR')}`);
        }
        
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const handleAddOperation = () => {
    const entradaNum = parseFloat(newOp.entrada);
    const gainPctNum = parseFloat(newOp.gain_pct);

    if (isNaN(entradaNum) || isNaN(gainPctNum)) {
        alert("Por favor, preencha os campos de entrada e ganho com valores numéricos.");
        return;
    }
    
    let alvo: number;
    if (newOp.side === 'LONG') {
        alvo = entradaNum * (1 + gainPctNum / 100);
    } else { // SHORT
        alvo = entradaNum * (1 - gainPctNum / 100);
    }

    const newOperation = {
      par: newOp.par,
      side: newOp.side,
      modo: newOp.modo,
      entrada: entradaNum,
      alav: parseInt(newOp.alav, 10),
      alvo: alvo,
    };
    
    addExitData(newOperation);
    fetchExitData();
  };

  const handleRemoveOperation = (id: number) => {
    removeExitData(id);
    fetchExitData();
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-300">Carregando dados de saída...</div>;
  }
  
  return (
    <div className="w-full space-y-8">
      <div className="p-6 rounded-lg bg-[#0a202c] border border-gray-700">
        <h3 className="text-xl font-bold text-[#ff7b1b] mb-6">MONITORAMENTO DE SAÍDA</h3>
        <div className="flex items-end gap-x-4 flex-wrap">
            <select value={newOp.par} onChange={e => setNewOp({...newOp, par: e.target.value})} className="bg-[#1e3a4c] border border-gray-600 rounded-md px-3 py-2">
                {coins.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={newOp.side} onChange={e => setNewOp({...newOp, side: e.target.value as 'LONG' | 'SHORT'})} className="bg-[#1e3a4c] border border-gray-600 rounded-md px-3 py-2">
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
            </select>
             <select value={newOp.modo} onChange={e => setNewOp({...newOp, modo: e.target.value})} className="bg-[#1e3a4c] border border-gray-600 rounded-md px-3 py-2">
                <option value="SWING">SWING</option>
                <option value="POSICIONAL">POSICIONAL</option>
            </select>
            <input type="number" placeholder="Entrada" value={newOp.entrada} onChange={e => setNewOp({...newOp, entrada: e.target.value})} className="w-28 bg-[#1e3a4c] border border-gray-600 rounded-md px-3 py-2" />
            <input type="number" placeholder="Gain %" value={newOp.gain_pct} onChange={e => setNewOp({...newOp, gain_pct: e.target.value})} className="w-24 bg-[#1e3a4c] border border-gray-600 rounded-md px-3 py-2" />
            <input type="number" placeholder="Stop %" value={newOp.stop_pct} onChange={e => setNewOp({...newOp, stop_pct: e.target.value})} className="w-24 bg-[#1e3a4c] border border-gray-600 rounded-md px-3 py-2" />
            <input type="number" placeholder="Alav" value={newOp.alav} onChange={e => setNewOp({...newOp, alav: e.target.value})} className="w-20 bg-[#1e3a4c] border border-gray-600 rounded-md px-3 py-2" />

            <button onClick={handleAddOperation} className="px-6 py-2 bg-[#1e3a4c] text-[#ff7b1b] font-semibold rounded-md border border-[#ff7b1b] hover:bg-[#ff7b1b] hover:text-white transition-colors duration-200">Adicionar Operação</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full bg-[#0b2533] text-sm text-left text-[#e7edf3]">
          <thead className="bg-[#1e3a4c] text-xs uppercase text-[#ff7b1b]">
            <tr>
              {[ 'PAR', 'SIDE', 'MODO', 'ENTRADA', 'ALVO', 'PREÇO ATUAL', 'PNL%', 'SITUAÇÃO', 'DATA', 'HORA', 'ALAV', 'EXCLUIR'].map(h => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {exitData.map((op) => (
              <tr key={op.id} className="border-t border-gray-700 hover:bg-[#1e3a4c]">
                <td className="px-4 py-2 font-medium">{op.par}</td>
                <td className={`px-4 py-2 font-bold ${op.side === 'LONG' ? 'text-green-400' : 'text-red-400'}`}>{op.side}</td>
                <td className="px-4 py-2">{op.modo}</td>
                <td className="px-4 py-2">{op.entrada.toFixed(4)}</td>
                <td className="px-4 py-2">{op.alvo.toFixed(4)}</td>
                <td className="px-4 py-2">{op.precoAtual.toFixed(4)}</td>
                <td className={`px-4 py-2 font-bold ${op.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{op.pnl.toFixed(2)}</td>
                <td className="px-4 py-2">{op.situacao}</td>
                <td className="px-4 py-2">{op.data}</td>
                <td className="px-4 py-2">{op.hora}</td>
                <td className="px-4 py-2">{op.alav}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleRemoveOperation(op.id)} className="px-3 py-1 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExitPanel;
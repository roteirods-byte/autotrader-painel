import { EntryData, ExitData } from '../types';

let nextId = 4;

let swingData: EntryData[] = [
    { par: "AAVE", sinal: "SHORT", preco: 33.008, alvo: 0, ganho: 0, assert_pct: 59.25, data: "2025-10-06", hora: "16:22" },
    { par: "ADA", sinal: "LONG", preco: 3.544, alvo: 20.647, ganho: 2.85, assert_pct: 55.64, data: "2025-10-06", hora: "20:38" },
    { par: "ALGO", sinal: "SHORT", preco: 93.033, alvo: 21.066, ganho: 7.6, assert_pct: 63.6, data: "2025-10-06", hora: "17:36" },
    { par: "APE", sinal: "SHORT", preco: 19.62, alvo: 3.381, ganho: 1.78, assert_pct: 58.86, data: "2025-10-06", hora: "09:43" },
    { par: "APT", sinal: "SHORT", preco: 17.211, alvo: 0, ganho: 0, assert_pct: 61.4, data: "2025-10-06", hora: "18:22" },
    { par: "ARB", sinal: "SHORT", preco: 21.482, alvo: 0.323, ganho: 5.62, assert_pct: 59.21, data: "2025-10-06", hora: "06:47" },
    { par: "ATOM", sinal: "SHORT", preco: 30.328, alvo: 30.463, ganho: 3.51, assert_pct: 62.92, data: "2025-10-06", hora: "06:37" },
    { par: "AVAX", sinal: "SHORT", preco: 82.77, alvo: 0, ganho: 0, assert_pct: 60.77, data: "2025-10-06", hora: "14:21" },
];

let posicionalData: EntryData[] = [
    { par: "FTM", sinal: "LONG", preco: 35.451, alvo: 70.787, ganho: 2.28, assert_pct: 56.65, data: "2025-10-06", hora: "20:54" },
    { par: "GALA", sinal: "SHORT", preco: 18.374, alvo: 43.717, ganho: 7.52, assert_pct: 64.18, data: "2025-10-06", hora: "17:56" },
    { par: "GRT", sinal: "SHORT", preco: 48.538, alvo: 37.555, ganho: 4.8, assert_pct: 62.2, data: "2025-10-06", hora: "05:19" },
    { par: "HBAR", sinal: "SHORT", preco: 77.298, alvo: 19.627, ganho: 5.47, assert_pct: 58.24, data: "2025-10-06", hora: "14:06" },
];


let exitData: ExitData[] = [
    { id: 1, par: "BTC", side: "SHORT", modo: "SWING", entrada: 1.22, alvo: 1.15, precoAtual: 1.23, pnl: -1.2, situacao: "ABERTA", data: "2025-09-26", hora: "09:03", alav: 50 },
    { id: 2, par: "SOL", side: "LONG", modo: "POSICIONAL", entrada: 4.202, alvo: 4.50, precoAtual: 4.15, pnl: -2.5, situacao: "ABERTA", data: "2025-09-26", hora: "09:04", alav: 125 },
];

export const getSwingData = () => swingData;
export const getPosicionalData = () => posicionalData;
export const getExitData = () => exitData;

export const addExitData = (newData: Omit<ExitData, 'id' | 'precoAtual' | 'pnl' | 'situacao' | 'data' | 'hora'>) => {
    const now = new Date();
    const newEntry: ExitData = {
        id: nextId++,
        precoAtual: newData.entrada,
        pnl: 0,
        situacao: 'ABERTA',
        data: now.toLocaleDateString('pt-BR'),
        hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        ...newData,
    };
    exitData = [newEntry, ...exitData];
    return newEntry;
};

export const removeExitData = (id: number) => {
    exitData = exitData.filter(d => d.id !== id);
    return true;
};
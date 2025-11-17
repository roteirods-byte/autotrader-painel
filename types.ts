export interface EntryData {
  par: string;
  sinal: 'NÃO ENTRAR' | 'LONG' | 'SHORT';
  preco: number;
  alvo: number;
  ganho: number;
  assert_pct: number;
  data: string;
  hora: string;
}

export interface ExitData {
  id: number;
  par: string;
  side: 'LONG' | 'SHORT';
  modo: string;
  entrada: number;
  alvo: number;
  precoAtual: number;
  pnl: number;
  situacao: string;
  data: string;
  hora: string;
  alav: number;
  gain_pct?: number;
  stop_pct?: number;
}
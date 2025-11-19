// Backend simples para o painel AUTOTRADER
// Lê a planilha da automação e devolve JSON para o painel de ENTRADA.

const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const PORT = process.env.BACKEND_PORT || 8080;
const SHEET_ID = process.env.SHEETS_SPREADSHEET_ID;

// Ajuste os ranges conforme o nome das abas da sua PLANILHA ENTRADA
const SWING_RANGE =
  process.env.SHEET_SWING_RANGE || 'ENTRADA 4H - SWING!A2:H';
const POSICIONAL_RANGE =
  process.env.SHEET_POSICIONAL_RANGE || 'ENTRADA 1H - POSICIONAL!A2:H';

const app = express();
app.use(cors());
app.use(express.json());

async function getSheetsClient() {
  if (!SHEET_ID) {
    throw new Error('SHEETS_SPREADSHEET_ID não configurado');
  }

  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function readRange(range) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  });
  return res.data.values || [];
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') return 0;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function mapRow(row) {
  const [par, sinal, preco, alvo, ganho, assert_pct, data, hora] = row;

  return {
    par: (par || '').toString().trim(),
    sinal: (sinal || '').toString().trim().toUpperCase(),
    preco: parseNumber(preco),
    alvo: parseNumber(alvo),
    ganho: parseNumber(ganho),
    assert_pct: parseNumber(assert_pct),
    data: (data || '').toString(),
    hora: (hora || '').toString(),
  };
}

// endpoint chamado pelo painel: /api/entrada  (via proxy do Vite)
app.get('/entrada', async (req, res) => {
  try {
    const [swingRows, posRows] = await Promise.all([
      readRange(SWING_RANGE),
      readRange(POSICIONAL_RANGE),
    ]);

    const swing = swingRows.map(mapRow);
    const posicional = posRows.map(mapRow);

    res.json({ swing, posicional });
  } catch (err) {
    console.error('Erro /entrada:', err);
    res
      .status(500)
      .json({ error: 'Erro ao ler a planilha de entrada', detail: String(err) });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend ouvindo em http://0.0.0.0:${PORT}`);
});

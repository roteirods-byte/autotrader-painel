// server.js
// Backend simples para o painel AUTOTRADER
// Lê o arquivo entrada.json gerado pela automação Python
// e devolve JSON para o painel de ENTRADA.

// CommonJS (para rodar fácil em Node comum)
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.BACKEND_PORT || 8080;

// Caminho do arquivo entrada.json
// Ex: ENT#RADA_JSON_PATH=/home/usuario/entrada.json
const DATA_FILE =
  process.env.ENTRADA_JSON_PATH || path.join(__dirname, 'entrada.json');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Lê e parseia o arquivo entrada.json.
 * Espera um formato assim:
 * {
 *   "swing": [...],
 *   "posicional": [...]
 * }
 */
function readEntradaJson() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Arquivo não encontrado: ${DATA_FILE}`);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const data = JSON.parse(raw);

  const swing = Array.isArray(data.swing) ? data.swing : [];
  const posicional = Array.isArray(data.posicional) ? data.posicional : [];

  return { swing, posicional };
}

// Endpoint principal consumido pelo painel
app.get('/entrada', (req, res) => {
  try {
    const { swing, posicional } = readEntradaJson();
    res.json({ swing, posicional });
  } catch (err) {
    console.error('Erro /entrada:', err);
    res
      .status(500)
      .json({ error: 'Erro ao ler entrada.json', detail: String(err) });
  }
});

// Endpoint simples de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok', file: DATA_FILE });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend ouvindo em http://0.0.0.0:${PORT}`);
  console.log(`Lendo dados de: ${DATA_FILE}`);
});

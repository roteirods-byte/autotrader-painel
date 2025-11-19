import React, { useEffect, useState } from 'react';

type StatusType = 'success' | 'error' | '';

interface EmailSettings {
  fromEmail: string;
  appPassword: string;
  toEmail: string;
}

const STORAGE_KEY = 'autotrader_email_settings_v1';

const EmailPanel: React.FC = () => {
  const [fromEmail, setFromEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<StatusType>('');

  // Carrega configurações salvas no navegador
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: EmailSettings = JSON.parse(raw);
        setFromEmail(saved.fromEmail || '');
        setAppPassword(saved.appPassword || '');
        setToEmail(saved.toEmail || '');
      }
    } catch (e) {
      console.error('Erro ao carregar configurações de e-mail:', e);
    }
  }, []);

  const handleTestAndSave = () => {
    setStatusMessage('');
    setStatusType('');

    if (!fromEmail.trim() || !appPassword.trim() || !toEmail.trim()) {
      setStatusMessage('Preencha todos os campos antes de salvar.');
      setStatusType('error');
      return;
    }

    const settings: EmailSettings = {
      fromEmail: fromEmail.trim(),
      appPassword: appPassword.trim(),
      toEmail: toEmail.trim(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setStatusMessage(
        'Configurações salvas no navegador. O envio real será feito pela automação do servidor quando estiver conectada.'
      );
      setStatusType('success');
    } catch (e) {
      console.error('Erro ao salvar configurações de e-mail:', e);
      setStatusMessage('Erro ao salvar as configurações no navegador.');
      setStatusType('error');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#ff7b1b] mb-6">E-MAIL</h2>

      <div className="bg-[#0b2533] rounded-xl border border-gray-700 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Principal (remetente) */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#ff7b1b]">
              Principal (remetente)
            </label>
            <input
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="seu-email@gmail.com"
              className="w-full rounded-md bg-[#1e3a4c] border border-gray-600 px-4 py-2 text-sm text-[#e7edf3] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
            />
          </div>

          {/* Senha (App Password) */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#ff7b1b]">
              Senha (App Password)
            </label>
            <input
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder="************"
              className="w-full rounded-md bg-[#1e3a4c] border border-gray-600 px-4 py-2 text-sm text-[#e7edf3] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
            />
          </div>

          {/* Envio (destinatário) */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#ff7b1b]">
              Envio (destinatário)
            </label>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="destino@email.com"
              className="w-full rounded-md bg-[#1e3a4c] border border-gray-600 px-4 py-2 text-sm text-[#e7edf3] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleTestAndSave}
            className="px-8 py-2 rounded-md bg-[#ff7b1b] text-sm font-semibold text-[#0b2533] hover:bg-[#ffa24d] transition-colors"
          >
            TESTAR/SALVAR
          </button>
        </div>

        {statusMessage && (
          <p
            className={`mt-6 text-sm text-center px-4 py-3 rounded-md ${
              statusType === 'success'
                ? 'bg-green-900 bg-opacity-70 text-green-300'
                : 'bg-red-900 bg-opacity-70 text-red-300'
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailPanel;

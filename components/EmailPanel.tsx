import React from 'react';

const EmailPanel: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 rounded-lg bg-[#0a202c] border border-gray-700">
      <h2 className="text-2xl font-bold text-[#ff7b1b] mb-8 text-left">E-MAIL</h2>
      <div className="flex items-end gap-x-[50px]">
        
        <div className="flex flex-col">
          <label htmlFor="principal" className="mb-2 text-sm text-[#ff7b1b]">Principal (remetente)</label>
          <input
            id="principal"
            type="email"
            placeholder="seu-email@gmail.com"
            className="w-[200px] bg-[#1e3a4c] text-[#e7edf3] border border-gray-600 rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="senha" className="mb-2 text-sm text-[#ff7b1b]">Senha (App Password)</label>
          <input
            id="senha"
            type="password"
            placeholder="****************"
            className="w-[200px] bg-[#1e3a4c] text-[#e7edf3] border border-gray-600 rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="envio" className="mb-2 text-sm text-[#ff7b1b]">Envio (destinatário)</label>
          <input
            id="envio"
            type="email"
            placeholder="destino@email.com"
            className="w-[200px] bg-[#1e3a4c] text-[#e7edf3] border border-gray-600 rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7b1b]"
          />
        </div>
        
        <button
          className="w-[200px] h-[42px] bg-[#1e3a4c] text-[#ff7b1b] font-bold rounded-md border border-[#ff7b1b] hover:bg-[#ff7b1b] hover:text-white transition-colors duration-200"
        >
          TESTAR/SALVAR
        </button>

      </div>
    </div>
  );
};

export default EmailPanel;
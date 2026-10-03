import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Lead } from '../types';
import { getWhatsAppUrl, WHATSAPP_FORMATTED_NUMBER } from '../config';

interface FloatingWhatsAppButtonProps {
  currentLead: Lead | null;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ currentLead }) => {
  const message = currentLead
    ? `Olá! Meu nome é ${currentLead.name} (${currentLead.phone}). Gostaria de um orçamento para serviço elétrico.`
    : 'Olá! Gostaria de falar com o eletricista para um orçamento.';

  const url = getWhatsAppUrl(message);

  return (
    <aside aria-label="Contato rápido por WhatsApp" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-emerald-300/30"
        title={`Chamar no WhatsApp: ${WHATSAPP_FORMATTED_NUMBER}`}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-100 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5 fill-slate-950" />
        <span className="text-xs sm:text-sm font-semibold tracking-wide">Falar no WhatsApp</span>
      </a>
    </aside>
  );
};

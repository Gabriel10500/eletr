import React, { useState } from 'react';
import { Zap, MessageSquare, Phone, User, Users, Menu, X, ShieldCheck, Mail } from 'lucide-react';
import { Lead } from '../types';
import { getWhatsAppUrl } from '../config';

interface NavbarProps {
  currentLead: Lead | null;
  onOpenLeadsManager: () => void;
  onEditLead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLead, onOpenLeadsManager, onEditLead }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getFirstName = (fullName: string) => {
    return fullName.trim().split(' ')[0] || 'Cliente';
  };

  const whatsappMessage = currentLead
    ? `Olá, meu nome é ${currentLead.name}. Gostaria de solicitar um orçamento para serviço elétrico.`
    : 'Olá! Gostaria de um orçamento para serviço elétrico.';

  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 1-row, 3-zone contract */}
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white font-display hover:text-amber-400 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400" />
            </span>
            <span>VoltPro Elétrica</span>
          </a>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#servicos" className="hover:text-amber-400 transition-colors">
              Serviços
            </a>
            <a href="#calculadora" className="hover:text-amber-400 transition-colors">
              Calculadora
            </a>
            <a href="#emergencia" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              Emergência 24h
            </a>
            <a href="#seguranca" className="hover:text-amber-400 transition-colors">
              Segurança NR-10
            </a>
            <a href="#avaliacoes" className="hover:text-amber-400 transition-colors">
              Avaliações
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden lg:flex items-center gap-3">
            {currentLead ? (
              <button
                onClick={onEditLead}
                title="Clique para alterar seus dados cadastrados"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:border-amber-500/60 hover:text-white transition-all whitespace-nowrap cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Olá, <strong className="text-white">{getFirstName(currentLead.name)}</strong></span>
                <span className="text-[10px] text-slate-400 font-mono">({currentLead.phone.slice(-4)})</span>
              </button>
            ) : null}

            <button
              onClick={onOpenLeadsManager}
              title="Painel de Clientes, Planilha e Notificações por E-mail"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Painel de Clientes</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {currentLead && (
              <button
                onClick={onEditLead}
                className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-medium"
              >
                {getFirstName(currentLead.name)}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm">
            <a
              href="#servicos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-900 text-slate-200"
            >
              Serviços Especializados
            </a>
            <a
              href="#calculadora"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-900 text-slate-200"
            >
              Calculadora de Orçamento
            </a>
            <a
              href="#emergencia"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-900 text-rose-400 font-medium flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Plantão Emergência 24 Horas
            </a>
            <a
              href="#seguranca"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-900 text-slate-200"
            >
              Normas e Certificações NR-10
            </a>
            <a
              href="#avaliacoes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-900 text-slate-200"
            >
              Avaliações de Clientes
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLeadsManager();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Painel de Contatos Capturados</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-950 bg-amber-500 rounded-lg shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Conversar pelo WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

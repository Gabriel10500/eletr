import React, { useState } from 'react';
import { Zap, ShieldCheck, PhoneCall, ArrowRight, UserCheck, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { Lead } from '../types';
import { WHATSAPP_FORMATTED_NUMBER, getWhatsAppUrl } from '../config';

interface GateModalProps {
  isOpen: boolean;
  onComplete: (lead: Lead) => void;
}

export const GateModal: React.FC<GateModalProps> = ({ isOpen, onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState<Lead['serviceType']>('residencial');
  const [city, setCity] = useState('São Paulo - SP');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Mask phone as (XX) XXXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setPhone(value);
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!name.trim() || name.trim().length < 2) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (cleanPhone.length < 10) {
      setError('Por favor, insira um telefone ou WhatsApp válido com DDD (ex: 11 94695-1050).');
      return;
    }

    const newLead: Lead = {
      id: 'lead_' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      serviceType,
      city: city.trim() || 'São Paulo - SP',
      createdAt: new Date().toISOString(),
      status: 'novo',
    };

    // Completes gate modal in the app
    onComplete(newLead);

    // Also automatically open WhatsApp so the electrician receives the client's information immediately!
    const serviceLabel = 
      serviceType === 'emergencia' ? '🚨 Emergência 24h (Urgente)' :
      serviceType === 'residencial' ? 'Residencial (Casa / Apto)' :
      serviceType === 'comercial' ? 'Comercial / Empresa' : 'Predial / Condomínio';

    const welcomeMsg = `Olá! Me chamo *${name.trim()}* e meu WhatsApp é *${phone.trim()}*.\nEstou acessando o seu site e gostaria de um orçamento para serviço elétrico (*${serviceLabel}* - ${city.trim() || 'SP'}).`;
    
    // Open WhatsApp in a new tab/window for fast contact
    try {
      window.open(getWhatsAppUrl(welcomeMsg), '_blank');
    } catch {
      // Ignore pop-up block if any
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-hidden">
      {/* Background Video behind modal with 50% opacity */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ objectPosition: '32% center' }}
          className="w-full h-full object-cover opacity-50 brightness-90 contrast-110"
        >
          <source src="/videos/electrician-socket.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      <div className="w-full max-w-lg bg-slate-900/95 backdrop-blur-lg border border-slate-750 rounded-2xl shadow-2xl overflow-hidden text-slate-100 relative z-10">
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">VoltPro Eletricistas</span>
              <h2 className="text-xl font-bold tracking-tight text-white font-display">Identificação para Atendimento</h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Antes de entrar e visualizar a tabela de serviços e orçamentos, por favor informe seu <strong className="text-amber-400">nome</strong> e <strong className="text-amber-400">número de WhatsApp</strong> para liberarmos seu canal direto com nossos eletricistas certificados.
          </p>

          {/* Quick Perks */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Profissionais NR-10</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Plantão 24 Horas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Orçamento Sem Compromisso</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Garantia de 1 Ano</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="gate-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                Seu Nome Completo <span className="text-amber-400">*</span>
              </label>
              <input
                id="gate-name"
                type="text"
                autoFocus
                placeholder="Ex: Carlos Eduardo Silva"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="gate-phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                Seu Telefone / WhatsApp com DDD <span className="text-amber-400">*</span>
              </label>
              <input
                id="gate-phone"
                type="tel"
                placeholder="(11) 94695-1050"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="gate-type" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tipo de Atendimento
                </label>
                <select
                  id="gate-type"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as Lead['serviceType'])}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                >
                  <option value="residencial">Residencial (Casa / Apto)</option>
                  <option value="emergencia">Emergência 24h (Urgente)</option>
                  <option value="comercial">Comercial / Empresa</option>
                  <option value="predial">Condomínio / Predial</option>
                </select>
              </div>

              <div>
                <label htmlFor="gate-city" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Cidade / Região
                </label>
                <input
                  id="gate-city"
                  type="text"
                  placeholder="São Paulo e Região"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer mt-2 text-sm"
            >
              <span>Entrar no Site & Ver Serviços</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Plantão Elétrico Direto: {WHATSAPP_FORMATTED_NUMBER} · Atendimento 24h</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

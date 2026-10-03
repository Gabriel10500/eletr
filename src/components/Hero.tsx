import React from 'react';
import { Shield, Clock, Award, ArrowRight, PhoneCall, CheckCircle, Zap } from 'lucide-react';
import { Lead } from '../types';
import { WHATSAPP_RAW_NUMBER, WHATSAPP_FORMATTED_NUMBER, getWhatsAppUrl } from '../config';

interface HeroProps {
  currentLead: Lead | null;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLead, onOpenBooking }) => {
  const getFirstName = (fullName: string) => fullName.trim().split(' ')[0] || 'Cliente';

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80 bg-slate-950">
      {/* Background Video with 50% Opacity */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
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
        {/* Dark Vignette / Gradient Overlay to ensure maximum contrast and text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/50 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#020617_90%)]" />
      </div>

      {/* Subtle Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Personalized Welcome Banner if user has entered */}
        {currentLead && (
          <div className="mb-8 p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg shadow-amber-500/5">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-slate-200">
                Olá, <strong className="text-amber-400 font-semibold">{currentLead.name}</strong>! Seu telefone cadastrado: <span className="font-mono text-slate-300">{currentLead.phone}</span>.
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                Falar com Eletricista ({WHATSAPP_FORMATTED_NUMBER}):
              </span>
              <a
                href={getWhatsAppUrl(`Olá! Sou ${currentLead.name} (${currentLead.phone}). Preciso de um orçamento para serviço elétrico.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Chamar no WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Proposition and Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-md">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificação Oficial NR-10 & CFT · Atendimento Técnico</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.08] text-balance">
              Instalações e Manutenções Elétricas com <span className="text-amber-400 underline decoration-amber-500/30 underline-offset-8">Segurança Rigorosa</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Engenharia e eletricidade prática para residências, condomínios e comércios. Troca de quadros, eliminação de curto-circuito, fiação nova e infraestrutura para carros elétricos (Wallbox) em conformidade total com a NBR 5410.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#calculadora"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] cursor-pointer"
              >
                <span>Calcular Orçamento Online</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${WHATSAPP_RAW_NUMBER.replace(/^55/, '')}`}
                className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Plantão Emergência: {WHATSAPP_FORMATTED_NUMBER}</span>
              </a>
            </div>

            {/* Proof Points & Adjacency */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-300">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">4.850+</p>
                <p className="text-slate-400 mt-0.5">Serviços executados</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">12 Anos</p>
                <p className="text-slate-400 mt-0.5">Experiência prática</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">1 Ano</p>
                <p className="text-slate-400 mt-0.5">Garantia por escrito</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Focal Carrier / Modern Electrical Engineering Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 p-1 border border-slate-700/80 shadow-2xl overflow-hidden group">
              {/* Inner Display Screen */}
              <div className="bg-slate-950 rounded-xl p-5 sm:p-6 border border-slate-800 space-y-5">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-300 font-medium">PADRÃO TÉCNICO NBR 5410</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    DIAGNÓSTICO ATIVO
                  </span>
                </div>

                {/* Technical Graphic Card */}
                <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Tensão de Rede Medida</span>
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums">220.4 V ~ 60 Hz</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%]" />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Resistência de Aterramento</span>
                    <span className="font-mono text-amber-400 font-semibold tabular-nums">&lt; 4.8 Ω (Seguro)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Proteção Diferencial Residual (DR)</span>
                    <span className="font-mono text-blue-400 font-semibold">30mA Classe AC</span>
                  </div>
                </div>

                {/* Circuit Breaker Visual Representation */}
                <div className="space-y-2">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Módulos de Proteção Instalados:
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400">GERAL</span>
                      <span className="font-mono font-bold text-white mt-1">63A</span>
                      <span className="text-[9px] text-emerald-400 font-mono">BIPOLAR</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400">DR CHUVEIRO</span>
                      <span className="font-mono font-bold text-amber-400 mt-1">40A</span>
                      <span className="text-[9px] text-slate-400 font-mono">30mA</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400">WALLBOX EV</span>
                      <span className="font-mono font-bold text-blue-400 mt-1">32A</span>
                      <span className="text-[9px] text-blue-400 font-mono">CURVA C</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400">DPS RAIOS</span>
                      <span className="font-mono font-bold text-rose-400 mt-1">45kA</span>
                      <span className="text-[9px] text-slate-400 font-mono">CLASSE II</span>
                    </div>
                  </div>
                </div>

                {/* Verified Checklist */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sem risco de fuga de corrente ou aquecimento de condutores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Conexões prensadas com terminais tubulares ilhós de cobre</span>
                  </div>
                </div>

                {/* Quick Booking CTA button */}
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs rounded-lg border border-amber-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Agendar Visita Técnica com Laudo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

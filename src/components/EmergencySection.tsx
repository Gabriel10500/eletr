import React from 'react';
import { AlertTriangle, PhoneCall, Zap, Flame, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { Lead } from '../types';
import { WHATSAPP_RAW_NUMBER, WHATSAPP_FORMATTED_NUMBER, getWhatsAppUrl } from '../config';

interface EmergencySectionProps {
  currentLead: Lead | null;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({ currentLead }) => {
  const emergencyWhatsAppUrl = getWhatsAppUrl(
    currentLead
      ? `🚨 *URGÊNCIA ELÉTRICA 24H* - Olá! Meu nome é ${currentLead.name} (${currentLead.phone}). Estou com um problema elétrico urgente no imóvel e preciso de atendimento imediato!`
      : '🚨 *URGÊNCIA ELÉTRICA 24H* - Olá! Preciso de um eletricista de emergência no local agora!'
  );

  return (
    <section id="emergencia" className="py-20 bg-slate-900/90 border-b border-slate-800 relative overflow-hidden">
      {/* Background Warning Ambience */}
      <div className="absolute -top-32 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-slate-950 border border-rose-500/30 p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Plantão Emergencial 24 Horas · Resposta Rápida</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight text-balance">
                Cheiro de Queimado, Faíscas ou Queda Total de Energia?
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                Sobrecargas e curtos-circuitos não esperam o horário comercial. Nossa equipe de prontidão possui veículos equipados para deslocamento imediato com peças de reposição rápida para restabelecer a segurança da sua família.
              </p>

              {/* Triage Warning Signs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">Cheiro de plástico queimado</strong>
                    <span className="text-slate-400">Em tomadas, disjuntores ou chuveiros.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">Choque em torneiras ou registro</strong>
                    <span className="text-slate-400">Falta urgente de aterramento ou fase viva.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">Disjuntor que não rearma</strong>
                    <span className="text-slate-400">Curto ativo permanente no cabeamento.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">Luz oscilando ou meia-fase</strong>
                    <span className="text-slate-400">Neutro rompido com risco de queimar tudo.</span>
                  </div>
                </div>
              </div>

              {/* Emergency Call Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href={emergencyWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-rose-600/30 active:scale-[0.98]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Acionar Plantão 24h via WhatsApp</span>
                </a>

                <a
                  href={`tel:${WHATSAPP_RAW_NUMBER.replace(/^55/, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-medium transition-colors"
                >
                  <span>Ligar Direto: {WHATSAPP_FORMATTED_NUMBER}</span>
                </a>
              </div>
            </div>

            {/* Right Guide: O que fazer antes do eletricista chegar */}
            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Instruções Imediatas de Segurança</span>
              </div>

              <h3 className="text-lg font-bold text-white font-display">
                O que fazer até a chegada do técnico:
              </h3>

              <ol className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    <strong className="text-white">Desligue o disjuntor geral:</strong> Se houver cheiro de queimado ou faíscas visíveis, corte a energia no quadro principal.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    <strong className="text-white">Nunca jogue água em fogo elétrico:</strong> Use extintor de pó químico (PQS) ou CO2 se tiver; se alastrar, chame os Bombeiros (193).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    <strong className="text-white">Desconecte aparelhos sensíveis:</strong> Desplugue computadores, TVs e geladeiras da tomada para evitar queima por retorno de alta voltagem.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span>
                    <strong className="text-white">Mantenha a distância:</strong> Não toque em fios soltos ou componentes derretidos com as mãos desprotegidas.
                  </span>
                </li>
              </ol>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Tempo médio de deslocamento: <strong className="text-slate-200">30 a 50 minutos</strong> na Grande SP.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { Lead } from '../types';
import { getWhatsAppUrl } from '../config';

interface BookingFormProps {
  currentLead: Lead | null;
  onOpenGateIfMissing: () => void;
  onLeadUpdated: (lead: Lead) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ currentLead, onOpenGateIfMissing, onLeadUpdated }) => {
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredShift, setPreferredShift] = useState<'manha' | 'tarde' | 'noite' | 'urgente'>('manha');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentLead) {
      onOpenGateIfMissing();
      return;
    }

    // Format WhatsApp message
    const shiftLabel = {
      manha: 'Manhã (08h às 12h)',
      tarde: 'Tarde (13h às 18h)',
      noite: 'Noite (18h às 21h)',
      urgente: 'IMEDIATO / PLANTÃO URGENTE',
    }[preferredShift];

    const message = `*Agendamento de Visita Técnica - VoltPro Elétrica*
*Cliente:* ${currentLead.name}
*Telefone/WhatsApp:* ${currentLead.phone}
*Endereço do Local:* ${address || 'A combinar'}
*Data Desejada:* ${preferredDate}
*Turno de Preferência:* ${shiftLabel}
*Descrição da Demanda:* ${description || 'Avaliação e orçamento geral no local'}

Por favor, aguardo a confirmação do horário!`;

    // Update lead notes in state/storage
    const updatedLead: Lead = {
      ...currentLead,
      notes: `Agendamento: ${preferredDate} (${preferredShift}) - ${description}`,
      status: 'em_atendimento',
    };
    onLeadUpdated(updatedLead);

    setSubmitted(true);
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <section id="contato" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Atendimento Rápido
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mt-2">
            Agendar Visita Técnica com Eletricista
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 text-balance">
            {currentLead
              ? `Os seus dados (${currentLead.name}) já estão pré-preenchidos. Escolha o melhor dia e horário para vistoria no seu imóvel:`
              : 'Informe os detalhes do seu imóvel para organizarmos o deslocamento da equipe técnica:'}
          </p>
        </div>

        {submitted ? (
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              Solicitação Enviada com Sucesso!
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Sua solicitação de visita técnica foi gerada e encaminhada para nossa central. Você também pode falar diretamente pelo WhatsApp.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer transition-colors"
              >
                Fazer outro agendamento
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Auto-filled Banner */}
              {currentLead ? (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-400">Identificação do Solicitante:</span>
                    <p className="font-semibold text-white">
                      {currentLead.name} · <span className="font-mono text-amber-400">{currentLead.phone}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenGateIfMissing}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    Alterar dados
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                  <span className="text-slate-200">
                    Você ainda não inseriu seu nome e telefone.
                  </span>
                  <button
                    type="button"
                    onClick={onOpenGateIfMissing}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded cursor-pointer"
                  >
                    Inserir Dados
                  </button>
                </div>
              )}

              {/* Address / Location */}
              <div>
                <label htmlFor="booking-address" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Endereço ou Bairro do Atendimento <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="booking-address"
                    type="text"
                    required
                    placeholder="Ex: Rua Oscar Freire, 1200 - Apto 42, Jardins, São Paulo"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Date & Shift Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="booking-date" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Data Desejada
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-date"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="booking-shift" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Turno de Preferência
                  </label>
                  <select
                    id="booking-shift"
                    value={preferredShift}
                    onChange={(e) => setPreferredShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  >
                    <option value="manha">Manhã (08h às 12h)</option>
                    <option value="tarde">Tarde (13h às 18h)</option>
                    <option value="noite">Noite (18h às 21h)</option>
                    <option value="urgente">🚨 URGENTE (Chegada o mais rápido possível)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="booking-desc" className="block text-xs font-medium text-slate-300 mb-1.5">
                  O que precisa ser feito ou reparado?
                </label>
                <textarea
                  id="booking-desc"
                  rows={3}
                  placeholder="Ex: Quero trocar o disjuntor do chuveiro que vive caindo e instalar 2 tomadas de 20A na cozinha..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide uppercase transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Confirmar Agendamento & Enviar via WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sem taxa de cancelamento prévio · Atendimento formal com recibo e garantia</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

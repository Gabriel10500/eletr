import React, { useState } from 'react';
import { ELECTRICAL_SERVICES } from '../data/servicesData';
import { ServiceItem, Lead } from '../types';
import { Zap, Check, ArrowRight, X, Clock, ShieldAlert, Cpu } from 'lucide-react';

interface ServicesBentoProps {
  currentLead: Lead | null;
  onSelectServiceForContact: (service: ServiceItem) => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ currentLead, onSelectServiceForContact }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getEditorialIndex = (index: number) => {
    return String(index + 1).padStart(2, '0');
  };

  return (
    <section id="servicos" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Especialidades Técnicas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mt-2">
              Soluções Elétricas Completas para seu Imóvel
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 text-balance">
              Executamos desde manutenções preventivas simples até infraestrutura pesada de alta amperagem, com ferramentas de última geração e respeito rigoroso às normas da ABNT.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Atendimento Residencial, Comercial e Predial</span>
            <span aria-hidden="true">·</span>
            <span>Laudos com ART</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ELECTRICAL_SERVICES.map((service, index) => {
            const isFeatured = index === 0 || index === 2; // QDT and Wallbox EV
            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 ${
                  isFeatured ? 'lg:col-span-2 bg-gradient-to-br from-slate-900/90 to-slate-900/40' : 'col-span-1'
                }`}
              >
                <div>
                  {/* Top Metadata Row: Zero-Pill unboxed typography */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800/80">
                    <span className="font-mono text-amber-400 font-semibold">
                      {getEditorialIndex(index)}.
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{service.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {service.timeEstimate}
                      </span>
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-xl font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Features List */}
                  <div className="mt-5 space-y-2">
                    {service.features.slice(0, isFeatured ? 4 : 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action and Pricing */}
                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Investimento a partir de</span>
                    <span className="font-mono text-base font-bold text-white tabular-nums">
                      R$ {service.startingPrice}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1">/{service.unit.split('/')[0]}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => onSelectServiceForContact(service)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Contratar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-2 uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>Especificação Técnica Completa</span>
            </div>

            <h3 className="text-2xl font-bold text-white font-display mb-3">
              {selectedService.title}
            </h3>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {selectedService.fullDesc}
            </p>

            <div className="mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Itens Inclusos no Procedimento Padrão:
              </h4>
              <ul className="space-y-2">
                {selectedService.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">Preço de Referência</span>
                <span className="font-mono text-xl font-bold text-amber-400 tabular-nums">
                  R$ {selectedService.startingPrice}
                </span>
                <span className="text-xs text-slate-400 ml-1">({selectedService.unit})</span>
              </div>

              <button
                onClick={() => {
                  const s = selectedService;
                  setSelectedService(null);
                  onSelectServiceForContact(s);
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Solicitar Este Serviço
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

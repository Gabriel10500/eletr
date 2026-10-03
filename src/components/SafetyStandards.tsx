import React from 'react';
import { SAFETY_CHECKLIST } from '../data/servicesData';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SafetyStandards: React.FC = () => {
  return (
    <section id="seguranca" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Conformidade Técnica & Legislação
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display leading-tight text-balance">
              Por que a Eletricidade Não Aceita Amadorismo?
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Mais de 65% dos incêndios residenciais urbanos no Brasil têm origem em falhas e gambiarras elétricas. Na VoltPro, todo procedimento obedece estritamente às normas regulamentadoras do Ministério do Trabalho e da ABNT.
            </p>

            <div className="space-y-4 pt-2">
              {SAFETY_CHECKLIST.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Certificate Badge Box */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 sm:p-9 space-y-6 shadow-xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                    Registro Profissional
                  </span>
                  <h3 className="text-xl font-bold text-white font-display mt-0.5">
                    Responsabilidade Técnica Garantida
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Norma Primária</span>
                  <strong className="text-white text-sm block mt-1">ABNT NBR 5410</strong>
                  <span className="text-[10px] text-slate-400 mt-1 block">Instalações em baixa tensão</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Segurança Ocupacional</span>
                  <strong className="text-white text-sm block mt-1">NR-10 & NR-35</strong>
                  <span className="text-[10px] text-slate-400 mt-1 block">Riscos elétricos e altura</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Documentação Formal</span>
                  <strong className="text-white text-sm block mt-1">ART / TRT Válida</strong>
                  <span className="text-[10px] text-slate-400 mt-1 block">Anotação para bombeiros e seguros</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Equipamentos de Teste</span>
                  <strong className="text-white text-sm block mt-1">Fluke True-RMS</strong>
                  <span className="text-[10px] text-slate-400 mt-1 block">Calibração anual certificada</span>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-amber-400">Segurança Jurídica:</strong> Emitimos termo formal de conclusão com memorial descritivo dos materiais aplicados, diagrama unifilar do quadro e garantia contratual de 365 dias para todas as instalações executadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

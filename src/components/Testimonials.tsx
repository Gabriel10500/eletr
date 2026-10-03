import React from 'react';
import { TESTIMONIALS } from '../data/servicesData';
import { Star, MessageSquareQuote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="avaliacoes" className="py-20 bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Reputação Comprovada
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mt-2">
            O que Nossos Clientes Dizem
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 text-balance">
            Confira relatos reais de famílias, síndicos e comércios que confiaram a segurança de suas instalações elétricas ao nosso time técnico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Rating stars & Date - Zero-Pill */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono">{test.date}</span>
                </div>

                {/* Comment */}
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{test.comment}"
                </p>
              </div>

              {/* Author & Service attribution */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{test.author}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    <span>{test.role}</span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span>{test.location}</span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[11px] text-amber-400/90 font-mono block">
                    {test.serviceProvided}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate trust marker */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">4.9</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
          <div className="text-slate-400 text-center sm:text-left">
            Baseado em <strong className="text-slate-200 font-semibold">180+ avaliações reais</strong> no Google e WhatsApp no último ano.
          </div>
        </div>
      </div>
    </section>
  );
};

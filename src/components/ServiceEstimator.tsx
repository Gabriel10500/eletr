import React, { useState } from 'react';
import { Calculator, Plus, Minus, Send, CheckCircle2, RotateCcw, MessageSquare } from 'lucide-react';
import { ESTIMATE_OPTIONS } from '../data/servicesData';
import { Lead } from '../types';
import { getWhatsAppUrl } from '../config';

interface ServiceEstimatorProps {
  currentLead: Lead | null;
  onOpenGateIfMissing: () => void;
}

export const ServiceEstimator: React.FC<ServiceEstimatorProps> = ({ currentLead, onOpenGateIfMissing }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    chuveiro: 1,
    quadro: 1,
    tomadas: 3,
  });
  const [urgency, setUrgency] = useState<'normal' | 'urgente'>('normal');
  const [notes, setNotes] = useState('');

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [id]: updated };
    });
  };

  const handleReset = () => {
    setQuantities({});
  };

  // Calculation
  const subtotal = ESTIMATE_OPTIONS.reduce((acc, item) => {
    const qty = quantities[item.id] || 0;
    return acc + qty * item.basePrice;
  }, 0);

  const urgencyMultiplier = urgency === 'urgente' ? 1.25 : 1.0;
  const totalMin = Math.round(subtotal * urgencyMultiplier);
  const totalMax = Math.round(subtotal * urgencyMultiplier * 1.2);

  const selectedItemsList = ESTIMATE_OPTIONS.filter((item) => (quantities[item.id] || 0) > 0);

  const handleSendToWhatsApp = () => {
    if (!currentLead) {
      onOpenGateIfMissing();
      return;
    }

    const itemsSummary = selectedItemsList
      .map((item) => `• ${quantities[item.id]}x ${item.name}`)
      .join('\n');

    const msg = `*Solicitação de Orçamento - VoltPro Elétrica*
*Cliente:* ${currentLead.name}
*Telefone/WhatsApp:* ${currentLead.phone}
*Tipo:* ${currentLead.serviceType}
*Prioridade:* ${urgency === 'urgente' ? 'URGENTE (Atendimento imediato)' : 'Normal (Agendamento)'}

*Serviços Selecionados:*
${itemsSummary || '• Nenhum item pré-selecionado (Orçamento sob medida)'}

*Estimativa Inicial de Mão de Obra:* R$ ${totalMin.toLocaleString('pt-BR')} a R$ ${totalMax.toLocaleString('pt-BR')}
${notes ? `*Observações do Cliente:* ${notes}` : ''}

Por favor, gostaria de confirmar a disponibilidade para a visita técnica!`;

    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <section id="calculadora" className="py-16 sm:py-20 bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Transparência & Rapidez
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mt-2">
            Simulador de Investimento Elétrico
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 text-balance">
            Selecione as necessidades do seu imóvel para obter uma estimativa prévia de mão de obra. Valores finais confirmados após vistoria técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Selector */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Selecione os Serviços
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar seleção</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {ESTIMATE_OPTIONS.map((item) => {
                const count = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      count > 0
                        ? 'bg-slate-850 border-amber-500/50 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        A partir de <span className="font-mono text-amber-400 tabular-nums">R$ {item.basePrice}</span> / {item.unitText}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={count === 0}
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer transition-colors"
                        aria-label={`Diminuir ${item.name}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-7 text-center text-xs font-mono font-bold text-white tabular-nums">
                        {count}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
                        aria-label={`Aumentar ${item.name}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estimate Summary Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <h3 className="font-semibold text-white text-base">Resumo do Orçamento</h3>
                </div>
                {currentLead && (
                  <span className="text-xs text-slate-400">
                    Cliente: <span className="text-amber-400 font-medium">{currentLead.name.split(' ')[0]}</span>
                  </span>
                )}
              </div>

              {/* Urgency Switch */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Prazo de Execução Desejado:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setUrgency('normal')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      urgency === 'normal'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Agendamento Normal
                  </button>
                  <button
                    onClick={() => setUrgency('urgente')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      urgency === 'urgente'
                        ? 'bg-rose-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Urgente / Plantão
                  </button>
                </div>
              </div>

              {/* Selected Items Breakdown */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedItemsList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 italic">
                    Nenhum serviço selecionado ainda. Clique nos botões (+) ao lado para simular.
                  </p>
                ) : (
                  selectedItemsList.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs text-slate-300">
                      <span className="truncate pr-2">
                        {quantities[item.id]}x {item.name}
                      </span>
                      <span className="font-mono text-slate-200 tabular-nums shrink-0">
                        R$ {(quantities[item.id] * item.basePrice).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Client Notes / Observation */}
              <div>
                <label htmlFor="estimate-notes" className="block text-xs font-medium text-slate-400 mb-1">
                  Alguma particularidade ou detalhe do imóvel?
                </label>
                <textarea
                  id="estimate-notes"
                  rows={2}
                  placeholder="Ex: Apartamento no 4º andar, disjuntor desarma ao ligar o forno..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Faixa estimada de mão de obra</span>
                  <span>{selectedItemsList.length} itens</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-semibold text-white">Investimento Estimado:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                      R$ {totalMin.toLocaleString('pt-BR')}
                    </span>
                    {totalMax > totalMin && (
                      <span className="text-sm text-slate-400 font-mono tabular-nums">
                        {' '}a R$ {totalMax.toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-normal">
                  *Não inclui materiais de consumo específicos se necessários. Orçamento final mediante confirmação no local.
                </p>
              </div>

              {/* CTA Send to WhatsApp */}
              <button
                onClick={handleSendToWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>
                  {currentLead
                    ? `Enviar Orçamento para o Eletricista com dados de ${currentLead.name.split(' ')[0]}`
                    : 'Identificar-se e Enviar Orçamento'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

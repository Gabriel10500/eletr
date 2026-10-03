import React from 'react';
import { Zap, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { WHATSAPP_FORMATTED_NUMBER } from '../config';

interface FooterProps {
  onOpenLeadsManager: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLeadsManager }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base font-display">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
              </span>
              <span>VoltPro Elétrica</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Serviços elétricos profissionais residenciais, prediais e industriais. Segurança técnica sem improvisos conforme a NBR 5410.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors">
                  Serviços Especializados
                </a>
              </li>
              <li>
                <a href="#calculadora" className="hover:text-amber-400 transition-colors">
                  Calculadora de Orçamento
                </a>
              </li>
              <li>
                <a href="#emergencia" className="hover:text-rose-400 transition-colors">
                  Plantão de Emergência 24h
                </a>
              </li>
              <li>
                <a href="#seguranca" className="hover:text-amber-400 transition-colors">
                  Normas Técnicas NR-10
                </a>
              </li>
              <li>
                <a href="#avaliacoes" className="hover:text-amber-400 transition-colors">
                  Avaliações de Clientes
                </a>
              </li>
            </ul>
          </div>

          {/* Specialities */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Principais Demandas</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Troca de quadro para disjuntores DIN</li>
              <li>• Instalação de Wallbox para carros elétricos</li>
              <li>• Reparo emergencial de curto-circuito</li>
              <li>• Substituição de fiação antiga com DR e DPS</li>
              <li>• Instalação de chuveiro elétrico potente</li>
              <li>• Emissão de laudo com ART/TRT</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Contato & Atendimento</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs">{WHATSAPP_FORMATTED_NUMBER} · Plantão 24h</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>contato@voltproeletrica.com.br</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Atendimento em toda a Grande São Paulo e Região Metropolitana</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>CNPJ 48.912.834/0001-92 · Reg. CFT nº 109283</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p
            onClick={onOpenLeadsManager}
            className="cursor-default select-none hover:text-slate-300 transition-colors"
            title=""
          >
            © {new Date().getFullYear()} VoltPro Elétrica. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#termos" className="hover:text-slate-300 transition-colors">Termos de Garantia</a>
            <span>·</span>
            <a href="#privacidade" className="hover:text-slate-300 transition-colors">Privacidade de Dados</a>
            <span>·</span>
            <span className="text-slate-400">Feito com segurança técnica</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

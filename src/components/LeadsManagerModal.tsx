import React, { useState } from 'react';
import { Lead } from '../types';
import { X, Search, Phone, MessageSquare, Download, Trash2, Calendar, UserCheck, ShieldAlert, CheckCircle2, Mail, Loader2, Table, ExternalLink, RefreshCw, Link2, Sparkles } from 'lucide-react';
import { sendLeadNotificationEmail, ADMIN_NOTIFICATION_EMAIL } from '../services/gmailService';
import { googleSignIn } from '../services/googleAuth';
import { appendLeadToSheet, syncAllLeadsToSheet, getSavedSpreadsheetId, saveSpreadsheetId, createLeadsSpreadsheet } from '../services/sheetsService';

interface LeadsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onDeleteLead: (id: string) => void;
}

export const LeadsManagerModal: React.FC<LeadsManagerModalProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateStatus,
  onDeleteLead,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [customSheetInput, setCustomSheetInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(() => {
    const id = getSavedSpreadsheetId();
    return id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : null;
  });

  if (!isOpen) return null;

  const handleLinkCustomSheet = async () => {
    if (!customSheetInput.trim()) return;
    const cleanedId = saveSpreadsheetId(customSheetInput);
    const newUrl = `https://docs.google.com/spreadsheets/d/${cleanedId}/edit`;
    setSheetUrl(newUrl);
    setShowCustomInput(false);
    setCustomSheetInput('');
    setEmailStatus('Formatando e sincronizando contatos com sua planilha vinculada...');
    setSheetLoading(true);
    try {
      const res = await syncAllLeadsToSheet(leads, cleanedId);
      if (res.success) {
        setEmailStatus(`✓ Planilha vinculada e formatada com sucesso com ${res.count} contatos!`);
      } else {
        setEmailStatus(`Aviso: Planilha vinculada. ${res.error || ''}`);
      }
    } catch {
      setEmailStatus('✓ Planilha vinculada! Os contatos futuros serão salvos nela.');
    } finally {
      setSheetLoading(false);
      setTimeout(() => setEmailStatus(null), 5000);
    }
  };

  const handleSyncToSheets = async () => {
    setSheetLoading(true);
    setEmailStatus('Sincronizando contatos com o Google Sheets...');
    try {
      const res = await syncAllLeadsToSheet(leads);
      if (res.success && res.url) {
        setSheetUrl(res.url);
        setEmailStatus(`✓ ${res.count} contatos sincronizados com a planilha no Google Drive!`);
      } else {
        setEmailStatus(`Erro na planilha: ${res.error || 'Falha ao sincronizar'}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na conexão';
      setEmailStatus(`Erro ao salvar na planilha: ${msg}`);
    } finally {
      setSheetLoading(false);
      setTimeout(() => setEmailStatus(null), 5000);
    }
  };

  const handleAppendSingleToSheet = async (lead: Lead) => {
    setSendingId(lead.id);
    setEmailStatus(`Adicionando ${lead.name} na planilha Google Sheets...`);
    try {
      const res = await appendLeadToSheet(lead);
      if (res.success && res.url) {
        setSheetUrl(res.url);
        setEmailStatus(`✓ ${lead.name} salvo na planilha com sucesso!`);
      } else {
        setEmailStatus(`Aviso: ${res.error}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha';
      setEmailStatus(`Erro: ${msg}`);
    } finally {
      setSendingId(null);
      setTimeout(() => setEmailStatus(null), 5000);
    }
  };

  const handleSendEmailForLead = async (lead: Lead) => {
    setSendingId(lead.id);
    setEmailStatus(`Enviando dados de ${lead.name} para ${ADMIN_NOTIFICATION_EMAIL}...`);
    try {
      const result = await sendLeadNotificationEmail(lead);
      if (result.success) {
        setEmailStatus(`✓ E-mail enviado com sucesso para ${ADMIN_NOTIFICATION_EMAIL}!`);
      } else {
        setEmailStatus(`Aviso: ${result.error || 'Erro ao enviar e-mail.'}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha no envio';
      setEmailStatus(`Erro: ${msg}`);
    } finally {
      setSendingId(null);
      setTimeout(() => {
        setEmailStatus(null);
      }, 5000);
    }
  };

  const handleConnectGmail = async () => {
    try {
      setEmailStatus('Conectando ao Google Gmail...');
      await googleSignIn();
      setEmailStatus('✓ Conectado ao Google com sucesso! Notificações por e-mail ativas.');
      setTimeout(() => setEmailStatus(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na autenticação';
      setEmailStatus(`Falha: ${msg}`);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesType = filterType === 'all' || lead.serviceType === filterType;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Nome', 'Telefone', 'Tipo de Atendimento', 'Data de Cadastro', 'Status', 'Observacoes'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      l.serviceType,
      new Date(l.createdAt).toLocaleString('pt-BR'),
      l.status,
      `"${l.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_voltpro_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'novo':
        return <span className="text-amber-400 font-mono text-[11px]">Novo</span>;
      case 'em_atendimento':
        return <span className="text-blue-400 font-mono text-[11px]">Em Atendimento</span>;
      case 'orcamento_enviado':
        return <span className="text-purple-400 font-mono text-[11px]">Orçamento Enviado</span>;
      case 'concluido':
        return <span className="text-emerald-400 font-mono text-[11px]">Concluído</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg font-bold text-white font-display">
                Painel do Eletricista · Contatos & Leads Capturados
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pessoas que inseriram seu nome e telefone ao entrar no site ({leads.length} registrados) · Alertas para <strong className="text-amber-400">{ADMIN_NOTIFICATION_EMAIL}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {sheetUrl ? (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir Planilha do Google Sheets no Drive"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-emerald-500/30"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Abrir Planilha</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            ) : null}

            <button
              onClick={handleSyncToSheets}
              disabled={sheetLoading}
              title="Salvar e Sincronizar todos os contatos no Google Sheets"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {sheetLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Table className="w-3.5 h-3.5" />
              )}
              <span>{sheetUrl ? 'Sincronizar Planilha' : 'Criar Planilha Google'}</span>
            </button>

            <button
              onClick={handleConnectGmail}
              title="Conectar / Reautorizar conta do Google para envio automático"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-amber-500/20"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Auth</span>
            </button>
            <button
              onClick={exportCSV}
              disabled={leads.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Google Status Notification Banner */}
        <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-200">
              Notificações de Novos Clientes por E-mail para: <strong className="text-amber-400">{ADMIN_NOTIFICATION_EMAIL}</strong>
            </span>
          </div>
          <button
            onClick={handleConnectGmail}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md transition-colors cursor-pointer text-xs"
          >
            <Mail className="w-3.5 h-3.5 fill-slate-950" />
            <span>Ativar / Conectar Envio de E-mails</span>
          </button>
        </div>

        {emailStatus && (
          <div className="px-5 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 text-xs font-medium text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{emailStatus}</span>
          </div>
        )}

        {/* Google Sheets Integration Card */}
        <div className="px-5 py-3.5 bg-emerald-950/30 border-b border-emerald-500/20 text-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Table className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  Planilha de Clientes & Orçamentos (Google Sheets)
                  {sheetUrl ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-normal bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Sincronizada e Formatada
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-normal bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Pronta para Gerar
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Com cabeçalho profissional escuro, colunas ajustadas e link de <strong>1 clique para abrir o WhatsApp</strong> do cliente.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              {sheetUrl ? (
                <>
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors shadow-sm"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Abrir Planilha no Drive</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  <button
                    onClick={handleSyncToSheets}
                    disabled={sheetLoading}
                    title="Reaplicar formatação e sincronizar todos os contatos"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-medium transition-colors border border-emerald-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Atualizar / Formatar</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSyncToSheets}
                  disabled={sheetLoading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {sheetLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Criar Planilha Formatada no Meu Google</span>
                </button>
              )}

              <button
                onClick={() => setShowCustomInput((prev) => !prev)}
                title="Vincular uma planilha já existente"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-medium transition-colors border border-slate-700 cursor-pointer"
              >
                <Link2 className="w-3 h-3 text-slate-400" />
                <span>{showCustomInput ? 'Fechar' : 'Vincular Outra Planilha'}</span>
              </button>
            </div>
          </div>

          {/* Optional Input to Paste an Existing Sheet URL or ID */}
          {showCustomInput && (
            <div className="mt-3 pt-3 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center gap-2 animate-fadeIn">
              <input
                type="text"
                placeholder="Cole o link ou ID da sua planilha do Google Sheets aqui..."
                value={customSheetInput}
                onChange={(e) => setCustomSheetInput(e.target.value)}
                className="flex-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleLinkCustomSheet}
                disabled={!customSheetInput.trim() || sheetLoading}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-40 cursor-pointer"
              >
                Vincular e Formatar
              </button>
            </div>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-slate-400 text-[11px]">Tipo:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('residencial')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  filterType === 'residencial' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Residencial
              </button>
              <button
                onClick={() => setFilterType('emergencia')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  filterType === 'emergencia' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Emergência
              </button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Nenhum contato encontrado com os filtros selecionados.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const cleanPhone = lead.phone.replace(/\D/g, '');
              const directWhatsApp = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                `Olá, ${lead.name}! Aqui é da equipe técnica da VoltPro Elétrica. Vimos que você acessou nossos serviços. Como podemos lhe ajudar hoje?`
              )}`;

              return (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{lead.name}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      {getStatusBadge(lead.status)}
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono text-amber-400">{lead.phone}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="capitalize">{lead.serviceType}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{new Date(lead.createdAt).toLocaleString('pt-BR')}</span>
                    </div>

                    {lead.notes && (
                      <div className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 mt-1.5">
                        <strong className="text-slate-400">Observações:</strong> {lead.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value as Lead['status'])}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="novo">Novo</option>
                      <option value="em_atendimento">Em Atendimento</option>
                      <option value="orcamento_enviado">Orçamento Enviado</option>
                      <option value="concluido">Concluído</option>
                    </select>

                    <button
                      onClick={() => handleAppendSingleToSheet(lead)}
                      disabled={sendingId === lead.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer border border-emerald-500/20"
                      title={`Adicionar ${lead.name} na planilha do Google Sheets`}
                    >
                      {sendingId === lead.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Table className="w-3.5 h-3.5" />
                      )}
                      <span>Planilha</span>
                    </button>

                    <button
                      onClick={() => handleSendEmailForLead(lead)}
                      disabled={sendingId === lead.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer border border-amber-500/20"
                      title={`Enviar dados de ${lead.name} por e-mail para ${ADMIN_NOTIFICATION_EMAIL}`}
                    >
                      {sendingId === lead.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Mail className="w-3.5 h-3.5" />
                      )}
                      <span>E-mail</span>
                    </button>

                    <a
                      href={directWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                      title="Chamar no WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onDeleteLead(lead.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                      title="Excluir Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sincronização em Nuvem ativa: dados salvos no Google Firestore e acessíveis em tempo real de qualquer aparelho.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

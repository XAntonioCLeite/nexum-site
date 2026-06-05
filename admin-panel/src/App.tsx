import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Phone, Sparkles, Send, Database, RefreshCw, 
  Settings, CheckCircle, AlertTriangle
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subscribeType: 'email' | 'whatsapp' | 'both';
  createdAt: { seconds: number; nanoseconds: number } | string;
}

const App: React.FC = () => {
  // State
  const [apiUrl, setApiUrl] = useState(() => {
    const saved = localStorage.getItem('nexum_api_url');
    if (saved === 'https://subscribe-leads-api.nexumai.me') {
      localStorage.setItem('nexum_api_url', 'https://admin-panel-black-eta.vercel.app/api');
      return 'https://admin-panel-black-eta.vercel.app/api';
    }
    return saved || 'https://admin-panel-black-eta.vercel.app/api';
  });
  const [isEditingApi, setIsEditingApi] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'manual' | 'whatsapp'>('dashboard');
  
  // Manual Campaign State
  const [campaignTarget, setCampaignTarget] = useState<'email' | 'whatsapp' | 'both'>('email');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [whatsappText, setWhatsappText] = useState('');
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState<string | null>(null);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  // AI Campaign State
  const [isTriggeringAI, setIsTriggeringAI] = useState(false);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'email' | 'whatsapp' | 'both'>('all');

  const fetchLeadsData = async () => {
    setIsLoadingLeads(true);
    try {
      const resp = await fetch(`${apiUrl}/fetchLeads`);
      if (!resp.ok) throw new Error('Não foi possível carregar os leads.');
      const data = await resp.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error(err);
      // Fallback para dados mocados para visualização inicial no Vercel/Local se a API estiver offline
      setLeads([
        { id: '1', name: 'Juliana Medeiros', email: 'juliana@dermato.com.br', phone: '2799991234', subscribeType: 'both', createdAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 } },
        { id: '2', name: 'Clínica OdontoCorp', email: 'contato@odontocorp.com', subscribeType: 'email', createdAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 } },
        { id: '3', name: 'Dr. Roberto Santos', phone: '2798885566', subscribeType: 'whatsapp', createdAt: { seconds: Date.now() / 1000 - 259200, nanoseconds: 0 } }
      ]);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, [apiUrl]);

  const saveApiUrl = () => {
    localStorage.setItem('nexum_api_url', apiUrl);
    setIsEditingApi(false);
    fetchLeadsData();
  };

  const handleSendManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingCampaign(true);
    setCampaignSuccess(null);
    setCampaignError(null);

    try {
      const resp = await fetch(`${apiUrl}/sendManualNewsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: campaignTarget,
          subject: emailSubject,
          emailBody,
          whatsappBody: whatsappText
        })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Erro ao enviar campanha.');

      setCampaignSuccess(data.message || 'Campanha enviada com sucesso!');
      setEmailSubject('');
      setEmailBody('');
      setWhatsappText('');
    } catch (err: any) {
      setCampaignError(err.message || 'Erro de conexão.');
    } finally {
      setIsSendingCampaign(false);
    }
  };

  const handleTriggerAI = async () => {
    if (!window.confirm('Tem certeza de que deseja acionar o Gemini para escrever e disparar agora uma campanha automática?')) return;
    
    setIsTriggeringAI(true);
    setAiSuccess(null);
    setAiError(null);

    try {
      const resp = await fetch(`${apiUrl}/triggerAiNewsletter`, {
        method: 'POST'
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Erro ao disparar campanha de IA.');

      setAiSuccess(data.message || 'Campanha de IA disparada com sucesso!');
    } catch (err: any) {
      setAiError(err.message || 'Erro de conexão.');
    } finally {
      setIsTriggeringAI(false);
    }
  };

  // Metrics
  const totalLeads = leads.length;
  const emailSubscribers = leads.filter(l => l.subscribeType === 'email' || l.subscribeType === 'both').length;
  const whatsappSubscribers = leads.filter(l => l.subscribeType === 'whatsapp' || l.subscribeType === 'both').length;

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.phone && lead.phone.includes(searchQuery));
      
    const matchesType = typeFilter === 'all' || lead.subscribeType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0b0c10] flex flex-col font-sans text-slate-200">
      {/* Navbar */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-deepBlue border border-blue-500/20 flex items-center justify-center">
              <Sparkles size={16} className="text-mint animate-pulse" />
            </div>
            <span className="font-bold text-white tracking-tight">Nexum AI <span className="text-mint font-normal text-xs ml-2 px-2 py-0.5 bg-mint/10 border border-mint/20 rounded">Admin Panel</span></span>
          </div>

          {/* API settings */}
          <div className="flex items-center gap-2">
            {isEditingApi ? (
              <div className="flex gap-2 items-center bg-[#15171e] p-1 border border-white/10 rounded-lg">
                <input 
                  type="text" 
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="bg-transparent text-xs text-white px-2 py-1 focus:outline-none w-56 font-mono"
                  placeholder="URL da Firebase Function"
                />
                <button 
                  onClick={saveApiUrl} 
                  className="bg-mint text-black font-bold text-[10px] px-2.5 py-1 rounded"
                >
                  Salvar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-mono hidden md:inline truncate max-w-[200px]">{apiUrl}</span>
                <button 
                  onClick={() => setIsEditingApi(true)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                  title="Configurar URL do Servidor"
                >
                  <Settings size={14} />
                </button>
              </div>
            )}
            <button 
              onClick={fetchLeadsData}
              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
              title="Recarregar dados"
            >
              <RefreshCw size={14} className={isLoadingLeads ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Stats and Navigation */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card Stats */}
          <div className="bg-[#12141c] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Radar de Cadastro</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Total Leads</span>
                  <div className="text-2xl font-bold text-white mt-0.5">{totalLeads}</div>
                </div>
                <Database className="text-blue-500 w-8 h-8 opacity-60" />
              </div>

              <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">E-mails Radar</span>
                  <div className="text-2xl font-bold text-white mt-0.5">{emailSubscribers}</div>
                </div>
                <Mail className="text-mint w-8 h-8 opacity-60" />
              </div>

              <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">WhatsApps Radar</span>
                  <div className="text-2xl font-bold text-white mt-0.5">{whatsappSubscribers}</div>
                </div>
                <Phone className="text-deepBlue w-8 h-8 opacity-60" />
              </div>
            </div>
          </div>

          {/* Navigation Tab */}
          <div className="bg-[#12141c] border border-white/5 rounded-2xl p-2 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-deepBlue text-white border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Users size={16} />
              <span>Inscritos & Leads</span>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === 'manual' ? 'bg-deepBlue text-white border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Send size={16} />
              <span>Disparos Manuais</span>
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === 'whatsapp' ? 'bg-deepBlue text-white border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Phone size={16} />
              <span>WhatsApp Business API</span>
            </button>
          </div>

          {/* AI Trigger Card */}
          <div className="bg-gradient-to-br from-[#0c1a30] to-[#12141c] border border-blue-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-mint animate-pulse" />
              <h4 className="font-bold text-white text-sm">Disparo Inteligente</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Forçar o acionamento imediato da inteligência artificial (Gemini) para redigir a copy publicitária e disparar e-mails e WhatsApps para todos os leads cadastrados.
            </p>
            {aiSuccess && <div className="p-2.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-lg flex gap-1.5 items-start"><CheckCircle size={14} className="shrink-0 mt-0.5" />{aiSuccess}</div>}
            {aiError && <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex gap-1.5 items-start"><AlertTriangle size={14} className="shrink-0 mt-0.5" />{aiError}</div>}
            <button
              onClick={handleTriggerAI}
              disabled={isTriggeringAI}
              className="w-full py-3 bg-mint text-black font-bold text-xs rounded-xl hover:bg-[#00c090] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,217,163,0.15)] disabled:opacity-50"
            >
              {isTriggeringAI ? 'Disparando...' : 'Gerar e Enviar via IA agora'}
            </button>
          </div>
        </div>

        {/* Right Side: Active Workspace View */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: DASHBOARD LEADS */}
          {activeTab === 'dashboard' && (
            <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Inscritos no Radar</h2>
                  <p className="text-xs text-slate-500 mt-1">Gerencie os contatos capturados no funil da Landing Page principal.</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar..."
                    className="bg-black/30 text-xs border border-white/10 rounded-lg px-3 py-2 w-full md:w-44 focus:outline-none focus:border-deepBlue/50"
                  />
                  <select
                    value={typeFilter}
                    onChange={(e: any) => setTypeFilter(e.target.value)}
                    className="bg-black/30 text-xs border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-deepBlue/50 text-slate-300"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="email">E-mail apenas</option>
                    <option value="whatsapp">WhatsApp apenas</option>
                    <option value="both">Ambos</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase font-mono tracking-wider text-slate-500">
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4">Contatos</th>
                      <th className="px-6 py-4">Canal Radar</th>
                      <th className="px-6 py-4">Data Cadastro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {isLoadingLeads ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Carregando contatos...</td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhum inscrito localizado.</td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{lead.name}</td>
                          <td className="px-6 py-4 space-y-1">
                            {lead.email && <div className="flex items-center gap-1.5 text-slate-300"><Mail size={12} className="text-slate-500" />{lead.email}</div>}
                            {lead.phone && <div className="flex items-center gap-1.5 text-slate-300"><Phone size={12} className="text-slate-500" />{lead.phone}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              lead.subscribeType === 'both' ? 'bg-white/10 text-white border border-white/10' :
                              lead.subscribeType === 'whatsapp' ? 'bg-mint/10 text-mint border border-mint/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {lead.subscribeType === 'both' ? 'Ambos' : lead.subscribeType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-mono">
                            {typeof lead.createdAt === 'object' && lead.createdAt.seconds 
                              ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString('pt-BR') 
                              : 'Recém cadastrado'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL CAMPAIGNS */}
          {activeTab === 'manual' && (
            <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Disparos Manuais</h2>
                <p className="text-xs text-slate-500 mt-1">Envie conteúdo escrito por você diretamente para toda a base do Radar.</p>
              </div>

              <form onSubmit={handleSendManual} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Canal Destinatário</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCampaignTarget('email')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${campaignTarget === 'email' ? 'bg-deepBlue border-blue-500/30 text-white' : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                      E-mail apenas
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampaignTarget('whatsapp')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${campaignTarget === 'whatsapp' ? 'bg-mint border-mint/30 text-black' : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                      WhatsApp apenas
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampaignTarget('both')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${campaignTarget === 'both' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                      Ambos os canais
                    </button>
                  </div>
                </div>

                {/* Email Section inputs */}
                {(campaignTarget === 'email' || campaignTarget === 'both') && (
                  <div className="space-y-4 p-4 border border-white/5 bg-black/20 rounded-xl">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Mail size={12} /> Configuração do E-mail</h3>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Assunto do E-mail</label>
                      <input
                        type="text"
                        required={campaignTarget === 'email' || campaignTarget === 'both'}
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Ex: Inteligência Conversacional: O segredo para reduzir o no-show"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-deepBlue/50 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Conteúdo do E-mail (HTML permitido)</label>
                      <textarea
                        required={campaignTarget === 'email' || campaignTarget === 'both'}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="<h1>Olá!</h1><p>Confira nossa nova ferramenta...</p>"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-deepBlue/50 text-white h-48 font-mono"
                      />
                      <span className="text-[10px] text-slate-500">Nota: O rodapé e a logo oficial da Nexum AI serão adicionados automaticamente ao redor do seu conteúdo.</span>
                    </div>
                  </div>
                )}

                {/* WhatsApp Section inputs */}
                {(campaignTarget === 'whatsapp' || campaignTarget === 'both') && (
                  <div className="space-y-4 p-4 border border-white/5 bg-black/20 rounded-xl">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Phone size={12} /> Configuração do WhatsApp</h3>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Mensagem (Use {`{nome}`} para personalizar)</label>
                      <textarea
                        required={campaignTarget === 'whatsapp' || campaignTarget === 'both'}
                        value={whatsappText}
                        onChange={(e) => setWhatsappText(e.target.value)}
                        placeholder="Olá {nome}! Temos novidades incríveis de automação..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-deepBlue/50 text-white h-32"
                      />
                      <span className="text-[10px] text-slate-500">Limite sugerido: 350 caracteres para garantir excelente visualização de texto no celular.</span>
                    </div>
                  </div>
                )}

                {/* Success/Error States */}
                {campaignSuccess && <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-lg flex gap-2 items-start"><CheckCircle size={16} />{campaignSuccess}</div>}
                {campaignError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex gap-2 items-start"><AlertTriangle size={16} />{campaignError}</div>}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSendingCampaign}
                  className="w-full py-4 bg-deepBlue hover:bg-blue-600 text-white font-bold text-xs rounded-xl border border-blue-500/20 shadow-[0_0_20px_rgba(10,36,99,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSendingCampaign ? 'Disparando...' : 'Enviar Campanha Manual'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WHATSAPP INTEGRATION INFO */}
          {activeTab === 'whatsapp' && (
            <div className="bg-[#12141c] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">WhatsApp Business API Setup</h2>
                <p className="text-xs text-slate-500 mt-1">Veja os passos para integrar seu número comercial oficial ao painel de disparos.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-black/20 border border-white/5 rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-sm text-white">Passos para Configuração (Meta Cloud API)</h3>
                  
                  <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
                    <div className="flex gap-2">
                      <div className="w-5 h-5 rounded-full bg-deepBlue flex items-center justify-center text-white shrink-0 font-bold">1</div>
                      <p>Acesse o painel **Meta Developers** (`developers.facebook.com`) e crie um aplicativo empresarial do tipo **WhatsApp**.</p>
                    </div>

                    <div className="flex gap-2">
                      <div className="w-5 h-5 rounded-full bg-deepBlue flex items-center justify-center text-white shrink-0 font-bold">2</div>
                      <p>Vincule seu número comercial e configure o **ID de Telefone** (Phone Number ID) e o **Token de Acesso Permanente**.</p>
                    </div>

                    <div className="flex gap-2">
                      <div className="w-5 h-5 rounded-full bg-deepBlue flex items-center justify-center text-white shrink-0 font-bold">3</div>
                      <p>Insira as credenciais geradas nas variáveis de ambiente do Firebase Functions (`META_WHATSAPP_ACCESS_TOKEN` e `META_WHATSAPP_PHONE_NUMBER_ID`).</p>
                    </div>

                    <div className="flex gap-2">
                      <div className="w-5 h-5 rounded-full bg-deepBlue flex items-center justify-center text-white shrink-0 font-bold">4</div>
                      <p>*(Alternativa de Gateway local)*: Se preferir utilizar sistemas como Z-API ou Evolution API para disparos sem burocracia de Templates, insira as chaves da API nas variáveis correspondentes.</p>
                    </div>
                  </div>
                </div>

                {/* Simulated test API area */}
                <div className="border border-white/5 rounded-xl p-5 bg-black/40 space-y-4">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5"><Phone size={14} className="text-mint" /> Envio de Teste de Integração</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Número de Destino (Com DDD)</label>
                      <input
                        type="text"
                        placeholder="Ex: 27999999999"
                        className="w-full bg-[#15171e] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Mensagem de Teste</label>
                      <input
                        type="text"
                        placeholder="Esta é uma mensagem automática de teste do painel."
                        className="w-full bg-[#15171e] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-semibold hover:text-mint transition-colors">
                    Enviar WhatsApp de Teste
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/20 py-6 text-center text-xs text-slate-500">
        Nexum AI Campaign Manager &copy; 2026. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default App;

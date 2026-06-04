import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Paperclip, Mic, CheckCheck, Clock, Smile, Camera, ChevronLeft, ArrowLeft } from 'lucide-react';
import { Lead } from '../types';
import logoSolido from '../public/logo-solido.png';

const leads: Lead[] = [
  { id: '1', name: 'Fernanda Costa', avatar: 'https://picsum.photos/seed/fernanda/50/50', status: 'paid', lastMessage: 'Confirmado para amanhã!', time: '10:42', unread: 0 },
  { id: '2', name: 'Rafael Santos', avatar: 'https://picsum.photos/seed/rafael/50/50', status: 'pending', lastMessage: 'Vou ver, obrigado!', time: '10:30', unread: 2, tag: 'Follow-up agendado para 2h' },
  { id: '3', name: 'Dra. Juliana (Equipe)', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100', status: 'new', lastMessage: 'Agenda de hoje atualizada', time: '09:15', unread: 0 },
  { id: '4', name: 'Lucas Oliveira', avatar: 'https://picsum.photos/seed/lucas/50/50', status: 'paid', lastMessage: 'Obrigado pela atenção', time: 'Ontem', unread: 0 },
  { id: '5', name: 'Beatriz Lima', avatar: 'https://picsum.photos/seed/bia/50/50', status: 'paid', lastMessage: 'Obrigada pelo atendimento.', time: 'Ontem', unread: 0 },
];

const IconButton: React.FC<{ icon: React.ReactNode; className?: string }> = ({ icon, className = "" }) => (
  <button className={`p-1.5 md:p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all duration-200 ${className}`}>
    {icon}
  </button>
);

const WhatsAppDashboard: React.FC = () => {
  const [activeLead] = useState<Lead>(leads[0]);

  return (
    <div className="flex w-full h-[600px] md:h-[750px] bg-whatsappDark rounded-xl overflow-hidden shadow-2xl border border-white/5 text-sm md:text-base font-sans">
      {/* Sidebar - Compact on Mobile */}
      <div className="w-[60px] md:w-[350px] flex flex-col border-r border-white/10 bg-whatsappDark transition-all duration-300">
        {/* Header Sidebar */}
        <div className="h-14 md:h-16 bg-whatsappSidebar flex items-center justify-center md:justify-between px-2 md:px-4 shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-600 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
             <img src={logoSolido} alt="Me" className="w-full h-full object-contain bg-white p-1" />
          </div>
          <div className="hidden md:flex gap-1">
            <IconButton icon={<div className="w-5 h-5 border-2 border-dashed border-current rounded-full" />} />
            <IconButton icon={<MoreVertical size={20} />} />
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:block p-2 bg-whatsappDark border-b border-white/5">
          <div className="bg-whatsappSidebar rounded-lg h-9 flex items-center px-4 gap-3">
            <Search size={16} className="text-slate-400" />
            <span className="text-slate-400 text-sm">Pesquisar...</span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              className={`flex flex-col p-2 md:p-3 cursor-pointer hover:bg-[#2a3942] transition-colors border-b border-white/5 md:border-none ${lead.id === activeLead.id ? 'bg-[#2a3942]' : ''}`}
            >
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="relative shrink-0">
                  <img src={lead.avatar} alt={lead.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                  {/* Status dot for mobile only since we hide details */}
                  {lead.unread > 0 && (
                     <span className="absolute -top-1 -right-1 w-3 h-3 bg-mint rounded-full md:hidden border-2 border-whatsappDark"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0 hidden md:block">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-medium text-gray-200 truncate">{lead.name}</h3>
                    <span className={`text-xs ${lead.unread > 0 ? 'text-mint font-bold' : 'text-slate-500'}`}>{lead.time}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-400 truncate flex-1">{lead.lastMessage}</p>
                    {lead.unread > 0 && (
                      <span className="w-5 h-5 bg-mint text-whatsappDark text-xs rounded-full flex items-center justify-center font-bold ml-2">
                        {lead.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tags Section (Desktop only) */}
              <div className="hidden md:flex gap-2 mt-2 pl-[60px]">
                 {lead.status === 'paid' && (
                  <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-mint/10 border border-mint/20">
                    <span className="text-[10px] font-bold text-mint uppercase tracking-wide">Agendado</span>
                  </div>
                )}
                {lead.tag && (
                   <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 gap-1">
                     <Clock size={10} className="text-blue-400" />
                     <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">{lead.tag}</span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0b141a]">
        {/* Chat Header */}
        <div className="h-14 md:h-16 bg-whatsappSidebar flex items-center justify-between px-3 md:px-4 shadow-sm z-10 border-b border-white/5">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-white/5 p-1 -ml-1 rounded-lg transition-colors">
            {/* Mobile Back Button Simulation */}
            <div className="md:hidden text-slate-400">
                <ArrowLeft size={20} />
            </div>
            <img src={activeLead.avatar} alt={activeLead.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />
            <div className="flex flex-col">
              <span className="font-medium text-gray-200 text-sm md:text-base leading-tight">{activeLead.name}</span>
              <span className="text-[10px] md:text-xs text-mint font-semibold leading-tight">Paciente Recorrente</span>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <IconButton icon={<Video size={18} className="md:w-5 md:h-5" />} />
            <IconButton icon={<Phone size={18} className="md:w-5 md:h-5" />} />
            <div className="w-px h-5 bg-slate-600 mx-2 hidden md:block"></div>
            <IconButton icon={<Search size={20} />} className="hidden md:block" />
            <IconButton icon={<MoreVertical size={18} className="md:w-5 md:h-5" />} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-3 md:p-8 overflow-y-auto space-y-2 md:space-y-4" style={{ backgroundImage: 'radial-gradient(#2a3942 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          
          <div className="flex justify-center mb-4">
            <span className="bg-whatsappSidebar text-slate-300 text-[10px] md:text-xs py-1 px-2 md:px-3 rounded-lg shadow-sm border border-white/5 uppercase tracking-wide opacity-80">
              Hoje
            </span>
          </div>

          {/* Incoming (Client) - LEFT */}
          <div className="flex justify-start">
            <div className="bg-[#202c33] px-3 py-1.5 md:p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] md:max-w-[60%] border border-white/5 relative group">
              <p className="text-[13px] md:text-sm text-gray-200 leading-snug">Bom dia! Gostaria de saber se tem horário para Harmonização Facial para amanhã?</p>
              <span className="text-[9px] md:text-[10px] text-slate-500 block text-right mt-1 ml-2">10:30</span>
            </div>
          </div>

          {/* Outgoing (AI) - RIGHT */}
          <div className="flex justify-end">
            <div className="bg-[#005c4b] px-3 py-1.5 md:p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] md:max-w-[60%] relative border border-white/5">
              <p className="text-[13px] md:text-sm text-gray-100 leading-snug">Olá Fernanda! Temos sim. A Dra. Juliana tem um horário livre amanhã às 14h30 ou às 16h. Qual prefere?</p>
              <div className="flex items-end justify-end gap-1 mt-0.5 md:mt-1 ml-2">
                <span className="text-[9px] md:text-[10px] text-gray-300">10:31</span>
                <CheckCheck size={14} className="text-[#53bdeb] w-3 h-3 md:w-3.5 md:h-3.5" />
              </div>
            </div>
          </div>

          {/* Incoming (Client) - LEFT */}
          <div className="flex justify-start">
            <div className="bg-[#202c33] px-3 py-1.5 md:p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] md:max-w-[60%] border border-white/5 relative group">
              <p className="text-[13px] md:text-sm text-gray-200 leading-snug">Pode ser às 14h30 então.</p>
              <span className="text-[9px] md:text-[10px] text-slate-500 block text-right mt-1 ml-2">10:35</span>
            </div>
          </div>

          {/* Outgoing (AI System/Action) - RIGHT */}
           <div className="flex justify-end">
            <div className="bg-[#005c4b] px-3 py-1.5 md:p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] md:max-w-[60%] border border-white/5 relative">
              <p className="text-[13px] md:text-sm text-gray-100 leading-snug">Perfeito! Agendamento confirmado para amanhã às 14h30. ✅<br/><br/>Enviei as orientações pré-procedimento no seu email.</p>
              <div className="flex items-end justify-end gap-1 mt-0.5 md:mt-1 ml-2">
                <span className="text-[9px] md:text-[10px] text-gray-300">10:36</span>
                <CheckCheck size={14} className="text-[#53bdeb] w-3 h-3 md:w-3.5 md:h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="h-14 md:h-16 bg-whatsappSidebar px-2 md:px-4 flex items-center gap-1 md:gap-3 shrink-0">
          <IconButton icon={<Smile size={24} />} className="hidden md:block" />
          <IconButton icon={<MoreVertical size={20} />} className="md:hidden" />
          <IconButton icon={<Paperclip size={20} className="w-5 h-5 md:w-6 md:h-6" />} />
          <div className="flex-1 bg-[#2a3942] rounded-lg h-9 md:h-10 flex items-center px-3 md:px-4 cursor-text hover:bg-[#2a3942]/80 transition-colors mx-1">
             <span className="text-slate-400 text-xs md:text-sm truncate">Mensagem</span>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-mint rounded-full flex items-center justify-center text-whatsappDark shrink-0 shadow-lg">
             <Mic size={18} className="md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDashboard;
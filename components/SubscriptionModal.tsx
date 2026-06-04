import React, { useState } from 'react';
import { X, Mail, Phone, User, Check, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subscribeType, setSubscribeType] = useState<'email' | 'whatsapp' | 'both'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Por favor, informe seu nome.');
      setIsLoading(false);
      return;
    }

    if ((subscribeType === 'email' || subscribeType === 'both') && !email.trim()) {
      setError('Por favor, insira um e-mail válido.');
      setIsLoading(false);
      return;
    }

    if ((subscribeType === 'whatsapp' || subscribeType === 'both') && phone.replace(/\D/g, '').length < 10) {
      setError('Por favor, insira um WhatsApp válido com DDD.');
      setIsLoading(false);
      return;
    }

    try {
      const functionUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || 'https://subscribe-leads-api.nexumai.me/subscribeLead';
      const cleanPhone = phone.replace(/\D/g, '');

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: (subscribeType === 'email' || subscribeType === 'both') ? email.trim() : '',
          phone: (subscribeType === 'whatsapp' || subscribeType === 'both') ? cleanPhone : '',
          subscribeType,
          source: 'newsletter'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar a inscrição.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setEmail('');
        setPhone('');
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error('Subscription error:', err);
      // For testing offline, simulate success
      if (import.meta.env.DEV) {
        console.warn('Backend offline - simulando sucesso no ambiente de desenvolvimento.');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setName('');
          setEmail('');
          setPhone('');
          onClose();
        }, 3000);
      } else {
        setError(err.message || 'Erro de conexão. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md bg-[#0d0e12] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden font-sans"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-deepBlue/20 to-transparent pointer-events-none rounded-full blur-[80px]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all border border-white/5"
            >
              <X size={18} />
            </button>

            {/* Success State */}
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-16 h-16 bg-mint/20 border border-mint/40 text-mint rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,217,163,0.2)] animate-bounce">
                    <Check size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Inscrição Confirmada!</h3>
                  <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                    Excelente escolha! Você agora faz parte do nosso radar de novidades e receberá atualizações inteligentes em breve.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-mint w-5 h-5" />
                    <span className="text-xs font-mono font-bold text-mint uppercase tracking-wider">Nexum AI Radar</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Fique por dentro das novidades</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Receba análises exclusivas e propagandas de novas ferramentas de automação escritas automaticamente por nossa IA.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400">Seu Nome</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 text-slate-500 w-4.5 h-4.5" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Digite seu nome completo"
                          className="w-full bg-[#15171e] text-white text-sm rounded-xl pl-11 pr-4 py-3.5 border border-white/10 focus:border-deepBlue/50 focus:ring-1 focus:ring-deepBlue/20 focus:outline-none transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Subscription Channel Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Por onde quer receber novidades?</label>
                      <div className="grid grid-cols-3 gap-2 bg-[#15171e] p-1 rounded-xl border border-white/5">
                        <button
                          type="button"
                          onClick={() => setSubscribeType('email')}
                          className={`py-2 text-xs font-semibold rounded-lg transition-all ${subscribeType === 'email' ? 'bg-deepBlue text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                          E-mail
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubscribeType('whatsapp')}
                          className={`py-2 text-xs font-semibold rounded-lg transition-all ${subscribeType === 'whatsapp' ? 'bg-mint text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubscribeType('both')}
                          className={`py-2 text-xs font-semibold rounded-lg transition-all ${subscribeType === 'both' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-slate-400 hover:text-white'}`}
                        >
                          Ambos
                        </button>
                      </div>
                    </div>

                    {/* Conditional inputs */}
                    <AnimatePresence mode="popLayout">
                      {(subscribeType === 'email' || subscribeType === 'both') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1"
                        >
                          <label className="text-xs font-medium text-slate-400">E-mail</label>
                          <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 text-slate-500 w-4.5 h-4.5" />
                            <input
                              type="email"
                              autoComplete="email"
                              required={subscribeType === 'email' || subscribeType === 'both'}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="exemplo@clinica.com"
                              className="w-full bg-[#15171e] text-white text-sm rounded-xl pl-11 pr-4 py-3.5 border border-white/10 focus:border-deepBlue/50 focus:ring-1 focus:ring-deepBlue/20 focus:outline-none transition-all placeholder:text-slate-600"
                            />
                          </div>
                        </motion.div>
                      )}

                      {(subscribeType === 'whatsapp' || subscribeType === 'both') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1"
                        >
                          <label className="text-xs font-medium text-slate-400">WhatsApp</label>
                          <div className="relative flex items-center">
                            <Phone className="absolute left-3.5 text-slate-500 w-4.5 h-4.5" />
                            <input
                              type="tel"
                              autoComplete="tel"
                              required={subscribeType === 'whatsapp' || subscribeType === 'both'}
                              value={phone}
                              onChange={handlePhoneChange}
                              placeholder="(27) 99999-9999"
                              className="w-full bg-[#15171e] text-white text-sm rounded-xl pl-11 pr-4 py-3.5 border border-white/10 focus:border-deepBlue/50 focus:ring-1 focus:ring-deepBlue/20 focus:outline-none transition-all placeholder:text-slate-600"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error message */}
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {error}
                      </motion.p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 mt-2 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
                        subscribeType === 'whatsapp'
                          ? 'bg-mint hover:bg-[#00c090] text-black shadow-[0_0_20px_rgba(0,217,163,0.25)]'
                          : 'bg-deepBlue hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(10,36,99,0.3)]'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Inscrevendo...</span>
                        </>
                      ) : (
                        <span>Cadastrar no Radar</span>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;

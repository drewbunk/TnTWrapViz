
import React, { useState } from 'react';
import { Lead } from '../types';
import { Mail, Phone, User, MessageCircle, X } from 'lucide-react';

interface Props {
  type: 'capture' | 'limit';
  onClose: () => void;
  onSubmit: (lead: Lead) => void;
}

const LeadModal: React.FC<Props> = ({ type, onClose, onSubmit }) => {
  const [lead, setLead] = useState<Lead>({ name: '', email: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lead.name && lead.email && lead.phone) {
      onSubmit(lead);
    }
  };

  if (type === 'limit') {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-zinc-900 rounded-3xl p-10 border-2 border-red-600/30 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
           <div className="text-center space-y-6">
              <div className="inline-flex p-4 bg-red-600/10 rounded-full">
                <MessageCircle className="w-12 h-12 text-red-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-orbitron font-black text-white italic">DESIGN LIMIT REACHED</h2>
                <p className="text-zinc-400 leading-relaxed">
                  You've hit your free visualization limit. Ready to turn one of these designs into reality?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 pt-4">
                <a 
                  href="tel:1234567890"
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                  <Phone className="w-6 h-6" /> CALL US NOW
                </a>
                <a 
                  href="sms:1234567890?body=Hey, I'm interested in the AI design I just created!"
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                  <MessageCircle className="w-6 h-6" /> TEXT PROJECT MANAGER
                </a>
                <button 
                  onClick={onClose}
                  className="text-zinc-600 text-xs font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors"
                >
                  KEEP EXPLORING
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
        <div className="bg-gradient-to-r from-red-600 to-purple-600 p-8 text-center">
          <h2 className="text-2xl font-orbitron font-black text-white italic leading-tight">UNLOCK PRO GALLERY</h2>
          <p className="text-white/80 text-sm mt-2">Enter your info to save and share your creations!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
              <input 
                required
                type="text" 
                placeholder="Your Full Name" 
                value={lead.name}
                onChange={e => setLead({...lead, name: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
              <input 
                required
                type="email" 
                placeholder="Email Address" 
                value={lead.email}
                onChange={e => setLead({...lead, email: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
              <input 
                required
                type="tel" 
                placeholder="Phone Number" 
                value={lead.phone}
                onChange={e => setLead({...lead, phone: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-white text-zinc-950 font-black rounded-xl hover:bg-red-600 hover:text-white transition-all transform active:scale-95"
          >
            CONTINUE CREATING
          </button>
          
          <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest font-bold">
            BY SUBMITTING, YOU AGREE TO OUR TERMS & PRICING
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;

"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [flow, setFlow] = useState<'pratiquant' | 'pro'>('pratiquant');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Show popup after 3 seconds
    const hasSeen = localStorage.getItem('handiboost_newsletter_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('handiboost_newsletter_seen', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log(`Subscribed ${email} to ${flow} newsletter`);
    handleClose();
    alert('Merci pour votre inscription à la newsletter !');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="bg-blue-600 p-8 text-white text-center">
          <h2 className="text-3xl font-black mb-2">Recevoir la newsletter</h2>
          <p className="text-blue-100 font-medium text-lg">Chaque mois, l'essentiel de l'Activité Physique Adaptée dans votre boîte mail.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-3">Je suis :</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${flow === 'pratiquant' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="flow" value="pratiquant" checked={flow === 'pratiquant'} onChange={() => setFlow('pratiquant')} className="sr-only" />
                🙋‍♀️ Pratiquant
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${flow === 'pro' ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="flow" value="pro" checked={flow === 'pro'} onChange={() => setFlow('pro')} className="sr-only" />
                🩺 Professionnel
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Mon adresse e-mail</label>
            <Input 
              id="email" 
              type="email" 
              required 
              placeholder="votre@email.com" 
              className="h-14 text-lg border-2 border-slate-200 focus:border-blue-600 focus:ring-blue-600 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
            S'inscrire
          </Button>
        </form>
      </div>
    </div>
  );
}

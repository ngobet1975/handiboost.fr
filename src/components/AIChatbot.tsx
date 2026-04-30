'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, User, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Bonjour ! Je suis l'Assistant Handiboost. Je suis là pour répondre à vos questions sur le sport adapté, l'accessibilité, ou le fonctionnement de la plateforme. Comment puis-je vous aider aujourd'hui ?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de communication avec l'API");
      }

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text || "Désolé, je n'ai pas pu générer de réponse.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Oups, une erreur est survenue de mon côté. Veuillez réessayer plus tard.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-800 hover:bg-blue-900 text-white rounded-full py-3 px-4 shadow-2xl border-4 border-white transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(30,64,175,0.3)] flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-blue-300 group"
          aria-label="Ouvrir l'assistant Handiboost"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-blue-100 shadow-inner relative">
            <div className="absolute inset-0 bg-[url('/mascotte-ia.png')] bg-cover bg-center group-hover:scale-110 transition-transform duration-500" />
          </div>
          <span className="hidden md:inline font-black text-xl pr-2 tracking-wide">Une question ?</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full ${isExpanded ? 'md:w-[800px] md:h-[80vh]' : 'md:w-[420px] md:h-[650px]'} h-[100dvh] max-h-[100dvh] bg-white md:rounded-[2rem] shadow-2xl flex flex-col border-4 border-blue-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-300 transition-all`}>
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-800 to-purple-800 text-white p-5 flex items-center justify-between shrink-0 overflow-hidden">
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-lg border-2 border-blue-200 flex items-center justify-center overflow-hidden relative">
                 <div className="absolute inset-0 bg-[url('/mascotte-ia.png')] bg-cover bg-center" />
              </div>
              <div>
                <h3 className="font-black text-2xl leading-tight drop-shadow-md">Assistant IA</h3>
                <p className="text-blue-100 text-sm font-bold flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" /> Pose-moi tes questions !
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative z-10 text-blue-100 hover:text-white hover:bg-white/20 p-2.5 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-white hidden md:block"
                aria-label={isExpanded ? "Réduire" : "Agrandir"}
              >
                {isExpanded ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 text-blue-100 hover:text-white hover:bg-white/20 p-2.5 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Fermer"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-800'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                <div
                  className={`p-4 rounded-2xl text-[15px] shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-800 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none prose prose-slate prose-p:leading-relaxed prose-strong:text-blue-700 prose-strong:font-extrabold prose-li:marker:text-blue-600 prose-li:marker:font-bold prose-ul:bg-blue-50/50 prose-ul:p-4 prose-ul:rounded-xl prose-ul:border prose-ul:border-blue-100/50 prose-ol:bg-blue-50/50 prose-ol:p-4 prose-ol:rounded-xl prose-ol:border prose-ol:border-blue-100/50 max-w-none'
                  }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {msg.role === 'user' ? (
                    msg.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i !== msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => {
                          const isExternal = props.href?.startsWith('http') && !props.href.includes('handiboost.fr');
                          return (
                            <a
                              {...props}
                              target={isExternal ? "_blank" : undefined}
                              rel={isExternal ? "noopener noreferrer" : undefined}
                            />
                          );
                        }
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-blue-100 text-blue-800">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-slate-500 font-medium text-sm animate-pulse">L'assistant réfléchit...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Posez votre question ici..."
                className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl py-3 pl-4 pr-12 text-[15px] resize-none focus:outline-none transition-colors"
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
                aria-label="Votre message"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2.5 rounded-xl bg-blue-600 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Envoyer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-center text-[11px] font-medium text-slate-400 mt-3">
              L'IA peut faire des erreurs. Vérifiez toujours les informations importantes.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

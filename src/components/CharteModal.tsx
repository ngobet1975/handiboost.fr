'use client'

import React from 'react'
import { X, Check, ShieldCheck } from 'lucide-react'

export function CharteModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 max-w-2xl w-full border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Charte d'engagement Handiboost</h2>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-700">
          <p className="font-bold text-slate-900">
            En rejoignant le Guide Booster, vous vous engagez à respecter les principes fondamentaux de notre réseau pour garantir un accueil et une pratique de qualité aux personnes en situation de handicap.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Accessibilité et Accueil</h3>
          <ul className="space-y-2 mb-6 list-disc pl-5">
            <li>Garantir un accueil bienveillant, inclusif et sans discrimination.</li>
            <li>Fournir des informations transparentes et à jour concernant l'accessibilité de vos infrastructures (rampes, ascenseurs, sanitaires adaptés).</li>
            <li>Proposer un accompagnement ou une pratique adaptée aux besoins spécifiques déclarés par le pratiquant.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Qualification et Encadrement</h3>
          <ul className="space-y-2 mb-6 list-disc pl-5">
            <li>Disposer des qualifications requises (diplômes APA, diplômes fédéraux sport handicap) pour encadrer le public spécifique.</li>
            <li>Maintenir à jour ses connaissances sur les pathologies et les besoins liés au handicap.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Transparence et Mise à jour</h3>
          <ul className="space-y-2 mb-6 list-disc pl-5">
            <li>S'engager à mettre à jour régulièrement les informations de la structure (au moins une fois par an).</li>
            <li>Répondre dans des délais raisonnables aux prises de contact issues de la plateforme.</li>
          </ul>

          <p className="mt-8 text-sm italic text-slate-500">
            Handiboost se réserve le droit de suspendre ou retirer toute structure ne respectant pas ces engagements, suite à des signalements d'utilisateurs.
          </p>
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Check className="w-5 h-5" /> J'ai compris
          </button>
        </div>
      </div>
    </div>
  )
}

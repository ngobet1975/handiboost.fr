'use client'

import dynamic from 'next/dynamic'

const HandiAssistant = dynamic(() => import('@/components/HandiAssistant'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[88vh] rounded-[28px] bg-[#0c0c1d] flex items-center justify-center border border-slate-800">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
            <path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>
          </svg>
        </div>
        <p className="text-white/70 font-bold text-lg">Chargement de HandiAssistant…</p>
      </div>
    </div>
  ),
})

export function HandiAssistantLoader() {
  return <HandiAssistant />
}

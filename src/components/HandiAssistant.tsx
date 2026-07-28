'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Mic, MicOff, Send, Volume2, VolumeX, Bot, Loader2, MapPin, Phone, Globe, RotateCcw } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick suggestions (big accessible tiles)
// ─────────────────────────────────────────────────────────────────────────────
const QUICK = [
  { icon: '🏊', label: 'Club sportif', text: 'Je cherche un club de sport adapté à mon handicap près de chez moi' },
  { icon: '🏠', label: 'À domicile', text: 'Je voudrais pratiquer une activité à mon domicile, un club qui se déplace' },
  { icon: '🦽', label: 'Fauteuil', text: 'Je suis en fauteuil roulant, quels sports puis-je pratiquer ?' },
  { icon: '👁️', label: 'Malvoyant', text: 'Je suis malvoyant ou aveugle, quelles activités sportives puis-je faire ?' },
  { icon: '🧠', label: 'Handicap cognitif', text: 'Je cherche un sport adapté au handicap mental ou cognitif' },
  { icon: '❓', label: 'Aide-moi !', text: 'Je ne sais pas par où commencer, aidez-moi à trouver une activité' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Markdown renderer
// ─────────────────────────────────────────────────────────────────────────────
let _k = 0
function key() { return ++_k }

function processInline(str: string, textColor: string): React.ReactNode[] {
  const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g
  const parts: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null

  while ((m = regex.exec(str)) !== null) {
    if (m.index > last) parts.push(<span key={key()}>{str.slice(last, m.index)}</span>)
    if (m[0].startsWith('**')) {
      parts.push(<strong key={key()} style={{ fontWeight: 900 }}>{m[1]}</strong>)
    } else {
      const href = m[3]
      const label = m[2]
      const isExt = href.startsWith('http') || href.startsWith('mailto')
      parts.push(
        isExt
          ? <a key={key()} href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd', textDecoration: 'underline', fontWeight: 700 }}>{label}</a>
          : <Link key={key()} href={href} style={{ color: '#93c5fd', textDecoration: 'underline', fontWeight: 700 }}>{label}</Link>
      )
    }
    last = regex.lastIndex
  }
  if (last < str.length) parts.push(<span key={key()}>{str.slice(last)}</span>)
  return parts
}

function renderMarkdown(text: string, textColor: string): React.ReactNode {
  const lines = text.split('\n')
  const out: React.ReactNode[] = []
  let listBuf: React.ReactNode[] = []

  const flush = () => {
    if (listBuf.length) {
      out.push(<ul key={key()} style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>{listBuf}</ul>)
      listBuf = []
    }
  }

  for (const line of lines) {
    if (line.match(/^[-•▸] /)) {
      listBuf.push(
        <li key={key()} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ color: '#818cf8', flexShrink: 0, marginTop: 3, fontSize: 12 }}>▸</span>
          <span>{processInline(line.slice(2), textColor)}</span>
        </li>
      )
    } else {
      flush()
      if (line.trim() === '') {
        out.push(<div key={key()} style={{ height: 6 }} />)
      } else {
        out.push(<p key={key()} style={{ margin: '2px 0', lineHeight: 1.65 }}>{processInline(line, textColor)}</p>)
      }
    }
  }
  flush()
  return <>{out}</>
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function HandiAssistant() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    text: 'Bonjour ! 👋 Je suis **HandiAssistant**.\n\nJe suis là pour vous aider à trouver une activité sportive adaptée à votre situation.\n\nComment puis-je vous aider ?',
  }])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [listening, setListening]   = useState(false)
  const [tts, setTts]               = useState(false)
  const [speakId, setSpeakId]       = useState<string | null>(null)
  const [fontSize, setFontSize]     = useState<0 | 1 | 2>(0) // 0=normal 1=large 2=huge
  const [contrast, setContrast]     = useState(false)
  const [lightMode, setLightMode]   = useState(false)
  const [showQuick, setShowQuick]   = useState(true)

  const chatRef   = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)
  const recogRef  = useRef<any>(null)
  const inputSnap = useRef('')

  useEffect(() => { inputSnap.current = input }, [input])

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // ── TTS via Gemini ──────────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string, id: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    window.speechSynthesis?.cancel()
    setSpeakId(id)

    const clean = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/[▸•]/g, '')
      .trim()

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean }),
      })
      const data = await res.json()

      if (data.audio) {
        // Décoder base64 PCM 24kHz 16-bit mono → WAV jouable
        const binary = atob(data.audio)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
        const sampleRate = 24000
        const wav = new ArrayBuffer(44 + bytes.length)
        const v = new DataView(wav)
        const s = (o: number, str: string) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)) }
        s(0, 'RIFF'); v.setUint32(4, 36 + bytes.length, true); s(8, 'WAVE')
        s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true)
        v.setUint16(22, 1, true); v.setUint32(24, sampleRate, true)
        v.setUint32(28, sampleRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
        s(36, 'data'); v.setUint32(40, bytes.length, true)
        new Uint8Array(wav).set(bytes, 44)
        const url = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }))
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onended = () => { setSpeakId(null); URL.revokeObjectURL(url) }
        audio.onerror = () => { setSpeakId(null); URL.revokeObjectURL(url) }
        await audio.play()
        return
      }
    } catch (e) {
      console.warn('[TTS] Gemini TTS échoué, fallback navigateur', e)
    }

    // Fallback SpeechSynthesis
    if (!('speechSynthesis' in window)) { setSpeakId(null); return }
    const u = new SpeechSynthesisUtterance(clean)
    u.lang = 'fr-FR'; u.rate = 0.88; u.pitch = 1.05
    u.onstart = () => setSpeakId(id)
    u.onend = () => setSpeakId(null)
    u.onerror = () => setSpeakId(null)
    const voices = window.speechSynthesis.getVoices()
    const fr = voices.find(v => v.lang.startsWith('fr'))
    if (fr) u.voice = fr
    window.speechSynthesis.speak(u)
  }, [])

  const stopSpeak = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    window.speechSynthesis?.cancel()
    setSpeakId(null)
  }

  // ── STT ────────────────────────────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('La dictée vocale n\'est disponible que sur Chrome et Safari.'); return }

    if (listening) { recogRef.current?.stop(); return }

    const r = new SR()
    r.lang = 'fr-FR'
    r.continuous = false
    r.interimResults = true
    r.onresult = (e: any) => {
      const t = Array.from(e.results).map((x: any) => x[0].transcript).join('')
      setInput(t)
      inputSnap.current = t
    }
    r.onend = () => {
      setListening(false)
      const val = inputSnap.current.trim()
      if (val) setTimeout(() => sendMsg(val), 100)
    }
    r.onerror = () => setListening(false)
    recogRef.current = r
    r.start()
    setListening(true)
  }, [listening]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Send ───────────────────────────────────────────────────────────────────
  const sendMsg = useCallback(async (text: string) => {
    const t = text.trim()
    if (!t || loading) return

    const uid = crypto.randomUUID()
    const userMsg: Message = { id: uid, role: 'user', text: t }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    inputSnap.current = ''
    setLoading(true)
    setShowQuick(false)

    try {
      const hist = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, text: m.text }))

      const res = await fetch('/api/chat-activite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t, history: hist }),
      })
      const data = await res.json()
      const reply = data.text || data.error || 'Je n\'ai pas pu générer une réponse. Veuillez réessayer.'

      const aid = crypto.randomUUID()
      const aMsg: Message = { id: aid, role: 'assistant', text: reply }
      setMessages(prev => [...prev, aMsg])
      if (tts) speak(reply, aid)
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: 'assistant',
        text: '😕 Désolé, une erreur est survenue. Pouvez-vous réessayer ?',
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [messages, loading, tts, speak])

  const reset = () => {
    stopSpeak()
    setMessages([{ id: 'welcome', role: 'assistant', text: 'Bonjour ! 👋 Je suis **HandiAssistant**.\n\nJe suis là pour vous aider à trouver une activité sportive adaptée à votre situation.\n\nComment puis-je vous aider ?' }])
    setInput('')
    setShowQuick(true)
  }

  // ── Theme ────────────────────────────────────────────────────────────────────────
  // Contraste élevé prime sur tout
  const C = contrast ? {
    bg:       '#000000',
    chat:     '#050505',
    aBar:     '#111111',
    aBubble:  '#1a1a1a',
    aBorder:  '#ffffff',
    uBubble:  '#0000cc',
    text:     '#ffffff',
    sub:      '#aaaaaa',
    accent:   '#ffff00',
    inp:      '#1a1a1a',
    inpBord:  '#ffffff',
    btnBg:    '#222222',
    btnBord:  '#ffffff',
  } : lightMode ? {
    // ☀️ Mode clair
    bg:       '#f4f6fb',
    chat:     'transparent',
    aBar:     'rgba(255,255,255,0.85)',
    aBubble:  '#ffffff',
    aBorder:  'rgba(99,102,241,0.18)',
    uBubble:  'rgba(99,102,241,0.88)',
    text:     '#1e1e3a',
    sub:      '#64748b',
    accent:   '#6366f1',
    inp:      '#ffffff',
    inpBord:  'rgba(99,102,241,0.28)',
    btnBg:    'rgba(99,102,241,0.08)',
    btnBord:  'rgba(99,102,241,0.22)',
  } : {
    // 🌙 Mode sombre (défaut)
    bg:       '#0c0c1d',
    chat:     'transparent',
    aBar:     'rgba(255,255,255,0.04)',
    aBubble:  'rgba(255,255,255,0.07)',
    aBorder:  'rgba(255,255,255,0.13)',
    uBubble:  'rgba(99,102,241,0.82)',
    text:     '#f0f0ff',
    sub:      'rgba(255,255,255,0.55)',
    accent:   '#818cf8',
    inp:      'rgba(255,255,255,0.07)',
    inpBord:  'rgba(255,255,255,0.16)',
    btnBg:    'rgba(255,255,255,0.08)',
    btnBord:  'rgba(255,255,255,0.16)',
  }

  const FS = [16, 21, 27][fontSize]
  const fontLabel = ['Aa', 'AA', 'AAA'][fontSize]
  const fontTitle = ['Texte normal', 'Grand texte', 'Très grand texte'][fontSize]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Keyframes ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hOrb1  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.1)} }
        @keyframes hOrb2  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,30px) scale(0.95)} }
        @keyframes hOrb3  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,20px) scale(1.05)} }
        @keyframes hPing  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes hSlide { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hDot   { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }
        @keyframes hSpin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes hPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .h-orb1{animation:hOrb1 9s ease-in-out infinite}
        .h-orb2{animation:hOrb2 13s ease-in-out infinite}
        .h-orb3{animation:hOrb3 11s ease-in-out infinite}
        .h-ping{animation:hPing 1.6s cubic-bezier(.2,.6,.4,1) infinite}
        .h-ping2{animation:hPing 1.6s cubic-bezier(.2,.6,.4,1) infinite;animation-delay:.55s}
        .h-slide{animation:hSlide .38s ease-out forwards}
        .h-dot{animation:hDot 1.4s ease-in-out infinite}
        .h-dot:nth-child(2){animation-delay:.16s}
        .h-dot:nth-child(3){animation-delay:.32s}
        .h-spin{animation:hSpin 1s linear infinite}
        .h-pulse{animation:hPulse 1.2s ease-in-out infinite}
        .h-btn:hover{filter:brightness(1.15);transform:scale(1.04)}
        .h-quick:hover{border-color:#6366f1 !important;background:rgba(99,102,241,0.18) !important;transform:translateY(-3px)}
        .h-quick:focus{outline:3px solid #818cf8;outline-offset:3px}
        textarea:focus{outline:none}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:8px}
      `}</style>

      <div style={{ background: C.bg, borderRadius: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '88vh', position: 'relative', fontSize: FS }}>

        {/* ── Animated orbs background ───────────────────────────────────── */}
        {!contrast && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <div className="h-orb1" style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: lightMode ? 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)', top: -150, left: -100 }} />
            <div className="h-orb2" style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: lightMode ? 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)', bottom: 80, right: -80 }} />
            <div className="h-orb3" style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: lightMode ? 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 65%)', bottom: -60, left: '35%' }} />
          </div>
        )}

        {/* ── Accessibility / Header bar ─────────────────────────────────── */}
        <div role="banner" style={{ position: 'relative', zIndex: 10, background: C.aBar, borderBottom: `1px solid ${C.inpBord}`, backdropFilter: 'blur(16px)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <Bot size={20} color="white" />
            </div>
            <div>
              <div style={{ color: C.text, fontWeight: 900, fontSize: '1.1em', lineHeight: 1.2, letterSpacing: '-0.3px' }}>HandiAssistant</div>
              <div style={{ color: C.sub, fontSize: '0.72em', fontWeight: 600 }}>Assistant IA · Sport adapté</div>
            </div>
          </div>

          {/* Controls */}
          <div role="toolbar" aria-label="Options d'accessibilité" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>

            {/* TTS */}
            <button
              onClick={() => { if (tts) stopSpeak(); setTts(p => !p) }}
              aria-label={tts ? 'Désactiver la lecture vocale automatique' : 'Activer la lecture vocale automatique'}
              aria-pressed={tts}
              title={tts ? 'Voix automatique : activée' : 'Activer la voix automatique'}
              className="h-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: tts ? 'rgba(99,102,241,0.28)' : C.btnBg, border: `1.5px solid ${tts ? '#6366f1' : C.btnBord}`, color: tts ? '#a5b4fc' : C.sub, fontWeight: 700, fontSize: '0.78em', cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap' }}>
              {tts ? <Volume2 size={15} /> : <VolumeX size={15} />}
              {tts ? '🔊 Voix ON' : '🔇 Voix'}
            </button>

            {/* Font size */}
            <button
              onClick={() => setFontSize(p => ((p + 1) % 3) as 0 | 1 | 2)}
              aria-label={`Taille du texte : ${fontTitle}. Cliquez pour changer`}
              title={fontTitle}
              className="h-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: fontSize > 0 ? 'rgba(99,102,241,0.28)' : C.btnBg, border: `1.5px solid ${fontSize > 0 ? '#6366f1' : C.btnBord}`, color: fontSize > 0 ? '#a5b4fc' : C.sub, fontWeight: 900, fontSize: '0.78em', cursor: 'pointer', transition: 'all 0.18s' }}>
              {fontLabel}
            </button>

            {/* High contrast */}
            <button
              onClick={() => setContrast(p => !p)}
              aria-label={contrast ? 'Désactiver le contraste élevé' : 'Activer le contraste élevé (fond noir, texte blanc)'}
              aria-pressed={contrast}
              title="Contraste élevé"
              className="h-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: contrast ? '#ffffff' : C.btnBg, border: `1.5px solid ${contrast ? '#ffffff' : C.btnBord}`, color: contrast ? '#000000' : C.sub, fontWeight: 700, fontSize: '0.78em', cursor: 'pointer', transition: 'all 0.18s' }}>
              <span style={{ fontSize: '1.1em' }}>&#9680;</span> Contraste
            </button>

            {/* Light / Dark toggle */}
            {!contrast && (
              <button
                onClick={() => setLightMode(p => !p)}
                aria-label={lightMode ? 'Passer en mode sombre' : 'Passer en mode clair'}
                aria-pressed={lightMode}
                title={lightMode ? 'Mode sombre' : 'Mode clair'}
                className="h-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: lightMode ? 'rgba(251,191,36,0.18)' : C.btnBg, border: `1.5px solid ${lightMode ? '#fbbf24' : C.btnBord}`, color: lightMode ? '#f59e0b' : C.sub, fontWeight: 700, fontSize: '0.82em', cursor: 'pointer', transition: 'all 0.18s' }}>
                <span style={{ fontSize: '1.15em' }}>{lightMode ? '🌙' : '☀️'}</span>
                {lightMode ? 'Sombre' : 'Clair'}
              </button>
            )}

            {/* Reset */}
            <button
              onClick={reset}
              aria-label="Recommencer une nouvelle conversation"
              title="Nouvelle conversation"
              className="h-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', background: C.btnBg, border: `1.5px solid ${C.btnBord}`, color: C.sub, cursor: 'pointer', transition: 'all 0.18s', flexShrink: 0 }}>
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* ── Chat area ─────────────────────────────────────────────────────── */}
        <div
          ref={chatRef}
          role="log"
          aria-label="Conversation avec HandiAssistant"
          aria-live="polite"
          aria-relevant="additions"
          style={{ position: 'relative', zIndex: 5, flex: 1, overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className="h-slide">
              {msg.role === 'assistant' ? (
                // ── Assistant bubble ─────────────────────────────────────────
                <div style={{ display: 'flex', gap: 14, maxWidth: '78%' }}>
                  {/* Avatar */}
                  <div aria-hidden="true" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4, boxShadow: '0 0 14px rgba(99,102,241,0.35)' }}>
                    <Bot size={18} color="white" />
                  </div>

                  <div>
                    <div
                      role="article"
                      aria-label="Réponse de HandiAssistant"
                      style={{ background: C.aBubble, border: `1px solid ${C.aBorder}`, borderRadius: '6px 20px 20px 20px', padding: '16px 20px', backdropFilter: contrast ? 'none' : 'blur(12px)', color: C.text, lineHeight: 1.65 }}>
                      {renderMarkdown(msg.text, C.text)}
                    </div>

                    {/* Read button */}
                    <button
                      onClick={() => speakId === msg.id ? stopSpeak() : speak(msg.text, msg.id)}
                      aria-label={speakId === msg.id ? 'Arrêter la lecture' : 'Lire ce message à voix haute'}
                      style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: '0.72em', fontWeight: 700, background: speakId === msg.id ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)', border: `1px solid ${speakId === msg.id ? '#6366f1' : C.aBorder}`, color: speakId === msg.id ? '#a5b4fc' : C.sub, cursor: 'pointer', transition: 'all 0.18s' }}>
                      <Volume2 size={12} />
                      {speakId === msg.id ? <><span className="h-pulse">●</span> Lecture…</> : 'Écouter'}
                    </button>
                  </div>
                </div>
              ) : (
                // ── User bubble ───────────────────────────────────────────────
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div
                    role="article"
                    aria-label="Votre message"
                    style={{ background: C.uBubble, borderRadius: '20px 6px 20px 20px', padding: '14px 20px', maxWidth: '72%', color: '#ffffff', fontWeight: 500, backdropFilter: contrast ? 'none' : 'blur(12px)', lineHeight: 1.6 }}>
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ── Quick suggestions ─────────────────────────────────────────── */}
          {showQuick && (
            <div className="h-slide" style={{ animationDelay: '0.25s' }}>
              <p style={{ color: C.sub, fontSize: '0.82em', fontWeight: 700, marginBottom: 14, letterSpacing: '0.02em' }}>
                OU CHOISISSEZ UNE SITUATION :
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                {QUICK.map(s => (
                  <button
                    key={s.label}
                    onClick={() => sendMsg(s.text)}
                    aria-label={s.text}
                    className="h-quick"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 12px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${C.aBorder}`, color: C.text, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', fontWeight: 700, fontSize: '0.85em' }}>
                    <span role="img" aria-hidden="true" style={{ fontSize: '2.2em' }}>{s.icon}</span>
                    <span style={{ lineHeight: 1.3 }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Typing indicator ─────────────────────────────────────────── */}
          {loading && (
            <div className="h-slide" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div aria-hidden="true" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(99,102,241,0.35)' }}>
                <Bot size={18} color="white" />
              </div>
              <div role="status" aria-label="HandiAssistant est en train de répondre…" style={{ background: C.aBubble, border: `1px solid ${C.aBorder}`, borderRadius: '6px 20px 20px 20px', padding: '20px 24px', backdropFilter: 'blur(12px)', display: 'flex', gap: 7, alignItems: 'center' }}>
                {[0,1,2].map(i => <div key={i} className="h-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: C.sub }} />)}
              </div>
            </div>
          )}

          <div aria-hidden="true" />
        </div>

        {/* ── Input bar ──────────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 10, borderTop: `1px solid ${C.inpBord}`, padding: '16px 20px 20px', background: C.aBar, backdropFilter: contrast ? 'none' : 'blur(16px)' }}>

          {/* Listening indicator */}
          {listening && (
            <div role="status" aria-live="assertive" style={{ textAlign: 'center', marginBottom: 10, fontSize: '0.8em', fontWeight: 700, color: '#f87171' }} className="h-pulse">
              🎤 Dictée en cours — Parlez clairement maintenant
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>

            {/* ── Microphone ──────────────────────────────────────────────── */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {listening && (
                <>
                  <div className="h-ping"  style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(239,68,68,0.45)' }} />
                  <div className="h-ping2" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(239,68,68,0.25)' }} />
                </>
              )}
              <button
                onClick={toggleMic}
                aria-label={listening ? 'Arrêter la dictée vocale. Votre texte sera envoyé automatiquement.' : 'Démarrer la dictée vocale. Pratique si vous ne pouvez pas taper au clavier.'}
                aria-pressed={listening}
                title={listening ? 'Arrêter la dictée' : 'Dicter un message (sans clavier)'}
                style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', border: `2px solid ${listening ? '#ef4444' : C.inpBord}`, background: listening ? 'rgba(239,68,68,0.88)' : C.inp, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
                {listening ? <MicOff size={24} color="white" /> : <Mic size={24} color={C.text} />}
              </button>
            </div>

            {/* ── Textarea ─────────────────────────────────────────────────── */}
            <div style={{ flex: 1, position: 'relative' }}>
              <label htmlFor="handi-input" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
                Votre message à HandiAssistant. Appuyez sur Entrée pour envoyer.
              </label>
              <textarea
                id="handi-input"
                ref={inputRef}
                value={input}
                rows={1}
                onChange={e => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px'
                }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(input) } }}
                placeholder={listening ? '🎤 Dictée active…' : 'Tapez votre message… ou utilisez le 🎤 micro'}
                aria-placeholder="Tapez votre message ou utilisez le micro pour dicter"
                style={{ width: '100%', resize: 'none', overflow: 'hidden', background: C.inp, border: `1.5px solid ${C.inpBord}`, borderRadius: 18, padding: '14px 18px', color: C.text, fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 500, lineHeight: 1.5, minHeight: 56, outline: 'none', transition: 'border-color 0.2s', caretColor: '#818cf8' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = C.inpBord}
              />
            </div>

            {/* ── Send button ───────────────────────────────────────────────── */}
            <button
              onClick={() => sendMsg(input)}
              disabled={!input.trim() || loading}
              aria-label="Envoyer le message"
              title="Envoyer (ou appuyez sur Entrée)"
              style={{ width: 56, height: 56, borderRadius: '50%', border: 'none', flexShrink: 0, background: input.trim() && !loading ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : C.inp, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', transition: 'all 0.2s', opacity: input.trim() && !loading ? 1 : 0.45, boxShadow: input.trim() && !loading ? '0 0 20px rgba(99,102,241,0.45)' : 'none' }}>
              {loading
                ? <Loader2 size={24} color="white" className="h-spin" />
                : <Send size={22} color="white" />}
            </button>
          </div>

          {/* Footer hint */}
          <p role="note" style={{ marginTop: 10, textAlign: 'center', color: C.sub, fontSize: '0.7em', fontWeight: 600 }}>
            {listening
              ? '🎤 En cours d\'écoute — arrêtez pour envoyer automatiquement'
              : <><kbd style={{ background: 'rgba(255,255,255,0.12)', border: `1px solid ${C.inpBord}`, borderRadius: 5, padding: '1px 6px', fontSize: '0.9em' }}>Entrée</kbd> pour envoyer &nbsp;·&nbsp; <kbd style={{ background: 'rgba(255,255,255,0.12)', border: `1px solid ${C.inpBord}`, borderRadius: 5, padding: '1px 6px', fontSize: '0.9em' }}>Maj+Entrée</kbd> saut de ligne &nbsp;·&nbsp; 🎤 micro pour dicter sans clavier</>}
          </p>
        </div>
      </div>
    </>
  )
}

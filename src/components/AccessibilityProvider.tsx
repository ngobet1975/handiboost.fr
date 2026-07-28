'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

export interface AccessSettings {
  dyslexia: boolean
  epilepsy: boolean
  motor: boolean
  concentration: boolean
  tts: boolean
  ttsSpeed: number
  ttsPitch: number
  highContrast: boolean
  largeCursor: boolean
  highlightLinks: boolean
  leftAlign: boolean
  textSize: number
  letterSpacing: number
}

const defaultSettings: AccessSettings = {
  dyslexia: false,
  epilepsy: false,
  motor: false,
  concentration: false,
  tts: false,
  ttsSpeed: 1.0,
  ttsPitch: 1.0,
  highContrast: false,
  largeCursor: false,
  highlightLinks: false,
  leftAlign: false,
  textSize: 100,
  letterSpacing: 0,
}

interface AccessContextType {
  settings: AccessSettings
  updateSetting: <K extends keyof AccessSettings>(key: K, value: AccessSettings[K]) => void
}

const AccessContext = createContext<AccessContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
})

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessSettings>(defaultSettings)
  const [isMounted, setIsMounted] = useState(false)
  
  // Lecture du curseur pour le mode concentration
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Chargement depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hb-accessibility')
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) })
      } catch (e) {
        console.error(e)
      }
    }
    setIsMounted(true)
  }, [])

  // Sauvegarde et application des classes globales
  useEffect(() => {
    if (!isMounted) return
    localStorage.setItem('hb-accessibility', JSON.stringify(settings))

    const root = document.documentElement
    root.classList.toggle('access-dyslexia', settings.dyslexia)
    root.classList.toggle('access-epilepsy', settings.epilepsy)
    root.classList.toggle('access-motor', settings.motor)
    root.classList.toggle('access-high-contrast', settings.highContrast)
    root.classList.toggle('access-large-cursor', settings.largeCursor)
    root.classList.toggle('access-highlight-links', settings.highlightLinks)
    root.classList.toggle('access-left-align', settings.leftAlign)
    
    // Variables CSS dynamiques
    root.style.setProperty('--access-text-size', `${settings.textSize}%`)
    root.style.setProperty('--access-letter-spacing', `${settings.letterSpacing}px`)
  }, [settings, isMounted])

  const updateSetting = useCallback(<K extends keyof AccessSettings>(key: K, value: AccessSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  // ── Mode Concentration (Bande de lecture) ──────────────────────────────────
  useEffect(() => {
    if (!settings.concentration) return
    
    let raf: number
    const onMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY })
      })
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [settings.concentration])

  // ── Mode Synthèse Vocale (Clic droit) ──────────────────────────────────────
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null)
  
  useEffect(() => {
    if (!settings.tts) {
      window.speechSynthesis?.cancel()
      return
    }

    const onContextMenu = (e: MouseEvent) => {
      // Vérifier s'il y a du texte sous la souris
      const target = e.target as HTMLElement
      let textToRead = ''
      
      // Essayer d'attraper la sélection de l'utilisateur d'abord
      const selection = window.getSelection()?.toString()
      if (selection && selection.trim().length > 0) {
        textToRead = selection
      } else if (target.innerText) {
        // Sinon lire le bloc survolé (paragraphe, titre, span)
        // Eviter de lire tout le body
        if (target.tagName !== 'BODY' && target.tagName !== 'HTML' && target.tagName !== 'DIV') {
            textToRead = target.innerText
        } else if (target.tagName === 'DIV' && target.innerText.length < 500) {
            textToRead = target.innerText
        } else if (target.textContent && target.textContent.length < 500) {
            textToRead = target.textContent
        }
      }

      if (textToRead.trim()) {
        e.preventDefault() // Bloque le menu contextuel natif
        window.speechSynthesis?.cancel() // Stoppe la lecture précédente
        
        const utterance = new SpeechSynthesisUtterance(textToRead)
        utterance.lang = 'fr-FR'
        utterance.rate = settings.ttsSpeed
        utterance.pitch = settings.ttsPitch
        
        const voices = window.speechSynthesis.getVoices()
        const frVoice = voices.find(v => v.lang.startsWith('fr'))
        if (frVoice) utterance.voice = frVoice
        
        speakRef.current = utterance
        window.speechSynthesis.speak(utterance)
      }
    }

    // Pour arrêter la lecture, un simple clic gauche
    const onClick = () => {
      if (window.speechSynthesis?.speaking) {
         window.speechSynthesis.cancel()
      }
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('click', onClick)
      window.speechSynthesis?.cancel()
    }
  }, [settings.tts, settings.ttsSpeed, settings.ttsPitch])

  return (
    <AccessContext.Provider value={{ settings, updateSetting }}>
      {children}
      
      {/* Rendu de la bande de concentration si activée */}
      {settings.concentration && isMounted && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 999999,
            background: 'rgba(0, 0, 0, 0.5)',
            // Clip-path crée un "trou" horizontal pour la bande de lecture (hauteur 120px)
            clipPath: `polygon(0% 0%, 100% 0%, 100% calc(${mousePos.y}px - 60px), 0% calc(${mousePos.y}px - 60px), 0% calc(${mousePos.y}px + 60px), 100% calc(${mousePos.y}px + 60px), 100% 100%, 0% 100%)`
          }}
        />
      )}
    </AccessContext.Provider>
  )
}

export function useAccessibility() {
  return useContext(AccessContext)
}

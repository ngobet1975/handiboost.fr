'use client'

import React, { useState } from 'react'
import { useAccessibility } from './AccessibilityProvider'
import { 
  Accessibility, 
  X, 
  Type, 
  Activity, 
  MousePointer2, 
  Focus,
  Volume2,
  Minus,
  Plus,
  Moon,
  Link,
  AlignLeft,
  ZoomIn,
  Space
} from 'lucide-react'

export function AccessibilityWidget() {
  const { settings, updateSetting } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  if (isOpen) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '340px',
        maxHeight: '85vh',
        overflowY: 'auto',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        zIndex: 9999999, // Au dessus du masque de concentration
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e2e8f0',
        color: '#0f172a'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#0062B0' }}>
            <Accessibility size={20} />
            Accessibilité
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ padding: '6px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer' }}
            aria-label="Fermer le menu d'accessibilité"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section: VISION */}
          <div>
            <h3 style={sectionTitleStyle}>Vision & Contraste</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleRow 
                icon={<Moon size={20} />} 
                label="Contraste élevé" 
                checked={settings.highContrast} 
                onChange={(v) => updateSetting('highContrast', v)} 
                desc="Mode sombre à fort contraste"
              />
              <ToggleRow 
                icon={<ZoomIn size={20} />} 
                label="Grand curseur" 
                checked={settings.largeCursor} 
                onChange={(v) => updateSetting('largeCursor', v)} 
              />
              <ToggleRow 
                icon={<Activity size={20} />} 
                label="Épilepsie photosensible" 
                checked={settings.epilepsy} 
                onChange={(v) => updateSetting('epilepsy', v)} 
                desc="Désactive les animations"
              />
            </div>
          </div>

          <hr style={{ borderColor: '#e2e8f0', margin: '0' }} />

          {/* Section: LECTURE */}
          <div>
            <h3 style={sectionTitleStyle}>Lecture & Typographie</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleRow 
                icon={<Type size={20} />} 
                label="Police Dyslexie" 
                checked={settings.dyslexia} 
                onChange={(v) => updateSetting('dyslexia', v)} 
              />
              
              {/* Taille du texte */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9em', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Type size={16} /> Taille du texte</span>
                  <span>{settings.textSize}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateSetting('textSize', Math.max(80, settings.textSize - 10))} style={btnStyle}><Minus size={16} /></button>
                  <input 
                    type="range" min="80" max="150" step="10" 
                    value={settings.textSize} 
                    onChange={(e) => updateSetting('textSize', parseInt(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => updateSetting('textSize', Math.min(150, settings.textSize + 10))} style={btnStyle}><Plus size={16} /></button>
                </div>
              </div>

              {/* Espacement */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9em', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Space size={16} /> Espacement</span>
                  <span>{settings.letterSpacing}px</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateSetting('letterSpacing', Math.max(0, settings.letterSpacing - 1))} style={btnStyle}><Minus size={16} /></button>
                  <input 
                    type="range" min="0" max="5" step="1" 
                    value={settings.letterSpacing} 
                    onChange={(e) => updateSetting('letterSpacing', parseInt(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => updateSetting('letterSpacing', Math.min(5, settings.letterSpacing + 1))} style={btnStyle}><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: '#e2e8f0', margin: '0' }} />

          {/* Section: NAVIGATION */}
          <div>
            <h3 style={sectionTitleStyle}>Navigation & Concentration</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleRow 
                icon={<Link size={20} />} 
                label="Souligner les liens" 
                checked={settings.highlightLinks} 
                onChange={(v) => updateSetting('highlightLinks', v)} 
              />
              <ToggleRow 
                icon={<AlignLeft size={20} />} 
                label="Aligner à gauche" 
                checked={settings.leftAlign} 
                onChange={(v) => updateSetting('leftAlign', v)} 
                desc="Supprime la justification du texte"
              />
              <ToggleRow 
                icon={<MousePointer2 size={20} />} 
                label="Mouvements difficiles" 
                checked={settings.motor} 
                onChange={(v) => updateSetting('motor', v)} 
                desc="Agrandit les zones cliquables"
              />
              <ToggleRow 
                icon={<Focus size={20} />} 
                label="Masque de concentration" 
                checked={settings.concentration} 
                onChange={(v) => updateSetting('concentration', v)} 
                desc="Bande de lecture qui suit la souris"
              />
            </div>
          </div>

          <hr style={{ borderColor: '#e2e8f0', margin: '0' }} />

          {/* Section: VOCAL */}
          <div>
            <h3 style={sectionTitleStyle}>Synthèse Vocale</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleRow 
                icon={<Volume2 size={20} />} 
                label="Lecture vocale" 
                checked={settings.tts} 
                onChange={(v) => updateSetting('tts', v)} 
                desc="Clic Droit pour lire. Clic Gauche pour arrêter."
              />

              {settings.tts && (
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9em', fontWeight: 600 }}>
                    <span>Vitesse de lecture</span>
                    <span>{settings.ttsSpeed}x</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => updateSetting('ttsSpeed', Math.max(0.5, settings.ttsSpeed - 0.25))} style={btnStyle}><Minus size={16} /></button>
                    <input 
                      type="range" min="0.5" max="2" step="0.25" 
                      value={settings.ttsSpeed} 
                      onChange={(e) => updateSetting('ttsSpeed', parseFloat(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <button onClick={() => updateSetting('ttsSpeed', Math.min(2, settings.ttsSpeed + 0.25))} style={btnStyle}><Plus size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: '#0062B0',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0, 98, 176, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999999, // Au dessus de la bande de concentration
        transition: 'transform 0.2s ease',
      }}
      aria-label="Ouvrir les options d'accessibilité globales"
      title="Accessibilité sur-mesure"
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Accessibility size={40} />
    </button>
  )
}

const sectionTitleStyle = {
  fontSize: '0.85em', 
  textTransform: 'uppercase' as const, 
  color: '#64748b', 
  fontWeight: 800, 
  letterSpacing: '0.05em',
  marginBottom: '14px'
}

interface ToggleRowProps {
  icon: React.ReactNode
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  desc?: string
}

function ToggleRow({ icon, label, checked, onChange, desc }: ToggleRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ display: 'flex', alignItems: 'center', justifyItems: 'flex-start', cursor: 'pointer', fontWeight: 600 }}>
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
          style={{ width: '20px', height: '20px', accentColor: '#0062B0', cursor: 'pointer', flexShrink: 0 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
          <div style={{ color: '#0062B0' }}>{icon}</div>
          {label}
        </div>
      </label>
      {desc && <div style={{ fontSize: '0.8em', color: '#64748b', marginLeft: '32px', lineHeight: 1.4 }}>{desc}</div>}
    </div>
  )
}

const btnStyle = {
  background: 'white',
  border: '1px solid #cbd5e1',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0
}

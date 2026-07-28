import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    if (!text) return NextResponse.json({ error: 'Text requis' }, { status: 400 })

    // Nettoyer le markdown pour la synthèse vocale
    const clean = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/[▸•]/g, '')
      .replace(/━+[^━]*━+/g, '')
      .trim()
      .slice(0, 1000) // max 1000 chars pour la TTS

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: clean }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: 'Aoede', // Voix féminine naturelle et chaleureuse
                },
              },
            },
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.json()
      console.error('[tts] Gemini error:', err)
      return NextResponse.json({ error: err?.error?.message || 'Erreur TTS' }, { status: 500 })
    }

    const data = await response.json()
    const audioB64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data

    if (!audioB64) {
      return NextResponse.json({ error: 'Pas de données audio' }, { status: 500 })
    }

    // Retourner le base64 audio (PCM 24kHz mono)
    return NextResponse.json({ audio: audioB64, mimeType: 'audio/wav' })
  } catch (error: any) {
    console.error('[tts] Error:', error?.message)
    return NextResponse.json({ error: error?.message || 'Erreur inconnue' }, { status: 500 })
  }
}

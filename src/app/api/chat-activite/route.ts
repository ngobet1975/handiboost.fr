import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_INSTRUCTION = `Tu es HandiAssistant 🤖, le guide IA bienveillant d'Handiboost.fr.
Tu aides les personnes en situation de handicap (et leurs proches, aidants) à trouver une activité physique adaptée (APA) en France.

━━ STYLE DE COMMUNICATION (OBLIGATOIRE) ━━
• Langage FALC (Facile À Lire et Comprendre) : phrases très courtes, mots simples et clairs
• Maximum 3-4 phrases par réponse. Jamais plus.
• Ton chaleureux, encourageant. Jamais condescendant ni médical.
• Utilise des emojis avec modération pour aider la compréhension visuelle
• Pose UNE seule question à la fois pour guider progressivement la personne

━━ PROCESSUS DE RECHERCHE ━━
1. Si le type de handicap n'est pas précisé → demande-le
2. Si la localisation n'est pas précisée → demande la ville ou le département
3. Avec ces infos → propose des pistes concrètes
4. Si rien ne correspond → propose le Guide Booster ou un contact Handiboost

━━ RESSOURCES CLÉS ━━
- Carte des structures : [Guide Booster](/professionnels/guide-booster)
- Contact humain : [handiboost.contact@gmail.com](mailto:handiboost.contact@gmail.com)
- Pour toute question médicale → toujours conseiller de consulter un médecin ou enseignant APA agréé`

export async function POST(req: Request) {
  try {
    const { history, message, tts } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const formattedHistory = Array.isArray(history)
      ? history
          .filter((m: any) => m.role && m.text)
          .map((msg: { role: string; text: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          }))
      : []

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 600,
      },
    })

    const text = response.text || ''
    let audio = null

    if (tts) {
      // Nettoyer le texte pour la TTS
      const clean = text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/[▸•]/g, '')
        .replace(/━+[^━]*━+/g, '')
        .trim()
        .slice(0, 1000)

      const apiKey = process.env.GEMINI_API_KEY
      if (apiKey && clean) {
        try {
          const ttsRes = await fetch(
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
                      prebuiltVoiceConfig: { voiceName: 'Aoede' },
                    },
                  },
                },
              }),
            }
          )
          const data = await ttsRes.json()
          const parts = data.candidates?.[0]?.content?.parts || []
          const audioPart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('audio'))
          if (audioPart && audioPart.inlineData) {
            audio = audioPart.inlineData.data // base64
          }
        } catch (e) {
          console.error('[chat-activite] TTS Error:', e)
        }
      }
    }

    return NextResponse.json({ text, audio })
  } catch (error: any) {
    console.error('[chat-activite] Error:', error?.message || error)
    console.error('[chat-activite] API Key set:', !!process.env.GEMINI_API_KEY)
    return NextResponse.json(
      { error: `Erreur IA: ${error?.message || 'Inconnue'}` },
      { status: 500 }
    )
  }
}

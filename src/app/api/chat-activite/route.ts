import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import structuresData from '@/data/structures.json'
import annuaireData from '@/data/annuaire.json'
import actualitesData from '@/data/actualites.json'

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

━━ RESSOURCES CLÉS (DISPONIBLES CI-DESSOUS) ━━
- Tu as accès ci-dessous à la BASE DE DONNÉES HANDIBOOST contenant tous nos partenaires (structures), annuaires nationaux, et articles d'actualité.
- **RÈGLE ABSOLUE 1** : Privilégie TOUJOURS la base de données interne. Si la demande de l'utilisateur correspond à une ou plusieurs structures de la base de données, tu DOIS proposer ces structures spécifiques en donnant leur Nom, Ville, et moyen de contact.
- **RÈGLE ABSOLUE 2** : Si la base de données interne ne contient pas la réponse, tu as désormais la capacité de **chercher sur Internet (Google Search)** pour trouver la meilleure réponse ou structure la plus proche pour l'utilisateur. N'hésite pas à chercher sur le web pour proposer de vraies solutions.
- Pour toute question médicale → toujours conseiller de consulter un médecin ou enseignant APA agréé.

━━ SUGGESTIONS DE RÉPONSES (PROMPTS) ━━
À la TOUTE FIN de chacune de tes réponses, tu DOIS proposer 2 à 3 suggestions courtes que l'utilisateur pourrait te répondre, pour lui faciliter la vie (il n'aura qu'à cliquer dessus).
Format obligatoire strict : [SUGGESTION: Texte de la suggestion]
Exemple : [SUGGESTION: Handicap moteur] [SUGGESTION: Handicap visuel] [SUGGESTION: Je cherche à Paris]

━━ BASE DE DONNÉES HANDIBOOST ━━
Voici les données internes du site Handiboost (format JSON). Sers-t'en pour apporter des réponses ultra-précises et personnalisées :

[STRUCTURES ET PARTENAIRES LOCAUX]
${JSON.stringify(structuresData)}

[ANNUAIRES NATIONAUX]
${JSON.stringify(annuaireData)}

[ARTICLES ET ACTUALITÉS DU SITE]
${JSON.stringify(actualitesData)}
`

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
        tools: [{ googleSearch: {} }],
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

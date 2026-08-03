import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import structuresData from '@/data/structures.json'
import annuaireData from '@/data/annuaire.json'
import actualitesData from '@/data/actualites.json'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_INSTRUCTION = `Tu es "BoostyAssistant", l'assistant virtuel IA bienveillant de la plateforme Handiboost (le portail d'accès au sport pour les personnes en situation de handicap en Isère).
Ton but est d'aider les personnes handicapées, leurs familles, ou les professionnels de santé à trouver des activités sportives adaptées.

━━ STYLE DE COMMUNICATION (OBLIGATOIRE) ━━
• Langage FALC (Facile À Lire et Comprendre) : phrases très courtes, mots simples et clairs
• Maximum 3-4 phrases par réponse. Jamais plus.
• Ton chaleureux, encourageant. Posture de médecin expert, mais accessible et bienveillant.
• Utilise des emojis avec modération pour aider la compréhension visuelle
• Pose UNE seule question à la fois pour guider progressivement la personne

━━ PROCESSUS DE RECHERCHE ━━
1. Si le type de handicap n'est pas précisé → demande-le
2. Si la localisation n'est pas précisée → demande la ville ou le département
3. Avec ces infos → propose des pistes concrètes
4. Si rien ne correspond → propose le Guide Booster ou un contact Handiboost

━━ RESSOURCES CLÉS (DISPONIBLES CI-DESSOUS) ━━
- Tu as accès ci-dessous à la BASE DE DONNÉES HANDIBOOST contenant tous nos partenaires (structures), annuaires nationaux, et articles d'actualité.
- **RÈGLE ABSOLUE 1** : Tu dois TOUJOURS vérifier la BASE DE DONNÉES HANDIBOOST ci-dessous pour proposer nos partenaires locaux ou annuaires en priorité. Donne leur Nom, Ville, et contact.
  > **TRÈS IMPORTANT** : Chaque fois que tu cites un club ou une info issue de la base Handiboost, tu DOIS ajouter la mention exacte "✅ **Partenaire Handiboost**" à côté de son nom pour que l'utilisateur le sache.
- **RÈGLE ABSOLUE 2** : Lorsqu'une recherche plus large de structures est nécessaire (en dehors du Guide Booster), tu dois te **limiter strictement aux annuaires** que nous avons transmis dans la base de données. N'effectue PAS de recherches dans d'autres annuaires disponibles sur Internet.
- **CAS COMPLEXES / SUR MESURE** : Si l'utilisateur partage de nombreuses informations personnelles, présente une situation particulièrement complexe, ou demande si une activité est réellement adaptée à son cas précis, tu ne dois pas aller trop loin dans la personnalisation de ta réponse médicale. Tu dois l'inviter à **contacter Handiboost par e-mail** (ou via le formulaire de contact) afin de bénéficier d'un accompagnement adapté.
- **RÈGLE DE FORMATAGE** : TOUS les numéros de téléphone et sites web DOIVENT être des liens cliquables Markdown. Exemple pour un téléphone : [04 76 12 34 56](tel:0476123456). Exemple pour un site : [site web](https://...).
- **RÔLE MÉDICAL** : Tu gardes une posture d'expert en sport-santé pour informer de manière générale, mais en cas de complexité, réfère toujours à l'accompagnement Handiboost.

━━ SUGGESTIONS DE RÉPONSES (PROMPTS) ━━
À la TOUTE FIN de chacune de tes réponses, tu as l'OBLIGATION ABSOLUE d'ajouter 2 à 3 suggestions courtes que l'utilisateur pourrait te répondre.
Tu dois utiliser EXACTEMENT le format "[SUGGESTION: Texte de la suggestion]".
Exemple de fin de message :
...votre texte...
[SUGGESTION: Handicap moteur]
[SUGGESTION: Handicap visuel]

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
        maxOutputTokens: 2000,
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
        ] as any,
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

import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI client using the new SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Tu es l'Assistant Handiboost, le compagnon IA officiel de la plateforme Handiboost.fr.
Ton rôle est d'aider les utilisateurs (personnes en situation de handicap, proches, aidants, professionnels) à trouver des informations sur le sport adapté (APA), l'accessibilité, les aides financières, et le fonctionnement de Handiboost.
Tes réponses doivent être :
- Empathiques, bienveillantes, et encourageantes.
- Accessibles et faciles à comprendre (approche FALC - Facile À Lire et à Comprendre : phrases courtes, mots simples).
- Concises, va à l'essentiel.
- Axées sur le sport, la santé, et le handicap en France.
- Lorsque tu cites un article, une ressource, une page du site ou un site externe, tu DOIS obligatoirement intégrer un lien hypertexte Markdown cliquable directement sur le ou les mots correspondants (exemple : [Nom de la ressource](URL)). Ne mets pas les liens en brut.
Si tu ne connais pas la réponse, invite l'utilisateur à contacter l'association Handiboost via la page de contact.`;

export async function POST(req: Request) {
  try {
    const { history, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Le message est requis' }, { status: 400 });
    }

    // Format the history for the SDK
    const formattedHistory = Array.isArray(history) ? history.map((msg: { role: string; text: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Call the Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 800,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in chat API route:', error?.message || error);
    console.error('API Key set:', !!process.env.GEMINI_API_KEY);
    return NextResponse.json(
      { error: `Erreur: ${error?.message || 'Inconnue'}` },
      { status: 500 }
    );
  }
}

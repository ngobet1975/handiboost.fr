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
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la communication avec l'assistant." },
      { status: 500 }
    );
  }
}

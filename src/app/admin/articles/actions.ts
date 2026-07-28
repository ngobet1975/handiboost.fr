'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category: string | null
  cover_image: string | null
  published_at: string | null
  featured: boolean
  show_on_homepage: boolean
  status: string
}

export async function getArticles(): Promise<Article[]> {
  noStore()
  let articles: Article[] | null = await redis.get('handiboost_articles')

  // Migration depuis le fichier local JSON si Redis est vide
  if (!articles) {
    try {
      const DATA_PATH = path.join(process.cwd(), 'src/data/actualites.json')
      const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
      articles = raw.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt ?? null,
        content: a.content ?? null,
        category: a.category ?? null,
        cover_image: a.coverImage ?? null,
        published_at: a.publishedAt ?? null,
        featured: a.featured ?? false,
        show_on_homepage: a.showOnHomepage ?? false,
        status: a.status ?? 'draft',
      }))
      await redis.set('handiboost_articles', articles)
    } catch {
      articles = []
    }
  }

  // Trier par date décroissante
  return (articles || []).sort((a, b) => {
    const da = a.published_at ? new Date(a.published_at).getTime() : 0
    const db = b.published_at ? new Date(b.published_at).getTime() : 0
    return db - da
  })
}

export async function saveArticle(article: Article, isNew: boolean): Promise<void> {
  const articles: Article[] = await redis.get('handiboost_articles') || []
  const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  if (isNew) {
    const newArticle: Article = {
      ...article,
      id: `article-${Date.now()}`,
      slug,
    }
    articles.push(newArticle)
  } else {
    const idx = articles.findIndex((a) => a.id === article.id)
    if (idx >= 0) {
      articles[idx] = { ...article, slug }
    }
  }

  await redis.set('handiboost_articles', articles)
  revalidatePath('/admin/articles')
  revalidatePath('/')
  revalidatePath('/actualites')
  revalidatePath(`/actualites/${slug}`)
}

export async function deleteArticle(id: string): Promise<void> {
  const articles: Article[] = await redis.get('handiboost_articles') || []
  const filtered = articles.filter((a) => a.id !== id)
  await redis.set('handiboost_articles', filtered)
  revalidatePath('/admin/articles')
  revalidatePath('/')
  revalidatePath('/actualites')
}

export async function toggleArticleStatus(id: string): Promise<void> {
  const articles: Article[] = await redis.get('handiboost_articles') || []
  const idx = articles.findIndex((a) => a.id === id)
  if (idx >= 0) {
    articles[idx].status = articles[idx].status === 'published' ? 'draft' : 'published'
  }
  await redis.set('handiboost_articles', articles)
  revalidatePath('/admin/articles')
  revalidatePath('/')
  revalidatePath('/actualites')
}

export async function generateArticleAI(title: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { error: "Clé API Gemini (IA) manquante dans l'environnement." };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tu es un expert en Sport-Santé et Activité Physique Adaptée (APA). Rédige un article professionnel de blog au format Markdown sur le sujet suivant : "${title}". \nLe contenu doit être informatif, structuré avec des sous-titres (##), des listes à puces si nécessaire, et un ton professionnel mais accessible.\nRenvoie la réponse au format JSON strict avec cette structure :\n{\n  "excerpt": "Un résumé accrocheur de 2 ou 3 phrases maximum pour donner envie de lire",\n  "content": "Le contenu entier de l'article au format Markdown"\n}`
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("L'IA n'a pas renvoyé de contenu valide.");
    }

    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return { success: true, excerpt: result.excerpt, content: result.content };
  } catch (error: any) {
    console.error(error);
    return { error: "Erreur lors de la génération avec l'IA : " + (error.message || "Erreur inconnue") };
  }
}

export async function generateImagePromptAI(title: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { error: "Clé API Gemini (IA) manquante dans l'environnement." };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Crée un "prompt" (description d'image) ultra-court et en anglais pour un générateur d'images IA (type Midjourney).
L'image illustrera cet article de blog sur le Sport, la Santé ou le Handicap : "${title}".
Règles : 
- L'image doit être HYPER-RÉALISTE (ajoute des mots-clés obligatoires comme "hyper realistic photography, 8k resolution, cinematic lighting, photorealistic, highly detailed").
- L'image doit être positive et lumineuse.
- Ne mets AUCUN texte ni aucune lettre sur l'image.
- Renvoie UNIQUEMENT le prompt en texte brut, rien d'autre.`
          }]
        }],
      })
    });

    const data = await response.json();
    let prompt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!prompt) throw new Error("L'IA n'a pas pu générer la description de l'image.");

    // Nettoyage du texte et génération d'un nombre aléatoire pour forcer une nouvelle image à chaque clic
    prompt = prompt.replace(/\n/g, ' ').replace(/"/g, '');
    const seed = Math.floor(Math.random() * 10000000);
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Utilisation du service gratuit et illimité de Pollinations AI pour générer l'image à la volée
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${seed}`;

    return { success: true, url: imageUrl };
  } catch (error: any) {
    console.error(error);
    return { error: "Erreur lors de la génération de l'image : " + (error.message || "Erreur inconnue") };
  }
}

'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

const DATA_PATH = path.join(process.cwd(), 'src/data/actualites.json')

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

function readArticles(): Article[] {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
    // Map JSON camelCase fields to the Article interface
    return raw.map((a: any) => ({
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
  } catch {
    return []
  }
}

function writeArticles(articles: Article[]) {
  // Convert back to JSON camelCase format
  const data = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    category: a.category,
    coverImage: a.cover_image,
    publishedAt: a.published_at,
    featured: a.featured,
    showOnHomepage: a.show_on_homepage,
    status: a.status,
  }))
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

export async function getArticles(): Promise<Article[]> {
  const articles = readArticles()
  // Sort by published_at descending
  return articles.sort((a, b) => {
    const da = a.published_at ? new Date(a.published_at).getTime() : 0
    const db = b.published_at ? new Date(b.published_at).getTime() : 0
    return db - da
  })
}

export async function saveArticle(article: Article, isNew: boolean): Promise<void> {
  const articles = readArticles()
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

  writeArticles(articles)
  revalidatePath('/admin/articles')
}

export async function deleteArticle(id: string): Promise<void> {
  const articles = readArticles().filter((a) => a.id !== id)
  writeArticles(articles)
  revalidatePath('/admin/articles')
}

export async function toggleArticleStatus(id: string): Promise<void> {
  const articles = readArticles()
  const idx = articles.findIndex((a) => a.id === id)
  if (idx >= 0) {
    articles[idx].status = articles[idx].status === 'published' ? 'draft' : 'published'
  }
  writeArticles(articles)
  revalidatePath('/admin/articles')
}

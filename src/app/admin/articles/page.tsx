'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Pencil, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getArticles, saveArticle, deleteArticle as deleteArticleAction, toggleArticleStatus, Article } from './actions'

export default function AdminArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Article | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    loadArticles()
  }, [])

  async function loadArticles() {
    setLoading(true)
    const data = await getArticles()
    setArticles(data)
    setLoading(false)
  }

  function startNew() {
    setIsNew(true)
    setEditing({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'info-apa',
      cover_image: '',
      published_at: new Date().toISOString(),
      featured: false,
      show_on_homepage: false,
      status: 'draft',
    })
  }

  async function handleSave() {
    if (!editing) return
    startTransition(async () => {
      await saveArticle(editing, isNew)
      setEditing(null)
      setIsNew(false)
      await loadArticles()
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet article ?')) return
    startTransition(async () => {
      await deleteArticleAction(id)
      await loadArticles()
    })
  }

  async function handleToggleStatus(article: Article) {
    startTransition(async () => {
      await toggleArticleStatus(article.id)
      await loadArticles()
    })
  }

  if (editing) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {isNew ? 'Nouvel article' : 'Modifier l\'article'}
            </h1>
            <Button variant="outline" onClick={() => { setEditing(null); setIsNew(false); }}>
              <X className="w-4 h-4 mr-2" /> Annuler
            </Button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Titre *</label>
              <input
                type="text"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Titre de l'article"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Slug (URL)</label>
              <input
                type="text"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                placeholder="slug-de-l-article (auto-généré si vide)"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Extrait</label>
              <textarea
                value={editing.excerpt ?? ''}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Résumé court affiché dans les listes"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Contenu</label>
              <textarea
                value={editing.content ?? ''}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Contenu de l'article (Markdown supporté)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Catégorie</label>
                <select
                  value={editing.category ?? 'info-apa'}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info-apa">Info APA</option>
                  <option value="journee-handiboost">Journée Handiboost</option>
                  <option value="evenement">Événement</option>
                  <option value="ressource">Ressource</option>
                  <option value="rapport">Rapport</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Statut</label>
                <select
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Image de couverture (URL)</label>
              <input
                type="text"
                value={editing.cover_image ?? ''}
                onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-5 h-5 rounded" />
                <span className="text-sm font-medium text-slate-700">À la une</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.show_on_homepage} onChange={(e) => setEditing({ ...editing, show_on_homepage: e.target.checked })} className="w-5 h-5 rounded" />
                <span className="text-sm font-medium text-slate-700">Afficher en page d'accueil</span>
              </label>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleSave} disabled={isPending} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 h-12">
                <Save className="w-4 h-4 mr-2" /> {isNew ? 'Créer l\'article' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 mb-4">
            <ChevronLeft className="w-4 h-4" /> Retour au tableau de bord
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Contenu Éditorial</h1>
              <p className="text-slate-500 mt-1">{articles.length} articles</p>
            </div>
            <Button onClick={startNew} className="bg-blue-700 hover:bg-blue-800 text-white font-bold">
              <Plus className="w-4 h-4 mr-2" /> Nouvel article
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-12">Chargement...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Titre</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Catégorie</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Statut</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{article.title}</span>
                      {article.featured && <span className="ml-2 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">⭐ Une</span>}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{article.category}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' :
                        article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {article.status === 'published' ? 'Publié' : article.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggleStatus(article)} disabled={isPending} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title={article.status === 'published' ? 'Dépublier' : 'Publier'}>
                          {article.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { setEditing(article); setIsNew(false); }} className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50" title="Modifier">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(article.id)} disabled={isPending} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

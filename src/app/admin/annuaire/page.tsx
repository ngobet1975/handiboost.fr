'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, Pencil, Trash2, Save, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Directory {
  id: string
  name: string
  provider: string | null
  description: string | null
  url: string | null
  scope: string | null
  type: string | null
  status: string
}

export default function AdminAnnuairePage() {
  const supabase = createClient()
  const [entries, setEntries] = useState<Directory[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Directory | null>(null)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => { loadEntries() }, [])

  async function loadEntries() {
    setLoading(true)
    const { data } = await supabase.from('directories').select('*').order('name')
    setEntries(data ?? [])
    setLoading(false)
  }

  function startNew() {
    setIsNew(true)
    setEditing({
      id: '', name: '', provider: '', description: '', url: '',
      scope: 'national', type: 'club', status: 'draft',
    })
  }

  async function saveEntry() {
    if (!editing) return
    const payload = {
      name: editing.name, provider: editing.provider, description: editing.description,
      url: editing.url, scope: editing.scope, type: editing.type, status: editing.status,
    }
    if (isNew) {
      await supabase.from('directories').insert(payload)
    } else {
      await supabase.from('directories').update(payload).eq('id', editing.id)
    }
    setEditing(null); setIsNew(false); loadEntries()
  }

  async function deleteEntry(id: string) {
    if (!confirm('Supprimer cette entrée ?')) return
    await supabase.from('directories').delete().eq('id', id)
    loadEntries()
  }

  if (editing) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{isNew ? 'Nouvelle entrée' : 'Modifier l\'entrée'}</h1>
            <Button variant="outline" onClick={() => { setEditing(null); setIsNew(false); }}>
              <X className="w-4 h-4 mr-2" /> Annuler
            </Button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nom *</label>
              <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg" placeholder="Nom de la structure" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Fournisseur / Organisation</label>
              <input type="text" value={editing.provider ?? ''} onChange={(e) => setEditing({ ...editing, provider: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: Fédération Française Handisport" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={4} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">URL</label>
              <input type="url" value={editing.url ?? ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-mono" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Portée</label>
                <select value={editing.scope ?? 'national'} onChange={(e) => setEditing({ ...editing, scope: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="national">National</option>
                  <option value="regional">Régional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                <select value={editing.type ?? 'club'} onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="club">Club</option>
                  <option value="professional">Professionnel</option>
                  <option value="institution">Institution</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Statut</label>
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button onClick={saveEntry} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 h-12">
                <Save className="w-4 h-4 mr-2" /> {isNew ? 'Créer' : 'Enregistrer'}
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
              <h1 className="text-3xl font-bold text-slate-900">Annuaire / Guide Booster</h1>
              <p className="text-slate-500 mt-1">{entries.length} entrées</p>
            </div>
            <Button onClick={startNew} className="bg-blue-700 hover:bg-blue-800 text-white font-bold">
              <Plus className="w-4 h-4 mr-2" /> Nouvelle entrée
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
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Nom</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Fournisseur</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Type</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Portée</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Statut</th>
                  <th className="text-right px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{entry.name}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{entry.provider}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 capitalize">{entry.type}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 capitalize">{entry.scope}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        entry.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {entry.url && (
                          <a href={entry.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title="Ouvrir le lien">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => { setEditing(entry); setIsNew(false); }} className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50" title="Modifier">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteEntry(entry.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Supprimer">
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

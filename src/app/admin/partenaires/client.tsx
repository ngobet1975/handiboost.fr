'use client'

import React, { useState } from 'react'
import { CheckCircle2, XCircle, Search, Pencil, Trash2, Save, X, Loader2, ExternalLink, AlertTriangle } from 'lucide-react'
import { adminUpdatePartner, adminDeletePartner } from '@/app/partenaires/actions'

interface Partner {
  id: string
  email: string
  nom_structure: string
  nom_contact: string
  telephone: string
  adresse: string
  ville: string
  code_postal: string
  site_web: string
  description: string
  activites: string
  charte_signee: boolean
  charte_signee_le: string | null
  charte_signee_par: string | null
  created_at: string
  updated_at: string
}

export default function AdminPartenairesClient({ partners: initialPartners }: { partners: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Partner>>({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = partners.filter(p =>
    p.nom_structure?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.ville?.toLowerCase().includes(search.toLowerCase())
  )

  const startEdit = (p: Partner) => {
    setEditingId(p.id)
    setEditForm({ ...p })
  }

  const handleSave = async () => {
    if (!editingId) return
    setSaving(true)
    const result = await adminUpdatePartner(editingId, editForm)
    setSaving(false)
    if (!result.error) {
      setPartners(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as Partner : p))
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    const result = await adminDeletePartner(id)
    setDeleting(false)
    if (result.success) {
      setPartners(prev => prev.filter(p => p.id !== id))
      setDeleteConfirm(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Partenaires</h1>
          <p className="text-slate-500 font-medium mt-1">{partners.length} partenaire{partners.length > 1 ? 's' : ''} inscrit{partners.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-xl text-sm">
            ✅ {partners.filter(p => p.charte_signee).length} charte{partners.filter(p => p.charte_signee).length > 1 ? 's' : ''} signée{partners.filter(p => p.charte_signee).length > 1 ? 's' : ''}
          </span>
          <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1.5 rounded-xl text-sm">
            ⏳ {partners.filter(p => !p.charte_signee).length} en attente
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email, ville..."
          className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-bold text-xl">Aucun partenaire trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              {editingId === p.id ? (
                /* ── Mode édition ─────────────────────────────────────── */
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'nom_structure', label: 'Nom structure' },
                      { key: 'nom_contact', label: 'Contact' },
                      { key: 'telephone', label: 'Téléphone' },
                      { key: 'adresse', label: 'Adresse' },
                      { key: 'ville', label: 'Ville' },
                      { key: 'code_postal', label: 'Code postal' },
                      { key: 'site_web', label: 'Site web' },
                      { key: 'activites', label: 'Activités' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
                        <input
                          type="text"
                          value={(editForm as any)[key] || ''}
                          onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Description</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`charte-${p.id}`}
                        checked={editForm.charte_signee || false}
                        onChange={e => setEditForm(f => ({ ...f, charte_signee: e.target.checked }))}
                        className="w-5 h-5 accent-blue-700"
                      />
                      <label htmlFor={`charte-${p.id}`} className="text-sm font-bold text-slate-700">Charte signée</label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-800 px-6 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Mode lecture ─────────────────────────────────────── */
                <div className="p-5 flex items-start gap-4">
                  {/* Statut charte */}
                  <div className="flex-shrink-0 mt-1">
                    {p.charte_signee
                      ? <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      : <XCircle className="w-7 h-7 text-orange-400" />
                    }
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{p.nom_structure || '—'}</h3>
                        <p className="text-sm font-medium text-slate-500">{p.nom_contact} · {p.email}</p>
                        {p.ville && <p className="text-sm text-slate-500">{p.adresse}, {p.ville} {p.code_postal}</p>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {p.charte_signee
                          ? <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-full">✅ Charte signée</span>
                          : <span className="bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs px-3 py-1.5 rounded-full">⏳ En attente</span>
                        }
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 font-medium">
                      {p.telephone && <span>📞 {p.telephone}</span>}
                      {p.activites && <span>🏃 {p.activites}</span>}
                      {p.site_web && (
                        <a href={p.site_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Site web
                        </a>
                      )}
                    </div>
                    {p.description && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.description}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      Inscrit le {new Date(p.created_at).toLocaleDateString('fr-FR')}
                      {p.charte_signee && p.charte_signee_le && ` · Charte signée le ${new Date(p.charte_signee_le).toLocaleDateString('fr-FR')} par ${p.charte_signee_par}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors border-2 border-transparent hover:border-blue-200"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors border-2 border-transparent hover:border-red-200"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-100">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-red-100">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 text-center mb-2">Supprimer ce partenaire ?</h3>
            <p className="text-slate-600 text-center mb-8 font-medium">Cette action est irréversible.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Supprimer définitivement
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full font-bold text-slate-600 hover:text-slate-800 py-3.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

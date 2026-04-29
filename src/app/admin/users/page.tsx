'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Users, Shield, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const supabase = createClient()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProfiles() }, [])

  async function loadProfiles() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setProfiles(data ?? [])
    setLoading(false)
  }

  async function updateRole(id: string, newRole: string) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    loadProfiles()
  }

  const RoleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800',
    editor: 'bg-blue-100 text-blue-800',
    medical_reviewer: 'bg-purple-100 text-purple-800',
    viewer: 'bg-slate-100 text-slate-800',
  }

  const RoleLabels: Record<string, string> = {
    admin: 'Administrateur',
    editor: 'Éditeur',
    medical_reviewer: 'Relecteur Médical',
    viewer: 'Lecteur',
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 mb-4">
            <ChevronLeft className="w-4 h-4" /> Retour au tableau de bord
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestion des Comptes</h1>
              <p className="text-slate-500 mt-1">{profiles.length} utilisateur{profiles.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8">
          <p className="text-amber-800 text-sm font-medium">
            <strong>Note :</strong> Pour ajouter un nouvel utilisateur, créez-le depuis le panneau <strong>Authentication → Users</strong> de Supabase. 
            Son profil apparaîtra ici après sa première connexion. Vous pouvez ensuite lui attribuer un rôle.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-12">Chargement...</p>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun profil trouvé</h3>
            <p className="text-slate-500">Les profils apparaissent après la première connexion d'un utilisateur.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Utilisateur</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Rôle</th>
                  <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Inscrit le</th>
                  <th className="text-right px-6 py-4 text-sm font-bold text-slate-600">Changer le rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                          {(profile.full_name || profile.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">{profile.full_name || 'Sans nom'}</span>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {profile.email || profile.id.slice(0, 8) + '...'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${RoleColors[profile.role] || RoleColors.viewer}`}>
                        {RoleLabels[profile.role] || profile.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={profile.role}
                        onChange={(e) => updateRole(profile.id, e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="viewer">Lecteur</option>
                        <option value="editor">Éditeur</option>
                        <option value="medical_reviewer">Relecteur Médical</option>
                        <option value="admin">Administrateur</option>
                      </select>
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

import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getAdherents } from './actions'
import UsersManager from './UsersManager'

export default async function AdminUsersPage() {
  const adherents = await getAdherents()

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 mb-4">
            <ChevronLeft className="w-4 h-4" /> Retour au tableau de bord
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Professionnels Habilités</h1>
              <p className="text-slate-500 mt-1">{adherents.length} professionnel{adherents.length > 1 ? 's' : ''} inscrit{adherents.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <UsersManager initialAdherents={adherents} />
      </div>
    </div>
  )
}

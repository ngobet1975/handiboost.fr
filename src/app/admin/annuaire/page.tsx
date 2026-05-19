import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getStructures, getActivites } from './actions'
import StructuresManager from './StructuresManager'

export default async function AdminAnnuairePage() {
  const structures = await getStructures()
  const activites = await getActivites()

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 mb-4">
            <ChevronLeft className="w-4 h-4" /> Retour au tableau de bord
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Guide Booster</h1>
            <p className="text-slate-500 mt-1">Gérez la carte interactive des structures APA et clubs adaptés.</p>
          </div>
        </div>

        <StructuresManager initialStructures={structures} initialActivites={activites} />
      </div>
    </div>
  )
}

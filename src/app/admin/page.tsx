import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminPage() {
  // Auth is handled by middleware
  // No need to check Supabase user here since we use admin_session cookie

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
             <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
             <p className="text-slate-500 mt-1">Gérez l'ensemble des données de l'association Handiboost.</p>
          </div>
          <form action="/auth/signout" method="post">
             <Button variant="outline" type="submit" className="text-slate-600 border-slate-300">
                Se déconnecter
             </Button>
          </form>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/annuaire" className="block group">
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl">🗺️</div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-700 transition-colors">Guide Booster</h2>
              <p className="text-gray-500 mb-6 text-sm flex-1">Administrez les structures APA, leurs fiches détaillées et importez depuis Excel.</p>
              <div className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-4 py-2 text-sm font-medium">Gérer l'annuaire</div>
            </div>
          </Link>
          
          <Link href="/admin/articles" className="block group">
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl">📰</div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-700 transition-colors">Contenu Éditorial</h2>
              <p className="text-gray-500 mb-6 text-sm flex-1">Rédigez les actualités, fixez les dates de péremption, et uploadez des ressources PDF.</p>
              <div className="w-full inline-flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground h-9 px-4 py-2 text-sm font-medium">Ouvrir le CMS</div>
            </div>
          </Link>

          <Link href="/admin/users" className="block group">
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-xl">🔐</div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-700 transition-colors">Professionnels</h2>
              <p className="text-gray-500 mb-6 text-sm flex-1">Modérez les inscriptions des médecins et professionnels ayant demandé un accès.</p>
              <div className="w-full inline-flex items-center justify-center rounded-lg border border-slate-300 bg-background hover:bg-slate-100 text-slate-800 h-9 px-4 py-2 text-sm font-medium">Vérifier les comptes</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

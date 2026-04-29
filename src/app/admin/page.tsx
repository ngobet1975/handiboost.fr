import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl">🗺️</div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-700 transition-colors">Guide Booster</h2>
              <p className="text-gray-500 mb-6 text-sm">Administrez les structures APA, leurs fiches détaillées et importez depuis Excel.</p>
              <Button className="w-full">Gérer l'annuaire</Button>
            </div>
          </Link>
          
          <Link href="/admin/articles" className="block group">
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl">📰</div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-700 transition-colors">Contenu Éditorial</h2>
              <p className="text-gray-500 mb-6 text-sm">Rédigez les actualités, fixez les dates de péremption, et uploadez des ressources PDF.</p>
              <Button variant="secondary" className="w-full">Ouvrir le CMS</Button>
            </div>
          </Link>

          <Link href="/admin/users" className="block group">
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-xl">🔐</div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-700 transition-colors">Professionnels</h2>
              <p className="text-gray-500 mb-6 text-sm">Modérez les inscriptions des médecins et professionnels ayant demandé un accès.</p>
              <Button variant="outline" className="w-full border-slate-300">Vérifier les comptes</Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

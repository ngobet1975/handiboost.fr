import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

async function updateProfile(formData: FormData) {
  'use server'
  
  const cookieStore = await cookies();
  const email = cookieStore.get('pro_session')?.value;
  if (!email) return;

  const nom = formData.get('nom') as string;
  const prenom = formData.get('prenom') as string;
  const profession = formData.get('profession') as string;
  const telephone = formData.get('telephone') as string;

  const filePath = path.join(process.cwd(), 'src/data/adherents.json')
  let adherents = []
  try {
    adherents = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (e) {
    console.error("Error reading adherents.json", e);
  }

  const cleanEmail = email.replace(/['"]/g, '').toLowerCase().trim();
  const index = adherents.findIndex((a: any) => a.email && a.email.toLowerCase().trim() === cleanEmail);
  
  if (index !== -1) {
    adherents[index] = {
      ...adherents[index],
      nom: nom.trim(),
      prenom: prenom.trim(),
      profession: profession.trim(),
      telephone: telephone.trim()
    };
    try {
      fs.writeFileSync(filePath, JSON.stringify(adherents, null, 2));
      console.log(`[PROFIL] Informations mises à jour pour ${cleanEmail}`);
    } catch(err) {
      console.error("Error writing adherents.json", err);
    }
    revalidatePath('/profil');
    revalidatePath('/guide-booster'); // Force refresh the public map if needed
  } else {
    console.error(`[PROFIL] Utilisateur introuvable pour la mise à jour: ${cleanEmail}`);
  }
  
  redirect('/profil?success=true');
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProfilPage(props: PageProps) {
  const params = await props.searchParams;
  const isSuccess = params?.success === 'true';
  
  const cookieStore = await cookies();
  const email = cookieStore.get('pro_session')?.value;

  if (!email) {
    redirect('/login');
  }

  const filePath = path.join(process.cwd(), 'src/data/adherents.json')
  let adherents = []
  try {
    adherents = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (e) {}

  const cleanEmail = email.replace(/['"]/g, '').toLowerCase().trim();
  const user = adherents.find((a: any) => a.email && a.email.toLowerCase().trim() === cleanEmail);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-500">Utilisateur introuvable.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <Link href="/guide-booster" className="hover:text-blue-800 hover:underline transition-all">Guide Booster</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Mon Profil</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isSuccess && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
            <span className="text-xl">✅</span>
            <span className="font-medium">Vos informations ont été mises à jour avec succès.</span>
          </div>
        )}
        
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Mon Profil</h1>
          <p className="text-slate-500 mb-8">Mettez à jour vos informations professionnelles.</p>

          <form action={updateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prénom</label>
                <input 
                  type="text" 
                  name="prenom"
                  defaultValue={user.prenom} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom</label>
                <input 
                  type="text" 
                  name="nom"
                  defaultValue={user.nom} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Profession</label>
                <input 
                  type="text" 
                  name="profession"
                  defaultValue={user.profession} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
                <input 
                  type="tel" 
                  name="telephone"
                  defaultValue={user.telephone || ''} 
                  placeholder="06 12 34 56 78"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email (non modifiable)</label>
              <input 
                type="email" 
                defaultValue={user.email} 
                disabled
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

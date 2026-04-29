import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-slate-900">


      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-50 py-10 lg:py-14 px-6 border-b-4 border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                L'Activité Physique Adaptée, <span className="text-blue-800 underline decoration-blue-300 decoration-8 underline-offset-8">pour la santé de tous</span>.
              </h1>
              <p className="text-2xl lg:text-3xl text-slate-800 max-w-2xl leading-normal font-medium">
                Bienvenue sur Handiboost. Que vous cherchiez une activité pour vous-même, pour un proche, ou des ressources pour accompagner vos publics, choisissez votre profil :
              </p>
              
              <div className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-xl border-4 border-slate-100 flex flex-col gap-4 relative z-10">
                <label htmlFor="search" className="text-2xl font-bold text-slate-900 ml-2">Que souhaitez-vous faire ?</label>
                <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-3xl">
                      🔍
                    </div>
                    <input 
                      type="text" 
                      id="search"
                      className="w-full bg-slate-50 border-4 border-slate-200 text-slate-900 rounded-2xl py-5 pl-16 pr-6 text-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-500" 
                      placeholder="Activité, aide, événement, ressource..." 
                    />
                  </div>
                  <Button className="bg-blue-800 hover:bg-blue-900 text-white text-xl font-bold rounded-2xl px-8 h-[72px] sm:w-auto w-full transition-all shadow-md">
                    Chercher
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-6 pt-4">
                <Link href="#pratiquants" className="flex-1">
                  <Button size="lg" className="w-full bg-blue-800 hover:bg-blue-900 text-2xl font-bold h-auto py-8 px-6 flex flex-col items-center gap-4 rounded-3xl shadow-2xl hover:-translate-y-2 transition-transform border-4 border-transparent hover:border-blue-300">
                    <span className="text-5xl">🙋‍♀️</span>
                    <span className="text-3xl">Je suis pratiquant</span>
                    <span className="text-xl font-medium text-blue-100 text-center leading-snug tracking-wide">Trouver une activité, un événement ou une aide financière.</span>
                  </Button>
                </Link>
                
                <Link href="/professionnels" className="flex-1">
                  <Button size="lg" className="w-full bg-purple-700 hover:bg-purple-800 text-2xl font-bold h-auto py-8 px-6 flex flex-col items-center gap-4 rounded-3xl shadow-2xl hover:-translate-y-2 transition-transform border-4 border-transparent hover:border-purple-300">
                    <span className="text-5xl">🩺</span>
                    <span className="text-3xl">Je suis professionnel</span>
                    <span className="text-xl font-medium text-purple-100 text-center leading-snug tracking-wide">Accéder aux ressources, outils et au Guide Booster.</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div className="w-full max-w-lg mx-auto bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col text-center transform lg:rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-white relative group">
                <div className="w-full h-80 bg-slate-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/bonhommes-handiboost.png')] bg-[length:350%_auto] bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-700 opacity-90 mix-blend-multiply" />
                </div>
                <div className="p-8 w-full bg-gradient-to-br from-blue-50 to-pink-50 border-t-4 border-slate-100">
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Le sport pour tous</h3>
                  <p className="text-lg text-slate-700 font-medium">
                    Bouger, pratiquer, progresser ensemble.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Feature Section (Gros blocs) */}
        <section className="py-24 px-6 bg-white border-b-4 border-slate-200">
          <div className="max-w-[90rem] mx-auto space-y-16">
             <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-5xl lg:text-6xl font-black text-slate-900 mb-8">Une plateforme centralisée pour l'APA</h2>
                <p className="text-slate-800 text-2xl lg:text-3xl leading-normal font-medium">Tout ce dont vous avez besoin pour encourager ou pratiquer le sport adapté, facile à lire et à utiliser.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10">
                {/* Carte Infos Pratiques (Bleu Clair) */}
                <Card className="border-4 border-sky-100 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-sky-500 w-full"></div>
                  <CardHeader className="pt-8 px-6 xl:pt-10 xl:px-8">
                    <div className="w-16 h-16 xl:w-20 xl:h-20 bg-sky-50 rounded-2xl xl:rounded-3xl mb-6 xl:mb-8 shadow-sm overflow-hidden border-2 border-sky-100 relative">
                       <div className="absolute inset-0 bg-[url('/bonhommes-handiboost.png')] bg-[length:600%_auto] bg-[5%_20%] opacity-90 mix-blend-multiply" />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900">Infos Pratiques</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 xl:px-8 text-slate-800 text-xl xl:text-2xl leading-relaxed font-medium flex-1 pb-8 xl:pb-10">
                    Trouver une activité, une aide financière ou une ressource près de chez vous.
                  </CardContent>
                  <div className="p-6 xl:p-8 pt-0 mt-auto">
                     <Link href="/pratiquants">
                       <Button variant="outline" className="w-full text-2xl font-extrabold border-4 border-sky-200 text-sky-700 hover:bg-sky-50 h-auto py-4 whitespace-normal rounded-2xl transition-all">Trouver une activité</Button>
                     </Link>
                  </div>
                </Card>

                {/* Carte Agenda (Orange) */}
                <Card className="border-4 border-orange-100 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-orange-500 w-full"></div>
                  <CardHeader className="pt-8 px-6 xl:pt-10 xl:px-8">
                    <div className="w-16 h-16 xl:w-20 xl:h-20 bg-orange-50 rounded-2xl xl:rounded-3xl mb-6 xl:mb-8 shadow-sm overflow-hidden border-2 border-orange-100 relative">
                       <div className="absolute inset-0 bg-[url('/bonhommes-handiboost.png')] bg-[length:600%_auto] bg-[90%_20%] opacity-90 mix-blend-multiply" />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900">Événements</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 xl:px-8 text-slate-800 text-xl xl:text-2xl leading-relaxed font-medium flex-1 pb-8 xl:pb-10">
                    Voir les ateliers, rencontres et événements sportifs adaptés.
                  </CardContent>
                  <div className="p-6 xl:p-8 pt-0 mt-auto">
                     <Link href="/pratiquants/evenements">
                       <Button variant="outline" className="w-full text-2xl font-extrabold border-4 border-orange-200 text-orange-700 hover:bg-orange-50 h-auto py-4 whitespace-normal rounded-2xl transition-all">Voir l'Agenda</Button>
                     </Link>
                  </div>
                </Card>

                {/* Carte Actualités (Rose) */}
                <Card className="border-4 border-pink-100 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-pink-600 w-full"></div>
                  <CardHeader className="pt-8 px-6 xl:pt-10 xl:px-8">
                    <div className="w-16 h-16 xl:w-20 xl:h-20 bg-pink-50 rounded-2xl xl:rounded-3xl mb-6 xl:mb-8 shadow-sm overflow-hidden border-2 border-pink-100 relative">
                       <div className="absolute inset-0 bg-[url('/bonhommes-handiboost.png')] bg-[length:600%_auto] bg-[40%_20%] opacity-90 mix-blend-multiply" />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900">Actualités</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 xl:px-8 text-slate-800 text-xl xl:text-2xl leading-relaxed font-medium flex-1 pb-8 xl:pb-10">
                    Lire les nouvelles de l'association et de l'APA.
                  </CardContent>
                  <div className="p-6 xl:p-8 pt-0 mt-auto">
                     <Link href="/actualites">
                       <Button variant="outline" className="w-full text-2xl font-extrabold border-4 border-pink-200 text-pink-700 hover:bg-pink-50 h-auto py-4 whitespace-normal rounded-2xl transition-all">Lire les actualités</Button>
                     </Link>
                  </div>
                </Card>

                {/* Carte Espace Pro (Violet) */}
                <Card className="border-4 border-purple-100 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-purple-700 w-full"></div>
                  <CardHeader className="pt-8 px-6 xl:pt-10 xl:px-8">
                    <div className="w-16 h-16 xl:w-20 xl:h-20 bg-purple-50 rounded-2xl xl:rounded-3xl mb-6 xl:mb-8 shadow-sm overflow-hidden border-2 border-purple-100 relative">
                       <div className="absolute inset-0 bg-[url('/bonhommes-handiboost.png')] bg-[length:600%_auto] bg-[75%_20%] opacity-90 mix-blend-multiply" />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900">Professionnels</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 xl:px-8 text-slate-800 text-xl xl:text-2xl leading-relaxed font-medium flex-1 pb-8 xl:pb-10">
                    Ressources et outils pour les professionnels du sport et de la santé.
                  </CardContent>
                  <div className="p-6 xl:p-8 pt-0 mt-auto">
                    <Link href="/professionnels">
                      <Button size="lg" className="w-full text-xl xl:text-2xl font-bold bg-purple-700 hover:bg-purple-800 rounded-2xl py-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                        Espace Professionnels
                      </Button>
                    </Link>
                  </div>
                </Card>
             </div>
          </div>
        </section>

        {/* Section Actualités et Témoignages */}
        <section className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-24">
            
            {/* Blocs Actualités */}
            <div className="space-y-12">
              <div className="flex items-end justify-between border-b-4 border-slate-200 pb-6">
                <h2 className="text-5xl font-black text-slate-900">Dernières Actualités</h2>
                <Link href="/actualites" className="text-2xl font-extrabold text-blue-800 hover:underline hover:text-blue-900 hidden md:block">Toutes les actus →</Link>
              </div>
              
              <div className="grid md:grid-cols-3 gap-10">
                {[
                  { title: "Lancement de la nouvelle saison APA", date: "12 Octobre 2026", color: "bg-orange-500", label: "Journée Handiboost", image: "18092019_ActiviteDanseDANSE-DNG0-01-205-1000x667.jpg"},
                  { title: "Nouveaux financements pour l'équipement sportif", date: "05 Octobre 2026", color: "bg-sky-500", label: "Info Pratique", image: "24.05.2023_Foot-Americain.jpg"},
                  { title: "Retour sur la course inclusive régionale", date: "28 Septembre 2026", color: "bg-pink-600", label: "Événement", image: "IMG-20240407-WA0016-1024x683.jpg"}
                ].map((actu, i) => (
                  <Link key={i} href="/actualites">
                    <div className="bg-white rounded-[2rem] border-4 border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col h-full">
                      <div className="h-64 relative overflow-hidden bg-slate-100 border-b-4 border-slate-100">
                         <img src={`/photos/${actu.image}`} alt={actu.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-80"></div>
                         <div className={`absolute bottom-4 left-6 px-4 py-2 font-extrabold text-sm rounded-full ${actu.color} text-white shadow-lg`}>{actu.label}</div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-800">{actu.title}</h3>
                        <p className="text-xl font-medium text-slate-500 mt-auto">{actu.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Blocs Témoignages */}
            <div className="space-y-12">
              <div className="border-b-4 border-slate-200 pb-6">
                <h2 className="text-5xl font-black text-slate-900">Ils en parlent</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <Card className="border-4 border-blue-100 bg-blue-50/50 rounded-[2.5rem] shadow-xl p-6">
                  <CardContent className="pt-8">
                    <span className="text-6xl text-blue-300 font-serif leading-none">"</span>
                    <p className="text-2xl font-medium text-slate-800 leading-relaxed italic mb-8 mt-4">
                      Grâce au Guide Booster, j'ai pu trouver un club d'escrime adapté à mes capacités en moins de cinq minutes. Les informations étaient claires et à jour.
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-200 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-3xl font-black text-slate-900">Marc D.</p>
                        <p className="text-xl font-medium text-slate-600">Pratiquant Handisport</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-purple-100 bg-purple-50/50 rounded-[2.5rem] shadow-xl p-6">
                  <CardContent className="pt-8">
                    <span className="text-6xl text-purple-300 font-serif leading-none">"</span>
                    <p className="text-2xl font-medium text-slate-800 leading-relaxed italic mb-8 mt-4">
                      Cet outil est une vraie révolution pour nous, médecins. On peut enfin prescrire de l'Activité Physique Adaptée en sachant exactement où envoyer nos patients et vers qui.
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-purple-200 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-3xl font-black text-slate-900">Dr. Sophie L.</p>
                        <p className="text-xl font-medium text-slate-600">Médecin Généraliste</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-5">
            <div className="bg-white p-3 lg:p-4 rounded-2xl w-48 shadow-inner">
              <img src="/logo-handiboost.png" alt="Handiboost" className="w-full h-auto object-contain" />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-center">
            <Link href="/association" className="text-2xl font-bold text-slate-300 hover:text-white transition-colors underline-offset-8 hover:underline">À propos</Link>
            <Link href="/mentions-legales" className="text-2xl font-bold text-slate-300 hover:text-white transition-colors underline-offset-8 hover:underline">Mentions légales</Link>
            <Link href="/politique-de-confidentialite" className="text-2xl font-bold text-slate-300 hover:text-white transition-colors underline-offset-8 hover:underline">Confidentialité</Link>
            <Link href="/contact" className="text-2xl font-bold text-slate-300 hover:text-white transition-colors underline-offset-8 hover:underline">Nous contacter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

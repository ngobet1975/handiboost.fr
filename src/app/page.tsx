import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeSearchBar } from '@/components/HomeSearchBar'
import { NewsletterPopup } from '@/components/NewsletterPopup'
import { getArticles } from '@/app/admin/articles/actions'

const defilementImages = Array.from({ length: 15 }, (_, i) => `${i + 1}.png`);

const images1 = defilementImages;
const images2 = [...defilementImages.slice(5), ...defilementImages.slice(0, 5)];
const images3 = [...defilementImages.slice(10), ...defilementImages.slice(0, 10)];
const images4 = [...defilementImages.slice(3), ...defilementImages.slice(0, 3)];

export default async function Home() {
  const allArticles = await getArticles();
  const latestActus = allArticles
    .filter(actu => actu.status === 'published')
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen text-slate-900">


      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-16 lg:py-24 px-6 border-b-4 border-slate-200 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Badge + Titre + Mascotte */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-10 text-center md:text-left">
              <div className="flex-1">
                <div className="inline-flex items-center justify-center md:justify-start gap-2 bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-bold text-lg mb-6">
                  💙 Association loi 1901
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
                  L&apos;Activité Physique Adaptée,<br />
                  <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    accessible à tous.
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto md:mx-0 leading-relaxed font-medium mt-6">
                  Un accès simple et clair à toutes les informations utiles pour pratiquer une activité physique adaptée et régulière.
                </p>
              </div>
              <div className="w-48 md:w-1/3 max-w-[250px] mx-auto md:mx-0">
                 <img src="/boosty.png?v=2" alt="Mascotte Boosty" className="w-full h-auto object-contain drop-shadow-2xl animate-bounce-slow" />
              </div>
            </div>

            {/* Barre de recherche */}
            <HomeSearchBar />

            {/* CTA - Choix du profil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
              <Link href="/pratiquants" className="group bg-blue-800 hover:bg-blue-900 text-white py-7 px-8 flex items-center gap-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all no-underline">
                <span className="text-4xl flex-shrink-0">🙋‍♀️</span>
                <div>
                  <span className="block text-2xl font-bold">Je suis pratiquant</span>
                  <span className="block text-sm font-medium text-blue-200 mt-1">Activités, événements, aides financières</span>
                </div>
              </Link>
              
              <Link href="/professionnels" className="group bg-purple-700 hover:bg-purple-800 text-white py-7 px-8 flex items-center gap-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all no-underline">
                <span className="text-4xl flex-shrink-0">🩺</span>
                <div>
                  <span className="block text-2xl font-bold">Je suis professionnel</span>
                  <span className="block text-sm font-medium text-purple-200 mt-1">Ressources, outils, Guide Booster</span>
                </div>
              </Link>
            </div>
          </div>
        </section>




        {/* Feature Section (Gros blocs) */}
        <section className="py-24 px-6 bg-white border-b-4 border-slate-200">
          <div className="max-w-[90rem] mx-auto space-y-16">
             <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 md:mb-8">Une plateforme centralisée pour l'APA</h2>
                <p className="text-slate-800 text-2xl lg:text-3xl leading-normal font-medium">Tout ce dont vous avez besoin pour encourager ou pratiquer le sport adapté, facile à lire et à utiliser.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10">
                {/* Carte Infos Pratiques (Bleu Clair) */}
                <Card className="border-4 border-sky-100 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-sky-500 w-full"></div>
                  <CardHeader className="pt-8 px-6 xl:pt-10 xl:px-8">
                    <div className="w-full h-32 xl:h-36 mb-6 xl:mb-8 flex items-center overflow-hidden rounded-xl border border-sky-100 bg-white">
                      <div className="flex w-max animate-marquee items-center py-2" style={{ animationDuration: '45s' }}>
                        {[...images1, ...images1].map((img, idx) => (
                          <img key={idx} src={`/illustrations/${img}`} alt="Personnage Handiboost" className="h-28 xl:h-32 w-auto object-contain mx-16 drop-shadow-md animate-bob" style={{ animationDelay: `${(idx % 15) * 0.3}s` }} />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 text-center">Infos Pratiques</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 xl:px-8 text-slate-800 text-xl xl:text-2xl leading-relaxed font-medium flex-1 pb-8 xl:pb-10">
                    Trouver une activité physique proche de chez vous, des informations et des ressources
                  </CardContent>
                  <div className="p-6 xl:p-8 pt-0 mt-auto">
                     <Link href="/pratiquants/aides-financieres" className="block w-full text-center text-2xl font-extrabold border-4 border-sky-200 text-sky-700 hover:bg-sky-50 py-4 rounded-2xl transition-all no-underline">Trouver une activité</Link>
                  </div>
                </Card>

                {/* Carte Agenda (Orange) */}
                <Card className="border-4 border-orange-100 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-orange-500 w-full"></div>
                  <CardHeader className="pt-8 px-6 xl:pt-10 xl:px-8">
                    <div className="w-full h-32 xl:h-36 mb-6 xl:mb-8 flex items-center overflow-hidden rounded-xl border border-orange-100 bg-white">
                      <div className="flex w-max animate-marquee items-center py-2" style={{ animationDuration: '38s', animationDelay: '-15s' }}>
                        {[...images2, ...images2].map((img, idx) => (
                          <img key={idx} src={`/illustrations/${img}`} alt="Personnage Handiboost" className="h-28 xl:h-32 w-auto object-contain mx-16 drop-shadow-md animate-bob" style={{ animationDelay: `${(idx % 15) * 0.3 + 0.4}s` }} />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 text-center">Événements</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 xl:px-8 text-slate-800 text-xl xl:text-2xl leading-relaxed font-medium flex-1 pb-8 xl:pb-10">
                    Trouver des événements sportifs adaptés proches de chez vous
                  </CardContent>
                  <div className="p-6 xl:p-8 pt-0 mt-auto">
                     <Link href="/pratiquants/evenements" className="block w-full text-center text-2xl font-extrabold border-4 border-orange-200 text-orange-700 hover:bg-orange-50 py-4 rounded-2xl transition-all no-underline">Voir l&apos;Agenda</Link>
                  </div>
                </Card>

                {/* Carte Actualités (Rose) */}
                <Card className="border-4 border-pink-100 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-pink-600 w-full"></div>
                  <CardHeader className="pt-8 px-6 xl:pt-10 xl:px-8">
                    <div className="w-full h-32 xl:h-36 mb-6 xl:mb-8 flex items-center overflow-hidden rounded-xl border border-pink-100 bg-white">
                      <div className="flex w-max animate-marquee items-center py-2" style={{ animationDuration: '50s', animationDelay: '-5s' }}>
                        {[...images3, ...images3].map((img, idx) => (
                          <img key={idx} src={`/illustrations/${img}`} alt="Personnage Handiboost" className="h-28 xl:h-32 w-auto object-contain mx-16 drop-shadow-md animate-bob" style={{ animationDelay: `${(idx % 15) * 0.3 + 0.8}s` }} />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 text-center">Actualités</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 xl:px-8 text-slate-800 text-xl xl:text-2xl leading-relaxed font-medium flex-1 pb-8 xl:pb-10">
                    Lire les nouvelles sur l'APA et l'association
                  </CardContent>
                  <div className="p-6 xl:p-8 pt-0 mt-auto">
                     <Link href="/actualites" className="block w-full text-center text-2xl font-extrabold border-4 border-pink-200 text-pink-700 hover:bg-pink-50 py-4 rounded-2xl transition-all no-underline">Lire les actualités</Link>
                  </div>
                </Card>

                {/* Carte Espace Pro (Violet) */}
                <Card className="border-4 border-purple-100 shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-purple-700 w-full"></div>
                  <CardHeader className="pt-8 px-6 xl:pt-10 xl:px-8">
                    <div className="w-full h-32 xl:h-36 mb-6 xl:mb-8 flex items-center overflow-hidden rounded-xl border border-purple-100 bg-white">
                      <div className="flex w-max animate-marquee items-center py-2" style={{ animationDuration: '42s', animationDelay: '-25s' }}>
                        {[...images4, ...images4].map((img, idx) => (
                          <img key={idx} src={`/illustrations/${img}`} alt="Personnage Handiboost" className="h-28 xl:h-32 w-auto object-contain mx-16 drop-shadow-md animate-bob" style={{ animationDelay: `${(idx % 15) * 0.3 + 1.2}s` }} />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 text-center">Professionnels</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 xl:px-8 text-slate-800 text-xl xl:text-2xl leading-relaxed font-medium flex-1 pb-8 xl:pb-10">
                    Ressources et outils pour les professionnels du sport et de la santé
                  </CardContent>
                  <div className="p-6 xl:p-8 pt-0 mt-auto">
                     <Link href="/professionnels" className="block w-full text-center text-2xl font-extrabold border-4 border-purple-200 text-purple-700 hover:bg-purple-50 py-4 rounded-2xl transition-all no-underline">Espace Professionnels</Link>
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
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900">Dernières Actualités</h2>
                <Link href="/actualites" className="text-2xl font-extrabold text-blue-800 hover:underline hover:text-blue-900 hidden md:block">Toutes les actus →</Link>
              </div>
              
              <div className="grid md:grid-cols-3 gap-10">
                {latestActus.map((actu, i) => {
                  const colors = ["bg-orange-500", "bg-sky-500", "bg-pink-600"];
                  const color = colors[i % colors.length];
                  const formattedDate = new Date(actu.published_at || new Date()).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });
                  return (
                  <Link key={actu.id} href={`/actualites#${actu.id}`}>
                    <div className="bg-white rounded-[2rem] border-4 border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col h-full">
                      <div className="h-64 relative overflow-hidden bg-slate-100 border-b-4 border-slate-100">
                         <img src={actu.cover_image?.startsWith('http') ? actu.cover_image : `/photos/${actu.cover_image}`} alt={actu.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-80"></div>
                         <div className={`absolute bottom-4 left-6 px-4 py-2 font-extrabold text-sm rounded-full ${color} text-white shadow-lg`}>Actualité</div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-800">{actu.title}</h3>
                        <p className="text-xl font-medium text-slate-500 mt-auto">{formattedDate}</p>
                      </div>
                    </div>
                  </Link>
                )})}
              </div>
            </div>

            {/* Blocs Témoignages */}
            <div className="space-y-12">
              <div className="border-b-4 border-slate-200 pb-6">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900">Ils en parlent</h2>
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


      <NewsletterPopup />
    </div>
  )
}

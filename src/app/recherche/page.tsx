import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, SearchX } from 'lucide-react';

// Métadonnées statiques des pages du site pour la recherche
const SITE_PAGES = [
  {
    title: "Espace Pratiquants",
    description: "Trouver une activité sportive adaptée, un événement près de chez vous, ou une aide financière.",
    keywords: ["pratiquant", "sport", "handicap", "activité", "événement", "club", "agenda", "aide", "financement"],
    url: "/pratiquants",
    icon: "🙋‍♀️"
  },
  {
    title: "Espace Professionnels",
    description: "Ressources, fiches techniques et outils pour les professionnels de la santé et du sport (prescripteurs).",
    keywords: ["professionnel", "santé", "médecin", "prescripteur", "outil", "fiche", "sport sur ordonnance"],
    url: "/professionnels",
    icon: "🩺"
  },
  {
    title: "Guide Booster",
    description: "L'annuaire intelligent de l'Activité Physique Adaptée (APA) en région.",
    keywords: ["guide", "booster", "annuaire", "recherche", "liste", "structure", "association", "apa"],
    url: "/guide-booster",
    icon: "📖"
  },
  {
    title: "Actualités",
    description: "Toutes les nouveautés, événements passés et annonces de la communauté Handiboost.",
    keywords: ["actualité", "news", "nouvelle", "blog", "article", "événement"],
    url: "/actualites",
    icon: "📰"
  },
  {
    title: "Faire un Don",
    description: "Soutenez l'association Handiboost pour développer le sport pour tous.",
    keywords: ["don", "soutenir", "financer", "mécénat", "participer"],
    url: "/dons",
    icon: "❤️"
  },
  {
    title: "Notre Association",
    description: "Découvrez l'histoire, l'équipe et les missions de l'association loi 1901 Handiboost.",
    keywords: ["association", "qui sommes nous", "équipe", "mission", "valeur", "histoire", "contact", "bénévole"],
    url: "/association",
    icon: "🤝"
  },
  {
    title: "Contact",
    description: "Une question ? Un besoin spécifique ? Contactez l'équipe Handiboost.",
    keywords: ["contact", "message", "email", "téléphone", "formulaire", "aide", "support"],
    url: "/contact",
    icon: "✉️"
  }
];

export default async function RecherchePage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const rawQuery = searchParams.q || '';
  const query = rawQuery.toLowerCase().trim();

  let results = SITE_PAGES;

  if (query) {
    results = SITE_PAGES.filter(page => {
      const matchTitle = page.title.toLowerCase().includes(query);
      const matchDesc = page.description.toLowerCase().includes(query);
      const matchKeyword = page.keywords.some(k => k.toLowerCase().includes(query));
      return matchTitle || matchDesc || matchKeyword;
    });
  }

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-slate-50">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 lg:py-24">
        <div className="mb-12">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
            &larr; Retour à l'accueil
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">
            Résultats pour <span className="text-blue-700">"{rawQuery}"</span>
          </h1>
          <p className="text-xl text-slate-600 mt-4">
            {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result, i) => (
              <Link key={i} href={result.url} className="group outline-none">
                <Card className="h-full border-4 border-slate-200 hover:border-blue-500 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 bg-white rounded-3xl overflow-hidden cursor-pointer group-focus-visible:ring-4 group-focus-visible:ring-blue-300">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shrink-0 group-hover:bg-blue-100 transition-colors">
                      {result.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold group-hover:text-blue-700 transition-colors">
                        {result.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                      {result.description}
                    </p>
                    <div className="inline-flex items-center gap-2 font-bold text-blue-600 group-hover:text-blue-800 transition-colors">
                      Découvrir <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border-4 border-slate-200 rounded-[2.5rem] p-12 text-center shadow-lg">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <SearchX className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Oups, rien trouvé !</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-xl mx-auto">
              Nous n'avons trouvé aucune rubrique correspondant à "{rawQuery}". Essayez avec d'autres mots-clés ou explorez nos sections principales.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-md transition-all hover:-translate-y-1">
              Retourner à l'accueil
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

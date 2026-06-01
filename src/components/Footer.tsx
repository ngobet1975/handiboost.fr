import Link from 'next/link'

export function Footer() {
  return (
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
  )
}

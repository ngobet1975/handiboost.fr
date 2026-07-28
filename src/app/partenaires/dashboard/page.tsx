import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { getPartnerByEmail } from '@/app/partenaires/actions'
import PartnerDashboardClient from './client'

export const metadata = {
  title: 'Mon Espace Partenaire | Handiboost',
  description: 'Gérez votre fiche partenaire et signez la Charte Handiboost.',
}

async function getPartnerEmailFromSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('partner_session')
  if (!sessionCookie) return null
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || process.env.ADMIN_TOTP_SECRET || 'handiboost-fallback-secret-2026'
    )
    const { payload } = await jwtVerify(sessionCookie.value, secret)
    if (payload.role !== 'partner') return null
    return payload.email as string
  } catch {
    return null
  }
}

export default async function PartnerDashboardPage() {
  const email = await getPartnerEmailFromSession()
  if (!email) redirect('/partenaires/connexion')

  const partner = await getPartnerByEmail(email)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-base font-bold text-slate-500">
            <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
            <span>&gt;</span>
            <Link href="/partenaires" className="hover:text-blue-800 hover:underline transition-all">Espace Partenaires</Link>
            <span>&gt;</span>
            <span className="text-slate-800">Mon espace</span>
          </div>
          <form action="/auth/partner-signout" method="post">
            <button type="submit" className="text-sm font-bold text-slate-500 hover:text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <PartnerDashboardClient email={email} initialPartner={partner} />
      </div>
    </div>
  )
}

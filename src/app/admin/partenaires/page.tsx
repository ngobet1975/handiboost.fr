import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { getAllPartners, adminUpdatePartner, adminDeletePartner } from '@/app/partenaires/actions'
import AdminPartenairesClient from './client'

export const metadata = {
  title: 'Admin — Partenaires | Handiboost',
}

async function isAdmin() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('admin_session')
  if (!adminCookie) return false
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || process.env.ADMIN_TOTP_SECRET || 'handiboost-fallback-secret-2026'
    )
    const { payload } = await jwtVerify(adminCookie.value, secret)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export default async function AdminPartenairesPage() {
  if (!(await isAdmin())) redirect('/login')

  const partners = await getAllPartners()

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-base font-bold text-slate-500">
          <Link href="/admin" className="hover:text-blue-800 hover:underline transition-all">Admin</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Partenaires</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <AdminPartenairesClient partners={partners} />
      </div>
    </div>
  )
}

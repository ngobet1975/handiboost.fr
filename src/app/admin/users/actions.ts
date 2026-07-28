'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export async function getAdherents() {
  noStore()
  let adherents: any[] | null = await redis.get('handiboost_adherents')
  
  if (!adherents) {
    try {
      const filePath = path.join(process.cwd(), 'src/data/adherents.json')
      adherents = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (adherents) await redis.set('handiboost_adherents', adherents)
    } catch (e) {
      adherents = []
    }
  }
  return adherents || []
}

export async function addAdherent(formData: FormData) {
  const rawNom = formData.get('nom') as string
  const rawPrenom = formData.get('prenom') as string
  const email = formData.get('email') as string
  const typeAdhesion = formData.get('typeAdhesion') as string
  const telephone = formData.get('telephone') as string || ''
  const dateAdhesion = formData.get('dateAdhesion') as string || ''
  const profession = formData.get('profession') as string || ''

  const capitalize = (str: string) => {
    if (!str) return ''
    return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase()
  }

  const formatE164 = (phone: string) => {
    if (!phone) return ''
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('0') && digits.length === 10) return '+33' + digits.slice(1)
    if (digits.startsWith('33') && digits.length === 11) return '+' + digits
    if (phone.trim().startsWith('+')) return '+' + digits
    return digits
  }

  const adherents = await getAdherents()
  
  adherents.push({
    id: crypto.randomUUID(),
    nom: capitalize(rawNom),
    prenom: capitalize(rawPrenom),
    email: email.trim().toLowerCase(),
    telephone: formatE164(telephone),
    dateAdhesion,
    profession: capitalize(profession),
    typeAdhesion
  })

  await redis.set('handiboost_adherents', adherents)
  revalidatePath('/admin/users')
}

export async function deleteAdherent(id: string) {
  const adherents = await getAdherents()
  const filtered = adherents.filter((a: any) => a.id !== id)
  
  await redis.set('handiboost_adherents', filtered)
  revalidatePath('/admin/users')
}

export async function updateAdherent(id: string, formData: FormData) {
  const rawNom = formData.get('nom') as string
  const rawPrenom = formData.get('prenom') as string
  const email = formData.get('email') as string
  const typeAdhesion = formData.get('typeAdhesion') as string
  const telephone = formData.get('telephone') as string || ''
  const dateAdhesion = formData.get('dateAdhesion') as string || ''
  const profession = formData.get('profession') as string || ''

  const capitalize = (str: string) => {
    if (!str) return ''
    return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase()
  }

  const formatE164 = (phone: string) => {
    if (!phone) return ''
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('0') && digits.length === 10) return '+33' + digits.slice(1)
    if (digits.startsWith('33') && digits.length === 11) return '+' + digits
    if (phone.trim().startsWith('+')) return '+' + digits
    return digits
  }

  const adherents = await getAdherents()
  const index = adherents.findIndex((a: any) => a.id === id)
  
  if (index !== -1) {
    adherents[index] = {
      ...adherents[index],
      nom: capitalize(rawNom),
      prenom: capitalize(rawPrenom),
      email: email.trim().toLowerCase(),
      telephone: formatE164(telephone),
      dateAdhesion,
      profession: capitalize(profession),
      typeAdhesion
    }
    await redis.set('handiboost_adherents', adherents)
    revalidatePath('/admin/users')
  }
}

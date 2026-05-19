'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

const filePath = path.join(process.cwd(), 'src/data/adherents.json')

export async function getAdherents() {
  const data = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(data)
}

export async function addAdherent(formData: FormData) {
  const rawNom = formData.get('nom') as string
  const rawPrenom = formData.get('prenom') as string
  const email = formData.get('email') as string
  const typeAdhesion = formData.get('typeAdhesion') as string
  const telephone = formData.get('telephone') as string || ''
  const dateAdhesion = formData.get('dateAdhesion') as string || ''
  const dateAttribution = formData.get('dateAttribution') as string || ''
  const dateFinAdhesion = formData.get('dateFinAdhesion') as string || ''

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
    dateAttribution,
    dateFinAdhesion,
    typeAdhesion
  })

  fs.writeFileSync(filePath, JSON.stringify(adherents, null, 2))
  revalidatePath('/admin/users')
}

export async function deleteAdherent(id: string) {
  const adherents = await getAdherents()
  const filtered = adherents.filter((a: any) => a.id !== id)
  
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
  revalidatePath('/admin/users')
}

export async function updateAdherent(id: string, formData: FormData) {
  const rawNom = formData.get('nom') as string
  const rawPrenom = formData.get('prenom') as string
  const email = formData.get('email') as string
  const typeAdhesion = formData.get('typeAdhesion') as string
  const telephone = formData.get('telephone') as string || ''
  const dateAdhesion = formData.get('dateAdhesion') as string || ''
  const dateAttribution = formData.get('dateAttribution') as string || ''
  const dateFinAdhesion = formData.get('dateFinAdhesion') as string || ''

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
      dateAttribution,
      dateFinAdhesion,
      typeAdhesion
    }
    fs.writeFileSync(filePath, JSON.stringify(adherents, null, 2))
    revalidatePath('/admin/users')
  }
}

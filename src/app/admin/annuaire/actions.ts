'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export async function getActivites() {
  noStore()
  let activites: string[] | null = await redis.get('handiboost_activites')
  if (!activites) {
    try {
      const filePath = path.join(process.cwd(), 'src/data/activites.json')
      activites = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (activites) await redis.set('handiboost_activites', activites)
    } catch (e) {
      activites = []
    }
  }
  return activites || []
}

export async function addActivite(name: string) {
  const activites = await getActivites()
  const formattedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
  
  if (!activites.includes(formattedName)) {
    activites.push(formattedName)
    activites.sort((a: string, b: string) => a.localeCompare(b, 'fr'))
    await redis.set('handiboost_activites', activites)
    revalidatePath('/admin/annuaire')
  }
}

export async function deleteActivite(name: string) {
  const activites = await getActivites()
  const filtered = activites.filter((a: string) => a !== name)
  
  await redis.set('handiboost_activites', filtered)
  revalidatePath('/admin/annuaire')
}

export async function getStructures() {
  noStore()
  let structures: any[] | null = await redis.get('handiboost_structures')
  if (!structures) {
    try {
      const filePath = path.join(process.cwd(), 'src/data/structures.json')
      structures = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (structures) await redis.set('handiboost_structures', structures)
    } catch (e) {
      structures = []
    }
  }
  return structures || []
}

export async function addStructure(data: any) {
  const structures = await getStructures()
  
  structures.push({
    id: crypto.randomUUID(),
    nom: data.nom.trim(),
    activite: data.activite?.trim() || '',
    public: data.public?.trim() || '',
    adresse: data.adresse?.trim() || '',
    site: data.site?.trim() || '',
    telephone: data.telephone?.trim() || '',
    mail: data.mail?.trim() || '',
    informations: data.informations?.trim() || '',
    appele: data.appele?.trim() || 'non',
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    est_itinerant: data.est_itinerant || false,
    rayon_intervention: data.rayon_intervention ? Number(data.rayon_intervention) : null,
    verifiedAt: null,
    enAttenteMaj: false,
  })

  await redis.set('handiboost_structures', structures)
  revalidatePath('/admin/annuaire')
  revalidatePath('/guide-booster')
}

export async function deleteStructure(id: string) {
  const structures = await getStructures()
  const filtered = structures.filter((s: any) => s.id !== id)
  
  await redis.set('handiboost_structures', filtered)
  revalidatePath('/admin/annuaire')
}

export async function updateStructure(id: string, data: any) {
  const structures = await getStructures()
  const index = structures.findIndex((s: any) => s.id === id)
  
  if (index !== -1) {
    structures[index] = {
      ...structures[index],
      nom: data.nom.trim(),
      activite: data.activite?.trim() || '',
      public: data.public?.trim() || '',
      adresse: data.adresse?.trim() || '',
      site: data.site?.trim() || '',
      telephone: data.telephone?.trim() || '',
      mail: data.mail?.trim() || '',
      informations: data.informations?.trim() || '',
      appele: data.appele?.trim() || 'non',
      latitude: data.latitude !== undefined ? data.latitude : structures[index].latitude,
      longitude: data.longitude !== undefined ? data.longitude : structures[index].longitude,
      est_itinerant: data.est_itinerant ?? structures[index].est_itinerant ?? false,
      rayon_intervention: data.rayon_intervention != null ? Number(data.rayon_intervention) : (structures[index].rayon_intervention ?? null),
      enAttenteMaj: false,
    }
    await redis.set('handiboost_structures', structures)
    revalidatePath('/admin/annuaire')
    revalidatePath('/guide-booster')
  }
}

export async function validateStructure(id: string) {
  const structures = await getStructures()
  const index = structures.findIndex((s: any) => s.id === id)
  if (index !== -1) {
    structures[index].verifiedAt = new Date().toISOString()
    structures[index].enAttenteMaj = false
    await redis.set('handiboost_structures', structures)
    revalidatePath('/guide-booster')
    revalidatePath('/admin/annuaire')
  }
}

export async function reportStructureError(id: string) {
  const structures = await getStructures()
  const index = structures.findIndex((s: any) => s.id === id)
  
  if (index !== -1) {
    structures[index].enAttenteMaj = true
    await redis.set('handiboost_structures', structures)
    revalidatePath('/admin/annuaire')
    revalidatePath('/guide-booster')
  }
}

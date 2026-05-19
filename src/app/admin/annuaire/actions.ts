'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

const filePath = path.join(process.cwd(), 'src/data/structures.json')
const activitesFilePath = path.join(process.cwd(), 'src/data/activites.json')

export async function getActivites() {
  if (!fs.existsSync(activitesFilePath)) return []
  const data = fs.readFileSync(activitesFilePath, 'utf8')
  return JSON.parse(data)
}

export async function addActivite(name: string) {
  const activites = await getActivites()
  const formattedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
  
  if (!activites.includes(formattedName)) {
    activites.push(formattedName)
    // Sort alphabetically
    activites.sort((a: string, b: string) => a.localeCompare(b, 'fr'))
    fs.writeFileSync(activitesFilePath, JSON.stringify(activites, null, 2))
    revalidatePath('/admin/annuaire')
  }
}

export async function deleteActivite(name: string) {
  const activites = await getActivites()
  const filtered = activites.filter((a: string) => a !== name)
  
  fs.writeFileSync(activitesFilePath, JSON.stringify(filtered, null, 2))
  revalidatePath('/admin/annuaire')
}


export async function getStructures() {
  if (!fs.existsSync(filePath)) return []
  const data = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(data)
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
    longitude: data.longitude || null
  })

  fs.writeFileSync(filePath, JSON.stringify(structures, null, 2))
  revalidatePath('/admin/annuaire')
}

export async function deleteStructure(id: string) {
  const structures = await getStructures()
  const filtered = structures.filter((s: any) => s.id !== id)
  
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
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
      enAttenteMaj: false
    }
    fs.writeFileSync(filePath, JSON.stringify(structures, null, 2))
    revalidatePath('/admin/annuaire')
  }
}


export async function reportStructureError(id: string) {
  const structures = await getStructures()
  const index = structures.findIndex((s: any) => s.id === id)
  
  if (index !== -1) {
    structures[index].enAttenteMaj = true
    const filePath = require('path').join(process.cwd(), 'src/data/structures.json')
    require('fs').writeFileSync(filePath, JSON.stringify(structures, null, 2))
    revalidatePath('/admin/annuaire')
    revalidatePath('/guide-booster')
  }
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Info, Send, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CharteModal } from '@/components/CharteModal'
import { addStructure } from '@/app/admin/annuaire/actions'

export default function RejoindreGuidePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isCharteOpen, setIsCharteOpen] = useState(false)

  const [formData, setFormData] = useState({
    nom: '',
    type_structure: '',
    type_intervention: 'En structure',
    rayon_intervention: '',
    activite: '',
    public: '',
    age: '',
    adresse: '',
    site: '',
    reseaux: '',
    telephone: '',
    mail: '',
    creneaux: '',
    evenements: '',
    tarifs: '',
    accessibilite: '',
    diplome: '',
    partenariats: '',
    informations: '',
    charte_accept: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.charte_accept) {
      setError('Vous devez accepter la charte d\'engagement pour soumettre votre demande.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await addStructure({
        ...formData,
        est_itinerant: formData.type_intervention === 'Itinérant',
        enAttenteMaj: true, // Demande en attente de validation
      })
      setIsSuccess(true)
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center border-2 border-green-100">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Demande envoyée !</h1>
          <p className="text-xl text-slate-600 mb-10">
            Merci d'avoir soumis votre structure. Notre équipe va examiner votre demande et la valider prochainement. Vous apparaîtrez ensuite dans le Guide Booster.
          </p>
          <Button nativeButton={false} render={<Link href="/guide-booster" />} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 h-auto rounded-xl text-lg">
            Retour au Guide Booster
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-blue-900 text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/guide-booster" className="inline-flex items-center text-blue-200 hover:text-white font-medium mb-8 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" /> Retour au Guide Booster
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Intégrez le <span className="text-blue-300">Guide Booster</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
            Faites connaître votre structure auprès des professionnels de santé et facilitez l'orientation des patients vers une activité physique adaptée.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 p-6 md:p-10">
          
          <div className="flex items-start gap-4 mb-10 bg-blue-50 border border-blue-200 p-6 rounded-2xl">
            <Info className="w-8 h-8 text-blue-600 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-1">Comment ça marche ?</h3>
              <p className="text-blue-800">
                Remplissez ce formulaire pour être référencé. Une fois soumis, notre équipe étudiera votre demande. Vous serez ajouté au Guide Booster une fois votre profil validé (les données sont vérifiées manuellement).
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3 font-medium">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Informations Générales */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-100 pb-4 mb-6">1. Informations générales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom de la structure *</label>
                  <input required name="nom" value={formData.nom} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800" placeholder="Ex: Handi Sport Club Paris" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type de structure *</label>
                  <select required name="type_structure" value={formData.type_structure} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800">
                    <option value="">Sélectionnez...</option>
                    <option value="Association sportive">Association sportive</option>
                    <option value="Maison Sport-Santé">Maison Sport-Santé</option>
                    <option value="Professionnel indépendant (EAPA, Kiné...)">Professionnel indépendant (EAPA, Kiné...)</option>
                    <option value="Institution / Hôpital / Centre">Institution / Hôpital / Centre</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Adresse physique *</label>
                  <input required name="adresse" value={formData.adresse} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Adresse complète" />
                </div>
              </div>
            </div>

            {/* 2. Pratique & Activités */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-100 pb-4 mb-6">2. Pratique & Modalités</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Activité(s) proposée(s) *</label>
                  <input required name="activite" value={formData.activite} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Ex: Natation, Athlétisme, Multisport..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Modalité d'intervention *</label>
                  <select required name="type_intervention" value={formData.type_intervention} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800">
                    <option value="En structure">En structure (sur place)</option>
                    <option value="Itinérant">Itinérant (à domicile ou extérieur)</option>
                    <option value="En distanciel">En distanciel (Visio)</option>
                    <option value="Mixte">Mixte</option>
                  </select>
                </div>
                {formData.type_intervention === 'Itinérant' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Rayon d'intervention (km) *</label>
                    <input required type="number" name="rayon_intervention" value={formData.rayon_intervention} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Ex: 30" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Public accueilli (Handicap) *</label>
                  <select required name="public" value={formData.public} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800">
                    <option value="">Sélectionnez...</option>
                    <option value="Moteur">Handicap Moteur</option>
                    <option value="Visuel">Handicap Visuel</option>
                    <option value="Auditif">Handicap Auditif</option>
                    <option value="Mental / Psychique">Handicap Mental / Psychique</option>
                    <option value="Tous types">Tous types de handicaps (Mixte)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tranche d'âge accueillie *</label>
                  <select required name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800">
                    <option value="">Sélectionnez...</option>
                    <option value="Enfants (0-11 ans)">Enfants (0-11 ans)</option>
                    <option value="Ados (12-17 ans)">Ados (12-17 ans)</option>
                    <option value="Adultes">Adultes</option>
                    <option value="Seniors">Seniors</option>
                    <option value="Tous âges">Tous âges</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Détails & Qualité */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-100 pb-4 mb-6">3. Qualité de l'accueil & Accessibilité</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Diplôme(s) ou qualification(s) des encadrants *</label>
                  <input required name="diplome" value={formData.diplome} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Ex: Licence STAPS APA, Diplôme d'Etat..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Accessibilité des lieux *</label>
                  <textarea required name="accessibilite" value={formData.accessibilite} onChange={handleChange} rows={3} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Précisez: rampes, ascenseurs, sanitaires adaptés, places PMR..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Créneaux horaires / Événements</label>
                  <input name="creneaux" value={formData.creneaux} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Ex: Les mardis 18h-20h" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tarifs pratiqués</label>
                  <input name="tarifs" value={formData.tarifs} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Ex: 150€ / an, Séance découverte offerte" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Partenariats existants (Réseau, Mutuelles, Institutions...)</label>
                  <input name="partenariats" value={formData.partenariats} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Ex: Réseau Sport Santé, Maison de l'autonomie" />
                </div>
              </div>
            </div>

            {/* 4. Contact Public */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-100 pb-4 mb-6">4. Coordonnées de contact (Publiques)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone *</label>
                  <input required name="telephone" value={formData.telephone} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="06 XX XX XX XX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                  <input required type="email" name="mail" value={formData.mail} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="contact@structure.fr" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Site web</label>
                  <input name="site" value={formData.site} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Réseaux sociaux</label>
                  <input name="reseaux" value={formData.reseaux} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Lien Facebook, Instagram, LinkedIn..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Informations complémentaires</label>
                  <textarea name="informations" value={formData.informations} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none font-medium text-slate-800" placeholder="Toute autre information pertinente pour les prescripteurs..."></textarea>
                </div>
              </div>
            </div>

            {/* 5. Charte */}
            <div className="bg-slate-50 border-2 border-slate-200 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Engagement qualité</h3>
              
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1">
                  <input 
                    type="checkbox" 
                    name="charte_accept"
                    checked={formData.charte_accept}
                    onChange={handleChange}
                    className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                  />
                  <CheckCircle2 className="w-4 h-4 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <div className="flex-1 text-slate-700 font-medium">
                  En soumettant cette demande, j'atteste sur l'honneur de l'exactitude des informations fournies et <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">j'accepte la Charte d'engagement Handiboost</span> requise pour figurer dans l'annuaire.
                </div>
              </label>

              <button 
                type="button" 
                onClick={() => setIsCharteOpen(true)}
                className="mt-4 text-blue-600 font-bold hover:underline ml-10 flex items-center gap-1"
              >
                <Info className="w-4 h-4" /> Lire la Charte d'engagement
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.charte_accept} 
              className="w-full h-auto py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande d\'intégration'}
              <Send className="w-6 h-6 ml-2" />
            </Button>
          </form>

        </div>
      </div>

      <CharteModal isOpen={isCharteOpen} onClose={() => setIsCharteOpen(false)} />
    </div>
  )
}

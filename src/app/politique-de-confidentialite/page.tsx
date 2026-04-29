import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Handiboost",
  description: "Politique de confidentialité du site handiboost.fr – traitement des données personnelles, droits RGPD et cookies.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline">Accueil</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Politique de confidentialité</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10">Politique de confidentialité</h1>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 prose prose-lg prose-slate max-w-none">
          
          <p><em>Dernière mise à jour : Avril 2026</em></p>

          <h2>1. Responsable du traitement</h2>
          <p>
            L'association <strong>Handiboost</strong> (loi 1901) est responsable du traitement des données personnelles collectées sur le site handiboost.fr.<br />
            Contact : <a href="mailto:contact@handiboost.fr">contact@handiboost.fr</a>
          </p>

          <h2>2. Données collectées</h2>
          <p>Nous collectons uniquement les données strictement nécessaires :</p>
          <ul>
            <li><strong>Formulaire de contact</strong> : nom, prénom, adresse e-mail, message. Ces données servent exclusivement à répondre à votre demande.</li>
            <li><strong>Compte professionnel</strong> : adresse e-mail et mot de passe (chiffré) pour l'accès à l'espace réservé aux professionnels de santé et du sport.</li>
          </ul>

          <h2>3. Finalités du traitement</h2>
          <ul>
            <li>Répondre aux demandes de contact</li>
            <li>Gérer les comptes utilisateurs (espace professionnel)</li>
            <li>Améliorer le fonctionnement du site</li>
          </ul>

          <h2>4. Base légale</h2>
          <p>
            Le traitement est fondé sur le <strong>consentement</strong> de l'utilisateur (formulaire de contact)
            et sur l'<strong>exécution d'un contrat</strong> (création de compte professionnel).
          </p>

          <h2>5. Destinataires des données</h2>
          <p>
            Vos données personnelles ne sont ni vendues, ni louées, ni transmises à des tiers à des fins commerciales.<br />
            Elles sont accessibles uniquement aux membres habilités de l'association Handiboost.
          </p>

          <h2>6. Hébergement et sécurité</h2>
          <p>
            Les données sont hébergées par :<br />
            <strong>Supabase Inc.</strong> (base de données, authentification) — serveurs situés en Europe (Francfort, Allemagne).<br />
            <strong>Hostinger International Ltd</strong> (hébergement web) — Chypre.<br />
            Les communications sont chiffrées via HTTPS (TLS 1.3). Les mots de passe sont hashés avec bcrypt.
          </p>

          <h2>7. Durée de conservation</h2>
          <ul>
            <li><strong>Données de contact</strong> : 12 mois après le dernier échange, puis supprimées.</li>
            <li><strong>Comptes professionnels</strong> : conservés tant que le compte est actif. Supprimés sur demande.</li>
          </ul>

          <h2>8. Vos droits (RGPD)</h2>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles.</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes.</li>
            <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données.</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format lisible.</li>
            <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données.</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@handiboost.fr">contact@handiboost.fr</a><br />
            Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
          </p>

          <h2>9. Cookies</h2>
          <p>
            Le site utilise uniquement des <strong>cookies techniques</strong> nécessaires au fonctionnement :
          </p>
          <ul>
            <li><strong>Session d'authentification</strong> : maintien de la connexion à l'espace professionnel.</li>
          </ul>
          <p>
            Aucun cookie publicitaire, de tracking ou d'analyse comportementale n'est utilisé.
            Aucun outil tiers de type Google Analytics, Facebook Pixel ou similaire n'est intégré.
          </p>

          <h2>10. Liens vers d'autres sites</h2>
          <p>
            Le site handiboost.fr peut contenir des liens vers des sites tiers (fédérations sportives, institutions publiques).
            L'association Handiboost n'est pas responsable du contenu ni des pratiques de confidentialité de ces sites externes.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-slate-500">
              Voir aussi : <Link href="/mentions-legales" className="text-blue-700 font-bold hover:underline">Mentions légales</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

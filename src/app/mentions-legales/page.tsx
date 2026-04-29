import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Handiboost",
  description: "Mentions légales du site handiboost.fr – éditeur, hébergeur, propriété intellectuelle et responsabilité.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline">Accueil</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Mentions légales</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10">Mentions légales</h1>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 prose prose-lg prose-slate max-w-none">
          <h2>Éditeur du site</h2>
          <p>
            Le site <strong>handiboost.fr</strong> est édité par l'association <strong>Handiboost</strong>, association loi 1901.<br />
            Siège social : <em>À compléter</em><br />
            N° RNA / SIRET : <em>À compléter</em><br />
            Directeur de la publication : <em>À compléter</em><br />
            E-mail : <a href="mailto:contact@handiboost.fr">contact@handiboost.fr</a>
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par <strong>Hostinger International Ltd</strong><br />
            Adresse : 61 Lordou Vironos st. 6023 Larnaca, Chypre<br />
            Site web : <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer">www.hostinger.fr</a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus (textes, images, illustrations, logos) présents sur le site handiboost.fr sont protégés par le droit d'auteur
            et sont la propriété exclusive de l'association Handiboost ou de leurs auteurs respectifs. Toute reproduction, même partielle,
            est interdite sans autorisation préalable écrite.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les informations collectées via le formulaire de contact sont destinées exclusivement à l'association Handiboost
            et ne sont ni vendues ni transmises à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès,
            de rectification et de suppression de vos données en écrivant à <a href="mailto:contact@handiboost.fr">contact@handiboost.fr</a>.
          </p>
          <p>
            Pour plus d'informations, consultez notre <Link href="/politique-de-confidentialite" className="text-blue-700 font-bold hover:underline">politique de confidentialité</Link>.
          </p>

          <h2>Cookies</h2>
          <p>
            Le site utilise des cookies strictement nécessaires au bon fonctionnement de la plateforme (authentification, session).
            Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
          </p>

          <h2>Responsabilité</h2>
          <p>
            L'association Handiboost s'efforce de fournir des informations aussi précises que possible. Toutefois,
            elle ne pourra être tenue responsable des omissions, inexactitudes ou des carences dans la mise à jour des données,
            qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
          </p>
          <p>
            Les fiches pathologies et conseils sportifs sont donnés à titre informatif et ne remplacent en aucun cas un avis médical professionnel.
          </p>

          <h2>Crédits</h2>
          <p>
            Développement : <strong>ITSynchronic</strong> — <a href="https://www.ITSynchronic.com" target="_blank" rel="noopener noreferrer">www.ITSynchronic.com</a> — Tél : <a href="tel:+33788505267">+33 7 88 50 52 67</a><br />
            Photos : Association Handiboost, fédérations partenaires
          </p>
        </div>
      </div>
    </div>
  );
}

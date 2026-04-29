-- =============================================================
-- PATCH: Update existing pathologies resources + Add 3 new ones
-- Run this in Supabase SQL Editor
-- =============================================================

-- 1. UPDATE existing pathologies with official resource links

UPDATE pathologies SET resources = '[
  {"label": "Fiche HAS : Prescription AP et Sclérose en plaques", "url": "https://www.has-sante.fr/jcms/p_3515053/fr/prescription-d-activite-physique-sclerose-en-plaques", "type": "link"},
  {"label": "Ameli : Comprendre la sclérose en plaques", "url": "https://www.ameli.fr/assure/sante/themes/sclerose-en-plaques", "type": "link"},
  {"label": "France Sclérose en Plaques (association)", "url": "https://www.sclerose-en-plaques.apf.asso.fr/", "type": "link"}
]'::jsonb
WHERE slug = 'sclerose-en-plaques';

UPDATE pathologies SET resources = '[
  {"label": "HAS : Rééducation et réadaptation - Paralysie cérébrale", "url": "https://www.has-sante.fr/jcms/p_3296068/fr/reeducation-et-readaptation-de-la-fonction-motrice-de-l-appareil-locomoteur-des-personnes-diagnostiquees-de-paralysie-cerebrale", "type": "link"},
  {"label": "Fondation Paralysie Cérébrale", "url": "https://www.fondationparalysiecerebrale.org/", "type": "link"},
  {"label": "Ameli : Paralysie cérébrale et IMC", "url": "https://www.ameli.fr/assure/sante/themes/paralysie-cerebrale", "type": "link"}
]'::jsonb
WHERE slug = 'paralysie-cerebrale';

UPDATE pathologies SET resources = '[
  {"label": "HAS : Boulimie et hyperphagie - Repérage et prise en charge", "url": "https://www.has-sante.fr/jcms/c_2581436/fr/boulimie-et-hyperphagie-boulimique-reperage-et-elements-generaux-de-prise-en-charge", "type": "link"},
  {"label": "Ameli : Les troubles du comportement alimentaire", "url": "https://www.ameli.fr/assure/sante/themes/troubles-comportement-alimentaire", "type": "link"},
  {"label": "FFAB : Fédération Française Anorexie Boulimie", "url": "https://www.ffab.fr/", "type": "link"}
]'::jsonb
WHERE slug = 'troubles-comportement-alimentaire';

UPDATE pathologies SET resources = '[
  {"label": "HAS : Guide prescription activité physique pour la santé", "url": "https://www.has-sante.fr/jcms/c_2725330/fr/prescription-d-activite-physique-a-des-fins-de-sante", "type": "link"},
  {"label": "AFAF : Association Française de l''Ataxie de Friedreich", "url": "https://www.afaf.asso.fr/", "type": "link"},
  {"label": "Orphanet : Ataxies cérébelleuses", "url": "https://www.orpha.net/fr/disease/category/68", "type": "link"}
]'::jsonb
WHERE slug = 'pathologies-cerebelleuses';

UPDATE pathologies SET resources = '[
  {"label": "Filnemus : Filière de santé maladies neuromusculaires", "url": "https://www.filnemus.fr/", "type": "link"},
  {"label": "AFM-Téléthon : Maladies neuromusculaires", "url": "https://www.afm-telethon.fr/", "type": "link"},
  {"label": "Ameli : Les maladies neuromusculaires", "url": "https://www.ameli.fr/assure/sante/themes/maladies-neuromusculaires", "type": "link"}
]'::jsonb
WHERE slug = 'maladies-neuromusculaires';

-- 2. INSERT the 3 NEW pathologies (only if they don't exist yet)

INSERT INTO pathologies (title, slug, description, benefits, precautions, recommended_activities, resources, status, validation_status)
SELECT 'Personnes âgées', 'personnes-agees',
  'L''activité physique adaptée chez les personnes âgées est essentielle pour maintenir l''autonomie, prévenir les chutes et favoriser le lien social.',
  '["Prévention des chutes et maintien de l''équilibre", "Renforcement musculaire et osseux", "Stimulation cognitive et lien social"]'::jsonb,
  '["Adapter l''intensité aux capacités individuelles", "Évaluer les risques cardiovasculaires avant la pratique", "Prévoir des temps de repos suffisants"]'::jsonb,
  '["Gymnastique douce, marche, aquagym, tai-chi, yoga adapté"]'::jsonb,
  '[{"label": "HAS : Prescription d''AP - Les personnes âgées", "url": "https://www.has-sante.fr/jcms/p_3079869/fr/prescription-d-activite-physique-et-sportive-les-personnes-agees", "type": "link"}, {"label": "Ministère de la Santé : Prévention de la perte d''autonomie", "url": "https://sante.gouv.fr/soins-et-maladies/prises-en-charge-specialisees/personnes-agees", "type": "link"}, {"label": "Ameli : Rester actif après 65 ans", "url": "https://www.ameli.fr/assure/sante/themes/activite-physique-sante/exercice-physique-personnes-agees", "type": "link"}]'::jsonb,
  'published', 'validated'
WHERE NOT EXISTS (SELECT 1 FROM pathologies WHERE slug = 'personnes-agees');

INSERT INTO pathologies (title, slug, description, benefits, precautions, recommended_activities, resources, status, validation_status)
SELECT 'Endométriose', 'endometriose',
  'L''activité physique adaptée peut contribuer à réduire les douleurs et à améliorer la qualité de vie des personnes atteintes d''endométriose.',
  '["Réduction des douleurs pelviennes chroniques", "Amélioration du bien-être psychologique", "Diminution de l''inflammation"]'::jsonb,
  '["Éviter les exercices à forte pression abdominale en période de crise", "Adapter l''intensité au cycle menstruel", "Privilégier les activités douces lors des épisodes douloureux"]'::jsonb,
  '["Yoga, natation, marche, pilates, stretching"]'::jsonb,
  '[{"label": "HAS : Endométriose - Diagnostic et prise en charge", "url": "https://www.has-sante.fr/jcms/p_3215953/fr/endometriose-prise-en-charge-diagnostique-et-therapeutique", "type": "link"}, {"label": "EndoFrance : Association de lutte contre l''endométriose", "url": "https://www.endofrance.org/", "type": "link"}, {"label": "Ameli : Comprendre l''endométriose", "url": "https://www.ameli.fr/assure/sante/themes/endometriose", "type": "link"}]'::jsonb,
  'published', 'validated'
WHERE NOT EXISTS (SELECT 1 FROM pathologies WHERE slug = 'endometriose');

INSERT INTO pathologies (title, slug, description, benefits, precautions, recommended_activities, resources, status, validation_status)
SELECT 'Santé mentale', 'sante-mentale',
  'L''activité physique adaptée joue un rôle majeur dans la prise en charge des troubles psychiques : dépression, anxiété, schizophrénie, troubles bipolaires.',
  '["Réduction des symptômes dépressifs et anxieux", "Amélioration de l''estime de soi et de l''image corporelle", "Favorise le lien social et la resocialisation"]'::jsonb,
  '["Adapter l''approche selon le type de trouble psychique", "Maintenir la régularité plutôt que l''intensité", "Travailler en lien avec l''équipe soignante"]'::jsonb,
  '["Marche, course à pied, danse, activités de groupe, arts martiaux adaptés"]'::jsonb,
  '[{"label": "HAS : Prescription d''activité physique à des fins de santé", "url": "https://www.has-sante.fr/jcms/c_2725330/fr/prescription-d-activite-physique-a-des-fins-de-sante", "type": "link"}, {"label": "Psycom : Activité physique et santé mentale", "url": "https://www.psycom.org/", "type": "link"}, {"label": "Santé publique France : Santé mentale", "url": "https://www.santepubliquefrance.fr/maladies-et-traumatismes/sante-mentale", "type": "link"}]'::jsonb,
  'published', 'validated'
WHERE NOT EXISTS (SELECT 1 FROM pathologies WHERE slug = 'sante-mentale');

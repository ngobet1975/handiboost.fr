-- ==========================================
-- SCRIPT DE MIGRATION INITIALE SUPABASE
-- PROJET: HANDIBOOST
-- Ce script crée le socle de la BDD et le RLS
-- ==========================================

-- Extension PostGIS pour la cartographie
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";

-- Types énumérés
CREATE TYPE structure_type AS ENUM ('kine', 'asso_sportive', 'maison_sport_sante', 'enseignant_apa');
CREATE TYPE feedback_type AS ENUM ('thumbs_up', 'thumbs_down');
CREATE TYPE validation_status AS ENUM ('pending', 'approved', 'rejected');

-- ==========================================
-- ZONE 1 : GUIDE BOOSTER (CŒUR MÉTIER)
-- ==========================================

CREATE TABLE public.structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type structure_type NOT NULL,
    address_text TEXT NOT NULL,
    lat FLOAT8,
    lng FLOAT8,
    -- geography(Point, 4326) de PostGIS pour faire des recherches par rayon natives
    location_geog GEOGRAPHY(POINT, 4326),
    intervention_radius_km INT DEFAULT 0,
    contact_phone TEXT,
    contact_email TEXT,
    external_directory_link TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour synchro automatique lat/lng vers location_geog
CREATE OR REPLACE FUNCTION update_location_geog()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location_geog := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_location
BEFORE INSERT OR UPDATE ON structures
FOR EACH ROW EXECUTE FUNCTION update_location_geog();

-- Tables Dictionnaires
CREATE TABLE public.publics_handicap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT UNIQUE NOT NULL
);

CREATE TABLE public.pratiques_sportives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT UNIQUE NOT NULL
);

-- Tables de jonction
CREATE TABLE public.structure_publics (
    structure_id UUID REFERENCES public.structures(id) ON DELETE CASCADE,
    public_id UUID REFERENCES public.publics_handicap(id) ON DELETE CASCADE,
    PRIMARY KEY (structure_id, public_id)
);

CREATE TABLE public.structure_pratiques (
    structure_id UUID REFERENCES public.structures(id) ON DELETE CASCADE,
    pratique_id UUID REFERENCES public.pratiques_sportives(id) ON DELETE CASCADE,
    PRIMARY KEY (structure_id, pratique_id)
);

CREATE TABLE public.feedbacks_obsolescence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    structure_id UUID REFERENCES public.structures(id) ON DELETE CASCADE,
    type_feedback feedback_type NOT NULL,
    comment TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ZONE 2 : ÉDITORIAL (LE CMS MOTEUR)
-- ==========================================

CREATE TABLE public.actualites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content_md TEXT NOT NULL,
    image_url TEXT,
    is_professional BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    publish_date TIMESTAMPTZ DEFAULT NOW(),
    expiration_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.evenements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description_md TEXT,
    date_start TIMESTAMPTZ NOT NULL,
    date_end TIMESTAMPTZ,
    address_text TEXT,
    lat FLOAT8,
    lng FLOAT8,
    target_audience TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ressources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    is_professional BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.temoignages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    author_role TEXT, -- e.g. 'Patient', 'Médecin'
    quote_text TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ZONE 3 : AUTHENTIFICATION PRO (VÉRIFICATION)
-- ==========================================

CREATE TABLE public.utilisateurs_pro (
    -- Lié à la table système auth.users
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profession_title TEXT NOT NULL,
    rpps_adeli_number TEXT,
    structure_id UUID REFERENCES public.structures(id) ON DELETE SET NULL,
    status validation_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Activer RLS sur les tables sensibles ou de CMS
ALTER TABLE public.structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utilisateurs_pro ENABLE ROW LEVEL SECURITY;

-- Exemples de Policies standard

-- Les structures sont lisibles par tous
CREATE POLICY "Les structures sont publiques"
ON public.structures FOR SELECT
USING (true);

-- Les actus publiées non-expirées sont lisibles par tous
CREATE POLICY "Les actualites sont publiques (si publiées et non expirées)"
ON public.actualites FOR SELECT
USING (
    is_published = true 
    AND (expiration_date IS NULL OR expiration_date > NOW())
);

-- Les infos Pro d'un user ne sont lisibles que par lui-même
CREATE POLICY "Peut lire son profil Pro"
ON public.utilisateurs_pro FOR SELECT
USING (auth.uid() = id);

-- ==========================================
-- INDEX SPATIAUX POSTGIS
-- ==========================================
CREATE INDEX idx_structures_geog ON public.structures USING GIST (location_geog);

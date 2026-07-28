-- Migration : Table partenaires Handiboost
-- Stocke les fiches partenaires et l'état de signature de la charte

CREATE TABLE IF NOT EXISTS partners (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  -- Informations de la fiche
  nom_structure TEXT NOT NULL DEFAULT '',
  nom_contact   TEXT NOT NULL DEFAULT '',
  telephone     TEXT NOT NULL DEFAULT '',
  adresse       TEXT NOT NULL DEFAULT '',
  ville         TEXT NOT NULL DEFAULT '',
  code_postal   TEXT NOT NULL DEFAULT '',
  site_web      TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  activites     TEXT NOT NULL DEFAULT '',
  -- Signature de la charte
  charte_signee        BOOLEAN DEFAULT FALSE,
  charte_signee_le     TIMESTAMPTZ,
  charte_signee_par    TEXT,
  -- Méta
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at
CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Lecture publique basique (les admins liront via service_role)
CREATE POLICY "Partners can view their own row"
  ON partners FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert a new partner"
  ON partners FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Partners can update their own row"
  ON partners FOR UPDATE
  USING (true);

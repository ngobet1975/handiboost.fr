-- 1. ENUMS
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE validation_status AS ENUM ('draft', 'to_review', 'validated');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'medical_reviewer', 'viewer');

-- 2. TRIGGER FUNCTION FOR updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. ARTICLES
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  cover_image TEXT,
  published_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT FALSE,
  show_on_homepage BOOLEAN DEFAULT FALSE,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5. PATHOLOGIES
CREATE TABLE pathologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  precautions JSONB DEFAULT '[]'::jsonb,
  recommended_activities JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  status content_status DEFAULT 'draft',
  validation_status validation_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES profiles(id)
);

CREATE TRIGGER pathologies_updated_at BEFORE UPDATE ON pathologies FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. DIRECTORIES
CREATE TABLE directories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT,
  description TEXT,
  url TEXT,
  scope TEXT,
  type TEXT,
  status content_status DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE TRIGGER directories_updated_at BEFORE UPDATE ON directories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 7. EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  organizer TEXT,
  cover_image TEXT,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 8. FINANCIAL AIDS
CREATE TABLE financial_aids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  amount TEXT,
  conditions JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE TRIGGER financial_aids_updated_at BEFORE UPDATE ON financial_aids FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 9. PROFESSIONAL RESOURCES
CREATE TABLE professional_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  source TEXT,
  url TEXT,
  file_url TEXT,
  format TEXT,
  status content_status DEFAULT 'draft',
  validation_status validation_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES profiles(id)
);

CREATE TRIGGER professional_resources_updated_at BEFORE UPDATE ON professional_resources FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 10. REDIRECTS
CREATE TABLE redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  old_url TEXT UNIQUE NOT NULL,
  new_url TEXT NOT NULL,
  status_code INTEGER DEFAULT 301,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RLS (Row Level Security)

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE directories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_aids ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles:
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Articles, Events, Directories, Financial Aids, Redirects (Standard content)
CREATE POLICY "Public can view published standard content" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published standard content" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published standard content" ON directories FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published standard content" ON financial_aids FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view redirects" ON redirects FOR SELECT USING (true);

-- Internal users can read all standard content
CREATE POLICY "Internal users can view all articles" ON articles FOR SELECT USING (get_current_user_role() IN ('admin', 'editor', 'medical_reviewer', 'viewer'));
CREATE POLICY "Internal users can view all events" ON events FOR SELECT USING (get_current_user_role() IN ('admin', 'editor', 'medical_reviewer', 'viewer'));
CREATE POLICY "Internal users can view all directories" ON directories FOR SELECT USING (get_current_user_role() IN ('admin', 'editor', 'medical_reviewer', 'viewer'));
CREATE POLICY "Internal users can view all financial_aids" ON financial_aids FOR SELECT USING (get_current_user_role() IN ('admin', 'editor', 'medical_reviewer', 'viewer'));

-- Admins and Editors can INSERT/UPDATE/DELETE standard content
CREATE POLICY "Admins and editors can modify articles" ON articles FOR ALL USING (get_current_user_role() IN ('admin', 'editor'));
CREATE POLICY "Admins and editors can modify events" ON events FOR ALL USING (get_current_user_role() IN ('admin', 'editor'));
CREATE POLICY "Admins and editors can modify directories" ON directories FOR ALL USING (get_current_user_role() IN ('admin', 'editor'));
CREATE POLICY "Admins and editors can modify financial_aids" ON financial_aids FOR ALL USING (get_current_user_role() IN ('admin', 'editor'));
CREATE POLICY "Admins and editors can modify redirects" ON redirects FOR ALL USING (get_current_user_role() IN ('admin', 'editor'));

-- Pathologies, Professional Resources (Health/Pro Content requiring validation)
CREATE POLICY "Public can view validated health content" ON pathologies FOR SELECT USING (status = 'published' AND validation_status = 'validated');
CREATE POLICY "Public can view validated pro content" ON professional_resources FOR SELECT USING (status = 'published' AND validation_status = 'validated');

-- Internal users can read all health content
CREATE POLICY "Internal users can view all health content" ON pathologies FOR SELECT USING (get_current_user_role() IN ('admin', 'editor', 'medical_reviewer', 'viewer'));
CREATE POLICY "Internal users can view all pro content" ON professional_resources FOR SELECT USING (get_current_user_role() IN ('admin', 'editor', 'medical_reviewer', 'viewer'));

-- Admins, Editors, Reviewers can modify health content
CREATE POLICY "Internal users can modify health content" ON pathologies FOR ALL USING (get_current_user_role() IN ('admin', 'editor', 'medical_reviewer'));
CREATE POLICY "Internal users can modify pro content" ON professional_resources FOR ALL USING (get_current_user_role() IN ('admin', 'editor', 'medical_reviewer'));

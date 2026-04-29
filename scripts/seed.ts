import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables (.env.local)
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required to run the seed script.');
  process.exit(1);
}

// Initialize Supabase Client with the Service Role Key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Utility to read JSON
function readJson(filename: string) {
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  console.warn(`File ${filename} not found, skipping.`);
  return [];
}

// Process redirects
let redirects: { old_url: string; new_url: string }[] = [];

function collectRedirects(items: any[], newUrlPrefix: string) {
  items.forEach((item) => {
    if (item.oldUrls && Array.isArray(item.oldUrls)) {
      item.oldUrls.forEach((oldUrl: string) => {
        redirects.push({
          old_url: oldUrl,
          new_url: `${newUrlPrefix}/${item.slug || item.id}`
        });
      });
    }
  });
}

async function seedData() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Articles (Actualités)
    const actualites = readJson('actualites.json');
    if (actualites.length > 0) {
      collectRedirects(actualites, '/actualites');
      
      const articlesData = actualites.map((a: any) => ({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        cover_image: a.coverImage,
        published_at: a.publishedAt || new Date().toISOString(),
        featured: a.featured || false,
        show_on_homepage: a.showOnHomepage || false,
        status: a.status || 'published'
      }));

      const { error } = await supabase.from('articles').upsert(articlesData, { onConflict: 'slug' });
      if (error) throw error;
      console.log(`✅ Seeded ${articlesData.length} articles.`);
    }

    // 2. Pathologies
    const pathologies = readJson('pathologies.json');
    if (pathologies.length > 0) {
      collectRedirects(pathologies, '/pratiquants/conseils-par-pathologie');
      
      const pathoData = pathologies.map((p: any) => ({
        title: p.title,
        slug: p.slug,
        description: p.description,
        benefits: p.benefits || [],
        precautions: p.precautions || [],
        recommended_activities: p.recommendedActivities || [],
        resources: p.resources || [],
        status: 'published', // The public status is published, but validation is to-review
        validation_status: p.validationStatus || 'to_review'
      }));

      const { error } = await supabase.from('pathologies').upsert(pathoData, { onConflict: 'slug' });
      if (error) throw error;
      console.log(`✅ Seeded ${pathoData.length} pathologies.`);
    }

    // 3. Directories (Annuaires)
    const annuaires = readJson('annuaire.json');
    if (annuaires.length > 0) {
      // In directories, we might not have a slug, but ID is unique string. We need to handle this.
      // Wait, schema for directories doesn't have a unique 'slug'. We use 'name' or just insert.
      // We will match by 'name' for upserting, or we just use ID as UUID.
      // For now, let's just insert them, or use a naive upsert if we added a slug later.
      // Actually, since we want idempotence, we can clear the table first, OR upsert by 'name' (need to make 'name' unique in schema, but it's not).
      // Let's just delete all and insert.
      await supabase.from('directories').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      // oldUrls mapping
      annuaires.forEach((d: any) => {
        if (d.oldUrls && Array.isArray(d.oldUrls)) {
          d.oldUrls.forEach((oldUrl: string) => {
             // Redirection vers la page annuaires générique pour l'instant
            redirects.push({ old_url: oldUrl, new_url: `/pratiquants/ou-pratiquer` });
          });
        }
      });

      const dirData = annuaires.map((d: any) => ({
        name: d.name,
        provider: d.provider,
        description: d.description,
        url: d.url,
        scope: d.scope,
        type: d.type,
        status: d.status || 'published'
      }));

      const { error } = await supabase.from('directories').insert(dirData);
      if (error) throw error;
      console.log(`✅ Seeded ${dirData.length} directories.`);
    }

    // 4. Events
    const events = readJson('events.json');
    if (events.length > 0) {
      collectRedirects(events, '/actualites'); // Assuming events are routed under actualites in Next.js
      
      const eventData = events.map((e: any) => ({
        title: e.title,
        slug: e.slug,
        excerpt: e.excerpt,
        content: e.content,
        event_date: e.eventDate,
        location: e.location,
        organizer: e.organizer,
        cover_image: e.coverImage,
        status: e.status || 'published'
      }));

      const { error } = await supabase.from('events').upsert(eventData, { onConflict: 'slug' });
      if (error) throw error;
      console.log(`✅ Seeded ${eventData.length} events.`);
    }

    // 5. Financial Aids
    const aids = readJson('aides-financieres.json');
    if (aids.length > 0) {
      collectRedirects(aids, '/pratiquants/aides-financieres'); // Mapped generically or by slug
      
      const aidsData = aids.map((a: any) => ({
        title: a.title,
        slug: a.slug,
        description: a.description,
        amount: a.amount,
        conditions: a.conditions || [],
        resources: a.resources || [],
        status: 'published'
      }));

      const { error } = await supabase.from('financial_aids').upsert(aidsData, { onConflict: 'slug' });
      if (error) throw error;
      console.log(`✅ Seeded ${aidsData.length} financial aids.`);
    }

    // 6. Professional Resources
    const proResources = readJson('prescription-apa.json');
    if (proResources.length > 0) {
      // Delete all first for idempotence as we don't have slug
      await supabase.from('professional_resources').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      proResources.forEach((r: any) => {
        if (r.oldUrls) {
          r.oldUrls.forEach((oldUrl: string) => {
            redirects.push({ old_url: oldUrl, new_url: `/professionnels/prescription-apa` });
          });
        }
      });

      const proData = proResources.map((r: any) => ({
        title: r.title,
        description: r.description,
        category: r.category,
        source: r.source,
        url: r.url,
        file_url: r.fileUrl,
        format: r.format,
        status: 'published',
        validation_status: r.status === 'to-review' ? 'to_review' : 'validated' // Map the JSON status to validation_status
      }));

      const { error } = await supabase.from('professional_resources').insert(proData);
      if (error) throw error;
      console.log(`✅ Seeded ${proData.length} professional resources.`);
    }

    // 7. Redirects
    if (redirects.length > 0) {
      // Remove duplicates
      const uniqueRedirects = Array.from(new Set(redirects.map(r => r.old_url)))
        .map(oldUrl => redirects.find(r => r.old_url === oldUrl));

      const { error } = await supabase.from('redirects').upsert(uniqueRedirects, { onConflict: 'old_url' });
      if (error) throw error;
      console.log(`✅ Seeded ${uniqueRedirects.length} unique redirects for SEO.`);
    }

    console.log('🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

seedData();

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_URL = 'https://handiboost.fr/wp-json/wp/v2';
const MIGRATION_DIR = path.join(__dirname, '../docs/migration');

if (!fs.existsSync(MIGRATION_DIR)) {
  fs.mkdirSync(MIGRATION_DIR, { recursive: true });
}

const INVENTORY_MD = path.join(MIGRATION_DIR, 'content_inventory.md');
const REDIRECTS_CSV = path.join(MIGRATION_DIR, 'redirects.csv');
const MAPPING_CSV = path.join(MIGRATION_DIR, 'content_mapping.csv');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/æ/g, "ae")
    .replace(/ç/g, "c")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/ñ/g, "n")
    .replace(/[òóôõö]/g, "o")
    .replace(/œ/g, "oe")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ýÿ]/g, "y")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function fetchWP(endpoint) {
  let allData = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await fetch(`${BASE_URL}/${endpoint}?per_page=100&page=${page}`);
      if (!res.ok) {
        hasMore = false;
        break;
      }
      const data = await res.json();
      if (data.length === 0) {
        hasMore = false;
      } else {
        allData = allData.concat(data);
        page++;
      }
    } catch (e) {
      console.error(`Error fetching ${endpoint}:`, e);
      hasMore = false;
    }
  }
  return allData;
}

function analyzeContent(html) {
  if (!html) return { images: [], videos: [], textLength: 0, needsFALC: false, cleanText: '' };
  
  const $ = cheerio.load(html);
  
  const images = [];
  $('img').each((i, el) => {
    images.push({ src: $(el).attr('src'), alt: $(el).attr('alt') || '' });
  });

  const videos = [];
  $('iframe, video').each((i, el) => {
    videos.push($(el).attr('src'));
  });

  const textContent = $('body').text().replace(/\s+/g, ' ').trim();
  const textLength = textContent.length;
  const needsFALC = textLength > 1500;

  return { images, videos, textLength, needsFALC, cleanText: textContent.substring(0, 150) + '...' };
}

function recommendMapping(title, type, date) {
  const t = title.toLowerCase();
  
  // 3. Pages par pathologie
  const pathologies = ['sclérose en plaque', 'endométriose', 'paralysie cérébrale', 'mucoviscidose', 'cérébelleuse', 'neuromusculaire', 'tca'];
  if (pathologies.some(p => t.includes(p))) {
    return { target: `/pratiquants/conseils-par-pathologie/${slugify(title)}`, status: 'Conserver (Réécriture FALC Fiche Courte)' };
  }

  // 1. Pratiquants
  if (t.includes('où pratiquer') || t.includes('trouver un club') || t.includes('annuaire') || t.includes('trouver une pratique')) return { target: '/pratiquants/ou-pratiquer', status: 'Intégrer en sous-page' };
  if (t.includes('financement')) return { target: '/pratiquants/aides-financieres', status: 'Intégrer en sous-page' };
  if (t.includes('tester vos connaissances')) return { target: '/pratiquants/tester-ses-connaissances', status: 'Intégrer en sous-page' };
  if (t.includes('pratiquant')) return { target: '/pratiquants', status: 'Page Hub' };

  // 2. Professionnels
  if (t.includes('prescription')) return { target: '/professionnels/prescription-apa', status: 'Intégrer en sous-page' };
  if (t.includes('outils') || t.includes('bilan')) return { target: '/professionnels/outils-accompagnement', status: 'Intégrer en sous-page' };
  if (t.includes('références')) return { target: '/professionnels/references', status: 'Intégrer en sous-page' };
  if (t.includes('emploi') || t.includes('formation') || t.includes('formateur')) return { target: '/professionnels/formateurs', status: 'Intégrer en sous-page' };

  if (t.includes('guide booster')) return { target: '/guide-booster', status: 'Accès direct' };
  if (t.includes('témoignage')) return { target: '/temoignages', status: 'Conserver' };
  if (t.includes('contact')) return { target: '/contact', status: 'Conserver' };
  if (t.includes('association') || t.includes('équipe') || t.includes('valeur')) return { target: '/association', status: 'Intégrer' };
  
  // 4. Actualités et événements
  if (type === 'post' || t.includes('événement') || t.includes('evenement')) {
    const isOld = t.includes('2024') || t.includes('2022') || t.includes('2023');
    if (isOld && !t.includes('journée handiboost')) {
       return { target: '-', status: 'Archiver / Ne pas migrer' };
    }
    return { target: `/actualites/${slugify(title)}`, status: 'Publié' };
  }

  return { target: '/a-trier', status: 'Brouillon' };
}

function sanitizeUrl(oldUrl) {
  try {
    const url = new URL(oldUrl);
    return url.pathname;
  } catch(e) {
    return oldUrl;
  }
}

async function run() {
  console.log('Fetching Pages...');
  const pages = await fetchWP('pages');
  console.log(`Found ${pages.length} pages.`);

  console.log('Fetching Posts...');
  const posts = await fetchWP('posts');
  console.log(`Found ${posts.length} posts.`);

  const allItems = [...pages.map(p => ({...p, itemType: 'page'})), ...posts.map(p => ({...p, itemType: 'post'}))];

  let mdContent = `# Inventaire du Contenu Handiboost & Plan de Migration\n\n`;
  let csvMapping = `Titre;Type;Ancienne URL;Statut Recommandé;Nouvelle URL Cible;Action FALC\n`;
  let csvRedirects = `Ancienne URL;Nouvelle URL\n`;

  for (const item of allItems) {
    const title = item.title && item.title.rendered ? item.title.rendered.replace(/&#8217;/g, "'").replace(/&#\d+;/g, "").replace(/;/g, ',') : 'Sans titre';
    const oldUrl = sanitizeUrl(item.link);
    const analysis = analyzeContent(item.content ? item.content.rendered : '');
    const mapping = recommendMapping(title, item.itemType, item.date);
    
    let falcAction = analysis.needsFALC ? 'Synthèse FALC requise' : 'OK';
    if (mapping.status.includes('Fiche Courte')) falcAction = 'Réécriture Fiche Médicale Courte (Bénéfices, Précautions, Activités)';

    // Build MD
    mdContent += `### ${title}\n`;
    mdContent += `- **URL Actuelle** : \`${oldUrl}\`\n`;
    mdContent += `- **Nouvelle URL Cible** : \`${mapping.target}\`\n`;
    mdContent += `- **Statut** : ${mapping.status}\n`;
    mdContent += `- **Action FALC** : ${falcAction}\n`;
    if (analysis.images.length > 0) mdContent += `- **Images** : ${analysis.images.length}\n`;
    if (analysis.videos.length > 0) mdContent += `- **Vidéos / Iframes** : ${analysis.videos.join(', ')}\n`;
    mdContent += `\n`;

    // Build Mapping CSV
    csvMapping += `"${title}";"${item.itemType}";"${oldUrl}";"${mapping.status}";"${mapping.target}";"${falcAction}"\n`;

    // Build Redirects CSV
    if (mapping.target !== '-' && mapping.target !== '/a-trier') {
        csvRedirects += `"${oldUrl}";"${mapping.target}"\n`;
    }
  }

  fs.writeFileSync(INVENTORY_MD, mdContent, 'utf8');
  fs.writeFileSync(MAPPING_CSV, csvMapping, 'utf8');
  fs.writeFileSync(REDIRECTS_CSV, csvRedirects, 'utf8');
  
  console.log(`Files saved to ${MIGRATION_DIR}`);
}

run();

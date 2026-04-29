const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../src/app');

const structure = [
  'association',
  'pratiquants',
  'pratiquants/ou-pratiquer',
  'pratiquants/evenements',
  'pratiquants/aides-financieres',
  'pratiquants/conseils-par-pathologie',
  'pratiquants/conseils-par-pathologie/sclerose-en-plaques',
  'pratiquants/tester-ses-connaissances',
  'professionnels',
  'professionnels/prescription-apa',
  'professionnels/outils-accompagnement',
  'professionnels/references',
  'professionnels/formateurs',
  'professionnels/guide-booster',
  'actualites',
  'temoignages',
  'contact',
  'guide-booster',
];

function capitalize(s) {
    if (s.includes('-')) {
        return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}

structure.forEach(dir => {
  const dirPath = path.join(appDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const pagePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    const name = dir.split('/').pop();
    const componentName = name.replace(/-/g, '').replace(/^\w/, c => c.toUpperCase());
    
    let content = `export default function ${componentName}Page() {
  return (
    <div className="container mx-auto py-12 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6">${capitalize(name)}</h1>
      <p className="text-xl">En cours de construction...</p>
    </div>
  );
}
`;
    fs.writeFileSync(pagePath, content, 'utf8');
  }
});

console.log('Shell scaffolded successfully.');

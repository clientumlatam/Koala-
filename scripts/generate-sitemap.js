import fs from 'fs';
import path from 'path';

// Generate XML sitemap indexing all categories and products for General Roca and Neuquén
const generateSitemap = () => {
  const baseUrl = 'https://ais-dev-pyisv3o2d7btcslftaz6mh-254551232284.us-east1.run.app';
  
  const categories = ['polietileno', 'descartables', 'cotillon', 'reposteria', 'envases', 'libreria', 'bazar'];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#catalog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

  categories.forEach(cat => {
    xml += `
  <url>
    <loc>${baseUrl}/#category-${cat}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  console.log('✅ sitemap.xml generado exitosamente en /public/sitemap.xml');
};

generateSitemap();

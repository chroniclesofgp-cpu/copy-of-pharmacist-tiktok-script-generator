import fs from 'node:fs';

const sourcePath = '/tmp/drmelaxin_duo.html';
const outputPath = '/tmp/drmelaxin_ingredient_section_matches.txt';
const html = fs.readFileSync(sourcePath, 'utf8');
const plain = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ');

const sZincStart = plain.lastIndexOf('S-ZINC ZERO-FIT Ultra Thin Blemish Spot Patch Water,');
const melaStart = plain.lastIndexOf('MELA-C·E ZERO-FIT Ultra Thin Dark Spot Patch Water,');
const relatedProductsStart = plain.indexOf('Related Products', melaStart);

if (sZincStart < 0 || melaStart < 0 || relatedProductsStart < 0) {
  throw new Error('Could not locate complete official ingredient sections in source HTML.');
}

const sZincIngredients = plain.slice(sZincStart, melaStart).trim();
const melaIngredients = plain.slice(melaStart, relatedProductsStart).trim();
fs.writeFileSync(
  outputPath,
  `=== S-ZINC OFFICIAL INGREDIENT SECTION ===\n${sZincIngredients}\n\n=== MELA-C·E OFFICIAL INGREDIENT SECTION ===\n${melaIngredients}\n`,
);
console.log(outputPath);

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const BASE_URL = 'https://corelearnly.com';
const today = new Date().toISOString().split('T')[0];

// Static pages that always exist
const staticPages = [
  { loc: '/', changefreq: 'weekly', priority: '1.0', lastmod: today },
  { loc: '/blog', changefreq: 'weekly', priority: '0.9', lastmod: today },
  { loc: '/apply', changefreq: 'monthly', priority: '0.9', lastmod: today },
  { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.5', lastmod: '2025-11-30' },
  { loc: '/terms', changefreq: 'yearly', priority: '0.5', lastmod: '2025-11-30' },
];

async function fetchBlogSlugs() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[sitemap] Supabase credentials not found — skipping blog posts');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, published_at, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[sitemap] Failed to fetch blog posts:', error.message);
    return [];
  }

  return data || [];
}

function buildSitemap(blogPosts) {
  const urls = staticPages.map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  );

  for (const post of blogPosts) {
    const lastmod = (post.updated_at || post.published_at || today).split('T')[0];
    urls.push(`  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

async function main() {
  console.log('[sitemap] Generating sitemap...');
  const blogPosts = await fetchBlogSlugs();
  const sitemap = buildSitemap(blogPosts);

  const outputPath = resolve(__dirname, '../dist/sitemap.xml');
  writeFileSync(outputPath, sitemap, 'utf-8');

  console.log(`[sitemap] Written to dist/sitemap.xml (${staticPages.length} static + ${blogPosts.length} blog posts)`);
}

main().catch((err) => {
  console.error('[sitemap] Error:', err);
  process.exit(1);
});

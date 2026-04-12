import { cache } from 'react';

const AIRTABLE_PAT = process.env.AIRTABLE_PAT!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE!;

export interface Product {
  id: string;
  pattern: string;
  patternFamily: string;
  title: string;
  sector: string;
  isBacklit: boolean;
  cloudinaryUrl: string;
  keywords: string[];
  description: string;
  corianColor: string;
  application: string;
  specReady: boolean;
  applicationHero: boolean;
  is_hero: boolean;
}

export interface DesignFamily {
  slug: string;
  name: string;
  products: Product[];
  heroImage: string;
  description: string;
  hasIlluminated: boolean;
  hasStandard: boolean;
  specReady: boolean;
  sectors: string[];
  applications: string[];
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const getProducts = cache(async function getProducts(): Promise<Product[]> {
  const allRecords: any[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PRODUCTS_TABLE}`
    );
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);

    let res: Response | undefined;
    for (let attempt = 0; attempt < 4; attempt++) {
      res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 },
      });
      if (res.status !== 429) break;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }

    if (!res || !res.ok) throw new Error(`Airtable error: ${res?.status}`);
    const data = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords
    .map((r: any) => {
      const f = r.fields;
      return {
        id: f.id || r.id,
        pattern: f.pattern || 'Custom',
        patternFamily: f.patternFamily || f.design_family || f.pattern || '',
        title: f.title || f.pattern || 'Untitled',
        sector: f.sector || 'General',
        isBacklit: f.isBacklit || false,
        cloudinaryUrl: f.cloudinaryUrl || '',
        keywords: (f.keywords || '')
          .split(/[;,]/)
          .map((k: string) => k.trim().toLowerCase())
          .filter((k: string) => k.length > 0),
        description: f.description || '',
        corianColor: f.corianColor || 'Glacier White',
        application: f.application || '',
        specReady: f.specReady || false,
        applicationHero: f.applicationHero || false,
        is_hero: f.is_hero || false,
      };
    })
    .filter((p: Product) => p.cloudinaryUrl.includes('res.cloudinary.com'));
});

export async function getClickCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  let offset: string | undefined;

  try {
    do {
      const url = new URL(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Design%20Clicks`
      );
      url.searchParams.set('pageSize', '100');
      url.searchParams.set('fields[]', 'design_name');
      if (offset) url.searchParams.set('offset', offset);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      });

      if (!res.ok) break;
      const data = await res.json();
      for (const r of data.records) {
        const name = r.fields.design_name || '';
        if (name) counts[name] = (counts[name] || 0) + 1;
      }
      offset = data.offset;
    } while (offset);
  } catch {
    // Design Clicks table may not exist yet
  }

  return counts;
}

// ─── Application gallery ───────────────────────────────────────────────────
const APP_ALIASES: Record<string, string[]> = {
  'elevator lobbies': ['elevator lobby', 'elevator', 'lobby/reception', 'lobby', 'elevator bank'],
  'elevator lobby': ['elevator lobby', 'elevator', 'lobby/reception', 'lobby', 'elevator bank'],
  'reception': ['reception', 'lobby/reception', 'nurse station', 'front desk'],
  'grand entry': ['grand entry', 'grand entrance', 'entry', 'atrium'],
  'hallway': ['hallway', 'corridor/staircase', 'corridor', 'hallways'],
  'ceilings': ['ceiling', 'overhead', 'canopy'],
  'ceiling': ['ceiling', 'overhead', 'canopy'],
  'branding': ['branding', 'branded environment', 'logo', 'branded'],
  'feature walls': ['feature wall', 'feature/accent', 'accent wall'],
  'feature wall': ['feature wall', 'feature/accent', 'accent wall'],
  'facades': ['facade', 'facade/exterior', 'exterior', 'rain screen', 'fins'],
  'facade': ['facade', 'facade/exterior', 'exterior', 'rain screen', 'fins'],
  'water features': ['water feature', 'pool', 'water'],
  'water feature': ['water feature', 'pool', 'water'],
  'meditation rooms': ['meditation room', 'meditation', 'calm room', 'spiritual', 'prayer'],
  'meditation room': ['meditation room', 'meditation', 'calm room', 'spiritual', 'prayer'],
  'column wrap': ['column wrap', 'column/wrap', 'column'],
  'stair wall': ['stair wall', 'staircase', 'corridor/staircase'],
  'rain screen': ['rain screen', 'ventilated facade', 'facade/exterior'],
  'canopy': ['canopy', 'overhead exterior'],
  'reception desk': ['reception desk', 'desk', 'curved desk'],
};

export const getApplicationImages = cache(async function getApplicationImages(
  applicationName: string
): Promise<Product[]> {
  const products = await getProducts();
  const norm = applicationName.toLowerCase();
  const aliases = APP_ALIASES[norm] || [norm];

  return products
    .filter((p) => {
      const app = p.application.toLowerCase();
      const kw = p.keywords.join(',').toLowerCase();
      const title = p.title.toLowerCase();
      const desc = p.description.toLowerCase();
      const text = `${app} ${kw} ${title} ${desc}`;
      return aliases.some((alias) => text.includes(alias));
    })
    .sort((a, b) => {
      // applicationHero records first
      const aH = a.applicationHero ? 1 : 0;
      const bH = b.applicationHero ? 1 : 0;
      return bH - aH;
    });
});

export function groupIntoFamilies(products: Product[]): DesignFamily[] {
  const map = new Map<string, Product[]>();

  for (const p of products) {
    const family = p.patternFamily.trim();
    if (!family || family.toLowerCase() === 'custom') continue;
    if (!map.has(family)) map.set(family, []);
    map.get(family)!.push(p);
  }

  const families: DesignFamily[] = [];
  for (const [name, members] of map) {
    const sectors = [...new Set(members.map((m) => m.sector).filter((s) => s !== 'General'))];
    const applications = [...new Set(members.map((m) => m.application).filter(Boolean))];
    const described = members.find((m) => m.description);

    families.push({
      slug: slugify(name),
      name,
      products: members,
      heroImage: members[0].cloudinaryUrl,
      description: described?.description || '',
      hasIlluminated: members.some((m) => m.isBacklit),
      hasStandard: members.some((m) => !m.isBacklit),
      specReady: members.some((m) => m.specReady),
      sectors,
      applications,
    });
  }

  return families;
}

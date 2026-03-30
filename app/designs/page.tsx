import DesignsClient from './DesignsClient';

const AIRTABLE_PAT = process.env.AIRTABLE_PAT!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE!;

export interface Product {
  id: string;
  pattern: string;
  title: string;
  sector: string;
  isBacklit: boolean;
  cloudinaryUrl: string;
  keywords: string[];
  description: string;
  corianColor: string;
  application: string;
  specReady: boolean;
}

async function getProducts(): Promise<Product[]> {
  const allRecords: any[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PRODUCTS_TABLE}`
    );
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
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
      };
    })
    .filter((p: Product) => p.cloudinaryUrl.includes('res.cloudinary.com'));
}

async function getClickCounts(): Promise<Record<string, number>> {
  // Fetch from Design Clicks table — aggregate by design_name
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

      if (!res.ok) break; // Table might not exist yet — gracefully degrade
      const data = await res.json();
      for (const r of data.records) {
        const name = r.fields.design_name || '';
        if (name) counts[name] = (counts[name] || 0) + 1;
      }
      offset = data.offset;
    } while (offset);
  } catch {
    // Design Clicks table may not exist yet — return empty counts
  }

  return counts;
}

export const metadata = {
  title: 'Design Library — M|R Walls',
  description:
    '30+ spec-ready designs. CNC-cut to your exact dimensions. Browse by application, sector, or product type.',
};

export default async function DesignsPage() {
  const [products, clickCounts] = await Promise.all([
    getProducts(),
    getClickCounts(),
  ]);

  return <DesignsClient products={products} clickCounts={clickCounts} />;
}

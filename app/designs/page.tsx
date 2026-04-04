import DesignsClient from './DesignsClient';
import { getProducts, getClickCounts, groupIntoFamilies, slugify } from '@/lib/airtable';
import type { Product } from '@/lib/airtable';

export { type Product };

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

  const families = groupIntoFamilies(products);

  // Map each product ID to its family slug (if it belongs to one)
  const familySlugMap: Record<string, string> = {};
  for (const family of families) {
    for (const p of family.products) {
      familySlugMap[p.id] = family.slug;
    }
  }

  return (
    <DesignsClient
      products={products}
      clickCounts={clickCounts}
      familySlugMap={familySlugMap}
    />
  );
}

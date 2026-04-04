import { notFound } from 'next/navigation';
import { getProducts, groupIntoFamilies, slugify } from '@/lib/airtable';
import type { DesignFamily } from '@/lib/airtable';
import FamilyClient from './FamilyClient';

export async function generateStaticParams() {
  const products = await getProducts();
  const families = groupIntoFamilies(products);
  return families.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const families = groupIntoFamilies(products);
  const family = families.find((f) => f.slug === slug);

  // Fallback: try matching individual product by title/pattern (backwards compat)
  if (!family) {
    const design = products.find((p) => slugify(p.title) === slug || slugify(p.pattern) === slug);
    if (!design) return { title: 'Design Not Found — M|R Walls' };
    return {
      title: `${design.title} — M|R Walls Design Library`,
      description: design.description || `${design.title} — CNC-carved Corian design by M|R Walls.`,
    };
  }

  return {
    title: `${family.name} — M|R Walls Design Library`,
    description: family.description || `${family.name} — CNC-carved Corian design family by M|R Walls.`,
  };
}

export default async function DesignFamilyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const families = groupIntoFamilies(products);

  let family = families.find((f) => f.slug === slug);

  // Backwards compat: if slug matches an individual product, find its family
  if (!family) {
    const product = products.find((p) => slugify(p.title) === slug || slugify(p.pattern) === slug);
    if (product && product.patternFamily) {
      family = families.find((f) => f.slug === slugify(product.patternFamily));
    }
    if (!family) notFound();
  }

  // Compute related families (overlapping sectors)
  const relatedFamilies = families
    .filter((f) => f.slug !== family!.slug)
    .filter((f) => f.sectors.some((s) => family!.sectors.includes(s)))
    .slice(0, 4);

  // If not enough related by sector, fill with other families
  if (relatedFamilies.length < 3) {
    const remaining = families
      .filter((f) => f.slug !== family!.slug && !relatedFamilies.find((r) => r.slug === f.slug))
      .slice(0, 4 - relatedFamilies.length);
    relatedFamilies.push(...remaining);
  }

  return (
    <FamilyClient
      family={family}
      relatedFamilies={relatedFamilies}
    />
  );
}

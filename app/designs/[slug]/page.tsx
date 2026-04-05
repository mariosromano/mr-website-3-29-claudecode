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
  // Derive name from slug to avoid extra Airtable calls during build
  const name = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${name} — M|R Walls Design Library`,
    description: `${name} — CNC-carved Corian design family by M|R Walls.`,
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

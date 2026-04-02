import Link from 'next/link';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import { getInteriorApplications, getExteriorApplications } from '@/lib/data/applications';
import PageCTAs from '@/components/PageCTAs';
import ApplicationsClient from './ApplicationsClient';

export const metadata = {
  title: 'Applications — M|R Walls',
  description: 'Explore M|R Walls applications: elevator lobbies, feature walls, facades, ceilings, water features, and more.',
};

export default function ApplicationsPage() {
  const interior = getInteriorApplications();
  const exterior = getExteriorApplications();

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: '48px' }}>
        <div className="section-label">Applications</div>
        <h1>What are you building?</h1>
        <p className="hero-desc">
          Every M|R Walls project starts with an application type. Each is engineered for its specific demands — traffic, moisture, wind, light.
        </p>
      </section>

      <ApplicationsClient interior={interior} exterior={exterior} />

      <PageCTAs />
    </>
  );
}

import Link from 'next/link';
import { projects } from '@/lib/data/projects';
import { cloudinaryUrl } from '@/lib/data/cloudinary';
import PageCTAs from '@/components/PageCTAs';
import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Projects — M|R Walls',
  description: '731 projects installed worldwide. From LAX to Mayo Clinic to TikTok Nashville.',
};

export default function ProjectsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="section-label">Projects</div>
        <h1>731 projects installed worldwide</h1>
        <p className="hero-desc">
          LAX to Mayo Clinic to TikTok Nashville. Filter by application, sector, or illuminated.
        </p>
      </section>

      <ProjectsClient projects={projects} />

      <PageCTAs />
    </>
  );
}

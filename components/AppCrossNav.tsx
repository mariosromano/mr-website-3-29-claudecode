import Link from 'next/link';
import { AppTypeWithImage } from '@/lib/data/applications';

interface AppCrossNavProps {
  apps: AppTypeWithImage[];
  currentSlug: string;
}

export default function AppCrossNav({ apps, currentSlug }: AppCrossNavProps) {
  return (
    <nav className="app-cross-nav">
      {apps.map((app) => (
        <Link
          key={app.slug}
          href={`/applications/${app.slug}`}
          className={`cross-nav-item${app.slug === currentSlug ? ' active' : ''}`}
        >
          {app.name}
        </Link>
      ))}
    </nav>
  );
}

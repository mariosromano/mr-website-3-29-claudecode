import { cloudinaryUrl, ImageKey } from '@/lib/data/cloudinary';

interface HeroBleedProps {
  imageKey: ImageKey;
  label: string;
  title: string;
  description?: string;
}

export default function HeroBleed({ imageKey, label, title, description }: HeroBleedProps) {
  return (
    <section className="page-hero-bleed">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url('${cloudinaryUrl(imageKey, 1920)}')` }}
      />
      <div className="section-label">{label}</div>
      <h1>{title}</h1>
      {description && <p className="hero-desc">{description}</p>}
    </section>
  );
}

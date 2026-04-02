import { ApplicationType } from '../types';
import { ImageKey } from './cloudinary';

export interface AppTypeWithImage extends ApplicationType {
  imageKey: ImageKey;
}

export const applications: AppTypeWithImage[] = [
  // ─── INTERIOR (8) ───
  {
    slug: 'elevator-lobbies',
    name: 'Elevator Lobbies',
    description: 'Seamless carved Corian surfaces for high-traffic vertical circulation. InterlockPanel joints disappear — no grout lines to collect dirt, no seams to catch rolling luggage. Standard or backlit. The elevator lobby is the most-seen surface in any multi-story building — make it count.',
    imageKey: 'flameHospitality',
    imageId: 'flameHospitality',
    track: 'interior',
    sectors: ['Healthcare', 'Hospitality', 'Corporate', 'Multi-Family', 'Aviation', 'Education'],
    certifications: ['GREENGUARD Gold', 'NSF/FDA', 'Antimicrobial', 'Bleach-Safe', 'NFPA'],
    relatedProjects: ['jefferson-health', 'lax-american-airlines', 'mayo-clinic'],
    relatedDesigns: ['flame', 'ripple', 'wave', 'billow'],
  },
  {
    slug: 'feature-walls',
    name: 'Feature Walls',
    description: 'Sculptural statement surfaces for lobbies, atriums, and branded spaces. From subtle texture to dramatic backlit patterns, feature walls are where architecture meets art. InterlockPanel makes even large-format walls seamless — no visible joints, no field cutting.',
    imageKey: 'billowBacklight',
    imageId: 'billowBacklight',
    track: 'interior',
    sectors: ['Healthcare', 'Hospitality', 'Corporate', 'Multi-Family', 'Retail', 'Sports', 'Residential'],
    certifications: ['GREENGUARD Gold', 'NSF/FDA', 'Antimicrobial', 'Bleach-Safe', 'NFPA'],
    relatedProjects: ['jefferson-health', 'mayo-clinic', 'crypto-com-arena', 'smithgroup-dc'],
    relatedDesigns: ['billow', 'wave', 'lake', 'bloom'],
  },
  {
    slug: 'reception',
    name: 'Reception',
    description: 'Carved and backlit reception surfaces. The front face of your reception desk is a feature wall in miniature — same InterlockPanel system, same design library, same backlighting options. Often the first surface visitors touch.',
    imageKey: 'bloomFree',
    imageId: 'bloomFree',
    track: 'interior',
    sectors: ['Healthcare', 'Corporate', 'Hospitality'],
    certifications: ['GREENGUARD Gold', 'NSF/FDA', 'Antimicrobial'],
    relatedProjects: ['jefferson-health', 'mayo-clinic'],
    relatedDesigns: ['bloom', 'billow', 'wave'],
  },
  {
    slug: 'grand-entry',
    name: 'Grand Entry',
    description: 'Backlit carved Corian surfaces that transform building entrances into architectural statements. From hotel lobbies to corporate headquarters, grand entry walls set the tone before visitors take a single step inside.',
    imageKey: 'lakeBacklight',
    imageId: 'lakeBacklight',
    track: 'interior',
    sectors: ['Hospitality', 'Corporate', 'Multi-Family', 'Healthcare'],
    certifications: ['GREENGUARD Gold', 'NFPA'],
    relatedProjects: ['jefferson-health', 'mayo-clinic'],
    relatedDesigns: ['lake', 'billow', 'wave', 'bloom'],
  },
  {
    slug: 'ceilings',
    name: 'Ceilings',
    description: 'Carved canopies and overhead sculptural installations. Corian is lightweight enough for overhead mounting, strong enough for large spans. InterlockPanel connections work in any orientation — walls, ceilings, soffits.',
    imageKey: 'morongoCasino',
    imageId: 'morongoCasino',
    track: 'interior',
    sectors: ['Hospitality', 'Corporate', 'Sports', 'Retail'],
    certifications: ['GREENGUARD Gold', 'NFPA'],
    relatedProjects: ['tiktok-nashville', 'morongo-casino'],
    relatedDesigns: ['wave', 'ripple', 'flame'],
  },
  {
    slug: 'hallway',
    name: 'Hallway',
    description: 'Seamless carved Corian surfaces for corridors and circulation paths. InterlockPanel creates continuous patterns that flow the full length of any hallway — no repeating seams, no visible joints. High-traffic rated and easy to maintain.',
    imageKey: 'fingerprint',
    imageId: 'fingerprint',
    track: 'interior',
    sectors: ['Healthcare', 'Corporate', 'Hospitality', 'Education', 'Multi-Family'],
    certifications: ['GREENGUARD Gold', 'Antimicrobial', 'Bleach-Safe', 'NFPA'],
    relatedProjects: ['jefferson-health', 'smithgroup-dc'],
    relatedDesigns: ['fingerprint', 'wave', 'flame', 'ripple'],
  },
  {
    slug: 'branding',
    name: 'Branding',
    description: 'Custom-carved brand expressions in solid surface. Logos, patterns, and dimensional graphics CNC-carved into Corian. Backlit branded walls make brand identity architectural — permanent, tactile, and impossible to ignore.',
    imageKey: 'capitalOneArena',
    imageId: 'capitalOneArena',
    track: 'interior',
    sectors: ['Corporate', 'Retail', 'Sports', 'Hospitality'],
    certifications: ['GREENGUARD Gold', 'NFPA'],
    relatedProjects: ['capital-one-arena', 'crypto-com-arena'],
    relatedDesigns: ['wave', 'flame', 'ripple'],
  },
  {
    slug: 'meditation-rooms',
    name: 'Meditation Rooms',
    description: 'Backlit healing environments for wellness and calm. Glacier White Corian with warm LED backlighting creates a soft, diffused glow — no visible light source, just warmth emanating from the walls. Antimicrobial and easy to clean.',
    imageKey: 'seattleV2',
    imageId: 'seattleV2',
    track: 'interior',
    sectors: ['Healthcare', 'Corporate', 'Education'],
    certifications: ['GREENGUARD Gold', 'Antimicrobial', 'Bleach-Safe'],
    relatedProjects: ['seattle-childrens', 'mayo-clinic'],
    relatedDesigns: ['bloom', 'lake', 'billow'],
  },
  // ─── EXTERIOR (2) ───
  {
    slug: 'facades',
    name: 'Facades',
    description: 'UV-stable carved panels for building exteriors. Exterior-rated Corian withstands -40°F to 140°F, hurricane-force winds, and decades of UV exposure without delamination or color shift. InterlockPanel connections create seamless exterior surfaces.',
    imageKey: 'blueFacade',
    imageId: 'blueFacade',
    track: 'exterior',
    sectors: ['Corporate', 'Hospitality', 'Multi-Family', 'Retail'],
    certifications: ['Exterior-Rated', 'UV-Stable', 'NFPA'],
    relatedProjects: ['hallandale-beach-fins', 'va-hospital-facade'],
    relatedDesigns: ['flame', 'wave'],
  },
  {
    slug: 'water-features',
    name: 'Water Features',
    description: 'Non-porous carved surfaces with integrated water flow. Corian does not absorb water, does not support mold growth, and does not deteriorate from constant moisture. The ideal material for architectural water features that need to look perfect for decades.',
    imageKey: 'brickWaterfeature',
    imageId: 'brickWaterfeature',
    track: 'exterior',
    sectors: ['Hospitality', 'Corporate', 'Residential', 'Multi-Family'],
    certifications: ['NSF/FDA', 'Antimicrobial'],
    relatedProjects: ['brick-water-feature'],
    relatedDesigns: ['brick', 'ripple', 'stone'],
  },
];

export function getApplicationBySlug(slug: string): AppTypeWithImage | undefined {
  return applications.find(a => a.slug === slug);
}

export function getInteriorApplications(): AppTypeWithImage[] {
  return applications.filter(a => a.track === 'interior');
}

export function getExteriorApplications(): AppTypeWithImage[] {
  return applications.filter(a => a.track === 'exterior');
}

import { ApplicationType } from '../types';
import { ImageKey } from './cloudinary';

export interface AppTypeWithImage extends ApplicationType {
  imageKey: ImageKey;
}

export const applications: AppTypeWithImage[] = [
  // ─── INTERIOR ───
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
    slug: 'water-features',
    name: 'Water Features',
    description: 'Non-porous carved surfaces with integrated water flow. Corian does not absorb water, does not support mold growth, and does not deteriorate from constant moisture. The ideal material for architectural water features that need to look perfect for decades.',
    imageKey: 'brickWaterfeature',
    imageId: 'brickWaterfeature',
    track: 'interior',
    sectors: ['Hospitality', 'Corporate', 'Residential', 'Multi-Family'],
    certifications: ['NSF/FDA', 'Antimicrobial'],
    relatedProjects: ['brick-water-feature'],
    relatedDesigns: ['brick', 'ripple', 'stone'],
  },
  {
    slug: 'column-wraps',
    name: 'Column Wraps',
    description: 'Seamless Corian cladding for structural columns. InterlockPanel wraps around columns with invisible joints. Standard or backlit — backlit column wraps become glowing sculptural elements visible from across large spaces.',
    imageKey: 'laxAmericanAirlines',
    imageId: 'laxAmericanAirlines',
    track: 'interior',
    sectors: ['Hospitality', 'Corporate', 'Aviation', 'Multi-Family'],
    certifications: ['GREENGUARD Gold', 'NFPA'],
    relatedProjects: ['lax-american-airlines'],
    relatedDesigns: ['flame', 'wave', 'ripple'],
  },
  {
    slug: 'reception-desks',
    name: 'Reception Desks',
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
    slug: 'stair-walls',
    name: 'Stair Walls',
    description: 'Continuous carved surfaces along vertical circulation. InterlockPanel follows stairs without breaking the pattern — the design flows from floor to floor with no visible seams or joints.',
    imageKey: 'fingerprint',
    imageId: 'fingerprint',
    track: 'interior',
    sectors: ['Corporate', 'Hospitality', 'Multi-Family', 'Residential'],
    certifications: ['GREENGUARD Gold', 'NFPA'],
    relatedProjects: ['smithgroup-dc'],
    relatedDesigns: ['fingerprint', 'wave', 'flame'],
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
  {
    slug: 'branded-environments',
    name: 'Branded Environments',
    description: 'Custom-carved brand expressions in solid surface. Logos, patterns, and dimensional graphics CNC-carved into Corian. Backlit branded walls make brand identity architectural — permanent, tactile, and impossible to ignore.',
    imageKey: 'capitalOneArena',
    imageId: 'capitalOneArena',
    track: 'interior',
    sectors: ['Corporate', 'Retail', 'Sports', 'Hospitality'],
    certifications: ['GREENGUARD Gold', 'NFPA'],
    relatedProjects: ['capital-one-arena', 'crypto-com-arena'],
    relatedDesigns: ['wave', 'flame', 'ripple'],
  },
  // ─── EXTERIOR ───
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
    slug: 'rain-screens',
    name: 'Rain Screens',
    description: 'Ventilated cladding systems for moisture management. Corian rain screen panels mount on open-joint systems with full drainage and ventilation. Non-porous — water runs off, never absorbs. Dimensional carved patterns add depth and shadow.',
    imageKey: 'finsExterior',
    imageId: 'finsExterior',
    track: 'exterior',
    sectors: ['Corporate', 'Multi-Family', 'Hospitality'],
    certifications: ['Exterior-Rated', 'UV-Stable', 'NFPA'],
    relatedProjects: ['hallandale-beach-fins'],
    relatedDesigns: ['flame', 'ripple'],
  },
  {
    slug: 'canopies',
    name: 'Canopies',
    description: 'Overhead exterior carved surfaces and sun shading. Corian canopy panels are lightweight, UV-stable, and CNC-carved with patterns that control light and create dramatic shadow effects throughout the day.',
    imageKey: 'morongoCasino',
    imageId: 'morongoCasino',
    track: 'exterior',
    sectors: ['Corporate', 'Hospitality', 'Aviation', 'Retail'],
    certifications: ['Exterior-Rated', 'UV-Stable', 'NFPA'],
    relatedProjects: ['morongo-casino'],
    relatedDesigns: ['wave', 'ripple'],
  },
  {
    slug: 'building-envelopes',
    name: 'Building Envelopes',
    description: 'Complete exterior wall systems integrating structure and surface. When the entire building skin needs to be a carved, sculptural surface — not just a panel here and there — InterlockPanel scales to full building envelopes.',
    imageKey: 'blueFacade',
    imageId: 'blueFacade',
    track: 'exterior',
    sectors: ['Corporate', 'Multi-Family', 'Education'],
    certifications: ['Exterior-Rated', 'UV-Stable', 'NFPA'],
    relatedProjects: ['va-hospital-facade', 'hallandale-beach-fins'],
    relatedDesigns: ['flame', 'wave'],
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

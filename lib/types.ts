export interface Project {
  slug: string;
  name: string;
  sector: string;
  application: string;
  sqft: string;
  year: number;
  designName: string;
  illuminated: boolean;
  imageId: string;
  story: string;
}

export interface ApplicationType {
  slug: string;
  name: string;
  description: string;
  imageId: string;
  track: 'interior' | 'exterior';
  sectors: string[];
  certifications: string[];
  relatedProjects: string[];
  relatedDesigns: string[];
}

export interface CloudinaryImage {
  id: string;
  version?: string;
  ext: string;
}

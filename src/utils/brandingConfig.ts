export interface CompanyBranding {
  showLogo: boolean;
  logoType: 'kinesfera' | 'custom';
  customLogoUrl: string; // base64 data URL or external image URL
  companyName: string;
  tagline: string;
  subtext: string;
  phone: string;
  institution: string;
  address: string;
}

const STORAGE_KEY = 'kinesfera_company_branding';

export const DEFAULT_BRANDING: CompanyBranding = {
  showLogo: true,
  logoType: 'kinesfera',
  customLogoUrl: '',
  companyName: 'Centro Clínico Kinesfera',
  tagline: 'Creando Sentido Al Juego',
  subtext: 'Kinesiología Pediátrica · Neurodesarrollo · Psicomotricidad',
  phone: '+56 9 8456 1234',
  institution: 'Centro Clínico Kinesfera',
  address: 'Copiapó, Región de Atacama'
};

export function getCompanyBranding(): CompanyBranding {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRANDING;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_BRANDING, ...parsed };
    if (merged.subtext) {
      merged.subtext = merged.subtext.replace(/integraci[óo]n sensorial/gi, 'Psicomotricidad');
    }
    return merged;
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function saveCompanyBranding(branding: CompanyBranding): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(branding));
    window.dispatchEvent(new CustomEvent('kinesfera_branding_changed', { detail: branding }));
  } catch (err) {
    console.error('Error saving branding', err);
  }
}

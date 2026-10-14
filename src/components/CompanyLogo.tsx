import React, { useState, useEffect } from 'react';
import { Image, Upload, RotateCcw, Check, Eye, Sparkles, Building2, AlignLeft, AlignCenter, AlignRight, X } from 'lucide-react';

export interface CompanyLogoConfig {
  enabled: boolean;
  type: 'official' | 'custom';
  customLogoUrl: string | null;
  showTagline: boolean;
  align: 'left' | 'center' | 'right';
  clinicName: string;
  tagline: string;
}

export const DEFAULT_LOGO_CONFIG: CompanyLogoConfig = {
  enabled: true,
  type: 'official',
  customLogoUrl: null,
  showTagline: true,
  align: 'right',
  clinicName: 'Kinesfera',
  tagline: 'Creando Sentido Al Juego'
};

export function getStoredLogoConfig(): CompanyLogoConfig {
  if (typeof window === 'undefined') return DEFAULT_LOGO_CONFIG;
  try {
    const enabled = localStorage.getItem('kinesfera_company_logo_enabled') !== 'false';
    const type = (localStorage.getItem('kinesfera_logo_type') as 'official' | 'custom') || 'official';
    const customLogoUrl = localStorage.getItem('kinesfera_custom_logo_url') || null;
    const showTagline = localStorage.getItem('kinesfera_logo_show_tagline') !== 'false';
    const align = (localStorage.getItem('kinesfera_logo_align') as 'left' | 'center' | 'right') || 'right';
    const clinicName = localStorage.getItem('kinesfera_logo_clinic_name') || 'Kinesfera';
    const tagline = localStorage.getItem('kinesfera_logo_tagline') || 'Creando Sentido Al Juego';

    return {
      enabled,
      type: customLogoUrl ? type : 'official',
      customLogoUrl,
      showTagline,
      align,
      clinicName,
      tagline
    };
  } catch {
    return DEFAULT_LOGO_CONFIG;
  }
}

export function saveLogoConfig(config: Partial<CompanyLogoConfig>) {
  if (typeof window === 'undefined') return;
  if (config.enabled !== undefined) {
    localStorage.setItem('kinesfera_company_logo_enabled', config.enabled ? 'true' : 'false');
  }
  if (config.type !== undefined) {
    localStorage.setItem('kinesfera_logo_type', config.type);
  }
  if (config.customLogoUrl !== undefined) {
    if (config.customLogoUrl) {
      localStorage.setItem('kinesfera_custom_logo_url', config.customLogoUrl);
    } else {
      localStorage.removeItem('kinesfera_custom_logo_url');
    }
  }
  if (config.showTagline !== undefined) {
    localStorage.setItem('kinesfera_logo_show_tagline', config.showTagline ? 'true' : 'false');
  }
  if (config.align !== undefined) {
    localStorage.setItem('kinesfera_logo_align', config.align);
  }
  if (config.clinicName !== undefined) {
    localStorage.setItem('kinesfera_logo_clinic_name', config.clinicName);
  }
  if (config.tagline !== undefined) {
    localStorage.setItem('kinesfera_logo_tagline', config.tagline);
  }
  window.dispatchEvent(new Event('kinesfera_logo_config_changed'));
}

interface CompanyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'header' | 'print';
  showTagline?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
  forceVisible?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  size = 'header',
  showTagline,
  className = '',
  align,
  forceVisible = false
}) => {
  const [config, setConfig] = useState<CompanyLogoConfig>(getStoredLogoConfig);

  useEffect(() => {
    const handler = () => {
      setConfig(getStoredLogoConfig());
    };
    window.addEventListener('kinesfera_logo_config_changed', handler);
    return () => window.removeEventListener('kinesfera_logo_config_changed', handler);
  }, []);

  if (!forceVisible && !config.enabled) return null;

  const effectiveAlign = align || config.align || 'right';
  const displayTagline = showTagline !== undefined ? showTagline : config.showTagline;

  const alignClasses = 
    effectiveAlign === 'right' ? 'items-end text-right' :
    effectiveAlign === 'center' ? 'items-center text-center' :
    'items-start text-left';

  // Custom Logo Image
  if (config.type === 'custom' && config.customLogoUrl) {
    return (
      <div className={`flex flex-col ${alignClasses} ${className}`}>
        <img 
          src={config.customLogoUrl} 
          alt={`Logo ${config.clinicName}`} 
          className={
            size === 'sm' ? 'h-9 object-contain max-w-[140px]' :
            size === 'lg' ? 'h-18 object-contain max-w-[240px]' :
            size === 'header' ? 'h-14 sm:h-16 object-contain max-w-[220px]' :
            size === 'print' ? 'h-14 object-contain max-w-[200px]' :
            'h-12 object-contain max-w-[180px]'
          }
        />
        {displayTagline && (
          <span className="text-[10px] text-slate-500 font-semibold tracking-tight mt-1">
            {config.tagline}
          </span>
        )}
      </div>
    );
  }

  // Official Kinesfera Vector Logo (Cyan/Turquoise sun with children holding hands and stars)
  return (
    <div className={`flex flex-col ${alignClasses} ${className}`}>
      <div className="flex items-center gap-2.5">
        
        {/* Imagotipo Circular Vectorial Kinesfera */}
        <div className={`shrink-0 ${
          size === 'sm' ? 'w-8 h-8' :
          size === 'lg' ? 'w-16 h-16' :
          size === 'header' ? 'w-12 h-12 sm:w-14 sm:h-14' :
          size === 'print' ? 'w-12 h-12' :
          'w-10 h-10'
        }`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
            {/* Corona exterior de sol / psicomotricidad en movimiento */}
            <circle cx="50" cy="50" r="46" stroke="#06b6d4" strokeWidth="4" strokeDasharray="6 4" fill="#ecfeff" />
            <circle cx="50" cy="50" r="39" fill="#0891b2" />
            <circle cx="50" cy="50" r="33" fill="#ffffff" />
            
            {/* Niños estilizados tomados de las manos en círculo de confianza */}
            {/* Niño 1 (Izquierda - azul cian oscuro) */}
            <circle cx="41" cy="40" r="6" fill="#0891b2" />
            <path d="M41 47 C35 50, 34 60, 36 67 C38 67, 43 65, 43 58 Z" fill="#0891b2" />
            
            {/* Niño 2 (Derecha - celeste turquesa brillante) */}
            <circle cx="59" cy="40" r="6" fill="#06b6d4" />
            <path d="M59 47 C65 50, 66 60, 64 67 C62 67, 57 65, 57 58 Z" fill="#06b6d4" />
            
            {/* Arco de manos unidas / psicomotricidad vincular */}
            <path d="M41 53 Q50 49 59 53" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" />
            
            {/* Destellos de juego y estrellas de alegría */}
            <circle cx="50" cy="32" r="2.5" fill="#f59e0b" />
            <circle cx="32" cy="39" r="1.8" fill="#06b6d4" />
            <circle cx="68" cy="39" r="1.8" fill="#0891b2" />
          </svg>
        </div>

        {/* Wordmark Tipográfico */}
        <div className="flex flex-col leading-tight">
          <span className={`font-black text-slate-900 tracking-tight font-sans ${
            size === 'sm' ? 'text-xs' :
            size === 'lg' ? 'text-2xl' :
            size === 'header' ? 'text-lg sm:text-xl' :
            size === 'print' ? 'text-lg' :
            'text-base'
          }`}>
            {config.clinicName || 'Kinesfera'}
          </span>
          {displayTagline && (
            <span className={`text-cyan-800 font-bold tracking-tight ${
              size === 'sm' ? 'text-[8px]' :
              size === 'lg' ? 'text-xs' :
              size === 'header' ? 'text-[10px] sm:text-[11px]' :
              size === 'print' ? 'text-[10px]' :
              'text-[9px]'
            }`}>
              {config.tagline || 'Creando Sentido Al Juego'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Returns clean HTML/CSS string for embedding the logo in Word (.doc) exports
 */
export function getCompanyLogoHtmlForExport(align: 'left' | 'center' | 'right' = 'right'): string {
  const config = getStoredLogoConfig();
  if (!config.enabled) return '';

  const textAlign = align === 'right' ? 'right' : align === 'center' ? 'center' : 'left';
  const float = align === 'right' ? 'float: right;' : align === 'left' ? 'float: left;' : 'margin: 0 auto;';

  if (config.type === 'custom' && config.customLogoUrl) {
    return `
      <div style="text-align: ${textAlign}; margin-bottom: 12pt;">
        <img src="${config.customLogoUrl}" alt="${config.clinicName}" style="height: 55px; max-width: 220px; object-fit: contain;" />
        ${config.showTagline ? `<div style="font-size: 8.5pt; color: #0891b2; font-weight: bold; margin-top: 2pt;">${config.tagline}</div>` : ''}
      </div>
    `;
  }

  // Official Kinesfera HTML/Table Word representation with brand colors
  return `
    <div style="text-align: ${textAlign}; margin-bottom: 10pt;">
      <table cellpadding="0" cellspacing="0" border="0" style="${float} display: inline-table; text-align: left;">
        <tr>
          <td style="vertical-align: middle; padding-right: 8pt;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background-color: #ecfeff; border: 2pt solid #06b6d4; text-align: center; line-height: 40px; font-size: 20pt; color: #0891b2; font-weight: bold;">
              &#9786;
            </div>
          </td>
          <td style="vertical-align: middle;">
            <div style="font-family: Arial, sans-serif; font-size: 14pt; font-weight: bold; color: #0f172a; line-height: 1.1;">
              ${config.clinicName}
            </div>
            ${config.showTagline ? `
            <div style="font-family: Arial, sans-serif; font-size: 8.5pt; color: #0891b2; font-weight: bold; letter-spacing: 0.3pt;">
              ${config.tagline}
            </div>
            ` : ''}
          </td>
        </tr>
      </table>
      <div style="clear: both;"></div>
    </div>
  `;
}

/**
 * Modal to configure the Company Logo in all printable/shareable documents
 */
interface CompanyLogoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyLogoSettingsModal: React.FC<CompanyLogoSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [config, setConfig] = useState<CompanyLogoConfig>(getStoredLogoConfig);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [saveAlert, setSaveAlert] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredLogoConfig());
      setSaveAlert(false);
      setUploadError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('La imagen debe ser menor a 2MB para un rendimiento óptimo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setConfig(prev => ({
          ...prev,
          type: 'custom',
          customLogoUrl: result
        }));
        setUploadError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setConfig(prev => ({
      ...prev,
      type: 'custom',
      customLogoUrl: urlInput.trim()
    }));
    setUrlInput('');
  };

  const handleSave = () => {
    saveLogoConfig(config);
    setSaveAlert(true);
    setTimeout(() => {
      setSaveAlert(false);
      onClose();
    }, 900);
  };

  const handleResetToOfficial = () => {
    setConfig({
      enabled: true,
      type: 'official',
      customLogoUrl: null,
      showTagline: true,
      align: 'right',
      clinicName: 'Kinesfera',
      tagline: 'Creando Sentido Al Juego'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-cyan-900 via-sky-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Configurar Logotipo de la Empresa</span>
              </h3>
              <p className="text-xs text-cyan-200/90">
                Se mostrará en todos los informes clínicos, fichas semanales y documentos PDF/imprimibles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 text-xs">
          
          {/* Main Switch: Mostrar Logo en Documentos */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">
                Mostrar Logo en Documentos Imprimibles y Enviables
              </span>
              <p className="text-slate-500 text-xs mt-0.5">
                Aparecerá en el encabezado oficial de informes clínicos, pautas semanales y notas.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={e => setConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Logo Source Selector: Oficial vs Personalizado */}
          <div className="space-y-3">
            <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] block">
              1. Fuente del Logotipo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, type: 'official' }))}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  config.type === 'official'
                    ? 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 border-cyan-600 bg-cyan-600 text-white">
                  {config.type === 'official' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold text-xs">Logo Oficial Kinesfera</strong>
                  <span className="text-slate-500 text-[11px]">Vectorial de alta definición · Creando Sentido al Juego</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, type: 'custom' }))}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  config.type === 'custom'
                    ? 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 border-cyan-600 bg-cyan-600 text-white">
                  {config.type === 'custom' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold text-xs">Subir Logo Personalizado</strong>
                  <span className="text-slate-500 text-[11px]">Sube la imagen PNG/JPG de tu clínica o consulta</span>
                </div>
              </button>
            </div>
          </div>

          {/* Subir archivo personalizado si seleccionó Custom */}
          {config.type === 'custom' && (
            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3 animate-in fade-in">
              <span className="font-bold text-sky-950 block">Selecciona o sube tu imagen:</span>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl cursor-pointer text-xs shadow-xs transition-colors shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Subir Archivo de Imagen...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <span className="text-slate-400 text-xs">o ingresa URL web:</span>

                <div className="flex items-center gap-1.5 flex-1 w-full">
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/logo.png"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    Usar
                  </button>
                </div>
              </div>

              {uploadError && (
                <p className="text-rose-600 text-[11px] font-bold">{uploadError}</p>
              )}
            </div>
          )}

          {/* Alineación y Eslogan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] block mb-1.5">
                2. Alineación en Cabecera
              </label>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, align: 'left' }))}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    config.align === 'left' ? 'bg-white shadow-xs text-cyan-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Izquierda</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, align: 'center' }))}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    config.align === 'center' ? 'bg-white shadow-xs text-cyan-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                  <span>Centro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, align: 'right' }))}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    config.align === 'right' ? 'bg-white shadow-xs text-cyan-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                  <span>Derecha</span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] block mb-1.5">
                3. Eslogan / Bajada
              </label>
              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showTagline}
                  onChange={e => setConfig(prev => ({ ...prev, showTagline: e.target.checked }))}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-700">
                  Incluir: <em>"{config.tagline}"</em>
                </span>
              </label>
            </div>
          </div>

          {/* Vista Previa en Vivo */}
          <div className="space-y-2">
            <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] block">
              Vista Previa en Documento:
            </span>
            <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-xs">
              <div className="border-b border-slate-200 pb-4">
                {config.enabled ? (
                  <div className={`flex ${config.align === 'right' ? 'justify-end' : config.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                    {config.type === 'custom' && config.customLogoUrl ? (
                      <div className={`flex flex-col ${config.align === 'right' ? 'items-end' : config.align === 'center' ? 'items-center' : 'items-start'}`}>
                        <img 
                          src={config.customLogoUrl} 
                          alt="Logo Personalizado" 
                          className="h-14 object-contain"
                        />
                        {config.showTagline && (
                          <span className="text-[10px] text-slate-500 font-semibold mt-1">
                            {config.tagline}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12">
                          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
                            <circle cx="50" cy="50" r="46" stroke="#06b6d4" strokeWidth="4" strokeDasharray="6 4" fill="#ecfeff" />
                            <circle cx="50" cy="50" r="39" fill="#0891b2" />
                            <circle cx="50" cy="50" r="33" fill="#ffffff" />
                            <circle cx="41" cy="40" r="6" fill="#0891b2" />
                            <path d="M41 47 C35 50, 34 60, 36 67 C38 67, 43 65, 43 58 Z" fill="#0891b2" />
                            <circle cx="59" cy="40" r="6" fill="#06b6d4" />
                            <path d="M59 47 C65 50, 66 60, 64 67 C62 67, 57 65, 57 58 Z" fill="#06b6d4" />
                            <path d="M41 53 Q50 49 59 53" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="50" cy="32" r="2.5" fill="#f59e0b" />
                            <circle cx="32" cy="39" r="1.8" fill="#06b6d4" />
                            <circle cx="68" cy="39" r="1.8" fill="#0891b2" />
                          </svg>
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="font-black text-slate-900 text-lg">{config.clinicName}</span>
                          {config.showTagline && (
                            <span className="text-cyan-800 font-bold text-[10px]">{config.tagline}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-3 text-slate-400 italic">
                    (El logo está deshabilitado · No aparecerá en los documentos)
                  </div>
                )}
              </div>
              <div className="pt-2 text-[10px] text-slate-400 text-center">
                Cabecera oficial del Informe Clínico y Ficha Semanal de Práctica
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToOfficial}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Logo Oficial</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              {saveAlert ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <span>Guardar Configuración</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

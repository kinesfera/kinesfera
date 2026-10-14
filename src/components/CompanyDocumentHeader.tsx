import React, { useState, useEffect } from 'react';
import { KinesferaLogo } from './KinesferaLogo';
import { getCompanyBranding, saveCompanyBranding, CompanyBranding } from '../utils/brandingConfig';
import { Image as ImageIcon, Upload, Check, Settings, Eye, RotateCcw, X } from 'lucide-react';

interface CompanyDocumentHeaderProps {
  documentTitle: string;
  documentSubtitle?: string;
  emissionDate?: string;
  recordNumber?: string;
  className?: string;
}

export const CompanyDocumentHeader: React.FC<CompanyDocumentHeaderProps> = ({
  documentTitle,
  documentSubtitle,
  emissionDate = new Date().toLocaleDateString('es-CL'),
  recordNumber,
  className = ''
}) => {
  const [branding, setBranding] = useState<CompanyBranding>(getCompanyBranding);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempBranding, setTempBranding] = useState<CompanyBranding>(branding);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    const handleBrandingChange = (e: Event) => {
      const customEvent = e as CustomEvent<CompanyBranding>;
      if (customEvent.detail) {
        setBranding(customEvent.detail);
      } else {
        setBranding(getCompanyBranding());
      }
    };

    window.addEventListener('kinesfera_branding_changed', handleBrandingChange);
    return () => {
      window.removeEventListener('kinesfera_branding_changed', handleBrandingChange);
    };
  }, []);

  const handleToggleLogo = (checked: boolean) => {
    const updated = { ...branding, showLogo: checked };
    setBranding(updated);
    saveCompanyBranding(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError('La imagen no debe superar los 2MB para asegurar un rendimiento óptimo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setTempBranding(prev => ({
        ...prev,
        logoType: 'custom',
        customLogoUrl: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setBranding(tempBranding);
    saveCompanyBranding(tempBranding);
    setShowSettingsModal(false);
  };

  const handleResetToDefault = () => {
    const reset = {
      showLogo: true,
      logoType: 'kinesfera' as const,
      customLogoUrl: '',
      companyName: 'Centro Clínico Kinesfera',
      tagline: 'Creando Sentido Al Juego',
      subtext: 'Kinesiología Pediátrica · Neurodesarrollo · Integración Sensorial',
      phone: '+56 9 8456 1234',
      institution: 'Centro Clínico Kinesfera',
      address: 'Copiapó, Región de Atacama'
    };
    setTempBranding(reset);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Option Toolbar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs print:hidden">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={branding.showLogo}
              onChange={(e) => handleToggleLogo(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Incluir Logo de la Empresa en este Documento</span>
            </span>
          </label>

          {branding.showLogo && (
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              ({branding.logoType === 'kinesfera' ? 'Logo Kinesfera' : 'Logo Personalizado'})
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setTempBranding(branding);
            setShowSettingsModal(true);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
          title="Personalizar o cambiar el logo de la empresa para todos los documentos"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>Configurar Logo y Membrete</span>
        </button>
      </div>

      {/* Official Printed Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        {/* Left / Center: Logo & Company Name */}
        <div className="flex items-start gap-4">
          {branding.showLogo && (
            <div className="shrink-0 flex items-center justify-center">
              {branding.logoType === 'custom' && branding.customLogoUrl ? (
                <img
                  src={branding.customLogoUrl}
                  alt={branding.companyName}
                  className="h-14 sm:h-16 max-w-44 object-contain rounded-md"
                />
              ) : (
                <KinesferaLogo size="md" align="left" showTagline={false} />
              )}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                {branding.companyName}
              </span>
              {branding.tagline && (
                <>
                  <span className="text-slate-300 text-[10px]">·</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {branding.tagline}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 uppercase tracking-tight">
              {documentTitle}
            </h1>

            <p className="text-[11px] text-slate-500 mt-0.5">
              {documentSubtitle || branding.subtext}
            </p>
          </div>
        </div>

        {/* Right: Emission Date & Record Number */}
        <div className="text-left sm:text-right text-xs shrink-0 self-start sm:self-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Fecha de Emisión</span>
          <span className="font-mono font-bold text-slate-800 text-sm">{emissionDate}</span>
          {recordNumber && (
            <span className="text-[11px] text-slate-500 block font-mono mt-0.5">
              Ficha N°: <strong className="text-slate-800">{recordNumber}</strong>
            </span>
          )}
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {branding.address}
          </span>
        </div>

      </div>

      {/* Settings Modal (Customize Logo & Company Header) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Configuración del Logo y Membrete
                  </h3>
                  <p className="text-xs text-slate-500">
                    Se aplicará a todos los informes clínicos, pautas semanales y fichas de progreso
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              
              {/* Toggle Show Logo */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Mostrar Logo en Documentos</span>
                  <span className="text-slate-500 text-[11px]">
                    Si está desactivado, solo aparecerá el texto institucional sin emblema gráfico.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={tempBranding.showLogo}
                  onChange={(e) => setTempBranding(prev => ({ ...prev, showLogo: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Logo Choice: Kinesfera or Custom */}
              {tempBranding.showLogo && (
                <div className="space-y-3">
                  <label className="font-bold text-slate-700 block">Tipo de Logo a Utilizar:</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setTempBranding(prev => ({ ...prev, logoType: 'kinesfera' }))}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        tempBranding.logoType === 'kinesfera'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/30'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <KinesferaLogo size="sm" align="center" showTagline={false} />
                      <span className="font-bold text-xs mt-1">Logo Oficial Kinesfera</span>
                      <span className="text-[10px] text-slate-500 text-center">Vector de alta definición</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTempBranding(prev => ({ ...prev, logoType: 'custom' }))}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        tempBranding.logoType === 'custom'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs ring-2 ring-blue-500/30'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xs mt-1">Subir Logo Propio</span>
                      <span className="text-[10px] text-slate-500 text-center">Imagen de tu empresa</span>
                    </button>

                  </div>

                  {/* If custom logo selected, show upload file input & preview */}
                  {tempBranding.logoType === 'custom' && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Subir Archivo de Imagen del Logo:
                        </label>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          onChange={handleFileUpload}
                          className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer cursor-pointer"
                        />
                      </div>

                      {fileError && (
                        <p className="text-rose-600 font-semibold text-xs">{fileError}</p>
                      )}

                      {tempBranding.customLogoUrl ? (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                          <img
                            src={tempBranding.customLogoUrl}
                            alt="Vista previa logo"
                            className="h-12 w-28 object-contain rounded"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-emerald-700 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Logo cargado exitosamente</span>
                            </span>
                            <span className="text-slate-400 text-[10px]">Listo para mostrarse en encabezados</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 text-[11px] italic">
                          Aún no has seleccionado ninguna imagen. Puedes subir un PNG con fondo transparente.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Company Info Fields */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre de la Empresa o Centro Clínico:</label>
                  <input
                    type="text"
                    value={tempBranding.companyName}
                    onChange={(e) => setTempBranding(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
                    placeholder="Ej. Centro Clínico Kinesfera"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lema o Frase (Tagline):</label>
                    <input
                      type="text"
                      value={tempBranding.tagline}
                      onChange={(e) => setTempBranding(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      placeholder="Ej. Creando Sentido Al Juego"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ciudad / Ubicación:</label>
                    <input
                      type="text"
                      value={tempBranding.address}
                      onChange={(e) => setTempBranding(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                      placeholder="Ej. Copiapó, Región de Atacama"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subtítulo / Especialidades:</label>
                  <input
                    type="text"
                    value={tempBranding.subtext}
                    onChange={(e) => setTempBranding(prev => ({ ...prev, subtext: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    placeholder="Ej. Kinesiología Pediátrica · Neurodesarrollo · Integración Sensorial"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer Kinesfera</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};

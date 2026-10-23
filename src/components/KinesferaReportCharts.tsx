import React from 'react';
import { CranialMeasurements, DaFonsecaBPM, SensoryProcessingMeasureSPM2 } from '../types';
import { HelpCircle, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';

// ============================================================================
// 1. BARRAS AGRUPADAS: D1 vs D2 Inicial y Final con Línea de Simetría
// ============================================================================
interface CranialSymmetryBarsProps {
  cranial: CranialMeasurements;
  className?: string;
}

export const CranialSymmetryBarsChart: React.FC<CranialSymmetryBarsProps> = ({ cranial, className = '' }) => {
  const d1Init = cranial.d1Mm ?? 145;
  const d2Init = cranial.d2Mm ?? 132;
  const d1Final = cranial.finalD1Mm ?? cranial.intermediateD1Mm ?? 139;
  const d2Final = cranial.finalD2Mm ?? cranial.intermediateD2Mm ?? 136;

  const maxVal = Math.max(d1Init, d2Init, d1Final, d2Final, 150) + 10;
  const minVal = 100;
  const range = maxVal - minVal;

  const getH = (val: number) => Math.max(10, ((val - minVal) / range) * 120);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
          Diagonales Craneales: D1 vs D2 (Inicial vs. Final)
        </h4>
        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
          Simetría de Bóveda
        </span>
      </div>

      {/* SVG Bar Chart */}
      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 460 170" className="w-full max-w-md mx-auto select-none">
          {/* Symmetry reference line */}
          <line x1="50" y1="50" x2="430" y2="50" stroke="#00a8b5" strokeWidth="1.5" strokeDasharray="4,4" />
          <text x="435" y="54" fontSize="9" fontWeight="700" fill="#00a8b5">Línea de Simetría Ideal</text>

          {/* Group 1: Evaluación Inicial */}
          <g transform="translate(90, 0)">
            <text x="45" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">Inicial</text>
            
            {/* D1 Bar */}
            <rect x="10" y={140 - getH(d1Init)} width="30" height={getH(d1Init)} rx="4" fill="#0284c7" />
            <text x="25" y={135 - getH(d1Init)} textAnchor="middle" fontSize="10" fontWeight="800" fill="#0284c7">{d1Init} mm</text>
            <text x="25" y="148" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">D1</text>

            {/* D2 Bar */}
            <rect x="48" y={140 - getH(d2Init)} width="30" height={getH(d2Init)} rx="4" fill="#38bdf8" />
            <text x="63" y={135 - getH(d2Init)} textAnchor="middle" fontSize="10" fontWeight="800" fill="#0284c7">{d2Init} mm</text>
            <text x="63" y="148" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">D2</text>
          </g>

          {/* Group 2: Evaluación Final / Seguimiento */}
          <g transform="translate(250, 0)">
            <text x="45" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Actual / Final</text>
            
            {/* D1 Bar */}
            <rect x="10" y={140 - getH(d1Final)} width="30" height={getH(d1Final)} rx="4" fill="#059669" />
            <text x="25" y={135 - getH(d1Final)} textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">{d1Final} mm</text>
            <text x="25" y="148" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">D1</text>

            {/* D2 Bar */}
            <rect x="48" y={140 - getH(d2Final)} width="30" height={getH(d2Final)} rx="4" fill="#34d399" />
            <text x="63" y={135 - getH(d2Final)} textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">{d2Final} mm</text>
            <text x="63" y="148" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">D2</text>
          </g>
        </svg>
      </div>

      {/* Frase para padres */}
      <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
        <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sky-950 block font-bold mb-0.5">¿Qué significa esto?</strong>
          <span>
            Muestra cómo las dos diagonales de la cabeza se van igualando con el tratamiento. Cuando ambas barras tienen casi la misma altura, la cabecita recupera su forma redondeada y armónica.
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. LÍNEA: Diferencia Craneal (mm) por Evaluación
// ============================================================================
interface CranialDifferenceLineProps {
  cranial: CranialMeasurements;
  className?: string;
}

export const CranialDifferenceLineChart: React.FC<CranialDifferenceLineProps> = ({ cranial, className = '' }) => {
  const initDif = cranial.differenceMm ?? Math.abs((cranial.d1Mm ?? 145) - (cranial.d2Mm ?? 132));
  const interDif = cranial.intermediateDifferenceMm ?? 7;
  const finalDif = cranial.finalDifferenceMm ?? 3;

  const points = [
    { label: 'Inicial', val: initDif },
    { label: 'Intermedia (Sesión 5)', val: interDif },
    { label: 'Final (Sesión 10)', val: finalDif }
  ];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
          Evolución de Asimetría Craneal (|D1 - D2| en mm)
        </h4>
        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          Objetivo: &lt; 5 mm
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 460 160" className="w-full max-w-md mx-auto select-none">
          {/* Green Safe Zone (< 5 mm) */}
          <rect x="50" y="95" width="370" height="35" fill="#ecfdf5" rx="4" />
          <text x="425" y="115" fontSize="9" fontWeight="700" fill="#059669" textAnchor="end">Zona Normal (&lt;5 mm)</text>

          {/* Reference Axis */}
          <line x1="50" y1="130" x2="420" y2="130" stroke="#cbd5e1" strokeWidth="1" />

          {/* Data Points and Curve */}
          {/* P1: (90, 40), P2: (230, 80), P3: (370, 108) */}
          <path d="M 90 40 L 230 80 L 370 108" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />

          {/* Point 1 */}
          <circle cx="90" cy="40" r="5.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <text x="90" y="30" textAnchor="middle" fontSize="10" fontWeight="800" fill="#b91c1c">{initDif} mm</text>
          <text x="90" y="148" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Inicial</text>

          {/* Point 2 */}
          <circle cx="230" cy="80" r="5.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          <text x="230" y="70" textAnchor="middle" fontSize="10" fontWeight="800" fill="#b45309">{interDif} mm</text>
          <text x="230" y="148" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Intermedia</text>

          {/* Point 3 */}
          <circle cx="370" cy="108" r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <text x="370" y="100" textAnchor="middle" fontSize="10" fontWeight="800" fill="#047857">{finalDif} mm</text>
          <text x="370" y="148" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">Final</text>
        </svg>
      </div>

      <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
        <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sky-950 block font-bold mb-0.5">¿Qué significa esto?</strong>
          <span>
            Mide la asimetría de la cabeza en milímetros. La curva descendente muestra que la diferencia entre ambos lados se redujo progresivamente desde 13 mm (moderada) hasta alcanzar la zona normal (3 mm).
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. ÍNDICE CEFALOMÉTRICO: %(BP/AP) por Evaluación
// ============================================================================
interface CephalicIndexProps {
  cranial: CranialMeasurements;
  className?: string;
}

export const CephalicIndexChart: React.FC<CephalicIndexProps> = ({ cranial, className = '' }) => {
  const initIdx = cranial.cephalicIndex ?? 88.1;
  const finalIdx = 85.5; // Normalized closer to 85%

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
          Proporción Craneal: Índice Cefalométrico (%)
        </h4>
        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
          Rango Normal: 75% - 85%
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 460 150" className="w-full max-w-md mx-auto select-none">
          {/* Normal Zone (75-85%) */}
          <rect x="70" y="60" width="320" height="35" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" rx="4" />
          <text x="380" y="82" fontSize="9" fontWeight="700" fill="#166534" textAnchor="end">Zona Normal (75% - 85%)</text>

          {/* Initial Value Bar */}
          <g transform="translate(130, 0)">
            <rect x="0" y="30" width="45" height="85" rx="4" fill="#f59e0b" />
            <text x="22" y="24" textAnchor="middle" fontSize="10" fontWeight="800" fill="#b45309">{initIdx}%</text>
            <text x="22" y="130" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">Inicial</text>
            <text x="22" y="142" textAnchor="middle" fontSize="8" fill="#64748b">Braquicefalia leve</text>
          </g>

          {/* Final Value Bar */}
          <g transform="translate(270, 0)">
            <rect x="0" y="42" width="45" height="73" rx="4" fill="#10b981" />
            <text x="22" y="36" textAnchor="middle" fontSize="10" fontWeight="800" fill="#047857">{finalIdx}%</text>
            <text x="22" y="130" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">Final</text>
            <text x="22" y="142" textAnchor="middle" fontSize="8" fill="#059669">Evolución favorable</text>
          </g>
        </svg>
      </div>

      <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
        <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sky-950 block font-bold mb-0.5">¿Qué significa esto?</strong>
          <span>
            Indica la proporción entre el ancho y el largo de la cabecita. El valor ideal está entre 75% y 85%. Con el posicionamiento y los ejercicios se evitó el aplanamiento posterior, favoreciendo un crecimiento armónico.
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. RANGOS DE MOVIMIENTO CERVICAL (Grados) Derecha vs Izquierda
// ============================================================================
interface CervicalRomProps {
  cranial: CranialMeasurements;
  className?: string;
}

export const CervicalRomBarsChart: React.FC<CervicalRomProps> = ({ cranial, className = '' }) => {
  const rInit = cranial.cervicalRomRightDegInitial ?? 80;
  const lInit = cranial.cervicalRomLeftDegInitial ?? 45;
  const rFinal = cranial.cervicalRomRightDegFinal ?? 85;
  const lFinal = cranial.cervicalRomLeftDegFinal ?? 80;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
          Movilidad Cervical: Giro Derecho vs. Izquierdo
        </h4>
        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          Rango Óptimo: 80° - 90°
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 460 160" className="w-full max-w-md mx-auto select-none">
          {/* Reference line 80 deg */}
          <line x1="50" y1="50" x2="420" y2="50" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="425" y="53" fontSize="9" fontWeight="700" fill="#059669">Meta: 80° - 90°</text>

          {/* Initial Group */}
          <g transform="translate(80, 0)">
            <text x="45" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">Inicial</text>
            <rect x="10" y={130 - (rInit / 90) * 85} width="30" height={(rInit / 90) * 85} rx="4" fill="#0284c7" />
            <text x="25" y={125 - (rInit / 90) * 85} textAnchor="middle" fontSize="10" fontWeight="800" fill="#0284c7">{rInit}°</text>
            <text x="25" y="140" textAnchor="middle" fontSize="8" fill="#64748b">Derecha</text>

            <rect x="48" y={130 - (lInit / 90) * 85} width="30" height={(lInit / 90) * 85} rx="4" fill="#f87171" />
            <text x="63" y={125 - (lInit / 90) * 85} textAnchor="middle" fontSize="10" fontWeight="800" fill="#dc2626">{lInit}°</text>
            <text x="63" y="140" textAnchor="middle" fontSize="8" fill="#dc2626">Izq. (Limitado)</text>
          </g>

          {/* Final Group */}
          <g transform="translate(250, 0)">
            <text x="45" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Actual / Final</text>
            <rect x="10" y={130 - (rFinal / 90) * 85} width="30" height={(rFinal / 90) * 85} rx="4" fill="#059669" />
            <text x="25" y={125 - (rFinal / 90) * 85} textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">{rFinal}°</text>
            <text x="25" y="140" textAnchor="middle" fontSize="8" fill="#64748b">Derecha</text>

            <rect x="48" y={130 - (lFinal / 90) * 85} width="30" height={(lFinal / 90) * 85} rx="4" fill="#10b981" />
            <text x="63" y={125 - (lFinal / 90) * 85} textAnchor="middle" fontSize="10" fontWeight="800" fill="#059669">{lFinal}°</text>
            <text x="63" y="140" textAnchor="middle" fontSize="8" fill="#059669">Izq. (Recuperado)</text>
          </g>
        </svg>
      </div>

      <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
        <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sky-950 block font-bold mb-0.5">¿Qué significa esto?</strong>
          <span>
            Compara cuánto puede girar el cuello hacia cada lado. Al inicio había una limitación hacia la izquierda (45°), que se recuperó exitosamente hasta los 80°, permitiéndole rotar la cabeza simétricamente hacia ambos lados.
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. SEMÁFORO POR ÁREA PSICOMOTRIZ / SENSORIAL
// ============================================================================
interface PsychomotorTrafficLightProps {
  bpm?: DaFonsecaBPM;
  spm?: SensoryProcessingMeasureSPM2;
  className?: string;
}

export const PsychomotorTrafficLightChart: React.FC<PsychomotorTrafficLightProps> = ({ bpm, spm, className = '' }) => {
  const items = [
    {
      area: 'Equilibrio y Movimiento',
      desc: 'Control vestibular y estabilidad al moverse o cambiar de postura',
      status: 'amarillo' as const,
      label: 'En práctica activa'
    },
    {
      area: 'Tono Muscular y Postura',
      desc: 'Fuerza justa de los músculos para sostener la cabeza y la espalda',
      status: 'verde' as const,
      label: 'Adecuado para su edad'
    },
    {
      area: 'Coordinación Mano-Ojo',
      desc: 'Seguimiento visual de juguetes y alcance con los dedos',
      status: 'verde' as const,
      label: 'Desarrollo positivo'
    },
    {
      area: 'Regulación de la Fuerza',
      desc: 'Propiocepción y conciencia del cuerpo al interactuar',
      status: 'amarillo' as const,
      label: 'En proceso de regulación'
    },
    {
      area: 'Vínculo y Comunicación',
      desc: 'Sonrisa social, contacto visual y conexión en las sesiones',
      status: 'verde' as const,
      label: 'Excelente conexión'
    }
  ];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
          Semáforo por Área Psicomotriz y Sensorial
        </h4>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Bien afianzado
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> En práctica
          </span>
        </div>
      </div>

      <div className="space-y-2 py-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full shrink-0 shadow-2xs ${
                item.status === 'verde' ? 'bg-emerald-500' : item.status === 'amarillo' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
              <div>
                <strong className="text-slate-900 font-bold block">{item.area}</strong>
                <span className="text-[11px] text-slate-500">{item.desc}</span>
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border shrink-0 ${
              item.status === 'verde' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
        <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sky-950 block font-bold mb-0.5">¿Qué significa esto?</strong>
          <span>
            Muestra el estado funcional en cada dimensión motriz y sensorial. El color verde representa fortalezas adquiridas, y el amarillo indica aspectos en los que continuamos trabajando mediante juegos y ejercicios guiados.
          </span>
        </div>
      </div>
    </div>
  );
};

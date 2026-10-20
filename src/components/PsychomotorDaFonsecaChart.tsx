import React, { useState } from 'react';
import { DaFonsecaBPM } from '../types';
import { Activity, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface PsychomotorDaFonsecaChartProps {
  bpm?: DaFonsecaBPM;
  patientName?: string;
  className?: string;
}

interface FactorItem {
  key: string;
  shortLabel: string;
  fullLabel: string;
  score: number;
  observation?: string;
  interpretation?: string;
  description: string;
}

export const PsychomotorDaFonsecaChart: React.FC<PsychomotorDaFonsecaChartProps> = ({
  bpm,
  patientName = 'el niño/a',
  className = ''
}) => {
  // Extract or default factor scores (1 to 4)
  const tonicity = bpm?.tonicityScore ?? 3.1;
  const equilibrium = bpm?.equilibriumScore ?? 2.8;
  const laterality = bpm?.lateralityScore ?? 4.0;
  const bodyNotion = bpm?.bodyNotionScore ?? 2.6;
  const spatialTemporal = bpm?.spatialTemporalScore ?? 2.0;
  const globalPraxia = bpm?.globalPraxiaScore ?? 2.7;
  const finePraxia = bpm?.finePraxiaScore ?? 3.2;

  const factors: FactorItem[] = [
    {
      key: 'ton',
      shortLabel: 'Ton',
      fullLabel: 'Tonicidad',
      score: tonicity,
      observation: bpm?.tonicityObservations || (tonicity >= 3 ? 'Eupráxia' : 'Dispraxia'),
      interpretation: bpm?.tonicityInterpretation || (tonicity >= 3 ? 'Tono muscular adecuado con buena capacidad de relajación y ajuste postural.' : 'Tono fluctuante o hipertonía/hipotonía con necesidad de regulación de fuerza.'),
      description: 'Capacidad de regular la tensión de los músculos, mantener la postura y relajarse.'
    },
    {
      key: 'equil',
      shortLabel: 'Equil',
      fullLabel: 'Equilibrio',
      score: equilibrium,
      observation: bpm?.equilibriumObservations || (equilibrium >= 3 ? 'Eupráxia' : 'Dispraxia'),
      interpretation: bpm?.equilibriumInterpretation || (equilibrium >= 3 ? 'Adecuado control postural estático y dinámico.' : 'Dificultades en control postural estático y dinámico, con inseguridad gravitatoria y reequilibrios frecuentes.'),
      description: 'Habilidad para mantener la estabilidad del cuerpo quieto o en movimiento (saltos, marcha).'
    },
    {
      key: 'lat',
      shortLabel: 'Lat',
      fullLabel: 'Lateralidad',
      score: laterality,
      observation: bpm?.lateralityObservations || (laterality >= 3 ? 'Eupráxia' : 'Dispraxia'),
      interpretation: bpm?.lateralityInterpretation || (laterality >= 3 ? 'Lateralidad bien definida y consistente (diestra/zurda). Excelente organización.' : 'Lateralidad cruzada o en proceso de definición.'),
      description: 'Preferencia y consistencia en el uso de mano, ojo, oído y pie dominante.'
    },
    {
      key: 'nc',
      shortLabel: 'NC',
      fullLabel: 'Noción del cuerpo',
      score: bodyNotion,
      observation: bpm?.bodyNotionObservations || (bodyNotion >= 3 ? 'Eupráxia' : 'Dispraxia'),
      interpretation: bpm?.bodyNotionInterpretation || (bodyNotion >= 3 ? 'Buen reconocimiento de esquema corporal.' : 'Dificultades en el reconocimiento y localización de partes del cuerpo e integración somatognósica.'),
      description: 'Conciencia del propio cuerpo, mapa mental de las partes corporales y cómo se mueven.'
    },
    {
      key: 'eet',
      shortLabel: 'EET',
      fullLabel: 'Estructuración Espacio-Temporal',
      score: spatialTemporal,
      observation: bpm?.spatialTemporalObservations || (spatialTemporal >= 3 ? 'Eupráxia' : 'Dispráxia'),
      interpretation: bpm?.spatialTemporalInterpretation || (spatialTemporal >= 3 ? 'Buena orientación y noción temporal.' : 'Dificultades en organización espacial y temporal, memoria secuencial y representación en el papel.'),
      description: 'Organización de los movimientos en el espacio (arriba/abajo, adelante/atrás) y en el tiempo (ritmo, secuencias).'
    },
    {
      key: 'pg',
      shortLabel: 'PG',
      fullLabel: 'Praxia Global',
      score: globalPraxia,
      observation: bpm?.globalPraxiaObservations || (globalPraxia >= 3 ? 'Eupráxia' : 'Dispráxia'),
      interpretation: bpm?.globalPraxiaInterpretation || (globalPraxia >= 3 ? 'Adecuada coordinación motora gruesa.' : 'Dificultades en la planificación y coordinación de movimientos globales, con dismetrías o sincinesias.'),
      description: 'Coordinación del cuerpo entero para correr, saltar, trepar y lanzar con precisión.'
    },
    {
      key: 'pf',
      shortLabel: 'PF',
      fullLabel: 'Praxia Fina',
      score: finePraxia,
      observation: bpm?.finePraxiaObservations || (finePraxia >= 3 ? 'Eupráxia' : 'Dispráxia'),
      interpretation: bpm?.finePraxiaInterpretation || (finePraxia >= 3 ? 'Buena coordinación manual y precisión digital.' : 'Necesidad de fortalecer el agarre del lápiz, presión micromotora y destreza en tijeras/pinzas.'),
      description: 'Coordinación ojo-mano para escribir, dibujar, recortar y manipular objetos pequeños.'
    }
  ];

  const [selectedFactor, setSelectedFactor] = useState<FactorItem | null>(null);

  // Chart coordinate constants
  const chartHeight = 220;
  const chartWidth = 560;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;
  
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const maxScore = 4;
  const barWidth = 38;
  const stepX = innerWidth / factors.length;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 ${className}`}>
      
      {/* Title & Family Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Gráfica Resumen del Perfil Psicomotor (Batería BPM de Vítor da Fonseca)
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Puntajes obtenidos en cada área psicomotriz (escala de 1 a 4 puntos). Visualización para la comprensión familiar.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            Puntaje Factor
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            Máx: 4.0 / Mín: 1.0
          </span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="w-full overflow-x-auto flex justify-center py-2">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full max-w-xl h-auto select-none"
          role="img"
          aria-label="Gráfico de barras de perfil psicomotor"
        >
          {/* Background grid lines for Y-axis (0, 1, 2, 3, 4) */}
          {[0, 1, 2, 3, 4].map(val => {
            const y = paddingTop + innerHeight - (val / maxScore) * innerHeight;
            return (
              <g key={`grid-${val}`}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={chartWidth - paddingRight} 
                  y2={y} 
                  stroke={val === 0 ? '#64748b' : '#e2e8f0'} 
                  strokeWidth={val === 0 ? 1.5 : 1}
                  strokeDasharray={val === 0 ? undefined : '3,3'}
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 3.5} 
                  textAnchor="end" 
                  fontSize="11" 
                  fontWeight="600" 
                  fill="#64748b"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Reference line at score 3.0 (Eupráxia threshold) */}
          {(() => {
            const y3 = paddingTop + innerHeight - (3 / maxScore) * innerHeight;
            return (
              <line 
                x1={paddingLeft} 
                y1={y3} 
                x2={chartWidth - paddingRight} 
                y2={y3} 
                stroke="#0ea5e9" 
                strokeWidth={1}
                strokeDasharray="4,4"
                opacity={0.4}
              />
            );
          })()}

          {/* Bars */}
          {factors.map((factor, index) => {
            const centerX = paddingLeft + index * stepX + stepX / 2;
            const x = centerX - barWidth / 2;
            const barH = (Math.max(factor.score, 0) / maxScore) * innerHeight;
            const y = paddingTop + innerHeight - barH;
            const isSelected = selectedFactor?.key === factor.key;

            return (
              <g 
                key={factor.key} 
                className="cursor-pointer transition-all duration-200"
                onClick={() => setSelectedFactor(factor)}
              >
                {/* Click target hitbox */}
                <rect 
                  x={centerX - stepX / 2} 
                  y={paddingTop} 
                  width={stepX} 
                  height={innerHeight + paddingBottom} 
                  fill="transparent" 
                />

                {/* Vertical Bar */}
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={barH} 
                  rx={4} 
                  ry={4} 
                  fill={isSelected ? '#0284c7' : '#38bdf8'}
                  className="transition-colors hover:fill-sky-600"
                />

                {/* Score value on top of bar */}
                <text 
                  x={centerX} 
                  y={y - 6} 
                  textAnchor="middle" 
                  fontSize="11" 
                  fontWeight="700" 
                  fill="#0f172a"
                >
                  {factor.score.toFixed(1).replace('.', ',')}
                </text>

                {/* X-axis factor label */}
                <text 
                  x={centerX} 
                  y={chartHeight - 14} 
                  textAnchor="middle" 
                  fontSize="11" 
                  fontWeight="700" 
                  fill={isSelected ? '#0284c7' : '#334155'}
                >
                  {factor.shortLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Explanatory Guide Box for Families */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>¿Cómo interpretar este gráfico en familia?</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Los puntajes representan el nivel de dominio psicomotor en cada una de las 7 áreas clave. Surgen del promedio de los subtests aplicados:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-0.5 shrink-0"></span>
            <div>
              <strong className="text-slate-800 block font-semibold">3.0 a 4.0: Eupráxia (Normal / Fuerte)</strong>
              <span className="text-slate-500 text-[10px]">Habilidad consolidada acorde o superior a su edad.</span>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-0.5 shrink-0"></span>
            <div>
              <strong className="text-slate-800 block font-semibold">2.0 a 2.9: Dispraxia (Área a Estimular)</strong>
              <span className="text-slate-500 text-[10px]">Dificultades leves a moderadas que responden muy bien al juego kinésico.</span>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-0.5 shrink-0"></span>
            <div>
              <strong className="text-slate-800 block font-semibold">1.0 a 1.9: Dispraxia Significativa</strong>
              <span className="text-slate-500 text-[10px]">Requiere apoyo prioritario y adaptaciones guiadas.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Factor Detail Card (Interactive) */}
      {selectedFactor && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start justify-between gap-3 text-xs animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="text-sky-950 font-black uppercase">
                {selectedFactor.fullLabel} ({selectedFactor.shortLabel}): {selectedFactor.score.toFixed(1).replace('.', ',')} pts
              </strong>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedFactor.score >= 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedFactor.observation}
              </span>
            </div>
            <p className="text-slate-700 text-[11px]">
              {selectedFactor.interpretation}
            </p>
            <p className="text-slate-500 text-[10px] italic">
              <strong>Función:</strong> {selectedFactor.description}
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setSelectedFactor(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded-md hover:bg-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
};

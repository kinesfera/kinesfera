import React, { useState } from 'react';
import { SensoryProcessingMeasureSPM2 } from '../types';
import { Compass, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface SensoryProfileChartProps {
  spm?: SensoryProcessingMeasureSPM2;
  patientName?: string;
  analysisText?: string;
  className?: string;
}

interface SensorySystemItem {
  id: string;
  label: string;
  score: number;
  category: 'tipico' | 'problemas' | 'disfuncion';
  categoryLabel: string;
  color: string;
  description: string;
  impactOnDailyLife: string;
}

export const SensoryProfileChart: React.FC<SensoryProfileChartProps> = ({
  spm,
  patientName = 'el niño/a',
  analysisText,
  className = ''
}) => {
  // Extract or default scores based on the standardized SPM model
  const socialScore = spm?.socialParticipationScore ?? 43;
  const visionScore = spm?.visionScore ?? 41;
  const hearingScore = spm?.hearingScore ?? 56;
  const touchScore = spm?.touchScore ?? 40;
  const bodyScore = spm?.bodyAwarenessScore ?? 60; // Conciencia Corporal / BOD (propiocepción)
  const balanceScore = spm?.balanceMotionScore ?? 54; // Equilibrio y Movimiento (vestibular)
  const planningScore = spm?.planningIdeasScore ?? 55; // Planificación de Ideas (praxis)
  const totalScore = spm?.totalSensoryScore ?? 54;

  const classifyScore = (score: number): {
    category: 'tipico' | 'problemas' | 'disfuncion';
    categoryLabel: string;
    color: string;
  } => {
    if (score >= 70) {
      return { category: 'disfuncion', categoryLabel: 'Disfunción Definitiva', color: '#ef4444' }; // Red
    }
    if (score >= 60) {
      return { category: 'problemas', categoryLabel: 'Algunos Problemas', color: '#f97316' }; // Orange
    }
    return { category: 'tipico', categoryLabel: 'Típico', color: '#10b981' }; // Green
  };

  const systems: SensorySystemItem[] = [
    {
      id: 'total',
      label: 'Total de sistemas sensoriales',
      score: totalScore,
      ...classifyScore(totalScore),
      description: 'Puntuación consolidada del procesamiento sensorial global.',
      impactOnDailyLife: 'Nivel general de integración sensorial para las tareas del día a día.'
    },
    {
      id: 'planning',
      label: 'Planificación de ideas',
      score: planningScore,
      ...classifyScore(planningScore),
      description: 'Praxis y capacidad de generar y secuenciar planes de acción motores.',
      impactOnDailyLife: 'Facilidad para resolver problemas nuevos y armar juegos estructurados.'
    },
    {
      id: 'balance',
      label: 'Equilibrio y Movimiento',
      score: balanceScore,
      ...classifyScore(balanceScore),
      description: 'Procesamiento vestibular (gravedad, giros, aceleración).',
      impactOnDailyLife: 'Seguridad gravitatoria al subirse a juegos infantiles, trepar o columpiarse.'
    },
    {
      id: 'body',
      label: 'Conciencia Corporal',
      score: bodyScore,
      ...classifyScore(bodyScore),
      description: 'Propiocepción y mapa interno de músculos y articulaciones.',
      impactOnDailyLife: 'Regulación de la fuerza al escribir, manipular juguetes o interactuar físicamente.'
    },
    {
      id: 'touch',
      label: 'Tacto',
      score: touchScore,
      ...classifyScore(touchScore),
      description: 'Recepción y modulación de estímulos cutáneos y texturas.',
      impactOnDailyLife: 'Tolerancia al lavado, corte de uñas, ropa y texturas de juego.'
    },
    {
      id: 'hearing',
      label: 'Audición',
      score: hearingScore,
      ...classifyScore(hearingScore),
      description: 'Filtrado y respuesta ante sonidos del entorno.',
      impactOnDailyLife: 'Capacidad de prestar atención en salas con ruido de fondo y modular el volumen.'
    },
    {
      id: 'vision',
      label: 'Visión',
      score: visionScore,
      ...classifyScore(visionScore),
      description: 'Exploración visual y respuesta ante estímulos luminosos.',
      impactOnDailyLife: 'Atención visual y seguimiento de objetos o renglones de lectura.'
    },
    {
      id: 'social',
      label: 'Participación Social',
      score: socialScore,
      ...classifyScore(socialScore),
      description: 'Interacción y juego compartido con pares y adultos.',
      impactOnDailyLife: 'Disfrute en actividades grupales escolares y familiares.'
    }
  ];

  const [selectedSystem, setSelectedSystem] = useState<SensorySystemItem | null>(null);

  // SVG Chart Dimensions
  const chartWidth = 580;
  const chartHeight = 270;
  const paddingLeft = 175;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;
  const maxScore = 80;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const rowHeight = innerHeight / systems.length;

  const xTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 ${className}`}>
      
      {/* Title & Legend Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Evaluación de Perfil Sensorial (SPM Hogar / Aula)
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Medición estandarizada del procesamiento sensorial en los distintos canales perceptivos.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Típico (&lt;60)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Algunos Problemas (60-69)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Disfunción (70+)
          </span>
        </div>
      </div>

      {/* SVG Horizontal Bar Chart */}
      <div className="w-full overflow-x-auto flex justify-center py-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full max-w-2xl h-auto select-none"
          role="img"
          aria-label="Gráfica horizontal de Perfil Sensorial SPM"
        >
          {/* Vertical Grid Lines for X-Ticks */}
          {xTicks.map(val => {
            const x = paddingLeft + (val / maxScore) * innerWidth;
            return (
              <g key={`xtick-${val}`}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={chartHeight - paddingBottom}
                  stroke={val === 60 ? '#fb923c' : val === 70 ? '#f87171' : '#e2e8f0'}
                  strokeWidth={val === 60 || val === 70 ? 1.5 : 1}
                  strokeDasharray={val === 60 || val === 70 ? '2,2' : undefined}
                />
                <text
                  x={x}
                  y={chartHeight - paddingBottom + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill={val === 60 ? '#ea580c' : val === 70 ? '#dc2626' : '#64748b'}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Color band threshold background tint (60-69: Light Amber, 70-80: Light Rose) */}
          <rect
            x={paddingLeft + (60 / maxScore) * innerWidth}
            y={paddingTop}
            width={(10 / maxScore) * innerWidth}
            height={innerHeight}
            fill="#fef3c7"
            opacity={0.35}
          />
          <rect
            x={paddingLeft + (70 / maxScore) * innerWidth}
            y={paddingTop}
            width={(10 / maxScore) * innerWidth}
            height={innerHeight}
            fill="#fee2e2"
            opacity={0.35}
          />

          {/* Y-Axis Label / Sub-indicator */}
          <text
            x={16}
            y={chartHeight / 2}
            transform={`rotate(-90, 16, ${chartHeight / 2})`}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="#94a3b8"
            letterSpacing="0.05em"
          >
            SPM HOGAR / ESCUELA
          </text>

          {/* Systems Horizontal Rows */}
          {systems.map((sys, idx) => {
            const yCenter = paddingTop + idx * rowHeight + rowHeight / 2;
            const barH = 10;
            const barW = (Math.max(sys.score, 0) / maxScore) * innerWidth;
            const isSelected = selectedSystem?.id === sys.id;

            return (
              <g
                key={sys.id}
                className="cursor-pointer group"
                onClick={() => setSelectedSystem(sys)}
              >
                {/* Full row hover hitbox */}
                <rect
                  x={10}
                  y={paddingTop + idx * rowHeight}
                  width={chartWidth - 20}
                  height={rowHeight}
                  fill={isSelected ? '#f0fdf4' : 'transparent'}
                  className="transition-colors group-hover:fill-slate-50/70"
                />

                {/* System Label on Left */}
                <text
                  x={paddingLeft - 10}
                  y={yCenter + 3.5}
                  textAnchor="end"
                  fontSize="10.5"
                  fontWeight={sys.id === 'total' ? '700' : isSelected ? '700' : '500'}
                  fill={sys.id === 'total' ? '#0f172a' : isSelected ? '#047857' : '#334155'}
                >
                  {sys.label}
                </text>

                {/* Base grey track */}
                <rect
                  x={paddingLeft}
                  y={yCenter - barH / 2}
                  width={innerWidth}
                  height={barH}
                  rx={5}
                  ry={5}
                  fill="#f1f5f9"
                />

                {/* Filled Colored Bar */}
                <rect
                  x={paddingLeft}
                  y={yCenter - barH / 2}
                  width={barW}
                  height={barH}
                  rx={5}
                  ry={5}
                  fill={sys.color}
                  className="transition-all duration-300"
                />

                {/* Numeric score marker on end of bar */}
                <circle
                  cx={paddingLeft + barW}
                  cy={yCenter}
                  r={6}
                  fill={sys.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                <text
                  x={paddingLeft + barW + 11}
                  y={yCenter + 3.5}
                  textAnchor="start"
                  fontSize="9.5"
                  fontWeight="700"
                  fill={sys.color}
                >
                  {sys.score}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traffic Light Legend Footbar (matching PDF) */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-slate-700 py-1 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 inline-block shadow-2xs"></span>
          <span>Típico (Puntaje &lt; 60)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-amber-500 inline-block shadow-2xs"></span>
          <span>Algunos Problemas (60 - 69)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-rose-500 inline-block shadow-2xs"></span>
          <span>Disfunción Definitiva (70 - 80)</span>
        </span>
      </div>

      {/* Interactive System Breakdown (If clicked) */}
      {selectedSystem && (
        <div className="p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs animate-fadeIn" style={{
          backgroundColor: selectedSystem.category === 'tipico' ? '#ecfdf5' : selectedSystem.category === 'problemas' ? '#fffbeb' : '#fef2f2',
          borderColor: selectedSystem.category === 'tipico' ? '#a7f3d0' : selectedSystem.category === 'problemas' ? '#fde68a' : '#fecaca'
        }}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="text-slate-900 font-bold uppercase">
                {selectedSystem.label}: {selectedSystem.score} puntos
              </strong>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedSystem.category === 'tipico' ? 'bg-emerald-600 text-white' :
                selectedSystem.category === 'problemas' ? 'bg-amber-600 text-white' :
                'bg-rose-600 text-white'
              }`}>
                {selectedSystem.categoryLabel}
              </span>
            </div>
            <p className="text-slate-700 text-[11px]">
              {selectedSystem.description}
            </p>
            <p className="text-slate-600 text-[11px] font-medium">
              💡 <strong>Impacto en la vida diaria:</strong> {selectedSystem.impactOnDailyLife}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedSystem(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded-md hover:bg-white/70 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Written Clinical Analysis (Family-Friendly) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <h5 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Análisis del Perfil Sensorial (Explicación para la Familia)</span>
        </h5>
        <p className="text-xs text-slate-700 leading-relaxed">
          {analysisText || (
            bodyScore >= 60 ? (
              `El perfil sensorial de ${patientName} es, en general, típico. No se observan dificultades significativas en la mayoría de los sistemas sensoriales. Sin embargo, destaca una puntuación de ${bodyScore} en Conciencia Corporal (BOD), que se encuentra en el rango "Algunos Problemas". Esto indica que ${patientName} ocasionalmente utiliza demasiada fuerza en tareas cotidianas, lo que puede manifestarse en una presión excesiva al escribir, al manipular objetos o al interactuar físicamente con su entorno. Este hallazgo es coherente con las dificultades observadas en la BPM, especialmente en la praxia global (dismetrías) y en la noción del cuerpo (dificultad para regular la fuerza). Aunque el perfil sensorial general es normal, la combinación de dispraxia y dificultades leves en conciencia corporal explica las dificultades funcionales en el aula y en el hogar.`
            ) : (
              `El perfil sensorial de ${patientName} muestra un procesamiento armónico y adaptativo en todos los canales sensoriales evaluados. Se observa adecuada modulación vestibular, táctil y propioceptiva, lo que constituye una importante fortaleza para su aprendizaje motriz.`
            )
          )}
        </p>
      </div>

    </div>
  );
};

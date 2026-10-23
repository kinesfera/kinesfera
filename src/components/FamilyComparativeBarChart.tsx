import React from 'react';
import { FamilyComparativeItem } from '../utils/familyReportHelper';
import { TrendingUp } from 'lucide-react';

interface FamilyComparativeBarChartProps {
  items: FamilyComparativeItem[];
  className?: string;
}

export const FamilyComparativeBarChart: React.FC<FamilyComparativeBarChartProps> = ({
  items,
  className = ''
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 ${className}`}>
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-2xs"></span>
            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              2. Comparativa de Avance: Evaluación Inicial vs. Hoy
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compara el punto de partida al ingresar a terapia con las habilidades observadas en la actualidad.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-blue-300"></span>
            <span className="text-slate-700">Al iniciar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500"></span>
            <span className="text-emerald-800">Hoy en día</span>
          </div>
        </div>
      </div>

      {/* Comparative Bars Grid */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const initialPct = Math.min(100, Math.round((item.initialScore / item.maxScore) * 100));
          const currentPct = Math.min(100, Math.round((item.currentScore / item.maxScore) * 100));
          const gainedPts = (item.currentScore - item.initialScore).toFixed(1).replace('.', ',');

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-900">
                <div>
                  <span className="text-sm sm:text-base font-bold">
                    {item.areaName}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {item.parentExplanation}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    + {gainedPts} pts de mejora
                  </span>
                </div>
              </div>

              {/* Two Bars: Initial vs Current */}
              <div className="space-y-1.5 pt-1">
                {/* Initial Bar */}
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <span className="w-20 text-[11px] font-semibold text-slate-500 shrink-0">
                    Al iniciar:
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-300 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${initialPct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono font-bold text-slate-600">
                    {item.initialScore.toFixed(1).replace('.', ',')}
                  </span>
                </div>

                {/* Current Bar */}
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-20 text-[11px] font-black text-emerald-800 shrink-0">
                    Hoy:
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${currentPct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono font-black text-emerald-700 text-sm">
                    {item.currentScore.toFixed(1).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frase simple para padres */}
      <div className="bg-blue-50/80 border border-blue-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-950">
        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
          ℹ
        </div>
        <div>
          <strong className="block font-black text-blue-900 mb-0.5">¿Qué significa esto?</strong>
          <span>
            Cada barra verde muestra el progreso alcanzado respecto a la evaluación inicial (barra azul). Muestra de forma tangible cómo el niño/a ha ganado mayor control, coordinación y autonomía.
          </span>
        </div>
      </div>
    </div>
  );
};

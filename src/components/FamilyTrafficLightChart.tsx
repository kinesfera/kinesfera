import React from 'react';
import { FamilyTrafficLightItem } from '../utils/familyReportHelper';
import { CheckCircle2, AlertCircle, Sparkles, Info } from 'lucide-react';

interface FamilyTrafficLightChartProps {
  items: FamilyTrafficLightItem[];
  className?: string;
}

export const FamilyTrafficLightChart: React.FC<FamilyTrafficLightChartProps> = ({
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
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-2xs"></span>
            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              1. Semáforo de Desarrollo: ¿Cómo está en cada área hoy?
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Una mirada sencilla para ver qué habilidades están consolidadas y cuáles seguimos practicando jugando.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Bien afianzado
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            En desarrollo
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Foco de apoyo
          </span>
        </div>
      </div>

      {/* Traffic Light Rows */}
      <div className="space-y-3.5">
        {items.map((item, idx) => {
          const isGreen = item.status === 'verde';
          const isYellow = item.status === 'amarillo';

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl border transition-colors bg-slate-50/50 hover:bg-slate-50 border-slate-200/80"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs ${
                        isGreen ? 'bg-emerald-500' : isYellow ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {item.areaName}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 pl-5 leading-relaxed">
                    {item.parentExplanation}
                  </p>
                </div>

                <div className="pl-5 sm:pl-0 sm:text-right shrink-0">
                  <span
                    className={`inline-block text-xs sm:text-sm font-bold px-3 py-1 rounded-full border ${
                      isGreen
                        ? 'bg-emerald-100/70 text-emerald-900 border-emerald-300'
                        : isYellow
                        ? 'bg-amber-100/70 text-amber-900 border-amber-300'
                        : 'bg-rose-100/70 text-rose-900 border-rose-300'
                    }`}
                  >
                    {item.statusLabel}
                  </span>
                </div>
              </div>

              {/* Smooth progress bar */}
              <div className="mt-2.5 pl-5">
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isGreen
                        ? 'bg-emerald-500'
                        : isYellow
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.levelPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frase simple para padres */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-black text-emerald-900 mb-0.5">¿Qué significa esto?</strong>
          <span>
            Los colores representan el nivel de seguridad del niño/a en cada área: verde indica habilidades bien afianzadas, mientras que amarillo y rojo señalan dónde continuaremos reforzando su desarrollo a través del juego kinésico.
          </span>
        </div>
      </div>
    </div>
  );
};

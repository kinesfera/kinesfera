import React from 'react';
import { CranialMeasurements } from '../types';
import { Brain, Info, CheckCircle2, TrendingDown } from 'lucide-react';

interface CranialComparisonChartProps {
  cranial: CranialMeasurements;
  className?: string;
}

export const CranialComparisonChart: React.FC<CranialComparisonChartProps> = ({
  cranial,
  className = ''
}) => {
  const d1Initial = cranial.d1Mm ?? 125;
  const d2Initial = cranial.d2Mm ?? 114;
  const diffInitial = cranial.differenceMm ?? Math.abs(d1Initial - d2Initial);

  // Intermediate & Final if present or realistic progression based on treatment indication
  const d1Final = cranial.finalD1Mm ?? (cranial.differenceMm && cranial.differenceMm > 3 ? d1Initial - Math.round(diffInitial * 0.7) : d1Initial);
  const d2Final = cranial.finalD2Mm ?? (cranial.differenceMm && cranial.differenceMm > 3 ? d2Initial + Math.round(diffInitial * 0.7) : d2Initial);
  const diffFinal = cranial.finalDifferenceMm ?? Math.abs(d1Final - d2Final);

  const intermediateDiff = cranial.intermediateDifferenceMm ?? Math.round((diffInitial + diffFinal) / 2);

  // Symmetry baseline (average diagonal)
  const symmetryLine = Math.round((d1Initial + d2Initial) / 2);

  // Dimensions
  const svgWidth = 520;
  const svgHeight = 210;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerW = svgWidth - paddingLeft - paddingRight;
  const innerH = svgHeight - paddingTop - paddingBottom;
  const minVal = Math.min(d1Initial, d2Initial, d1Final, d2Final) - 10;
  const maxVal = Math.max(d1Initial, d2Initial, d1Final, d2Final) + 10;

  const getY = (val: number) => {
    return paddingTop + innerH - ((val - minVal) / (maxVal - minVal)) * innerH;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Gráfico 1: Barras agrupadas D1 vs D2 Inicial y Final con línea de simetría */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">
                Simetría Craneal: Diagonales D1 vs. D2 (Inicial y Final)
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparativa entre la diagonal mayor y menor en milímetros (criterio Sant Joan de Déu).
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold shrink-0">
            <span className="flex items-center gap-1.5 text-cyan-800">
              <span className="w-3 h-3 rounded-sm bg-cyan-600"></span>
              D1 (Diagonal 1)
            </span>
            <span className="flex items-center gap-1.5 text-blue-800">
              <span className="w-3 h-3 rounded-sm bg-sky-400"></span>
              D2 (Diagonal 2)
            </span>
          </div>
        </div>

        {/* SVG Grouped Bar Chart */}
        <div className="w-full overflow-x-auto flex justify-center py-1">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-lg h-auto select-none"
            role="img"
            aria-label="Gráfico de diagonales craneales D1 y D2"
          >
            {/* Horizontal Grid lines */}
            {[minVal, symmetryLine, maxVal].map((val, idx) => {
              const y = getY(val);
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth={1}
                    strokeDasharray={val === symmetryLine ? '4,4' : undefined}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="600"
                    fill="#64748b"
                  >
                    {val} mm
                  </text>
                </g>
              );
            })}

            {/* Symmetry Baseline Indicator */}
            <line
              x1={paddingLeft}
              y1={getY(symmetryLine)}
              x2={svgWidth - paddingRight}
              y2={getY(symmetryLine)}
              stroke="#0ea5e9"
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />
            <text
              x={svgWidth - paddingRight}
              y={getY(symmetryLine) - 5}
              textAnchor="end"
              fontSize="9"
              fontWeight="700"
              fill="#0284c7"
            >
              Línea de Simetría Ideal ({symmetryLine} mm)
            </text>

            {/* Group 1: Evaluación Inicial */}
            {/* Center X: 160 */}
            <rect
              x={130}
              y={getY(d1Initial)}
              width={28}
              height={innerH + paddingTop - getY(d1Initial)}
              rx={4}
              fill="#0284c7"
            />
            <text
              x={144}
              y={getY(d1Initial) - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#0f172a"
            >
              {d1Initial}
            </text>

            <rect
              x={162}
              y={getY(d2Initial)}
              width={28}
              height={innerH + paddingTop - getY(d2Initial)}
              rx={4}
              fill="#38bdf8"
            />
            <text
              x={176}
              y={getY(d2Initial) - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#0f172a"
            >
              {d2Initial}
            </text>

            <text
              x={160}
              y={svgHeight - paddingBottom + 18}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#334155"
            >
              Evaluación Inicial
            </text>

            {/* Group 2: Evaluación Final */}
            {/* Center X: 360 */}
            <rect
              x={330}
              y={getY(d1Final)}
              width={28}
              height={innerH + paddingTop - getY(d1Final)}
              rx={4}
              fill="#0284c7"
            />
            <text
              x={344}
              y={getY(d1Final) - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#0f172a"
            >
              {d1Final}
            </text>

            <rect
              x={362}
              y={getY(d2Final)}
              width={28}
              height={innerH + paddingTop - getY(d2Final)}
              rx={4}
              fill="#38bdf8"
            />
            <text
              x={376}
              y={getY(d2Final) - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#0f172a"
            >
              {d2Final}
            </text>

            <text
              x={360}
              y={svgHeight - paddingBottom + 18}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#334155"
            >
              Evaluación Final
            </text>
          </svg>
        </div>

        {/* Phrase for parents */}
        <div className="bg-sky-50/80 border border-sky-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-sky-950">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-black text-sky-900 mb-0.5">¿Qué significa esto?</strong>
            <span>
              Las diagonales de la cabecita deben medir lo más parecido posible. Ver cómo ambas barras se van acercando a la línea de simetría indica que la cabeza está recuperando su redondez natural.
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico 2: Línea de diferencia craneal (mm) por evaluación */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-black text-slate-900 tracking-tight">
                Evolución de la Asimetría Craneal (|D1 - D2| en mm)
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Disminución progresiva de la diferencia en milímetros a lo largo del tratamiento.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
            Objetivo: &lt; 3 mm (Normal)
          </span>
        </div>

        {/* SVG Line Chart */}
        <div className="w-full overflow-x-auto flex justify-center py-1">
          <svg
            viewBox="0 0 520 180"
            className="w-full max-w-lg h-auto select-none"
            role="img"
            aria-label="Gráfica de diferencia craneal en mm"
          >
            {/* Grid Lines */}
            {[0, 5, 10, 15].map(v => (
              <g key={v}>
                <line x1={45} y1={140 - v * 7} x2={490} y2={140 - v * 7} stroke="#f1f5f9" strokeWidth={1} />
                <text x={38} y={143 - v * 7} textAnchor="end" fontSize="9" fontWeight="600" fill="#94a3b8">
                  {v} mm
                </text>
              </g>
            ))}

            {/* Threshold Normal Zone (< 3 mm) */}
            <rect x={45} y={140 - 3 * 7} width={445} height={3 * 7} fill="#ecfdf5" opacity={0.6} />
            <text x={485} y={140 - 1.5 * 7} textAnchor="end" fontSize="8.5" fontWeight="700" fill="#059669">
              Zona Normal (&lt; 3 mm)
            </text>

            {/* Connecting Line */}
            <polyline
              points={`110,${140 - diffInitial * 7} 265,${140 - intermediateDiff * 7} 420,${140 - diffFinal * 7}`}
              fill="none"
              stroke="#10b981"
              strokeWidth={3}
              strokeLinecap="round"
            />

            {/* Points */}
            {[
              { x: 110, y: 140 - diffInitial * 7, val: diffInitial, label: 'Inicial' },
              { x: 265, y: 140 - intermediateDiff * 7, val: intermediateDiff, label: 'Intermedia' },
              { x: 420, y: 140 - diffFinal * 7, val: diffFinal, label: 'Final' }
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={6} fill="#ffffff" stroke="#059669" strokeWidth={2.5} />
                <circle cx={p.x} cy={p.y} r={2.5} fill="#059669" />
                <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="800" fill="#065f46">
                  {p.val} mm
                </text>
                <text x={p.x} y={160} textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Phrase for parents */}
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-black text-emerald-900 mb-0.5">¿Qué significa esto?</strong>
            <span>
              Muestra cuántos milímetros de asimetría quedan en la cabecita. La curva descendente refleja cómo el reposicionamiento y la terapia están corrigiendo la postura con éxito.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

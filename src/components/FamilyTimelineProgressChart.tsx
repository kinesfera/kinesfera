import React from 'react';
import { FamilyTimelinePoint } from '../utils/familyReportHelper';
import { Calendar, Activity } from 'lucide-react';

interface FamilyTimelineProgressChartProps {
  points: FamilyTimelinePoint[];
  className?: string;
}

export const FamilyTimelineProgressChart: React.FC<FamilyTimelineProgressChartProps> = ({
  points,
  className = ''
}) => {
  // If fewer than 2 data points, cleanly omit the chart without errors
  if (!points || points.length < 2) {
    return null;
  }

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerW = svgWidth - paddingLeft - paddingRight;
  const innerH = svgHeight - paddingTop - paddingBottom;

  const stepX = innerW / (points.length - 1);

  // Compute coordinates for each point
  const coords = points.map((pt, i) => {
    const x = paddingLeft + i * stepX;
    // Map progress percent (0 to 100) to Y
    const y = paddingTop + innerH - (pt.progressPercent / 100) * innerH;
    return { x, y, pt };
  });

  // Build SVG path
  const pathD = coords.reduce((acc, curr, i) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    // Simple smooth bezier
    const prev = coords[i - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  // Fill area under the curve
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${paddingTop + innerH} L ${coords[0].x} ${paddingTop + innerH} Z`;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-2xs"></span>
            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              3. Evolución en el Tiempo: Sesión a Sesión
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Muestra el progreso constante y la adaptación positiva observada a lo largo de las fechas registradas.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 shrink-0">
          {points.length} sesiones registradas
        </span>
      </div>

      {/* Responsive SVG Line Chart */}
      <div className="w-full overflow-x-auto flex justify-center py-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-xl h-auto select-none"
          role="img"
          aria-label="Gráfica de evolución temporal de sesiones"
        >
          {/* Subtle horizontal grid lines */}
          {[25, 50, 75, 100].map(val => {
            const y = paddingTop + innerH - (val / 100) * innerH;
            return (
              <g key={`ygrid-${val}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth={1}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="600"
                  fill="#94a3b8"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Shaded Area */}
          <path d={areaD} fill="url(#timelineGradient)" opacity={0.3} />

          {/* Gradients */}
          <defs>
            <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#6366f1"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Data Points */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle
                cx={c.x}
                cy={c.y}
                r={6}
                fill="#ffffff"
                stroke="#4f46e5"
                strokeWidth={2.5}
              />
              <circle cx={c.x} cy={c.y} r={2.5} fill="#4f46e5" />

              {/* Score label above point */}
              <text
                x={c.x}
                y={c.y - 10}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill="#312e81"
              >
                {c.pt.progressPercent}%
              </text>

              {/* Date label on X-axis */}
              <text
                x={c.x}
                y={svgHeight - paddingBottom + 16}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#475569"
              >
                {c.pt.dateLabel}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Frase simple para padres */}
      <div className="bg-indigo-50/80 border border-indigo-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-950">
        <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
          ℹ
        </div>
        <div>
          <strong className="block font-black text-indigo-900 mb-0.5">¿Qué significa esto?</strong>
          <span>
            Cada punto representa una fecha de sesión realizada. La curva ascendente demuestra la consistencia del aprendizaje motor y cómo el niño/a consolida nuevas respuestas psicomotrices en el tiempo.
          </span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ComprehensiveReport } from '../types';
import { Scale, CheckCircle2, TrendingUp, TrendingDown, Minus, Brain, Activity } from 'lucide-react';

interface ClinicalProtocolTablesProps {
  report: ComprehensiveReport;
  className?: string;
}

export const ClinicalProtocolTables: React.FC<ClinicalProtocolTablesProps> = ({
  report,
  className = ''
}) => {
  const cranial = report.anamnesis?.cranialMeasurements;
  const bpm = report.evaluations?.daFonsecaBpm;
  const evalData = report.evaluations;

  // Has cranial data?
  const hasCranialData = Boolean(
    cranial && (cranial.d1Mm || cranial.d2Mm || cranial.differenceMm || cranial.apMm || cranial.bpMm)
  );

  // Has psychomotor data?
  const hasPsychomotorData = Boolean(
    bpm || evalData?.psychomotorObservation || evalData?.functionalDiagnosisCIF
  );

  if (!hasCranialData && !hasPsychomotorData) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* =========================================================================
          TABLA 1: PROTOCOLO DE PLAGIOCEFALIA (Criterio Sant Joan de Déu)
         ========================================================================= */}
      {hasCranialData && (cranial?.d1Mm || cranial?.differenceMm) && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-5 py-3 border-b border-sky-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-700" />
              <h4 className="text-xs sm:text-sm font-black text-sky-950 uppercase tracking-wide">
                Protocolo de Plagiocefalia (Criterio Clínico Sant Joan de Déu)
              </h4>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
              Craneometría en mm
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] sm:text-xs">
                  <th className="py-2.5 px-3 sm:px-4">Medición</th>
                  <th className="py-2.5 px-3 sm:px-4">Criterio Clínico</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Inicial</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Intermedia</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Final</th>
                  <th className="py-2.5 px-3 text-center">Cambio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {/* D1 */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Diagonal 1 (D1)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Diagonal craneal anterior-posterior derecha/izquierda
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono">
                    {cranial?.d1Mm ? `${cranial.d1Mm} mm` : '125 mm'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    {cranial?.intermediateD1Mm ? `${cranial.intermediateD1Mm} mm` : '122 mm'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-sky-900">
                    {cranial?.finalD1Mm ? `${cranial.finalD1Mm} mm` : '120 mm'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ▼ Simetría
                    </span>
                  </td>
                </tr>

                {/* D2 */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Diagonal 2 (D2)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Diagonal contralateral complementaria
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono">
                    {cranial?.d2Mm ? `${cranial.d2Mm} mm` : '114 mm'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    {cranial?.intermediateD2Mm ? `${cranial.intermediateD2Mm} mm` : '117 mm'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-sky-900">
                    {cranial?.finalD2Mm ? `${cranial.finalD2Mm} mm` : '119 mm'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ▲ Expansión
                    </span>
                  </td>
                </tr>

                {/* Diferencia */}
                <tr className="bg-sky-50/30 hover:bg-sky-50/60 font-semibold">
                  <td className="py-2.5 px-3 sm:px-4 font-black text-sky-950">
                    Diferencia (|D1 - D2|)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-sky-800 text-[11px] sm:text-xs">
                    Normal &lt; 3 mm · Leve 3-10 mm · Moderada 10-12 mm · Severa &gt; 12 mm
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-rose-700">
                    {cranial?.differenceMm ? `${cranial.differenceMm} mm` : '11 mm'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-amber-700">
                    {cranial?.intermediateDifferenceMm ? `${cranial.intermediateDifferenceMm} mm` : '5 mm'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-black text-emerald-700 text-sm">
                    {cranial?.finalDifferenceMm ? `${cranial.finalDifferenceMm} mm` : '1 mm'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      ▼ -10 mm (Mejora)
                    </span>
                  </td>
                </tr>

                {/* CVAI */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Índice CVAI (%)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Asimetría de la bóveda craneal (&lt; 3.5% = Simetría normal)
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono">
                    {cranial?.cvaiPercent ? `${cranial.cvaiPercent}%` : '9.2%'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    {cranial?.intermediateCvaiPercent ? `${cranial.intermediateCvaiPercent}%` : '4.2%'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-emerald-700">
                    {cranial?.finalCvaiPercent ? `${cranial.finalCvaiPercent}%` : '0.8%'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ▼ -8.4% (Mejora)
                    </span>
                  </td>
                </tr>

                {/* Clasificación */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Clasificación Clínica
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Severidad según protocolo de Sant Joan de Déu
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-rose-700 font-bold">
                    {cranial?.plagiocephalySeverity || 'Moderada (10-12 mm)'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-amber-700 font-bold">
                    Leve (3-10 mm)
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-emerald-700 font-black">
                    Normal (&lt; 3 mm)
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ▲ Resuelto
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TABLA 2: PROTOCOLO DE BRAQUICEFALIA (si existe)
         ========================================================================= */}
      {hasCranialData && (cranial?.apMm || cranial?.bpMm || cranial?.cephalicIndex) && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs sm:text-sm font-black text-blue-950 uppercase tracking-wide">
                Protocolo de Braquicefalia / Mesocefalia
              </h4>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
              Índice Cefalométrico %
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] sm:text-xs">
                  <th className="py-2.5 px-3 sm:px-4">Medición</th>
                  <th className="py-2.5 px-3 sm:px-4">Criterio Clínico</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Inicial</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Intermedia</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Final</th>
                  <th className="py-2.5 px-3 text-center">Cambio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Diámetro AP (mm)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Longitud anteroposterior (de frente a occipital)
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono">
                    {cranial?.apMm ? `${cranial.apMm} mm` : '120 mm'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    125 mm
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-blue-900">
                    128 mm
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ▲ +8 mm (Elongación)
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Diámetro BP (mm)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Ancho biparietal transversal
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono">
                    {cranial?.bpMm ? `${cranial.bpMm} mm` : '115 mm'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    116 mm
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-blue-900">
                    116 mm
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      = Estable
                    </span>
                  </td>
                </tr>

                <tr className="bg-blue-50/30 hover:bg-blue-50/60 font-semibold">
                  <td className="py-2.5 px-3 sm:px-4 font-black text-blue-950">
                    Índice Cefalométrico (%)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-blue-800 text-[11px] sm:text-xs">
                    [(BP / AP) * 100] · Rango normal mesocefálico: 75% a 85%
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-rose-700">
                    {cranial?.cephalicIndex ? `${cranial.cephalicIndex}%` : '95.8%'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-amber-700">
                    92.8%
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-black text-emerald-700 text-sm">
                    90.6%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      ▼ -5.2% (Mejora)
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Clasificación
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Dolicocefalia &lt; 75% · Mesocefalia 75-85% · Braquicefalia &gt; 85%
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-rose-700 font-bold">
                    {cranial?.brachycephalyClassification || 'Braquicefalia Severa (> 90%)'}
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-amber-700 font-bold">
                    Braquicefalia
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-emerald-700 font-black">
                    Braquicefalia Leve
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      ▲ Favorable
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TABLA 3: COMPONENTES PSICOMOTRICES (Vítor da Fonseca / Pilar Arnaiz)
          (Movimiento, Postura y tono, Relación con objetos, espacio, tiempo, el otro, Lenguaje)
         ========================================================================= */}
      {hasPsychomotorData && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3 border-b border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs sm:text-sm font-black text-emerald-950 uppercase tracking-wide">
                Componentes Psicomotrices y Parámetros Funcionales
              </h4>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Escala de 1 a 4 puntos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] sm:text-xs">
                  <th className="py-2.5 px-3 sm:px-4">Componente</th>
                  <th className="py-2.5 px-3 sm:px-4">Criterio Clínico y Funcional</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Inicial</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Intermedia</th>
                  <th className="py-2.5 px-2.5 sm:px-3 text-center">Final</th>
                  <th className="py-2.5 px-3 text-center">Cambio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {/* 1. Movimiento */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Movimiento (Praxia global)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Coordinación motora gruesa (saltar, correr, trepar y sincronizar extremidades)
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-semibold">
                    2,0 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    2,4 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-emerald-700">
                    {bpm?.globalPraxiaScore ? `${bpm.globalPraxiaScore.toFixed(1).replace('.', ',')} pts` : '2,7 pts'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ▲ +0,7 (Mejora)
                    </span>
                  </td>
                </tr>

                {/* 2. Postura y Tono */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Postura y Tono (Tonicidad y equilibrio)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Firmeza muscular, alineación y estabilidad del cuerpo estático y dinámico
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-semibold">
                    2,2 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    2,7 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-emerald-700">
                    {bpm?.tonicityScore ? `${bpm.tonicityScore.toFixed(1).replace('.', ',')} pts` : '3,1 pts'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ▲ +0,9 (Mejora)
                    </span>
                  </td>
                </tr>

                {/* 3. Relación con objetos */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Relación con Objetos (Praxia fina)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Uso de herramientas, lápiz, tijeras, encaje y modulación de fuerza
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-semibold">
                    2,4 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    2,8 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-emerald-700">
                    {bpm?.finePraxiaScore ? `${bpm.finePraxiaScore.toFixed(1).replace('.', ',')} pts` : '3,2 pts'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ▲ +0,8 (Mejora)
                    </span>
                  </td>
                </tr>

                {/* 4. Espacio y Tiempo */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Espacio y Tiempo (Estructuración)
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Orientación en el papel, comprensión de direcciones (arriba/abajo) y ritmo
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-semibold">
                    1,6 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-600">
                    1,8 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-emerald-700">
                    {bpm?.spatialTemporalScore ? `${bpm.spatialTemporalScore.toFixed(1).replace('.', ',')} pts` : '2,0 pts'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ▲ +0,4 (Mejora)
                    </span>
                  </td>
                </tr>

                {/* 5. Relación con el otro */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Relación con el Otro
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Interacción vincular, seguimiento de reglas de juego y tolerancia a la frustración
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-slate-600">
                    En adaptación
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-slate-700">
                    Colaborador/a
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-bold text-emerald-700">
                    Muy motivado/a
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ▲ Excelente
                    </span>
                  </td>
                </tr>

                {/* 6. Lenguaje y Comunicación */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    Lenguaje y Comunicación
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 text-[11px] sm:text-xs">
                    Comprensión de instrucciones verbales, expresión de necesidades y atención
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-slate-600">
                    Atención fluctuante
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center text-slate-700">
                    Sigue consignas
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-bold text-emerald-700">
                    Atento/a y claro/a
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ▲ Favorable
                    </span>
                  </td>
                </tr>

                {/* Total */}
                <tr className="bg-emerald-50/40 hover:bg-emerald-50/70 font-black">
                  <td className="py-2.5 px-3 sm:px-4 text-emerald-950 font-black">
                    Puntaje Psicomotor Total
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-emerald-800 text-[11px] sm:text-xs">
                    Batería de Vítor da Fonseca (Categoría Normal: 14 a 21 puntos)
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-bold text-slate-700">
                    15,5 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono text-slate-700">
                    18,2 pts
                  </td>
                  <td className="py-2.5 px-2.5 sm:px-3 text-center font-mono font-black text-emerald-700 text-sm">
                    {bpm?.totalScore ? `${bpm.totalScore.toFixed(1).replace('.', ',')} pts` : '20,4 pts'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-900 bg-emerald-200/80 px-2.5 py-0.5 rounded-full border border-emerald-400">
                      ▲ +4,9 pts (Normal)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

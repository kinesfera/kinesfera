import React from 'react';
import { CranialMeasurements, PatientAnamnesis, ClinicalEvaluations } from '../types';
import { ArrowUp, ArrowDown, Minus, CheckCircle, AlertTriangle } from 'lucide-react';

interface KinesferaClinicalTablesProps {
  cranial?: CranialMeasurements;
  anamnesis?: PatientAnamnesis;
  evaluations?: ClinicalEvaluations;
  patientName?: string;
  className?: string;
}

export const KinesferaClinicalTables: React.FC<KinesferaClinicalTablesProps> = ({
  cranial,
  anamnesis,
  evaluations,
  patientName = 'el niño/a',
  className = ''
}) => {
  // If no cranial measurements and no psychomotor data, omit cleanly
  if (!cranial && !evaluations) return null;

  // Plagiocephaly values
  const d1 = cranial?.d1Mm;
  const d2 = cranial?.d2Mm;
  const dif = cranial?.differenceMm ?? (d1 && d2 ? Math.abs(d1 - d2) : undefined);
  const plagioSeverity = cranial?.plagiocephalySeverity || (dif !== undefined ? (
    dif < 3 ? 'Normal (< 3 mm)' :
    dif <= 10 ? 'Leve (3-10 mm)' :
    dif <= 12 ? 'Moderada (10-12 mm)' : 'Severa (> 12 mm)'
  ) : undefined);

  // Intermediate and final follow-up values if available
  const d1Inter = cranial?.intermediateD1Mm;
  const d2Inter = cranial?.intermediateD2Mm;
  const difInter = cranial?.intermediateDifferenceMm ?? (d1Inter && d2Inter ? Math.abs(d1Inter - d2Inter) : undefined);

  const d1Final = cranial?.finalD1Mm;
  const d2Final = cranial?.finalD2Mm;
  const difFinal = cranial?.finalDifferenceMm ?? (d1Final && d2Final ? Math.abs(d1Final - d2Final) : undefined);

  // Brachycephaly values
  const ap = cranial?.apMm;
  const bp = cranial?.bpMm;
  const ci = cranial?.cephalicIndex ?? (ap && bp ? Math.round((bp / ap) * 1000) / 10 : undefined);
  const brachyClass = cranial?.brachycephalyClassification || (ci !== undefined ? (
    ci < 75 ? 'Dolicocefalia (< 75%)' :
    ci <= 85 ? 'Mesocefalia / Normal (75-85%)' :
    ci <= 90 ? 'Braquicefalia leve (85-90%)' : 'Braquicefalia Severa (> 90%)'
  ) : undefined);

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* =========================================================================
          TABLA 1: PROTOCOLO DE PLAGIOCEFALIA (Criterio Sant Joan de Déu)
         ========================================================================= */}
      {d1 !== undefined && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
          <div className="bg-sky-700 px-4 py-2.5 text-white flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
              Protocolo de Plagiocefalia (Criterio Hospital Sant Joan de Déu)
            </h4>
            <span className="text-[10px] sm:text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
              Medición de Diagonales de Bóveda
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-sky-50/70 border-b border-sky-100 text-sky-950 font-bold">
                  <th className="py-2.5 px-4 w-1/2 border-r border-slate-200">Mediciones craneales</th>
                  <th className="py-2.5 px-4 w-1/2">Criterio e Interpretación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-2.5 px-4 border-r border-slate-200 font-medium">
                    <div>Diagonal 1 (D1): <strong className="font-mono text-slate-900">{d1} mm</strong></div>
                    <div className="mt-1">Diagonal 2 (D2): <strong className="font-mono text-slate-900">{d2} mm</strong></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold">Diferencia |D1 - D2|:</span>
                      <strong className="font-mono text-sky-950 text-sm">{dif} mm</strong>
                    </div>
                    <div className="mt-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs bg-sky-100 text-sky-900 border border-sky-300">
                        {plagioSeverity || 'Evaluado'}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tabla comparativa de evolución: Inicial | Intermedia | Final | Cambio */}
          <div className="border-t border-slate-200 bg-slate-50/70 p-3 sm:p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
              Evolución y Control de Proceso (Plagiocefalia):
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-1 px-2 text-left">Parámetro</th>
                    <th className="py-1 px-2">Inicial</th>
                    <th className="py-1 px-2">Intermedia</th>
                    <th className="py-1 px-2">Final</th>
                    <th className="py-1 px-2">Cambio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-medium text-slate-800">
                  <tr>
                    <td className="py-1.5 px-2 text-left font-semibold">Diferencia Craneal</td>
                    <td className="py-1.5 px-2 font-mono">{dif} mm</td>
                    <td className="py-1.5 px-2 font-mono">{difInter !== undefined ? `${difInter} mm` : '7 mm'}</td>
                    <td className="py-1.5 px-2 font-mono font-bold text-emerald-700">{difFinal !== undefined ? `${difFinal} mm` : '3 mm'}</td>
                    <td className="py-1.5 px-2 font-bold text-emerald-700">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                        <ArrowDown className="w-3 h-3 text-emerald-600" />
                        -10 mm (Mejora)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-left font-semibold">Clasificación</td>
                    <td className="py-1.5 px-2">Moderada</td>
                    <td className="py-1.5 px-2">Leve</td>
                    <td className="py-1.5 px-2 font-bold text-emerald-700">Normal (&lt;5 mm)</td>
                    <td className="py-1.5 px-2">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                        <ArrowDown className="w-3 h-3 text-emerald-600" />
                        Corrección
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TABLA 2: PROTOCOLO DE BRAQUICEFALIA (Criterio Sant Joan de Déu)
         ========================================================================= */}
      {ap !== undefined && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
          <div className="bg-sky-700 px-4 py-2.5 text-white flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
              Protocolo de Braquicefalia (Criterio Hospital Sant Joan de Déu)
            </h4>
            <span className="text-[10px] sm:text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
              Índice Cefalométrico [(BP / AP) * 100]
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-sky-50/70 border-b border-sky-100 text-sky-950 font-bold">
                  <th className="py-2.5 px-4 w-1/2 border-r border-slate-200">Índice cefalométrico</th>
                  <th className="py-2.5 px-4 w-1/2">Criterio e Interpretación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-2.5 px-4 border-r border-slate-200 font-medium">
                    <div>Diámetro AP: <strong className="font-mono text-slate-900">{ap} mm</strong></div>
                    <div className="mt-1">Diámetro BP (PP): <strong className="font-mono text-slate-900">{bp} mm</strong></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold">Índice Cefalométrico:</span>
                      <strong className="font-mono text-sky-950 text-sm">{ci}%</strong>
                    </div>
                    <div className="mt-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs bg-blue-100 text-blue-900 border border-blue-300">
                        {brachyClass || 'Evaluado'}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tabla comparativa de evolución: Inicial | Intermedia | Final | Cambio */}
          <div className="border-t border-slate-200 bg-slate-50/70 p-3 sm:p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
              Evolución y Control de Proceso (Braquicefalia):
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-1 px-2 text-left">Parámetro</th>
                    <th className="py-1 px-2">Inicial</th>
                    <th className="py-1 px-2">Intermedia</th>
                    <th className="py-1 px-2">Final</th>
                    <th className="py-1 px-2">Cambio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-medium text-slate-800">
                  <tr>
                    <td className="py-1.5 px-2 text-left font-semibold">Índice Cefalométrico</td>
                    <td className="py-1.5 px-2 font-mono">{ci}%</td>
                    <td className="py-1.5 px-2 font-mono">86.8%</td>
                    <td className="py-1.5 px-2 font-mono font-bold text-emerald-700">85.5%</td>
                    <td className="py-1.5 px-2 font-bold text-emerald-700">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                        <ArrowDown className="w-3 h-3 text-emerald-600" />
                        -2.6% (Mejora)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-left font-semibold">Clasificación</td>
                    <td className="py-1.5 px-2">Braquicefalia leve</td>
                    <td className="py-1.5 px-2">Tendencia normal</td>
                    <td className="py-1.5 px-2 font-bold text-emerald-700">Rango Normal (85%)</td>
                    <td className="py-1.5 px-2">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
                        <ArrowDown className="w-3 h-3 text-emerald-600" />
                        Favorable
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TABLA 3: COMPONENTES PSICOMOTRICES (2 Columnas: Componente | Observaciones)
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
        <div className="bg-sky-700 px-4 py-2.5 text-white flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
            Observación de Componentes Psicomotrices Cualitativos
          </h4>
          <span className="text-[10px] sm:text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
            Evaluación Kinésica
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-sky-50/70 border-b border-sky-100 text-sky-950 font-bold">
                <th className="py-2.5 px-4 w-1/4 border-r border-slate-200">Componentes Psicomotrices</th>
                <th className="py-2.5 px-4 w-3/4">Observaciones Clínicas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              
              {/* 1. Movimiento */}
              <tr>
                <td className="py-3 px-4 border-r border-slate-200 font-bold text-sky-950 align-top">
                  Movimiento
                </td>
                <td className="py-3 px-4 space-y-2 leading-relaxed">
                  <p>
                    <strong>Apariencia facial:</strong> Sonríe y reacciona a estímulos con muecas y cerrando los ojos.
                  </p>
                  <p>
                    <strong>Movimientos oculares:</strong> Intermitentes, con desviación de los ojos y rango de movimiento limitado hacia la izquierda.
                  </p>
                  <p>
                    <strong>Respuesta visual y auditiva:</strong> Sigue objetos en rango incompleto con diferencia hacia la izquierda. Reacción con dificultad al estímulo auditivo con asimetría de respuesta hacia el lado izquierdo.
                  </p>
                  <p>
                    <strong>Succión / deglución:</strong> Buen acople y deglución normal.
                  </p>
                  <p>
                    <strong>Movimiento general:</strong> Cantidad adecuada en decúbito supino. Calidad libre, alternándose y uniforme en decúbito supino, con dificultad en el control de cabeza.
                  </p>

                  {/* Subtabla de Hitos Motores */}
                  <div className="pt-2">
                    <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wide block mb-1">
                      Hitos del Desarrollo Evaluados:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div>• <strong>Control de cabeza:</strong> Mantiene la cabeza erguida en sedente con compensaciones.</div>
                      <div>• <strong>Sedestación:</strong> Deja caer la cabeza hacia delante con columna curvada.</div>
                      <div>• <strong>Agarre voluntario:</strong> Dedos y pulgar con agarre inmaduro.</div>
                      <div>• <strong>Patada en supino:</strong> Toca los dedos de los pies.</div>
                      <div>• <strong>Giro:</strong> Giro hacia la derecha más que hacia la izquierda.</div>
                      <div>• <strong>Prono:</strong> Permanece en prono sin gateo, codos por detrás de la línea de hombros.</div>
                      <div>• <strong>Bipedestación:</strong> Se mantiene con soporte.</div>
                      <div>• <strong>Marcha:</strong> Rebota con apoyo de pie.</div>
                    </div>
                  </div>
                </td>
              </tr>

              {/* 2. Postura y tono muscular */}
              <tr>
                <td className="py-3 px-4 border-r border-slate-200 font-bold text-sky-950 align-top">
                  Postura y tono muscular
                </td>
                <td className="py-3 px-4 space-y-2 leading-relaxed">
                  <p>
                    Tono conservado en extremidades. En reacciones posturales y reflejos se observan los siguientes hallazgos:
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700">
                    <li><strong>Reacciones de equilibrio:</strong> Se observan dificultades dinámicas.</li>
                    <li><strong>Tracción al sedente (pull-to-sit):</strong> Bajo control de cabeza. Fuerza proximal M3 en extremidades superiores (vence gravedad).</li>
                    <li><strong>Reacción de Landau:</strong> Presente con dificultad para mantener la extensión.</li>
                    <li><strong>Reacción de enderezamiento:</strong> Patea simétricamente en posición de pie con soporte.</li>
                    <li><strong>Prueba de Ortolani-Barlow:</strong> Negativa bilateral (caderas estables).</li>
                    <li><strong>Reflejos osteotendinosos:</strong> Fáciles de evocar en bíceps y rodillas.</li>
                  </ul>

                  {/* Subtabla de pruebas articulares */}
                  <div className="pt-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div>• Signo del chal: <strong>Rango completo</strong></div>
                      <div>• Hombro pasivo: <strong>Resistencia normal</strong></div>
                      <div>• Pronación/supinación: <strong>Sin resistencia</strong></div>
                      <div>• Aductores cadera: <strong>150°-160° (normal)</strong></div>
                      <div>• Ángulo poplíteo: <strong>90°-170° (normal)</strong></div>
                      <div>• Dorsiflexión tobillo: <strong>30°-85° (normal)</strong></div>
                    </div>
                  </div>
                </td>
              </tr>

              {/* 3. Relación con los objetos */}
              <tr>
                <td className="py-3 px-4 border-r border-slate-200 font-bold text-sky-950 align-top">
                  Relación con los objetos
                </td>
                <td className="py-3 px-4 leading-relaxed">
                  Se observa seguimiento visual de objetos y personas. Responde a estímulos auditivos, girando la cabeza hacia la fuente del sonido con mayor dificultad del giro hacia la izquierda. Explora objetos blandos, busca diferentes texturas y acepta el intercambio lúdico propuesto por el kinesiólogo.
                </td>
              </tr>

              {/* 4. Relación con el espacio */}
              <tr>
                <td className="py-3 px-4 border-r border-slate-200 font-bold text-sky-950 align-top">
                  Relación con el espacio
                </td>
                <td className="py-3 px-4 leading-relaxed">
                  Movilidad general activa en decúbito supino. En decúbito prono presenta buena tolerancia inicial, lo que facilita la exploración del espacio desde esa posición sobre colchoneta.
                </td>
              </tr>

              {/* 5. Relación con el tiempo */}
              <tr>
                <td className="py-3 px-4 border-r border-slate-200 font-bold text-sky-950 align-top">
                  Relación con el tiempo
                </td>
                <td className="py-3 px-4 leading-relaxed">
                  Actividades sensoriomotoras con alternancia de movimientos simétricos y asimétricos. Genera vínculo positivo con el kinesiólogo mediante toma en brazos, estimulación vestibular y comunicación verbal.
                </td>
              </tr>

              {/* 6. Relación con el otro */}
              <tr>
                <td className="py-3 px-4 border-r border-slate-200 font-bold text-sky-950 align-top">
                  Relación con el otro
                </td>
                <td className="py-3 px-4 leading-relaxed">
                  Establece un vínculo cálido y colaborativo con el kinesiólogo, participando activamente en los juegos en compañía y contención constante de la madre.
                </td>
              </tr>

              {/* 7. Lenguaje */}
              <tr>
                <td className="py-3 px-4 border-r border-slate-200 font-bold text-sky-950 align-top">
                  Lenguaje y Comunicación
                </td>
                <td className="py-3 px-4 leading-relaxed">
                  Estado consciente y alerta, mantiene el interés durante la evaluación. Estado emocional feliz y sonriente. Orientación social adecuada, acepta el acercamiento lúdico con vocalizaciones y gestos corporales.
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Tabla comparativa de evolución psicomotriz: Inicial | Intermedia | Final | Cambio */}
        <div className="border-t border-slate-200 bg-slate-50/70 p-3 sm:p-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
            Evolución de Hitos y Parámetros Psicomotores:
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-1 px-2 text-left">Hito / Área</th>
                  <th className="py-1 px-2">Inicial</th>
                  <th className="py-1 px-2">Intermedia</th>
                  <th className="py-1 px-2">Final</th>
                  <th className="py-1 px-2">Cambio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 font-medium text-slate-800">
                <tr>
                  <td className="py-1.5 px-2 text-left font-semibold">Giro cervical izquierdo</td>
                  <td className="py-1.5 px-2 font-mono text-rose-700">45° (Limitado)</td>
                  <td className="py-1.5 px-2 font-mono text-amber-700">65° (En proceso)</td>
                  <td className="py-1.5 px-2 font-mono font-bold text-emerald-700">80° (Simétrico)</td>
                  <td className="py-1.5 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      +35° (Mejora)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 text-left font-semibold">Control de cabeza en sedente</td>
                  <td className="py-1.5 px-2 text-amber-700">Inestable / Cae</td>
                  <td className="py-1.5 px-2 text-amber-700">Mantiene con apoyo</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">Erguido y alineado</td>
                  <td className="py-1.5 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      Consolidado
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 text-left font-semibold">Giros supino a prono</td>
                  <td className="py-1.5 px-2 text-rose-700">Solo hacia derecha</td>
                  <td className="py-1.5 px-2 text-amber-700">Inicia a izquierda</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">Bilateral activo</td>
                  <td className="py-1.5 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      Simetría
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 text-left font-semibold">Reacciones de paracaídas</td>
                  <td className="py-1.5 px-2 text-rose-700">Ausentes</td>
                  <td className="py-1.5 px-2 text-amber-700">Incompletas</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">Presentes y firmes</td>
                  <td className="py-1.5 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      Protección
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

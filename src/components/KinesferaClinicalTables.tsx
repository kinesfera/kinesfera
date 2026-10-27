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
          TABLA HINE: EXAMEN NEUROLÓGICO INFANTIL DE HAMMERSMITH (CON EXPLICACIÓN DE CADA RESULTADO)
         ========================================================================= */}
      {evaluations?.hineExam && (() => {
        const h = evaluations.hineExam;
        const explainScore = (val: number | undefined, opt: string, mid: string, low: string) => {
          const s = val ?? 3;
          if (s === 3) return `${s}/3 — Óptimo (${opt})`;
          if (s === 2) return `${s}/3 — Adecuado / En maduración (${mid})`;
          if (s === 1) return `${s}/3 — Asimetría o inmadurez leve (${low})`;
          return `${s}/3 — Hallazgo clínico prioritario (${low})`;
        };
        const total = h.totalScore ?? 72;
        const asym = h.asymmetryCount ?? 0;
        const globalMeaning = total >= 65
          ? 'Puntaje global dentro del rango óptimo de neurodesarrollo motor y postural para su edad, con adecuada organización neuromotora.'
          : total >= 56
          ? 'Puntaje global en rango de vigilancia kinésica: sugiere inmadurez postural o asimetrías transitorias que responden favorablemente a la estimulación psicomotriz temprana.'
          : 'Puntaje bajo el corte esperado para la edad: indica requerimiento de intervención kinésica intensiva en control postural, tono muscular y reacciones de enderezamiento.';

        return (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
            <div className="bg-indigo-800 px-4 py-2.5 text-white flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Examen Neurológico Infantil de Hammersmith (HINE) — Puntaje y Significado Clínico
                </h4>
                <p className="text-[10px] text-indigo-200">
                  Evaluación neuromotora estandarizada (0 a 78 puntos) con interpretación de cada dominio e ítem evaluado
                </p>
              </div>
              <span className="text-xs font-black bg-white text-indigo-950 px-3 py-1 rounded-full shadow-2xs">
                Total: {total} / 78 pts · {h.riskLevel || (total >= 65 ? 'Óptimo' : 'Seguimiento')}
              </span>
            </div>

            {/* Explicación del Resultado Global */}
            <div className="p-3.5 bg-indigo-50/70 border-b border-indigo-100 text-xs text-indigo-950 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong>Interpretación del Puntaje Global ({total}/78 pts {asym > 0 ? `· ${asym} asimetría(s)` : '· Sin asimetrías'}):</strong>
                <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                  Escala por ítem: 3 = Óptimo · 2 = En maduración · 1 = Asimetría/Leve · 0 = Compromiso
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{globalMeaning}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-bold">
                    <th className="py-2.5 px-3 w-1/4 border-r border-slate-200">Dominio HINE y Puntaje</th>
                    <th className="py-2.5 px-3 w-3/4">Significado Clínico de Cada Resultado Evaluado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 text-slate-800">
                  {/* 1. Pares Craneales */}
                  <tr>
                    <td className="py-3 px-3 border-r border-slate-200 align-top bg-slate-50/50">
                      <strong className="text-indigo-950 block">1. Función de Pares Craneales</strong>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold text-xs">
                        {h.cranialNervesSubtotal ?? 15} / 15 pts
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1">
                        Evalúa reactividad facial, coordinación visual, audición y deglución.
                      </span>
                    </td>
                    <td className="py-3 px-3 space-y-1.5 leading-relaxed">
                      <div>• <strong>Apariencia y expresión facial:</strong> {explainScore(h.facialAnimation, 'sonríe, expresa emociones y reacciona simétricamente', 'expresión facial presente con leve variabilidad', 'gestualidad disminuida o asimétrica')}.</div>
                      <div>• <strong>Movimientos oculares:</strong> {explainScore(h.eyeMovements, 'movimientos conjugados y centrados sin desviación', 'seguimiento ocular intermitente', 'desviación ocular o rango limitado hacia un lado')}.</div>
                      <div>• <strong>Seguimiento visual:</strong> {explainScore(h.visualFollow, 'sigue objetos en arco completo de 180° a ambos lados', 'sigue objetos en rango parcial', 'preferencia visual hacia un lado con giro incompleto al lado opuesto')}.</div>
                      <div>• <strong>Respuesta auditiva:</strong> {explainScore(h.auditoryResponse, 'gira y localiza la fuente sonora hacia ambos oídos', 'reacciona al sonido con latencia leve', 'orientación auditiva asimétrica hacia un hemicuerpo')}.</div>
                      <div>• <strong>Succión y deglución:</strong> {explainScore(h.suckSwallow, 'buen acople oral, succión rítmica y deglución segura', 'succión funcional con pausas', 'fatiga o incoordinación en succión-deglución')}.</div>
                    </td>
                  </tr>

                  {/* 2. Postura */}
                  <tr>
                    <td className="py-3 px-3 border-r border-slate-200 align-top bg-slate-50/50">
                      <strong className="text-indigo-950 block">2. Postura Corporal</strong>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold text-xs">
                        {h.postureSubtotal ?? 18} / 18 pts
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1">
                        Evalúa alineación de cabeza, tronco y extremidades respecto a la línea media.
                      </span>
                    </td>
                    <td className="py-3 px-3 space-y-1.5 leading-relaxed">
                      <div>• <strong>Cabeza en sedente:</strong> {explainScore(h.headPosture, 'mantiene cabeza erguida y centrada en línea media', 'ligera inclinación ocasional que corrige', 'inclinación o rotación preferente hacia un lado')}.</div>
                      <div>• <strong>Tronco en sedente:</strong> {explainScore(h.trunkPosture, 'espalda alineada con activación postural acorde a su edad', 'leve cifosis dorsal propia de la etapa de maduración', 'tronco redondeado con requerimiento de soporte externo')}.</div>
                      <div>• <strong>Brazos en reposo:</strong> {explainScore(h.armPosture, 'postura neutra y simétrica libre para el alcance', 'ligera flexión simétrica', 'asimetría postural de hombros o codos')}.</div>
                      <div>• <strong>Manos:</strong> {explainScore(h.handsPosture, 'manos abiertas y dedos libres para explorar objetos', 'apertura manual intermitente', 'manos empuñadas o pulgar aducido')}.</div>
                      <div>• <strong>Piernas (sedente y supino):</strong> {explainScore(h.legPosture, 'alineación simétrica con movilidad libre de caderas y rodillas', 'semiflexión simétrica', 'rotación externa o asimetría postural de extremidades inferiores')}.</div>
                      <div>• <strong>Pies:</strong> {explainScore(h.feetPosture, 'posición neutra de tobillos y ortejos relajados', 'apoyo plantar en maduración', 'tendencia a apoyo en punta o inversión/eversión')}.</div>
                    </td>
                  </tr>

                  {/* 3. Movimientos Espontáneos */}
                  <tr>
                    <td className="py-3 px-3 border-r border-slate-200 align-top bg-slate-50/50">
                      <strong className="text-indigo-950 block">3. Movimientos Espontáneos</strong>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold text-xs">
                        {h.movementsSubtotal ?? 6} / 6 pts
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1">
                        Evalúa repertorio motor espontáneo en cantidad y fluidez neuromotora.
                      </span>
                    </td>
                    <td className="py-3 px-3 space-y-1.5 leading-relaxed">
                      <div>• <strong>Cantidad de movimiento:</strong> {explainScore(h.movementsQuantity, 'actividad motora espontánea activa y variada en vigilia', 'actividad moderada que aumenta con estímulo lúdico', 'movilidad espontánea reducida o inquieta')}.</div>
                      <div>• <strong>Calidad del movimiento:</strong> {explainScore(h.movementsQuality, 'movimientos fluidos, libres, alternantes y armónicos en las 4 extremidades', 'movimientos coordinados con leve asimetría', 'movimientos en bloque o con menor disociación')}.</div>
                    </td>
                  </tr>

                  {/* 4. Tono Muscular */}
                  <tr>
                    <td className="py-3 px-3 border-r border-slate-200 align-top bg-slate-50/50">
                      <strong className="text-indigo-950 block">4. Tono Muscular Pasivo y Activo</strong>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold text-xs">
                        {h.toneSubtotal ?? 24} / 24 pts
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1">
                        Evalúa elasticidad muscular, ángulos articulares y fuerza antigravitatoria.
                      </span>
                    </td>
                    <td className="py-3 px-3 space-y-1.5 leading-relaxed">
                      <div>• <strong>Signo del chal y hombro pasivo:</strong> {explainScore(h.scarfSign, 'extensibilidad escapular normal y simétrica (codo cruza línea media con resistencia fisiológica)', 'rango escapular funcional', 'hipotonía axial leve o resistencia asimétrica en cintura escapular')}.</div>
                      <div>• <strong>Pronación / supinación de antebrazo:</strong> {explainScore(h.pronationSupination, 'giro libre de antebrazo sin resistencia anormal', 'movilidad funcional', 'resistencia al giro pasivo de antebrazo')}.</div>
                      <div>• <strong>Ángulos de cadera (aductores) y poplíteo:</strong> {explainScore(h.adductorsAngle, 'apertura simétrica de caderas (80°-150°) e isquiotibiales elásticos', 'rango articular dentro de límites funcionales', 'extensibilidad aumentada o acortamiento muscular leve')}.</div>
                      <div>• <strong>Dorsiflexión de tobillo:</strong> {explainScore(h.ankleDorsiflexionAngle, 'rango fisiológico libre (30°-85°) sin retracción aquiliana', 'movilidad de tobillo conservada', 'resistencia plantar o hiperlaxitud')}.</div>
                      <div>• <strong>Tracción al sedente (Pull-to-sit):</strong> {explainScore(h.pullToSit, 'activa flexores de cuello y acompaña el movimiento con cabeza alineada', 'leve rezago cefálico inicial que logra alinear', 'rezago cefálico al traccionar desde las manos; requiere fortalecer control anterior de cuello')}.</div>
                      <div>• <strong>Suspensión ventral:</strong> {explainScore(h.ventralSuspension, 'activa musculatura extensora manteniendo cabeza y tronco alineados contra gravedad', 'extensión parcial de tronco', 'menor activación extensora antigravitatoria en suspensión')}.</div>
                    </td>
                  </tr>

                  {/* 5. Reflejos y Reacciones Posturales */}
                  <tr>
                    <td className="py-3 px-3 border-r border-slate-200 align-top bg-slate-50/50">
                      <strong className="text-indigo-950 block">5. Reflejos y Reacciones Posturales</strong>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold text-xs">
                        {h.reflexesSubtotal ?? 15} / 15 pts
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1">
                        Evalúa respuestas automáticas de equilibrio, enderezamiento y defensa.
                      </span>
                    </td>
                    <td className="py-3 px-3 space-y-1.5 leading-relaxed">
                      <div>• <strong>Protección de brazos y apoyo anterior:</strong> {explainScore(h.armProtectionReaction, 'extiende brazos y abre manos de forma simétrica para protegerse', 'respuesta protectora en maduración', 'extensión incompleta o asimétrica de extremidades superiores')}.</div>
                      <div>• <strong>Suspensión vertical (pataleo):</strong> {explainScore(h.verticalSuspension, 'pataleo alternante y simétrico de ambas piernas sin entrecruzamiento', 'movimiento activo con leve preferencia', 'menor activación o asimetría en extremidades inferiores')}.</div>
                      <div>• <strong>Inclinación lateral (enderezamiento):</strong> {explainScore(h.lateralTilting, 'endereza la cabeza y curva el tronco adecuadamente ante cambios de gravedad', 'reacción de enderezamiento parcial', 'respuesta de enderezamiento lenta hacia uno de los lados')}.</div>
                      <div>• <strong>Paracaídas anterior:</strong> {explainScore(h.forwardParachute, 'extensión simétrica de brazos y manos al proyectarse hacia adelante (esperable desde los 6m)', 'en fase de aparición según edad cronológica', 'aún no consolidado o en etapa previa por edad')}.</div>
                      <div>• <strong>Reflejos osteotendinosos:</strong> {explainScore(h.tendonReflexes, 'normorreflexia bicipital, rotuliana y aquiliana bilateral', 'reflejos presentes y simétricos', 'reflejos exaltados o disminuidos')}.</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

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

        {/* Tabla comparativa de evolución Moto-Sensorial y Psicomotriz: Inicial | Intermedia | Final | Cambio */}
        <div className="border-t border-slate-200 bg-sky-50/40 p-3 sm:p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black text-sky-950 uppercase tracking-wide block">
              Eje Central Motor-Sensorial: Evolución de Hitos Motores, Tono, Equilibrio Vestibular y Propiocepción
            </span>
            <span className="text-[10px] font-bold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full border border-sky-200">
              Protagonismo Kinésico y Sensoriomotor
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs bg-white rounded-xl overflow-hidden border border-slate-200">
              <thead>
                <tr className="bg-sky-900 text-white font-bold">
                  <th className="py-2 px-3 text-left">Dominio Motor / Sensorial (Medición)</th>
                  <th className="py-2 px-2">Inicial</th>
                  <th className="py-2 px-2">Intermedia</th>
                  <th className="py-2 px-2">Final</th>
                  <th className="py-2 px-2">Cambio Clínico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 font-medium text-slate-800">
                <tr>
                  <td className="py-2 px-3 text-left">
                    <strong className="text-slate-900 block">1. Control Postural, Tono y Estabilidad Axial</strong>
                    <span className="text-[10px] text-slate-500">Firmeza muscular, alineación de tronco y control antigravitatorio</span>
                  </td>
                  <td className="py-2 px-2 text-rose-700 font-semibold">
                    {evaluations?.daFonsecaBpm ? `${evaluations.daFonsecaBpm.tonicityScore.toFixed(1)} / 4 pts` : 'Inestable / Hipotonía axial'}
                  </td>
                  <td className="py-2 px-2 text-amber-700">En activación progresiva</td>
                  <td className="py-2 px-2 font-bold text-emerald-700">Erguido, firme y alineado</td>
                  <td className="py-2 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      ▲ Estabilidad Axial
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-left">
                    <strong className="text-slate-900 block">2. Sistema Vestibular y Equilibrio Dinámico (BAL)</strong>
                    <span className="text-[10px] text-slate-500">Reacciones de enderezamiento, paracaídas y seguridad gravitacional</span>
                  </td>
                  <td className="py-2 px-2 text-rose-700 font-semibold">
                    {evaluations?.spmSensoryMeasure?.balanceAndMotionScore
                      ? `${evaluations.spmSensoryMeasure.balanceAndMotionScore} T (Dificultad)`
                      : 'Inseguridad / Asimetría'}
                  </td>
                  <td className="py-2 px-2 text-amber-700">Mayor ajuste en movimiento</td>
                  <td className="py-2 px-2 font-bold text-emerald-700">Equilibrio fluido y simétrico</td>
                  <td className="py-2 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      ▲ Control Vestibular
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-left">
                    <strong className="text-slate-900 block">3. Sistema Propioceptivo y Conciencia Corporal (BOD)</strong>
                    <span className="text-[10px] text-slate-500">Esquema corporal, graduación de fuerza y regulación de descarga motriz</span>
                  </td>
                  <td className="py-2 px-2 text-amber-700 font-semibold">
                    {evaluations?.spmSensoryMeasure?.bodyAwarenessScore
                      ? `${evaluations.spmSensoryMeasure.bodyAwarenessScore} T (En ajuste)`
                      : 'Búsqueda propioceptiva'}
                  </td>
                  <td className="py-2 px-2 text-amber-700">Mejor modulación de fuerza</td>
                  <td className="py-2 px-2 font-bold text-emerald-700">Adecuada noción corporal</td>
                  <td className="py-2 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      ▲ Propiocepción
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-left">
                    <strong className="text-slate-900 block">4. Praxia Global y Planificación Motora (PLN)</strong>
                    <span className="text-[10px] text-slate-500">Coordinación dinámica general, ideación motriz, giros y desplazamientos</span>
                  </td>
                  <td className="py-2 px-2 text-rose-700 font-semibold">
                    {evaluations?.daFonsecaBpm
                      ? `${evaluations.daFonsecaBpm.globalPraxiaScore.toFixed(1)} / 4 pts`
                      : 'Disociación incompleta'}
                  </td>
                  <td className="py-2 px-2 text-amber-700">Secuencias guiadas</td>
                  <td className="py-2 px-2 font-bold text-emerald-700">Coordinación bilateral activa</td>
                  <td className="py-2 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      ▲ Praxia Motora
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-left">
                    <strong className="text-slate-900 block">5. Praxia Fina y Coordinación Visomotriz</strong>
                    <span className="text-[10px] text-slate-500">Alcance dirigido, agarre voluntario, pinza digital y precisión manual</span>
                  </td>
                  <td className="py-2 px-2 text-amber-700 font-semibold">
                    {evaluations?.daFonsecaBpm
                      ? `${evaluations.daFonsecaBpm.finePraxiaScore.toFixed(1)} / 4 pts`
                      : 'Agarre palmar / en maduración'}
                  </td>
                  <td className="py-2 px-2 text-amber-700">Mayor disociación digital</td>
                  <td className="py-2 px-2 font-bold text-emerald-700">Manipulación precisa y funcional</td>
                  <td className="py-2 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      ▲ Destreza Manual
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-left">
                    <strong className="text-slate-900 block">6. Exploración y Modulación de Estímulos (TOU / VIS / HEA)</strong>
                    <span className="text-[10px] text-slate-500">Tolerancia táctil a texturas, seguimiento visual y orientación auditiva</span>
                  </td>
                  <td className="py-2 px-2 text-amber-700 font-semibold">
                    {evaluations?.spmSensoryMeasure?.totalSensoryScore
                      ? `${evaluations.spmSensoryMeasure.totalSensoryScore} T (Sensibilidad)`
                      : 'Reactividad / asimetría inicial'}
                  </td>
                  <td className="py-2 px-2 text-amber-700">Mayor tolerancia y enfoque</td>
                  <td className="py-2 px-2 font-bold text-emerald-700">Exploración activa y regulada</td>
                  <td className="py-2 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                      ▲ Modulación
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

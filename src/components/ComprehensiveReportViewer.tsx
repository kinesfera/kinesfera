import React, { useState, useEffect } from 'react';
import { 
  ComprehensiveReport, 
  ProgressNote, 
  PatientCommunicationEvaluation, 
  SPMEvaluationRecord 
} from '../types';
import { downloadReportAsWord } from '../utils/documentExport';
import { calculatePatientAge, formatDateDMY } from '../utils/ageHelper';
import { clinicalStorage } from '../utils/clinicalStorage';
import { 
  getFamilyThreeLineSummary,
  getFamilyTrafficLightItems,
  getFamilyComparativeItems,
  getFamilyTimelinePoints,
  getFamilyAchievements,
  getFamilyNextSteps,
  getFamilyHomeRecommendations,
  generateWhatsAppMessage
} from '../utils/familyReportHelper';
import { KinesferaClinicalTables } from './KinesferaClinicalTables';
import { CriticalCommunicationTable } from './CriticalCommunicationTable';
import { communicationSkillsService } from '../services/communicationSkillsService';
import { spmEvaluationService } from '../services/spmEvaluationService';
import { 
  CranialSymmetryBarsChart,
  CranialDifferenceLineChart,
  CephalicIndexChart,
  CervicalRomBarsChart,
  PsychomotorTrafficLightChart
} from './KinesferaReportCharts';
import { FamilyComparativeBarChart } from './FamilyComparativeBarChart';
import { FamilyTimelineProgressChart } from './FamilyTimelineProgressChart';
import { WeeklyHomePracticeModal } from './WeeklyHomePracticeModal';
import { CompanyDocumentHeader } from './CompanyDocumentHeader';
import { 
  FileText, 
  Download, 
  Printer, 
  Edit3, 
  Calendar, 
  User as UserIcon, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Send,
  Heart,
  Share2,
  Check,
  Copy,
  ChevronRight,
  ArrowRight,
  Home,
  Clock,
  BookOpen,
  Smartphone,
  Activity,
  Layers,
  X,
  Target,
  Brain,
  Scale,
  RefreshCw,
  GitBranch,
  MessageSquare
} from 'lucide-react';

interface ComprehensiveReportViewerProps {
  report: ComprehensiveReport;
  progressNotes?: ProgressNote[];
  onEditReport?: () => void;
  onSelectAnotherPatient?: () => void;
  onGoToLibrary?: () => void;
  onGoToSPM?: () => void;
}

export const ComprehensiveReportViewer: React.FC<ComprehensiveReportViewerProps> = ({
  report,
  progressNotes: propNotes,
  onEditReport,
  onSelectAnotherPatient,
  onGoToLibrary,
  onGoToSPM
}) => {
  // Load notes for this user if not passed via props
  const patientNotes: ProgressNote[] = propNotes && propNotes.length > 0
    ? propNotes.filter(n => n.patientId === report.patientId)
    : clinicalStorage.loadProgressNotes().filter(n => n.patientId === report.patientId);

  const [showWeeklyPracticeModal, setShowWeeklyPracticeModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState(
    report.anamnesis?.caregiverPhone || ''
  );

  const ageInfo = calculatePatientAge(report.patientBirthDate);
  const anam = report.anamnesis;
  const evalData = report.evaluations;
  const cranial = anam?.cranialMeasurements;
  const bpm = evalData?.daFonsecaBpm;
  const isBaby = ageInfo.isUnderTwo || anam?.ageCategory === 'bebe_hasta_18_meses';

  const formattedBirthDate = formatDateDMY(report.patientBirthDate);
  const formattedEmissionDate = formatDateDMY(report.dateGenerated);

  // Communication evaluation and SPM evaluation records
  const [commEval, setCommEval] = useState<PatientCommunicationEvaluation | null>(null);
  const [spmEval, setSpmEval] = useState<SPMEvaluationRecord | null>(null);

  useEffect(() => {
    let isMounted = true;
    communicationSkillsService.loadCommunicationEvaluations().then(evals => {
      if (isMounted && evals[report.patientId]) {
        setCommEval(evals[report.patientId]);
      }
    });
    spmEvaluationService.loadSPMEvaluations().then(allSpm => {
      if (isMounted && allSpm[report.patientId]) {
        setSpmEval(allSpm[report.patientId]);
      }
    });
    return () => { isMounted = false; };
  }, [report.patientId]);

  // Check if user has limitation following instructions (Requirement 4 — only for non-infants)
  const followsText = typeof anam?.followsInstructions === 'string' ? anam.followsInstructions.toLowerCase() : '';
  const hasInstructionLimitation = !isBaby && (
    communicationSkillsService.shouldAddInstructionFollowingGoal(commEval) || 
    (followsText.includes('dificultad') || followsText.includes('no sigue') || followsText.includes('no') || followsText.includes('cuesta') || followsText.includes('parcial'))
  );

  // Extract structured, family-friendly clinical data
  const summary = getFamilyThreeLineSummary(report, patientNotes);
  const trafficLightItems = getFamilyTrafficLightItems(report);
  const comparativeItems = getFamilyComparativeItems(report);
  const timelinePoints = getFamilyTimelinePoints(patientNotes);
  const achievements = getFamilyAchievements(report);
  const nextSteps = getFamilyNextSteps(report);
  const homeTips = getFamilyHomeRecommendations(report);

  const formattedWhatsAppText = generateWhatsAppMessage(
    report,
    summary,
    achievements,
    nextSteps,
    homeTips
  );

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    downloadReportAsWord(report);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(formattedWhatsAppText);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleSendWhatsApp = () => {
    let cleanPhone = whatsappPhone.replace(/\D/g, '');
    if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
      cleanPhone = `56${cleanPhone}`;
    }
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(formattedWhatsAppText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedWhatsAppText)}`;
    window.open(url, '_blank');
  };

  const patientFirstName = report.patientName.split(' ')[0] || report.patientName;

  // Instrument description (No usar "integración sensorial" ni "integración sensorio-motriz")
  const evaluationInstrumentsText = isBaby
    ? 'Examen Neurológico Infantil de Hammersmith (HINE), Escala Motora Infantil de Alberta (AIMS), Protocolo Clínico de Craneometría (Sant Joan de Déu) y Cuestionario de Exploración y Respuesta a Estímulos (SPM-2 Bebés).'
    : bpm 
    ? 'Observación de Capacidades Psicomotoras batería de Vítor da Fonseca. Cuestionario de Exploración y Respuesta a Estímulos (SPM-2).'
    : cranial
    ? 'Protocolo Clínico de Craneometría (Sant Joan de Déu) y Valoración del Neurodesarrollo Infantil.'
    : 'Evaluación Neuropsicomotriz Pediátrica y Parámetros Funcionales del Desarrollo.';

  // Intervention goals: sanitized and age-adapted
  let baseGoals: string[] = evalData?.interventionGoals && evalData.interventionGoals.length > 0
    ? [...evalData.interventionGoals]
    : isBaby
    ? [
        'Favorecer un desarrollo psicomotor óptimo acorde a su edad cronológica y corregida.',
        'Optimizar la simetría postural cervical y el control cefálico en línea media (supino y prono).',
        'Estimular las transiciones motoras tempranas: tolerancia al juego en prono, apoyo simétrico de antebrazos y giros coordinados.',
        'Regular el tono muscular axial y apendicular facilitando reacciones de enderezamiento y equilibrio.',
        'Acompañar la exploración y respuesta a estímulos táctiles, vestibulares y propioceptivos durante las rutinas de cuidado diario.',
        'Educar y acompañar a la familia con pautas ergonómicas de posicionamiento y estimulación psicomotriz en el hogar.'
      ]
    : [
        'Contribuir a favorecer un desarrollo psicomotor óptimo que potencie el aprendizaje y la autorregulación.',
        'Regulación del tono muscular, la fuerza y la energía para una mejor ejecución motora.',
        'Mejorar el equilibrio, las reacciones de protección y la coordinación vestibular (estabilidad al moverse o saltar).',
        'Potenciar la noción del cuerpo, la conciencia corporal y el mapa mental del cuerpo (propiocepción).',
        'Afianzar la estructuración espacio-temporal para una mejor organización en el espacio y el tiempo (orientación en el papel y rutinas).',
        'Favorecer la planificación motora y la praxia global y fina, con especial énfasis en la grafomotricidad (agarre del lápiz y tijeras).',
        'Desarrollar la atención sostenida y la concentración a través del juego y el movimiento.',
        'Entregar estrategias de regulación y modulación adaptadas a la familia y al entorno cotidiano.'
      ];

  // Sanitize according to Requirements
  baseGoals = baseGoals.map(g => {
    let clean = g
      .replace(/óptima integración sensorio-motriz/gi, 'favorecer un desarrollo psicomotor óptimo')
      .replace(/integración sensorio-motriz/gi, 'psicomotricidad')
      .replace(/integración sensorial/gi, 'psicomotricidad')
      .replace(/regulación sensorial/gi, 'regulación y modulación psicomotriz')
      .replace(/\bpacientes\b/gi, 'usuarios')
      .replace(/\bpaciente\b/gi, 'usuario');
    if (isBaby) {
      clean = clean
        .replace(/y a la escuela/gi, 'en el hogar')
        .replace(/en la escuela/gi, 'en el hogar')
        .replace(/contexto escolar/gi, 'entorno familiar')
        .replace(/aula educacional/gi, 'entorno del hogar')
        .replace(/actividades lúdicas y escolares/gi, 'actividades sensoriomotoras tempranas y de vínculo en el hogar');
    }
    return clean;
  });

  // Requirement 4: automatic goal if user does not follow instructions (only for non-infants)
  const instructionGoal = 'Lograr que el usuario siga instrucciones a través de la intervención kinésica y psicomotriz';
  if (hasInstructionLimitation) {
    if (!baseGoals.some(g => g.toLowerCase().includes('siga instrucciones'))) {
      baseGoals = [...baseGoals, instructionGoal];
    }
  } else {
    baseGoals = baseGoals.filter(g => !g.toLowerCase().includes('siga instrucciones'));
  }

  const interventionGoalsList = baseGoals;

  // Sanitize technical conclusion for display (especially for infants or legacy saved strings)
  const rawConclusion = evalData?.initialConclusions || evalData?.functionalDiagnosisCIF || report.clinicalSummary || '';
  const sanitizedConclusion = rawConclusion
    .replace(/óptima integración sensorio-motriz/gi, 'favorecer un desarrollo psicomotor óptimo')
    .replace(/integración sensorio-motriz/gi, 'psicomotricidad')
    .replace(/integración sensorial/gi, 'psicomotricidad')
    .replace(/\bPacientes\b/g, 'Usuarios')
    .replace(/\bpacientes\b/g, 'usuarios')
    .replace(/\bPaciente\b/g, 'Usuario')
    .replace(/\bpaciente\b/g, 'usuario')
    .replace(isBaby ? /participación en actividades lúdicas y escolares/gi : /$^/, 'adquisición de hitos motores propios de su etapa de lactante e interacción con sus cuidadores')
    .replace(isBaby ? /en el hogar y aula educacional/gi : /$^/, 'en el hogar y entorno de cuidado familiar')
    .replace(isBaby ? /contexto escolar/gi : /$^/, 'entorno familiar')
    .replace(isBaby ? /y escolares/gi : /$^/, 'y del hogar');

  // Follow-up information
  const followUpSessions = 'Bloque de 10 sesiones de kinesiología y psicomotricidad';
  const followUpFrequency = '1 a 2 veces por semana (sesiones de 45 minutos)';
  const followUpNextReeval = 'Evaluación intermedia en sesión 5 y reevaluación final en sesión 10';
  const followUpReferrals = isBaby
    ? 'Coordinación con Pediatría, Neurología Infantil y acompañamiento continuo a la familia en el hogar.'
    : 'Coordinación con equipo educativo y seguimiento conjunto con especialistas tratantes.';

  // Check if communication table should be rendered (never for infants < 2 years, and only if evaluated)
  const hasPerformedCommEval = !isBaby && (
    (commEval && commEval.items && commEval.items.length > 0) ||
    Boolean(evalData?.criticalCommunication && (
      evalData.criticalCommunication.asksForNeeds ||
      evalData.criticalCommunication.followsInstructions ||
      evalData.criticalCommunication.communicatesCalmly
    ))
  );

  return (
    <div className="space-y-6">
      
      {/* 1. TOP ACTION BAR (Hidden in print) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-black shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Informe de Evaluación Kinesiológica: {report.patientName}
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                {ageInfo.detailedChronologicalAge || ageInfo.ageText}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              RUT: <strong className="font-mono text-slate-700">{report.patientRut}</strong> · Ficha: {report.medicalRecordNumber} · Emisión: {formattedEmissionDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onEditReport && (
            <button
              onClick={onEditReport}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar Datos</span>
            </button>
          )}

          {/* Compartir por WhatsApp */}
          <button
            onClick={() => setShowWhatsAppModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition-colors cursor-pointer ring-2 ring-emerald-300/40"
            title="Compartir informe formateado por WhatsApp a la familia"
          >
            <Phone className="w-4 h-4" />
            <span>Compartir por WhatsApp</span>
          </button>

          {/* Descargar / Imprimir PDF */}
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Descargar PDF con gráficos y tablas incluidos"
          >
            <Printer className="w-4 h-4" />
            <span>Descargar en PDF / Imprimir</span>
          </button>

          {/* Descargar Word (.doc) */}
          <button
            onClick={handleDownloadWord}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer border border-blue-200"
            title="Descargar en Microsoft Word editable"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Word</span>
          </button>
        </div>
      </div>

      {/* 2. OFFICIAL KINESFERA REPORT SHEET (Styled for Screen & Crisp PDF Print) */}
      <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm max-w-4xl mx-auto space-y-8 text-slate-900 font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:space-y-6">
        
        {/* ENCABEZADO INSTITUCIONAL KINESFERA */}
        <CompanyDocumentHeader
          documentTitle="INFORME DE EVALUACIÓN KINESIOLÓGICA"
          documentSubtitle="Creando Sentido Al Juego · Kinesiología Pediátrica · Psicomotricidad"
          emissionDate={formattedEmissionDate}
          recordNumber={report.medicalRecordNumber}
        />

        {/* =========================================================================
            SECCIÓN 1: ANTECEDENTES PERSONALES
           ========================================================================= */}
        <section className="space-y-2.5">
          <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider border-b-2 border-cyan-500 pb-1 flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-cyan-700" />
            <span>1. Antecedentes Personales del Usuario</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold block text-[11px] sm:text-xs">
                Nombre del Usuario:
              </span>
              <strong className="text-slate-900 text-sm sm:text-base">
                {report.patientName}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block text-[11px] sm:text-xs">
                Fecha de Nacimiento (Día-Mes-Año):
              </span>
              <span className="font-medium text-slate-800">
                {formattedBirthDate}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block text-[11px] sm:text-xs">
                Edad Cronológica:
              </span>
              <strong className="text-cyan-950 font-bold">
                {ageInfo.detailedChronologicalAge || ageInfo.ageText}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block text-[11px] sm:text-xs">
                Fecha de Emisión del Informe:
              </span>
              <span className="font-medium text-slate-800">
                {formattedEmissionDate}
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-500 font-semibold block text-[11px] sm:text-xs">
                Diagnóstico Clínico / Derivación:
              </span>
              <strong className="text-slate-900 text-sm font-black">
                {sanitizedConclusion ? sanitizedConclusion.split('.')[0] : (anam?.medicalDiagnoses || anam?.consultationReason || 'Evaluación del Desarrollo Psicomotor')}
              </strong>
            </div>

            <div className="sm:col-span-2 pt-1 border-t border-slate-200/60">
              <span className="text-slate-500 font-semibold block text-[11px] sm:text-xs">
                Instrumento de Evaluación Aplicado:
              </span>
              <span className="text-slate-700 font-medium leading-relaxed">
                {evaluationInstrumentsText}
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 2: OBJETIVOS DE LA INTERVENCIÓN
           ========================================================================= */}
        <section className="space-y-2.5">
          <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider border-b-2 border-cyan-500 pb-1 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-700" />
            <span>2. Objetivos de la Intervención</span>
          </h3>

          <div className="bg-cyan-50/40 border border-cyan-200/80 rounded-2xl p-4 sm:p-5">
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
              {interventionGoalsList.map((goal, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-600 mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 3: ANAMNESIS
           ========================================================================= */}
        <section className="space-y-2.5">
          <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider border-b-2 border-cyan-500 pb-1 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-cyan-700" />
            <span>3. Anamnesis Inicial</span>
          </h3>

          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3">
            <p>
              {(anam?.consultationReason || `${patientFirstName} asiste a consulta derivado/a por su especialista para evaluación y apoyo en el desarrollo psicomotor.`)
                .replace(/integración sensorial/gi, 'psicomotricidad')
                .replace(/\bpaciente\b/gi, 'usuario')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">Antecedentes de Gestación y Parto:</span>
                <span>{anam?.pregnancyHistory || `Nacido/a a las ${anam?.gestationalAgeWeeks || '38'} semanas, ${anam?.birthType || 'parto eutócico'}, APGAR ${anam?.apgarScore || '9/10'}.`}</span>
              </div>
              {(isBaby || anam?.hipXrayScreening) && (
                <div>
                  <span className="text-slate-500 font-bold block">Radiografía / Ecografía de Caderas (Tamizaje Lactante):</span>
                  <span className="font-semibold text-cyan-950">
                    {anam?.hipXrayScreening || 'Pendiente de registro / Control de pelvis 3 meses'}
                  </span>
                </div>
              )}
              <div>
                <span className="text-slate-500 font-bold block">Rutinas de Sueño y Regulación:</span>
                <span>{anam?.sleepPattern || 'Sueño acorde a su etapa.'} {anam?.isRestless && !isBaby ? `Uso de pantallas: ${anam.isRestless}.` : ''}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">
                  {isBaby ? 'Contexto Familiar / Cuidado Diario:' : 'Escolaridad / Centro:'}
                </span>
                <span>
                  {isBaby
                    ? (anam?.schoolOrCenter && !anam.schoolOrCenter.toLowerCase().includes('colegio')
                        ? anam.schoolOrCenter
                        : `Hogar / Cuidado familiar (${anam?.caregiverName || 'Padres'})`)
                    : `${anam?.schoolOrCenter || 'Establecimiento educativo'} (${anam?.educationalLevel || 'Nivel acorde a edad'})`}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Farmacología / Suplementación:</span>
                <span>{anam?.pharmacology || (isBaby ? 'Vitamina D profiláctica acorde a indicación pediátrica.' : 'Sin medicamentos permanentes.')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 4: TABLAS CLÍNICAS (Medición | Criterio con Inicial | Intermedia | Final | Cambio ▲▼)
           ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-cyan-500 pb-1">
            <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-cyan-700" />
              <span>4. Tablas Clínicas: Desempeño Motor, Postural y Exploración de Estímulos (Medición | Criterio)</span>
            </h3>
            <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
              Eje Central Kinésico y Psicomotor
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Valoración prioritaria del control motor, tono muscular, equilibrio vestibular, propiocepción y respuesta a estímulos con evolución Inicial, Intermedia, Final y Cambio (▲/▼).
          </p>

          <KinesferaClinicalTables
            cranial={cranial}
            anamnesis={anam}
            evaluations={evalData}
            patientName={report.patientName}
            isBaby={isBaby}
          />

          {/* COMPLEMENTO FUNCIONAL SECUNDARIO: HABILIDADES DE COMUNICACIÓN (Omitido en lactantes y cuando no se ha realizado) */}
          {hasPerformedCommEval && (
            <div className="pt-2">
              <CriticalCommunicationTable
                patientId={report.patientId}
                patientName={report.patientName}
                onGoToLibrary={onGoToLibrary}
              />
            </div>
          )}
        </section>

        {/* =========================================================================
            SECCIÓN 5: GRÁFICOS (Máx. 4, colores Kinesfera, con "¿Qué significa esto?")
           ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-cyan-500 pb-1">
            <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-700" />
              <span>5. Gráficos de Progreso y Simetría</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              Máximo 4 gráficos con lenguaje simple para familias
            </span>
          </div>

          <div className="space-y-5">
            {/* Si existen datos craneales (ej. protocolo de plagiocefalia / braquicefalia) */}
            {cranial && (cranial.d1Mm !== undefined || cranial.differenceMm !== undefined) ? (
              <>
                {/* Gráfico 1: Barras agrupadas D1 vs D2 Inicial y Final con línea de simetría */}
                <CranialSymmetryBarsChart cranial={cranial} />

                {/* Gráfico 2: Línea de diferencia craneal en mm por evaluación */}
                <CranialDifferenceLineChart cranial={cranial} />

                {/* Gráfico 3: Proporción craneal / Índice Cefalométrico % */}
                <CephalicIndexChart cranial={cranial} />

                {/* Gráfico 4: Rangos de movimiento cervical (grados) der vs izq inicial vs final o semáforo */}
                {cranial.cervicalRomLeftDegInitial !== undefined || cranial.cervicalRomRightDegInitial !== undefined ? (
                  <CervicalRomBarsChart cranial={cranial} />
                ) : (
                  <PsychomotorTrafficLightChart bpm={bpm} spm={evalData?.spmSensoryMeasure} />
                )}
              </>
            ) : (
              <>
                {/* Para casos de neurodesarrollo / psicomotricidad / estímulos (ej. SPM o da Fonseca) */}
                <PsychomotorTrafficLightChart bpm={bpm} spm={evalData?.spmSensoryMeasure} />

                {comparativeItems.length > 0 && (
                  <FamilyComparativeBarChart items={comparativeItems} />
                )}

                {timelinePoints.length >= 2 && (
                  <FamilyTimelineProgressChart points={timelinePoints} />
                )}
              </>
            )}

            {/* SECCIÓN EVALUACIONES SPM POR EDAD (si están activas para incluir en informe) */}
            {spmEval && spmEval.includeInReport && (
              <div className="bg-white border border-purple-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2">
                  <div>
                    <span className="text-[11px] font-black uppercase text-purple-700 tracking-wider">
                      Evaluación Estandarizada
                    </span>
                    <h4 className="text-sm font-black text-slate-900">
                      Resultados {spmEval.formTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Evaluador: {spmEval.evaluatorName} ({spmEval.formContext}) · Fecha: {formatDateDMY(spmEval.evaluationDate)}
                    </p>
                  </div>
                  {onGoToSPM && (
                    <button
                      onClick={onGoToSPM}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors print:hidden cursor-pointer"
                    >
                      Editar Puntuaciones SPM →
                    </button>
                  )}
                </div>

                {/* Tabla de Resultados SPM */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-purple-50/80 text-purple-950 font-bold border-b border-purple-200">
                        <th className="py-2 px-2.5">Escala / Dimensión</th>
                        <th className="py-2 px-2 text-center">Puntaje Bruto</th>
                        <th className="py-2 px-2 text-center">Puntaje T</th>
                        <th className="py-2 px-2.5">Nivel Interpretativo</th>
                        <th className="py-2 px-2.5">Observación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {[
                        { key: 'vis', code: 'VIS', name: 'Visión' },
                        { key: 'hea', code: 'HEA', name: 'Audición' },
                        { key: 'tou', code: 'TOU', name: 'Tacto' },
                        { key: 'ts', code: 'T&S', name: 'Gusto y Olfato' },
                        { key: 'bod', code: 'BOD', name: 'Conciencia Corporal' },
                        { key: 'bal', code: 'BAL', name: 'Equilibrio y Movimiento' },
                        { key: 'st', code: 'ST', name: 'Puntaje Total Estímulos' },
                        { key: 'pln', code: 'PLN', name: 'Planificación e Ideas' },
                        { key: 'soc', code: 'SOC', name: 'Participación Social' }
                      ].map(item => {
                        const sc = (spmEval.scales as any)[item.key];
                        if (!sc) return null;
                        const isSevere = sc.tScore >= 70;
                        const isModerate = sc.tScore >= 60 && sc.tScore < 70;
                        return (
                          <tr key={item.key} className="hover:bg-slate-50/60">
                            <td className="py-2 px-2.5 font-bold text-slate-900">
                              {item.code} - {item.name}
                            </td>
                            <td className="py-2 px-2 text-center font-mono font-medium">{sc.raw}</td>
                            <td className="py-2 px-2 text-center font-mono font-black">
                              <span className={`px-2 py-0.5 rounded-md ${
                                isSevere ? 'bg-rose-100 text-rose-800' : isModerate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {sc.tScore} T
                              </span>
                            </td>
                            <td className="py-2 px-2.5">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isSevere ? 'bg-rose-50 text-rose-700 border border-rose-200' : isModerate ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {sc.range}
                              </span>
                            </td>
                            <td className="py-2 px-2.5 text-slate-600 text-[11px]">{sc.interpretation}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Perfil SPM Gráfico de Barras Simple */}
                <div className="pt-3 border-t border-purple-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Gráfico de Perfil: Puntajes T (Línea naranja: 60T Moderada · Línea roja: 70T Severa)
                  </span>
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-1.5">
                    {[
                      { key: 'vis', code: 'VIS' },
                      { key: 'hea', code: 'HEA' },
                      { key: 'tou', code: 'TOU' },
                      { key: 'ts', code: 'T&S' },
                      { key: 'bod', code: 'BOD' },
                      { key: 'bal', code: 'BAL' },
                      { key: 'st', code: 'ST' },
                      { key: 'pln', code: 'PLN' },
                      { key: 'soc', code: 'SOC' }
                    ].map(item => {
                      const sc = (spmEval.scales as any)[item.key];
                      if (!sc) return null;
                      const pct = Math.min(100, Math.max(0, ((sc.tScore - 40) / 40) * 100));
                      const isSevere = sc.tScore >= 70;
                      const isModerate = sc.tScore >= 60 && sc.tScore < 70;
                      return (
                        <div key={item.key} className="flex items-center gap-2 text-xs">
                          <span className="w-10 font-mono font-bold text-slate-700 shrink-0 text-[11px]">
                            {item.code}
                          </span>
                          <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-amber-500 z-10" />
                            <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-rose-500 z-10" />
                            <div
                              className={`h-full rounded-full ${
                                isSevere ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-10 text-right font-mono font-bold text-slate-800 text-[11px]">
                            {sc.tScore} T
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-purple-50/60 border border-purple-200/60 rounded-xl p-3 text-xs text-purple-950">
                  <p className="font-semibold">
                    💡 <strong>¿Qué significa esto para la familia?:</strong> Puntuaciones entre 40T y 59T indican una respuesta típica para la edad. Puntuaciones sobre 60T indican mayor reactividad o búsqueda de estímulos {isBaby ? 'en el hogar y durante las rutinas de cuidado diario' : 'en el ambiente cotidiano y hogareño'}, abordadas mediante adecuaciones psicomotrices y de rutina.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 6: CONCLUSIONES (Parte técnica + Resumen simple en 3 líneas)
           ========================================================================= */}
        <section className="space-y-3.5">
          <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider border-b-2 border-cyan-500 pb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-700" />
            <span>6. Conclusiones Clínicas y Síntesis Familiar</span>
          </h3>

          {/* 6.1 Parte Técnica */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-800 space-y-2">
            <strong className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Conclusión Técnica Profesional:
            </strong>
            <p className="leading-relaxed">
              {sanitizedConclusion}
            </p>
            {evalData?.prognosis && (
              <p className="text-xs text-slate-600 font-medium italic pt-1 border-t border-slate-200/60">
                <strong>Pronóstico Terapéutico:</strong> {evalData.prognosis.replace(/integración sensorial/gi, 'psicomotricidad').replace(/\bpaciente\b/gi, 'usuario')}
              </p>
            )}
          </div>

          {/* 6.2 Resumen simple en 3 líneas para la familia */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-cyan-50/60 border border-emerald-300 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs uppercase tracking-wider">
              <span>🌱 Resumen en 3 Líneas para la Familia:</span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-amber-800 shrink-0">1. Cómo llegó:</span>
                <span className="text-slate-800">{summary.arrival}</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1.5 border-t border-slate-200/60">
                <span className="font-bold text-blue-800 shrink-0">2. Qué se trabajó:</span>
                <span className="text-slate-800">{summary.workDone}</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1.5 border-t border-slate-200/60">
                <span className="font-bold text-emerald-800 shrink-0">3. Cómo está hoy:</span>
                <span className="text-slate-900 font-bold">{summary.currentState}</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 7: PLAN DE INTERVENCIÓN (Área Motora y Área de Exploración y respuesta a estímulos)
           ========================================================================= */}
        <section className="space-y-3">
          <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider border-b-2 border-cyan-500 pb-1 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-700" />
            <span>7. Plan de Intervención</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Área Motora */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-2">
              <h4 className="font-black text-sky-950 uppercase text-xs flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-600" />
                <span>Área Motora y Kinesiológica</span>
              </h4>
              {isBaby ? (
                <ul className="space-y-1.5 text-slate-700 list-disc pl-4 text-xs">
                  <li><strong>Control Cefálico y Simetría Cervical:</strong> Facilitación del alineamiento en línea media, seguimiento visual bilateral y elongación suave de musculatura cervical.</li>
                  <li><strong>Juego en Prono y Apoyo de EESS:</strong> Descarga de peso simétrica en antebrazos y manos para favorecer la estabilidad escapular y extensión axial.</li>
                  <li><strong>Transiciones y Giros en Suelo:</strong> Facilitación de giros supino-prono, alcance en decúbito lateral y disociación de cinturas.</li>
                  <li><strong>Hitos del Neurodesarrollo:</strong> Estimulación progresiva de sedestación, reacciones de enderezamiento y desplazamiento autónomo.</li>
                </ul>
              ) : (
                <ul className="space-y-1.5 text-slate-700 list-disc pl-4 text-xs">
                  <li><strong>Equilibrio y Vestibular:</strong> Actividades en superficies inestables, apoyo unipodal y giros controlados.</li>
                  <li><strong>Noción del Cuerpo:</strong> Reconocimiento somatognósico, cruce de línea media y juegos de imitación.</li>
                  <li><strong>Estructuración Espacio-Temporal:</strong> Circuitos de obstáculos, laberintos motores y secuencias rítmicas.</li>
                  <li><strong>Praxia Global y Fina:</strong> Trepa, saltos coordinados, disociación y grafomotricidad con presión graduada.</li>
                </ul>
              )}
            </div>

            {/* Área de Exploración y respuesta a estímulos (Renombrado según Requerimiento 1) */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2">
              <h4 className="font-black text-emerald-950 uppercase text-xs flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-emerald-600" />
                <span>Área de Exploración y respuesta a estímulos</span>
              </h4>
              {isBaby ? (
                <ul className="space-y-1.5 text-slate-700 list-disc pl-4 text-xs">
                  <li><strong>Conciencia Corporal Temprana (Propiocepción):</strong> Contacto profundo calmante, contención en flexión fisiológica y exploración manos-línea media-pies.</li>
                  <li><strong>Experiencia Vestibular Suave:</strong> Cambios de posición lentos y predecibles en brazos y superficie firme para favorecer la seguridad postural.</li>
                  <li><strong>Exploración Táctil y Visual:</strong> Presentación graduada de texturas seguras y juguetes de alto contraste promoviendo el giro activo hacia ambos lados.</li>
                  <li><strong>Rutinas del Hogar y Vínculo:</strong> Acompañamiento a los cuidadores en el porteo ergonómico, muda activa y regulación sueño-vigilia.</li>
                </ul>
              ) : (
                <ul className="space-y-1.5 text-slate-700 list-disc pl-4 text-xs">
                  <li><strong>Conciencia Corporal (Propiocepción):</strong> Ejercicios de carga articular y graduación de fuerza manual.</li>
                  <li><strong>Procesamiento Vestibular:</strong> Juegos de balanceo suave y aceleración lineal para la calma y alerta.</li>
                  <li><strong>Modulación y Regulación del Entorno:</strong> Estrategias para tolerar estímulos del ambiente cotidiano y optimizar la atención sostenida.</li>
                  <li><strong>Pausas Activas:</strong> Microdescansos de movimiento estructurado cada 15 a 20 minutos durante actividades de mesa.</li>
                  {hasInstructionLimitation && (
                    <li className="text-emerald-950 font-bold bg-emerald-100/70 p-2 rounded-xl border border-emerald-300 list-none mt-2">
                      🎯 <strong>Seguimiento de Instrucciones:</strong> Lograr que el usuario siga instrucciones a través de la intervención kinésica y psicomotriz mediante consignas estructuradas y refuerzo lúdico.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 8: RECOMENDACIONES PARA EL HOGAR (Máximo 5 pautas concretas)
           ========================================================================= */}
        <section className="space-y-3">
          <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider border-b-2 border-cyan-500 pb-1 flex items-center gap-1.5">
            <Home className="w-4 h-4 text-cyan-700" />
            <span>8. Educación Familiar y Recomendaciones para el Hogar (Máx. 5)</span>
          </h3>

          <div className="space-y-2.5">
            {homeTips.slice(0, 5).map((tip, idx) => (
              <div
                key={idx}
                className="bg-amber-50/40 border border-amber-200/90 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 shadow-2xs"
              >
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
                  {idx + 1}
                </span>
                <div className="space-y-0.5 text-xs sm:text-sm">
                  <strong className="text-slate-900 block font-bold">
                    {tip.title}
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 9: SEGUIMIENTO (Sesiones, Frecuencia, Reevaluación, Derivaciones)
           ========================================================================= */}
        <section className="space-y-3">
          <h3 className="text-xs sm:text-sm font-black text-cyan-900 uppercase tracking-wider border-b-2 border-cyan-500 pb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-700" />
            <span>9. Seguimiento y Plan de Continuidad</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-bold block text-xs">Sesiones Programadas:</span>
              <strong className="text-slate-900">{followUpSessions}</strong>
            </div>

            <div>
              <span className="text-slate-500 font-bold block text-xs">Frecuencia Semanal:</span>
              <span className="text-slate-800 font-medium">{followUpFrequency}</span>
            </div>

            <div>
              <span className="text-slate-500 font-bold block text-xs">Próxima Reevaluación:</span>
              <span className="text-cyan-950 font-bold">{followUpNextReeval}</span>
            </div>

            <div>
              <span className="text-slate-500 font-bold block text-xs">Derivaciones y Coordinación:</span>
              <span className="text-slate-800">{followUpReferrals}</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FIRMA PROFESIONAL AL FINAL
           ========================================================================= */}
        <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 break-inside-avoid">
          <div className="text-center w-72 pt-3 border-t border-slate-800">
            <p className="font-black text-base text-slate-900">Aldo Olivares Araya</p>
            <p className="text-xs text-slate-600 font-bold">Registro SIS: 515956</p>
            <p className="text-xs text-slate-600">Kinesiólogo, Especialista en Psicomotricidad</p>
            <p className="text-xs text-cyan-800 font-bold mt-0.5">Centro Clínico Kinesfera · Creando Sentido Al Juego</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Enviar por WhatsApp</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. MODAL DE COMPARTIR POR WHATSAPP */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Compartir por WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enviar informe a la familia de {patientFirstName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Teléfono del apoderado/a (Chile ej: +56 9 8456 1234)
              </label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
              />
            </div>

            {/* Vista previa del mensaje */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  Vista previa del texto:
                </span>
                <button
                  type="button"
                  onClick={handleCopyWhatsApp}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedWhatsApp ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed select-all">
                {formattedWhatsAppText}
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Abrir WhatsApp Ahora</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. MODAL PAUTA SEMANAL (si está activa) */}
      {showWeeklyPracticeModal && (
        <WeeklyHomePracticeModal
          patient={{
            id: report.patientId,
            email: '',
            role: 'Padre/Niño',
            gender: 'Hombre',
            plan: 'Premium',
            credits: 50,
            firstName: report.patientName.split(' ')[0] || report.patientName,
            lastName: report.patientName.split(' ').slice(1).join(' ') || '',
            rut: report.patientRut,
            birthDate: report.patientBirthDate,
            medicalRecordNumber: report.medicalRecordNumber,
            diagnosis: report.evaluations?.functionalDiagnosisCIF || report.clinicalSummary,
            emergencyContact: {
              name: report.anamnesis?.caregiverName || 'Tutor legal',
              relationship: 'Apoderado/a',
              phone: report.anamnesis?.caregiverPhone || ''
            }
          }}
          anamnesis={report.anamnesis}
          evaluations={report.evaluations}
          progressNotes={patientNotes}
          clinicianName={report.professionalName}
          clinicianSpecialty={report.professionalSpecialty}
          clinicianInstitution={report.institution}
          isOpen={showWeeklyPracticeModal}
          onClose={() => setShowWeeklyPracticeModal(false)}
        />
      )}

    </div>
  );
};

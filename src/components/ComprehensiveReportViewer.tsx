import React, { useState } from 'react';
import { ComprehensiveReport, User } from '../types';
import { downloadReportAsWord } from '../utils/documentExport';
import { calculatePatientAge } from '../utils/ageHelper';
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
  Building2, 
  Phone, 
  Heart,
  Activity,
  Brain,
  Scale,
  MessageSquare,
  GraduationCap,
  Home,
  Send
} from 'lucide-react';

interface ComprehensiveReportViewerProps {
  report: ComprehensiveReport;
  onEditReport?: () => void;
  onSelectAnotherPatient?: () => void;
}

export const ComprehensiveReportViewer: React.FC<ComprehensiveReportViewerProps> = ({
  report,
  onEditReport
}) => {
  const { anamnesis, evaluations } = report;
  const cranial = anamnesis?.cranialMeasurements;
  const earlyObs = anamnesis?.earlyInfantObservation;
  const psychomotor = evaluations?.psychomotorObservation;
  const criticalComm = evaluations?.criticalCommunication;
  const hine = evaluations?.hineExam;
  const spm = evaluations?.spmSensoryMeasure;
  const bpm = evaluations?.daFonsecaBpm;

  const [showWeeklyPracticeModal, setShowWeeklyPracticeModal] = useState(false);
  const ageInfo = calculatePatientAge(report.patientBirthDate);

  const handleDownloadWord = () => {
    downloadReportAsWord(report);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header Strip (Hidden in print) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Informe Clínico Consolidado: {report.patientName}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ageInfo.isOlderThanThree ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {ageInfo.ageText} ({ageInfo.stageBadgeText})
              </span>
            </div>
            <p className="text-xs text-slate-500">
              RUT: <strong className="font-mono text-slate-700">{report.patientRut}</strong> · Ficha: {report.medicalRecordNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEditReport && (
            <button
              onClick={onEditReport}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Evaluación</span>
            </button>
          )}

          {/* Weekly Practice WhatsApp / PDF button */}
          <button
            onClick={() => setShowWeeklyPracticeModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer ring-2 ring-emerald-300/40"
            title="Generar y Enviar Pauta Semanal para WhatsApp / PDF a la familia"
          >
            <Phone className="w-4 h-4 text-emerald-100" />
            <span>📲 Pauta Semanal (WhatsApp / PDF)</span>
          </button>

          {/* Download WORD button */}
          <button
            onClick={handleDownloadWord}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Descargar archivo editable en Microsoft Word (.doc)"
          >
            <Download className="w-4 h-4" />
            <span>Descargar en Word (.doc)</span>
          </button>

          {/* Download / Print PDF button */}
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Imprimir o Guardar como PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Descargar en PDF / Imprimir</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Clinical Report Sheet (Styled for Screen & Printing) */}
      <div className="bg-white border border-slate-300 rounded-2xl p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-8 text-slate-900 font-sans print:shadow-none print:border-none print:p-0">
        
        {/* Official Company Document Header with Logo Option */}
        <CompanyDocumentHeader
          documentTitle="Informe de Evaluación Neuropsicomotriz Integral"
          documentSubtitle={`${report.institution} · Kinesiología Pediátrica · Neurorehabilitación`}
          emissionDate={report.dateGenerated}
          recordNumber={report.medicalRecordNumber}
        />

        {/* 1. Identificación del Paciente y Antecedentes Generales */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider border-b border-blue-200 pb-1 flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5" />
            <span>1. Identificación del Paciente y Antecedentes Generales</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Nombre y Apellidos:</span>
              <strong className="text-slate-900 text-sm">{report.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">R.U.T. Paciente:</span>
              <span className="font-mono font-bold text-slate-800">{report.patientRut}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Fecha de Nacimiento:</span>
              <span>{report.patientBirthDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Colegio / Curso / Jardín:</span>
              <span>{anamnesis?.schoolOrCenter || 'No informado'} ({anamnesis?.educationalLevel || '-'})</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Personas que conviven en el hogar:</span>
              <span className="text-slate-800 font-medium">{anamnesis?.householdMembers || 'No informado'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Apoderado / Tutor:</span>
              <span>{anamnesis?.caregiverName || 'No informado'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Teléfono de Contacto:</span>
              <span className="font-mono">{anamnesis?.caregiverPhone || '-'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Motivo de Consulta:</span>
              <span className="text-slate-900 font-bold">{anamnesis?.consultationReason || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">¿Cuándo lo notaron?:</span>
              <span>{anamnesis?.problemNoticedWhen || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Especialistas Consultados:</span>
              <span>{anamnesis?.specialistsVisited || '-'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Tratamientos Previos:</span>
              <span>{anamnesis?.previousTreatments || '-'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Expectativas Familiares:</span>
              <span>{anamnesis?.familyExpectations || '-'}</span>
            </div>
          </div>
        </div>

        {/* 2. Antecedentes del Embarazo y Parto */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider border-b border-blue-200 pb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>2. Antecedentes del Embarazo, Parto y Perinatal</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Historia Gestacional:</span>
              <span className="text-slate-800">{anamnesis?.pregnancyHistory || 'Embarazo controlado sin complicaciones'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Edad Gestacional & Tipo de Parto:</span>
              <strong>{anamnesis?.gestationalAgeWeeks || '-'}</strong> · {anamnesis?.birthType || '-'}
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Presentación al nacer:</span>
              <span>{anamnesis?.birthPresentation || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Somatometría de Nacimiento:</span>
              <span>Peso: <strong>{anamnesis?.birthWeightGrams || '-'}</strong> | Talla: {anamnesis?.birthLengthCm || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Score APGAR:</span>
              <strong>{anamnesis?.apgarScore || '-'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Alimentación y Lactancia:</span>
              <span>{anamnesis?.feedingType || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Cólicos:</span>
              <span>{anamnesis?.colic || '-'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Patrón de Sueño:</span>
              <span>{anamnesis?.sleepPattern || '-'}</span>
            </div>
          </div>
        </div>

        {/* 3. Hitos del Desarrollo Psicomotor y del Lenguaje */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider border-b border-blue-200 pb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>3. Hitos del Desarrollo Psicomotor y del Lenguaje</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Control Cefálico</span>
              <strong className="text-slate-900">{anamnesis?.headControlMonths || '-'}</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sedente Autónomo</span>
              <strong className="text-slate-900">{anamnesis?.independentSittingMonths || '-'}</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Gateo</span>
              <strong className="text-slate-900">{anamnesis?.crawlingMonths || '-'}</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Bipedestación</span>
              <strong className="text-slate-900">{anamnesis?.standingMonths || '-'}</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Marcha</span>
              <strong className="text-slate-900">{anamnesis?.walkingMonths || '-'}</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Primeras Palabras</span>
              <strong className="text-slate-900">{anamnesis?.firstWords || '-'}</strong>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500 font-bold">Estado motor actual: </span>
            <span className="text-slate-800">{anamnesis?.currentMotorStatus || '-'}</span>
          </div>
        </div>

        {/* 4. Si corresponde: Protocolo de Asimetrías Craneales con Mediciones */}
        {cranial && (
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider border-b border-blue-200 pb-1 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>4. Protocolo Clínico de Asimetrías Craneales (Craneometría)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Plagiocefalia Card */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
                <h4 className="font-bold text-sky-900 text-xs uppercase tracking-wide">
                  Protocolo de Plagiocefalia
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>Diagonal 1 (D1): <strong>{cranial.d1Mm || '-'} mm</strong></div>
                  <div>Diagonal 2 (D2): <strong>{cranial.d2Mm || '-'} mm</strong></div>
                  <div>Diferencia (|D1-D2|): <strong className="text-sky-900 font-mono text-sm">{cranial.differenceMm || '-'} mm</strong></div>
                  <div>Índice CVAI: <strong>{cranial.cvaiPercent ? cranial.cvaiPercent + '%' : '-'}</strong></div>
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block">Clasificación:</span>
                  <span className="px-2.5 py-1 bg-sky-600 text-white font-bold rounded-md inline-block mt-0.5 text-xs">
                    {cranial.plagiocephalySeverity || 'En evaluación'}
                  </span>
                </div>
              </div>

              {/* Braquicefalia Card */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wide">
                  Protocolo de Braquicefalia / Dolicocefalia
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>Diámetro AP: <strong>{cranial.apMm || '-'} mm</strong></div>
                  <div>Diámetro BP (PP): <strong>{cranial.bpMm || '-'} mm</strong></div>
                  <div className="col-span-2">
                    Índice Cefalométrico [(BP/AP)*100]: <strong className="text-blue-900 font-mono text-sm">{cranial.cephalicIndex ? cranial.cephalicIndex + '%' : '-'}</strong>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block">Clasificación:</span>
                  <span className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-md inline-block mt-0.5 text-xs">
                    {cranial.brachycephalyClassification || 'En evaluación'}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <span className="text-slate-500 font-bold">Indicación Kinésica Craneal: </span>
                <span className="text-slate-800 font-medium">{cranial.treatmentIndication || 'Pauta de reposicionamiento y seguimiento.'}</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Si corresponde: Conductas Emocionales y Relaciones Interpersonales (>2 años) */}
        {anamnesis?.followsInstructions && anamnesis?.followsInstructions !== 'No corresponde' && (
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider border-b border-blue-200 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>5. Conductas Emocionales, Relaciones y Medicamentos</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">¿Sigue instrucciones?:</span>
                <strong>{anamnesis.followsInstructions}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">¿Se muestra inquieto?:</span>
                <strong>{anamnesis.isRestless || '-'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Juego y autonomía:</span>
                <span>{anamnesis.playsAloneOrAccompanied || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Rutina al acostarse:</span>
                <span>{anamnesis.bedtimeRoutine || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Miedos y Pesadillas:</span>
                <span>Miedos: {anamnesis.hasFears || '-'} | Pesadillas: {anamnesis.nightmares || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Rabietas / Enfados:</span>
                <span>{anamnesis.tantrums || '-'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[11px]">Relaciones Interpersonales:</span>
                <span>Familia: {anamnesis.familyRelationships || '-'} | Colegio: {anamnesis.schoolRelationships || '-'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[11px]">Antecedentes Familiares (TEA / TDAH / Asperger):</span>
                <strong className="text-slate-800">{anamnesis.familyDiagnoses || 'Sin antecedentes reportados'}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[11px]">Farmacología y Suplementación:</span>
                <strong className="text-blue-900">{anamnesis.pharmacology || 'Sin fármacos'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 6. Pruebas Clínicas Aplicadas (Kinesfera, SPM-2, Da Fonseca) */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider border-b border-blue-200 pb-1 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>6. Pruebas Clínicas y Parámetros Psicomotores Aplicados</span>
          </h2>

          {/* Examen Neurológico de Hammersmith (HINE) para menores de 2 años */}
          {hine && (
            <div className="p-4 bg-sky-50/80 rounded-xl border border-sky-200 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sky-200/80 pb-2 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-sky-700 text-white px-2 py-0.5 rounded-full">
                      HINE Oficial (v08.02.19)
                    </span>
                    <span className="text-[10px] font-bold text-sky-900 bg-white px-2 py-0.5 rounded-full border border-sky-300">
                      Optimalidad Máx. 78 Pts
                    </span>
                  </div>
                  <h3 className="font-bold text-sky-950 uppercase text-xs mt-1">
                    Examen Neurológico Infantil de Hammersmith (HINE)
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-sky-900 text-sm">{hine.totalScore ?? 0} / 78 pts</span>
                  <span className={`ml-2 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                    (hine.riskLevel || '').includes('Óptimo') ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    (hine.riskLevel || '').includes('Leve') ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {hine.riskLevel || 'Evaluado'}
                  </span>
                </div>
              </div>

              {/* Subtotales por sección */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center text-[11px] font-semibold">
                <div className="p-1.5 bg-white rounded-lg border border-sky-200">
                  <span className="text-[10px] text-slate-500 block">Pares Craneales</span>
                  <strong className="text-sky-950">{hine.cranialNervesSubtotal ?? (
                    (hine.facialAnimation ?? 0) + (hine.eyeMovements ?? 0) + (hine.visualFollow ?? 0) + (hine.auditoryResponse ?? 0) + (hine.suckSwallow ?? 0)
                  )}/15</strong>
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-sky-200">
                  <span className="text-[10px] text-slate-500 block">Postura</span>
                  <strong className="text-sky-950">{hine.postureSubtotal ?? (
                    (hine.headPosture ?? 0) + (hine.trunkPosture ?? 0) + (hine.armPosture ?? 0) + (hine.handsPosture ?? 0) + (hine.legPosture ?? 0) + (hine.legsSupineProne ?? 0) + (hine.feetPosture ?? 0)
                  )}/18</strong>
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-sky-200">
                  <span className="text-[10px] text-slate-500 block">Movimientos</span>
                  <strong className="text-sky-950">{hine.movementsSubtotal ?? (
                    (hine.movementsQuantity ?? 0) + (hine.movementsQuality ?? 0)
                  )}/6</strong>
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-sky-200">
                  <span className="text-[10px] text-slate-500 block">Tono Muscular</span>
                  <strong className="text-sky-950">{hine.toneSubtotal ?? (
                    (hine.scarfSign ?? 0) + (hine.passiveShoulderElevation ?? 0) + (hine.pronationSupination ?? 0) + (hine.adductorsAngle ?? 0) + (hine.poplitealAngle ?? 0) + (hine.ankleDorsiflexionAngle ?? 0) + (hine.pullToSit ?? 0) + (hine.ventralSuspension ?? 0)
                  )}/24</strong>
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-sky-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block">Reflejos/Reacc.</span>
                  <strong className="text-sky-950">{hine.reflexesSubtotal ?? (
                    (hine.armProtectionReaction ?? 0) + (hine.verticalSuspension ?? 0) + (hine.lateralTilting ?? 0) + (hine.forwardParachute ?? 0) + (hine.tendonReflexes ?? 0)
                  )}/15</strong>
                </div>
              </div>

              {/* Detalle de los 26 Ítems del Examen Neurológico */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700 bg-white/70 p-3 rounded-xl border border-sky-100">
                <div>• Apariencia facial: <strong>{hine.facialAnimation ?? '-'}/3</strong></div>
                <div>• Movimientos oculares: <strong>{hine.eyeMovements ?? '-'}/3</strong></div>
                <div>• Seguimiento visual: <strong>{hine.visualFollow ?? '-'}/3</strong></div>
                <div>• Respuesta auditiva: <strong>{hine.auditoryResponse ?? '-'}/3</strong></div>
                <div>• Succión y deglución: <strong>{hine.suckSwallow ?? '-'}/3</strong></div>
                
                <div>• Cabeza en sentado: <strong>{hine.headPosture ?? '-'}/3</strong></div>
                <div>• Tronco en sentado: <strong>{hine.trunkPosture ?? '-'}/3</strong></div>
                <div>• Brazos en reposo: <strong>{hine.armPosture ?? '-'}/3</strong></div>
                <div>• Manos (abiertas/puño): <strong>{hine.handsPosture ?? '-'}/3</strong></div>
                <div>• Piernas en sentado: <strong>{hine.legPosture ?? '-'}/3</strong></div>
                <div>• Piernas en supino/pie: <strong>{hine.legsSupineProne ?? '-'}/3</strong></div>
                <div>• Pies (neutro/puntillas): <strong>{hine.feetPosture ?? '-'}/3</strong></div>
                
                <div>• Cantidad de movimientos: <strong>{hine.movementsQuantity ?? '-'}/3</strong></div>
                <div>• Calidad movimientos espontáneos: <strong>{hine.movementsQuality ?? '-'}/3</strong></div>

                <div>• Signo de bufanda / chal: <strong>{hine.scarfSign ?? '-'}/3</strong></div>
                <div>• Mov. hombro pasivo (elevación): <strong>{hine.passiveShoulderElevation ?? '-'}/3</strong></div>
                <div>• Pronación / supinación antebrazo: <strong>{hine.pronationSupination ?? '-'}/3</strong></div>
                <div>• Aductores de cadera: <strong>{hine.adductorsAngle ?? '-'}/3</strong></div>
                <div>• Ángulo poplíteo: <strong>{hine.poplitealAngle ?? '-'}/3</strong></div>
                <div>• Dorsiflexión de tobillo: <strong>{hine.ankleDorsiflexionAngle ?? '-'}/3</strong></div>
                <div>• Tracción al sedente (pull-to-sit): <strong>{hine.pullToSit ?? '-'}/3</strong></div>
                <div>• Suspensión ventral: <strong>{hine.ventralSuspension ?? '-'}/3</strong></div>

                <div>• Protección de brazos: <strong>{hine.armProtectionReaction ?? '-'}/3</strong></div>
                <div>• Suspensión vertical (pataleo): <strong>{hine.verticalSuspension ?? '-'}/3</strong></div>
                <div>• Inclinación lateral (enderezamiento): <strong>{hine.lateralTilting ?? '-'}/3</strong></div>
                <div>• Paracaídas hacia adelante: <strong>{hine.forwardParachute ?? '-'}/3</strong></div>
                <div>• Reflejos osteotendinosos: <strong>{hine.tendonReflexes ?? '-'}/3</strong></div>
              </div>

              {/* Sección 2: Hitos Motores */}
              {hine.motorMilestones && (
                <div className="p-3 bg-white/80 rounded-xl border border-sky-200/80 space-y-1.5">
                  <span className="font-bold text-[11px] text-sky-950 uppercase tracking-wider block">
                    Sección 2: Hitos Motores Evolutivos (HINE)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                    <div>• Control cabeza: <strong>{hine.motorMilestones.headControl || '-'}</strong></div>
                    <div>• Sedente: <strong>{hine.motorMilestones.sitting || '-'}</strong></div>
                    <div>• Agarre voluntario: <strong>{hine.motorMilestones.voluntaryGrasp || '-'}</strong></div>
                    <div>• Patada en supino: <strong>{hine.motorMilestones.supineKicking || '-'}</strong></div>
                    <div>• Giros (rodando): <strong>{hine.motorMilestones.rolling || '-'}</strong></div>
                    <div>• Gateo: <strong>{hine.motorMilestones.crawling || '-'}</strong></div>
                    <div>• De pie: <strong>{hine.motorMilestones.standing || '-'}</strong></div>
                    <div>• Caminando: <strong>{hine.motorMilestones.walking || '-'}</strong></div>
                  </div>
                </div>
              )}

              {/* Sección 3: Comportamiento */}
              {hine.behavior && (
                <div className="p-3 bg-white/80 rounded-xl border border-sky-200/80 space-y-1.5">
                  <span className="font-bold text-[11px] text-sky-950 uppercase tracking-wider block">
                    Sección 3: Comportamiento Durante el Examen (Escala 1 a 6)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                    <div>• Estado Consciente: <strong>{hine.behavior.consciousState ?? '-'}/6</strong></div>
                    <div>• Estado Emocional: <strong>{hine.behavior.emotionalState ?? '-'}/6</strong></div>
                    <div>• Orientación Social: <strong>{hine.behavior.socialOrientation ?? '-'}/6</strong></div>
                  </div>
                </div>
              )}

              {hine.clinicalObservations && (
                <p className="text-slate-600 text-xs italic pt-1 border-t border-sky-200/50">
                  <strong>Observaciones y Asimetrías:</strong> {hine.clinicalObservations}
                </p>
              )}
            </div>
          )}

          {/* Pauta de Parámetros Psicomotores de Pilar Arnaiz */}
          {psychomotor && (
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2 text-xs">
              <h3 className="font-bold text-amber-950 uppercase text-xs">
                Pauta de Observación de Parámetros Psicomotores de Pilar Arnaiz (Juego Libre)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div>• Movimientos frecuentes: <strong>{psychomotor.movementsFrequent || '-'}</strong></div>
                <div>• Calidad de movimientos: <strong>{psychomotor.movementsQuality || '-'}</strong></div>
                <div>• Grado de movilidad corporal: <strong>{psychomotor.bodyMobilityLevel || '-'}</strong></div>
                <div>• Posturas habituales y tono: <strong>{psychomotor.posturesFrequent || '-'}</strong></div>
                <div>• Ocupación del espacio: <strong>{psychomotor.spaceOccupancy || '-'}</strong></div>
                <div>• Vías y niveles espaciales: <strong>{psychomotor.spaceTrajectory || '-'} {psychomotor.spaceLevels ? `(${psychomotor.spaceLevels})` : ''}</strong></div>
                <div>• Ritmo y duración: <strong>{psychomotor.rhythmQuality || '-'} {psychomotor.activityDuration ? `(${psychomotor.activityDuration})` : ''}</strong></div>
                <div>• Uso de objetos: <strong>{psychomotor.objectUsage || '-'}</strong></div>
                <div>• Relación con compañeros: <strong>{psychomotor.companionsRelation || '-'}</strong></div>
                <div>• Relación con adulto: <strong>{psychomotor.adultRelation || '-'}</strong></div>
                {psychomotor.globalSynthesis && (
                  <div className="sm:col-span-2 pt-1 border-t border-amber-200/80">
                    <span className="font-bold text-amber-900">• Síntesis psicomotriz global: </span>
                    <span className="text-slate-800">{psychomotor.globalSynthesis}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lista de Control de Habilidades de Comunicación Críticas y Funcionales */}
          {criticalComm && (
            <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-orange-200/80 pb-2 gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-700 text-white px-2 py-0.5 rounded-full">
                    Comunicación Funcional y Aumentativa (CAA)
                  </span>
                  <h3 className="font-bold text-orange-950 uppercase text-xs mt-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-orange-700" />
                    <span>Lista de Control de las Habilidades de Comunicación Críticas</span>
                  </h3>
                  <p className="text-[11px] text-orange-800">
                    Para niños mayores de 2 años en desarrollo temprano de comunicación o que no siguen órdenes verbales directas.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-slate-700">
                {/* 1. Reforzadores */}
                <div className="bg-white/80 p-2.5 rounded-lg border border-orange-200/60">
                  <strong className="text-orange-900 block text-[11px] mb-1">
                    1. Pedir Reforzadores (¿Apropiado?: {criticalComm.reinforcersAppropriate || '-'})
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>• Comestibles: <strong>{criticalComm.reinforcersFood || '-'}</strong></div>
                    <div>• Juguetes: <strong>{criticalComm.reinforcersToys || '-'}</strong></div>
                    <div>• Actividades: <strong>{criticalComm.reinforcersActivities || '-'}</strong></div>
                  </div>
                </div>

                {/* 2 a 7: Habilidades Básicas */}
                <div className="bg-white/80 p-2.5 rounded-lg border border-orange-200/60">
                  <strong className="text-orange-900 block text-[11px] mb-1">
                    Habilidades de Comunicación Funcional (2 al 7)
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>• Pedir ayuda: <strong>{criticalComm.askHelpAppropriate || '-'}</strong> {criticalComm.askHelpExample ? `(${criticalComm.askHelpExample})` : ''}</div>
                    <div>• Pedir descansos: <strong>{criticalComm.askBreaksAppropriate || '-'}</strong> {criticalComm.askBreaksExample ? `(${criticalComm.askBreaksExample})` : ''}</div>
                    <div>• Rechazar (No): <strong>{criticalComm.rejectAppropriate || '-'}</strong> {criticalComm.rejectExample ? `(${criticalComm.rejectExample})` : ''}</div>
                    <div>• Aceptar (Sí): <strong>{criticalComm.affirmAcceptAppropriate || '-'}</strong> {criticalComm.affirmAcceptExample ? `(${criticalComm.affirmAcceptExample})` : ''}</div>
                    <div>• Responder a espera: <strong>{criticalComm.respondWaitAppropriate || '-'}</strong> {criticalComm.respondWaitExample ? `(${criticalComm.respondWaitExample})` : ''}</div>
                    <div>• Transición actividades: <strong>{criticalComm.transitionActivitiesAppropriate || '-'}</strong> {criticalComm.transitionActivitiesExample ? `(${criticalComm.transitionActivitiesExample})` : ''}</div>
                  </div>
                </div>

                {/* 8. Responder a instrucciones */}
                <div className="bg-white/80 p-2.5 rounded-lg border border-orange-200/60">
                  <strong className="text-orange-900 block text-[11px] mb-1">
                    8. Responder a Instrucciones (Visuales vs Verbales)
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[10px] uppercase">Apoyo Visual (Gestos / Señalización):</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {criticalComm.visualOrientToName && <li>Orientarse al nombre: {criticalComm.visualOrientToName}</li>}
                        {criticalComm.visualComeHere && <li>"Ven aquí": {criticalComm.visualComeHere}</li>}
                        {criticalComm.visualStop && <li>"Para": {criticalComm.visualStop}</li>}
                        {criticalComm.visualSitDown && <li>"Siéntate": {criticalComm.visualSitDown}</li>}
                        {criticalComm.visualGiveItToMe && <li>"Dámelo": {criticalComm.visualGiveItToMe}</li>}
                        {criticalComm.visualGoForKnownObject && <li>Ir por objeto: {criticalComm.visualGoForKnownObject}</li>}
                        {criticalComm.visualGoToKnownPlace && <li>Ir a lugar: {criticalComm.visualGoToKnownPlace}</li>}
                        {criticalComm.visualLeaveOnPlace && <li>Dejar en su sitio: {criticalComm.visualLeaveOnPlace}</li>}
                        {criticalComm.visualComeWithMe && <li>"Ven conmigo": {criticalComm.visualComeWithMe}</li>}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[10px] uppercase">Instrucción Verbal (Solo voz):</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {criticalComm.verbalOrientToName && <li>Orientarse al nombre: {criticalComm.verbalOrientToName}</li>}
                        {criticalComm.verbalComeHere && <li>"Ven aquí": {criticalComm.verbalComeHere}</li>}
                        {criticalComm.verbalStop && <li>"Para": {criticalComm.verbalStop}</li>}
                        {criticalComm.verbalSitDown && <li>"Siéntate": {criticalComm.verbalSitDown}</li>}
                        {criticalComm.verbalGiveItToMe && <li>"Dámelo": {criticalComm.verbalGiveItToMe}</li>}
                        {criticalComm.verbalGoForKnownObject && <li>Ir por objeto: {criticalComm.verbalGoForKnownObject}</li>}
                        {criticalComm.verbalGoToKnownPlace && <li>Ir a lugar: {criticalComm.verbalGoToKnownPlace}</li>}
                        {criticalComm.verbalLeaveOnPlace && <li>Dejar en su sitio: {criticalComm.verbalLeaveOnPlace}</li>}
                        {criticalComm.verbalComeWithMe && <li>"Ven conmigo": {criticalComm.verbalComeWithMe}</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 9. Horario visual y observaciones */}
                <div className="bg-white/80 p-2.5 rounded-lg border border-orange-200/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>• Sigue horario visual: <strong>{criticalComm.followsVisualSchedule || '-'}</strong> {criticalComm.visualScheduleNotes ? `(${criticalComm.visualScheduleNotes})` : ''}</div>
                    <div>• Observaciones: <strong>{criticalComm.generalObservations || '-'}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SPM-2 Sensory Table */}
          {spm && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-1.5 gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 uppercase text-xs">
                    Medida de Procesamiento Sensorial (SPM)
                  </h3>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    {spm.targetAgeGroup === '2_a_5_anos' ? '2 a 5 años (Preschool)' : 'Mayor a 5 años (Escolar)'}
                  </span>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                    {spm.questionnaireType === 'escuela' ? 'Cuestionario Escolar' : 'Cuestionario para Padres'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {spm.applicationMethod ? `Modalidad: ${spm.applicationMethod.replace('_', ' ')}` : 'Aplicación Presencial'}
                  {spm.respondentName ? ` · Respondido por: ${spm.respondentName}` : ''}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                      <th className="py-1.5 px-2">Escala Sensorial</th>
                      <th className="py-1.5 px-2">Puntaje</th>
                      <th className="py-1.5 px-2">Rango Interpretativo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    <tr><td className="py-1 px-2">Participación Social (SOC)</td><td className="py-1 px-2 font-mono">{spm.socialParticipationScore}</td><td className="py-1 px-2 font-bold">{spm.socialParticipationRange}</td></tr>
                    <tr><td className="py-1 px-2">Visión (VIS)</td><td className="py-1 px-2 font-mono">{spm.visionScore}</td><td className="py-1 px-2 font-bold">{spm.visionRange}</td></tr>
                    <tr><td className="py-1 px-2">Audición (HEA)</td><td className="py-1 px-2 font-mono">{spm.hearingScore}</td><td className="py-1 px-2 font-bold">{spm.hearingRange}</td></tr>
                    <tr><td className="py-1 px-2">Tacto (TOU)</td><td className="py-1 px-2 font-mono">{spm.touchScore}</td><td className="py-1 px-2 font-bold">{spm.touchRange}</td></tr>
                    <tr><td className="py-1 px-2">Gusto y Olfato (T&S)</td><td className="py-1 px-2 font-mono">{spm.tasteSmellScore}</td><td className="py-1 px-2 font-bold">{spm.tasteSmellRange}</td></tr>
                    <tr><td className="py-1 px-2">Conciencia Corporal / Propiocepción (BOD)</td><td className="py-1 px-2 font-mono">{spm.bodyAwarenessScore}</td><td className="py-1 px-2 font-bold">{spm.bodyAwarenessRange}</td></tr>
                    <tr><td className="py-1 px-2">Equilibrio y Movimiento / Vestibular (BAL)</td><td className="py-1 px-2 font-mono">{spm.balanceMotionScore}</td><td className="py-1 px-2 font-bold">{spm.balanceMotionRange}</td></tr>
                    <tr><td className="py-1 px-2">Planificación e Ideas / Praxis (PLN)</td><td className="py-1 px-2 font-mono">{spm.planningIdeasScore}</td><td className="py-1 px-2 font-bold">{spm.planningIdeasRange}</td></tr>
                    <tr className="bg-blue-50/80 font-bold"><td className="py-1.5 px-2 text-blue-900">TOTAL SENSORIAL (ST)</td><td className="py-1.5 px-2 font-mono">{spm.totalSensoryScore}</td><td className="py-1.5 px-2 text-blue-800">{spm.totalSensoryRange}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BPM Da Fonseca */}
          {bpm && (
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <h3 className="font-bold text-emerald-950 uppercase text-xs">
                Batería Psicomotora (BPM) de Vítor da Fonseca
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                <div>Tonicidad: <strong>{bpm.tonicityScore}/4</strong></div>
                <div>Equilibrio: <strong>{bpm.equilibriumScore}/4</strong></div>
                <div>Lateralidad: <strong>{bpm.lateralityScore}/4</strong></div>
                <div>Noción Cuerpo: <strong>{bpm.bodyNotionScore}/4</strong></div>
                <div>Espacio-Tiempo: <strong>{bpm.spatialTemporalScore}/4</strong></div>
                <div>Praxia Global: <strong>{bpm.globalPraxiaScore}/4</strong></div>
                <div>Praxia Fina: <strong>{bpm.finePraxiaScore}/4</strong></div>
                <div>Total: <strong className="text-emerald-900 font-mono text-sm">{bpm.totalScore}/28</strong></div>
              </div>
              <div className="pt-1 border-t border-emerald-200/60 mt-1">
                <span className="text-[11px] text-slate-500 block">Perfil Psicomotor:</span>
                <span className="px-2.5 py-1 bg-emerald-700 text-white font-bold rounded-md inline-block text-xs mt-0.5">
                  {bpm.profileResult}
                </span>
                {bpm.conclusions && <p className="text-slate-600 text-xs mt-1 italic">{bpm.conclusions}</p>}
              </div>
            </div>
          )}
        </div>

        {/* 7. Síntesis Diagnóstica Kinésica (C.I.F.) y Objetivos */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider border-b border-blue-200 pb-1">
            7. Síntesis Diagnóstica Kinésica (C.I.F.) y Objetivos Terapéuticos
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed">
            <span className="font-bold text-slate-700 block mb-1">Diagnóstico Funcional CIF:</span>
            <p className="text-slate-900 font-medium">
              {evaluations?.functionalDiagnosisCIF || report.clinicalSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">Objetivos a Corto Plazo:</span>
              <p className="text-slate-800">{evaluations?.therapeuticGoalsShortTerm || '-'}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">Objetivos a Largo Plazo:</span>
              <p className="text-slate-800">{evaluations?.therapeuticGoalsLongTerm || '-'}</p>
            </div>
          </div>
        </div>

        {/* 8. Plan de Tratamiento e Indicaciones */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-blue-200 pb-1">
            <h2 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">
              8. Plan de Tratamiento e Indicaciones al Hogar y Colegio
            </h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              ageInfo.isOlderThanThree ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {ageInfo.stageBadgeText}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3 leading-relaxed">
            <div>
              <span className="font-bold text-slate-700 block">Plan de Intervención Kinésica:</span>
              <p className="text-slate-800">{evaluations?.treatmentPlan || report.planAndFollowUp}</p>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 block flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recomendaciones para el Hogar:</span>
              </span>
              <p className="text-slate-800 mt-0.5">
                {evaluations?.homeRecommendations || evaluations?.homeAndSchoolRecommendations || 'Continuar pauta establecida.'}
              </p>
            </div>

            {/* Bloque Específico de Jardín / Escuela (Condicional por Edad > 3 años) */}
            {ageInfo.isOlderThanThree ? (
              <div className="pt-2 border-t border-blue-200/80 bg-blue-50/70 p-3 rounded-lg border border-blue-200">
                <span className="font-extrabold text-blue-900 block flex items-center gap-1.5 text-xs">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span>Recomendaciones para Jardín Infantil / Escuela / Aula PIE (Mayor a 3 años):</span>
                </span>
                <p className="text-blue-950 mt-1 whitespace-pre-line text-xs font-medium">
                  {evaluations?.schoolRecommendations || 'Pautas de adecuación postural y pausas sensoriales activas para el aula escolar.'}
                </p>
              </div>
            ) : (
              <div className="pt-2 border-t border-emerald-200/80 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                <span className="font-extrabold text-emerald-900 block flex items-center gap-1.5 text-xs">
                  <Home className="w-4 h-4 text-emerald-700" />
                  <span>Estimulación Temprana y Rutinas en el Hogar (Menor a 3 años):</span>
                </span>
                <p className="text-emerald-950 mt-0.5 text-xs">
                  Por su edad pediátrica (&lt; 3 años), las pautas terapéuticas se concentran en el hogar y en la vinculación con sus cuidadores primarios (o sala cuna en caso de asistir).
                </p>
              </div>
            )}

            {/* Banner Interactivo para Enviar Pauta Semanal vía WhatsApp (Oculto en impresión) */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs print:hidden">
              <div className="text-xs">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Envío Semanal para la Familia</span>
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Genera el texto formateado para WhatsApp o la Ficha PDF para que sigan practicando en casa.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowWeeklyPracticeModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Generar Pauta Semanal WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Firma Profesional */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center w-64 border-t border-dashed border-slate-400 pt-2">
            <p className="font-bold text-xs text-slate-900">{report.professionalName}</p>
            <p className="text-[10px] text-slate-500">{report.professionalSpecialty}</p>
            <p className="text-[9px] font-mono text-slate-400">{report.professionalRegistry}</p>
            <p className="text-[9px] text-slate-500">{report.institution}</p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.doc)</span>
            </button>
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF / Imprimir</span>
            </button>
          </div>
        </div>

      </div>

      {/* Weekly Home Practice Modal */}
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
          progressNotes={[]}
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

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Exercise, 
  Report, 
  SessionResult, 
  ProgressNote, 
  PatientAnamnesis, 
  ClinicalEvaluations, 
  ComprehensiveReport 
} from '../types';
import { PatientProgressSheet } from './PatientProgressSheet';
import { PatientEvaluationForm } from './PatientEvaluationForm';
import { ComprehensiveReportViewer } from './ComprehensiveReportViewer';
import { MarketingBusinessHub } from './MarketingBusinessHub';
import { 
  FileText, 
  UserPlus, 
  ClipboardList, 
  Stethoscope, 
  Edit3, 
  Check, 
  MapPin, 
  Building2, 
  X,
  UserCheck, 
  TrendingUp,
  RotateCcw,
  Sparkles,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface ClinicalPortalViewProps {
  clinician: User;
  patients: User[];
  exercises: Exercise[];
  reports: Report[];
  sessionHistory: SessionResult[];
  progressNotes: ProgressNote[];
  anamnesisData: Record<string, PatientAnamnesis>;
  evaluationsData: Record<string, ClinicalEvaluations>;
  comprehensiveReports: ComprehensiveReport[];
  onAssignExercise: (patientId: string, exerciseId: 'squats' | 'kneeTouch' | 'armsUp') => void;
  onCreateReport: (newReport: Report) => void;
  onAddProgressNote: (note: Omit<ProgressNote, 'id'>) => void;
  onUpdateProgressNote: (note: ProgressNote) => void;
  onDeleteProgressNote: (noteId: string) => void;
  onAddNewPatient: (newPatient: User) => void;
  onSaveAnamnesis: (patientId: string, data: PatientAnamnesis) => void;
  onSaveEvaluations: (patientId: string, data: ClinicalEvaluations) => void;
  onGenerateComprehensiveReport: (report: ComprehensiveReport) => void;
  onClearAllPatients?: () => void;
}

export const ClinicalPortalView: React.FC<ClinicalPortalViewProps> = ({
  clinician,
  patients,
  exercises,
  reports,
  sessionHistory,
  progressNotes,
  anamnesisData,
  evaluationsData,
  comprehensiveReports,
  onAssignExercise,
  onCreateReport,
  onAddProgressNote,
  onUpdateProgressNote,
  onDeleteProgressNote,
  onAddNewPatient,
  onSaveAnamnesis,
  onSaveEvaluations,
  onGenerateComprehensiveReport,
  onClearAllPatients
}) => {
  // 4 Primary Tabs as requested:
  // 1) add_patient_eval: Ingreso de paciente, anamnesis y pruebas aplicadas
  // 2) comprehensive_report: Informe consolidado con descarga en PDF y Word
  // 3) progress_sheet: Plantilla de progreso (seguimiento diario)
  // 4) marketing_growth: Marketing, ventas éticas, metas mes 1, derivadores Copiapó y CRM
  const [activeSubTab, setActiveSubTab] = useState<'add_patient_eval' | 'comprehensive_report' | 'progress_sheet' | 'marketing_growth'>('add_patient_eval');
  
  // Clinician customizable profile in localStorage (Starts blank or customized by the clinician)
  const [profName, setProfName] = useState(() => {
    return localStorage.getItem('kinesfera_clinician_name') || '';
  });
  const [profRut, setProfRut] = useState(() => {
    return localStorage.getItem('kinesfera_clinician_rut') || '';
  });
  const [profSpecialty, setProfSpecialty] = useState(() => {
    return localStorage.getItem('kinesfera_clinician_specialty') || 'Kinesiología Pediátrica · Neurorehabilitación';
  });
  const [profInstitution, setProfInstitution] = useState(() => {
    return localStorage.getItem('kinesfera_clinician_institution') || 'Centro Clínico Kinesfera';
  });
  const [profRegistry, setProfRegistry] = useState(() => {
    return localStorage.getItem('kinesfera_clinician_registry') || 'Registro SIS';
  });

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [tempName, setTempName] = useState(profName);
  const [tempRut, setTempRut] = useState(profRut);
  const [tempSpecialty, setTempSpecialty] = useState(profSpecialty);
  const [tempInstitution, setTempInstitution] = useState(profInstitution);
  const [tempRegistry, setTempRegistry] = useState(profRegistry);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || ''
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleSaveClinicianProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfName(tempName);
    setProfRut(tempRut);
    setProfSpecialty(tempSpecialty);
    setProfInstitution(tempInstitution);
    setProfRegistry(tempRegistry);

    localStorage.setItem('kinesfera_clinician_name', tempName);
    localStorage.setItem('kinesfera_clinician_rut', tempRut);
    localStorage.setItem('kinesfera_clinician_specialty', tempSpecialty);
    localStorage.setItem('kinesfera_clinician_institution', tempInstitution);
    localStorage.setItem('kinesfera_clinician_registry', tempRegistry);

    setShowEditProfileModal(false);
  };

  const [showConfirmClearModal, setShowConfirmClearModal] = useState(false);
  const [clearSuccessNotice, setClearSuccessNotice] = useState<string | null>(null);

  const handleConfirmClearAll = () => {
    if (onClearAllPatients) {
      onClearAllPatients();
    }
    setSelectedPatientId('');
    setShowConfirmClearModal(false);
    setClearSuccessNotice('Todos los datos anteriores han sido eliminados con éxito. Base de datos limpia para comenzar desde 0.');
    setTimeout(() => setClearSuccessNotice(null), 5000);
    setActiveSubTab('add_patient_eval');
  };

  // Find or create on-the-fly comprehensive report for selected patient
  const selectedComprehensiveReport = comprehensiveReports.find(r => r.patientId === selectedPatientId) || (
    selectedPatient ? {
      id: `comprep_${selectedPatient.id}`,
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      patientRut: selectedPatient.rut,
      patientBirthDate: selectedPatient.birthDate || 'No registrada',
      medicalRecordNumber: selectedPatient.medicalRecordNumber || 'NN-01',
      professionalName: profName || 'Klgo. Profesional Tratante',
      professionalSpecialty: profSpecialty,
      professionalRegistry: profRegistry,
      institution: profInstitution,
      dateGenerated: new Date().toISOString().slice(0, 10),
      anamnesis: anamnesisData[selectedPatient.id] || {
        id: `anam_${selectedPatient.id}`,
        patientId: selectedPatient.id,
        evaluatorName: profName || 'Klgo. Profesional Tratante',
        evaluationDate: new Date().toISOString().slice(0, 10),
        caregiverName: selectedPatient.emergencyContact?.name || 'Tutor legal',
        caregiverPhone: selectedPatient.emergencyContact?.phone || '',
        schoolOrCenter: '',
        educationalLevel: '',
        pieSupport: false,
        consultationReason: selectedPatient.diagnosis || 'Evaluación inicial',
        familyExpectations: '',
        gestationalAgeWeeks: '39 semanas',
        birthWeightGrams: '',
        birthType: 'Parto normal',
        apgarScore: '9/10',
        neonatalComplications: 'Sin complicaciones',
        headControlMonths: '',
        independentSittingMonths: '',
        crawlingMonths: '',
        standingMonths: '',
        walkingMonths: '',
        currentMotorStatus: '',
        medicalDiagnoses: selectedPatient.diagnosis || '',
        surgeries: 'Ninguna',
        pharmacology: '',
        assistiveDevices: 'Ninguna',
        allergicConditions: 'Sin alergias'
      },
      evaluations: evaluationsData[selectedPatient.id] || {
        id: `eval_${selectedPatient.id}`,
        patientId: selectedPatient.id,
        evaluationDate: new Date().toISOString().slice(0, 10),
        evaluatorName: profName || 'Klgo. Profesional Tratante',
        gmfcsLevel: 'Nivel I',
        macsLevel: 'Nivel I',
        eedpOrTepsiScore: 'En evaluación',
        ashworthScore: '0',
        tonePattern: 'Normotonía',
        deepTendonReflexes: 'Normales ++/++++',
        hipFlexionExt: '120° / 0°',
        kneeFlexionExt: '130° / 0°',
        ankleDorsiflexion: '15° bilateral',
        shoulderMobility: '> 165° bilateral',
        headAndTrunkControl: 'Conservado',
        rightingReactions: 'Presentes',
        protectiveResponses: 'Conservadas',
        balanceSittingAndStanding: 'Funcional',
        transferAbility: 'Autónomo',
        gaitObservation: 'Marcha activa',
        sensoryProfile: 'Evaluado mediante SPM-2',
        functionalDiagnosisCIF: 'Evaluación funcional kinésica completada.',
        therapeuticGoalsShortTerm: '',
        therapeuticGoalsLongTerm: '',
        treatmentPlan: 'Kinesioterapia motora personalizada.',
        homeAndSchoolRecommendations: 'Pauta de estimulación en el hogar.'
      },
      clinicalSummary: `Evaluación neurokinesiológica integral de ${selectedPatient.firstName} ${selectedPatient.lastName}.`,
      planAndFollowUp: 'Continuar plan kinésico personalizado.'
    } : null
  );

  const handleReportGenerated = (report: ComprehensiveReport) => {
    onGenerateComprehensiveReport(report);
    setSelectedPatientId(report.patientId);
    setActiveSubTab('comprehensive_report');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Clinician Profile Strip (Customizable & Starts Blank for the Clinician) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
              <span>{profSpecialty}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono text-[11px]">{profRegistry}</span>
            </div>
            
            <div className="flex items-center gap-2.5 mt-0.5">
              <h1 className="text-lg sm:text-xl font-black text-slate-900">
                {profName ? profName : 'Perfil Profesional Clínico (Sin Configurar)'}
              </h1>
              
              <button
                onClick={() => {
                  setTempName(profName);
                  setTempRut(profRut);
                  setTempSpecialty(profSpecialty);
                  setTempInstitution(profInstitution);
                  setTempRegistry(profRegistry);
                  setShowEditProfileModal(true);
                }}
                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="Editar mis datos profesionales (Nombre, RUT, Especialidad, Institución)"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
              <span>RUT: <strong className="font-mono text-slate-700">{profRut || 'Sin RUT registrado'}</strong></span>
              <span>·</span>
              <span>{profInstitution}</span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowConfirmClearModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            title="Eliminar todos los datos de pacientes anteriores para comenzar desde 0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Comenzar desde 0</span>
          </button>

          <button
            onClick={() => {
              setTempName(profName);
              setTempRut(profRut);
              setShowEditProfileModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Mi Perfil</span>
          </button>

          <button
            onClick={() => setActiveSubTab('marketing_growth')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'marketing_growth'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Marketing & Crecimiento</span>
          </button>

          <button
            onClick={() => setActiveSubTab('add_patient_eval')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'add_patient_eval'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Ingresar Paciente / Anamnesis</span>
          </button>
        </div>
      </div>

      {/* Clean Database / Starting from 0 Banner */}
      {patients.length === 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Base de datos limpia: 0 pacientes anteriores
              </h4>
              <p className="text-xs text-slate-600">
                Todo listo para comenzar desde 0. Registra a tu primer paciente para iniciar su Ficha Clínica, Anamnesis y Evaluación Neuropsicomotriz.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSubTab('add_patient_eval')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Ingresar Primer Paciente</span>
          </button>
        </div>
      )}

      {/* Success Notification Alert */}
      {clearSuccessNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{clearSuccessNotice}</span>
          </span>
          <button onClick={() => setClearSuccessNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Clinical Primary Sub-Navigation Tabs */}
      <div className="border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* TAB 1: Ingreso de Paciente & Evaluación (Anamnesis y Pruebas Clínicas) */}
          <button
            onClick={() => setActiveSubTab('add_patient_eval')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'add_patient_eval'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4 text-blue-200" />
            <span>1. Ingreso de Paciente & Evaluación (Anamnesis y Pruebas)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/20 text-white">
              {patients.length}
            </span>
          </button>

          {/* TAB 2: Informe Clínico Consolidado (Descarga en PDF y Word) */}
          <button
            onClick={() => setActiveSubTab('comprehensive_report')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'comprehensive_report'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-200" />
            <span>2. Informe Clínico Consolidado (PDF / Word)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/20 text-white">
              {comprehensiveReports.length}
            </span>
          </button>

          {/* TAB 3: Plantilla de Progreso (Seguimiento Diario) */}
          <button
            onClick={() => setActiveSubTab('progress_sheet')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'progress_sheet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-emerald-300" />
            <span>3. Plantilla de Progreso (Seguimiento Diario)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/20 text-white">
              {progressNotes.length}
            </span>
          </button>

          {/* TAB 4: Marketing, Ventas & Crecimiento del Negocio */}
          <button
            onClick={() => setActiveSubTab('marketing_growth')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'marketing_growth'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-xs ring-2 ring-blue-400/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>4. Marketing, Ventas & Crecimiento</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono shadow-2xs">
              Plan Mes 1
            </span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: Ingreso de Pacientes, Anamnesis y Pruebas Clínicas                */}
      {/* ========================================================================= */}
      {activeSubTab === 'add_patient_eval' && (
        <PatientEvaluationForm
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
          anamnesisData={anamnesisData}
          evaluationsData={evaluationsData}
          onSaveAnamnesis={onSaveAnamnesis}
          onSaveEvaluations={onSaveEvaluations}
          onAddNewPatient={onAddNewPatient}
          onGenerateReport={handleReportGenerated}
          clinicianName={profName || 'Klgo. Profesional Tratante'}
          clinicianSpecialty={profSpecialty}
          clinicianInstitution={profInstitution}
          clinicianRegistry={profRegistry}
        />
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: Informe Clínico Consolidado (Descarga en Word .doc y PDF)        */}
      {/* ========================================================================= */}
      {activeSubTab === 'comprehensive_report' && (
        <div className="space-y-6">
          
          {/* Patient Selector Bar for Report */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Ver Informe del Paciente:</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {patients.length === 0 ? (
                  <option value="">(Sin pacientes registrados)</option>
                ) : (
                  patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} — RUT: {p.rut}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Documento clínico oficial descargable en Word (.doc) y PDF con logotipo institucional.
            </div>
          </div>

          {selectedComprehensiveReport ? (
            <ComprehensiveReportViewer
              report={{
                ...selectedComprehensiveReport,
                professionalName: profName || selectedComprehensiveReport.professionalName,
                professionalSpecialty: profSpecialty || selectedComprehensiveReport.professionalSpecialty,
                professionalRegistry: profRegistry || selectedComprehensiveReport.professionalRegistry,
                institution: profInstitution || selectedComprehensiveReport.institution
              }}
              onEditReport={() => setActiveSubTab('add_patient_eval')}
              onSelectAnotherPatient={() => setActiveSubTab('add_patient_eval')}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">
                {patients.length === 0 
                  ? 'Base de datos limpia: aún no has registrado ningún paciente.' 
                  : 'No se ha generado un informe para este paciente.'}
              </p>
              <button
                onClick={() => setActiveSubTab('add_patient_eval')}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-500 cursor-pointer"
              >
                {patients.length === 0 ? '+ Registrar Primer Paciente' : 'Ir a Evaluación para Generar Informe'}
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: Plantilla de Progreso (Seguimiento Diario en Planilla)            */}
      {/* ========================================================================= */}
      {activeSubTab === 'progress_sheet' && (
        <PatientProgressSheet
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
          progressNotes={progressNotes}
          onAddProgressNote={(note) => onAddProgressNote({
            ...note,
            professionalName: profName || 'Klgo. Profesional Tratante'
          })}
          onUpdateProgressNote={onUpdateProgressNote}
          onDeleteProgressNote={onDeleteProgressNote}
          onAddNewPatient={() => setActiveSubTab('add_patient_eval')}
          anamnesisData={anamnesisData}
          evaluationsData={evaluationsData}
          clinicianName={profName}
          clinicianSpecialty={profSpecialty}
          clinicianInstitution={profInstitution}
        />
      )}

      {/* ========================================================================= */}
      {/* VISTA 4: Marketing, Derivadores, CRM y Crecimiento del Negocio (Kinesfera) */}
      {/* ========================================================================= */}
      {activeSubTab === 'marketing_growth' && (
        <MarketingBusinessHub />
      )}

      {/* Edit Clinician Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Configurar Perfil Profesional</h3>
                  <p className="text-xs text-slate-500">Tus datos aparecerán en los informes clínicos y firmas</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClinicianProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo y Título</label>
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre Completo y Título Profesional"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">R.U.T. Profesional</label>
                <input
                  type="text"
                  placeholder="RUT Profesional"
                  value={tempRut}
                  onChange={e => setTempRut(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Especialidad</label>
                <input
                  type="text"
                  placeholder="Kinesiología Pediátrica · Neurorehabilitación"
                  value={tempSpecialty}
                  onChange={e => setTempSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Institución / Centro Clínico</label>
                <input
                  type="text"
                  placeholder="Centro Clínico Kinesfera"
                  value={tempInstitution}
                  onChange={e => setTempInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Registro de Prestadores de Salud / SIS</label>
                <input
                  type="text"
                  placeholder="Registro SIS N° xxxxxx"
                  value={tempRegistry}
                  onChange={e => setTempRegistry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Mi Perfil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Clear All Patients to start from 0 */}
      {showConfirmClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  ¿Comenzar desde 0 y eliminar pacientes?
                </h3>
                <p className="text-xs text-slate-500">
                  Esta acción reiniciará la base de datos eliminando todos los pacientes anteriores.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              Se eliminarán las fichas de pacientes, notas de progreso y evaluaciones anteriores para que puedas ingresar tus pacientes y casos clínicos desde cero de forma completamente limpia.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmClearModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, Comenzar desde 0</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

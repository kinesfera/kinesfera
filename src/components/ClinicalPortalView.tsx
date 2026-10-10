import React, { useState } from 'react';
import { User, Exercise, Report, SessionResult, ProgressNote } from '../types';
import { PatientProgressSheet } from './PatientProgressSheet';
import { 
  Users, 
  FileText, 
  Activity, 
  Plus, 
  Printer, 
  MapPin, 
  Check, 
  Sparkles,
  ClipboardList,
  FolderOpen,
  UserPlus,
  X
} from 'lucide-react';

interface ClinicalPortalViewProps {
  clinician: User;
  patients: User[];
  exercises: Exercise[];
  reports: Report[];
  sessionHistory: SessionResult[];
  progressNotes: ProgressNote[];
  onAssignExercise: (patientId: string, exerciseId: 'squats' | 'kneeTouch' | 'armsUp') => void;
  onCreateReport: (newReport: Report) => void;
  onAddProgressNote: (note: Omit<ProgressNote, 'id'>) => void;
  onUpdateProgressNote: (note: ProgressNote) => void;
  onDeleteProgressNote: (noteId: string) => void;
  onAddNewPatient?: (newPatient: User) => void;
}

export const ClinicalPortalView: React.FC<ClinicalPortalViewProps> = ({
  clinician,
  patients,
  exercises,
  reports,
  sessionHistory,
  progressNotes,
  onAssignExercise,
  onCreateReport,
  onAddProgressNote,
  onUpdateProgressNote,
  onDeleteProgressNote,
  onAddNewPatient
}) => {
  // Default to the requested 'progress_sheet' tab!
  const [activeSubTab, setActiveSubTab] = useState<'progress_sheet' | 'directory_prescriptions' | 'reports'>('progress_sheet');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients.find(p => p.firstName === 'Juan')?.id || patients[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [activeReportToView, setActiveReportToView] = useState<Report | null>(null);
  
  // Exercise Assignment Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningPatient, setAssigningPatient] = useState<User | null>(null);

  // New Patient Modal state
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientRut, setNewPatientRut] = useState('');
  const [newPatientBirthDate, setNewPatientBirthDate] = useState('');
  const [newPatientDiagnosis, setNewPatientDiagnosis] = useState('');
  const [newPatientTutor, setNewPatientTutor] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');

  // New report form state
  const [reportSummary, setReportSummary] = useState('');
  const [reportProgress, setReportProgress] = useState('');
  const [reportAchievements, setReportAchievements] = useState('');
  const [reportFocusAreas, setReportFocusAreas] = useState('');
  const [reportNextSteps, setReportNextSteps] = useState('');

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.rut.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.diagnosis && p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAssignModal = (patient: User) => {
    setAssigningPatient(patient);
    setShowAssignModal(true);
  };

  const handleSelectAssignedExercise = (exerciseId: 'squats' | 'kneeTouch' | 'armsUp') => {
    if (assigningPatient) {
      onAssignExercise(assigningPatient.id, exerciseId);
      setShowAssignModal(false);
    }
  };

  const handleCreateReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newReport: Report = {
      id: `rep_${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      patientRut: selectedPatient.rut,
      professionalId: clinician.id,
      professionalName: `${clinician.firstName} ${clinician.lastName}`,
      professionalSpecialty: clinician.specialty,
      creatorRole: 'Profesionales Clínicos',
      generatedAt: new Date().toISOString(),
      content: {
        summary: reportSummary || 'Seguimiento de telerehabilitación pediátrica completado.',
        progressObserved: reportProgress || 'Evolución favorable del control postural.',
        achievements: reportAchievements || 'Cumplimiento adecuado de metas asignadas.',
        areasToFocus: reportFocusAreas || 'Optimización del equilibrio monopodal.',
        nextSteps: reportNextSteps || 'Continuar pauta en el hogar y coordinación con equipo PIE.',
        romAverage: 91,
        adherencePercentage: 85,
        compensationCount: 2
      }
    };

    onCreateReport(newReport);
    setShowNewReportModal(false);
    setActiveReportToView(newReport);

    // Reset form
    setReportSummary('');
    setReportProgress('');
    setReportAchievements('');
    setReportFocusAreas('');
    setReportNextSteps('');
  };

  const handleCreateNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !onAddNewPatient) return;

    const parts = newPatientName.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || '';

    const newPatient: User = {
      id: `user_patient_${Date.now()}`,
      email: `paciente.${firstName.toLowerCase()}@neuronexo.cl`,
      role: 'Padre/Niño',
      firstName,
      lastName,
      rut: newPatientRut.trim() || `${Math.floor(20 + Math.random() * 8)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-${Math.floor(Math.random() * 9)}`,
      birthDate: newPatientBirthDate.trim() || '2023-05-10',
      gender: 'Hombre',
      plan: 'Premium',
      credits: 50,
      assignedExercise: 'squats',
      diagnosis: newPatientDiagnosis.trim() || 'Evaluación neurokinesiológica en curso',
      medicalRecordNumber: `NN-2026-${Math.floor(100 + Math.random() * 900)}`,
      emergencyContact: {
        name: newPatientTutor.trim() || 'Tutor legal',
        relationship: 'Tutor',
        phone: newPatientPhone.trim() || '+56 9 8000 0000'
      },
      professionals: [clinician.id]
    };

    onAddNewPatient(newPatient);
    setSelectedPatientId(newPatient.id);
    setShowNewPatientModal(false);
    
    // Reset form
    setNewPatientName('');
    setNewPatientRut('');
    setNewPatientBirthDate('');
    setNewPatientDiagnosis('');
    setNewPatientTutor('');
    setNewPatientPhone('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Clinician Profile Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-xs">
            <img
              src="/src/assets/images/avatar_therapist_cl_1791671195799.jpg"
              alt="Dra. Elena Ramírez"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{clinician.specialty || 'Kinesiología Pediátrica · Neurorehabilitación'}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              {clinician.firstName} {clinician.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
              <span>RUT: <strong className="font-mono text-slate-700">{clinician.rut}</strong></span>
              <span>·</span>
              <span>{clinician.institution}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{clinician.consultationAddress?.commune}, {clinician.consultationAddress?.region}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowNewPatientModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Nuevo Paciente</span>
          </button>
          <button
            onClick={() => setShowNewReportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generar Informe Clínico</span>
          </button>
        </div>
      </div>

      {/* Clinical Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          
          {/* TAB 1: Plantilla de Progreso (Requested Spreadsheet View) */}
          <button
            onClick={() => setActiveSubTab('progress_sheet')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'progress_sheet'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            <span>Plantilla de Progreso (Seguimiento Diario)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/20 text-white">
              {progressNotes.length}
            </span>
          </button>

          {/* TAB 2: Expediente & Prescripciones con IA */}
          <button
            onClick={() => setActiveSubTab('directory_prescriptions')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'directory_prescriptions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Ficha & Prescripción Biomecánica</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/20 text-white">
              {patients.length}
            </span>
          </button>

          {/* TAB 3: Informes Oficiales Emitidos */}
          <button
            onClick={() => setActiveSubTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'reports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Informes Clínicos Oficiales</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/20 text-white">
              {reports.length}
            </span>
          </button>

        </div>
      </div>

      {/* VIEW 1: Plantilla de Progreso (Faithful Implementation of User's Spreadsheet) */}
      {activeSubTab === 'progress_sheet' && (
        <PatientProgressSheet
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
          progressNotes={progressNotes}
          onAddProgressNote={onAddProgressNote}
          onUpdateProgressNote={onUpdateProgressNote}
          onDeleteProgressNote={onDeleteProgressNote}
          onAddNewPatient={() => setShowNewPatientModal(true)}
        />
      )}

      {/* VIEW 2: Expediente y Prescripción de Ejercicios */}
      {activeSubTab === 'directory_prescriptions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Patient Directory (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Expediente de Pacientes Asignados</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seguimiento de telerrehabilitación psicomotriz y neurodesarrollo
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Buscar por nombre, RUT o diagnóstico..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Paciente</th>
                    <th className="py-3 px-4">RUT</th>
                    <th className="py-3 px-4">Diagnóstico</th>
                    <th className="py-3 px-4">Ejercicio Asignado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredPatients.map(patient => {
                    const isSelected = patient.id === selectedPatientId;
                    const assignedEx = exercises.find(e => e.id === patient.assignedExercise);
                    return (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatientId(patient.id)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {patient.firstName} {patient.lastName}
                          <span className="block text-[11px] font-normal text-slate-400">
                            Ficha: {patient.medicalRecordNumber || 'NN-01'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600">
                          {patient.rut}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                          {patient.diagnosis || 'Evaluación inicial'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-indigo-700">
                            {assignedEx?.friendlyName || patient.assignedExercise || 'Sentadillas'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAssignModal(patient);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Modificar Prescripción
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Patient Biomechanical Details (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Ficha Seleccionada
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedPatient?.firstName} {selectedPatient?.lastName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  RUT: <strong className="font-mono text-slate-700">{selectedPatient?.rut}</strong>
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Adherencia</span>
                  <span className="text-xl font-black text-emerald-600 font-mono tabular-nums">88%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">4 de 5 sesiones</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Rango ROM</span>
                  <span className="text-xl font-black text-indigo-600 font-mono tabular-nums">92°</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Flexión rodilla</span>
                </div>
              </div>

              {/* Compensations & Attention flags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Alertas Biomecánicas Registradas:</span>
                </span>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1 text-amber-800">
                    <span>· Valgo Dinámico en Fatiga</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Detectado en repeticiones 7 y 8. Se sugiere mantener el apoyo podal ancho y activar glúteo medio.
                  </p>
                </div>
              </div>

              {/* Contact details for emergency */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Contacto de Tutor / Apoderado:</span>
                <p>{selectedPatient?.emergencyContact?.name}</p>
                <p className="font-mono text-[11px] text-indigo-600">{selectedPatient?.emergencyContact?.phone}</p>
              </div>

              <button
                onClick={() => setActiveSubTab('progress_sheet')}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                <span>Ver Plantilla de Progreso de {selectedPatient?.firstName}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: Informes Clínicos Oficiales Emitidos */}
      {activeSubTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Archivo de Informes de Evolución Emitidos</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Documentos clínicos con firma kinésica, listos para descargar o imprimir
              </p>
            </div>
            <button
              onClick={() => setShowNewReportModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              + Nuevo Informe
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(r => (
              <div
                key={r.id}
                onClick={() => setActiveReportToView(r)}
                className="p-5 border border-slate-200 hover:border-indigo-400 rounded-xl shadow-2xs transition-all cursor-pointer bg-slate-50/30 hover:bg-indigo-50/20"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-mono">{new Date(r.generatedAt).toLocaleDateString('es-CL')}</span>
                  <span className="text-indigo-600 font-bold text-[11px]">Ver Documento</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{r.patientName}</h3>
                <p className="text-xs text-slate-500 font-mono mb-2">RUT: {r.patientRut}</p>
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80">
                  {r.content.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Assignment Modal */}
      {showAssignModal && assigningPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Prescribir Ejercicio Terapéutico
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Para el paciente: <strong>{assigningPatient.firstName} {assigningPatient.lastName}</strong> ({assigningPatient.rut})
              </p>
            </div>

            <div className="space-y-3">
              {exercises.map(ex => {
                const isCurrent = assigningPatient.assignedExercise === ex.id;
                return (
                  <div
                    key={ex.id}
                    onClick={() => handleSelectAssignedExercise(ex.id as 'squats' | 'kneeTouch' | 'armsUp')}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{ex.friendlyName}</h4>
                      <p className="text-[11px] text-slate-500 capitalize mt-0.5">
                        {ex.category.replace('_', ' ')} · Objetivo: {ex.gamification.objective} reps
                      </p>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Asignado
                      </span>
                    ) : (
                      <button className="text-xs font-semibold text-slate-600 hover:text-indigo-600">
                        Seleccionar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Registration Modal (Adds new tab to sheet!) */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Registrar Nuevo Paciente Pediátrico
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Se creará su hoja correspondiente en la Plantilla de Progreso
                </p>
              </div>
              <button onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewPatientSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Niño(a) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Beltrán"
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">RUT Paciente</label>
                  <input
                    type="text"
                    placeholder="26.840.119-3"
                    value={newPatientRut}
                    onChange={e => setNewPatientRut(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={newPatientBirthDate}
                    onChange={e => setNewPatientBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Diagnóstico / Motivo de Consulta</label>
                <input
                  type="text"
                  placeholder="Ej. Retraso del Desarrollo Psicomotor · Hipotonía y Control de Sedente"
                  value={newPatientDiagnosis}
                  onChange={e => setNewPatientDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre Tutor / Acompañante</label>
                  <input
                    type="text"
                    placeholder="Ej. María José Beltrán (Madre)"
                    value={newPatientTutor}
                    onChange={e => setNewPatientTutor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    placeholder="+56 9 8123 9988"
                    value={newPatientPhone}
                    onChange={e => setNewPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                >
                  Crear Ficha y Hoja de Progreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Report Creation Modal */}
      {showNewReportModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Emitir Informe de Evolución Kinésica Pediátrica
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paciente: <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong> · RUT: {selectedPatient.rut}
                </p>
              </div>
              <button
                onClick={() => setShowNewReportModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCreateReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Resumen Clínico Ejecutivo</label>
                <textarea
                  required
                  rows={2}
                  value={reportSummary}
                  onChange={e => setReportSummary(e.target.value)}
                  placeholder="Ej. Paciente evaluado tras 4 semanas de intervención psicomotriz..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Progresos Motores y Conductuales Observados</label>
                <textarea
                  required
                  rows={2}
                  value={reportProgress}
                  onChange={e => setReportProgress(e.target.value)}
                  placeholder="Ej. Rango de flexión de rodilla optimizado a 92°. Menor fatiga bipedestada..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Logros Alcanzados</label>
                  <textarea
                    required
                    rows={2}
                    value={reportAchievements}
                    onChange={e => setReportAchievements(e.target.value)}
                    placeholder="Ej. Adherencia del 88%, estabilidad cefálica..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Áreas de Foco y Alerta</label>
                  <textarea
                    required
                    rows={2}
                    value={reportFocusAreas}
                    onChange={e => setReportFocusAreas(e.target.value)}
                    placeholder="Ej. Prevenir compensaciones en plano sagital..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Próximos Pasos e Indicaciones al Hogar / Escuela</label>
                <textarea
                  required
                  rows={2}
                  value={reportNextSteps}
                  onChange={e => setReportNextSteps(e.target.value)}
                  placeholder="Ej. Continuar 3 veces por semana con pauta en el hogar..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs"
                >
                  Generar y Firmar Informe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Document Viewer & Print Modal */}
      {activeReportToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full p-8 max-h-[92vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-150">
            
            {/* Printable Clinical Sheet Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">
                  Documento Clínico Oficial · TeleRehabilitación Pediátrica
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  INFORME DE EVOLUCIÓN NEUROPSICOMOTRIZ
                </h2>
                <p className="text-xs text-slate-500">
                  NeuroNexo Adventures Health Platform · República de Chile
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-400 block text-[10px]">FECHA DE EMISIÓN</span>
                <span className="font-mono font-bold text-slate-800">
                  {new Date(activeReportToView.generatedAt).toLocaleDateString('es-CL')}
                </span>
                <span className="text-slate-500 block text-[11px] mt-1">ID: {activeReportToView.id}</span>
              </div>
            </div>

            {/* Patient & Professional Metadata Box */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Datos del Paciente</span>
                <p className="font-bold text-slate-900">{activeReportToView.patientName}</p>
                <p className="font-mono text-slate-700">RUT: {activeReportToView.patientRut}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Profesional Responsable</span>
                <p className="font-bold text-slate-900">{activeReportToView.professionalName}</p>
                <p className="text-slate-600">{activeReportToView.professionalSpecialty || 'Kinesiología Pediátrica'}</p>
              </div>
            </div>

            {/* Report Content Blocks */}
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                  1. Resumen Ejecutivo
                </h4>
                <p className="p-3 bg-white border border-slate-200 rounded-lg">
                  {activeReportToView.content.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                  2. Progresos y Métricas de Rango Articular (ROM)
                </h4>
                <p className="p-3 bg-white border border-slate-200 rounded-lg">
                  {activeReportToView.content.progressObserved}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                    3. Logros Clínicos
                  </h4>
                  <p className="p-3 bg-white border border-slate-200 rounded-lg">
                    {activeReportToView.content.achievements}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                    4. Áreas de Foco Postural
                  </h4>
                  <p className="p-3 bg-white border border-slate-200 rounded-lg">
                    {activeReportToView.content.areasToFocus}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                  5. Plan de Continuidad y Coordinación Interdisciplinaria
                </h4>
                <p className="p-3 bg-white border border-slate-200 rounded-lg">
                  {activeReportToView.content.nextSteps}
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
              <div className="text-center w-64 border-t border-dashed border-slate-400 pt-2">
                <p className="font-bold text-xs text-slate-900">{activeReportToView.professionalName}</p>
                <p className="text-[10px] text-slate-500">Kinesiología Neurorehabilitación Pediátrica</p>
                <p className="text-[9px] font-mono text-slate-400">Registro SIS Nº 48291</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ficha</span>
                </button>
                <button
                  onClick={() => setActiveReportToView(null)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

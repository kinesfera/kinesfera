import React, { useState } from 'react';
import { User, ProgressNote, PaymentMethod } from '../types';
import { 
  Calendar, 
  CreditCard, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Printer, 
  Download, 
  User as UserIcon,
  Check,
  X,
  Sparkles,
  ClipboardList,
  FileSpreadsheet
} from 'lucide-react';

interface PatientProgressSheetProps {
  patients: User[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  progressNotes: ProgressNote[];
  onAddProgressNote: (note: Omit<ProgressNote, 'id'>) => void;
  onUpdateProgressNote: (note: ProgressNote) => void;
  onDeleteProgressNote: (noteId: string) => void;
  onAddNewPatient?: () => void;
}

export const PatientProgressSheet: React.FC<PatientProgressSheetProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  progressNotes,
  onAddProgressNote,
  onUpdateProgressNote,
  onDeleteProgressNote,
  onAddNewPatient
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<ProgressNote | null>(null);

  // Form states for new / edit note
  const [formDate, setFormDate] = useState(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  });
  const [formPayment, setFormPayment] = useState<PaymentMethod>('Efectivo');
  const [formNotes, setFormNotes] = useState('');

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Notes filtered for current patient
  const patientNotes = progressNotes.filter(n => n.patientId === currentPatient?.id);

  const filteredNotes = patientNotes.filter(n => 
    n.notes.toLowerCase().includes(searchFilter.toLowerCase()) ||
    n.date.includes(searchFilter) ||
    n.paymentMethod.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleOpenAddModal = () => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    setFormDate(`${mm}/${dd}/${yyyy}`);
    setFormPayment('Efectivo');
    setFormNotes('');
    setEditingNote(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (note: ProgressNote) => {
    setEditingNote(note);
    setFormDate(note.date);
    setFormPayment(note.paymentMethod);
    setFormNotes(note.notes);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNotes.trim() || !currentPatient) return;

    if (editingNote) {
      onUpdateProgressNote({
        ...editingNote,
        date: formDate,
        paymentMethod: formPayment,
        notes: formNotes.trim()
      });
    } else {
      onAddProgressNote({
        patientId: currentPatient.id,
        date: formDate,
        paymentMethod: formPayment,
        notes: formNotes.trim(),
        professionalName: 'Dra. Elena Ramírez Soto'
      });
    }

    setShowAddModal(false);
    setEditingNote(null);
  };

  // Quick insertion helpers for common clinical pediatric therapy notes
  const appendSnippet = (snippet: string) => {
    setFormNotes(prev => prev ? `${prev} ${snippet}` : snippet);
  };

  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleExportCSV = () => {
    if (!currentPatient) return;
    const headers = [
      'PACIENTE',
      'RUT',
      'FECHA DE NACIMIENTO',
      'FICHA CLINICA',
      'DIAGNOSTICO',
      'FECHA SESION',
      'METODO DE PAGO',
      'NOTAS DE PROGRESO',
      'PROFESIONAL TRATANTE'
    ];
    const rows = patientNotes.map(n => [
      `"${currentPatient.firstName} ${currentPatient.lastName}"`,
      `"${currentPatient.rut}"`,
      `"${currentPatient.birthDate || ''}"`,
      `"${currentPatient.medicalRecordNumber || ''}"`,
      `"${currentPatient.diagnosis || ''}"`,
      `"${n.date}"`,
      `"${n.paymentMethod}"`,
      `"${n.notes.replace(/"/g, '""')}"`,
      `"${n.professionalName || 'Dra. Elena Ramírez Soto'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Plantilla_Progreso_${currentPatient.firstName}_${currentPatient.lastName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Descargado CSV de ${currentPatient.firstName} ${currentPatient.lastName} (${patientNotes.length} sesiones)`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleExportAllCSV = () => {
    const headers = [
      'PACIENTE',
      'RUT',
      'FECHA DE NACIMIENTO',
      'FICHA CLINICA',
      'DIAGNOSTICO',
      'FECHA SESION',
      'METODO DE PAGO',
      'NOTAS DE PROGRESO',
      'PROFESIONAL TRATANTE'
    ];

    const allRows: string[][] = [];

    // Group notes by each patient
    patients.forEach(patient => {
      const notesForPatient = progressNotes.filter(n => n.patientId === patient.id);
      if (notesForPatient.length > 0) {
        notesForPatient.forEach(n => {
          allRows.push([
            `${patient.firstName} ${patient.lastName}`,
            patient.rut,
            patient.birthDate || '',
            patient.medicalRecordNumber || '',
            patient.diagnosis || '',
            n.date,
            n.paymentMethod,
            n.notes,
            n.professionalName || 'Dra. Elena Ramírez Soto'
          ]);
        });
      } else {
        // Patient with no notes yet
        allRows.push([
          `${patient.firstName} ${patient.lastName}`,
          patient.rut,
          patient.birthDate || '',
          patient.medicalRecordNumber || '',
          patient.diagnosis || '',
          'Sin sesiones registradas',
          '-',
          'Sin notas de progreso registradas a la fecha',
          'Dra. Elena Ramírez Soto'
        ]);
      }
    });

    const csvContent = '\uFEFF' + [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...allRows.map(row => row.map(col => `"${String(col).replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Plantilla_Progreso_CONSOLIDADO_Todos_Pacientes_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`¡Descargado archivo CSV consolidado con todos los ${patients.length} pacientes y sus notas de progreso!`);
    setTimeout(() => setDownloadNotice(null), 5000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col space-y-0">
      
      {/* Top Banner exactly matching the spreadsheet aesthetic: PLANTILLA DE PROGRESO */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">
            Ficha y Registro Clínico de Sesiones
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>PLANTILLA DE PROGRESO</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Button: Export ALL patients CSV consolidated in one single file */}
          <button
            onClick={handleExportAllCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Descargar la plantilla de progreso de TODOS los pacientes en un solo archivo CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar CSV Todos los Pacientes</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/20 text-white">
              {patients.length} pacientes
            </span>
          </button>

          {/* Button: Export current patient CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title={`Exportar solo sesiones de ${currentPatient?.firstName} ${currentPatient?.lastName}`}
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Paciente Actual</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Imprimir Plantilla"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Nota de Progreso</span>
          </button>
        </div>
      </div>

      {/* Download Alert Notice Banner */}
      {downloadNotice && (
        <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <span className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadNotice}</span>
          </span>
          <button
            onClick={() => setDownloadNotice(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Patient Header Block (Matches: NOMBRE DEL PACIENTE / FECHA DE NACIMIENTO / PROGRESO DEL PACIENTE) */}
      <div className="p-6 bg-slate-50/60 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Patient Name and Birthdate Boxes */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              NOMBRE DEL PACIENTE
            </span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5 block truncate">
              {currentPatient ? `${currentPatient.firstName} ${currentPatient.lastName}` : 'Seleccione paciente'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              RUT: {currentPatient?.rut} {currentPatient?.medicalRecordNumber && `· Ficha: ${currentPatient.medicalRecordNumber}`}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              FECHA DE NACIMIENTO
            </span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5 block font-mono">
              {currentPatient?.birthDate || 'No registrada'}
            </span>
            <span className="text-[11px] text-slate-500 truncate block">
              Diagnóstico: {currentPatient?.diagnosis || 'En evaluación clínica'}
            </span>
          </div>
        </div>

        {/* Right Side: Section Banner "PROGRESO DEL PACIENTE" */}
        <div className="md:col-span-4 flex flex-col justify-center items-start md:items-end text-left md:text-right">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-400/90 uppercase">
            PROGRESO DEL PACIENTE
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {patientNotes.length} sesión{patientNotes.length === 1 ? '' : 'es'} registrada{patientNotes.length === 1 ? '' : 's'}
          </span>
        </div>

      </div>

      {/* Filter / Search Bar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar en notas de progreso (ej. supino, sedente, rollo)..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-500">
          <span>Mostrando <strong>{filteredNotes.length}</strong> de <strong>{patientNotes.length}</strong> notas</span>
        </div>
      </div>

      {/* Structured Progress Table (FECHA | PAGO | NOTAS DE PROGRESO) */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-xs font-extrabold uppercase tracking-wider">
              <th className="py-3 px-5 w-32 shrink-0 border-r border-slate-700">
                FECHA
              </th>
              <th className="py-3 px-5 w-36 shrink-0 border-r border-slate-700">
                PAGO
              </th>
              <th className="py-3 px-5">
                NOTAS DE PROGRESO
              </th>
              <th className="py-3 px-4 w-24 text-right">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredNotes.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400 italic bg-white">
                  No se registran notas de progreso para este paciente aún. Haz clic en <strong>"+ Nueva Nota de Progreso"</strong> para registrar la primera sesión.
                </td>
              </tr>
            ) : (
              filteredNotes.map((note) => (
                <tr key={note.id} className="hover:bg-slate-50/70 transition-colors group">
                  
                  {/* FECHA Column */}
                  <td className="py-4 px-5 font-mono text-slate-700 font-bold border-r border-slate-200 align-top whitespace-nowrap bg-slate-50/40">
                    {note.date}
                  </td>

                  {/* PAGO Column */}
                  <td className="py-4 px-5 border-r border-slate-200 align-top whitespace-nowrap bg-slate-50/20">
                    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-md text-[11px] ${
                      note.paymentMethod === 'Efectivo'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : note.paymentMethod === 'Transferencia'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : note.paymentMethod === 'Fonasa'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : note.paymentMethod === 'Isapre'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      <CreditCard className="w-3 h-3" />
                      <span>{note.paymentMethod}</span>
                    </span>
                  </td>

                  {/* NOTAS DE PROGRESO Column (Rich narrative text) */}
                  <td className="py-4 px-5 text-slate-800 leading-relaxed align-top font-normal font-sans">
                    <p className="whitespace-pre-line text-xs sm:text-[13px] leading-6">
                      {note.notes}
                    </p>
                    {note.professionalName && (
                      <span className="text-[10px] text-slate-400 block mt-2">
                        Registrado por: {note.professionalName}
                      </span>
                    )}
                  </td>

                  {/* ACCIONES Column */}
                  <td className="py-4 px-4 text-right align-top whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(note)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                        title="Editar nota"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('¿Deseas eliminar esta nota de progreso?')) {
                            onDeleteProgressNote(note.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Eliminar nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Patient Tabs Navigation (Strictly matching the spreadsheet tabs at the bottom!) */}
      <div className="bg-slate-100 border-t border-slate-300 p-2 flex items-center gap-1 overflow-x-auto shadow-inner">
        <span className="text-slate-400 pl-2 pr-1 font-bold text-xs select-none">
          Hojas:
        </span>

        {patients.map((patient) => {
          const isActive = patient.id === selectedPatientId;
          const patientName = `${patient.firstName} ${patient.lastName || ''}`.trim();
          return (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border-t border-l border-r ${
                isActive
                  ? 'bg-white text-indigo-700 border-indigo-400 shadow-xs font-bold border-b-2 border-b-indigo-600'
                  : 'bg-slate-200/80 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <UserIcon className="w-3 h-3 text-slate-400" />
              <span>{patientName}</span>
            </button>
          );
        })}

        {onAddNewPatient && (
          <button
            onClick={onAddNewPatient}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-300 rounded-lg transition-colors shrink-0 ml-1 cursor-pointer"
            title="Añadir nuevo paciente"
          >
            +
          </button>
        )}
      </div>

      {/* Add / Edit Progress Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-indigo-600" />
                  <span>{editingNote ? 'Editar Nota de Progreso' : 'Registrar Nueva Nota de Progreso'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paciente: <strong>{currentPatient?.firstName} {currentPatient?.lastName}</strong> ({currentPatient?.rut})
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* FECHA */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    FECHA DE LA SESIÓN
                  </label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    placeholder="MM/DD/AAAA (ej. 07/28/2026)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Formato: MM/DD/AAAA o DD/MM/AAAA
                  </span>
                </div>

                {/* PAGO */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    MÉTODO / ESTADO DE PAGO
                  </label>
                  <select
                    value={formPayment}
                    onChange={e => setFormPayment(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white font-semibold outline-hidden"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Fonasa">Bono Fonasa</option>
                    <option value="Isapre">Reembolso Isapre</option>
                    <option value="Tarjeta">Tarjeta Débito/Crédito</option>
                    <option value="Particular">Particular</option>
                    <option value="Bono Web">Bono Web / Convenio</option>
                    <option value="Pendiente">Pendiente de Pago</option>
                  </select>
                </div>
              </div>

              {/* NOTAS DE PROGRESO */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    NOTAS DE PROGRESO Y EVOLUCIÓN CLÍNICA
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Kinesiología y Neurorehabilitación
                  </span>
                </div>

                <textarea
                  required
                  rows={6}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Detalla la sesión: acompañamiento familiar, posición decúbito supino/prono, tracción a sedente, control cefálico, equilibrio sagital/frontal, flexibilidad EEII/EESS, rollo de espuma, educación a la familia..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-sans text-xs leading-relaxed outline-hidden"
                />
              </div>

              {/* Quick Clinical Snippets for faster typing */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Insertar Frases Clínicas Rápidas (Pediátricas):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Usuario llega con su madre.',
                    'Se realizan movimientos generales de articulación.',
                    'Permanece en decúbito supino por 7 min, inicia giro hacia la izquierda.',
                    'Se trabaja en tracción al sedente soportando su cabeza.',
                    'Se trabaja equilibrio en sedente en plano antero posterior y sagital.',
                    'Se trabaja flexibilidad EEII, movilidad activa y pasiva de cuello.',
                    'Se trabaja extensores de columna en prono con rollo de espuma.',
                    'Se educa en todo momento a la familia en pautas de estimulación en el hogar.'
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => appendSnippet(phrase)}
                      className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 text-[10px] rounded-md transition-colors cursor-pointer"
                    >
                      + {phrase.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingNote ? 'Actualizar Nota' : 'Guardar en Plantilla'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

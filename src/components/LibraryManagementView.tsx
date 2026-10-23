import React, { useState, useEffect } from 'react';
import { 
  LibraryFileDocument, 
  LibraryFileScope, 
  LibraryFileCategory, 
  User 
} from '../types';
import { libraryStorageService } from '../services/libraryStorageService';
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Trash2, 
  Eye, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Filter, 
  FileCheck, 
  FileSpreadsheet, 
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  X,
  Search,
  Tag,
  Building2,
  UserCheck
} from 'lucide-react';

interface LibraryManagementViewProps {
  patients: User[];
  selectedPatientId?: string;
  onSelectPatient?: (id: string) => void;
  onNavigateToSPM?: () => void;
  onNavigateToReport?: () => void;
}

export const LibraryManagementView: React.FC<LibraryManagementViewProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onNavigateToSPM,
  onNavigateToReport
}) => {
  const [files, setFiles] = useState<LibraryFileDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScope, setSelectedScope] = useState<'all' | 'negocio' | 'paciente'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadScope, setUploadScope] = useState<LibraryFileScope>('negocio');
  const [uploadPatientId, setUploadPatientId] = useState<string>(selectedPatientId || '');
  const [uploadCategory, setUploadCategory] = useState<LibraryFileCategory>('clinico_general');
  const [uploadSummary, setUploadSummary] = useState('');
  const [uploadKeyPoints, setUploadKeyPoints] = useState('');
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Delete modal state
  const [fileToDelete, setFileToDelete] = useState<LibraryFileDocument | null>(null);

  // Preview modal state
  const [previewFile, setPreviewFile] = useState<LibraryFileDocument | null>(null);

  // Marketing snippet modal state
  const [marketingContextModal, setMarketingContextModal] = useState(false);
  const [marketingSnippet, setMarketingSnippet] = useState('');

  const loadFiles = async () => {
    setLoading(true);
    try {
      const docs = await libraryStorageService.loadLibraryFiles();
      setFiles(docs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
    const handleUpdate = () => loadFiles();
    window.addEventListener('kinesfera_library_updated', handleUpdate);
    return () => window.removeEventListener('kinesfera_library_updated', handleUpdate);
  }, []);

  // Filter files
  const filteredFiles = files.filter(f => {
    if (selectedScope !== 'all' && f.scope !== selectedScope) return false;
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = f.name.toLowerCase().includes(q) || f.fileName.toLowerCase().includes(q);
      const matchSummary = f.summary?.toLowerCase().includes(q);
      const matchPatient = f.patientName?.toLowerCase().includes(q);
      if (!matchName && !matchSummary && !matchPatient) return false;
    }
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileObj(file);
      if (!uploadFileName) {
        setUploadFileName(file.name.replace(/\.[^/.]+$/, ''));
      }
      // Simple automated summary preview
      if (!uploadSummary) {
        setUploadSummary(`Documento cargado (${file.name}, ${(file.size / 1024).toFixed(0)} KB) incorporado para consulta clínica e informes.`);
      }
      if (!uploadKeyPoints) {
        setUploadKeyPoints('Información técnica clínica de referencia\nPautas aplicables a intervención kinésica\nCriterios de valoración y seguimiento');
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    setUploading(true);
    try {
      const fileId = `lib_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      let fileType: LibraryFileDocument['fileType'] = 'other';
      const ext = selectedFileObj ? selectedFileObj.name.split('.').pop()?.toLowerCase() : 'pdf';
      
      if (ext === 'pdf') fileType = 'pdf';
      else if (ext === 'doc' || ext === 'docx') fileType = 'doc';
      else if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') fileType = 'xls';
      else if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) fileType = 'image';

      const patient = patients.find(p => p.id === uploadPatientId);

      // Create object URL or fallback data URL
      let downloadUrl = '';
      if (selectedFileObj) {
        downloadUrl = URL.createObjectURL(selectedFileObj);
      }

      const keyPointsList = uploadKeyPoints
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const newDoc: LibraryFileDocument = {
        id: fileId,
        name: uploadFileName.trim(),
        fileName: selectedFileObj ? selectedFileObj.name : `${uploadFileName.trim()}.${ext}`,
        fileType,
        scope: uploadScope,
        patientId: uploadScope === 'paciente' ? uploadPatientId : undefined,
        patientName: uploadScope === 'paciente' && patient ? `${patient.firstName} ${patient.lastName}` : undefined,
        category: uploadCategory,
        downloadUrl,
        fileSizeBytes: selectedFileObj ? selectedFileObj.size : 150000,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Klgo. Aldo Olivares Araya',
        summary: uploadSummary.trim() || 'Documento clínico y técnico guardado en biblioteca.',
        keyPoints: keyPointsList.length > 0 ? keyPointsList : ['Pautas clínicas de valoración', 'Referencias técnicas de tratamiento'],
        isChecklistActive: uploadCategory === 'comunicacion_critica'
      };

      await libraryStorageService.saveLibraryFile(newDoc, selectedFileObj || undefined);
      setShowUploadModal(false);
      resetUploadForm();
      await loadFiles();
    } catch (err: any) {
      alert(`Error al guardar archivo: ${err?.message || 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFileName('');
    setUploadScope('negocio');
    setUploadPatientId(selectedPatientId || '');
    setUploadCategory('clinico_general');
    setUploadSummary('');
    setUploadKeyPoints('');
    setSelectedFileObj(null);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      await libraryStorageService.deleteLibraryFile(fileToDelete.id);
      setFileToDelete(null);
      await loadFiles();
    } catch (err: any) {
      alert(`Error al eliminar: ${err?.message || 'Error desconocido'}`);
    }
  };

  const handleSetActiveChecklist = async (file: LibraryFileDocument) => {
    await libraryStorageService.setActiveCommunicationChecklist(file.id);
    await loadFiles();
  };

  const handleOpenMarketingContext = async () => {
    const text = await libraryStorageService.getAggregatedLibraryContext('negocio');
    setMarketingSnippet(text);
    setMarketingContextModal(true);
  };

  const getFileIcon = (type: LibraryFileDocument['fileType']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-rose-600" />;
      case 'doc':
      case 'docx':
        return <FileCheck className="w-6 h-6 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-amber-600" />;
      default:
        return <FileText className="w-6 h-6 text-slate-600" />;
    }
  };

  const getCategoryBadge = (cat: LibraryFileCategory) => {
    switch (cat) {
      case 'comunicacion_critica':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">Lista Comunicación Crítica (CAA)</span>;
      case 'evaluacion_spm':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">Evaluación SPM</span>;
      case 'protocolo':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-100 text-cyan-900 border border-cyan-300">Protocolo Clínico</span>;
      case 'marketing':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-300">Marketing & Negocio</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300">General</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600/60 text-teal-100 text-xs font-bold border border-teal-400/40">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Biblioteca Institucional & Documentos de Soporte</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Gestor de Documentos, Cuestionarios SPM y Listas de Control
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Sube y almacena cuestionarios (PDF, Word, Excel, imágenes) asociados a la clínica o a pacientes específicos en Firebase. Cada documento extrae un resumen y puntos clave para enriquecer los informes, objetivos y el plan de Marketing gastando menos tokens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleOpenMarketingContext}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-900/60 hover:bg-teal-900 text-teal-100 text-xs font-bold rounded-xl border border-teal-400/30 transition-all cursor-pointer"
            title="Ver resumen estructurado para plan de marketing sin exponer nombres"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Contexto para Marketing</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-teal-950 text-xs sm:text-sm font-black rounded-xl shadow-md hover:bg-teal-50 transition-all cursor-pointer ring-2 ring-teal-300/40"
          >
            <Upload className="w-4 h-4 text-teal-700" />
            <span>Subir Documento</span>
          </button>
        </div>
      </div>

      {/* 2. Filtros y Búsqueda */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Scope selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Alcance:
          </span>
          <button
            onClick={() => setSelectedScope('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedScope === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos ({files.length})
          </button>
          <button
            onClick={() => setSelectedScope('negocio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedScope === 'negocio'
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Negocio / General</span>
          </button>
          <button
            onClick={() => setSelectedScope('paciente')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedScope === 'paciente'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Por Paciente</span>
          </button>
        </div>

        {/* Category selector & search */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-teal-500 outline-hidden"
          >
            <option value="all">Todas las categorías</option>
            <option value="comunicacion_critica">Listas de Comunicación Crítica</option>
            <option value="evaluacion_spm">Evaluaciones SPM</option>
            <option value="protocolo">Protocolos Clínicos</option>
            <option value="marketing">Marketing & Negocio</option>
            <option value="clinico_general">Clínico General</option>
          </select>

          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 3. Grid de Documentos */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium text-sm">
          Cargando archivos de biblioteca...
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No se encontraron documentos</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery ? 'Prueba con otros términos de búsqueda o cambia los filtros de alcance.' : 'Sube tu primer archivo en PDF, Word, Excel o imagen.'}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            + Subir Primer Archivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`bg-white rounded-2xl border transition-all duration-200 p-5 space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md ${
                file.isChecklistActive
                  ? 'border-amber-400 ring-2 ring-amber-300/40 bg-gradient-to-b from-amber-50/20 to-white'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2.5">
                {/* Header card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getFileIcon(file.fileType)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                        {file.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {file.fileName} · {(file.fileSizeBytes / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {getCategoryBadge(file.category)}
                  {file.scope === 'paciente' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>{file.patientName || 'Paciente asignado'}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Negocio General
                    </span>
                  )}
                  {file.isChecklistActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Lista Activa Informe</span>
                    </span>
                  )}
                </div>

                {/* Resumen extraído (Optimización de tokens) */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Resumen del Documento:
                  </span>
                  <p className="text-slate-700 leading-relaxed line-clamp-3">
                    {file.summary}
                  </p>
                  {file.keyPoints && file.keyPoints.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-600 block">Datos clave:</span>
                      <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc pl-3">
                        {file.keyPoints.slice(0, 2).map((kp, i) => (
                          <li key={i} className="line-clamp-1">{kp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {file.downloadUrl && (
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={file.fileName}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Ver detalles completos del documento"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setFileToDelete(file)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Checklist toggle button if communication checklist */}
                {file.category === 'comunicacion_critica' && !file.isChecklistActive && (
                  <button
                    onClick={() => handleSetActiveChecklist(file)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
                    title="Usar esta lista en el cuadro resumen del informe final"
                  >
                    Activar en Informe
                  </button>
                )}

                {file.category === 'evaluacion_spm' && onNavigateToSPM && (
                  <button
                    onClick={onNavigateToSPM}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-100 text-purple-900 hover:bg-purple-200 border border-purple-300 transition-colors cursor-pointer"
                  >
                    Ir a SPM
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. MODAL SUBIR DOCUMENTO */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Subir Archivo a la Biblioteca
                  </h3>
                  <p className="text-xs text-slate-500">
                    PDF, Word, Excel o imagen · Persistente en Firebase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* File selector input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Seleccionar archivo del dispositivo:
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer border border-slate-200 rounded-xl p-1.5"
                  required={!uploadFileName}
                />
              </div>

              {/* Document Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Nombre descriptivo del documento:
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="Ej: Cuestionario SPM-2 10-30 meses / Lista de Comunicación"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                  required
                />
              </div>

              {/* Scope & Patient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Alcance del documento:</label>
                  <select
                    value={uploadScope}
                    onChange={(e) => setUploadScope(e.target.value as LibraryFileScope)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="negocio">Negocio (General)</option>
                    <option value="paciente">Asociado a Paciente</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Categoría:</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as LibraryFileCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="clinico_general">Clínico General</option>
                    <option value="comunicacion_critica">Lista Comunicación Crítica (CAA)</option>
                    <option value="evaluacion_spm">Evaluación SPM</option>
                    <option value="protocolo">Protocolo Clínico</option>
                    <option value="marketing">Marketing & Negocio</option>
                  </select>
                </div>
              </div>

              {uploadScope === 'paciente' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Seleccionar Paciente:</label>
                  <select
                    value={uploadPatientId}
                    onChange={(e) => setUploadPatientId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  >
                    <option value="">Selecciona un paciente...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} — RUT: {p.rut}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Summary extraction */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block flex items-center justify-between">
                  <span>Resumen breve del archivo:</span>
                  <span className="text-[10px] text-teal-700 font-normal">Ahorro de tokens para IA</span>
                </label>
                <textarea
                  rows={2}
                  value={uploadSummary}
                  onChange={(e) => setUploadSummary(e.target.value)}
                  placeholder="Síntesis concisa del contenido y propósito clínico..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              {/* Key points */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Puntos clave (un punto por línea):
                </label>
                <textarea
                  rows={3}
                  value={uploadKeyPoints}
                  onChange={(e) => setUploadKeyPoints(e.target.value)}
                  placeholder="Punto clave 1&#10;Punto clave 2&#10;Punto clave 3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {uploading ? 'Guardando...' : 'Guardar en Biblioteca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL PREVIEW / DETALLES */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  {getFileIcon(previewFile.fileType)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 line-clamp-1">
                    {previewFile.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {previewFile.fileName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="font-bold text-slate-400 block text-[10px]">Categoría:</span>
                  <span className="font-semibold text-slate-800">{previewFile.category}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block text-[10px]">Alcance:</span>
                  <span className="font-semibold text-slate-800">
                    {previewFile.scope === 'paciente' ? `Paciente: ${previewFile.patientName || 'Asignado'}` : 'Negocio General'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block text-[10px]">Fecha de Carga:</span>
                  <span className="font-mono text-slate-700">{previewFile.uploadedAt.slice(0, 10)}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block text-[10px]">Tamaño:</span>
                  <span className="font-mono text-slate-700">{(previewFile.fileSizeBytes / 1024).toFixed(0)} KB</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <strong className="text-slate-800 font-bold block">Resumen del archivo:</strong>
                <p className="text-slate-700 leading-relaxed">{previewFile.summary}</p>
              </div>

              {previewFile.keyPoints && previewFile.keyPoints.length > 0 && (
                <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-200/80 space-y-1.5">
                  <strong className="text-teal-950 font-bold block">Puntos Clave y Criterios:</strong>
                  <ul className="space-y-1 text-slate-700 list-disc pl-4">
                    {previewFile.keyPoints.map((kp, idx) => (
                      <li key={idx} className="leading-relaxed">{kp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              {previewFile.downloadUrl ? (
                <a
                  href={previewFile.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir / Descargar</span>
                </a>
              ) : <div />}

              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL CONFIRMAR ELIMINACIÓN */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  ¿Eliminar este archivo?
                </h3>
                <p className="text-xs text-slate-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              ¿Estás seguro de que deseas eliminar permanentemente <strong>{fileToDelete.name}</strong> ({fileToDelete.fileName})?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Eliminación</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL CONTEXTO MARKETING (SIN EXPONER PACIENTES) */}
      {marketingContextModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Contexto de Biblioteca para Marketing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Información técnica anonimizada sin nombres de pacientes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMarketingContextModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Los siguientes resúmenes técnicos extraídos de la biblioteca alimentan los pilares de contenido, ganchos y autoridad clínica de Kinesfera, garantizando el resguardo y privacidad total de los pacientes:
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl max-h-60 overflow-y-auto text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed select-all">
              {marketingSnippet || 'No hay documentos generales cargados en biblioteca.'}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setMarketingContextModal(false)}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

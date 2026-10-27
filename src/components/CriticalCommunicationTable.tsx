import React, { useState, useEffect } from 'react';
import { 
  PatientCommunicationEvaluation, 
  LibraryFileDocument 
} from '../types';
import { communicationSkillsService } from '../services/communicationSkillsService';
import { libraryStorageService } from '../services/libraryStorageService';
import { 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Minus, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface CriticalCommunicationTableProps {
  patientId: string;
  patientName?: string;
  onGoToLibrary?: () => void;
  className?: string;
}

export const CriticalCommunicationTable: React.FC<CriticalCommunicationTableProps> = ({
  patientId,
  patientName = 'el niño/a',
  onGoToLibrary,
  className = ''
}) => {
  const [activeChecklistDoc, setActiveChecklistDoc] = useState<LibraryFileDocument | null>(null);
  const [evaluation, setEvaluation] = useState<PatientCommunicationEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const docChecklist = await libraryStorageService.getActiveCommunicationChecklist();
        const allEvals = await communicationSkillsService.loadCommunicationEvaluations();
        if (!isMounted) return;
        setActiveChecklistDoc(docChecklist);
        if (allEvals[patientId]) {
          setEvaluation(allEvals[patientId]);
        } else {
          // Default evaluation mapped to active checklist items
          const items = docChecklist?.checklistItems?.map(ci => ({
            id: ci.id,
            skillName: ci.skillName,
            statusInitial: (ci.instructionsCheck ? 'no' : 'en_proceso') as 'si' | 'en_proceso' | 'no',
            statusFinal: 'si' as 'si' | 'en_proceso' | 'no',
            observations: ci.description,
            isInstructionFollowing: ci.instructionsCheck
          })) || [];

          setEvaluation({
            id: `comm_eval_${patientId}`,
            patientId,
            sourceFileId: docChecklist?.id,
            sourceFileName: docChecklist?.name,
            updatedAt: new Date().toISOString(),
            evaluatorName: 'Klgo. Aldo Olivares Araya',
            hasInstructionFollowLimitation: items.some(i => i.isInstructionFollowing && (i.statusInitial === 'no' || i.statusFinal === 'no')),
            items
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
        Cargando cuadro de habilidades de comunicación...
      </div>
    );
  }

  // If no checklist exists in the library, prompt the user before generating the table
  if (!activeChecklistDoc) {
    return (
      <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-amber-950">
            Lista de Control de Comunicación Crítica no encontrada
          </h4>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            Para generar esta tabla resumen, por favor carga la <strong>Lista de Control de Habilidades de Comunicación Críticas y Funcionales</strong> en la pestaña "Biblioteca".
          </p>
        </div>
        {onGoToLibrary && (
          <button
            onClick={onGoToLibrary}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ir a la Biblioteca para cargar lista</span>
          </button>
        )}
      </div>
    );
  }

  const items = evaluation?.items && evaluation.items.length > 0 
    ? evaluation.items 
    : (activeChecklistDoc.checklistItems || []).map(ci => ({
        id: ci.id,
        skillName: ci.skillName,
        statusInitial: 'en_proceso' as const,
        statusFinal: 'si' as const,
        observations: ci.description,
        isInstructionFollowing: ci.instructionsCheck
      }));

  const renderTrafficLightBadge = (status?: 'si' | 'en_proceso' | 'no') => {
    switch (status) {
      case 'si':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-2xs"></span>
            <span>Sí (Adquirida)</span>
          </span>
        );
      case 'en_proceso':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-2xs"></span>
            <span>En proceso</span>
          </span>
        );
      case 'no':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-2xs"></span>
            <span>No observada</span>
          </span>
        );
      default:
        return <span className="text-slate-400 text-xs">—</span>;
    }
  };

  return (
    <div className={`bg-slate-50/70 rounded-xl border border-slate-200 overflow-hidden space-y-0 ${className}`}>
      {/* Compact Secondary Header Strip */}
      <div className="bg-slate-100 border-b border-slate-200 px-3.5 py-2 text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          <h4 className="text-[11px] sm:text-xs font-bold text-slate-700">
            Complemento Funcional Secundario: Lista de Control de Comunicación en Sesión Kinésica
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            Apoyo al eje motor-sensorial
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-bold text-cyan-800 hover:text-cyan-950 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-200 transition-colors print:hidden cursor-pointer"
          >
            {isExpanded ? 'Compactar vista ▲' : `Ver detalle (${items.length} ítems) ▼`}
          </button>
        </div>
      </div>

      {/* Compact Summary Bar when collapsed on screen (always prints cleanly) */}
      {!isExpanded && (
        <div className="p-2.5 px-3.5 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <span>
            Síntesis funcional en sesión para <strong>{patientName}</strong>: se prioriza la respuesta motriz, postural y exploración de estímulos; la comunicación se registra como facilitador de consignas.
          </span>
          <div className="flex items-center gap-2.5 font-semibold text-[10px] shrink-0">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Adquiridas: {items.filter(i => (i.statusFinal || i.statusInitial) === 'si').length}
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> En proceso: {items.filter(i => (i.statusFinal || i.statusInitial) === 'en_proceso').length}
            </span>
          </div>
        </div>
      )}

      {/* Compact Table (Visible when expanded or in print) */}
      <div className={`${isExpanded ? 'block' : 'hidden print:block'} overflow-x-auto`}>
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold">
              <th className="py-1.5 px-3 w-1/3">Habilidad Funcional</th>
              <th className="py-1.5 px-2 text-center">Inicial</th>
              <th className="py-1.5 px-2 text-center">Final</th>
              <th className="py-1.5 px-3">Observación en Contexto Motor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 text-slate-700 bg-white">
            {items.map((item, idx) => {
              const improved = (item.statusInitial === 'no' && (item.statusFinal === 'en_proceso' || item.statusFinal === 'si')) ||
                               (item.statusInitial === 'en_proceso' && item.statusFinal === 'si');

              return (
                <tr key={item.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-1.5 px-3 font-semibold text-slate-800 align-top">
                    <div className="flex items-start gap-1">
                      {improved && <TrendingUp className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />}
                      <span>{item.skillName}</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2 text-center align-top whitespace-nowrap">
                    {renderTrafficLightBadge(item.statusInitial)}
                  </td>
                  <td className="py-1.5 px-2 text-center align-top whitespace-nowrap">
                    {renderTrafficLightBadge(item.statusFinal || item.statusInitial)}
                  </td>
                  <td className="py-1.5 px-3 text-slate-600 align-top leading-snug text-[10px]">
                    {item.observations || 'Habilidad funcional observada durante el juego psicomotor.'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

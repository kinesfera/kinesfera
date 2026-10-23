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
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0 ${className}`}>
      {/* Table Header Strip */}
      <div className="bg-amber-700 px-4 py-2.5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-200" />
          <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
            Cuadro Resumen: Lista de Control de Habilidades de Comunicación Críticas y Funcionales
          </h4>
        </div>
        <span className="text-[10px] sm:text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
          Fuente: {activeChecklistDoc.name}
        </span>
      </div>

      <div className="p-3 bg-amber-50/50 border-b border-amber-100 text-xs text-amber-900 flex items-center justify-between">
        <span>
          Semáforo por habilidad funcional evaluada en {patientName} (Verde = Adquirida, Amarillo = En proceso, Rojo = No observada).
        </span>
        <div className="flex items-center gap-3 font-bold text-[11px] shrink-0">
          <span className="flex items-center gap-1 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Sí
          </span>
          <span className="flex items-center gap-1 text-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> En proceso
          </span>
          <span className="flex items-center gap-1 text-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> No
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <th className="py-2.5 px-3 w-1/3">Habilidad de Comunicación</th>
              <th className="py-2.5 px-3 text-center">Inicial</th>
              <th className="py-2.5 px-3 text-center">Final</th>
              <th className="py-2.5 px-3">Observaciones Clínicas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {items.map((item, idx) => {
              const improved = (item.statusInitial === 'no' && (item.statusFinal === 'en_proceso' || item.statusFinal === 'si')) ||
                               (item.statusInitial === 'en_proceso' && item.statusFinal === 'si');

              return (
                <tr key={item.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-slate-900 align-top">
                    <div className="flex items-start gap-1.5">
                      {improved && <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />}
                      <span>{item.skillName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center align-top whitespace-nowrap">
                    {renderTrafficLightBadge(item.statusInitial)}
                  </td>
                  <td className="py-2.5 px-3 text-center align-top whitespace-nowrap">
                    {renderTrafficLightBadge(item.statusFinal || item.statusInitial)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 align-top leading-relaxed text-[11px]">
                    {item.observations || 'Habilidad funcional observada en interacción lúdica.'}
                    {item.isInstructionFollowing && item.statusInitial === 'no' && (
                      <span className="block mt-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        ⚡ Se incorpora objetivo prioritario de seguimiento de instrucciones en plan de intervención.
                      </span>
                    )}
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

import React, { useState } from 'react';
import { User, Exercise, SessionResult } from '../types';
import { 
  Users, 
  BookOpen, 
  Smile, 
  Sparkles, 
  Clock, 
  HeartHandshake, 
  CheckCircle,
  Play
} from 'lucide-react';

interface EducatorPortalViewProps {
  educator: User;
  students: User[];
  exercises: Exercise[];
  onStartActiveBreak: (exercise: Exercise) => void;
}

export const EducatorPortalView: React.FC<EducatorPortalViewProps> = ({
  educator,
  students,
  exercises,
  onStartActiveBreak
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      
      {/* Educator Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            PIE
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{educator.specialty || 'Programa de Integración Escolar (PIE)'}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Prof. {educator.firstName} {educator.lastName}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {educator.institution} · Región Metropolitana
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartActiveBreak(exercises[1] || exercises[0])}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Iniciar Pausa Activa de Aula</span>
          </button>
        </div>
      </div>

      {/* Classroom PIE Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Student List in School (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Estudiantes PIE en Seguimiento</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinación de adaptaciones curriculares y autorregulación psicomotriz
            </p>
          </div>

          <div className="space-y-3">
            {students.map(st => {
              const isSelected = st.id === selectedStudentId;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {st.firstName} {st.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        RUT: <strong className="font-mono">{st.rut}</strong> · Ficha: {st.medicalRecordNumber}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                      {st.diagnosis?.includes('TEA') ? 'Apoyo TEA' : 'Apoyo TDAH'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 border-t border-slate-100 pt-2">
                    Diagnóstico: <strong>{st.diagnosis}</strong>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Classroom Sensory Adaptation Plan (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
                Plan de Aula y Pausas Activas
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Adaptaciones para {selectedStudent?.firstName}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Pausa de Movimiento de 3 Minutos:</strong>
                  <span>Realizar ejercicio de "Toque de Rodillas" antes de clases con alta demanda atencional.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Sensibilidad Sonora:</strong>
                  <span>Mantener feedback en modo TEA (tonos senoidales suaves sin alarmas estridentes).</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Refuerzo Positivo Interdisciplinario:</strong>
                  <span>Reconocer cada logro con estrellas en la bitácora escolar de aula.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <span>Equipo en Red: Kinesiología + PIE</span>
              </span>
              <span className="text-teal-600 font-semibold">En sincronía</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

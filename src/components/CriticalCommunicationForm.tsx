import React from 'react';
import { CriticalCommunicationSkills } from '../types';
import { MessageSquare, Check, X, HelpCircle, Eye, Volume2, Calendar } from 'lucide-react';

interface CriticalCommunicationFormProps {
  data: CriticalCommunicationSkills;
  onChange: (updated: CriticalCommunicationSkills) => void;
}

export const CriticalCommunicationForm: React.FC<CriticalCommunicationFormProps> = ({
  data,
  onChange
}) => {
  const updateField = <K extends keyof CriticalCommunicationSkills>(field: K, val: CriticalCommunicationSkills[K]) => {
    onChange({
      ...data,
      [field]: val
    });
  };

  const renderStatusButtons = (
    field: 'reinforcersAppropriate' | 'askHelpAppropriate' | 'askBreaksAppropriate' | 'rejectAppropriate' | 'affirmAcceptAppropriate' | 'respondWaitAppropriate' | 'transitionActivitiesAppropriate' | 'followsVisualSchedule',
    currentVal?: 'si' | 'no' | 'en_proceso'
  ) => {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => updateField(field, 'si')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            currentVal === 'si'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => updateField(field, 'no')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            currentVal === 'no'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => updateField(field, 'en_proceso')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            currentVal === 'en_proceso'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          En proceso
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header explicativo */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-full">
              Protocolo Comunicación Crítica
            </span>
            <span className="text-[10px] font-bold text-amber-900 bg-white px-2 py-0.5 rounded-full border border-amber-300">
              Comunicación Aumentativa y Funcional (CAA)
            </span>
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-amber-950 mt-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>Lista de Control de las Habilidades de Comunicación Críticas</span>
          </h3>
          <p className="text-xs text-amber-800 mt-0.5">
            Para niños mayores de 2 años que aún <strong>no siguen instrucciones verbales estructuradas</strong> o se encuentran en etapas tempranas del lenguaje funcional.
          </p>
        </div>
      </div>

      {/* 1. PEDIR REFORZADORES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px] font-black">1</span>
            <span>1. Pedir Reforzadores (Mandos funcionales)</span>
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium text-[11px]">¿Apropiado?:</span>
            {renderStatusButtons('reinforcersAppropriate', data.reinforcersAppropriate)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Comestibles (Alimentos / Dulces):</label>
            <input
              type="text"
              value={data.reinforcersFood || ''}
              onChange={e => updateField('reinforcersFood', e.target.value)}
              placeholder="Ej. Comida, galleta, jugo..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Juguetes:</label>
            <input
              type="text"
              value={data.reinforcersToys || ''}
              onChange={e => updateField('reinforcersToys', e.target.value)}
              placeholder="Ej. Lo saca solo, señala, pide..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Actividades:</label>
            <input
              type="text"
              value={data.reinforcersActivities || ''}
              onChange={e => updateField('reinforcersActivities', e.target.value)}
              placeholder="Ej. Cosquillas, música, columpio..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2 a 7: HABILIDADES BÁSICAS DE INTERACCIÓN */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2 text-xs uppercase tracking-wider">
          Habilidades de Comunicación Funcional (2 al 7)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 2. Pedir ayuda/asistencia */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">2. Pedir ayuda / asistencia</span>
              {renderStatusButtons('askHelpAppropriate', data.askHelpAppropriate)}
            </div>
            <input
              type="text"
              value={data.askHelpExample || ''}
              onChange={e => updateField('askHelpExample', e.target.value)}
              placeholder="Ejemplo: Hace sonidos, entrega el objeto, dice ayuda..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
            />
          </div>

          {/* 3. Pedir descansos */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">3. Pedir descansos</span>
              {renderStatusButtons('askBreaksAppropriate', data.askBreaksAppropriate)}
            </div>
            <input
              type="text"
              value={data.askBreaksExample || ''}
              onChange={e => updateField('askBreaksExample', e.target.value)}
              placeholder="Ejemplo: Se golpea con las manos, escapa, dice cama o dormir..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
            />
          </div>

          {/* 4. Rechazar */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">4. Rechazar</span>
              {renderStatusButtons('rejectAppropriate', data.rejectAppropriate)}
            </div>
            <input
              type="text"
              value={data.rejectExample || ''}
              onChange={e => updateField('rejectExample', e.target.value)}
              placeholder="Ejemplo: Hace sonidos, empuja la mano, dice no..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
            />
          </div>

          {/* 5. Afirmar / aceptar */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">5. Afirmar / aceptar</span>
              {renderStatusButtons('affirmAcceptAppropriate', data.affirmAcceptAppropriate)}
            </div>
            <input
              type="text"
              value={data.affirmAcceptExample || ''}
              onChange={e => updateField('affirmAcceptExample', e.target.value)}
              placeholder="Ejemplo: Hace sonidos, asiente con la cabeza, dice sí..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
            />
          </div>

          {/* 6. Responder a "esperar" */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">6. Responder a "esperar"</span>
              {renderStatusButtons('respondWaitAppropriate', data.respondWaitAppropriate)}
            </div>
            <input
              type="text"
              value={data.respondWaitExample || ''}
              onChange={e => updateField('respondWaitExample', e.target.value)}
              placeholder="Ejemplo: Tolera 10 segundos, antes era más inquieto..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
            />
          </div>

          {/* 7. Transición entre actividades */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">7. Transición entre actividades</span>
              {renderStatusButtons('transitionActivitiesAppropriate', data.transitionActivitiesAppropriate)}
            </div>
            <input
              type="text"
              value={data.transitionActivitiesExample || ''}
              onChange={e => updateField('transitionActivitiesExample', e.target.value)}
              placeholder="Ejemplo: Se pone a llorar, no tiene problema, se niega..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
            />
          </div>

        </div>
      </div>

      {/* 8. RESPONDER A INSTRUCCIONES: COMPARATIVA VISUAL VS VERBAL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="border-b border-slate-200 pb-2">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black">8</span>
            <span>8. Responder a Instrucciones: Direcciones Visuales vs Direcciones Verbales</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Contrasta cómo responde ante apoyo gestual/visual versus exclusivamente indicaciones auditivo-verbales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* DIRECCIONES VISUALES */}
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-sky-950 font-bold border-b border-sky-200/80 pb-1.5">
              <Eye className="w-4 h-4 text-sky-600" />
              <span>Direcciones Visuales (Con señalamiento / gestos)</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">Se orienta hacia el nombre señalado:</label>
                <input
                  type="text"
                  value={data.visualOrientToName || ''}
                  onChange={e => updateField('visualOrientToName', e.target.value)}
                  placeholder="Ej. Sí responde, mira la tarjeta..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Ven aquí" (con gesto de ven):</label>
                <input
                  type="text"
                  value={data.visualComeHere || ''}
                  onChange={e => updateField('visualComeHere', e.target.value)}
                  placeholder="Ej. Sí va"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Para" (con mano extendida):</label>
                <input
                  type="text"
                  value={data.visualStop || ''}
                  onChange={e => updateField('visualStop', e.target.value)}
                  placeholder="Ej. Sí frena"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Siéntate" (señalando silla):</label>
                <input
                  type="text"
                  value={data.visualSitDown || ''}
                  onChange={e => updateField('visualSitDown', e.target.value)}
                  placeholder="Ej. Sí"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Dámelo" (mano abierta):</label>
                <input
                  type="text"
                  value={data.visualGiveItToMe || ''}
                  onChange={e => updateField('visualGiveItToMe', e.target.value)}
                  placeholder="Ej. Sí entrega"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Ve a por..." (objeto que conoce):</label>
                <input
                  type="text"
                  value={data.visualGoForKnownObject || ''}
                  onChange={e => updateField('visualGoForKnownObject', e.target.value)}
                  placeholder="Ej. Sí va a buscar la pelota"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Ve a..." (lugar que conoce):</label>
                <input
                  type="text"
                  value={data.visualGoToKnownPlace || ''}
                  onChange={e => updateField('visualGoToKnownPlace', e.target.value)}
                  placeholder="Ej. Va al baño o a la colchoneta"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Déjalo en su sitio / suelo":</label>
                <input
                  type="text"
                  value={data.visualLeaveOnPlace || ''}
                  onChange={e => updateField('visualLeaveOnPlace', e.target.value)}
                  placeholder="Ej. Con señalamiento lo logra"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Vamos / Ven conmigo":</label>
                <input
                  type="text"
                  value={data.visualComeWithMe || ''}
                  onChange={e => updateField('visualComeWithMe', e.target.value)}
                  placeholder="Ej. Da la mano y sigue"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* DIRECCIONES VERBALES */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-950 font-bold border-b border-indigo-200/80 pb-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Direcciones Verbales (Exclusivamente voz / sin señalamiento)</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">Se orienta hacia el nombre señalado:</label>
                <input
                  type="text"
                  value={data.verbalOrientToName || ''}
                  onChange={e => updateField('verbalOrientToName', e.target.value)}
                  placeholder="Ej. No responde, solo si se le toca"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Ven aquí":</label>
                <input
                  type="text"
                  value={data.verbalComeHere || ''}
                  onChange={e => updateField('verbalComeHere', e.target.value)}
                  placeholder="Ej. Hay que llamarlo 3-5 veces"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Para":</label>
                <input
                  type="text"
                  value={data.verbalStop || ''}
                  onChange={e => updateField('verbalStop', e.target.value)}
                  placeholder="Ej. Le cuesta parar sin freno físico"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Siéntate":</label>
                <input
                  type="text"
                  value={data.verbalSitDown || ''}
                  onChange={e => updateField('verbalSitDown', e.target.value)}
                  placeholder="Ej. Hay que decirle unas 3-5 veces"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Dámelo":</label>
                <input
                  type="text"
                  value={data.verbalGiveItToMe || ''}
                  onChange={e => updateField('verbalGiveItToMe', e.target.value)}
                  placeholder="Ej. Sí / Le cuesta soltar"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Ve a por..." (objeto que conoce):</label>
                <input
                  type="text"
                  value={data.verbalGoForKnownObject || ''}
                  onChange={e => updateField('verbalGoForKnownObject', e.target.value)}
                  placeholder="Ej. Sí si es su objeto favorito"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Ve a..." (lugar que conoce):</label>
                <input
                  type="text"
                  value={data.verbalGoToKnownPlace || ''}
                  onChange={e => updateField('verbalGoToKnownPlace', e.target.value)}
                  placeholder="Ej. No sigue más de 2 indicaciones"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Déjalo en su sitio / suelo":</label>
                <input
                  type="text"
                  value={data.verbalLeaveOnPlace || ''}
                  onChange={e => updateField('verbalLeaveOnPlace', e.target.value)}
                  placeholder="Ej. Le cuesta"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">"Vamos / Ven conmigo":</label>
                <input
                  type="text"
                  value={data.verbalComeWithMe || ''}
                  onChange={e => updateField('verbalComeWithMe', e.target.value)}
                  placeholder="Ej. Le cuesta responder solo con la voz"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 9. SIGUE UN HORARIO VISUAL Y OBSERVACIONES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">9</span>
            <span>9. Sigue un Horario Visual (Pictogramas / Rutinas TEACCH)</span>
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium text-[11px]">¿Apropiado?:</span>
            {renderStatusButtons('followsVisualSchedule', data.followsVisualSchedule)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Notas sobre el horario visual:</label>
            <input
              type="text"
              value={data.visualScheduleNotes || ''}
              onChange={e => updateField('visualScheduleNotes', e.target.value)}
              placeholder="Ej. Aún no se ha implementado / en proceso con terapeuta..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Observaciones Generales de Comunicación:</label>
            <input
              type="text"
              value={data.generalObservations || ''}
              onChange={e => updateField('generalObservations', e.target.value)}
              placeholder="Ej. Se beneficia fuertemente de apoyos visuales y modelado físico..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

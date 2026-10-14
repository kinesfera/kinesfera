import React, { useState, useMemo } from 'react';
import { SensoryProcessingMeasureSPM2 } from '../types';
import { 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  ExternalLink, 
  FileText,
  School,
  Home,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  getSPMQuestions, 
  calculateSPMScores, 
  SPMQuestion, 
  SPMScaleId 
} from '../data/spmQuestionnaires';

interface SPMOnlineFormModalProps {
  patientId: string;
  patientName: string;
  patientAge?: number; // Optional age in years or months
  isOpen: boolean;
  onClose: () => void;
  onSubmitResults: (spmData: SensoryProcessingMeasureSPM2) => void;
}

export const SPMOnlineFormModal: React.FC<SPMOnlineFormModalProps> = ({
  patientName,
  isOpen,
  onClose,
  onSubmitResults
}) => {
  // Selector de Grupo de Edad: 2 a 5 años (Preschool) vs Mayor a 5 años (Escolar / Primaria)
  const [ageGroup, setAgeGroup] = useState<'2_a_5_anos' | 'mayor_5_anos'>('mayor_5_anos');
  
  // Selector de Destinatario: Hogar (Padres / Cuidadores) vs Escuela (Aula / Educadores)
  const [formType, setFormType] = useState<'hogar' | 'escuela'>('hogar');

  // Datos del Encuestado
  const [respondentName, setRespondentName] = useState('');
  const [respondentRelationship, setRespondentRelationship] = useState('Madre');
  const [activeTab, setActiveTab] = useState<'link' | 'fill'>('fill');
  const [copiedLink, setCopiedLink] = useState(false);

  // Mapa de respuestas: número de pregunta (1..75) -> valor (1: Nunca, 2: Ocasionalmente, 3: Frecuentemente, 4: Siempre)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [filterScale, setFilterScale] = useState<string>('todas');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // Obtener preguntas actuales según la configuración seleccionada
  const questions: SPMQuestion[] = useMemo(() => {
    return getSPMQuestions(ageGroup, formType);
  }, [ageGroup, formType]);

  // Cálculo en tiempo real de avance y puntajes
  const { answeredTotal, totalQuestions, scores } = useMemo(() => {
    return calculateSPMScores(answers, questions, ageGroup, formType);
  }, [answers, questions, ageGroup, formType]);

  // Preguntas filtradas por escala (si el usuario elige ver por dimensión)
  const filteredQuestions = useMemo(() => {
    if (filterScale === 'todas') return questions;
    return questions.filter(q => q.scale === filterScale);
  }, [questions, filterScale]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://kinesfera.app';
  const shareableUrl = `${currentOrigin}/?cuestionario=spm&edad=${ageGroup}&tipo=${formType}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAnswerChange = (qNum: number, value: number) => {
    setAnswers(prev => ({ ...prev, [qNum]: value }));
  };

  // Autocompletar rápido con perfil típico / moderado para pruebas clínicas
  const handleQuickFill = (defaultVal: number) => {
    const newAnswers: Record<number, number> = {};
    questions.forEach(q => {
      // Si el ítem es positivo y queremos perfil típico, respondemos 4 (Siempre lo hace)
      if (q.isReverseScored) {
        newAnswers[q.num] = defaultVal === 1 ? 4 : defaultVal === 3 ? 2 : 3;
      } else {
        newAnswers[q.num] = defaultVal;
      }
    });
    setAnswers(newAnswers);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const calculatedData: SensoryProcessingMeasureSPM2 = {
      targetAgeGroup: ageGroup,
      questionnaireType: formType,
      socialParticipationScore: scores.social.t,
      socialParticipationRange: scores.social.range,
      visionScore: scores.vision.t,
      visionRange: scores.vision.range,
      hearingScore: scores.hearing.t,
      hearingRange: scores.hearing.range,
      touchScore: scores.touch.t,
      touchRange: scores.touch.range,
      tasteSmellScore: scores.tasteSmell.t,
      tasteSmellRange: scores.tasteSmell.range,
      bodyAwarenessScore: scores.bodyAwareness.t,
      bodyAwarenessRange: scores.bodyAwareness.range,
      balanceMotionScore: scores.balanceMotion.t,
      balanceMotionRange: scores.balanceMotion.range,
      planningIdeasScore: scores.planningIdeas.t,
      planningIdeasRange: scores.planningIdeas.range,
      totalSensoryScore: scores.totalSensory.t,
      totalSensoryRange: scores.totalSensory.range,
      difHomeSchoolScore: 3,
      difInterpretation: 'Sin Diferencia',
      itemAnswers: answers,
      totalAnsweredCount: answeredTotal,
      applicationMethod: formType === 'hogar' ? 'enlace_padres' : 'enlace_escuela',
      questionnaireFilledDate: new Date().toISOString().slice(0, 10),
      respondentName: respondentName.trim() || (formType === 'hogar' ? 'Familia del Paciente' : 'Profesor/a de Aula'),
      respondentRelationship: respondentRelationship
    };

    onSubmitResults(calculatedData);
    setSubmittedNotice(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedNotice(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-sky-100">
                  SPM · Medida de Procesamiento Sensorial
                </span>
                <span className="text-[10px] font-bold text-sky-200 bg-sky-900/60 px-2 py-0.5 rounded-full">
                  {totalQuestions} Preguntas Estandarizadas
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold mt-0.5">
                Cuestionario Sensorial para {formType === 'hogar' ? 'Padres (Hogar)' : 'la Escuela (Aula)'}
              </h3>
              <p className="text-xs text-blue-100">
                Ficha del Paciente: <strong className="text-white">{patientName || 'Paciente en Evaluación'}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SELECTORES DE EDAD Y DESTINATARIO (2 a 5 años vs > 5 años | Padres vs Escuela) */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* 1. Selector de Rango de Edad */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                1. Rango de Edad del Niño(a):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAgeGroup('2_a_5_anos');
                    setAnswers({});
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    ageGroup === '2_a_5_anos'
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  👶 De 2 a 5 años (Preschool)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAgeGroup('mayor_5_anos');
                    setAnswers({});
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    ageGroup === 'mayor_5_anos'
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🧒 Mayor a 5 años (Escolar)
                </button>
              </div>
            </div>

            {/* 2. Selector de Cuestionario: Padres vs Escuela */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                2. Destinatario del Cuestionario:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('hogar');
                    setRespondentRelationship('Madre');
                    setAnswers({});
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    formType === 'hogar'
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Padres (Hogar - 75 ítems)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType('escuela');
                    setRespondentRelationship('Profesor Jefe');
                    setAnswers({});
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    formType === 'escuela'
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Escuela (Aula - {ageGroup === '2_a_5_anos' ? '75 ítems' : '62 ítems'})</span>
                </button>
              </div>
            </div>

          </div>

          {/* Barra de progreso de respuesta y pestañas de vista */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('fill')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'fill'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                ✏️ Responder Cuestionario ({answeredTotal}/{totalQuestions})
              </button>
              <button
                onClick={() => setActiveTab('link')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'link'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                🔗 Compartir Link Web
              </button>
            </div>

            {/* Barra de completitud */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Progreso:</span>
              <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((answeredTotal / totalQuestions) * 100)}%` }}
                />
              </div>
              <span className="font-mono font-bold text-slate-900">
                {Math.round((answeredTotal / totalQuestions) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Contenido principal del modal */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'link' ? (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-950 leading-relaxed space-y-2">
                <h4 className="font-extrabold text-sky-900 flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4 text-sky-600" />
                  Enlace de Autollenado para {formType === 'hogar' ? 'la Familia (Hogar)' : 'el Colegio (Aula)'}
                </h4>
                <p>
                  El enlace generado a continuación abre directamente el cuestionario estandarizado <strong>SPM ({ageGroup === '2_a_5_anos' ? '2 a 5 años' : 'mayor a 5 años'})</strong> adaptado para <strong>{formType === 'hogar' ? 'Padres / Cuidadores' : 'Docentes / Educadores'}</strong>.
                </p>
                <p className="text-[11px] text-sky-800">
                  Al contestar las {totalQuestions} preguntas desde su teléfono o computador, los datos se sincronizan y calculan automáticamente el perfil sensorial estandarizado (Puntajes T, Percentiles y Disfunción Sensorial) en la ficha clínica de este paciente.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Enlace único generado para este paciente:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 font-mono select-all focus:outline-hidden"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Link'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Mensaje sugerido para enviar por WhatsApp o Email:
                </span>
                <p className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-sans italic">
                  "Estimada familia/profesor(a): Para complementar la evaluación de {patientName || 'nuestro paciente'}, le solicitamos responder este cuestionario de procesamiento sensorial SPM ({totalQuestions} preguntas): {shareableUrl}. Le tomará entre 10 y 15 minutos. Muchas gracias."
                </p>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('fill')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                >
                  ¿Prefieres responder o registrar las respuestas ahora en pantalla? Ir al formulario →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Información del Encuestado */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre de quien responde:</label>
                  <input
                    type="text"
                    required
                    placeholder={formType === 'hogar' ? 'Nombre del padre/madre/tutor' : 'Nombre del educador/a'}
                    value={respondentName}
                    onChange={(e) => setRespondentName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parentesco o Rol:</label>
                  <select
                    value={respondentRelationship}
                    onChange={(e) => setRespondentRelationship(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden cursor-pointer"
                  >
                    {formType === 'hogar' ? (
                      <>
                        <option value="Madre">Madre</option>
                        <option value="Padre">Padre</option>
                        <option value="Tutor Legal">Tutor Legal</option>
                        <option value="Abuelo/a">Abuelo / Abuela</option>
                        <option value="Cuidador Principal">Cuidador Principal</option>
                      </>
                    ) : (
                      <>
                        <option value="Educadora de Párvulos">Educadora de Párvulos</option>
                        <option value="Profesor Jefe">Profesor Jefe</option>
                        <option value="Educadora Diferencial / PIE">Educadora Diferencial (PIE)</option>
                        <option value="Terapeuta de Aula">Terapeuta Ocupacional Escolar</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Atajos de Autocompletado:</label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFill(1)}
                      className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg cursor-pointer"
                      title="Marca perfil neurotípico (sin dificultades)"
                    >
                      Puntaje Típico
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill(3)}
                      className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold rounded-lg cursor-pointer"
                      title="Marca respuestas frecuentes para probar disfunción"
                    >
                      Disfunción
                    </button>
                  </div>
                </div>
              </div>

              {/* Filtro por Escalas / Dimensiones sensoriales */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Filtrar por dimensión:</span>
                {[
                  { id: 'todas', label: `Todas (${questions.length})` },
                  { id: 'SOC', label: 'Participación Social' },
                  { id: 'VIS', label: 'Visión' },
                  { id: 'HEA', label: 'Audición' },
                  { id: 'TOU', label: 'Tacto' },
                  { id: 'TS', label: 'Gusto y Olfato' },
                  { id: 'BOD', label: 'Conciencia Corporal' },
                  { id: 'BAL', label: 'Equilibrio' },
                  { id: 'PLA', label: 'Planificación e Ideas' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilterScale(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterScale === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Escala Likert de Referencia */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-blue-950">
                  Escala de Calificación de 4 Puntos:
                </span>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-md bg-white border border-slate-300 font-bold flex items-center justify-center text-blue-700">1</span> Nunca (N)</span>
                  <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-md bg-white border border-slate-300 font-bold flex items-center justify-center text-blue-700">2</span> Ocasionalmente (O)</span>
                  <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-md bg-white border border-slate-300 font-bold flex items-center justify-center text-blue-700">3</span> Frecuentemente (F)</span>
                  <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-md bg-white border border-slate-300 font-bold flex items-center justify-center text-blue-700">4</span> Siempre (S)</span>
                </div>
              </div>

              {/* LISTA COMPLETA DE PREGUNTAS (1 a 75) */}
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredQuestions.map((q) => {
                  const currentVal = answers[q.num];
                  return (
                    <div 
                      key={q.num}
                      className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        currentVal !== undefined
                          ? 'bg-white border-blue-200 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-black flex items-center justify-center text-[11px] shrink-0">
                            {q.num}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {q.scaleName}
                          </span>
                          {q.vulnerability && (
                            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                              {q.vulnerability}
                            </span>
                          )}
                          {q.isReverseScored && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                              Ítem Positivo (Invertido)
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-800 pl-8 text-xs leading-relaxed">
                          {q.text}
                        </p>
                      </div>

                      {/* Botones de opción 1, 2, 3, 4 */}
                      <div className="flex items-center gap-1 shrink-0 pl-8 sm:pl-0">
                        {[
                          { val: 1, label: 'N', desc: 'Nunca' },
                          { val: 2, label: 'O', desc: 'Ocasionalmente' },
                          { val: 3, label: 'F', desc: 'Frecuentemente' },
                          { val: 4, label: 'S', desc: 'Siempre' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => handleAnswerChange(q.num, opt.val)}
                            className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex flex-col items-center justify-center ${
                              currentVal === opt.val
                                ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-300'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title={opt.desc}
                          >
                            <span>{opt.label}</span>
                            <span className="text-[9px] opacity-75">{opt.val}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumen de Puntajes en Tiempo Real */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-sky-300">
                    Cálculo Psicométrico SPM en Vivo
                  </span>
                  <span className="text-xs text-slate-300">
                    Preguntas respondidas: <strong className="text-white">{answeredTotal} / {totalQuestions}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: 'Social (SOC)', score: scores.social },
                    { label: 'Visión (VIS)', score: scores.vision },
                    { label: 'Audición (HEA)', score: scores.hearing },
                    { label: 'Tacto (TOU)', score: scores.touch },
                    { label: 'Gusto/Olfato (TS)', score: scores.tasteSmell },
                    { label: 'Propiocepción (BOD)', score: scores.bodyAwareness },
                    { label: 'Vestibular (BAL)', score: scores.balanceMotion },
                    { label: 'Praxias (PLA)', score: scores.planningIdeas }
                  ].map((sc, idx) => (
                    <div key={idx} className="bg-white/10 p-2.5 rounded-xl border border-white/10 space-y-1">
                      <div className="text-[10px] text-slate-300 font-semibold truncate">{sc.label}</div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-mono font-bold text-sky-300">Bruto: {sc.score.raw}</span>
                        <span className="text-xs font-mono font-black text-white">T: {sc.score.t}</span>
                      </div>
                      <span className={`text-[9px] font-bold block truncate px-1.5 py-0.5 rounded ${
                        sc.score.t >= 70 ? 'bg-rose-500/30 text-rose-300' : sc.score.t >= 60 ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'
                      }`}>
                        {sc.score.range.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs border-t border-white/10">
                  <span className="text-slate-300">
                    Total Sistemas Sensoriales (TOT): <strong className="text-sky-300 font-mono">{scores.totalSensory.raw} pts</strong> (T={scores.totalSensory.t})
                  </span>
                  <span className={`font-black px-2 py-0.5 rounded text-xs ${
                    scores.totalSensory.t >= 70 ? 'bg-rose-500 text-white' : scores.totalSensory.t >= 60 ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                  }`}>
                    {scores.totalSensory.range}
                  </span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cerrar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || answeredTotal === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Guardando en Ficha...' : `Integrar Respuestas (${answeredTotal}/${totalQuestions}) en Ficha Clínica`}
                  </span>
                </button>
              </div>

              {submittedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center font-bold animate-in fade-in">
                  ✓ Respuestas del cuestionario SPM integradas exitosamente a la ficha clínica del paciente.
                </div>
              )}

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

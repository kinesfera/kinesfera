import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, 
  PatientAnamnesis, 
  ClinicalEvaluations, 
  ProgressNote, 
  WeeklyHomePracticePackage 
} from '../types';
import { calculatePatientAge } from '../utils/ageHelper';
import { CompanyDocumentHeader } from './CompanyDocumentHeader';
import { 
  Phone, 
  Share2, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  FileText, 
  User as UserIcon, 
  Building2, 
  GraduationCap, 
  Home, 
  Activity, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Send, 
  Edit3, 
  Plus, 
  Trash2, 
  Smartphone, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Target
} from 'lucide-react';

interface WeeklyHomePracticeModalProps {
  patient: User;
  anamnesis?: PatientAnamnesis;
  evaluations?: ClinicalEvaluations;
  progressNotes: ProgressNote[];
  selectedNoteId?: string;
  clinicianName?: string;
  clinicianSpecialty?: string;
  clinicianInstitution?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyHomePracticeModal: React.FC<WeeklyHomePracticeModalProps> = ({
  patient,
  anamnesis,
  evaluations,
  progressNotes,
  selectedNoteId,
  clinicianName,
  clinicianSpecialty,
  clinicianInstitution,
  isOpen,
  onClose
}) => {
  // Age calculation
  const ageInfo = useMemo(() => {
    return calculatePatientAge(patient.birthDate);
  }, [patient.birthDate]);

  // Caregiver info
  const caregiverName = anamnesis?.caregiverName || patient.emergencyContact?.name || 'Familia';
  const rawPhone = anamnesis?.caregiverPhone || patient.emergencyContact?.phone || '';

  // Tab: 'whatsapp' | 'printable_pdf' | 'customize'
  const [activeModalTab, setActiveModalTab] = useState<'whatsapp' | 'printable_pdf' | 'customize'>('whatsapp');

  // Phone state (editable)
  const [targetPhone, setTargetPhone] = useState(rawPhone);
  useEffect(() => {
    setTargetPhone(rawPhone);
  }, [rawPhone]);

  // Week number & dates
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [weekLabel, setWeekLabel] = useState<string>('Semana del Tratamiento');
  
  // Clean phone for WhatsApp API
  const cleanPhone = useMemo(() => {
    return targetPhone.replace(/\D/g, '');
  }, [targetPhone]);

  // Latest progress note
  const patientNotes = useMemo(() => {
    return progressNotes.filter(n => n.patientId === patient.id);
  }, [progressNotes, patient.id]);

  const selectedNote = useMemo(() => {
    if (selectedNoteId) {
      const found = patientNotes.find(n => n.id === selectedNoteId);
      if (found) return found;
    }
    return patientNotes[0] || null;
  }, [selectedNoteId, patientNotes]);

  // Dynamic Weekly Activities State
  const defaultActivities = useMemo(() => {
    const diag = (patient.diagnosis || anamnesis?.consultationReason || '').toLowerCase();
    const isUnder3 = !ageInfo.isOlderThanThree;

    if (isUnder3) {
      // Under 3 years activities (Lactantes / Estimulación Temprana)
      return [
        {
          id: 'act-1',
          dayLabel: 'Diario (Lunes a Domingo)',
          title: 'Tummy Time & Simetría Cervical',
          description: 'Colocar al bebé boca abajo sobre el pecho de papá/mamá o colchoneta firme durante 5 a 8 minutos, usando sonajero o espejo a la altura de sus ojos para estimular el giro activo de la cabeza.',
          durationMinutes: 10,
          recommendedFrequency: '2 a 3 veces al día',
          sensoryOrMotorFocus: 'Control cefálico y prevención de asimetría postural',
          homeMaterialsNeeded: 'Colchoneta limpia, juguete con sonido o espejo'
        },
        {
          id: 'act-2',
          dayLabel: 'Lunes, Miércoles y Viernes',
          title: 'El Rodillo Mágico (Transición de Sedente a Cuatro Puntos)',
          description: 'Hacer rodar al bebé suavemente sobre una toalla enrollada o cojín tubular facilitando que apoye las palmas abiertas y cargue peso sobre sus bracitos sin forzar.',
          durationMinutes: 10,
          recommendedFrequency: '1 vez al día',
          sensoryOrMotorFocus: 'Carga de peso en miembros superiores y equilibrio en tronco',
          homeMaterialsNeeded: 'Toalla de baño enrollada'
        },
        {
          id: 'act-3',
          dayLabel: 'Martes, Jueves y Sábado',
          title: 'Juego de Alcance en Sedente Asistido',
          description: 'Sentado en el suelo con apoyo de las piernas de la mamá, ofrecerle objetos a diferentes alturas (arriba, derecha, izquierda) para que incline su tronco y vuelva al centro.',
          durationMinutes: 12,
          recommendedFrequency: '1 vez al día',
          sensoryOrMotorFocus: 'Reacciones de enderezamiento y agarre bimanual',
          homeMaterialsNeeded: 'Cubos de colores o pelotas suaves'
        }
      ];
    } else {
      // Over 3 years activities (Jardín / Escuela / Psicomotricidad)
      if (diag.includes('tea') || diag.includes('autista') || diag.includes('sensorial')) {
        return [
          {
            id: 'act-1',
            dayLabel: 'Diario (Lunes a Domingo)',
            title: 'La Oruga en la Alfombra (Presión Profunda & Regulación)',
            description: 'Envolver al niño de forma entretenida entre dos frazadas o cojines grandes (haciendo un "sandwich") aplicando presión firme y constante con las manos para calmar la desregulación motora.',
            durationMinutes: 10,
            recommendedFrequency: '1 vez al día (ideal antes de dormir)',
            sensoryOrMotorFocus: 'Propiocepción y modulación del sistema nervioso',
            homeMaterialsNeeded: 'Frazada pesada o 2 cojines del sillón'
          },
          {
            id: 'act-2',
            dayLabel: 'Lunes, Miércoles y Viernes',
            title: 'El Circuito de Lava (Equilibrio y Apoyo Unipodal)',
            description: 'Poner 4 cojines en el suelo separados por 30 cm. El niño debe pasar de un cojín al otro sin tocar el suelo ("la lava"), manteniendo el equilibrio durante 3 segundos en cada estación.',
            durationMinutes: 15,
            recommendedFrequency: '1 vez al día',
            sensoryOrMotorFocus: 'Equilibrio estático/dinámico y praxia motriz global',
            homeMaterialsNeeded: 'Cojines y cinta de enmascarar en el piso'
          },
          {
            id: 'act-3',
            dayLabel: 'Martes, Jueves y Sábado',
            title: 'Empuje de la Muralla del Gigante (Fuerza Isométrica)',
            description: 'De pie frente a una pared firme, apoyar las palmas con codos semiflexionados y empujar con toda su fuerza durante 10 segundos, descansando 5 segundos (repetir 5 veces).',
            durationMinutes: 8,
            recommendedFrequency: '2 veces al día (antes de tareas escolares)',
            sensoryOrMotorFocus: 'Descarga muscular, conciencia corporal y atención',
            homeMaterialsNeeded: 'Pared despejada en casa'
          }
        ];
      } else {
        return [
          {
            id: 'act-1',
            dayLabel: 'Lunes, Miércoles y Viernes',
            title: 'Sentadillas de Carga Bipedestada (Fuerza y Apoyo Plantar)',
            description: 'Agacharse despacio doblando rodillas como si se sentara en una roca imaginaria, manteniendo la planta del pie completamente apoyada en el suelo sin elevar los talones (8 a 10 repeticiones).',
            durationMinutes: 10,
            recommendedFrequency: '1 vez al día',
            sensoryOrMotorFocus: 'Fuerza de cuádriceps, dorsiflexión de tobillo y alineación',
            homeMaterialsNeeded: 'Silla baja o colchoneta'
          },
          {
            id: 'act-2',
            dayLabel: 'Martes, Jueves y Sábado',
            title: 'Marcha de Talones y Puntas (Control Sensorio-Motor de Tobillo)',
            description: 'Caminar sobre una línea dibujada en el suelo 10 pasos apoyando solo los talones, y luego 10 pasos apoyando toda la planta con flexión activa de tobillo para regular la marcha.',
            durationMinutes: 10,
            recommendedFrequency: '1 vez al día',
            sensoryOrMotorFocus: 'Propiocepción podal y coordinación dinámica',
            homeMaterialsNeeded: 'Cinta adhesiva de papel en el pasillo'
          },
          {
            id: 'act-3',
            dayLabel: 'Diario (Lunes a Domingo)',
            title: 'Equilibrio en un Pie (El Flamenco Valiente)',
            description: 'Levantar un pie apoyando la planta en la pantorrilla contraria y contar hasta 5 sin caerse. Repetir 3 veces con cada pierna frente a un espejo.',
            durationMinutes: 8,
            recommendedFrequency: '2 veces al día',
            sensoryOrMotorFocus: 'Estabilidad de pelvis y control postural dinámico',
            homeMaterialsNeeded: 'Espejo de pared o pasillo despejado'
          }
        ];
      }
    }
  }, [patient.diagnosis, anamnesis?.consultationReason, ageInfo.isOlderThanThree]);

  const [activities, setActivities] = useState(defaultActivities);

  // Sync default activities when patient changes
  useEffect(() => {
    setActivities(defaultActivities);
  }, [defaultActivities]);

  // Primary Goal
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    return evaluations?.therapeuticGoalsShortTerm || 'Consolidar el equilibrio y control postural en las actividades de la vida diaria.';
  });

  // Recent Progress Text
  const [progressHighlight, setProgressHighlight] = useState(() => {
    if (selectedNote) {
      return `Sesión del ${selectedNote.date}: ${selectedNote.notes}`;
    }
    return '¡Excelente compromiso y avances observados en la sesión kinésica de esta semana!';
  });

  // School recommendations (if > 3 years)
  const defaultSchoolNotes = useMemo(() => {
    if (!ageInfo.isOlderThanThree) {
      return 'Por ser menor de 3 años, el enfoque es 100% domiciliario y de estimulación temprana con la familia. (Si asiste a sala cuna, indicar cambio de posición cada 30 min y juego libre en colchoneta).';
    }
    return evaluations?.schoolRecommendations || 
      '1. Permitir pausas de movimiento cada 30 minutos (levantarse a botar un papel o estirar bracitos).\n2. Favorecer asiento con pies bien apoyados en el suelo (usar una caja bajo los pies si la silla queda alta).\n3. En educación física y recreos, supervisar juegos con desniveles y dar apoyos visuales claros.';
  }, [ageInfo.isOlderThanThree, evaluations?.schoolRecommendations]);

  const [schoolRecommendationsText, setSchoolRecommendationsText] = useState(defaultSchoolNotes);

  // Custom Kinesiology notes for the family
  const [familyNote, setFamilyNote] = useState(
    'Recuerden que la constancia y el juego positivo valen más que la perfección. 10 a 15 minutos diarios compartidos en familia generan los cambios reales en su sistema nervioso.'
  );

  // Copied alert
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Build Formatted WhatsApp Message
  const whatsappMessage = useMemo(() => {
    const prof = clinicianName || 'Klgo. Aldo Olivares · KinesFera';
    const childFirst = patient.firstName;

    let msg = `Hola estimada/o *${caregiverName}*, te saluda *${prof}* de *Centro Clínico KinesFera* 🧩.\n\n`;
    msg += `Te comparto el *Reporte Semanal & Pauta de Práctica en el Hogar* para *${patient.firstName} ${patient.lastName}* (${ageInfo.ageText}):\n\n`;
    
    msg += `🎯 *OBJETIVO PRIORITARIO DE LA SEMANA:*\n`;
    msg += `${weeklyGoal}\n\n`;

    if (progressHighlight) {
      msg += `⭐ *AVANCE REGISTRADO EN SESIÓN:*\n`;
      msg += `${progressHighlight}\n\n`;
    }

    msg += `📋 *EJERCICIOS & JUEGOS PARA PRACTICAR EN CASA:*\n`;
    activities.forEach((act, idx) => {
      msg += `*${idx + 1}. ${act.title}* (${act.dayLabel || 'Semanal'})\n`;
      msg += `• *Cómo hacerlo:* ${act.description}\n`;
      msg += `• *Frecuencia:* ${act.recommendedFrequency} (~${act.durationMinutes} min)\n`;
      msg += `• *Materiales:* ${act.homeMaterialsNeeded}\n\n`;
    });

    if (ageInfo.isOlderThanThree) {
      msg += `🏫 *PAUTAS PARA EL JARDÍN / ESCUELA (> 3 años):*\n`;
      msg += `${schoolRecommendationsText}\n\n`;
    } else {
      msg += `🍼 *ENFOQUE EN EL HOGAR (< 3 años):*\n`;
      msg += `Por su edad, concentramos toda la práctica jugando en casa con papá y mamá sobre colchonetas limpias.\n\n`;
    }

    msg += `💡 *RECOMENDACIÓN KINÉSICA:*\n`;
    msg += `${familyNote}\n\n`;

    msg += `¡Cualquier duda o video que quieran compartirme de su práctica en casa, me lo envían por aquí! Nos vemos en la próxima sesión. 👏🧩`;

    return msg;
  }, [
    caregiverName, 
    clinicianName, 
    patient.firstName, 
    patient.lastName, 
    ageInfo.ageText, 
    ageInfo.isOlderThanThree, 
    weeklyGoal, 
    progressHighlight, 
    activities, 
    schoolRecommendationsText, 
    familyNote
  ]);

  // Generate WhatsApp Direct Send Link
  const whatsappDirectUrl = useMemo(() => {
    const encoded = encodeURIComponent(whatsappMessage);
    if (cleanPhone) {
      return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    }
    return `https://api.whatsapp.com/send?text=${encoded}`;
  }, [cleanPhone, whatsappMessage]);

  // Print PDF handler
  const handlePrint = () => {
    window.print();
  };

  // Add / Remove activity handlers in Customize tab
  const handleAddActivity = () => {
    const newAct = {
      id: `act-${Date.now()}`,
      dayLabel: 'Lunes a Domingo',
      title: 'Nuevo Ejercicio para el Hogar',
      description: 'Describe aquí el juego o ejercicio paso a paso...',
      durationMinutes: 10,
      recommendedFrequency: '1 vez al día',
      sensoryOrMotorFocus: 'Coordinación y control',
      homeMaterialsNeeded: 'Materiales simples de casa'
    };
    setActivities([...activities, newAct]);
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleUpdateActivity = (id: string, field: string, value: any) => {
    setActivities(activities.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      
      {/* Modal Card */}
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* =================================================================== */}
        {/* MODAL HEADER: Paciente, Edad (> 3 años detectado) y Cierre         */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Phone className="w-3 h-3 text-slate-950" />
                  <span>Envío Semanal para el Hogar vía WhatsApp</span>
                </span>

                {ageInfo.isOlderThanThree ? (
                  <span className="text-[10px] font-bold text-sky-200 bg-blue-500/30 border border-sky-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-sky-300" />
                    <span>Jardín / Escuela (&gt; 3 años)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-200 bg-emerald-500/30 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Home className="w-3 h-3 text-emerald-300" />
                    <span>Estimulación Hogar (&lt; 3 años)</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{patient.firstName} {patient.lastName}</span>
                <span className="text-xs font-semibold text-sky-200 bg-white/10 px-2.5 py-1 rounded-lg">
                  {ageInfo.ageText}
                </span>
              </h2>

              <p className="text-xs text-sky-100/90 mt-1 max-w-2xl leading-relaxed">
                Apoderado/a: <strong>{caregiverName}</strong> · Ficha: <strong>{patient.medicalRecordNumber || 'NN-01'}</strong> · Diagnóstico: {patient.diagnosis || 'Evaluación funcional kinésica'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="self-start sm:self-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/15 text-xs font-bold">
            <button
              onClick={() => setActiveModalTab('whatsapp')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeModalTab === 'whatsapp'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md ring-2 ring-emerald-300'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>1. Enviar por WhatsApp (1 Clic)</span>
            </button>

            <button
              onClick={() => setActiveModalTab('printable_pdf')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeModalTab === 'printable_pdf'
                  ? 'bg-blue-500 text-white font-black shadow-md ring-2 ring-blue-300'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>2. Ficha Semanal Imprimible / PDF</span>
            </button>

            <button
              onClick={() => setActiveModalTab('customize')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeModalTab === 'customize'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>3. Personalizar Ejercicios ({activities.length})</span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* MODAL BODY (Scrollable)                                             */}
        {/* =================================================================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* TAB 1: WHATSAPP DIRECT SENDER */}
          {activeModalTab === 'whatsapp' && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* WhatsApp Config Bar */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-950 block">WhatsApp del Apoderado/a:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <input
                        type="text"
                        placeholder="Ej. +56 9 9123 4567"
                        value={targetPhone}
                        onChange={e => setTargetPhone(e.target.value)}
                        className="px-2.5 py-1 text-xs bg-white border border-emerald-300 rounded-lg font-mono font-bold text-slate-900 outline-hidden w-48"
                      />
                      <span className="text-[11px] text-emerald-800">
                        {cleanPhone ? `(Válido: ${cleanPhone})` : '⚠️ Sin número registrado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Abrir en WhatsApp</span>
                    <ExternalLink className="w-3 h-3 text-emerald-200" />
                  </a>

                  <button
                    onClick={() => handleCopyText(whatsappMessage)}
                    className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-2xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiar Mensaje</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time WhatsApp Chat Bubble Simulation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Vista Previa del Mensaje para la Familia:</span>
                  </span>
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    Formato oficial KinesFera Copiapó
                  </span>
                </div>

                {/* Simulated Phone Screen */}
                <div className="bg-[#E5DDD5] p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-inner max-h-[500px] overflow-y-auto">
                  <div className="bg-white rounded-2xl rounded-tr-xs p-4 sm:p-5 shadow-sm max-w-2xl ml-auto border border-emerald-100 text-xs sm:text-[13px] leading-relaxed text-slate-900 whitespace-pre-wrap font-sans">
                    {whatsappMessage}
                    <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-slate-400">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCircle2 className="w-3 h-3 text-sky-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500">
                  💡 Tip: Puedes adjuntar la Ficha en PDF después de enviar el mensaje en el mismo chat de WhatsApp.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalTab('printable_pdf')}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Ver Ficha Imprimible / PDF</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar a {caregiverName} por WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRINTABLE / PDF OFFICIAL KINESFERA WEEKLY SHEET */}
          {activeModalTab === 'printable_pdf' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs">
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-700">Ficha Semanal Lista para Descargar o Imprimir en PDF</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Descargar PDF / Imprimir</span>
                  </button>

                  <button
                    onClick={() => handleCopyText(whatsappMessage)}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiar Texto</span>
                  </button>
                </div>
              </div>

              {/* PRINTABLE SHEET CONTAINER (Clean, institutional styling) */}
              <div 
                id="printable-weekly-sheet"
                className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-800 shadow-sm print:p-0 print:border-none print:shadow-none"
              >
                {/* Official Company Document Header with Logo Option */}
                <CompanyDocumentHeader
                  documentTitle="Ficha Semanal de Práctica en el Hogar"
                  documentSubtitle="Kinesiología Pediátrica · Neurodesarrollo · Integración Sensorial"
                  emissionDate={new Date().toLocaleDateString('es-CL')}
                  recordNumber={patient.medicalRecordNumber || 'NN-01'}
                />

                {/* Patient Summary Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Paciente:</span>
                    <strong className="text-slate-900">{patient.firstName} {patient.lastName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Edad:</span>
                    <span className="text-slate-800 font-semibold">{ageInfo.ageText}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Apoderado/a:</span>
                    <span className="text-slate-800">{caregiverName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Etapa:</span>
                    <span className={`font-bold ${ageInfo.isOlderThanThree ? 'text-blue-700' : 'text-emerald-700'}`}>
                      {ageInfo.stageBadgeText}
                    </span>
                  </div>
                </div>

                {/* Primary Weekly Goal & Progress Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-blue-600" />
                      <span>Objetivo Prioritario de la Semana:</span>
                    </span>
                    <p className="text-slate-900 font-semibold text-xs leading-relaxed">
                      {weeklyGoal}
                    </p>
                  </div>

                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Logro Destacado en Consulta:</span>
                    </span>
                    <p className="text-slate-900 font-medium text-xs leading-relaxed">
                      {progressHighlight}
                    </p>
                  </div>
                </div>

                {/* Activities Table with Daily Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>Plan de Juegos y Práctica Diaria en Casa:</span>
                    </h3>
                    <span className="text-[10px] text-slate-500 italic">
                      Marcar con ✔ cada día completado
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px]">
                          <th className="py-2.5 px-3 font-bold">Actividad / Juego</th>
                          <th className="py-2.5 px-3 font-bold w-1/3">Instrucciones & Materiales</th>
                          <th className="py-2.5 px-2 text-center font-bold">Frecuencia</th>
                          <th className="py-2.5 px-3 text-center font-bold">Lu · Ma · Mi · Ju · Vi · Sá · Do</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {activities.map((act, i) => (
                          <tr key={act.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 align-top">
                              <span className="font-extrabold text-blue-900 block">{i + 1}. {act.title}</span>
                              <span className="text-[10px] text-slate-500 font-semibold">{act.sensoryOrMotorFocus}</span>
                            </td>
                            <td className="py-3 px-3 align-top text-slate-700 leading-relaxed text-[11px]">
                              <p>{act.description}</p>
                              <p className="text-[10px] text-slate-500 mt-1">
                                <strong>Materiales:</strong> {act.homeMaterialsNeeded}
                              </p>
                            </td>
                            <td className="py-3 px-2 align-top text-center text-[11px] font-semibold text-slate-700">
                              <span>{act.recommendedFrequency}</span>
                              <span className="block text-[10px] text-slate-400">({act.durationMinutes} min)</span>
                            </td>
                            <td className="py-3 px-3 align-middle text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, dIdx) => (
                                  <div 
                                    key={dIdx} 
                                    className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-400 bg-white"
                                  >
                                    {day}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recommendations for School or Early Home (Conditional on Age > 3) */}
                <div className="space-y-3">
                  {ageInfo.isOlderThanThree ? (
                    <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span>Recomendaciones para Jardín Infantil / Escuela / Aula PIE (&gt; 3 años):</span>
                      </span>
                      <p className="text-slate-800 whitespace-pre-line text-xs leading-relaxed">
                        {schoolRecommendationsText}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                        <Home className="w-4 h-4 text-emerald-600" />
                        <span>Pautas de Estimulación Temprana en el Hogar (&lt; 3 años):</span>
                      </span>
                      <p className="text-slate-800 text-xs leading-relaxed">
                        A esta edad, el vínculo y el juego libre en el suelo son la base del neurodesarrollo. Evitar el uso de andadores o pantallas; priorizar superficies firmes y respuesta afectiva a sus intentos motores.
                      </p>
                    </div>
                  )}

                  {/* Family Motivation Note */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
                    <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-amber-900">Mensaje para la Familia: </strong>
                      <span className="text-amber-800">{familyNote}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Signature Block */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    <p className="font-bold text-slate-700">Centro Clínico KinesFera · Copiapó</p>
                    <p>Atención kinésica infantil, neurorehabilitación y desarrollo psicomotor</p>
                  </div>

                  <div className="text-center w-64 border-t border-dashed border-slate-400 pt-2">
                    <p className="font-bold text-xs text-slate-900">{clinicianName || 'Klgo. Aldo Olivares'}</p>
                    <p className="text-[10px] text-slate-500">{clinicianSpecialty || 'Kinesiología Pediátrica · Neurorehabilitación'}</p>
                    <p className="text-[9px] font-mono text-slate-400">Registro SIS · KinesFera</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: CUSTOMIZE ACTIVITIES & WEEKLY GOALS */}
          {activeModalTab === 'customize' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <span>Personalizar Pauta de la Semana</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ajusta los objetivos, notas o agrega nuevos ejercicios según lo observado en la última sesión.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar Ejercicio</span>
                </button>
              </div>

              {/* Goal & Highlight Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Objetivo de la Semana</label>
                  <input
                    type="text"
                    value={weeklyGoal}
                    onChange={e => setWeeklyGoal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Avance Destacado de Sesión</label>
                  <input
                    type="text"
                    value={progressHighlight}
                    onChange={e => setProgressHighlight(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                  />
                </div>
              </div>

              {/* Activities Editor */}
              <div className="space-y-3">
                <span className="font-bold text-xs text-slate-700 block">
                  Ejercicios Activos ({activities.length}):
                </span>

                {activities.map((act, index) => (
                  <div key={act.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
                        Ejercicio #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(act.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Eliminar este ejercicio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Título del Juego</label>
                        <input
                          type="text"
                          value={act.title}
                          onChange={e => handleUpdateActivity(act.id, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Foco Sensoriomotor</label>
                        <input
                          type="text"
                          value={act.sensoryOrMotorFocus}
                          onChange={e => handleUpdateActivity(act.id, 'sensoryOrMotorFocus', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Descripción / Instrucciones para los Padres</label>
                      <textarea
                        rows={2}
                        value={act.description}
                        onChange={e => handleUpdateActivity(act.id, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Frecuencia / Duración</label>
                        <input
                          type="text"
                          value={act.recommendedFrequency}
                          onChange={e => handleUpdateActivity(act.id, 'recommendedFrequency', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Materiales en Casa</label>
                        <input
                          type="text"
                          value={act.homeMaterialsNeeded}
                          onChange={e => handleUpdateActivity(act.id, 'homeMaterialsNeeded', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* School Recommendations Editor if > 3 years */}
              {ageInfo.isOlderThanThree && (
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 block">
                    Pautas para Jardín Infantil / Escuela (&gt; 3 años)
                  </label>
                  <textarea
                    rows={3}
                    value={schoolRecommendationsText}
                    onChange={e => setSchoolRecommendationsText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                    placeholder="Pautas para la educadora o aula escolar..."
                  />
                </div>
              )}

              {/* Family Note */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Mensaje Motivacional para los Padres</label>
                <textarea
                  rows={2}
                  value={familyNote}
                  onChange={e => setFamilyNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('whatsapp')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Listo, Ver Mensaje de WhatsApp</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

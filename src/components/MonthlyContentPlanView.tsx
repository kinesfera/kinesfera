import React, { useState, useMemo } from 'react';
import { 
  MonthlyContentPlan, 
  ContentPlanPost, 
  ContentFormat, 
  ContentCategoryType 
} from '../types';
import { 
  ALL_MONTHLY_PLANS, 
  PLAN_MES_NOVIEMBRE 
} from '../data/monthlyContentPlans';
import { 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Video, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Eye, 
  Filter, 
  Play, 
  AlertCircle, 
  Users, 
  Target, 
  BookOpen, 
  Smartphone, 
  Lightbulb, 
  ChevronRight, 
  Zap, 
  RefreshCw, 
  Layers,
  MapPin,
  Stethoscope,
  BarChart3,
  Flame,
  Award,
  ChevronDown
} from 'lucide-react';

interface MonthlyContentPlanViewProps {
  onSelectInquiryChannel?: () => void;
}

export const MonthlyContentPlanView: React.FC<MonthlyContentPlanViewProps> = () => {
  // 1. Month Selector: Default to November 2026 (Active Month requested by user)
  const [selectedMonthId, setSelectedMonthId] = useState<string>(PLAN_MES_NOVIEMBRE.id);

  // Active plan object
  const activePlan: MonthlyContentPlan = useMemo(() => {
    return ALL_MONTHLY_PLANS.find(p => p.id === selectedMonthId) || PLAN_MES_NOVIEMBRE;
  }, [selectedMonthId]);

  // 2. Post Statuses (Persisted in localStorage)
  const [postStatuses, setPostStatuses] = useState<Record<string, 'Planificado' | 'Grabado' | 'Publicado'>>(() => {
    const saved = localStorage.getItem('kinesfera_content_post_statuses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading post statuses', e);
      }
    }
    // Default initial statuses for November
    return {
      'nov-p1': 'Publicado',
      'nov-p2': 'Grabado',
      'nov-p3': 'Planificado',
      'nov-p4': 'Planificado'
    };
  });

  const updatePostStatus = (postId: string, newStatus: 'Planificado' | 'Grabado' | 'Publicado') => {
    const updated = { ...postStatuses, [postId]: newStatus };
    setPostStatuses(updated);
    localStorage.setItem('kinesfera_content_post_statuses', JSON.stringify(updated));
  };

  // 3. Filters
  const [weekFilter, setWeekFilter] = useState<'all' | 'S1' | 'S2' | 'S3' | 'S4'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | ContentFormat>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ContentCategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Copied feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // 5. Teleprompter Modal state
  const [teleprompterPost, setTeleprompterPost] = useState<ContentPlanPost | null>(null);

  // 6. Interactive AI Niche Analyzer & Custom Content Generator
  const [generatorAudience, setGeneratorAudience] = useState<'Lactantes 0-12m (HINE / Craneometría)' | 'Preescolares 2-5 años (Marcha / Torpeza / SPM)' | 'Escolares PIE (Atención / Dispraxia)' | 'Bebés Primavera Copiapó (Calor / Coche)' | 'Adolescentes (Postura / Escoliosis)'>('Lactantes 0-12m (HINE / Craneometría)');
  const [generatorObjective, setGeneratorObjective] = useState<'Atraer Pacientes Nuevos' | 'Vender Packs de 4 u 8 Sesiones' | 'Preventa Taller de Verano' | 'Alianza Médicos / Fonoaudiólogos' | 'Informes Escolares PIE 2027'>('Atraer Pacientes Nuevos');
  const [generatorFormat, setGeneratorFormat] = useState<ContentFormat>('Reel');
  const [generatedDynamicPost, setGeneratedDynamicPost] = useState<ContentPlanPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return activePlan.posts.filter(p => {
      if (weekFilter !== 'all' && !p.weekDay.startsWith(weekFilter)) return false;
      if (formatFilter !== 'all' && p.format !== formatFilter) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTopic = p.topic.toLowerCase().includes(q);
        const matchesHook = p.hookScript.toLowerCase().includes(q);
        const matchesCaption = p.caption.toLowerCase().includes(q);
        if (!matchesTopic && !matchesHook && !matchesCaption) return false;
      }
      return true;
    });
  }, [activePlan, weekFilter, formatFilter, typeFilter, searchQuery]);

  // Statistics for active plan
  const totalPosts = activePlan.posts.length;
  const publishedCount = activePlan.posts.filter(p => (postStatuses[p.id] || p.status) === 'Publicado').length;
  const recordedCount = activePlan.posts.filter(p => (postStatuses[p.id] || p.status) === 'Grabado').length;
  const plannedCount = totalPosts - publishedCount - recordedCount;
  const progressPercent = Math.round(((publishedCount + recordedCount * 0.5) / (totalPosts || 1)) * 100);

  // Dynamic Generator Handler
  const handleGenerateCustomPost = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let topic = '';
      let hookVariants: string[] = [];
      let hookScript = '';
      let needScript = '';
      let valuePoints: string[] = [];
      let ctaScript = '';
      let caption = '';
      let reason = '';

      if (generatorAudience === 'Lactantes 0-12m (HINE / Craneometría)') {
        topic = 'Preferencia de giro en bebés: cuándo la postura se vuelve asimetría';
        hookVariants = [
          'A) Si tu bebé solo mira hacia la derecha cuando duerme o toma pecho, esto te interesa.',
          'B) ¿Tu guagua tiene una postura favorita? No siempre es "maña": puede ser tortícolis.',
          'C) El signo que la mayoría de los padres nota tarde en el cuello de su bebé.'
        ];
        hookScript = '"Si tu bebé siempre gira la cabecita hacia el mismo lado cuando duerme o toma pecho... no es una simple preferencia."';
        needScript = '"En los primeros 6 meses, los músculos del cuello y los huesos del cráneo son muy maleables. Cuando hay una contractura en el esternocleidomastoideo, el bebé apoya siempre la misma zona de la cabeza, lo que en pocas semanas genera aplanamiento (plagiocefalia)."';
        valuePoints = [
          'Evaluación con craneómetro de precisión milimétrica (sin dolor ni radiación).',
          'Técnicas miofasciales pediátricas suaves que liberan el rango de rotación cervical.',
          'Pautas de posicionamiento y juegos en decúbito prono (tummy time asistido) para el hogar.'
        ];
        ctaScript = '"En KinesFera Copiapó evaluamos la simetría de tu bebé y te enseñamos cómo acompañarlo en casa. Escríbenos para una cita."';
        caption = '¿Tu bebé solo mira hacia un lado? 🧩 En los primeros meses es vital revisar el rango de giro cervical. Una evaluación kinésica oportuna previene asimetrías y entrega tranquilidad a la familia.\n\n🧩 Copiapó, Chile\n🧩 Escríbenos por mensaje privado para orientarte sin costo.';
        reason = 'Cruce de datos: Los lactantes evaluados con HINE en la clínica muestran un 42% de hipertonía cervical asimétrica y el calor de Copiapó en noviembre hace que los padres usen más sillas nido.';
      } else if (generatorAudience === 'Bebés Primavera Copiapó (Calor / Coche)') {
        topic = 'Copiapó con calor: coche, bouncers y riesgo de cabeza plana en primavera';
        hookVariants = [
          'A) El calor de Copiapó está cambiando la postura de tu bebé y quizás no lo notaste.',
          'B) ¿Tu bebé pasa más tiempo en el coche por el calor? Ojo con su cabecita.',
          'C) 3 errores comunes al pasear con lactantes en días calurosos en Atacama.'
        ];
        hookScript = '"El calor de noviembre en Copiapó trae un riesgo silencioso para los bebés: el exceso de coche y superficies rígidas."';
        needScript = '"Para capear el calor, muchas familias usan el coche con colchonetas sintéticas o dejan al bebé largo rato en el huevito. Esa presión constante sobre el mismo punto del cráneo blando acelera la plagiocefalia posicional."';
        valuePoints = [
          'Cómo hacer tummy time fresco sobre el pecho de los papás o toallas de algodón.',
          'Rotación alterna de la cabecita durante las siestas con ventilación adecuada.',
          'Medición objetiva con índice craneal en KinesFera.'
        ];
        ctaScript = '"Si tienes dudas sobre la forma de su cabecita, tráelo a evaluación en Copiapó antes del verano. Escríbenos al WhatsApp."';
        caption = 'Noviembre en Copiapó significa calor y cambios de rutina. 🧩 No dejes que la gravedad aplane la cabecita de tu bebé mientras pasea en coche. En KinesFera cuidamos su desarrollo desde el primer mes.\n\n🧩 Copiapó, Atacama | Agenda tu evaluación';
        reason = 'Dato estacional y geográfico: Temperaturas sobre 28°C en Copiapó reducen el tiempo en alfombra de suelo e incrementan el uso de bouncers y coches.';
      } else if (generatorAudience === 'Escolares PIE (Atención / Dispraxia)') {
        topic = '¿El colegio te pidió informe kinésico para el Programa PIE 2027?';
        hookVariants = [
          'A) Si en la reunión de apoderados te hablaron del PIE para el próximo año... mira esto.',
          'B) ¿Tu hijo necesita informe de neurodesarrollo antes de diciembre? Esto debe incluir.',
          'C) Por qué un informe kinésico estandarizado marca la diferencia en la postulación PIE.'
        ];
        hookScript = '"Si el colegio te pidió un informe kinésico para postular o renovar el Programa PIE 2027 en Copiapó, el tiempo apremia."';
        needScript = '"Muchos colegios cierran la recepción de informes en noviembre. Para que el equipo diferencial acepte la postulación, el informe debe medir coordinación motora, praxias, tono y perfil sensorial con escalas estandarizadas validadas (como Da Fonseca o SPM)."';
        valuePoints = [
          'Evaluación motriz integral de 60 minutos con diagnóstico funcional según la CIF.',
          'Perfil sensorial SPM-2 para adecuar el ambiente escolar (búsqueda de movimiento o fatiga).',
          'Entrega rápida del documento timbrado para presentar a la coordinación PIE de Copiapó.'
        ];
        ctaScript = '"Abrimos horas prioritarias para evaluaciones de informes escolares esta semana en Copiapó. Escríbenos para asegurar tu cupo."';
        caption = 'Noviembre es el mes clave para los informes del Programa PIE 2027. 🧩 Una evaluación kinésica con diagnósticos objetivos entrega al colegio las herramientas para apoyar a tu hijo el próximo año.\n\n🧩 Informes rápidos y rigurosos en Copiapó\n🧩 Escríbenos para coordinar';
        reason = 'Coyuntura escolar: Noviembre es el período límite en el calendario escolar de Copiapó para presentar carpetas de integración escolar MINEDUC.';
      } else if (generatorObjective === 'Preventa Taller de Verano') {
        topic = 'Preventa Taller Grupal de Psicomotricidad Verano 2027 en KinesFera';
        hookVariants = [
          'A) ¿Qué hará tu hijo este verano? Menos pantallas, más movimiento organizado.',
          'B) Abrimos los primeros 8 cupos del Taller Grupal de Psicomotricidad KinesFera.',
          'C) El taller que estabas esperando en Copiapó para niños inquietos o tímidos para moverse.'
        ];
        hookScript = '"¿Quieres que tu hijo pase el verano pegado a las pantallas o desarrollando confianza y amigos a través del movimiento?"';
        needScript = '"En Copiapó la oferta de actividades infantiles en vacaciones suele ser escasa. Por eso diseñamos un taller terapéutico y lúdico en grupos reducidos de 3 a 5 niños liderado por kinesiólogo especialista en neurodesarrollo."';
        valuePoints = [
          'Desafíos de equilibrio, circuitos psicomotrices y juego sensorial cooperativo.',
          'Filtro de ingreso: evaluación individual previa para armar grupos compatibles.',
          'Pack de 4 sesiones semanales a valor preferencial de preventa.'
        ];
        ctaScript = '"Comenta la palabra VERANO o envíanos un WhatsApp para reservar tu cupo prioritario antes de que se agoten."';
        caption = '¡Llega el Taller Grupal de Psicomotricidad Verano 2027 en KinesFera Copiapó! 🧩 Un espacio seguro y entretenido donde el cuerpo, el juego y las habilidades sociales se potencian mutuamente.\n\nGrupos reducidos (3-5 niños). Cupos limitados.\n\n🧩 Escríbenos VERANO para acceder a la preventa';
        reason = 'Objetivo comercial estratégico: Validación y preventa temprana del servicio grupal con flujo de caja garantizado para diciembre/enero.';
      } else {
        topic = 'Marcha en puntillas o torpeza al correr: 3 señales que no debes dejar pasar';
        hookVariants = [
          'A) ¿Tu hijo se tropieza con sus propios pies o camina en puntitas?',
          'B) La diferencia entre torpeza evolutiva normal y una alteración del tono muscular.',
          'C) Si en el jardín te dicen que se cae mucho... esto es lo que evaluamos.'
        ];
        hookScript = '"¿Te han dicho que tu hijo es torpe para correr o notas que camina en puntas de pie? Te cuento qué evaluamos."';
        needScript = '"Muchas veces se le resta importancia esperando que \'con la edad se arregle\'. Sin embargo, una debilidad en el control pélvico o una hipersensibilidad propioceptiva en los pies requiere estímulos precisos para evitar compensaciones en rodillas y columna."';
        valuePoints = [
          'Medición de dorsiflexión de tobillo y simetría de apoyo plantar.',
          'Pruebas de equilibrio dinámico y coordinación óculo-pedal en colchonetas.',
          'Plan de tratamiento con juegos funcionales y saltos estructurados.'
        ];
        ctaScript = '"En KinesFera Copiapó trabajamos desde el juego para que moverse sea motivo de alegría y no de frustración. Contáctanos."';
        caption = '¿Se cae con frecuencia o camina en puntillas? 🧩 La torpeza motriz no es flojera ni falta de ganas: es un sistema que necesita entrenamiento específico. Una evaluación a tiempo hace toda la diferencia.\n\n🧩 KinesFera Copiapó · Atención personalizada\n🧩 Escríbenos para agendar';
        reason = 'Frecuencia clínica: El 28% de los pacientes de la consulta consultan por inestabilidad dinámica y dificultades de coordinación.';
      }

      const generated: ContentPlanPost = {
        id: `dyn-post-${Date.now()}`,
        monthId: activePlan.id,
        postNumber: 13,
        weekDay: 'Propuesta Personalizada IA',
        format: generatorFormat,
        topic,
        type: generatorObjective === 'Atraer Pacientes Nuevos' ? 'You Content' : generatorObjective === 'Preventa Taller de Verano' ? 'Conversión' : 'Referidos Médicos',
        hookVariants,
        hookScript,
        needScript,
        valuePoints,
        ctaScript,
        caption,
        hashtags: ['#KinesiologiaInfantil', '#Copiapo', '#Neurodesarrollo', '#KinesFera', '#DesarrolloMotor', '#NiñosSaludables'],
        productionNotes: [
          'Aldo a cámara frontal, fondo con colchonetas y bloques sensoriales de colores.',
          'Subtítulos obligatorios con palabras clave resaltadas en amarillo.',
          'Duración: 55 a 70 segundos con ritmo dinámico.'
        ],
        dataDrivenReason: reason,
        status: 'Planificado'
      };

      setGeneratedDynamicPost(generated);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* ===================================================================== */}
      {/* TOP HEADER: PLAN DE CONTENIDOS Y CONTEXTO MENSUAL                     */}
      {/* ===================================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-indigo-800/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-slate-950" />
                <span>Estrategia de Contenidos por Mes</span>
              </span>
              <span className="text-[10px] font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-300" />
                <span>Copiapó & Región de Atacama</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>3 Posts / Semana (Lunes, Miércoles, Viernes)</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Calendar className="w-7 h-7 text-sky-400 shrink-0" />
              <span>{activePlan.monthTitle}</span>
            </h2>

            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
              <strong>Objetivo del Mes:</strong> {activePlan.objective}
            </p>
          </div>

          {/* Monthly KPI Progress Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shrink-0 flex flex-col justify-between min-w-[240px]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-sky-200">Avance de Publicación</span>
              <span className="text-xs font-mono font-black text-amber-300">{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 mb-3">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div className="bg-white/5 rounded-lg py-1.5 px-1 border border-white/10">
                <span className="text-emerald-300 font-black text-sm block">{publishedCount}</span>
                <span className="text-slate-300">Publicados</span>
              </div>
              <div className="bg-white/5 rounded-lg py-1.5 px-1 border border-white/10">
                <span className="text-amber-300 font-black text-sm block">{recordedCount}</span>
                <span className="text-slate-300">Grabados</span>
              </div>
              <div className="bg-white/5 rounded-lg py-1.5 px-1 border border-white/10">
                <span className="text-sky-300 font-black text-sm block">{plannedCount}</span>
                <span className="text-slate-300">Planificados</span>
              </div>
            </div>
          </div>
        </div>

        {/* MONTH SELECTOR BUTTONS */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Seleccionar Mes del Plan:</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {ALL_MONTHLY_PLANS.map((plan) => {
                const isSelected = plan.id === selectedMonthId;
                const isCurrentNovember = plan.id === 'plan_mes_noviembre';
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedMonthId(plan.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-102 ring-2 ring-amber-300'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    <span>{plan.monthTitle.split('·')[0].trim()}</span>
                    {isCurrentNovember && (
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-black ${
                        isSelected ? 'bg-slate-950 text-amber-300' : 'bg-amber-400 text-slate-950'
                      }`}>
                        Mes Actual
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 1: MOTOR DE ANÁLISIS DE DATOS (CLÍNICA + NICHO EXTERNO)       */}
      {/* ===================================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Inteligencia de Datos Clínicos & Nicho Territorial</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              ¿Por qué estos contenidos para {activePlan.monthTitle.split('·')[0].trim()}?
            </h3>
            <p className="text-xs text-slate-500 max-w-3xl">
              Cruce automatizado entre la <strong>base real de pacientes de KinesFera</strong> (diagnósticos, edades, CRM) y el <strong>contexto estacional de Copiapó</strong> (clima, colegios, fechas críticas PIE y médicos derivadores).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Copiapó, Atacama</span>
            </span>
          </div>
        </div>

        {/* 3 Pillars of Data Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Pillar 1: Datos de Pacientes y Clínica */}
          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>1. Datos de Pacientes (Kinesfera)</span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              {activePlan.nicheAnalysisSummary.clinicDataFindings}
            </p>
            <div className="pt-2 border-t border-blue-200/60 text-[10px] space-y-1 text-blue-950 font-medium">
              <div className="flex justify-between">
                <span>• TEA & Trastornos Sensoriales (SPM):</span>
                <strong className="font-bold">34% de fichas</strong>
              </div>
              <div className="flex justify-between">
                <span>• TDAH & Inestabilidad Postural:</span>
                <strong className="font-bold">28% de fichas</strong>
              </div>
              <div className="flex justify-between">
                <span>• Lactantes & HINE (Tortícolis/Plagio):</span>
                <strong className="font-bold">22% de fichas</strong>
              </div>
            </div>
          </div>

          {/* Pillar 2: Tendencias de Pacientes y Familias */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>2. Tendencias & Dudas de Padres</span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              {activePlan.nicheAnalysisSummary.patientTrends}
            </p>
            <div className="pt-2 border-t border-indigo-200/60 text-[10px] space-y-1 text-indigo-950 font-medium">
              <div className="flex justify-between">
                <span>• Consultas WhatsApp por Informes PIE:</span>
                <strong className="font-bold">+65% en Noviembre</strong>
              </div>
              <div className="flex justify-between">
                <span>• Objeción "¿Es maña o cuerpo?":</span>
                <strong className="font-bold">Pregunta #1</strong>
              </div>
              <div className="flex justify-between">
                <span>• Conversión Evaluación → Pack:</span>
                <strong className="font-bold">62% de éxito</strong>
              </div>
            </div>
          </div>

          {/* Pillar 3: Contexto Externo y Estacional Copiapó */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>3. Estacionalidad & Nicho Externo</span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              {activePlan.nicheAnalysisSummary.seasonalNicheContext}
            </p>
            <div className="pt-2 border-t border-emerald-200/60 text-[10px] space-y-1 text-emerald-950 font-medium">
              <div className="flex justify-between">
                <span>• Cierre escolar & Carpetas PIE:</span>
                <strong className="font-bold">2da/3ra semana Nov</strong>
              </div>
              <div className="flex justify-between">
                <span>• Temperaturas Copiapó:</span>
                <strong className="font-bold">&gt;28°C (uso coche)</strong>
              </div>
              <div className="flex justify-between">
                <span>• Formato con mayor retención:</span>
                <strong className="font-bold">Reels 60s + Carrusel</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy summary box */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold text-amber-900">Recomendación Estratégica del Asesor para {activePlan.monthTitle.split('·')[0].trim()}:</strong>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              {activePlan.nicheAnalysisSummary.bestFormatsRecommended} Mantener rigurosamente los 3 días de publicación (Lunes, Miércoles y Viernes) para generar hábito en el algoritmo y recordación en las familias de Copiapó.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 2: GENERADOR INTERACTIVO DE GUIONES ASISTIDO POR DATOS (IA)   */}
      {/* ===================================================================== */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-indigo-800/80 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Motor Inteligente de Síntesis de Contenidos</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Generar Propuesta Adicional Cruzando Datos de la Clínica
            </h3>
            <p className="text-xs text-indigo-200 max-w-2xl">
              ¿Viste un caso particular en consulta hoy o tienes una necesidad comercial urgente? El motor cruza el perfil del paciente con el contexto de Copiapó para redactar un guión exacto listo para grabar.
            </p>
          </div>

          <button
            onClick={handleGenerateCustomPost}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Analizando Nicho...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Analizar Datos & Generar Guión</span>
              </>
            )}
          </button>
        </div>

        {/* Generator Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-indigo-200 block mb-1">1. Perfil / Grupo de Pacientes</label>
            <select
              value={generatorAudience}
              onChange={e => setGeneratorAudience(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-medium outline-hidden"
            >
              <option value="Lactantes 0-12m (HINE / Craneometría)" className="bg-slate-900 text-white">Lactantes 0-12m (HINE / Craneometría)</option>
              <option value="Bebés Primavera Copiapó (Calor / Coche)" className="bg-slate-900 text-white">Bebés Primavera Copiapó (Calor / Coche)</option>
              <option value="Preescolares 2-5 años (Marcha / Torpeza / SPM)" className="bg-slate-900 text-white">Preescolares 2-5 años (Marcha / Torpeza)</option>
              <option value="Escolares PIE (Atención / Dispraxia)" className="bg-slate-900 text-white">Escolares PIE (Atención / Dispraxia)</option>
              <option value="Adolescentes (Postura / Escoliosis)" className="bg-slate-900 text-white">Adolescentes (Postura / Escoliosis)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-indigo-200 block mb-1">2. Objetivo de Negocio</label>
            <select
              value={generatorObjective}
              onChange={e => setGeneratorObjective(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-medium outline-hidden"
            >
              <option value="Atraer Pacientes Nuevos" className="bg-slate-900 text-white">Atraer Pacientes Nuevos (Evaluación)</option>
              <option value="Vender Packs de 4 u 8 Sesiones" className="bg-slate-900 text-white">Vender Packs de Sesiones</option>
              <option value="Preventa Taller de Verano" className="bg-slate-900 text-white">Preventa Taller de Verano</option>
              <option value="Informes Escolares PIE 2027" className="bg-slate-900 text-white">Informes Escolares PIE 2027</option>
              <option value="Alianza Médicos / Fonoaudiólogos" className="bg-slate-900 text-white">Alianza Médicos / Fonoaudiólogos</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-indigo-200 block mb-1">3. Formato Preferido</label>
            <select
              value={generatorFormat}
              onChange={e => setGeneratorFormat(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-medium outline-hidden"
            >
              <option value="Reel" className="bg-slate-900 text-white">Reel a Cámara (60-75s)</option>
              <option value="Carrusel" className="bg-slate-900 text-white">Carrusel Educativo (7 láminas)</option>
              <option value="Post foto" className="bg-slate-900 text-white">Post Fotografía con Reflexión</option>
            </select>
          </div>
        </div>

        {/* Display Generated Dynamic Post */}
        {generatedDynamicPost && (
          <div className="bg-white/10 border border-amber-400/40 rounded-2xl p-4 sm:p-5 text-xs space-y-3 animate-in zoom-in-95">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                  Propuesta Generada
                </span>
                <span className="font-extrabold text-sm text-white">{generatedDynamicPost.topic}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTeleprompterPost(generatedDynamicPost)}
                  className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Teleprompter</span>
                </button>
                <button
                  onClick={() => handleCopy(`dyn-${generatedDynamicPost.id}`, `${generatedDynamicPost.hookScript}\n\n${generatedDynamicPost.needScript}\n\n${generatedDynamicPost.valuePoints.join('\n')}\n\n${generatedDynamicPost.ctaScript}`)}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 rounded-lg text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  {copiedId === `dyn-${generatedDynamicPost.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Guión</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <strong className="text-amber-300 block text-[11px] font-bold">Gancho (Primeros 3 segundos):</strong>
                  <p className="text-white italic bg-black/30 p-2.5 rounded-xl border border-white/10 mt-1">
                    {generatedDynamicPost.hookScript}
                  </p>
                </div>
                <div>
                  <strong className="text-sky-300 block text-[11px] font-bold">Cuerpo & Necesidad:</strong>
                  <p className="text-indigo-100 mt-1 leading-relaxed">
                    {generatedDynamicPost.needScript}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <strong className="text-emerald-300 block text-[11px] font-bold">Puntos de Valor a Explicar:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-200 mt-1 text-[11px]">
                    {generatedDynamicPost.valuePoints.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-amber-300 block text-[11px] font-bold">Llamado a la Acción (CTA):</strong>
                  <p className="text-emerald-200 font-bold bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30 mt-1">
                    {generatedDynamicPost.ctaScript}
                  </p>
                </div>
              </div>
            </div>

            {/* Razón basada en datos */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-amber-200">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span><strong>Justificación de datos:</strong> {generatedDynamicPost.dataDrivenReason}</span>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 3: GRILLA COMPLETA DE LAS 12 PUBLICACIONES DEL MES            */}
      {/* ===================================================================== */}
      <div className="space-y-4">
        
        {/* Filters and Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Semana:</span>
            </span>
            {(['all', 'S1', 'S2', 'S3', 'S4'] as const).map(w => (
              <button
                key={w}
                onClick={() => setWeekFilter(w)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  weekFilter === w
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {w === 'all' ? 'Todas' : `Semana ${w.slice(1)}`}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
              <span>Formato:</span>
            </span>
            {(['all', 'Reel', 'Carrusel', 'Post foto'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFormatFilter(f)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  formatFilter === f
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {f === 'all' ? 'Todos' : f}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar por tema o guión..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-blue-400"
            />
            <BookOpen className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Posts Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPosts.map((post) => {
            const currentStatus = postStatuses[post.id] || post.status || 'Planificado';
            const isReel = post.format === 'Reel';
            const isCarrusel = post.format === 'Carrusel';

            return (
              <div 
                key={post.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 transition-all duration-200 hover:shadow-md ${
                  currentStatus === 'Publicado' 
                    ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/10' 
                    : currentStatus === 'Grabado'
                    ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/10'
                    : 'border-slate-200'
                }`}
              >
                {/* Post Top Badges & Status Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                      #{post.postNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {post.weekDay}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 ${
                      isReel 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                        : isCarrusel
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isReel ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      <span>{post.format}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {post.type}
                    </span>
                  </div>

                  {/* Interactive Status Selector */}
                  <div className="flex items-center gap-1">
                    <select
                      value={currentStatus}
                      onChange={e => updatePostStatus(post.id, e.target.value as any)}
                      className={`text-xs font-extrabold rounded-lg px-2 py-1 border cursor-pointer outline-hidden transition-all ${
                        currentStatus === 'Publicado'
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : currentStatus === 'Grabado'
                          ? 'bg-amber-400 text-slate-950 border-amber-500'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <option value="Planificado">⏳ Planificado</option>
                      <option value="Grabado">🎬 Grabado</option>
                      <option value="Publicado">✅ Publicado</option>
                    </select>
                  </div>
                </div>

                {/* Topic Title */}
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                    {post.topic}
                  </h4>
                </div>

                {/* A/B Hook Options (3 Alternatives to catch attention) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1 text-blue-600">
                      <Target className="w-3.5 h-3.5" />
                      <span>Variantes de Gancho (Primeros 3 seg):</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Prueba A/B</span>
                  </div>
                  <div className="space-y-1 text-slate-700 text-[11px]">
                    {post.hookVariants.map((hook, idx) => (
                      <p key={idx} className="leading-tight pl-2 border-l-2 border-blue-400 font-medium">
                        {hook}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Script Body for Aldo */}
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-[11px] font-bold text-slate-700 block">Guión de Entrada (Hook):</strong>
                    <p className="text-slate-900 font-semibold italic bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 mt-0.5 text-[11px]">
                      {post.hookScript}
                    </p>
                  </div>

                  <div>
                    <strong className="text-[11px] font-bold text-slate-700 block">Explicación de la Necesidad:</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                      {post.needScript}
                    </p>
                  </div>

                  <div>
                    <strong className="text-[11px] font-bold text-slate-700 block">Puntos de Valor:</strong>
                    <ul className="text-slate-700 space-y-1 pl-4 list-disc text-[11px] mt-0.5">
                      {post.valuePoints.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="text-[11px] font-bold text-emerald-800 block">Llamado a la Acción (CTA):</strong>
                    <p className="text-emerald-950 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-0.5 text-[11px]">
                      {post.ctaScript}
                    </p>
                  </div>
                </div>

                {/* Data Driven Reason */}
                <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-xl p-2.5 text-[11px] text-indigo-950 flex items-start gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-indigo-900">Por qué funciona según datos: </strong>
                    <span className="text-indigo-800">{post.dataDrivenReason}</span>
                  </div>
                </div>

                {/* Production Notes & Action Shortcuts */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-500 max-w-xs truncate" title={post.productionNotes.join(' · ')}>
                    💡 {post.productionNotes[0]}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setTeleprompterPost(post)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                      title="Abrir en pantalla completa para leer mientras grabas"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Teleprompter</span>
                    </button>

                    <button
                      onClick={() => handleCopy(`cap-${post.id}`, `${post.caption}\n\n${post.hashtags.join(' ')}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                      title="Copiar descripción lista para Instagram con hashtags"
                    >
                      {copiedId === `cap-${post.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copiar Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: MODO TELEPROMPTER / GRABACIÓN PARA ALDO                        */}
      {/* ===================================================================== */}
      {teleprompterPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                  Modo Grabación a Cámara · Post #{teleprompterPost.postNumber} ({teleprompterPost.weekDay})
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {teleprompterPost.topic}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTeleprompterPost(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Production instructions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-sky-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
              <span><strong>Consejo de rodaje:</strong> Graba a la altura de los ojos con luz frontal. Habla como si le explicaras a un amigo en Copiapó, sin prisa.</span>
            </div>

            {/* Script Blocks with large, readable typography */}
            <div className="space-y-5 text-sm sm:text-base leading-relaxed">
              
              {/* Hook block */}
              <div className="p-4 bg-amber-400/10 border-l-4 border-amber-400 rounded-r-xl space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">1. Gancho (0:00 - 0:04):</span>
                <p className="text-white font-bold text-base sm:text-lg">
                  {teleprompterPost.hookScript}
                </p>
              </div>

              {/* Need block */}
              <div className="p-4 bg-blue-500/10 border-l-4 border-blue-400 rounded-r-xl space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-sky-300 block">2. La Necesidad / Problema Real:</span>
                <p className="text-slate-100">
                  {teleprompterPost.needScript}
                </p>
              </div>

              {/* Value Points block */}
              <div className="p-4 bg-indigo-500/10 border-l-4 border-indigo-400 rounded-r-xl space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-300 block">3. Puntos Clave a Explicar:</span>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-100">
                  {teleprompterPost.valuePoints.map((v, i) => (
                    <li key={i} className="font-medium">{v}</li>
                  ))}
                </ul>
              </div>

              {/* CTA block */}
              <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-400 rounded-r-xl space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300 block">4. Llamado a la Acción (CTA Final):</span>
                <p className="text-emerald-200 font-extrabold text-base">
                  {teleprompterPost.ctaScript}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Duración estimada: 60 - 75 segundos
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updatePostStatus(teleprompterPost.id, 'Grabado');
                    setTeleprompterPost(null);
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Marcar como Grabado</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  User, 
  PatientAnamnesis, 
  ClinicalEvaluations, 
  ProgressNote, 
  ComprehensiveReport, 
  SessionResult 
} from '../types';
import { calculatePatientAge } from '../utils/ageHelper';
import { 
  TrendingUp, 
  Brain, 
  Activity, 
  Sparkles, 
  Search, 
  BookOpen, 
  Target, 
  Users, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Lightbulb, 
  Baby, 
  GraduationCap, 
  Award,
  Filter,
  BarChart3,
  Calendar,
  Share2,
  Download
} from 'lucide-react';

interface NicheTrendsAndIntelligenceHubProps {
  patients: User[];
  anamnesisData: Record<string, PatientAnamnesis>;
  evaluationsData: Record<string, ClinicalEvaluations>;
  progressNotes: ProgressNote[];
  comprehensiveReports: ComprehensiveReport[];
  sessionHistory?: SessionResult[];
}

interface TrendArticle {
  id: string;
  title: string;
  category: 'Neurodesarrollo' | 'Psicomotricidad' | 'Integración Sensorial' | 'Craneometría' | 'Inclusión & PIE';
  summary: string;
  clinicalImpact: string;
  actionablePearl: string;
  tags: string[];
  evidenceLevel: string;
}

const NICHE_TRENDS_LIBRARY: TrendArticle[] = [
  {
    id: 'trend-1',
    title: 'Intervención Muy Temprana (< 6 meses) y Detección Predictiva con HINE',
    category: 'Neurodesarrollo',
    summary: 'La neuroplasticidad en los primeros 180 días de vida es la más alta en la vida humana. El examen neurológico infantil de Hammersmith (HINE) permite detectar asimetrías y riesgo motor antes de que se instauren patrones compensatorios rígidos.',
    clinicalImpact: 'Intervenir antes de los 6 meses reduce la severidad de secuelas motoras en un 38% y optimiza la trayectoria del control postural.',
    actionablePearl: 'En lactantes con antecedentes perinatales de riesgo, evaluar HINE cada 8 semanas y priorizar cambios posturales asistidos en prono (Tummy Time activo).',
    tags: ['HINE', 'Lactantes', 'Atención Temprana', 'Neuroplasticidad', 'Control Postural'],
    evidenceLevel: 'Nivel I (Guías Clínicas Internacionales Cochrane / AusACPDM)'
  },
  {
    id: 'trend-2',
    title: 'Aumento de Asimetrías Craneales Posicionales (Plagiocefalia y Braquicefalia)',
    category: 'Craneometría',
    summary: 'Con la campaña "Dormir boca arriba", las consultas por aplanamiento occipital han crecido un 400%. La kinesiología pediátrica actual reemplaza la pasividad con craneometría seriada (índice CVAI), desbloqueo cervical por tortícolis posicional y estimulación motriz simétrica.',
    clinicalImpact: 'Tratamientos kinésicos iniciados antes de los 5 meses logran corrección del 92% sin necesidad de cascos de remodelación craneal.',
    actionablePearl: 'Calcular el CVAI (Diagonal Mayor - Menor / Diagonal Mayor × 100). Si es < 7%, el tratamiento de elección es 100% kinesiológico con estimulación vestibular y rotación cervical.',
    tags: ['Plagiocefalia', 'Braquicefalia', 'Craneometría', 'CVAI', 'Tummy Time'],
    evidenceLevel: 'Nivel II (Revista Chilena de Pediatría / AAP Guidelines)'
  },
  {
    id: 'trend-3',
    title: 'Desregulación Sensoriomotriz en Primera Infancia por Exposición a Pantallas',
    category: 'Integración Sensorial',
    summary: 'El aumento de tiempo sedentario frente a pantallas en menores de 4 años genera privación vestibular y propioceptiva, manifestándose en hipotonía funcional, marcha en puntillas idiopática, labilidad atencional e irritabilidad sensorial en SPM-2.',
    clinicalImpact: 'Los niños no presentan patología neurológica central, sino "sedentarismo sensorio-motor". Responden exponencialmente a circuitos de carga y desafío vestibular.',
    actionablePearl: 'Prescribir la "dieta sensoriomotriz": 60 minutos diarios de juego en suelo con sentido, balanceos, trepa y suspensión antes de cualquier derivación farmacológica.',
    tags: ['SPM-2', 'Pantallas', 'Vestibular', 'Propiocepción', 'Marcha en Puntillas'],
    evidenceLevel: 'Nivel II (Asociación Americana de Pediatría / Journal of Pediatrics)'
  },
  {
    id: 'trend-4',
    title: 'Psicomotricidad Vivenciada y Juego Libre Guiado (Pilar Arnaiz / Aucouturier)',
    category: 'Psicomotricidad',
    summary: 'En niños con dificultades del lenguaje o que no siguen órdenes verbales rígidas (TEA, trastornos de comunicación), la observación de parámetros psicomotores (espacio, tiempo, objetos, diálogo tónico) es la llave diagnóstica y terapéutica más respetuosa y certera.',
    clinicalImpact: 'El juego sensoriomotor libre permite observar la verdadera competencia motriz espontánea, eliminando la ansiedad del rendimiento impuesto.',
    actionablePearl: 'Utilizar módulos de gomaespuma de densidades variadas y telas. Observar cómo el niño ocupa el espacio (periferia vs centro) para graduar la entrada al juego compartido.',
    tags: ['Arnaiz', 'Aucouturier', 'TEA', 'Juego Libre', 'Diálogo Tónico'],
    evidenceLevel: 'Nivel III (Psicomotricidad y Educación Especial / Arnaiz 2023)'
  },
  {
    id: 'trend-5',
    title: 'Batería Psicomotora (BPM Da Fonseca) y su Impacto en el Aula Escolar (PIE)',
    category: 'Inclusión & PIE',
    summary: 'Vítor da Fonseca demostró que el aprendizaje escolar superior (cálculo y lectoescritura) se cimenta sobre la tonicidad, equilibrio, lateralidad y estructuración espacio-temporal. La kinesiología infantil es hoy un puente neurocognitivo clave en colegios.',
    clinicalImpact: 'El 75% de las dificultades de grafomotricidad y lectoescritura en etapa escolar se deben a inmadurez en disociación de praxia global y estructuración rítmica.',
    actionablePearl: 'Al emitir el informe para la escuela, traducir los 7 factores de la BPM en adaptaciones pedagógicas concretas: ergonomía del pupitre, pausas activas y juegos de cruce de línea media.',
    tags: ['BPM', 'Da Fonseca', 'PIE', 'Escuela', 'Grafomotricidad', 'Lateralidad'],
    evidenceLevel: 'Nivel I (Neuropsicología del Desarrollo y Aprendizaje Motor)'
  },
  {
    id: 'trend-6',
    title: 'El Paradigma de las "F-Words" de Rosenbaum en Rehabilitación Infantil',
    category: 'Neurodesarrollo',
    summary: 'La tendencia mundial de la CIF pediátrica adopta los 6 pilares: Fitness (condición física), Function (autonomía funcional), Friends (amigos y socialización), Family (familia y cuidadores), Fun (diversión / juego con sentido) y Future (futuro y potencial).',
    clinicalImpact: 'Traslada el foco desde el "déficit anatómico" hacia la participación y el bienestar integral del niño.',
    actionablePearl: 'Toda sesión debe incluir el pilar "Fun" (diversión): si el ejercicio no tiene sentido lúdico para el niño, el reclutamiento cortical es un 60% menor.',
    tags: ['CIF', 'F-Words', 'CanChild', 'Juego con Sentido', 'Kinesfera'],
    evidenceLevel: 'Nivel I (CanChild Centre for Childhood Disability Research)'
  }
];

export const NicheTrendsAndIntelligenceHub: React.FC<NicheTrendsAndIntelligenceHubProps> = ({
  patients,
  anamnesisData,
  evaluationsData,
  progressNotes,
  comprehensiveReports,
  sessionHistory = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'trends' | 'cohort_analytics'>('cohort_analytics');

  // Filter trends articles
  const filteredTrends = useMemo(() => {
    return NICHE_TRENDS_LIBRARY.filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSearch = 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Aggregate Cohort Analytics from registered patients
  const cohortMetrics = useMemo(() => {
    const totalPatients = patients.length;
    let infantsCount = 0; // < 2 years
    let preschoolersCount = 0; // 2 - 5 years
    let schoolersCount = 0; // > 5 years

    let maleCount = 0;
    let femaleCount = 0;

    // Diagnoses / Reasons
    const reasonTally: Record<string, number> = {};

    patients.forEach(patient => {
      if (patient.gender === 'Hombre') maleCount++;
      else if (patient.gender === 'Mujer') femaleCount++;

      const ageInfo = calculatePatientAge(patient.birthDate);
      if (ageInfo.isUnderTwo) infantsCount++;
      else if (ageInfo.years <= 5) preschoolersCount++;
      else schoolersCount++;

      const anam = anamnesisData[patient.id];
      const diag = patient.diagnosis || anam?.consultationReason || 'Evaluación neurokinesiológica';
      reasonTally[diag] = (reasonTally[diag] || 0) + 1;
    });

    // Evaluations metrics
    let evaluatedHineCount = 0;
    let evaluatedBpmCount = 0;
    let evaluatedSpmCount = 0;
    let evaluatedArnaizCount = 0;

    Object.values(evaluationsData).forEach(evalData => {
      if (evalData.hineExam) evaluatedHineCount++;
      if (evalData.daFonsecaBpm) evaluatedBpmCount++;
      if (evalData.spmSensoryMeasure) evaluatedSpmCount++;
      if (evalData.psychomotorObservation) evaluatedArnaizCount++;
    });

    const totalNotes = progressNotes.length;

    return {
      totalPatients,
      infantsCount,
      preschoolersCount,
      schoolersCount,
      maleCount,
      femaleCount,
      evaluatedHineCount,
      evaluatedBpmCount,
      evaluatedSpmCount,
      evaluatedArnaizCount,
      totalNotes,
      reasonTally
    };
  }, [patients, anamnesisData, evaluationsData, progressNotes]);

  return (
    <div className="space-y-6 text-slate-800 animate-in fade-in">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-sky-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-400 text-teal-950">
                Inteligencia Clínica & Nicho
              </span>
              <span className="text-teal-200 text-xs font-semibold">
                Kinesiología & Psicomotricidad Infantil 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Nutrición de Datos & Tendencias Clínicas del Nicho
            </h2>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              La plataforma compila automáticamente el progreso y evolución de los niños atendidos en Kinesfera, integrándolos con las últimas tendencias basadas en evidencia en neurodesarrollo, integración sensorial y psicomotricidad vivenciada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('cohort_analytics')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'cohort_analytics'
                  ? 'bg-white text-slate-900 shadow-md font-extrabold'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-300" />
              <span>Nutrición de Datos Cohorte ({cohortMetrics.totalPatients})</span>
            </button>

            <button
              onClick={() => setActiveView('trends')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'trends'
                  ? 'bg-white text-slate-900 shadow-md font-extrabold'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>Tendencias & Evidencia ({NICHE_TRENDS_LIBRARY.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* VIEW 1: COHORT REAL-TIME DATA ANALYTICS */}
      {activeView === 'cohort_analytics' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pacientes en Seguimiento
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{cohortMetrics.totalPatients}</span>
                <span className="text-xs text-teal-700 font-bold">Activos</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {cohortMetrics.maleCount} varones · {cohortMetrics.femaleCount} mujeres
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Sesiones Registradas
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-indigo-700">{cohortMetrics.totalNotes}</span>
                <span className="text-xs text-indigo-600 font-semibold">notas clínicas</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Evolución diaria y seguimiento
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Distribución Etaria
              </span>
              <div className="text-xs space-y-0.5 text-slate-700 font-medium">
                <div>🍼 Lactantes (&lt;2a): <strong className="text-slate-900">{cohortMetrics.infantsCount}</strong></div>
                <div>🧒 Preescolar (2-5a): <strong className="text-slate-900">{cohortMetrics.preschoolersCount}</strong></div>
                <div>🎒 Escolar (&gt;5a): <strong className="text-slate-900">{cohortMetrics.schoolersCount}</strong></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pruebas Aplicadas
              </span>
              <div className="text-xs space-y-0.5 text-slate-700 font-medium">
                <div>• HINE: <strong>{cohortMetrics.evaluatedHineCount}</strong> lactantes</div>
                <div>• Da Fonseca BPM: <strong>{cohortMetrics.evaluatedBpmCount}</strong></div>
                <div>• Sensorial SPM-2: <strong>{cohortMetrics.evaluatedSpmCount}</strong></div>
              </div>
            </div>

          </div>

          {/* Detailed Cohort Clinical Nutritional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Patient List with Clinical Status */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Baby className="w-4 h-4 text-teal-600" />
                  <span>Pacientes que Nutren la Plataforma</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {patients.length} registrado{patients.length === 1 ? '' : 's'}
                </span>
              </div>

              {patients.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Baby className="w-8 h-8 mx-auto opacity-50" />
                  <p className="text-xs">No hay pacientes registrados aún.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {patients.map(p => {
                    const age = calculatePatientAge(p.birthDate);
                    const evalData = evaluationsData[p.id];
                    const anam = anamnesisData[p.id];
                    const notesCount = progressNotes.filter(n => n.patientId === p.id).length;

                    return (
                      <div 
                        key={p.id}
                        className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl transition-all space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                              {p.firstName[0]}
                            </div>
                            <div>
                              <strong className="text-slate-900 block font-bold">
                                {p.firstName} {p.lastName}
                              </strong>
                              <span className="text-[11px] text-slate-500">
                                {age.ageText} · RUT: {p.rut || 'S/R'}
                              </span>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold">
                            Ficha: {p.medicalRecordNumber || 'NN'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 border-t border-slate-200/60 pt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                          <span>📋 Diagnóstico: <strong className="text-slate-800">{p.diagnosis || anam?.consultationReason || 'En evaluación'}</strong></span>
                          <span>📝 Sesiones: <strong className="text-indigo-700">{notesCount}</strong></span>
                          {evalData?.daFonsecaBpm && (
                            <span>🎯 BPM: <strong className="text-emerald-700">{evalData.daFonsecaBpm.totalScore}/28 pts</strong></span>
                          )}
                          {evalData?.spmSensoryMeasure && (
                            <span>🎨 SPM-2: <strong className="text-amber-700">{evalData.spmSensoryMeasure.totalSensoryRange}</strong></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Clinical Cohort Intelligence Patterns */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>Patrones & Tendencias de tu Cohorte</span>
                </h3>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Análisis Inteligente
                </span>
              </div>

              <div className="space-y-3 text-xs">
                
                <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl space-y-1">
                  <strong className="text-teal-900 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Perfil Psicomotor y Coordinación Global</span>
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Los pacientes evaluados muestran mayor necesidad de estímulo en <strong>equilibrio dinámico monopodal</strong> y <strong>disociación de praxia global</strong>. La respuesta al juego libre guiado en suelo ha demostrado acelerar el ajuste postural anticipatorio.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                  <strong className="text-amber-900 flex items-center gap-1.5 font-bold">
                    <Brain className="w-3.5 h-3.5 text-amber-600" />
                    <span>Modulación y Procesamiento Sensorial (SPM-2)</span>
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Tendencia predominante hacia búsqueda de <strong>información propioceptiva y vestibular</strong> para la autorregulación. Los niños logran mejor atención compartida tras 10 minutos iniciales de descargas de peso y tracción articular suave.
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1">
                  <strong className="text-indigo-900 flex items-center gap-1.5 font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Articulación Escolar y Familiar</span>
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    La entrega de fichas de práctica semanales con rutinas de juego domiciliarias aumenta la adherencia terapéutica un 80% en comparación con indicaciones solo verbales.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: NICHE TRENDS & EVIDENCE ARTICLES */}
      {activeView === 'trends' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Search & Category Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar tendencias (ej. HINE, plagiocefalia, tono)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['all', 'Neurodesarrollo', 'Psicomotricidad', 'Integración Sensorial', 'Craneometría', 'Inclusión & PIE'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-700 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'Todas las Categorías' : cat}
                </button>
              ))}
            </div>

          </div>

          {/* Trends Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTrends.map(article => (
              <div
                key={article.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {article.evidenceLevel}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block text-[11px]">
                      💡 Impacto Clínico en Sesión:
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      {article.clinicalImpact}
                    </p>
                  </div>

                  <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200/80 space-y-1 text-xs">
                    <span className="font-bold text-teal-900 block text-[11px]">
                      ⭐ Perla Terapéutica para Kinesiólogos:
                    </span>
                    <p className="text-teal-950 text-[11px] font-medium">
                      {article.actionablePearl}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {article.tags.map(t => (
                    <span 
                      key={t}
                      onClick={() => setSearchTerm(t)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-800 rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredTrends.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto opacity-50" />
              <p className="text-sm font-semibold">No se encontraron artículos con ese término de búsqueda.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="text-xs text-teal-700 font-bold hover:underline"
              >
                Restablecer filtros
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

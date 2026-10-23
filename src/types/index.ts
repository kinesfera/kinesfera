/**
 * Types according to NeuroNexo Adventures domain and firebase-blueprint.json specification
 */

export type UserRole = 
  | 'Padre/Niño' 
  | 'Profesionales Clínicos' 
  | 'Educadores' 
  | 'Administrador (Neuronexin)';

export type SubscriptionPlan = 'Gratis' | 'Premium';

export type GenderType = 'Mujer' | 'Hombre' | 'Prefiero no decirlo';

export type ExerciseDifficulty = 'facil' | 'intermedio' | 'avanzado';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface ConsultationAddress {
  region: string;
  commune: string;
  street: string;
  number: string;
}

export interface ContactInfo {
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface AvatarConfig {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  accessory?: string;
  name?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  rut: string; // Chilean RUT, e.g. 19.842.105-3
  birthDate?: string;
  gender: GenderType;
  biologicalSex?: 'male' | 'female' | 'other' | 'unknown';
  genderIdentity?: string;
  nationality?: string;
  maritalStatus?: string;
  emergencyContact?: EmergencyContact;
  plan: SubscriptionPlan;
  credits: number;
  assignedExercise?: 'squats' | 'kneeTouch' | 'armsUp';
  assignedAt?: string;
  students?: string[]; // student UIDs
  patients?: string[]; // patient UIDs
  professionals?: string[]; // professional UIDs
  educators?: string[]; // educator UIDs
  consultationAddress?: ConsultationAddress;
  institution?: string;
  specialty?: string; // e.g. Kinesióloga Pediátrica, Terapeuta Ocupacional, Educadora Diferencial PIE
  contactInfo?: ContactInfo;
  avatarConfig?: AvatarConfig;
  diagnosis?: string; // e.g., "TEA Grado 1 + Hipotonía axial", "TDAH combinado", "Síndrome de Down"
  medicalRecordNumber?: string;
  // Gestión de pagos por paciente (Regla Permanente 2)
  paymentStatus?: 'Pagado' | 'Pendiente';
  paymentMethodDefault?: PaymentMethod;
  sessionFee?: number;
  lastPaymentDate?: string;
}

export interface AnonymizedClinicalCase {
  id: string;
  timestamp: string;
  pathologyOrReason: string;
  ageCategory: string;
  observedProgress: string;
  treatmentApproach: string;
  clinicalResults: string;
}

export interface KeypointValidation {
  type: 'angulo' | 'posicion_relativa' | 'alineacion';
  joint: string; // e.g. 'rodilla', 'hombro', 'cadera'
  points?: string[]; // e.g. ['hip', 'knee', 'ankle']
  condition?: string;
  axis?: 'vertical' | 'horizontal';
  min?: number;
  max?: number;
  tolerance?: number;
  errorMessage?: string;
  successMessage?: string;
  priority: 'baja' | 'media' | 'alta';
}

export interface ExerciseDetection {
  requiredKeypoints: string[];
  validations: KeypointValidation[];
}

export interface ExerciseGamification {
  type: 'contador' | 'tiempo';
  objective: number; // reps or seconds
  starsMin: number;
  starsMed: number;
  starsMax: number;
  visualElement: string;
  sound: string;
  maxTime?: number;
  startMessage: string;
  progressMessage: string;
  midwayMessage: string;
  finalMessage: string;
}

export interface TEAAdaptations {
  waitTime: number;
  visualFeedback: string;
  audioFeedback: string;
  slowTransitions: boolean;
  predictability: string;
  immediateRewards: boolean;
}

export interface TDAHAdaptations {
  fastVariation: boolean;
  frequentRewards: boolean;
  maxTime: number;
  surpriseElements: boolean;
  visualChanges: string;
}

export interface DownAdaptations {
  visualAids: string;
  reducedSpeed: boolean;
  extraRest: boolean;
  simpleInstructions: boolean;
  visualDemonstration: boolean;
}

export interface MotorAdaptations {
  reducedRangeOfMotion: number; // e.g. percentage or angle offset
  extraTime: number;
  posturalAids: boolean;
  reducedObjective: number;
}

export interface ExerciseAdaptations {
  TEA?: TEAAdaptations;
  TDAH?: TDAHAdaptations;
  down?: DownAdaptations;
  motor_difficulty?: MotorAdaptations;
}

export interface ClinicalIndicators {
  rangeOfMotion: {
    normal: number[];
    attention: number[];
    alert: number[];
  };
  compensationPatterns: string[];
  therapeuticObjectives: string[];
}

export interface Exercise {
  id: string;
  name: string;
  friendlyName: string;
  description: string;
  category: 'fuerza_piernas' | 'coordinacion_bilateral' | 'equilibrio_tronco' | 'patrones_alcance';
  difficulty: ExerciseDifficulty;
  ageRange: { min: number; max: number };
  detection: ExerciseDetection;
  gamification: ExerciseGamification;
  adaptations: ExerciseAdaptations;
  clinicalIndicators: ClinicalIndicators;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  thumbnailIcon: string;
}

export interface ClinicalReportContent {
  summary: string;
  progressObserved: string;
  achievements: string;
  areasToFocus: string;
  nextSteps: string;
  romAverage?: number;
  adherencePercentage?: number;
  compensationCount?: number;
}

export interface Report {
  id: string;
  patientId: string;
  patientName: string;
  patientRut: string;
  professionalId: string;
  professionalName: string;
  professionalSpecialty?: string;
  creatorRole: 'Profesionales Clínicos' | 'Educadores';
  generatedAt: string;
  content: ClinicalReportContent;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  patientId: string;
  patientName: string;
  participants: string[]; // user IDs
  lastMessage?: {
    text: string;
    timestamp: string;
  };
  unreadCount?: number;
}

export interface SessionResult {
  exerciseId: string;
  repsCompleted: number;
  targetReps: number;
  accuracy: number;
  starsEarned: number;
  averageAngle: number;
  durationSeconds: number;
  compensationsAvoided: number;
  neurodiversityMode: 'standard' | 'TEA' | 'TDAH' | 'down' | 'motor';
  timestamp: string;
}

export type PaymentMethod = 
  | 'Efectivo' 
  | 'Transferencia' 
  | 'Tarjeta'
  | 'Otro' 
  | 'Fonasa' 
  | 'Isapre' 
  | 'Particular'
  | 'Pendiente'
  | 'Bono Web';

export interface ProgressNote {
  id: string;
  patientId: string;
  date: string; // e.g. "07/28/2026" or YYYY-MM-DD
  paymentMethod: PaymentMethod;
  paymentStatus?: 'Pagado' | 'Pendiente' | 'En convenio';
  amount?: number;
  paymentDate?: string;
  sessionNumber?: number;
  notes: string;
  professionalName?: string;
  createdAt?: string;
}

export type LeadStatus = 
  | 'Nuevo Prospecto' 
  | 'Contactado' 
  | 'En Demostración' 
  | 'Venta Cerrada (Premium)' 
  | 'Seguimiento';

export interface LeadProspect {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  roleType: 'Padre/Niño' | 'Profesionales Clínicos' | 'Educadores' | 'Institución';
  institution?: string;
  region?: string;
  commune?: string;
  interestDetails?: string;
  estimatedPatients?: string;
  status: LeadStatus;
  commercialNotes?: string;
  registeredAt: string;
  consentContact: boolean;
}

export type AnamnesisAgeCategory = 'mayor_2_anos' | 'bebe_hasta_18_meses';

export interface CranialMeasurements {
  d1Mm?: number; // Diagonal 1
  d2Mm?: number; // Diagonal 2
  differenceMm?: number; // |d1 - d2|
  cvaiPercent?: number; // Cranial Vault Asymmetry Index (%)
  plagiocephalySeverity?: 'Normal (< 3 mm)' | 'Leve (3-10 mm)' | 'Moderada (10-12 mm)' | 'Severa (> 12 mm)';
  apMm?: number; // Diámetro anteroposterior (mm)
  bpMm?: number; // Diámetro biparietal (mm) (PP)
  cephalicIndex?: number; // (BP / AP) * 100 (%)
  brachycephalyClassification?: 'Dolicocefalia (< 75%)' | 'Mesocefalia / Normal (75-85%)' | 'Braquicefalia (> 85%)' | 'Braquicefalia Severa (> 90%)';
  headCircumferenceCm?: number;
  treatmentIndication?: string;
  
  // Follow-up evaluations for comparative tables & charts
  intermediateD1Mm?: number;
  intermediateD2Mm?: number;
  intermediateDifferenceMm?: number;
  intermediateCvaiPercent?: number;
  finalD1Mm?: number;
  finalD2Mm?: number;
  finalDifferenceMm?: number;
  finalCvaiPercent?: number;
  cervicalRomRightDegInitial?: number;
  cervicalRomLeftDegInitial?: number;
  cervicalRomRightDegFinal?: number;
  cervicalRomLeftDegFinal?: number;
}

export interface EarlyInfantObservation {
  adultInteractionProps?: string; // Voz, Mirada, Caricias, Estimulación propioceptiva, Sostén
  childInitiative?: string; // Mantiene la mirada, Sonrisas, Vocalizaciones, Búsqueda de contacto
  rhythmAdjustment?: string; // Ajuste a ritmos de interacción
  childResponse?: string; // Movimientos lentos/relajados vs bruscos, Llanto, Sonrisas, Apatía, Ansiedad
  objectRelation?: string; // Patrones evolutivos, Interés sonoro/visual/táctil, Atención compartida
  posturalAndTonicDevelopment?: string; // Tono / diálogo tónico, Patrones evolutivos, Placer, Miedos
  communication?: string; // Funcionalidad, Vocalizaciones, Comprensión temprana
}

// ============================================================================
// LISTA DE CONTROL DE HABILIDADES DE COMUNICACIÓN CRÍTICAS Y FUNCIONALES (CAA)
// Para niños que no reciben instrucciones estructuradas / en desarrollo de comunicación
// ============================================================================
export interface CriticalCommunicationSkills {
  date?: string;
  evaluatorName?: string;
  
  // 1. Pedir reforzadores
  reinforcersAppropriate?: 'si' | 'no' | 'en_proceso';
  reinforcersFood?: string; // Comestibles / Comida
  reinforcersToys?: string; // Juguetes
  reinforcersActivities?: string; // Actividades

  // 2 al 7: Habilidades básicas
  askHelpAppropriate?: 'si' | 'no' | 'en_proceso';
  askHelpExample?: string; // Ej. Hace sonidos / Dice ayuda
  
  askBreaksAppropriate?: 'si' | 'no' | 'en_proceso';
  askBreaksExample?: string; // Ej. Se golpea con las manos / Dice cama o dormir
  
  rejectAppropriate?: 'si' | 'no' | 'en_proceso';
  rejectExample?: string; // Ej. Hace sonidos / Dice no
  
  affirmAcceptAppropriate?: 'si' | 'no' | 'en_proceso';
  affirmAcceptExample?: string; // Ej. Hace sonidos / Dice sí
  
  respondWaitAppropriate?: 'si' | 'no' | 'en_proceso';
  respondWaitExample?: string; // Ej. Antes era más inquieto
  
  transitionActivitiesAppropriate?: 'si' | 'no' | 'en_proceso';
  transitionActivitiesExample?: string; // Ej. Se pone a llorar / No tiene problema

  // 8. Responder a instrucciones: Direcciones Visuales (gestos/señales)
  visualOrientToName?: string; // Se orienta hacia el nombre señalado
  visualComeHere?: string; // "Ven aquí"
  visualStop?: string; // "Para"
  visualSitDown?: string; // "Siéntate"
  visualGiveItToMe?: string; // "Dámelo"
  visualGoForKnownObject?: string; // "Ve a por..." (objeto que conoce)
  visualGoToKnownPlace?: string; // "Ve a..." (lugar que conoce)
  visualLeaveOnPlace?: string; // "Déjalo en su sitio / suelo"
  visualComeWithMe?: string; // "Vamos / Ven conmigo"

  // 8. Responder a instrucciones: Direcciones Verbales (sin apoyo visual)
  verbalOrientToName?: string; // Se orienta hacia el nombre señalado
  verbalComeHere?: string; // "Ven aquí" (ej. hay que llamarlo 3-5 veces)
  verbalStop?: string; // "Para"
  verbalSitDown?: string; // "Siéntate" (ej. hay que decirle unas 3-5 veces)
  verbalGiveItToMe?: string; // "Dámelo"
  verbalGoForKnownObject?: string; // "Ve a por..."
  verbalGoToKnownPlace?: string; // "Ve a..." (ej. no sigue más de 2 indicaciones)
  verbalLeaveOnPlace?: string; // "Déjalo en su sitio / suelo" (ej. le cuesta)
  verbalComeWithMe?: string; // "Vamos / Ven conmigo" (ej. le cuesta)

  // 9. Horario visual
  followsVisualSchedule?: 'si' | 'no' | 'en_proceso';
  visualScheduleNotes?: string;

  generalObservations?: string;
}

// ============================================================================
// EXAMEN NEUROLÓGICO INFANTIL DE HAMMERSMITH (HINE - VERSIÓN OFICIAL 78 PUNTOS)
// ============================================================================
export interface HammersmithHINE {
  // SECCIÓN 1: EXAMEN NEUROLÓGICO (Puntuación de Optimalidad máx. 78 pts)
  
  // 1. Pares Craneales (máx. 15 pts)
  facialAnimation?: number; // Apariencia facial (0: Indiferente / 1: Cierra ojos pero pobre / 2: Intermedio / 3: Sonríe o reacciona)
  eyeMovements?: number; // Movimientos oculares (0: Continuo desvío / 1: Intermitente / 2: Intermedio / 3: Conjugado normal)
  visualFollow?: number; // Respuesta visual (0: No sigue / 1: Incompleto o asimétrico / 2: Intermedio / 3: Arco completo)
  auditoryResponse?: number; // Respuesta auditiva (0: Sin respuesta / 1: Dudosa / asimétrica / 2: Intermedio / 3: Reacciona ambos lados)
  suckSwallow?: number; // Chupa/tragado (0: Sin reflejo / 1: Mal chupete/tragar / 2: Intermedio / 3: Buen chupete y deglución)
  cranialNervesSubtotal?: number; // máx 15

  // 2. Postura (máx. 18 pts)
  headPosture?: number; // Cabeza en sentado (0: Notablemente hacia un lado/atrás/adelante / 1: Ligera desviación / 2: Intermedio / 3: Recta en línea media)
  trunkPosture?: number; // Tronco en sentado (0: Muy redondeado/bamboleante / 1: Ligeramente curvado / 2: Intermedio / 3: Recto)
  armPosture?: number; // Brazos en reposo (0: Marcada rot. interna/externa o distónica / 1: Ligera rotación / 2: Intermedio / 3: Neutro recto/semiflexionado)
  handsPosture?: number; // Manos (0: Persistente pulgar aducido / empuñado / 1: Intermitente / 2: Intermedio / 3: Manos abiertas)
  legPosture?: number; // Piernas sentado (0: Incapaz de sentarse erguido / 1: Espalda recta con rodillas flex 15-20° / 2: Intermedio / 3: Espalda recta piernas rectas/semiflexionadas)
  legsSupineProne?: number; // Piernas en decúbito supino / pie (0: Marcada rotación / contracturas / 1: Ligera rotación interna/externa / 2: Intermedio / 3: Posición neutra)
  feetPosture?: number; // Pies en supino / bipedestación (0: Marcada rotación o persistente puntillas / 1: Leve o intermitente / 2: Intermedio / 3: Central en neutro, dedos rectos)
  postureSubtotal?: number; // máx 18

  // 3. Movimientos (máx. 6 pts)
  movementsQuantity?: number; // Cantidad de movimiento en supino (0: Mínimo o ninguno / 1: Excesivo o lento / 2: Intermedio / 3: Normal)
  movementsQuality?: number; // Calidad del movimiento espontáneo (0: Aprisionado/sincrónico/espasmos/atáxico / 1: Temblores leves / 2: Intermedio / 3: Libre, alternándose, liso)
  movementsSubtotal?: number; // máx 6

  // 4. Tono Muscular (máx. 24 pts)
  scarfSign?: number; // Signo del chal / bufanda (0: Codo no supera línea media o pasa sin resistencia / 1: Resistencia difícil / 2: Intermedio / 3: Rango normal 150-100°)
  passiveShoulderElevation?: number; // Movimiento de hombro pasivo (elevación hacia cabeza) (0: Resistencia no superable / 1: Sin resistencia / 2: Difícil / 3: Resistencia superable normal)
  pronationSupination?: number; // Pronación/supinación antebrazo (0: No posible, marcada resistencia / 1: Resistencia superable / 2: Intermedio / 3: Pronación y supinación sin resistencia)
  adductorsAngle?: number; // Aductores de la cadera (0: <80° o >170° / 1: 150-160° / 2: Intermedio / 3: Rango normal 150-80°)
  poplitealAngle?: number; // Ángulo poplíteo (0: <80° o >170° / 1: 150-160° / 2: Intermedio / 3: Rango normal 150-100°)
  ankleDorsiflexionAngle?: number; // Dorsiflexión de tobillo (0: >90° o <20° / 1: 20-30° / 2: Intermedio / 3: Rango 30-85°)
  pullToSit?: number; // Tracción al sedente / súbase para sentarse (0: Cabeza cae atrás o hiperflexión / 1: Retraso / 2: Intermedio / 3: Alineada y activa)
  ventralSuspension?: number; // Suspensión ventral (0: U invertida o hiperextensión rígida / 1: Caída moderada / 2: Intermedio / 3: Cabeza y tronco horizontales)
  toneSubtotal?: number; // máx 24

  // 5. Reflejos y Reacciones (máx. 15 pts)
  armProtectionReaction?: number; // Protección del brazo (0: Completamente flexionado / 1: Semi-flexionado / 2: Intermedio / 3: Brazo y mano extienden simétricos)
  verticalSuspension?: number; // Suspensión vertical (pataleo) (0: No patea o cruza en tijera / 1: Patea más una pierna / 2: Intermedio / 3: Patea simétricamente)
  lateralTilting?: number; // Inclinación lateral (0: Cae sin enderezar / 1: Respuesta pobre / 2: Intermedio / 3: Curvatura compensatoria de tronco y cabeza)
  forwardParachute?: number; // Paracaídas hacia adelante (después de 6m) (0: No extiende brazos / 1: Extensión incompleta / 2: Intermedio / 3: Extensión simétrica y apertura)
  tendonReflexes?: number; // Reflejos osteotendinosos (bíceps, rodilla, tobillo) (0: Clonus o ausente / 1: Vigoroso / 2: Levemente acelerado / 3: Fácil de evocar normal)
  reflexesSubtotal?: number; // máx 15

  // RESUMEN GLOBAL HINE
  totalScore?: number; // 0 a 78
  asymmetryCount?: number; // Número de asimetrías detectadas (D vs I)
  riskLevel?: 'Óptimo (Bajo Riesgo)' | 'Riesgo Leve (Seguimiento)' | 'Riesgo Moderado-Alto (Intervención Precoz)';

  // SECCIÓN 2: HITOS MOTORES (No puntuado; registro de desarrollo)
  motorMilestones?: {
    headControl?: string; // Incapaz (hasta 3m), Temblores (hasta 4m), Mantenido derecha todo el tiempo (desde 5m)
    headControlAge?: string;
    sitting?: string; // No puede, Con soporte caderas (4m), Props (6m), Sentarse estable (7-8m), Pivota rotaciones (9m)
    sittingAge?: string;
    voluntaryGrasp?: string; // Sin agarre, Toda la mano, Dedillo y pulgar inmaduro, Agarre de pinza
    voluntaryGraspAge?: string;
    supineKicking?: string; // No patea, Patea horizontalmente, Hacia arriba vertical (3m), Toca la pierna (4-5m), Toca dedos de los pies (5-6m)
    supineKickingAge?: string;
    rolling?: string; // Sin rodar, Rodando hacia un lado (4m), De prono a supino (6m), Supino a prono (6m)
    rollingAge?: string;
    crawling?: string; // No levanta cabeza, Sobre codos (3m), Brazos extendidos manos (4m), Boca abajo abdomen (8m), Sobre manos y rodillas (10m)
    crawlingAge?: string;
    standing?: string; // No soporte peso, Sostiene el peso (4m), Se mantiene con soporte (7m), De pie sin ayuda (12m)
    standingAge?: string;
    walking?: string; // Rebotando (6m), Desplazamiento agarrándose (12m), Caminando independientemente (15m)
    walkingAge?: string;
  };

  // SECCIÓN 3: COMPORTAMIENTO (No puntuado; escala de 1 a 6)
  behavior?: {
    consciousState?: number; // 1: Inarrojable/insomne, 2: Somnoliento, 3: Duerme pero despierta fácil, 4: Despierto sin interés, 5: Pierde interés, 6: Mantiene interés
    consciousStateComments?: string;
    emotionalState?: number; // 1: Irritable inconsolable, 2: Irritable consolable, 3: Irritable cuando acercado, 4: Ni feliz ni infeliz, 5-6: Feliz y sonriendo
    emotionalStateComments?: string;
    socialOrientation?: number; // 1: Evitando/retirado, 2: Dudoso, 3: Acepta acercamiento, 4-6: Amistoso y cooperador
    socialOrientationComments?: string;
  };

  clinicalObservations?: string;
}

export interface PsychomotorObservationKinesfera {
  // Pauta de Parámetros Psicomotores de Pilar Arnaiz
  // 1. Motricidad y Movimiento
  movementsFrequent?: string; // Balanceos, Giros, Caídas, Volteretas, Caminar, Correr, Saltar, Rodar, Subir/Trepar
  movementsQuality?: string; // Coordinados, Armónicos, Abiertos, Cerrados, Rápidos, Lentos, Circulares, Rectilíneos, Torpes, Rígidos
  bodyMobilityLevel?: string; // Todo el cuerpo, Articulaciones, Tronco, Cabeza, Brazos, Piernas, Manos y dedos
  posturesFrequent?: string; // Abierta, De pie, Acostado, Cuclillas, Sentado, De rodillas, A pata coja, En equilibrio
  toneQuality?: string; // Relajado, Elástico, Hipertónico, Hipotónico, Fluctuante, Paratonía

  // 2. El Espacio
  spaceOccupancy?: string; // Con el cuerpo, voz, mirada, objetos, construye, delimita, invade, se aísla
  spaceTrajectory?: string; // Directas, circulares, periféricas, evitación del centro
  spaceLevels?: string; // Nivel bajo (suelo), Nivel medio (sedente/cuadrupedia), Nivel alto (bipedestación/trepas)

  // 3. El Tiempo
  rhythmQuality?: string; // Regular y armónico, Acelerado e impulsivo, Lento e inhibido, Arrítmico
  activityDuration?: string; // Sostenida y profunda, Fugaz y dispersa, Rigidez / dificultad de cambio

  // 4. Los Objetos
  objectUsage?: string; // Funcional/común, Creativo/simbólico, Hábil, Impulsivo, Agresivo, Obsesivo, Difícil abandono, Estereotipado
  objectsRelationWithOthers?: string; // Comparte, Quita, Rechaza lo ofrecido, Agrede con objetos, Intercambia

  // 5. Relación con los Demás
  companionsRelation?: string; // Juega solo/aislado, En paralelo, En parejas, En pequeños grupos, Con todos, Lidera, Se somete
  adultRelation?: string; // Lo acepta, Lo busca, Lo provoca, Le agradece, Espera aprobación, Espera órdenes, Colabora, Lo ignora, Rechaza

  globalSynthesis?: string; // Conclusiones de la observación clínica libre
}

export interface SensoryProcessingMeasureSPM2 {
  // Configuración del Cuestionario
  targetAgeGroup?: 'bebes_4_9' | '10_a_30_meses' | '2_a_5_anos' | 'mayor_5_anos'; // 4-9m (Bebés), 10-30m (Niños Pequeños), 2-5a (Preescolar), >5a (Escolar)
  questionnaireType?: 'hogar' | 'escuela'; // Cuestionario para Padres (Hogar) vs Cuestionario Escolar (Aula)

  // Puntajes estándar T o brutos por dimensión
  socialParticipationScore?: number;
  socialParticipationRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  visionScore?: number;
  visionRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  hearingScore?: number;
  hearingRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  touchScore?: number;
  touchRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  tasteSmellScore?: number;
  tasteSmellRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  bodyAwarenessScore?: number;
  bodyAwarenessRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  balanceMotionScore?: number;
  balanceMotionRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  planningIdeasScore?: number;
  planningIdeasRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  totalSensoryScore?: number;
  totalSensoryRange?: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)';
  difHomeSchoolScore?: number;
  difInterpretation?: 'Sin Diferencia' | 'Diferencia Probable' | 'Diferencia Definida';
  
  // Registro Ítem por Ítem (75 preguntas exactas: clave del ítem -> 1 a 4)
  itemAnswers?: Record<number, number>; // número de pregunta (1-75) -> valor (1: N, 2: O, 3: F, 4: S)
  totalAnsweredCount?: number;

  // Modalidad de aplicación
  applicationMethod?: 'presencial' | 'enlace_padres' | 'enlace_escuela';
  questionnaireFilledDate?: string;
  respondentName?: string;
  respondentRelationship?: string;
}

export interface DaFonsecaBPM {
  // 1. Tonicidad (1-4)
  tonicityExtensibility?: number;
  tonicityPassivity?: number;
  tonicityParatonia?: number;
  tonicityDiadochokinesia?: number;
  tonicitySynkinesia?: number;
  tonicityScore?: number; // 1-4

  // 2. Equilibrio (1-4)
  equilibriumImmobility?: number;
  equilibriumStatic?: number;
  equilibriumDynamic?: number;
  equilibriumScore?: number; // 1-4

  // 3. Lateralidad (1-4)
  lateralityOcular?: number;
  lateralityAuditory?: number;
  lateralityManual?: number;
  lateralityPodal?: number;
  lateralityProfile?: 'Diestro Completo' | 'Zurdo Completo' | 'Cruzado' | 'Ambidiestro / Indefinido';
  lateralityScore?: number; // 1-4

  // 4. Noción del Cuerpo (1-4)
  bodyNotionKinesthetic?: number;
  bodyNotionRightLeft?: number;
  bodyNotionAutoimage?: number;
  bodyNotionGesturesImitation?: number;
  bodyNotionScore?: number; // 1-4

  // 5. Estructuración Espacio-Temporal (1-4)
  spatialOrientation?: number;
  spatialOrganization?: number;
  spatialRhythmStructure?: number;
  spatialTemporalScore?: number; // 1-4

  // 6. Praxia Global (1-4)
  globalPraxiaOculomanual?: number;
  globalPraxiaOculopodal?: number;
  globalPraxiaDysmetria?: number;
  globalPraxiaDissociation?: number;
  globalPraxiaScore?: number; // 1-4

  // 7. Praxia Fina (1-4)
  finePraxiaDynamicCoordination?: number;
  finePraxiaDigitalDrumming?: number;
  finePraxiaGraphomotorSpeed?: number;
  finePraxiaScore?: number; // 1-4

  totalScore?: number; // 7-28
  profileResult?: string;
  conclusions?: string;
  generalObservation?: string;
  
  // Specific factor observations and interpretations for family report
  tonicityObservations?: string;
  tonicityInterpretation?: string;
  equilibriumObservations?: string;
  equilibriumInterpretation?: string;
  lateralityObservations?: string;
  lateralityInterpretation?: string;
  bodyNotionObservations?: string;
  bodyNotionInterpretation?: string;
  spatialTemporalObservations?: string;
  spatialTemporalInterpretation?: string;
  globalPraxiaObservations?: string;
  globalPraxiaInterpretation?: string;
  finePraxiaObservations?: string;
  finePraxiaInterpretation?: string;
}

export interface PatientAnamnesis {
  id: string;
  patientId: string;
  evaluatorName: string;
  evaluationDate: string;
  ageCategory?: AnamnesisAgeCategory; // 'mayor_2_anos' | 'bebe_hasta_18_meses'
  
  // General & Family
  caregiverName: string;
  caregiverPhone: string;
  schoolOrCenter: string;
  educationalLevel: string;
  pieSupport: boolean;
  householdMembers?: string; // Quiénes viven en el hogar, edad y profesión
  
  // Reason for consultation & evolution
  consultationReason: string;
  problemNoticedWhen?: string;
  specialistsVisited?: string; // Pediatra, neurólogo, etc.
  previousTreatments?: string; // Tratamientos previos (ej. Teletón, kinesiología)
  familyExpectations: string;
  
  // Perinatal, Pregnancy & Birth
  pregnancyHistory?: string; // Pérdidas previas, reposo absoluto, síntomas de pérdida
  gestationalAgeWeeks: string;
  birthWeightGrams: string;
  birthLengthCm?: string;
  birthType: string;
  birthPresentation?: string; // De cabeza, en pelvis
  apgarScore: string;
  neonatalComplications: string;
  feedingType?: string; // Lactancia materna, fórmula, mixta
  colic?: string;
  sleepPattern?: string; // Despertares, horas de noche, siestas
  
  // Psychomotor milestones
  headControlMonths: string;
  independentSittingMonths: string;
  crawlingMonths: string;
  standingMonths: string;
  walkingMonths?: string;
  firstWords?: string;
  firstWordsMonths?: string;
  firstPhrases?: string;
  languageDifficulties?: string;
  currentMotorStatus: string;
  
  // Emotional & behavioral patterns (especialmente > 2 años)
  followsInstructions?: string;
  isRestless?: string;
  playsAloneOrAccompanied?: string;
  bedtimeRoutine?: string;
  nightmares?: string;
  hasFears?: string;
  strangerReaction?: string;
  tantrums?: string;
  appearsSad?: string;
  
  // Interpersonal relationships
  familyRelationships?: string;
  schoolRelationships?: string;
  leisureActivities?: string;
  
  // Family antecedents (TEA, TDAH, Asperger en familiares)
  familyDiagnoses?: string;
  
  // Medical history & Medications
  medicalDiagnoses: string;
  surgeries: string;
  pharmacology: string; // Melatonina, Risperidona, magnesio, melena de león, omega 3
  assistiveDevices: string;
  allergicConditions: string;
  
  // Infant cranial measurements (bebes hasta 18 meses)
  cranialMeasurements?: CranialMeasurements;
  earlyInfantObservation?: EarlyInfantObservation;
}

export interface ClinicalEvaluations {
  id: string;
  patientId: string;
  evaluationDate: string;
  evaluatorName: string;
  
  // Functional Scales
  gmfcsLevel: 'Nivel I' | 'Nivel II' | 'Nivel III' | 'Nivel IV' | 'Nivel V' | 'No aplica';
  macsLevel: 'Nivel I' | 'Nivel II' | 'Nivel III' | 'Nivel IV' | 'Nivel V' | 'No aplica';
  eedpOrTepsiScore: string;
  
  // Muscle tone (Ashworth)
  ashworthScore: '0' | '1' | '1+' | '2' | '3' | '4';
  tonePattern: string;
  deepTendonReflexes: string;
  
  // Range of Motion (ROM)
  hipFlexionExt: string;
  kneeFlexionExt: string;
  ankleDorsiflexion: string;
  shoulderMobility: string;
  
  // Postural control & balance
  headAndTrunkControl: string;
  rightingReactions: string;
  protectiveResponses: string;
  balanceSittingAndStanding: string;
  transferAbility: string;
  gaitObservation: string;
  
  // Sensory processing
  sensoryProfile: string;
  
  // Decision Tree Flags
  patientAgeCategory?: 'menor_2_anos' | 'mayor_2_anos';
  followsCommands?: boolean; // ¿El niño recibe / sigue órdenes?
  
  // Real clinical evaluation protocols:
  hineExam?: HammersmithHINE; // Para < 2 años
  psychomotorObservation?: PsychomotorObservationKinesfera; // Para >= 2 años si NO recibe órdenes (Pilar Arnaiz)
  criticalCommunication?: CriticalCommunicationSkills; // Para >= 2 años si NO recibe órdenes (Habilidades de Comunicación Críticas)
  daFonsecaBpm?: DaFonsecaBPM; // Para >= 2 años si SÍ recibe órdenes
  spmSensoryMeasure?: SensoryProcessingMeasureSPM2; // Perfil sensorial (presencial o link padres/escuela)
  
  // Clinical conclusions
  cifCodes?: string[]; // Códigos específicos CIF OMS (ej. b730, b760, d450, d410, e115, etc.)
  functionalDiagnosisCIF: string;
  therapeuticGoalsShortTerm: string;
  therapeuticGoalsLongTerm: string;
  treatmentPlan: string;
  homeAndSchoolRecommendations?: string;
  homeRecommendations?: string; // Recomendaciones específicas para el hogar
  schoolRecommendations?: string; // Recomendaciones específicas para jardín/escuela si > 3 años
  
  // Family-friendly structured report fields (Kinesfera format)
  interventionGoals?: string[]; // Objetivos de intervención terapéutica
  sensoryProfileAnalysis?: string; // Análisis amigable del perfil sensorial para la familia
  initialConclusions?: string; // Conclusiones iniciales estructuradas
  functionalManifestations?: string[]; // Manifestaciones funcionales en aula y hogar (1 a 6)
  prognosis?: string; // Pronóstico y justificación terapéutica
  interventionNeeds?: string[]; // Áreas prioritarias de intervención kinésica
}

export interface ComprehensiveReport {
  id: string;
  patientId: string;
  patientName: string;
  patientRut: string;
  patientBirthDate: string;
  medicalRecordNumber: string;
  professionalName: string;
  professionalSpecialty: string;
  professionalRegistry: string;
  institution: string;
  dateGenerated: string;
  anamnesis: PatientAnamnesis;
  evaluations: ClinicalEvaluations;
  clinicalSummary: string;
  planAndFollowUp: string;
  
  // Optional family report overrides
  interventionGoals?: string[];
  sensoryProfileAnalysis?: string;
  initialConclusions?: string;
  functionalManifestations?: string[];
  prognosis?: string;
}

export interface WeeklyHomePracticePackage {
  id: string;
  patientId: string;
  weekNumber: number;
  weekLabel: string; // ej. "Semana 1", "Semana 2", etc.
  startDate: string;
  endDate: string;
  generatedDate: string;
  caregiverName: string;
  caregiverPhone: string;
  childName: string;
  childAgeText: string;
  isOlderThanThree: boolean;
  diagnosis: string;
  primaryWeeklyGoal: string;
  latestSessionProgressHighlight: string;
  activities: {
    id: string;
    dayLabel?: string; // "Lunes a Miércoles", "Diario", etc.
    title: string;
    description: string;
    durationMinutes: number;
    recommendedFrequency: string; // "2 veces al día", "1 vez al día", etc.
    sensoryOrMotorFocus: string;
    homeMaterialsNeeded: string; // "Cojines del sillón", "Pelota", etc.
  }[];
  schoolRecommendations?: string; // Solo si > 3 años
  homeEnvironmentTips: string[];
  kinesiologistNotes: string;
  whatsappFormattedMessage: string;
}

// ============================================================================
// MARKETING, CRM Y CRECIMIENTO DEL NEGOCIO (KINESFERA / NEUROXION)
// ============================================================================

export type ReferralStatus = 
  | 'Vigente / Alianza Activa' 
  | 'Solo recibe secretaria' 
  | 'Contacto Establecido' 
  | 'Prospecto Frío' 
  | 'No hay nadie / Reprogramar';

export interface MarketingReferralContact {
  id: string;
  name: string;
  specialty: string; // Pediatra, Neuróloga, Fonoaudiólogo, Psicóloga, etc.
  institutionOrAddress: string;
  zone: string;
  status: ReferralStatus;
  lastInteractionDate?: string;
  nextStep: string; // "Llevar más flyers", "Visita de presentación", "Envío de info clínica", etc.
  notes?: string;
  patientsReferredCount?: number;
}

export type DigitalChannel = 
  | 'WhatsApp' 
  | 'Instagram' 
  | 'Recomendación / Boca a Boca' 
  | 'Convenio Escolar' 
  | 'Sitio Web / Google' 
  | 'Flayer';

export type InquiryProcessStatus = 
  | 'Primer Contacto' 
  | 'Evaluación Agendada' 
  | 'En Espera / Seguimiento' 
  | 'En Tratamiento Activo' 
  | 'Pack de Sesiones Pagado'
  | 'Alta Terapéutica' 
  | 'No Interesado / Inactivo';

export interface DigitalInquiryCRM {
  id: string;
  contactDate: string;
  caregiverName: string;
  patientName: string;
  phone: string;
  channel: DigitalChannel;
  reason: string; // Estimulación Temprana, Plagiocefalia, Tortícolis, Respiratorio, etc.
  status: InquiryProcessStatus;
  scheduledDate?: string;
  sessionOrPackValue?: number;
  referredBy?: string; // Dr. Rojas, Dra. Edith, etc.
  notes?: string;
}

export type BusinessTaskArea = 
  | 'Gestión / Admin' 
  | 'Marketing Digital' 
  | 'Clínica / Atención' 
  | 'Proyectos / Redes' 
  | 'Finanzas';

export type BusinessTaskPriority = 'Alta' | 'Media' | 'Baja';
export type BusinessTaskStatus = 'Pendiente' | 'En Proceso' | 'Completada' | 'Cancelada';

export interface MarketingBusinessTask {
  id: string; // TK-001, etc.
  description: string;
  area: BusinessTaskArea;
  responsible: string; // Aldo, Asesor, etc.
  priority: BusinessTaskPriority;
  startDate: string;
  dueDate: string;
  status: BusinessTaskStatus;
  progressPercent: number; // 0-100%
  weekPhase?: 'Semana 1' | 'Semana 2' | 'Semana 3' | 'Semana 4' | 'General';
  notes?: string;
}

export interface Month1MarketingGoals {
  activePatientsTargetMin: number; // 6
  activePatientsTargetMax: number; // 8
  exPatientsFollowUpTargetPercent: number; // 100%
  referrersTargetContacted: number; // 10
  referrersTargetResponse: number; // 5
  referrersTargetActive: number; // 2
  publishedPostsTarget: number; // 12 (3/semana: lun, mié, vie)
  digitalInquiriesTargetMin: number; // 10
  digitalInquiriesTargetMax: number; // 20
  scheduledEvaluationsTargetMin: number; // 6
  scheduledEvaluationsTargetMax: number; // 10
  groupServiceProtocolReady: boolean;
}

export interface SessionPackageOffering {
  id: string;
  name: string;
  badge?: string;
  sessionCount: number;
  totalPriceCLP: number;
  pricePerSessionCLP: number;
  discountOrBonus: string;
  idealFor: string;
  includesHomeGuide: boolean;
  includesReevaluation: boolean;
  active: boolean;
}

export type ContentFormat = 'Reel' | 'Carrusel' | 'Post foto';
export type ContentCategoryType = 'Me Content' | 'You Content' | 'Conversión' | 'Referidos Médicos' | 'CTA Directo';

export interface ContentPlanPost {
  id: string;
  monthId: string; // 'mes_1_julio' | 'mes_2_agosto' | 'mes_3_noviembre' | string
  postNumber: number; // 1-12
  weekDay: string; // 'S1 – Lunes', 'S1 – Miércoles', etc.
  format: ContentFormat;
  topic: string;
  type: ContentCategoryType;
  hookVariants: string[];
  hookScript: string;
  needScript: string;
  valuePoints: string[];
  ctaScript: string;
  caption: string;
  hashtags: string[];
  productionNotes: string[];
  carouselSlides?: { slideNumber: number; title: string; bullets: string[] }[];
  dataDrivenReason: string; // Por qué funciona según datos de pacientes y nicho externo
  status?: 'Planificado' | 'Grabado' | 'Publicado';
}

export interface MonthlyContentPlan {
  id: string;
  monthKey: string;
  monthTitle: string; // e.g. "Noviembre 2026", "Mes 1 (Julio)", "Mes 2 (Agosto)"
  phase: string;
  objective: string;
  postsCount: number;
  nicheAnalysisSummary: {
    clinicDataFindings: string;
    patientTrends: string;
    seasonalNicheContext: string;
    bestFormatsRecommended: string;
  };
  posts: ContentPlanPost[];
}

// ============================================================================
// BIBLIOTECA INSTITUCIONAL & DOCUMENTOS DE REFERENCIA
// ============================================================================
export type LibraryFileScope = 'negocio' | 'paciente';
export type LibraryFileCategory = 
  | 'comunicacion_critica' 
  | 'evaluacion_spm' 
  | 'clinico_general' 
  | 'marketing' 
  | 'protocolo' 
  | 'otro';

export interface LibraryFileDocument {
  id: string;
  name: string;
  fileName: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'image' | 'other';
  scope: LibraryFileScope;
  patientId?: string; // Si está asociado a un paciente específico
  patientName?: string;
  category: LibraryFileCategory;
  downloadUrl: string;
  storagePath?: string;
  fileSizeBytes: number;
  uploadedAt: string;
  uploadedBy?: string;
  // Resumen breve y datos clave para usar como contexto sin gastar tokens excesivos
  summary: string;
  keyPoints: string[];
  isChecklistActive?: boolean; // Marca si es la lista de control activa para CAA/Comunicación
  checklistItems?: {
    id: string;
    skillName: string;
    description: string;
    instructionsCheck?: boolean; // Indica si evalúa seguimiento de instrucciones
  }[];
}

// ============================================================================
// EVALUACIONES SPM POR RANGO DE EDAD
// ============================================================================
export type SPMAgeCategory = 
  | 'bebes_4_9' 
  | 'toddler_10_30' 
  | 'preescolar_2_5' 
  | 'escolar_5_12' 
  | 'adolescente_adulto';

export interface SPMScaleScore {
  raw: number;
  tScore: number;
  percentile?: number;
  range: 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Dificultades Severas (≥ 70)';
  interpretation: string;
}

export interface SPMEvaluationRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientBirthDate?: string;
  ageMonths: number;
  ageCategory: SPMAgeCategory;
  formTitle: string; // e.g. "SPM-2 Bebés (4-9 meses)", "SPM-2 Niños Pequeños (10-30 meses)"
  formContext: 'Hogar / Padres' | 'Escuela / Aula' | 'Autoinforme';
  evaluationDate: string;
  evaluatorName: string;
  evaluatorRole: string;
  includeInReport: boolean;
  notes?: string;
  responses: Record<number, number>; // ítem 1..80, valor 1..4 (Nunca..Siempre)
  scales: {
    vis?: SPMScaleScore; // Visión
    hea?: SPMScaleScore; // Audición / Oído
    tou?: SPMScaleScore; // Tacto
    ts?: SPMScaleScore;  // Gusto y Olfato
    bod?: SPMScaleScore; // Conciencia Corporal
    bal?: SPMScaleScore; // Equilibrio y Movimiento
    st?: SPMScaleScore;  // Total Sensorial
    pln?: SPMScaleScore; // Planificación e Ideas / Praxis
    soc?: SPMScaleScore; // Participación Social
  };
}

// ============================================================================
// LISTA DE CONTROL DE HABILIDADES DE COMUNICACIÓN CRÍTICAS (RESUMEN INFORME)
// ============================================================================
export interface CommunicationChecklistItemEvaluation {
  id: string;
  skillName: string;
  statusInitial: 'si' | 'en_proceso' | 'no';
  statusFinal?: 'si' | 'en_proceso' | 'no';
  observations?: string;
  isInstructionFollowing?: boolean;
}

export interface PatientCommunicationEvaluation {
  id: string;
  patientId: string;
  sourceFileId?: string; // Documento de origen en la Biblioteca
  sourceFileName?: string;
  updatedAt: string;
  evaluatorName: string;
  hasInstructionFollowLimitation: boolean; // Flag para activar objetivo automático
  items: CommunicationChecklistItemEvaluation[];
}

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
  | 'Fonasa' 
  | 'Isapre' 
  | 'Tarjeta' 
  | 'Particular'
  | 'Pendiente'
  | 'Bono Web';

export interface ProgressNote {
  id: string;
  patientId: string;
  date: string; // e.g. "07/28/2026" or YYYY-MM-DD
  paymentMethod: PaymentMethod;
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

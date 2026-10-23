import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  User, 
  PatientAnamnesis, 
  ClinicalEvaluations, 
  ComprehensiveReport, 
  AnamnesisAgeCategory,
  CranialMeasurements,
  EarlyInfantObservation,
  PsychomotorObservationKinesfera,
  SensoryProcessingMeasureSPM2,
  DaFonsecaBPM,
  HammersmithHINE,
  CriticalCommunicationSkills,
  PaymentMethod,
  GenderType
} from '../types';
import { SPMOnlineFormModal } from './SPMOnlineFormModal';
import { CriticalCommunicationForm } from './CriticalCommunicationForm';
import { clinicalStorage } from '../utils/clinicalStorage';
import { 
  UserPlus, 
  FileText, 
  Save, 
  Sparkles, 
  User as UserIcon, 
  Activity, 
  Calendar, 
  Phone, 
  Heart, 
  Check, 
  ArrowRight,
  Brain,
  Scale,
  Smile,
  ShieldAlert,
  Baby,
  Share2,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  GraduationCap,
  Home,
  Tag,
  CreditCard,
  PlusCircle,
  Target,
  ListChecks
} from 'lucide-react';
import { calculatePatientAge } from '../utils/ageHelper';
import {
  CIF_CODES_BANK,
  CIF_QUALIFIERS,
  generateAutomaticCIFDiagnosis,
  generateShortTermGoals,
  generateLongTermGoals,
  generateTreatmentPlan,
  HOME_RECOMMENDATIONS_BANK,
  SCHOOL_RECOMMENDATIONS_BANK,
  getRecommendedHomeList,
  getRecommendedSchoolList
} from '../utils/cifClinicalRecommender';

interface PatientEvaluationFormProps {
  patients: User[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  anamnesisData: Record<string, PatientAnamnesis>;
  evaluationsData: Record<string, ClinicalEvaluations>;
  onSaveAnamnesis: (patientId: string, data: PatientAnamnesis) => void;
  onSaveEvaluations: (patientId: string, data: ClinicalEvaluations) => void;
  onAddNewPatient: (newPatient: User) => void;
  onUpdatePatient?: (updatedPatient: User) => void;
  onGenerateReport: (report: ComprehensiveReport) => void;
  clinicianName?: string;
  clinicianSpecialty?: string;
  clinicianInstitution?: string;
  clinicianRegistry?: string;
}

export const PatientEvaluationForm: React.FC<PatientEvaluationFormProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  anamnesisData,
  evaluationsData,
  onSaveAnamnesis,
  onSaveEvaluations,
  onAddNewPatient,
  onUpdatePatient,
  onGenerateReport,
  clinicianName = 'Klgo. Tratante',
  clinicianSpecialty = 'Kinesiología Pediátrica · Neurorehabilitación',
  clinicianInstitution = 'Centro Clínico Kinesfera',
  clinicianRegistry = 'Registro SIS'
}) => {
  // Decision Tree States:
  // 1. ¿Edad del niño?: menor de 2 años vs mayor o igual a 2 años
  const [ageDecision, setAgeDecision] = useState<'menor_2_anos' | 'mayor_2_anos'>('mayor_2_anos');
  
  // 2. Si es mayor de 2 años: ¿Recibe / sigue órdenes estructuradas?
  // true -> Batería Psicomotora de Vítor da Fonseca
  // false -> Pauta de Observación de Parámetros Psicomotores de Pilar Arnaiz
  const [followsCommandsDecision, setFollowsCommandsDecision] = useState<boolean>(false);

  // Active sub-section inside the form
  const [activeSection, setActiveSection] = useState<'anamnesis' | 'hine' | 'cranial' | 'arnaiz' | 'critical_communication' | 'da_fonseca' | 'spm2' | 'cif_plan'>('anamnesis');
  
  const [isCreatingNew, setIsCreatingNew] = useState(patients.length === 0);
  const [showSPMLinkModal, setShowSPMLinkModal] = useState(false);
  const [modalSpmAgeGroup, setModalSpmAgeGroup] = useState<'bebes_4_9' | '10_a_30_meses' | '2_a_5_anos' | 'mayor_5_anos'>('bebes_4_9');
  const [savedSuccessAlert, setSavedSuccessAlert] = useState<string | null>(null);
  
  // Unsaved changes state & last saved time
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const lastSavedSnapshotRef = useRef<string>('');
  const isSyncingRef = useRef<boolean>(false);

  useEffect(() => {
    if (patients.length === 0) {
      setIsCreatingNew(true);
    }
  }, [patients.length]);

  // Current patient
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Editable basic information for currently selected patient
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientRut, setPatientRut] = useState('');
  const [patientBirthDate, setPatientBirthDate] = useState('');
  const [patientGender, setPatientGender] = useState<GenderType>('Hombre');
  const [patientDiagnosis, setPatientDiagnosis] = useState('');
  const [patientEmergencyName, setPatientEmergencyName] = useState('');
  const [patientEmergencyPhone, setPatientEmergencyPhone] = useState('');
  const [isEditingPatientBasicInfo, setIsEditingPatientBasicInfo] = useState(false);
  const [showUnsavedConfirmModal, setShowUnsavedConfirmModal] = useState(false);
  const [pendingPatientIdToSelect, setPendingPatientIdToSelect] = useState<string | null>(null);

  useEffect(() => {
    if (currentPatient) {
      setPatientFirstName(currentPatient.firstName || '');
      setPatientLastName(currentPatient.lastName || '');
      setPatientRut(currentPatient.rut || '');
      setPatientBirthDate(currentPatient.birthDate || '');
      setPatientGender(currentPatient.gender || 'Hombre');
      setPatientDiagnosis(currentPatient.diagnosis || '');
      setPatientEmergencyName(currentPatient.emergencyContact?.name || '');
      setPatientEmergencyPhone(currentPatient.emergencyContact?.phone || '');
    }
  }, [currentPatient?.id]);

  // New patient basic data (when creating new from scratch)
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newRut, setNewRut] = useState('');
  const [newBirthDate, setNewBirthDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newGender, setNewGender] = useState<'Hombre' | 'Mujer'>('Hombre');

  // ==========================================
  // 1. ANAMNESIS FIELDS
  // ==========================================
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [schoolOrCenter, setSchoolOrCenter] = useState('');
  const [educationalLevel, setEducationalLevel] = useState('');
  const [pieSupport, setPieSupport] = useState(false);
  const [householdMembers, setHouseholdMembers] = useState('');
  const [consultationReason, setConsultationReason] = useState('');
  const [problemNoticedWhen, setProblemNoticedWhen] = useState('');
  const [specialistsVisited, setSpecialistsVisited] = useState('');
  const [previousTreatments, setPreviousTreatments] = useState('');
  const [familyExpectations, setFamilyExpectations] = useState('');

  // Perinatal
  const [pregnancyHistory, setPregnancyHistory] = useState('');
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState('39 semanas');
  const [birthWeightGrams, setBirthWeightGrams] = useState('');
  const [birthLengthCm, setBirthLengthCm] = useState('');
  const [birthType, setBirthType] = useState('Parto normal');
  const [birthPresentation, setBirthPresentation] = useState('Cefálica');
  const [apgarScore, setApgarScore] = useState('9/10');
  const [neonatalComplications, setNeonatalComplications] = useState('Sin complicaciones');
  const [feedingType, setFeedingType] = useState('');
  const [colic, setColic] = useState('');
  const [sleepPattern, setSleepPattern] = useState('');

  // Motor milestones
  const [headControlMonths, setHeadControlMonths] = useState('');
  const [independentSittingMonths, setIndependentSittingMonths] = useState('');
  const [crawlingMonths, setCrawlingMonths] = useState('');
  const [standingMonths, setStandingMonths] = useState('');
  const [walkingMonths, setWalkingMonths] = useState('');
  const [firstWords, setFirstWords] = useState('');
  const [firstPhrases, setFirstPhrases] = useState('');
  const [languageDifficulties, setLanguageDifficulties] = useState('');
  const [currentMotorStatus, setCurrentMotorStatus] = useState('');

  // Emotional & behavioral patterns
  const [followsInstructionsText, setFollowsInstructionsText] = useState('');
  const [isRestless, setIsRestless] = useState('');
  const [playsAloneOrAccompanied, setPlaysAloneOrAccompanied] = useState('');
  const [bedtimeRoutine, setBedtimeRoutine] = useState('');
  const [nightmares, setNightmares] = useState('');
  const [hasFears, setHasFears] = useState('');
  const [strangerReaction, setStrangerReaction] = useState('');
  const [tantrums, setTantrums] = useState('');
  const [appearsSad, setAppearsSad] = useState('');
  const [familyRelationships, setFamilyRelationships] = useState('');
  const [schoolRelationships, setSchoolRelationships] = useState('');
  const [leisureActivities, setLeisureActivities] = useState('');
  const [familyDiagnoses, setFamilyDiagnoses] = useState('');
  const [pharmacology, setPharmacology] = useState('');

  // ==========================================
  // 2. EXAMEN DE HAMMERSMITH (HINE) (< 2 años)
  // Versión Oficial Estandarizada (Máx 78 puntos)
  // ==========================================
  // 1. Pares craneales (0-3 cada uno, máx 15)
  const [hineFacialAnimation, setHineFacialAnimation] = useState<number>(3);
  const [hineEyeMovements, setHineEyeMovements] = useState<number>(3);
  const [hineVisualFollow, setHineVisualFollow] = useState<number>(3);
  const [hineAuditoryResponse, setHineAuditoryResponse] = useState<number>(3);
  const [hineSuckSwallow, setHineSuckSwallow] = useState<number>(3);

  // 2. Postura (0-3 cada uno, máx 18)
  const [hineHeadPosture, setHineHeadPosture] = useState<number>(3);
  const [hineTrunkPosture, setHineTrunkPosture] = useState<number>(3);
  const [hineArmPosture, setHineArmPosture] = useState<number>(3);
  const [hineHandsPosture, setHineHandsPosture] = useState<number>(3);
  const [hineLegPosture, setHineLegPosture] = useState<number>(3);
  const [hineLegsSupineProne, setHineLegsSupineProne] = useState<number>(3);
  const [hineFeetPosture, setHineFeetPosture] = useState<number>(3);

  // 3. Movimientos (0-3 cada uno, máx 6)
  const [hineMovementsQuantity, setHineMovementsQuantity] = useState<number>(3);
  const [hineMovementsQuality, setHineMovementsQuality] = useState<number>(3);

  // 4. Tono muscular (0-3 cada uno, máx 24)
  const [hineScarfSign, setHineScarfSign] = useState<number>(3);
  const [hinePassiveShoulderElevation, setHinePassiveShoulderElevation] = useState<number>(3);
  const [hinePronationSupination, setHinePronationSupination] = useState<number>(3);
  const [hineAdductorsAngle, setHineAdductorsAngle] = useState<number>(3);
  const [hinePoplitealAngle, setHinePoplitealAngle] = useState<number>(3);
  const [hineAnkleDorsiflexionAngle, setHineAnkleDorsiflexionAngle] = useState<number>(3);
  const [hinePullToSit, setHinePullToSit] = useState<number>(3);
  const [hineVentralSuspension, setHineVentralSuspension] = useState<number>(3);

  // 5. Reflejos y reacciones (0-3 cada uno, máx 15)
  const [hineArmProtectionReaction, setHineArmProtectionReaction] = useState<number>(3);
  const [hineVerticalSuspension, setHineVerticalSuspension] = useState<number>(3);
  const [hineLateralTilting, setHineLateralTilting] = useState<number>(3);
  const [hineForwardParachute, setHineForwardParachute] = useState<number>(3);
  const [hineTendonReflexes, setHineTendonReflexes] = useState<number>(3);
  const [hineObservations, setHineObservations] = useState('');

  // Subtotales HINE por sección
  const hineCranialSubtotal = hineFacialAnimation + hineEyeMovements + hineVisualFollow + hineAuditoryResponse + hineSuckSwallow;
  const hinePostureSubtotal = hineHeadPosture + hineTrunkPosture + hineArmPosture + hineHandsPosture + hineLegPosture + hineLegsSupineProne + hineFeetPosture;
  const hineMovementsSubtotal = hineMovementsQuantity + hineMovementsQuality;
  const hineToneSubtotal = hineScarfSign + hinePassiveShoulderElevation + hinePronationSupination + hineAdductorsAngle + hinePoplitealAngle + hineAnkleDorsiflexionAngle + hinePullToSit + hineVentralSuspension;
  const hineReflexesSubtotal = hineArmProtectionReaction + hineVerticalSuspension + hineLateralTilting + hineForwardParachute + hineTendonReflexes;

  // Puntaje Global HINE (Máx 78)
  const hineTotalScore = hineCranialSubtotal + hinePostureSubtotal + hineMovementsSubtotal + hineToneSubtotal + hineReflexesSubtotal;

  const hineRiskLevel: 'Óptimo (Bajo Riesgo)' | 'Riesgo Leve (Seguimiento)' | 'Riesgo Moderado-Alto (Intervención Precoz)' =
    hineTotalScore >= 67 ? 'Óptimo (Bajo Riesgo)' :
    hineTotalScore >= 52 ? 'Riesgo Leve (Seguimiento)' :
    'Riesgo Moderado-Alto (Intervención Precoz)';

  // Hitos Motores HINE (Sección 2)
  const [hineMotorHeadControl, setHineMotorHeadControl] = useState('Mantenido derecha todo el tiempo (desde 5m)');
  const [hineMotorSitting, setHineMotorSitting] = useState('Sentarse estable (7-8m)');
  const [hineMotorVoluntaryGrasp, setHineMotorVoluntaryGrasp] = useState('Agarre de pinza');
  const [hineMotorSupineKicking, setHineMotorSupineKicking] = useState('Toca la pierna (4-5m)');
  const [hineMotorRolling, setHineMotorRolling] = useState('De prono a supino (6m)');
  const [hineMotorCrawling, setHineMotorCrawling] = useState('Sobre manos y rodillas (10m)');
  const [hineMotorStanding, setHineMotorStanding] = useState('Se mantiene con soporte (7m)');
  const [hineMotorWalking, setHineMotorWalking] = useState('Caminando independientemente (15m)');

  // Comportamiento HINE (Sección 3 - Escala 1 a 6)
  const [hineBehaviorConscious, setHineBehaviorConscious] = useState<number>(6);
  const [hineBehaviorEmotional, setHineBehaviorEmotional] = useState<number>(5);
  const [hineBehaviorSocial, setHineBehaviorSocial] = useState<number>(4);

  // ==========================================
  // 3. PROTOCOLO DE ASIMETRÍAS CRANEALES (< 2 años)
  // ==========================================
  const [cranialD1Mm, setCranialD1Mm] = useState<number>(140);
  const [cranialD2Mm, setCranialD2Mm] = useState<number>(135);
  const [cranialApMm, setCranialApMm] = useState<number>(142);
  const [cranialBpMm, setCranialBpMm] = useState<number>(118);
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState<number>(37);
  const [cranialTreatmentIndication, setCranialTreatmentIndication] = useState('Pauta de reposicionamiento activo y tummy time');

  const cranialDifference = Math.abs(cranialD1Mm - cranialD2Mm);
  const cranialMax = Math.max(cranialD1Mm, cranialD2Mm) || 1;
  const cranialCvai = Number(((cranialDifference / cranialMax) * 100).toFixed(1));
  const plagiocephalySeverity = cranialDifference < 3 
    ? 'Normal (< 3 mm)' 
    : cranialDifference <= 10 
    ? 'Leve (3-10 mm)' 
    : cranialDifference <= 12 
    ? 'Moderada (10-12 mm)' 
    : 'Severa (> 12 mm)';

  const cephalicIndex = cranialApMm > 0 ? Number(((cranialBpMm / cranialApMm) * 100).toFixed(1)) : 80;
  const brachycephalyClassification = cephalicIndex < 75 
    ? 'Dolicocefalia (< 75%)' 
    : cephalicIndex <= 85 
    ? 'Mesocefalia / Normal (75-85%)' 
    : cephalicIndex <= 90 
    ? 'Braquicefalia (> 85%)' 
    : 'Braquicefalia Severa (> 90%)';

  // ==========================================
  // 4. PARÁMETROS PSICOMOTORES DE PILAR ARNAIZ (>= 2 años y NO recibe órdenes)
  // ==========================================
  const [arnaizMovementsFrequent, setArnaizMovementsFrequent] = useState('Correr, saltar, caídas, trepar, balanceos');
  const [arnaizMovementsQuality, setArnaizMovementsQuality] = useState('Rápidos, impulsivos, abiertos, con disociación parcial');
  const [arnaizBodyMobility, setArnaizBodyMobility] = useState('Todo el cuerpo activo en movimiento continuo');
  const [arnaizPostures, setArnaizPostures] = useState('De pie, cuclillas, cambios posturales rápidos');
  const [arnaizToneQuality, setArnaizToneQuality] = useState('Elástico con tono fluctuante en momentos de sobreexcitación');
  
  const [arnaizSpaceOccupancy, setArnaizSpaceOccupancy] = useState('Ocupa la totalidad del espacio de la sala, corre cerca de paredes');
  const [arnaizSpaceTrajectory, setArnaizSpaceTrajectory] = useState('Trayectorias circulares y periféricas');
  const [arnaizSpaceLevels, setArnaizSpaceLevels] = useState('Predominio de nivel alto en bipedestación y saltos');

  const [arnaizRhythmQuality, setArnaizRhythmQuality] = useState('Acelerado, con momentos de descarga motriz');
  const [arnaizActivityDuration, setArnaizActivityDuration] = useState('Fugaz, pasa de un material a otro con facilidad');

  const [arnaizObjectUsage, setArnaizObjectUsage] = useState('Uso sensorial y de descarga (lanzar, chocar, explorar)');
  const [arnaizObjectRelations, setArnaizObjectRelations] = useState('Le cuesta compartir objetos, tiende a retenerlos');

  const [arnaizCompanionsRelation, setArnaizCompanionsRelation] = useState('Juego en paralelo o aislado, requiere mediación');
  const [arnaizAdultRelation, setArnaizAdultRelation] = useState('Busca al adulto ante frustración o busca provocarlo de forma lúdica');
  const [arnaizGlobalSynthesis, setArnaizGlobalSynthesis] = useState('Expresión motriz expansiva con necesidad de encuadre sensoriomotor y contención tónica.');

  // ==========================================
  // 4.B HABILIDADES DE COMUNICACIÓN CRÍTICAS (>= 2 años y NO recibe órdenes)
  // ==========================================
  const [criticalCommData, setCriticalCommData] = useState<CriticalCommunicationSkills>({
    reinforcersAppropriate: 'no',
    reinforcersFood: 'Comida favorita',
    reinforcersToys: 'Lo saca solo o manipulación directa',
    reinforcersActivities: 'Música, balanceos',
    askHelpAppropriate: 'no',
    askHelpExample: 'Hace sonidos o acerca el objeto sin palabras',
    askBreaksAppropriate: 'no',
    askBreaksExample: 'Se golpea con las manos o escapa',
    rejectAppropriate: 'no',
    rejectExample: 'Hace sonidos o empuja el material',
    affirmAcceptAppropriate: 'no',
    affirmAcceptExample: 'Hace sonidos o sonríe',
    respondWaitAppropriate: 'en_proceso',
    respondWaitExample: 'Tolera breves segundos',
    transitionActivitiesAppropriate: 'no',
    transitionActivitiesExample: 'Se pone a llorar o muestra resistencia',
    visualOrientToName: 'Sí responde al señalamiento',
    visualComeHere: 'Sí va al realizar gesto',
    visualStop: 'Sí frena con mano extendida',
    visualSitDown: 'Sí al señalar la silla',
    visualGiveItToMe: 'Sí entrega con palma abierta',
    visualGoForKnownObject: 'Sí va a por objeto conocido',
    visualGoToKnownPlace: 'Va al señalar el lugar',
    visualLeaveOnPlace: 'Con señalamiento lo logra',
    visualComeWithMe: 'Da la mano y acompaña',
    verbalOrientToName: 'No se orienta de inmediato solo por nombre',
    verbalComeHere: 'Hay que llamarlo 3 a 5 veces',
    verbalStop: 'Le cuesta parar sin freno físico',
    verbalSitDown: 'Hay que decirle unas 3 a 5 veces',
    verbalGiveItToMe: 'Sí / Le cuesta soltar',
    verbalGoForKnownObject: 'Sí si es su objeto de interés',
    verbalGoToKnownPlace: 'No sigue más de 2 indicaciones verbales',
    verbalLeaveOnPlace: 'Le cuesta',
    verbalComeWithMe: 'Le cuesta seguir solo la voz',
    followsVisualSchedule: 'no',
    visualScheduleNotes: 'Aún no implementado',
    generalObservations: 'Requiere apoyos visuales y gestuales consistentes; lenguaje verbal receptivo en desarrollo.'
  });

  // ==========================================
  // 5. BATERÍA PSICOMOTORA DE VÍTOR DA FONSECA (>= 2 años y SÍ recibe órdenes)
  // ==========================================
  // 1. Tonicidad (1-4)
  const [bpmTonicityExtensibility, setBpmTonicityExtensibility] = useState<number>(3);
  const [bpmTonicityPassivity, setBpmTonicityPassivity] = useState<number>(3);
  const [bpmTonicityParatonia, setBpmTonicityParatonia] = useState<number>(3);
  const [bpmTonicityDiadochokinesia, setBpmTonicityDiadochokinesia] = useState<number>(2);
  const [bpmTonicitySynkinesia, setBpmTonicitySynkinesia] = useState<number>(2);
  const bpmTonicityScore = Math.round((bpmTonicityExtensibility + bpmTonicityPassivity + bpmTonicityParatonia + bpmTonicityDiadochokinesia + bpmTonicitySynkinesia) / 5);

  // 2. Equilibrio (1-4)
  const [bpmEquilibriumImmobility, setBpmEquilibriumImmobility] = useState<number>(2);
  const [bpmEquilibriumStatic, setBpmEquilibriumStatic] = useState<number>(2);
  const [bpmEquilibriumDynamic, setBpmEquilibriumDynamic] = useState<number>(2);
  const bpmEquilibriumScore = Math.round((bpmEquilibriumImmobility + bpmEquilibriumStatic + bpmEquilibriumDynamic) / 3);

  // 3. Lateralidad (1-4)
  const [bpmLateralityOcular, setBpmLateralityOcular] = useState<number>(3);
  const [bpmLateralityAuditory, setBpmLateralityAuditory] = useState<number>(3);
  const [bpmLateralityManual, setBpmLateralityManual] = useState<number>(3);
  const [bpmLateralityPodal, setBpmLateralityPodal] = useState<number>(3);
  const [bpmLateralityProfile, setBpmLateralityProfile] = useState<'Diestro Completo' | 'Zurdo Completo' | 'Cruzado' | 'Ambidiestro / Indefinido'>('Diestro Completo');
  const bpmLateralityScore = Math.round((bpmLateralityOcular + bpmLateralityAuditory + bpmLateralityManual + bpmLateralityPodal) / 4);

  // 4. Noción del Cuerpo (1-4)
  const [bpmBodyNotionKinesthetic, setBpmBodyNotionKinesthetic] = useState<number>(2);
  const [bpmBodyNotionRightLeft, setBpmBodyNotionRightLeft] = useState<number>(2);
  const [bpmBodyNotionAutoimage, setBpmBodyNotionAutoimage] = useState<number>(2);
  const [bpmBodyNotionGestures, setBpmBodyNotionGestures] = useState<number>(2);
  const bpmBodyNotionScore = Math.round((bpmBodyNotionKinesthetic + bpmBodyNotionRightLeft + bpmBodyNotionAutoimage + bpmBodyNotionGestures) / 4);

  // 5. Estructuración Espacio-Temporal (1-4)
  const [bpmSpatialOrientation, setBpmSpatialOrientation] = useState<number>(2);
  const [bpmSpatialOrganization, setBpmSpatialOrganization] = useState<number>(2);
  const [bpmSpatialRhythm, setBpmSpatialRhythm] = useState<number>(2);
  const bpmSpatialTemporalScore = Math.round((bpmSpatialOrientation + bpmSpatialOrganization + bpmSpatialRhythm) / 3);

  // 6. Praxia Global (1-4)
  const [bpmGlobalPraxiaOculomanual, setBpmGlobalPraxiaOculomanual] = useState<number>(2);
  const [bpmGlobalPraxiaOculopodal, setBpmGlobalPraxiaOculopodal] = useState<number>(2);
  const [bpmGlobalPraxiaDysmetria, setBpmGlobalPraxiaDysmetria] = useState<number>(2);
  const [bpmGlobalPraxiaDissociation, setBpmGlobalPraxiaDissociation] = useState<number>(2);
  const bpmGlobalPraxiaScore = Math.round((bpmGlobalPraxiaOculomanual + bpmGlobalPraxiaOculopodal + bpmGlobalPraxiaDysmetria + bpmGlobalPraxiaDissociation) / 4);

  // 7. Praxia Fina (1-4)
  const [bpmFinePraxiaDynamic, setBpmFinePraxiaDynamic] = useState<number>(2);
  const [bpmFinePraxiaDigital, setBpmFinePraxiaDigital] = useState<number>(2);
  const [bpmFinePraxiaGraphomotor, setBpmFinePraxiaGraphomotor] = useState<number>(1);
  const bpmFinePraxiaScore = Math.round((bpmFinePraxiaDynamic + bpmFinePraxiaDigital + bpmFinePraxiaGraphomotor) / 3);

  const bpmTotal = bpmTonicityScore + bpmEquilibriumScore + bpmLateralityScore + bpmBodyNotionScore + bpmSpatialTemporalScore + bpmGlobalPraxiaScore + bpmFinePraxiaScore;
  const bpmProfileResult = bpmTotal <= 13 
    ? 'Perfil Apráxico (7-13 puntos)' 
    : bpmTotal <= 20 
    ? 'Perfil Dispráxico (14-20 puntos)' 
    : bpmTotal <= 26 
    ? 'Perfil Eupráxico (21-26 puntos)' 
    : 'Perfil Hiperpráxico (27-28 puntos)';
  const [bpmConclusions, setBpmConclusions] = useState('Desempeño praxico que requiere estimulación en motricidad fina y ritmo.');

  // ==========================================
  // 6. SPM-2 (PERFIL SENSORIAL)
  // ==========================================
  const [spmSocial, setSpmSocial] = useState<number>(18);
  const [spmVision, setSpmVision] = useState<number>(14);
  const [spmHearing, setSpmHearing] = useState<number>(16);
  const [spmTouch, setSpmTouch] = useState<number>(18);
  const [spmTasteSmell, setSpmTasteSmell] = useState<number>(13);
  const [spmBodyAwareness, setSpmBodyAwareness] = useState<number>(22);
  const [spmBalanceMotion, setSpmBalanceMotion] = useState<number>(20);
  const [spmPlanningIdeas, setSpmPlanningIdeas] = useState<number>(21);
  const [spmApplicationMethod, setSpmApplicationMethod] = useState<'presencial' | 'enlace_padres' | 'enlace_escuela'>('presencial');
  const [spmRespondentName, setSpmRespondentName] = useState('');

  const getSpmRange = (score: number) => {
    if (score < 16) return 'Típico (40-59)';
    if (score <= 20) return 'Dificultades Moderadas (60-69)';
    return 'Disfunción Severa (70-80)';
  };

  const spmTotal = spmSocial + spmVision + spmHearing + spmTouch + spmTasteSmell + spmBodyAwareness + spmBalanceMotion + spmPlanningIdeas;

  // ==========================================
  // 7. CONCLUSIONES CLÍNICAS CIF Y PLAN
  // ==========================================
  const [selectedCifCodes, setSelectedCifCodes] = useState<string[]>([]);
  const [cifSeverityQualifier, setCifSeverityQualifier] = useState<string>('.2');
  const [cifActiveDomain, setCifActiveDomain] = useState<'b' | 's' | 'd' | 'e'>('b');

  const [functionalDiagnosisCIF, setFunctionalDiagnosisCIF] = useState('');
  const [therapeuticGoalsShortTerm, setTherapeuticGoalsShortTerm] = useState('');
  const [therapeuticGoalsLongTerm, setTherapeuticGoalsLongTerm] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [homeAndSchoolRecommendations, setHomeAndSchoolRecommendations] = useState('');
  const [homeRecommendations, setHomeRecommendations] = useState('');
  const [schoolRecommendations, setSchoolRecommendations] = useState('');

  // Ref to track which patient ID is currently loaded in form fields
  // Prevents re-running sync on every render or during save
  const loadedPatientIdRef = useRef<string | null>(null);

  // Sync when patient changes
  useEffect(() => {
    if (!currentPatient) return;

    // Only synchronize from storage/props if the patient ID actually changed
    if (loadedPatientIdRef.current === currentPatient.id) {
      return;
    }
    loadedPatientIdRef.current = currentPatient.id;

    const a = anamnesisData[currentPatient.id];
    if (a) {
      setAgeDecision(a.ageCategory === 'bebe_hasta_18_meses' ? 'menor_2_anos' : 'mayor_2_anos');
      setCaregiverName(a.caregiverName || '');
      setCaregiverPhone(a.caregiverPhone || '');
      setSchoolOrCenter(a.schoolOrCenter || '');
      setEducationalLevel(a.educationalLevel || '');
      setPieSupport(a.pieSupport || false);
      setHouseholdMembers(a.householdMembers || '');
      setConsultationReason(a.consultationReason || '');
      setProblemNoticedWhen(a.problemNoticedWhen || '');
      setSpecialistsVisited(a.specialistsVisited || '');
      setPreviousTreatments(a.previousTreatments || '');
      setFamilyExpectations(a.familyExpectations || '');
      setPregnancyHistory(a.pregnancyHistory || '');
      setGestationalAgeWeeks(a.gestationalAgeWeeks || '');
      setBirthWeightGrams(a.birthWeightGrams || '');
      setBirthLengthCm(a.birthLengthCm || '');
      setBirthType(a.birthType || 'Parto normal');
      setBirthPresentation(a.birthPresentation || 'Cefálica');
      setApgarScore(a.apgarScore || '9/10');
      setNeonatalComplications(a.neonatalComplications || 'Sin complicaciones');
      setFeedingType(a.feedingType || '');
      setColic(a.colic || '');
      setSleepPattern(a.sleepPattern || '');
      setHeadControlMonths(a.headControlMonths || '');
      setIndependentSittingMonths(a.independentSittingMonths || '');
      setCrawlingMonths(a.crawlingMonths || '');
      setStandingMonths(a.standingMonths || '');
      setWalkingMonths(a.walkingMonths || '');
      setFirstWords(a.firstWords || '');
      setFirstPhrases(a.firstPhrases || '');
      setLanguageDifficulties(a.languageDifficulties || '');
      setCurrentMotorStatus(a.currentMotorStatus || '');
      setFollowsInstructionsText(a.followsInstructions || '');
      setIsRestless(a.isRestless || '');
      setPlaysAloneOrAccompanied(a.playsAloneOrAccompanied || '');
      setBedtimeRoutine(a.bedtimeRoutine || '');
      setNightmares(a.nightmares || '');
      setHasFears(a.hasFears || '');
      setStrangerReaction(a.strangerReaction || '');
      setTantrums(a.tantrums || '');
      setAppearsSad(a.appearsSad || '');
      setFamilyRelationships(a.familyRelationships || '');
      setSchoolRelationships(a.schoolRelationships || '');
      setLeisureActivities(a.leisureActivities || '');
      setFamilyDiagnoses(a.familyDiagnoses || '');
      setPharmacology(a.pharmacology || '');

      if (a.cranialMeasurements) {
        setCranialD1Mm(a.cranialMeasurements.d1Mm || 140);
        setCranialD2Mm(a.cranialMeasurements.d2Mm || 135);
        setCranialApMm(a.cranialMeasurements.apMm || 142);
        setCranialBpMm(a.cranialMeasurements.bpMm || 118);
        setHeadCircumferenceCm(a.cranialMeasurements.headCircumferenceCm || 37);
        setCranialTreatmentIndication(a.cranialMeasurements.treatmentIndication || '');
      } else {
        setCranialD1Mm(140);
        setCranialD2Mm(135);
        setCranialApMm(142);
        setCranialBpMm(118);
        setHeadCircumferenceCm(37);
        setCranialTreatmentIndication('');
      }
    } else {
      // Cleanly initialize all fields for a new or unsaved patient so previous patient's data NEVER leaks
      setAgeDecision('mayor_2_anos');
      setCaregiverName(currentPatient.emergencyContact?.name || '');
      setCaregiverPhone(currentPatient.emergencyContact?.phone || '');
      setSchoolOrCenter('');
      setEducationalLevel('');
      setPieSupport(false);
      setHouseholdMembers('');
      setConsultationReason(currentPatient.diagnosis || '');
      setProblemNoticedWhen('');
      setSpecialistsVisited('');
      setPreviousTreatments('');
      setFamilyExpectations('');
      setPregnancyHistory('');
      setGestationalAgeWeeks('');
      setBirthWeightGrams('');
      setBirthLengthCm('');
      setBirthType('Parto normal');
      setBirthPresentation('Cefálica');
      setApgarScore('9/10');
      setNeonatalComplications('Sin complicaciones');
      setFeedingType('');
      setColic('');
      setSleepPattern('');
      setHeadControlMonths('');
      setIndependentSittingMonths('');
      setCrawlingMonths('');
      setStandingMonths('');
      setWalkingMonths('');
      setFirstWords('');
      setFirstPhrases('');
      setLanguageDifficulties('');
      setCurrentMotorStatus('');
      setFollowsInstructionsText('');
      setIsRestless('');
      setPlaysAloneOrAccompanied('');
      setBedtimeRoutine('');
      setNightmares('');
      setHasFears('');
      setStrangerReaction('');
      setTantrums('');
      setAppearsSad('');
      setFamilyRelationships('');
      setSchoolRelationships('');
      setLeisureActivities('');
      setFamilyDiagnoses('');
      setPharmacology('');
      setCranialD1Mm(140);
      setCranialD2Mm(135);
      setCranialApMm(142);
      setCranialBpMm(118);
      setHeadCircumferenceCm(37);
      setCranialTreatmentIndication('');
    }

    const e = evaluationsData[currentPatient.id];
    if (e) {
      if (e.patientAgeCategory) setAgeDecision(e.patientAgeCategory);
      if (typeof e.followsCommands === 'boolean') setFollowsCommandsDecision(e.followsCommands);
      
      setSelectedCifCodes(e.cifCodes || []);
      setFunctionalDiagnosisCIF(e.functionalDiagnosisCIF || '');
      setTherapeuticGoalsShortTerm(e.therapeuticGoalsShortTerm || '');
      setTherapeuticGoalsLongTerm(e.therapeuticGoalsLongTerm || '');
      setTreatmentPlan(e.treatmentPlan || '');
      setHomeAndSchoolRecommendations(e.homeAndSchoolRecommendations || '');
      setHomeRecommendations(e.homeRecommendations || '');
      setSchoolRecommendations(e.schoolRecommendations || '');

      if (e.hineExam) {
        setHineFacialAnimation(e.hineExam.facialAnimation ?? 3);
        setHineEyeMovements(e.hineExam.eyeMovements ?? 3);
        setHineVisualFollow(e.hineExam.visualFollow ?? 3);
        setHineAuditoryResponse(e.hineExam.auditoryResponse ?? 3);
        setHineSuckSwallow(e.hineExam.suckSwallow ?? 3);

        setHineHeadPosture(e.hineExam.headPosture ?? 3);
        setHineTrunkPosture(e.hineExam.trunkPosture ?? 3);
        setHineArmPosture(e.hineExam.armPosture ?? 3);
        setHineHandsPosture(e.hineExam.handsPosture ?? 3);
        setHineLegPosture(e.hineExam.legPosture ?? 3);
        setHineLegsSupineProne(e.hineExam.legsSupineProne ?? 3);
        setHineFeetPosture(e.hineExam.feetPosture ?? 3);

        setHineMovementsQuantity(e.hineExam.movementsQuantity ?? 3);
        setHineMovementsQuality(e.hineExam.movementsQuality ?? 3);

        setHineScarfSign(e.hineExam.scarfSign ?? 3);
        setHinePassiveShoulderElevation(e.hineExam.passiveShoulderElevation ?? 3);
        setHinePronationSupination(e.hineExam.pronationSupination ?? 3);
        setHineAdductorsAngle(e.hineExam.adductorsAngle ?? 3);
        setHinePoplitealAngle(e.hineExam.poplitealAngle ?? 3);
        setHineAnkleDorsiflexionAngle(e.hineExam.ankleDorsiflexionAngle ?? 3);
        setHinePullToSit(e.hineExam.pullToSit ?? 3);
        setHineVentralSuspension(e.hineExam.ventralSuspension ?? 3);

        setHineArmProtectionReaction(e.hineExam.armProtectionReaction ?? 3);
        setHineVerticalSuspension(e.hineExam.verticalSuspension ?? 3);
        setHineLateralTilting(e.hineExam.lateralTilting ?? 3);
        setHineForwardParachute(e.hineExam.forwardParachute ?? 3);
        setHineTendonReflexes(e.hineExam.tendonReflexes ?? 3);

        if (e.hineExam.motorMilestones) {
          if (e.hineExam.motorMilestones.headControl) setHineMotorHeadControl(e.hineExam.motorMilestones.headControl);
          if (e.hineExam.motorMilestones.sitting) setHineMotorSitting(e.hineExam.motorMilestones.sitting);
          if (e.hineExam.motorMilestones.voluntaryGrasp) setHineMotorVoluntaryGrasp(e.hineExam.motorMilestones.voluntaryGrasp);
          if (e.hineExam.motorMilestones.supineKicking) setHineMotorSupineKicking(e.hineExam.motorMilestones.supineKicking);
          if (e.hineExam.motorMilestones.rolling) setHineMotorRolling(e.hineExam.motorMilestones.rolling);
          if (e.hineExam.motorMilestones.crawling) setHineMotorCrawling(e.hineExam.motorMilestones.crawling);
          if (e.hineExam.motorMilestones.standing) setHineMotorStanding(e.hineExam.motorMilestones.standing);
          if (e.hineExam.motorMilestones.walking) setHineMotorWalking(e.hineExam.motorMilestones.walking);
        }

        if (e.hineExam.behavior) {
          if (e.hineExam.behavior.consciousState) setHineBehaviorConscious(e.hineExam.behavior.consciousState);
          if (e.hineExam.behavior.emotionalState) setHineBehaviorEmotional(e.hineExam.behavior.emotionalState);
          if (e.hineExam.behavior.socialOrientation) setHineBehaviorSocial(e.hineExam.behavior.socialOrientation);
        }

        setHineObservations(e.hineExam.clinicalObservations || '');
      }

      if (e.criticalCommunication) {
        setCriticalCommData(e.criticalCommunication);
      }

      if (e.psychomotorObservation) {
        setArnaizMovementsFrequent(e.psychomotorObservation.movementsFrequent || '');
        setArnaizMovementsQuality(e.psychomotorObservation.movementsQuality || '');
        setArnaizBodyMobility(e.psychomotorObservation.bodyMobilityLevel || '');
        setArnaizPostures(e.psychomotorObservation.posturesFrequent || '');
        setArnaizToneQuality(e.psychomotorObservation.toneQuality || '');
        setArnaizSpaceOccupancy(e.psychomotorObservation.spaceOccupancy || '');
        setArnaizSpaceTrajectory(e.psychomotorObservation.spaceTrajectory || '');
        setArnaizSpaceLevels(e.psychomotorObservation.spaceLevels || '');
        setArnaizRhythmQuality(e.psychomotorObservation.rhythmQuality || '');
        setArnaizActivityDuration(e.psychomotorObservation.activityDuration || '');
        setArnaizObjectUsage(e.psychomotorObservation.objectUsage || '');
        setArnaizObjectRelations(e.psychomotorObservation.objectsRelationWithOthers || '');
        setArnaizCompanionsRelation(e.psychomotorObservation.companionsRelation || '');
        setArnaizAdultRelation(e.psychomotorObservation.adultRelation || '');
        setArnaizGlobalSynthesis(e.psychomotorObservation.globalSynthesis || '');
      }

      if (e.spmSensoryMeasure) {
        setSpmSocial(e.spmSensoryMeasure.socialParticipationScore || 18);
        setSpmVision(e.spmSensoryMeasure.visionScore || 14);
        setSpmHearing(e.spmSensoryMeasure.hearingScore || 16);
        setSpmTouch(e.spmSensoryMeasure.touchScore || 18);
        setSpmTasteSmell(e.spmSensoryMeasure.tasteSmellScore || 13);
        setSpmBodyAwareness(e.spmSensoryMeasure.bodyAwarenessScore || 22);
        setSpmBalanceMotion(e.spmSensoryMeasure.balanceMotionScore || 20);
        setSpmPlanningIdeas(e.spmSensoryMeasure.planningIdeasScore || 21);
        setSpmApplicationMethod(e.spmSensoryMeasure.applicationMethod || 'presencial');
        setSpmRespondentName(e.spmSensoryMeasure.respondentName || '');
      }

      if (e.daFonsecaBpm) {
        setBpmConclusions(e.daFonsecaBpm.conclusions || '');
      }
    } else {
      // Cleanly initialize all evaluations for new patient
      setSelectedCifCodes([]);
      setFunctionalDiagnosisCIF('');
      setTherapeuticGoalsShortTerm('');
      setTherapeuticGoalsLongTerm('');
      setTreatmentPlan('');
      setHomeAndSchoolRecommendations('');
      setHomeRecommendations('');
      setSchoolRecommendations('');
      setHineObservations('');
      setBpmConclusions('');
    }
  }, [currentPatient?.id, anamnesisData, evaluationsData]);

  const handleClearForm = () => {
    setCaregiverName('');
    setCaregiverPhone('');
    setSchoolOrCenter('');
    setEducationalLevel('');
    setPieSupport(false);
    setHouseholdMembers('');
    setConsultationReason('');
    setProblemNoticedWhen('');
    setSpecialistsVisited('');
    setPreviousTreatments('');
    setFamilyExpectations('');
    setPregnancyHistory('');
    setGestationalAgeWeeks('39 semanas');
    setBirthWeightGrams('');
    setBirthLengthCm('');
    setFeedingType('');
    setColic('');
    setSleepPattern('');
    setHeadControlMonths('');
    setIndependentSittingMonths('');
    setCrawlingMonths('');
    setStandingMonths('');
    setWalkingMonths('');
    setFirstWords('');
    setFirstPhrases('');
    setLanguageDifficulties('');
    setCurrentMotorStatus('');
    setFollowsInstructionsText('');
    setIsRestless('');
    setPlaysAloneOrAccompanied('');
    setBedtimeRoutine('');
    setNightmares('');
    setHasFears('');
    setStrangerReaction('');
    setTantrums('');
    setAppearsSad('');
    setFamilyRelationships('');
    setSchoolRelationships('');
    setLeisureActivities('');
    setFamilyDiagnoses('');
    setPharmacology('');
    setFunctionalDiagnosisCIF('');
    setSelectedCifCodes([]);
    setTherapeuticGoalsShortTerm('');
    setTherapeuticGoalsLongTerm('');
    setTreatmentPlan('');
    setHomeAndSchoolRecommendations('');
    setHomeRecommendations('');
    setSchoolRecommendations('');
    setSavedSuccessAlert('Formulario limpiado. Listo para nuevo registro.');
    setTimeout(() => setSavedSuccessAlert(null), 3000);
  };

  const handleCreateNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim()) return;

    const newPatient: User = {
      id: `user_patient_${Date.now()}`,
      email: `paciente.${newFirstName.toLowerCase()}@kinesfera.cl`,
      role: 'Padre/Niño',
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      rut: newRut.trim() || '26.900.120-4',
      birthDate: newBirthDate,
      gender: newGender,
      plan: 'Premium',
      credits: 50,
      assignedExercise: 'squats',
      diagnosis: consultationReason || 'Evaluación neurokinesiológica integral',
      medicalRecordNumber: `NN-${Math.floor(100 + Math.random() * 900)}`,
      emergencyContact: {
        name: caregiverName || 'Tutor legal',
        relationship: 'Tutor',
        phone: caregiverPhone || '+56 9 8000 0000'
      }
    };

    onAddNewPatient(newPatient);
    onSelectPatient(newPatient.id);
    setIsCreatingNew(false);

    saveAnamnesisToState(newPatient.id);
    saveEvaluationsToState(newPatient.id);

    setSavedSuccessAlert(`Paciente ${newPatient.firstName} ${newPatient.lastName} registrado con éxito.`);
    setTimeout(() => setSavedSuccessAlert(null), 4000);
  };

  const saveAnamnesisToState = (patientId: string = currentPatient?.id) => {
    if (!patientId) return;
    const data: PatientAnamnesis = {
      id: `anam_${patientId}`,
      patientId,
      evaluatorName: clinicianName,
      evaluationDate: new Date().toISOString().slice(0, 10),
      ageCategory: ageDecision === 'menor_2_anos' ? 'bebe_hasta_18_meses' : 'mayor_2_anos',
      caregiverName,
      caregiverPhone,
      schoolOrCenter,
      educationalLevel,
      pieSupport,
      householdMembers,
      consultationReason,
      problemNoticedWhen,
      specialistsVisited,
      previousTreatments,
      familyExpectations,
      pregnancyHistory,
      gestationalAgeWeeks,
      birthWeightGrams,
      birthLengthCm,
      birthType,
      birthPresentation,
      apgarScore,
      neonatalComplications,
      feedingType,
      colic,
      sleepPattern,
      headControlMonths,
      independentSittingMonths,
      crawlingMonths,
      standingMonths,
      walkingMonths,
      firstWords,
      firstPhrases,
      languageDifficulties,
      currentMotorStatus,
      followsInstructions: followsInstructionsText,
      isRestless,
      playsAloneOrAccompanied,
      bedtimeRoutine,
      nightmares,
      hasFears,
      strangerReaction,
      tantrums,
      appearsSad,
      familyRelationships,
      schoolRelationships,
      leisureActivities,
      familyDiagnoses,
      medicalDiagnoses: consultationReason || currentPatient?.diagnosis || '',
      surgeries: 'Ninguna',
      pharmacology,
      assistiveDevices: 'Ninguna',
      allergicConditions: 'Sin alergias reportadas',
      cranialMeasurements: ageDecision === 'menor_2_anos' ? {
        d1Mm: cranialD1Mm,
        d2Mm: cranialD2Mm,
        differenceMm: cranialDifference,
        cvaiPercent: cranialCvai,
        plagiocephalySeverity,
        apMm: cranialApMm,
        bpMm: cranialBpMm,
        cephalicIndex,
        brachycephalyClassification,
        headCircumferenceCm,
        treatmentIndication: cranialTreatmentIndication
      } : undefined
    };

    onSaveAnamnesis(patientId, data);
  };

  const saveEvaluationsToState = (patientId: string = currentPatient?.id) => {
    if (!patientId) return;
    const data: ClinicalEvaluations = {
      id: `eval_${patientId}`,
      patientId,
      evaluationDate: new Date().toISOString().slice(0, 10),
      evaluatorName: clinicianName,
      gmfcsLevel: 'Nivel I',
      macsLevel: 'Nivel I',
      eedpOrTepsiScore: 'Evaluación aplicada según protocolo',
      ashworthScore: '0',
      tonePattern: 'Normotonía',
      deepTendonReflexes: 'Normales ++/++++',
      hipFlexionExt: '120° / 0°',
      kneeFlexionExt: '130° / 0°',
      ankleDorsiflexion: '15° bilateral',
      shoulderMobility: '> 165° bilateral',
      headAndTrunkControl: 'Conservado',
      rightingReactions: 'Presentes',
      protectiveResponses: 'Conservadas',
      balanceSittingAndStanding: 'Funcional',
      transferAbility: 'Autónomo',
      gaitObservation: currentMotorStatus || 'Marcha activa',
      sensoryProfile: 'Evaluado mediante SPM-2',
      patientAgeCategory: ageDecision,
      followsCommands: followsCommandsDecision,
      hineExam: ageDecision === 'menor_2_anos' ? {
        // 1. Pares Craneales
        facialAnimation: hineFacialAnimation,
        eyeMovements: hineEyeMovements,
        visualFollow: hineVisualFollow,
        auditoryResponse: hineAuditoryResponse,
        suckSwallow: hineSuckSwallow,
        cranialNervesSubtotal: hineCranialSubtotal,

        // 2. Postura
        headPosture: hineHeadPosture,
        trunkPosture: hineTrunkPosture,
        armPosture: hineArmPosture,
        handsPosture: hineHandsPosture,
        legPosture: hineLegPosture,
        legsSupineProne: hineLegsSupineProne,
        feetPosture: hineFeetPosture,
        postureSubtotal: hinePostureSubtotal,

        // 3. Movimientos
        movementsQuantity: hineMovementsQuantity,
        movementsQuality: hineMovementsQuality,
        movementsSubtotal: hineMovementsSubtotal,

        // 4. Tono Muscular
        scarfSign: hineScarfSign,
        passiveShoulderElevation: hinePassiveShoulderElevation,
        pronationSupination: hinePronationSupination,
        adductorsAngle: hineAdductorsAngle,
        poplitealAngle: hinePoplitealAngle,
        ankleDorsiflexionAngle: hineAnkleDorsiflexionAngle,
        pullToSit: hinePullToSit,
        ventralSuspension: hineVentralSuspension,
        toneSubtotal: hineToneSubtotal,

        // 5. Reflejos y Reacciones
        armProtectionReaction: hineArmProtectionReaction,
        verticalSuspension: hineVerticalSuspension,
        lateralTilting: hineLateralTilting,
        forwardParachute: hineForwardParachute,
        tendonReflexes: hineTendonReflexes,
        reflexesSubtotal: hineReflexesSubtotal,

        // Resumen Global
        totalScore: hineTotalScore,
        riskLevel: hineRiskLevel,

        // Sección 2: Hitos Motores
        motorMilestones: {
          headControl: hineMotorHeadControl,
          sitting: hineMotorSitting,
          voluntaryGrasp: hineMotorVoluntaryGrasp,
          supineKicking: hineMotorSupineKicking,
          rolling: hineMotorRolling,
          crawling: hineMotorCrawling,
          standing: hineMotorStanding,
          walking: hineMotorWalking,
        },

        // Sección 3: Comportamiento
        behavior: {
          consciousState: hineBehaviorConscious,
          emotionalState: hineBehaviorEmotional,
          socialOrientation: hineBehaviorSocial,
        },

        clinicalObservations: hineObservations
      } : undefined,
      psychomotorObservation: (ageDecision === 'mayor_2_anos' && !followsCommandsDecision) ? {
        movementsFrequent: arnaizMovementsFrequent,
        movementsQuality: arnaizMovementsQuality,
        bodyMobilityLevel: arnaizBodyMobility,
        posturesFrequent: arnaizPostures,
        toneQuality: arnaizToneQuality,
        spaceOccupancy: arnaizSpaceOccupancy,
        spaceTrajectory: arnaizSpaceTrajectory,
        spaceLevels: arnaizSpaceLevels,
        rhythmQuality: arnaizRhythmQuality,
        activityDuration: arnaizActivityDuration,
        objectUsage: arnaizObjectUsage,
        objectsRelationWithOthers: arnaizObjectRelations,
        companionsRelation: arnaizCompanionsRelation,
        adultRelation: arnaizAdultRelation,
        globalSynthesis: arnaizGlobalSynthesis
      } : undefined,
      criticalCommunication: (ageDecision === 'mayor_2_anos' && !followsCommandsDecision) ? criticalCommData : undefined,
      daFonsecaBpm: (ageDecision === 'mayor_2_anos' && followsCommandsDecision) ? {
        tonicityExtensibility: bpmTonicityExtensibility,
        tonicityPassivity: bpmTonicityPassivity,
        tonicityParatonia: bpmTonicityParatonia,
        tonicityDiadochokinesia: bpmTonicityDiadochokinesia,
        tonicitySynkinesia: bpmTonicitySynkinesia,
        tonicityScore: bpmTonicityScore,
        equilibriumImmobility: bpmEquilibriumImmobility,
        equilibriumStatic: bpmEquilibriumStatic,
        equilibriumDynamic: bpmEquilibriumDynamic,
        equilibriumScore: bpmEquilibriumScore,
        lateralityOcular: bpmLateralityOcular,
        lateralityAuditory: bpmLateralityAuditory,
        lateralityManual: bpmLateralityManual,
        lateralityPodal: bpmLateralityPodal,
        lateralityProfile: bpmLateralityProfile,
        lateralityScore: bpmLateralityScore,
        bodyNotionKinesthetic: bpmBodyNotionKinesthetic,
        bodyNotionRightLeft: bpmBodyNotionRightLeft,
        bodyNotionAutoimage: bpmBodyNotionAutoimage,
        bodyNotionGesturesImitation: bpmBodyNotionGestures,
        bodyNotionScore: bpmBodyNotionScore,
        spatialOrientation: bpmSpatialOrientation,
        spatialOrganization: bpmSpatialOrganization,
        spatialRhythmStructure: bpmSpatialRhythm,
        spatialTemporalScore: bpmSpatialTemporalScore,
        globalPraxiaOculomanual: bpmGlobalPraxiaOculomanual,
        globalPraxiaOculopodal: bpmGlobalPraxiaOculopodal,
        globalPraxiaDysmetria: bpmGlobalPraxiaDysmetria,
        globalPraxiaDissociation: bpmGlobalPraxiaDissociation,
        globalPraxiaScore: bpmGlobalPraxiaScore,
        finePraxiaDynamicCoordination: bpmFinePraxiaDynamic,
        finePraxiaDigitalDrumming: bpmFinePraxiaDigital,
        finePraxiaGraphomotorSpeed: bpmFinePraxiaGraphomotor,
        finePraxiaScore: bpmFinePraxiaScore,
        totalScore: bpmTotal,
        profileResult: bpmProfileResult,
        conclusions: bpmConclusions
      } : undefined,
      spmSensoryMeasure: {
        socialParticipationScore: spmSocial,
        socialParticipationRange: getSpmRange(spmSocial),
        visionScore: spmVision,
        visionRange: getSpmRange(spmVision),
        hearingScore: spmHearing,
        hearingRange: getSpmRange(spmHearing),
        touchScore: spmTouch,
        touchRange: getSpmRange(spmTouch),
        tasteSmellScore: spmTasteSmell,
        tasteSmellRange: getSpmRange(spmTasteSmell),
        bodyAwarenessScore: spmBodyAwareness,
        bodyAwarenessRange: getSpmRange(spmBodyAwareness),
        balanceMotionScore: spmBalanceMotion,
        balanceMotionRange: getSpmRange(spmBalanceMotion),
        planningIdeasScore: spmPlanningIdeas,
        planningIdeasRange: getSpmRange(spmPlanningIdeas),
        totalSensoryScore: spmTotal,
        totalSensoryRange: spmTotal < 125 ? 'Típico (40-59)' : spmTotal <= 155 ? 'Dificultades Moderadas (60-69)' : 'Disfunción Severa (70-80)',
        applicationMethod: spmApplicationMethod,
        respondentName: spmRespondentName
      },
      cifCodes: selectedCifCodes,
      functionalDiagnosisCIF,
      therapeuticGoalsShortTerm,
      therapeuticGoalsLongTerm,
      treatmentPlan,
      homeRecommendations,
      schoolRecommendations,
      homeAndSchoolRecommendations: homeAndSchoolRecommendations || [homeRecommendations, schoolRecommendations].filter(Boolean).join('\n\n')
    };

    onSaveEvaluations(patientId, data);
  };

  // Compute full form snapshot to detect unsaved modifications
  const getFormSnapshot = useCallback(() => {
    return JSON.stringify([
      // Patient basic info
      patientFirstName,
      patientLastName,
      patientRut,
      patientBirthDate,
      patientGender,
      patientDiagnosis,
      patientEmergencyName,
      patientEmergencyPhone,
      // Decision tree
      ageDecision,
      followsCommandsDecision,
      caregiverName,
      caregiverPhone,
      schoolOrCenter,
      educationalLevel,
      pieSupport,
      householdMembers,
      consultationReason,
      problemNoticedWhen,
      specialistsVisited,
      previousTreatments,
      familyExpectations,
      pregnancyHistory,
      gestationalAgeWeeks,
      birthWeightGrams,
      birthLengthCm,
      birthType,
      birthPresentation,
      apgarScore,
      neonatalComplications,
      feedingType,
      colic,
      sleepPattern,
      headControlMonths,
      independentSittingMonths,
      crawlingMonths,
      standingMonths,
      walkingMonths,
      firstWords,
      firstPhrases,
      languageDifficulties,
      currentMotorStatus,
      followsInstructionsText,
      isRestless,
      playsAloneOrAccompanied,
      bedtimeRoutine,
      nightmares,
      hasFears,
      strangerReaction,
      tantrums,
      appearsSad,
      familyRelationships,
      schoolRelationships,
      leisureActivities,
      familyDiagnoses,
      pharmacology,
      cranialD1Mm,
      cranialD2Mm,
      cranialApMm,
      cranialBpMm,
      headCircumferenceCm,
      cranialTreatmentIndication,
      // HINE
      hineFacialAnimation,
      hineEyeMovements,
      hineVisualFollow,
      hineAuditoryResponse,
      hineSuckSwallow,
      hineHeadPosture,
      hineTrunkPosture,
      hineArmPosture,
      hineHandsPosture,
      hineLegPosture,
      hineLegsSupineProne,
      hineFeetPosture,
      hineMovementsQuantity,
      hineMovementsQuality,
      hineScarfSign,
      hinePassiveShoulderElevation,
      hinePronationSupination,
      hineAdductorsAngle,
      hinePoplitealAngle,
      hineAnkleDorsiflexionAngle,
      hinePullToSit,
      hineVentralSuspension,
      hineArmProtectionReaction,
      hineVerticalSuspension,
      hineLateralTilting,
      hineForwardParachute,
      hineTendonReflexes,
      hineMotorHeadControl,
      hineMotorSitting,
      hineMotorVoluntaryGrasp,
      hineMotorSupineKicking,
      hineMotorRolling,
      hineMotorCrawling,
      hineMotorStanding,
      hineMotorWalking,
      hineBehaviorConscious,
      hineBehaviorEmotional,
      hineBehaviorSocial,
      hineObservations,
      // Arnaiz
      arnaizMovementsFrequent,
      arnaizMovementsQuality,
      arnaizBodyMobility,
      arnaizPostures,
      arnaizToneQuality,
      arnaizSpaceOccupancy,
      arnaizSpaceTrajectory,
      arnaizSpaceLevels,
      arnaizRhythmQuality,
      arnaizActivityDuration,
      arnaizObjectUsage,
      arnaizObjectRelations,
      arnaizCompanionsRelation,
      arnaizAdultRelation,
      arnaizGlobalSynthesis,
      // Critical Communication
      criticalCommData,
      // Da Fonseca
      bpmTonicityExtensibility,
      bpmTonicityPassivity,
      bpmTonicityParatonia,
      bpmTonicityDiadochokinesia,
      bpmTonicitySynkinesia,
      bpmEquilibriumImmobility,
      bpmEquilibriumStatic,
      bpmEquilibriumDynamic,
      bpmLateralityOcular,
      bpmLateralityAuditory,
      bpmLateralityManual,
      bpmLateralityPodal,
      bpmLateralityProfile,
      bpmBodyNotionKinesthetic,
      bpmBodyNotionRightLeft,
      bpmBodyNotionAutoimage,
      bpmBodyNotionGestures,
      bpmSpatialOrientation,
      bpmSpatialOrganization,
      bpmSpatialRhythm,
      bpmGlobalPraxiaOculomanual,
      bpmGlobalPraxiaOculopodal,
      bpmGlobalPraxiaDysmetria,
      bpmGlobalPraxiaDissociation,
      bpmFinePraxiaDynamic,
      bpmFinePraxiaDigital,
      bpmFinePraxiaGraphomotor,
      bpmConclusions,
      // SPM
      spmSocial,
      spmVision,
      spmHearing,
      spmTouch,
      spmTasteSmell,
      spmBodyAwareness,
      spmBalanceMotion,
      spmPlanningIdeas,
      spmApplicationMethod,
      spmRespondentName,
      // CIF Plan
      functionalDiagnosisCIF,
      therapeuticGoalsShortTerm,
      therapeuticGoalsLongTerm,
      treatmentPlan,
      homeAndSchoolRecommendations,
      homeRecommendations,
      schoolRecommendations
    ]);
  }, [
    patientFirstName, patientLastName, patientRut, patientBirthDate, patientGender, patientDiagnosis,
    patientEmergencyName, patientEmergencyPhone,
    ageDecision, followsCommandsDecision, caregiverName, caregiverPhone, schoolOrCenter, educationalLevel, pieSupport,
    householdMembers, consultationReason, problemNoticedWhen, specialistsVisited, previousTreatments, familyExpectations,
    pregnancyHistory, gestationalAgeWeeks, birthWeightGrams, birthLengthCm, birthType, birthPresentation, apgarScore,
    neonatalComplications, feedingType, colic, sleepPattern, headControlMonths, independentSittingMonths, crawlingMonths,
    standingMonths, walkingMonths, firstWords, firstPhrases, languageDifficulties, currentMotorStatus, followsInstructionsText,
    isRestless, playsAloneOrAccompanied, bedtimeRoutine, nightmares, hasFears, strangerReaction, tantrums, appearsSad,
    familyRelationships, schoolRelationships, leisureActivities, familyDiagnoses, pharmacology, cranialD1Mm, cranialD2Mm,
    cranialApMm, cranialBpMm, headCircumferenceCm, cranialTreatmentIndication, hineFacialAnimation, hineEyeMovements,
    hineVisualFollow, hineAuditoryResponse, hineSuckSwallow, hineHeadPosture, hineTrunkPosture, hineArmPosture, hineHandsPosture,
    hineLegPosture, hineLegsSupineProne, hineFeetPosture, hineMovementsQuantity, hineMovementsQuality, hineScarfSign,
    hinePassiveShoulderElevation, hinePronationSupination, hineAdductorsAngle, hinePoplitealAngle, hineAnkleDorsiflexionAngle,
    hinePullToSit, hineVentralSuspension, hineArmProtectionReaction, hineVerticalSuspension, hineLateralTilting,
    hineForwardParachute, hineTendonReflexes, hineMotorHeadControl, hineMotorSitting, hineMotorVoluntaryGrasp,
    hineMotorSupineKicking, hineMotorRolling, hineMotorCrawling, hineMotorStanding, hineMotorWalking, hineBehaviorConscious,
    hineBehaviorEmotional, hineBehaviorSocial, hineObservations, arnaizMovementsFrequent, arnaizMovementsQuality,
    arnaizBodyMobility, arnaizPostures, arnaizToneQuality, arnaizSpaceOccupancy, arnaizSpaceTrajectory, arnaizSpaceLevels,
    arnaizRhythmQuality, arnaizActivityDuration, arnaizObjectUsage, arnaizObjectRelations, arnaizCompanionsRelation,
    arnaizAdultRelation, arnaizGlobalSynthesis,
    criticalCommData, bpmTonicityExtensibility, bpmTonicityPassivity, bpmTonicityParatonia, bpmTonicityDiadochokinesia,
    bpmTonicitySynkinesia, bpmEquilibriumImmobility, bpmEquilibriumStatic, bpmEquilibriumDynamic, bpmLateralityOcular,
    bpmLateralityAuditory, bpmLateralityManual, bpmLateralityPodal, bpmLateralityProfile, bpmBodyNotionKinesthetic,
    bpmBodyNotionRightLeft, bpmBodyNotionAutoimage, bpmBodyNotionGestures, bpmSpatialOrientation, bpmSpatialOrganization,
    bpmSpatialRhythm, bpmGlobalPraxiaOculomanual, bpmGlobalPraxiaOculopodal, bpmGlobalPraxiaDysmetria,
    bpmGlobalPraxiaDissociation, bpmFinePraxiaDynamic, bpmFinePraxiaDigital, bpmFinePraxiaGraphomotor, bpmConclusions,
    spmSocial, spmVision, spmHearing, spmTouch, spmTasteSmell, spmBodyAwareness, spmBalanceMotion, spmPlanningIdeas,
    spmApplicationMethod, spmRespondentName, functionalDiagnosisCIF, therapeuticGoalsShortTerm, therapeuticGoalsLongTerm,
    treatmentPlan, homeAndSchoolRecommendations, homeRecommendations, schoolRecommendations
  ]);

  // Sync snapshot after patient load
  useEffect(() => {
    isSyncingRef.current = true;
    const t = setTimeout(() => {
      lastSavedSnapshotRef.current = getFormSnapshot();
      setHasUnsavedChanges(false);
      isSyncingRef.current = false;
    }, 150);
    return () => clearTimeout(t);
  }, [selectedPatientId, currentPatient?.id, getFormSnapshot]);

  // Dirty detection effect
  useEffect(() => {
    if (isSyncingRef.current) return;
    if (!lastSavedSnapshotRef.current) return;
    const currentSnap = getFormSnapshot();
    if (currentSnap !== lastSavedSnapshotRef.current) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [getFormSnapshot]);

  const handleSaveAll = useCallback(() => {
    if (!currentPatient) return;

    // 1. Update patient primary record
    const updatedPatient: User = {
      ...currentPatient,
      firstName: patientFirstName.trim() || currentPatient.firstName,
      lastName: patientLastName.trim() || currentPatient.lastName || '',
      rut: patientRut.trim() || currentPatient.rut,
      birthDate: patientBirthDate || currentPatient.birthDate,
      gender: patientGender,
      role: 'Padre/Niño',
      diagnosis: patientDiagnosis.trim() || consultationReason.trim() || currentPatient.diagnosis,
      emergencyContact: {
        name: patientEmergencyName.trim() || caregiverName.trim() || currentPatient.emergencyContact?.name || 'Tutor legal',
        relationship: currentPatient.emergencyContact?.relationship || 'Tutor',
        phone: patientEmergencyPhone.trim() || caregiverPhone.trim() || currentPatient.emergencyContact?.phone || ''
      }
    };

    // Keep loadedPatientIdRef locked on current patient so sync effect does not reload
    loadedPatientIdRef.current = currentPatient.id;

    if (onUpdatePatient) {
      onUpdatePatient(updatedPatient);
    }
    clinicalStorage.saveSinglePatient(updatedPatient);
    clinicalStorage.saveSelectedPatientId(currentPatient.id);

    // 2. Save Anamnesis and Evaluations
    saveAnamnesisToState(currentPatient.id);
    saveEvaluationsToState(currentPatient.id);

    // 3. Clear dirty state and record timestamp
    lastSavedSnapshotRef.current = getFormSnapshot();
    setHasUnsavedChanges(false);

    const now = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(now);

    setSavedSuccessAlert(`✓ ¡Información, anamnesis y evaluaciones de ${updatedPatient.firstName} guardadas con éxito en la base de datos permanente (${now})!`);
    setTimeout(() => setSavedSuccessAlert(null), 4000);
  }, [
    currentPatient, 
    patientFirstName, 
    patientLastName, 
    patientRut, 
    patientBirthDate, 
    patientGender, 
    patientDiagnosis, 
    patientEmergencyName, 
    patientEmergencyPhone, 
    consultationReason, 
    caregiverName, 
    caregiverPhone, 
    onUpdatePatient, 
    saveAnamnesisToState, 
    saveEvaluationsToState, 
    getFormSnapshot
  ]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveAll]);

  const handleGenerateAndOpenReport = () => {
    if (!currentPatient) return;
    saveAnamnesisToState();
    saveEvaluationsToState();
    lastSavedSnapshotRef.current = getFormSnapshot();
    setHasUnsavedChanges(false);

    const report: ComprehensiveReport = {
      id: `comprep_${currentPatient.id}_${Date.now()}`,
      patientId: currentPatient.id,
      patientName: `${currentPatient.firstName} ${currentPatient.lastName}`,
      patientRut: currentPatient.rut,
      patientBirthDate: currentPatient.birthDate || 'No registrada',
      medicalRecordNumber: currentPatient.medicalRecordNumber || 'NN-01',
      professionalName: clinicianName,
      professionalSpecialty: clinicianSpecialty,
      professionalRegistry: clinicianRegistry,
      institution: clinicianInstitution,
      dateGenerated: new Date().toISOString().slice(0, 10),
      anamnesis: {
        id: `anam_${currentPatient.id}`,
        patientId: currentPatient.id,
        evaluatorName: clinicianName,
        evaluationDate: new Date().toISOString().slice(0, 10),
        ageCategory: ageDecision === 'menor_2_anos' ? 'bebe_hasta_18_meses' : 'mayor_2_anos',
        caregiverName,
        caregiverPhone,
        schoolOrCenter,
        educationalLevel,
        pieSupport,
        householdMembers,
        consultationReason,
        problemNoticedWhen,
        specialistsVisited,
        previousTreatments,
        familyExpectations,
        pregnancyHistory,
        gestationalAgeWeeks,
        birthWeightGrams,
        birthLengthCm,
        birthType,
        birthPresentation,
        apgarScore,
        neonatalComplications,
        feedingType,
        colic,
        sleepPattern,
        headControlMonths,
        independentSittingMonths,
        crawlingMonths,
        standingMonths,
        walkingMonths,
        firstWords,
        firstPhrases,
        languageDifficulties,
        currentMotorStatus,
        followsInstructions: followsInstructionsText,
        isRestless,
        playsAloneOrAccompanied,
        bedtimeRoutine,
        nightmares,
        hasFears,
        strangerReaction,
        tantrums,
        appearsSad,
        familyRelationships,
        schoolRelationships,
        leisureActivities,
        familyDiagnoses,
        medicalDiagnoses: consultationReason || currentPatient.diagnosis || '',
        surgeries: 'Ninguna',
        pharmacology,
        assistiveDevices: 'Ninguna',
        allergicConditions: 'Sin alergias',
        cranialMeasurements: ageDecision === 'menor_2_anos' ? {
          d1Mm: cranialD1Mm,
          d2Mm: cranialD2Mm,
          differenceMm: cranialDifference,
          cvaiPercent: cranialCvai,
          plagiocephalySeverity,
          apMm: cranialApMm,
          bpMm: cranialBpMm,
          cephalicIndex,
          brachycephalyClassification,
          headCircumferenceCm,
          treatmentIndication: cranialTreatmentIndication
        } : undefined
      },
      evaluations: {
        id: `eval_${currentPatient.id}`,
        patientId: currentPatient.id,
        evaluationDate: new Date().toISOString().slice(0, 10),
        evaluatorName: clinicianName,
        gmfcsLevel: 'Nivel I',
        macsLevel: 'Nivel I',
        eedpOrTepsiScore: 'Evaluación completada',
        ashworthScore: '0',
        tonePattern: 'Normotonía',
        deepTendonReflexes: 'Normales ++/++++',
        hipFlexionExt: '120° / 0°',
        kneeFlexionExt: '130° / 0°',
        ankleDorsiflexion: '15° bilateral',
        shoulderMobility: '> 165° bilateral',
        headAndTrunkControl: 'Conservado',
        rightingReactions: 'Presentes',
        protectiveResponses: 'Conservadas',
        balanceSittingAndStanding: 'Funcional',
        transferAbility: 'Autónomo',
        gaitObservation: currentMotorStatus || 'Marcha activa',
        sensoryProfile: 'Evaluado mediante SPM-2',
        patientAgeCategory: ageDecision,
        followsCommands: followsCommandsDecision,
        hineExam: ageDecision === 'menor_2_anos' ? {
          facialAnimation: hineFacialAnimation,
          eyeMovements: hineEyeMovements,
          visualFollow: hineVisualFollow,
          auditoryResponse: hineAuditoryResponse,
          suckSwallow: hineSuckSwallow,
          cranialNervesSubtotal: hineCranialSubtotal,

          headPosture: hineHeadPosture,
          trunkPosture: hineTrunkPosture,
          armPosture: hineArmPosture,
          handsPosture: hineHandsPosture,
          legPosture: hineLegPosture,
          legsSupineProne: hineLegsSupineProne,
          feetPosture: hineFeetPosture,
          postureSubtotal: hinePostureSubtotal,

          movementsQuantity: hineMovementsQuantity,
          movementsQuality: hineMovementsQuality,
          movementsSubtotal: hineMovementsSubtotal,

          scarfSign: hineScarfSign,
          passiveShoulderElevation: hinePassiveShoulderElevation,
          pronationSupination: hinePronationSupination,
          adductorsAngle: hineAdductorsAngle,
          poplitealAngle: hinePoplitealAngle,
          ankleDorsiflexionAngle: hineAnkleDorsiflexionAngle,
          pullToSit: hinePullToSit,
          ventralSuspension: hineVentralSuspension,
          toneSubtotal: hineToneSubtotal,

          armProtectionReaction: hineArmProtectionReaction,
          verticalSuspension: hineVerticalSuspension,
          lateralTilting: hineLateralTilting,
          forwardParachute: hineForwardParachute,
          tendonReflexes: hineTendonReflexes,
          reflexesSubtotal: hineReflexesSubtotal,

          totalScore: hineTotalScore,
          riskLevel: hineRiskLevel,

          motorMilestones: {
            headControl: hineMotorHeadControl,
            sitting: hineMotorSitting,
            voluntaryGrasp: hineMotorVoluntaryGrasp,
            supineKicking: hineMotorSupineKicking,
            rolling: hineMotorRolling,
            crawling: hineMotorCrawling,
            standing: hineMotorStanding,
            walking: hineMotorWalking,
          },

          behavior: {
            consciousState: hineBehaviorConscious,
            emotionalState: hineBehaviorEmotional,
            socialOrientation: hineBehaviorSocial,
          },

          clinicalObservations: hineObservations
        } : undefined,
        psychomotorObservation: (ageDecision === 'mayor_2_anos' && !followsCommandsDecision) ? {
          movementsFrequent: arnaizMovementsFrequent,
          movementsQuality: arnaizMovementsQuality,
          bodyMobilityLevel: arnaizBodyMobility,
          posturesFrequent: arnaizPostures,
          toneQuality: arnaizToneQuality,
          spaceOccupancy: arnaizSpaceOccupancy,
          spaceTrajectory: arnaizSpaceTrajectory,
          spaceLevels: arnaizSpaceLevels,
          rhythmQuality: arnaizRhythmQuality,
          activityDuration: arnaizActivityDuration,
          objectUsage: arnaizObjectUsage,
          objectsRelationWithOthers: arnaizObjectRelations,
          companionsRelation: arnaizCompanionsRelation,
          adultRelation: arnaizAdultRelation,
          globalSynthesis: arnaizGlobalSynthesis
        } : undefined,
        criticalCommunication: (ageDecision === 'mayor_2_anos' && !followsCommandsDecision) ? criticalCommData : undefined,
        daFonsecaBpm: (ageDecision === 'mayor_2_anos' && followsCommandsDecision) ? {
          tonicityExtensibility: bpmTonicityExtensibility,
          tonicityPassivity: bpmTonicityPassivity,
          tonicityParatonia: bpmTonicityParatonia,
          tonicityDiadochokinesia: bpmTonicityDiadochokinesia,
          tonicitySynkinesia: bpmTonicitySynkinesia,
          tonicityScore: bpmTonicityScore,
          equilibriumImmobility: bpmEquilibriumImmobility,
          equilibriumStatic: bpmEquilibriumStatic,
          equilibriumDynamic: bpmEquilibriumDynamic,
          equilibriumScore: bpmEquilibriumScore,
          lateralityOcular: bpmLateralityOcular,
          lateralityAuditory: bpmLateralityAuditory,
          lateralityManual: bpmLateralityManual,
          lateralityPodal: bpmLateralityPodal,
          lateralityProfile: bpmLateralityProfile,
          lateralityScore: bpmLateralityScore,
          bodyNotionKinesthetic: bpmBodyNotionKinesthetic,
          bodyNotionRightLeft: bpmBodyNotionRightLeft,
          bodyNotionAutoimage: bpmBodyNotionAutoimage,
          bodyNotionGesturesImitation: bpmBodyNotionGestures,
          bodyNotionScore: bpmBodyNotionScore,
          spatialOrientation: bpmSpatialOrientation,
          spatialOrganization: bpmSpatialOrganization,
          spatialRhythmStructure: bpmSpatialRhythm,
          spatialTemporalScore: bpmSpatialTemporalScore,
          globalPraxiaOculomanual: bpmGlobalPraxiaOculomanual,
          globalPraxiaOculopodal: bpmGlobalPraxiaOculopodal,
          globalPraxiaDysmetria: bpmGlobalPraxiaDysmetria,
          globalPraxiaDissociation: bpmGlobalPraxiaDissociation,
          globalPraxiaScore: bpmGlobalPraxiaScore,
          finePraxiaDynamicCoordination: bpmFinePraxiaDynamic,
          finePraxiaDigitalDrumming: bpmFinePraxiaDigital,
          finePraxiaGraphomotorSpeed: bpmFinePraxiaGraphomotor,
          finePraxiaScore: bpmFinePraxiaScore,
          totalScore: bpmTotal,
          profileResult: bpmProfileResult,
          conclusions: bpmConclusions
        } : undefined,
        spmSensoryMeasure: {
          socialParticipationScore: spmSocial,
          socialParticipationRange: getSpmRange(spmSocial),
          visionScore: spmVision,
          visionRange: getSpmRange(spmVision),
          hearingScore: spmHearing,
          hearingRange: getSpmRange(spmHearing),
          touchScore: spmTouch,
          touchRange: getSpmRange(spmTouch),
          tasteSmellScore: spmTasteSmell,
          tasteSmellRange: getSpmRange(spmTasteSmell),
          bodyAwarenessScore: spmBodyAwareness,
          bodyAwarenessRange: getSpmRange(spmBodyAwareness),
          balanceMotionScore: spmBalanceMotion,
          balanceMotionRange: getSpmRange(spmBalanceMotion),
          planningIdeasScore: spmPlanningIdeas,
          planningIdeasRange: getSpmRange(spmPlanningIdeas),
          totalSensoryScore: spmTotal,
          totalSensoryRange: spmTotal < 125 ? 'Típico (40-59)' : spmTotal <= 155 ? 'Dificultades Moderadas (60-69)' : 'Disfunción Severa (70-80)',
          applicationMethod: spmApplicationMethod,
          respondentName: spmRespondentName
        },
        cifCodes: selectedCifCodes,
        functionalDiagnosisCIF,
        therapeuticGoalsShortTerm,
        therapeuticGoalsLongTerm,
        treatmentPlan,
        homeRecommendations,
        schoolRecommendations,
        homeAndSchoolRecommendations: homeAndSchoolRecommendations || [homeRecommendations, schoolRecommendations].filter(Boolean).join('\n\n')
      },
      clinicalSummary: functionalDiagnosisCIF || `Evaluación clínica y neuropsicomotriz completada satisfactoriamente.`,
      planAndFollowUp: treatmentPlan || 'Continuar plan de neurorehabilitación kinésica.'
    };

    onGenerateReport(report);
  };

  const handleApplySPMOnlineResults = (spmData: SensoryProcessingMeasureSPM2) => {
    if (spmData.socialParticipationScore) setSpmSocial(spmData.socialParticipationScore);
    if (spmData.visionScore) setSpmVision(spmData.visionScore);
    if (spmData.hearingScore) setSpmHearing(spmData.hearingScore);
    if (spmData.touchScore) setSpmTouch(spmData.touchScore);
    if (spmData.tasteSmellScore) setSpmTasteSmell(spmData.tasteSmellScore);
    if (spmData.bodyAwarenessScore) setSpmBodyAwareness(spmData.bodyAwarenessScore);
    if (spmData.balanceMotionScore) setSpmBalanceMotion(spmData.balanceMotionScore);
    if (spmData.planningIdeasScore) setSpmPlanningIdeas(spmData.planningIdeasScore);
    if (spmData.applicationMethod) setSpmApplicationMethod(spmData.applicationMethod);
    if (spmData.respondentName) setSpmRespondentName(spmData.respondentName);

    setSavedSuccessAlert('¡Respuestas del Cuestionario SPM-2 integradas a la evaluación!');
    setTimeout(() => setSavedSuccessAlert(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Banner */}
      {savedSuccessAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <span className="flex items-center gap-2 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedSuccessAlert}</span>
          </span>
          <button onClick={() => setSavedSuccessAlert(null)} className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Clean database starting from 0 notification if no patients exist */}
      {patients.length === 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-900 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <strong className="block text-sm">Comenzar desde 0: Registra tu primer paciente</strong>
              <span className="text-blue-700">Completa los datos básicos a continuación para crear la ficha e iniciar su evaluación completa.</span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg text-[11px] shrink-0">
            Paso 1: Nuevo Paciente
          </span>
        </div>
      )}

      {/* Top Patient Selector & Quick Actions Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 shrink-0">
            Paciente a Evaluar:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setIsCreatingNew(false);
              onSelectPatient(e.target.value);
            }}
            className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-hidden flex-1 md:w-64 cursor-pointer"
          >
            {patients.length === 0 ? (
              <option value="">(Sin pacientes registrados - Crear primero)</option>
            ) : (
              patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} — RUT: {p.rut}
                </option>
              ))
            )}
          </select>

          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer ${
              isCreatingNew 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isCreatingNew ? 'Ver Ficha Seleccionada' : '+ Registrar Nuevo Paciente'}</span>
          </button>
        </div>

        {/* Action Buttons: Save form, Clean form & Share SPM Link */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleSaveAll}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400 animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
            title="Guarda inmediatamente todos los cambios en la base de datos permanente (Ctrl + S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{hasUnsavedChanges ? '💾 Guardar Cambios (*)' : 'Guardar Ficha'}</span>
          </button>

          <button
            type="button"
            onClick={handleClearForm}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Limpia todos los campos para ingresar un paciente desde cero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Formulario en Blanco</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSPMLinkModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            title="Genera un enlace web para enviar el cuestionario sensorial a la familia o al colegio"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cuestionario SPM-2 (Generar Link Padres)</span>
          </button>
        </div>

      </div>

      {/* Sub-mode: CREATE NEW PATIENT FORM (if toggled) */}
      {isCreatingNew && (
        <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-xs space-y-4 animate-in slide-in-from-top-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Registrar Nuevo Paciente para Ficha Clínica</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingresa los datos personales del niño(a) para comenzar su Anamnesis y Evaluación
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateNewPatientSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nombre</label>
              <input
                type="text"
                required
                value={newFirstName}
                onChange={e => setNewFirstName(e.target.value)}
                placeholder="Nombre del niño(a)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Apellidos</label>
              <input
                type="text"
                value={newLastName}
                onChange={e => setNewLastName(e.target.value)}
                placeholder="Apellidos"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">R.U.T.</label>
              <input
                type="text"
                value={newRut}
                onChange={e => setNewRut(e.target.value)}
                placeholder="26.xxx.xxx-x"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                value={newBirthDate}
                onChange={e => setNewBirthDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Género</label>
              <select
                value={newGender}
                onChange={e => setNewGender(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Grupo de Edad Inicial</label>
              <select
                value={ageDecision}
                onChange={e => setAgeDecision(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
              >
                <option value="mayor_2_anos">Mayor o igual a 2 años</option>
                <option value="menor_2_anos">Menor de 2 años (Lactante)</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Registrar Paciente y Abrir Evaluación
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÁRBOL DE DECISIÓN CLÍNICA INTELIGENTE (PREGUNTAS DIAGNÓSTICAS)             */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-300 block">
              Algoritmo de Decisión Clínica
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
              Protocolo de Evaluación Adaptado al Paciente
            </h2>
          </div>
          <div className="text-xs text-blue-200">
            Ficha: <strong className="text-white">{currentPatient?.firstName} {currentPatient?.lastName}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Pregunta 1: Edad */}
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-2">
            <label className="text-xs font-bold text-sky-200 block">
              1. ¿Qué edad tiene el niño(a)?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAgeDecision('menor_2_anos');
                  if (activeSection === 'arnaiz' || activeSection === 'da_fonseca') {
                    setActiveSection('hine');
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  ageDecision === 'menor_2_anos'
                    ? 'bg-sky-400 text-slate-950 shadow-md ring-2 ring-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                👶 Menor de 2 años
              </button>

              <button
                type="button"
                onClick={() => {
                  setAgeDecision('mayor_2_anos');
                  if (activeSection === 'hine' || activeSection === 'cranial') {
                    setActiveSection(followsCommandsDecision ? 'da_fonseca' : 'arnaiz');
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  ageDecision === 'mayor_2_anos'
                    ? 'bg-sky-400 text-slate-950 shadow-md ring-2 ring-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🧒 Mayor de 2 años
              </button>
            </div>
          </div>

          {/* Pregunta 2: Si es mayor de 2 años -> ¿Recibe órdenes? */}
          {ageDecision === 'mayor_2_anos' ? (
            <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-2 animate-in fade-in">
              <label className="text-xs font-bold text-sky-200 block">
                2. ¿El niño recibe / sigue órdenes estructuradas?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFollowsCommandsDecision(false);
                    if (activeSection === 'da_fonseca') setActiveSection('arnaiz');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    !followsCommandsDecision
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  ❌ NO recibe órdenes
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFollowsCommandsDecision(true);
                    if (activeSection === 'arnaiz') setActiveSection('da_fonseca');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    followsCommandsDecision
                      ? 'bg-emerald-400 text-slate-950 shadow-md ring-2 ring-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  ✔️ SÍ recibe órdenes
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-sky-500/20 rounded-xl p-3.5 border border-sky-400/30 flex items-center gap-3">
              <Baby className="w-8 h-8 text-sky-300 shrink-0" />
              <div className="text-xs">
                <strong className="text-white block font-bold">Protocolo Lactante Activado</strong>
                <span className="text-sky-200 text-[11px]">
                  Se aplica el <strong>Examen de Hammersmith (HINE)</strong> y protocolo de asimetrías craneales posicionales.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Indicador de Protocolo asignado */}
        <div className="pt-2 flex items-center gap-2 text-xs text-sky-100 font-semibold bg-white/5 px-3 py-2 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {ageDecision === 'menor_2_anos' && (
              <>Evaluación indicada: <strong>Examen Neurológico Infantil de Hammersmith (HINE)</strong> + Protocolo de Asimetrías Craneales.</>
            )}
            {ageDecision === 'mayor_2_anos' && !followsCommandsDecision && (
              <>Evaluación indicada: <strong>Pauta de Observación de Parámetros Psicomotores de Pilar Arnaiz</strong> (Sesión lúdica libre) + <strong>Lista de Control de Habilidades de Comunicación Críticas y Funcionales</strong>.</>
            )}
            {ageDecision === 'mayor_2_anos' && followsCommandsDecision && (
              <>Evaluación indicada: <strong>Batería Psicomotora (BPM) de Vítor da Fonseca</strong> (Evaluación motriz estandarizada mediante consignas estructuradas).</>
            )}
          </span>
        </div>

      </div>

      {/* Main Clinical Evaluation Form Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Navigation Bar between Anamnesis & Applied Clinical Tests */}
        <div className="border-b border-slate-200 bg-slate-50/70 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-1.5">
            
            {/* 1. Anamnesis */}
            <button
              onClick={() => setActiveSection('anamnesis')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSection === 'anamnesis'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              📋 Anamnesis Pediátrica
            </button>

            {/* Si es menor de 2 años -> HINE y Asimetrías Craneales */}
            {ageDecision === 'menor_2_anos' && (
              <>
                <button
                  onClick={() => setActiveSection('hine')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSection === 'hine'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Examen de Hammersmith (HINE)</span>
                </button>

                <button
                  onClick={() => setActiveSection('cranial')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSection === 'cranial'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Asimetrías Craneales (CVAI)</span>
                </button>
              </>
            )}

            {/* Si es mayor de 2 años y NO recibe órdenes -> Pilar Arnaiz y Comunicación Crítica */}
            {ageDecision === 'mayor_2_anos' && !followsCommandsDecision && (
              <>
                <button
                  onClick={() => setActiveSection('arnaiz')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSection === 'arnaiz'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Pauta de Pilar Arnaiz (Juego Libre)</span>
                </button>

                <button
                  onClick={() => setActiveSection('critical_communication')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeSection === 'critical_communication'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-orange-100 text-orange-950 hover:bg-orange-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-orange-700" />
                  <span>Comunicación Crítica</span>
                </button>
              </>
            )}

            {/* Si es mayor de 2 años y SÍ recibe órdenes -> Batería Da Fonseca */}
            {ageDecision === 'mayor_2_anos' && followsCommandsDecision && (
              <button
                onClick={() => setActiveSection('da_fonseca')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'da_fonseca'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Batería Da Fonseca (BPM)</span>
              </button>
            )}

            {/* SPM-2 Perfil Sensorial */}
            <button
              onClick={() => setActiveSection('spm2')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSection === 'spm2'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SPM-2 Sensorial</span>
            </button>

            {/* Diagnóstico CIF y Plan */}
            <button
              onClick={() => setActiveSection('cif_plan')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSection === 'cif_plan'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              🩺 Diagnóstico CIF & Plan
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>Guardar</span>
            </button>

            <button
              onClick={handleGenerateAndOpenReport}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generar Informe Consolidado</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

        </div>

        {/* Section Body */}
        <div className="p-6 text-xs space-y-6">
          
          {/* ========================================================================= */}
          {/* SUB-SECCIÓN 1: ANAMNESIS PEDIÁTRICA GENERAL                               */}
          {/* ========================================================================= */}
          {activeSection === 'anamnesis' && (
            <div className="space-y-6">
              
              {/* 1. Datos Personales y Familiares */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
                  1. Datos Personales y Convivientes en el Hogar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre del Apoderado / Tutor</label>
                    <input
                      type="text"
                      value={caregiverName}
                      onChange={e => setCaregiverName(e.target.value)}
                      placeholder="Nombre del apoderado"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Teléfono de Contacto</label>
                    <input
                      type="text"
                      value={caregiverPhone}
                      onChange={e => setCaregiverPhone(e.target.value)}
                      placeholder="+56 9 xxxx xxxx"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Colegio / Jardín / Curso</label>
                    <input
                      type="text"
                      value={schoolOrCenter}
                      onChange={e => setSchoolOrCenter(e.target.value)}
                      placeholder="Establecimiento educacional"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">Personas que viven en el hogar (parentesco, edad y profesión)</label>
                    <input
                      type="text"
                      value={householdMembers}
                      onChange={e => setHouseholdMembers(e.target.value)}
                      placeholder="Personas que conviven en el hogar, parentesco y profesiones"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Motivo de Consulta y Expectativas */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
                  2. Motivo de Consulta y Evolución
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Motivo Principal de Consulta</label>
                    <textarea
                      rows={2}
                      value={consultationReason}
                      onChange={e => setConsultationReason(e.target.value)}
                      placeholder="Describa el motivo de ingreso clínico..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">¿Cuándo lo empezaron a notar?</label>
                    <input
                      type="text"
                      value={problemNoticedWhen}
                      onChange={e => setProblemNoticedWhen(e.target.value)}
                      placeholder="Edad o momento de inicio"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Especialistas a los que han acudido</label>
                    <input
                      type="text"
                      value={specialistsVisited}
                      onChange={e => setSpecialistsVisited(e.target.value)}
                      placeholder="Pediatra, neurólogo, fonoaudiólogo..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tratamientos previos</label>
                    <input
                      type="text"
                      value={previousTreatments}
                      onChange={e => setPreviousTreatments(e.target.value)}
                      placeholder="Tratamientos kinésicos o terapias anteriores"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Expectativas de la Familia</label>
                    <input
                      type="text"
                      value={familyExpectations}
                      onChange={e => setFamilyExpectations(e.target.value)}
                      placeholder="Metas deseadas por la familia"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Embarazo, Parto y Perinatal */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
                  3. Antecedentes del Embarazo y Parto
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">Historia del embarazo (pérdidas previas, reposo, complicaciones)</label>
                    <textarea
                      rows={2}
                      value={pregnancyHistory}
                      onChange={e => setPregnancyHistory(e.target.value)}
                      placeholder="Detalles de la gestación..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Edad Gestacional / Semanas</label>
                    <input
                      type="text"
                      value={gestationalAgeWeeks}
                      onChange={e => setGestationalAgeWeeks(e.target.value)}
                      placeholder="39 semanas"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tipo de Parto</label>
                    <input
                      type="text"
                      value={birthType}
                      onChange={e => setBirthType(e.target.value)}
                      placeholder="Cesárea / Parto normal"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Presentación al nacer</label>
                    <input
                      type="text"
                      value={birthPresentation}
                      onChange={e => setBirthPresentation(e.target.value)}
                      placeholder="Cefálica / Podálica"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Peso al nacer (grs)</label>
                    <input
                      type="text"
                      value={birthWeightGrams}
                      onChange={e => setBirthWeightGrams(e.target.value)}
                      placeholder="Peso en gramos"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Talla al nacer (cm)</label>
                    <input
                      type="text"
                      value={birthLengthCm}
                      onChange={e => setBirthLengthCm(e.target.value)}
                      placeholder="Talla en centímetros"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lactancia y Alimentación</label>
                    <input
                      type="text"
                      value={feedingType}
                      onChange={e => setFeedingType(e.target.value)}
                      placeholder="Materna, mixta o fórmula"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">Patrón de Sueño (horas nocturnas, despertares, siestas)</label>
                    <input
                      type="text"
                      value={sleepPattern}
                      onChange={e => setSleepPattern(e.target.value)}
                      placeholder="Horas continuas de noche, siestas diurnas..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Desarrollo Motor y Lenguaje */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
                  4. Hitos del Desarrollo Motor y del Lenguaje
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Control de la Cabeza</label>
                    <input
                      type="text"
                      value={headControlMonths}
                      onChange={e => setHeadControlMonths(e.target.value)}
                      placeholder="Hito en meses"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Posición Sentada</label>
                    <input
                      type="text"
                      value={independentSittingMonths}
                      onChange={e => setIndependentSittingMonths(e.target.value)}
                      placeholder="Hito en meses"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gateo</label>
                    <input
                      type="text"
                      value={crawlingMonths}
                      onChange={e => setCrawlingMonths(e.target.value)}
                      placeholder="Poco / consolidado a los x meses"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Posición de Pie</label>
                    <input
                      type="text"
                      value={standingMonths}
                      onChange={e => setStandingMonths(e.target.value)}
                      placeholder="Hito en meses con apoyo"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Marcha Independiente</label>
                    <input
                      type="text"
                      value={walkingMonths}
                      onChange={e => setWalkingMonths(e.target.value)}
                      placeholder="Hito en meses o años"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Primeras Palabras</label>
                    <input
                      type="text"
                      value={firstWords}
                      onChange={e => setFirstWords(e.target.value)}
                      placeholder="Vocalizaciones, balbuceo y palabras"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Conducta, Emocional, Antecedentes Familiares y Medicación */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
                  5. Conductas Emocionales, Antecedentes Familiares y Medicación
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">¿Sigue instrucciones?</label>
                    <input
                      type="text"
                      value={followsInstructionsText}
                      onChange={e => setFollowsInstructionsText(e.target.value)}
                      placeholder="Poco / Regular / Sí"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">¿Se muestra inquieto?</label>
                    <input
                      type="text"
                      value={isRestless}
                      onChange={e => setIsRestless(e.target.value)}
                      placeholder="Sí / A veces / No"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">¿Se entretiene solo o necesita compañía?</label>
                    <input
                      type="text"
                      value={playsAloneOrAccompanied}
                      onChange={e => setPlaysAloneOrAccompanied(e.target.value)}
                      placeholder="Requiere estar acompañado..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">¿Rabietas o enfado?</label>
                    <input
                      type="text"
                      value={tantrums}
                      onChange={e => setTantrums(e.target.value)}
                      placeholder="Frecuentes / Ocasionales"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Antecedentes Familiares (TEA, TDAH, etc.)</label>
                    <input
                      type="text"
                      value={familyDiagnoses}
                      onChange={e => setFamilyDiagnoses(e.target.value)}
                      placeholder="Condiciones diagnósticas en la familia"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">Medicamentos y Suplementos</label>
                    <input
                      type="text"
                      value={pharmacology}
                      onChange={e => setPharmacology(e.target.value)}
                      placeholder="Fármacos actuales, dosis, horarios y suplementación"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Barra de Guardado y Continuación Rápida para Anamnesis Pediátrica */}
              <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    1/3
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Anamnesis Pediátrica de {currentPatient ? `${currentPatient.firstName} ${currentPatient.lastName}` : 'Paciente'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Datos personales, perinatales, hitos motores y antecedentes clínicos
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAll}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:border-slate-400"
                  >
                    <Save className="w-3.5 h-3.5 text-blue-600" />
                    <span>Guardar Anamnesis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveAll();
                      if (ageDecision === 'menor_2_anos') {
                        setActiveSection('hine');
                      } else if (followsCommandsDecision) {
                        setActiveSection('da_fonseca');
                      } else {
                        setActiveSection('arnaiz');
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md"
                  >
                    <span>Guardar y Continuar a Pruebas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECCIÓN 2: EXAMEN DE HAMMERSMITH (HINE) (< 2 años) - VERSIÓN OFICIAL  */}
          {/* ========================================================================= */}
          {activeSection === 'hine' && ageDecision === 'menor_2_anos' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-sky-700 text-white px-2 py-0.5 rounded-full">
                      HINE Oficial (v08.02.19)
                    </span>
                    <span className="text-[10px] font-bold text-sky-900 bg-white px-2 py-0.5 rounded-full border border-sky-300">
                      Optimalidad Máx. 78 Pts
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-sky-950 mt-1 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-600" />
                    <span>Examen Neurológico Infantil de Hammersmith (HINE)</span>
                  </h3>
                  <p className="text-xs text-sky-800 mt-0.5">
                    Evaluación neurológica estandarizada de 0 a 24 meses. Puntajes de 0 a 3 por ítem (si no es óptima pero no mala para 1, otorgue 2).
                  </p>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border border-sky-200 text-right shrink-0 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Puntaje Global HINE</span>
                  <div className="text-xl font-black text-sky-700 font-mono">
                    {hineTotalScore} <span className="text-xs font-normal text-slate-400">/ 78 pts</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    hineRiskLevel.includes('Óptimo') ? 'bg-emerald-100 text-emerald-800' :
                    hineRiskLevel.includes('Leve') ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {hineRiskLevel}
                  </span>
                </div>
              </div>

              {/* RESUMEN DE PUNTUACIONES POR SECCIÓN */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Nervios Craneales</span>
                  <strong className="text-slate-900 font-mono">{hineCranialSubtotal}/15</strong>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Postura</span>
                  <strong className="text-slate-900 font-mono">{hinePostureSubtotal}/18</strong>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Movimientos</span>
                  <strong className="text-slate-900 font-mono">{hineMovementsSubtotal}/6</strong>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Tono Muscular</span>
                  <strong className="text-slate-900 font-mono">{hineToneSubtotal}/24</strong>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block">Reflejos y Reacciones</span>
                  <strong className="text-slate-900 font-mono">{hineReflexesSubtotal}/15</strong>
                </div>
              </div>

              {/* 1. EVALUACIÓN DE LA FUNCIÓN DE LOS NERVIOS CRANEALES (Máx 15) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-black">1</span>
                    <span>1. Función de los Nervios Craneales (Máx. 15 puntos)</span>
                  </h4>
                  <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                    Subtotal: {hineCranialSubtotal} / 15
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Apariencia facial</label>
                    <select
                      value={hineFacialAnimation}
                      onChange={e => setHineFacialAnimation(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Sonríe o reacciona cerrando ojos y muecas</option>
                      <option value={2}>2 - Respuesta intermedia / parcial</option>
                      <option value={1}>1 - Cierra ojos no fuertemente, pobre expresión</option>
                      <option value={0}>0 - Indiferente, no reacciona a estimulación</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Movimientos oculares</label>
                    <select
                      value={hineEyeMovements}
                      onChange={e => setHineEyeMovements(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Conjugado normal</option>
                      <option value={2}>2 - Intermedio / leve desviación</option>
                      <option value={1}>1 - Intermitente desviación u oscilación</option>
                      <option value={0}>0 - Continuo desvío o movimientos anormales</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Respuesta visual (fijar y seguir)</label>
                    <select
                      value={hineVisualFollow}
                      onChange={e => setHineVisualFollow(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Sigue al objetivo en un arco completo</option>
                      <option value={2}>2 - Sigue parcialmente</option>
                      <option value={1}>1 - Arco incompleto o asimétrico</option>
                      <option value={0}>0 - No sigue el objetivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Respuesta auditiva (sonajero)</label>
                    <select
                      value={hineAuditoryResponse}
                      onChange={e => setHineAuditoryResponse(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Reacciona a estimulación de ambos lados</option>
                      <option value={2}>2 - Respuesta parcial o levemente retardada</option>
                      <option value={1}>1 - Reacción dudosa o asimétrica</option>
                      <option value={0}>0 - Sin respuesta</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Chupa / tragado (succión y deglución)</label>
                    <select
                      value={hineSuckSwallow}
                      onChange={e => setHineSuckSwallow(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Buen chupete y deglución (coordinado)</option>
                      <option value={2}>2 - Dificultad leve / fatiga alimentaria ocasional</option>
                      <option value={1}>1 - Mal chupete y/o tragar, tos, babeo excesivo</option>
                      <option value={0}>0 - Sin reflejo de succión / no traga / sonda</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. EVALUACIÓN DE LA POSTURA (Máx 18) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-black">2</span>
                    <span>2. Postura (Brazos y manos por separado, Piernas y Pies) (Máx. 18 puntos)</span>
                  </h4>
                  <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                    Subtotal: {hinePostureSubtotal} / 18
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cabeza en sentado</label>
                    <select
                      value={hineHeadPosture}
                      onChange={e => setHineHeadPosture(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Recta; en la línea media</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Ligera desviación a un lado/atrás/adelante</option>
                      <option value={0}>0 - Notablemente hacia un lado o caída fija</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tronco en sentado</label>
                    <select
                      value={hineTrunkPosture}
                      onChange={e => setHineTrunkPosture(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Recto y estable</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Ligeramente curvado / doblado</option>
                      <option value={0}>0 - Muy redondeado / bamboleante / flexionado</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Brazos en reposo (separado de manos)</label>
                    <select
                      value={hineArmPosture}
                      onChange={e => setHineArmPosture(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Posición neutral central o recto leve flexionado</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Ligera rotación interna o externa / distonía leve</option>
                      <option value={0}>0 - Marcada rotación interna/externa o hemipléjica</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Manos (separado de brazos)</label>
                    <select
                      value={hineHandsPosture}
                      onChange={e => setHineHandsPosture(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Manos abiertas libres</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Intermitente pulgar aducido o empuñado</option>
                      <option value={0}>0 - Persistente pulgar aducido / puño cortical</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Piernas en sentado</label>
                    <select
                      value={hineLegPosture}
                      onChange={e => setHineLegPosture(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Espalda recta y piernas rectas/semiflexionadas</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Espalda recta con rodillas flexionadas 15-20°</option>
                      <option value={0}>0 - Incapaz de sentarse erguido sin flexión marcada</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Piernas en supino y pie</label>
                    <select
                      value={hineLegsSupineProne}
                      onChange={e => setHineLegsSupineProne(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Posición neutra recta o ligeramente flexionadas</option>
                      <option value={2}>2 - Ligera rotación interna o externa</option>
                      <option value={1}>1 - Rotación en caderas</option>
                      <option value={0}>0 - Marcada rotación, flexión fija o contractura</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Pies en supino y bipedestación</label>
                    <select
                      value={hineFeetPosture}
                      onChange={e => setHineFeetPosture(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Central en neutro, dedos rectos (flex/ext)</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Leve rotación o tendencia intermitente puntillas</option>
                      <option value={0}>0 - Marcada rotación o persistente de puntillas / garra</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. EVALUACIÓN DE LOS MOVIMIENTOS (Máx 6) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-black">3</span>
                    <span>3. Evaluación de los Movimientos Espontáneos (Máx. 6 puntos)</span>
                  </h4>
                  <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                    Subtotal: {hineMovementsSubtotal} / 6
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cantidad de movimiento (vigilar en supino)</label>
                    <select
                      value={hineMovementsQuantity}
                      onChange={e => setHineMovementsQuantity(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Normal (activo, variado y continuo)</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Excesivo o marcadamente lento</option>
                      <option value={0}>0 - Mínimo o ninguno (pobreza motriz)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Calidad del movimiento espontáneo voluntario</label>
                    <select
                      value={hineMovementsQuality}
                      onChange={e => setHineMovementsQuality(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Libre, alternándose, suave y liso</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Temblores leves o sobresaltos</option>
                      <option value={0}>0 - Aprisionado/sincrónico, espasmos extensores, atetósico, atáxico, distónico</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. EVALUACIÓN DEL TONO MUSCULAR (Máx 24) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-black">4</span>
                    <span>4. Evaluación del Tono Muscular (Máx. 24 puntos)</span>
                  </h4>
                  <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                    Subtotal: {hineToneSubtotal} / 24
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Signo del chal (bufanda)</label>
                    <select
                      value={hineScarfSign}
                      onChange={e => setHineScarfSign(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Rango normal (codo entre línea media y pezón opuesto)</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Resistencia difícil / pasa levemente</option>
                      <option value={0}>0 - Resistencia rígida o pasa completamente sin resistencia</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Movimiento de hombro pasivo (elevación)</label>
                    <select
                      value={hinePassiveShoulderElevation}
                      onChange={e => setHinePassiveShoulderElevation(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Resistencia superable normal al elevar</option>
                      <option value={2}>2 - Resistencia difícil de superar</option>
                      <option value={1}>1 - Sin resistencia (hiperlaxitud)</option>
                      <option value={0}>0 - Resistencia que no se puede superar (bloqueo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pronación / Supinación antebrazo</label>
                    <select
                      value={hinePronationSupination}
                      onChange={e => setHinePronationSupination(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Pronación y supinación completas sin resistencia</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Resistencia a la pronación/supinación pero superable</option>
                      <option value={0}>0 - Pronación o supinación no posible, marcada resistencia</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Aductores de cadera (abducción)</label>
                    <select
                      value={hineAdductorsAngle}
                      onChange={e => setHineAdductorsAngle(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Rango normal 150° - 80°</option>
                      <option value={2}>2 - 150° - 160°</option>
                      <option value={1}>1 - &gt; 170° (marcada hipotonía)</option>
                      <option value={0}>0 - &lt; 80° (marcada resistencia / espasticidad)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Ángulo poplíteo</label>
                    <select
                      value={hinePoplitealAngle}
                      onChange={e => setHinePoplitealAngle(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Rango normal 150° - 100°</option>
                      <option value={2}>2 - 150° - 160°</option>
                      <option value={1}>1 - ~90° o &gt; 170°</option>
                      <option value={0}>0 - &lt; 80° (muy resistente)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Dorsiflexión de tobillo</label>
                    <select
                      value={hineAnkleDorsiflexionAngle}
                      onChange={e => setHineAnkleDorsiflexionAngle(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Rango normal 30° - 85°</option>
                      <option value={2}>2 - 20° - 30°</option>
                      <option value={1}>1 - &lt; 20° o 90°</option>
                      <option value={0}>0 - &gt; 90° (pie equino rígido)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tracción al sedente (pull to sit)</label>
                    <select
                      value={hinePullToSit}
                      onChange={e => setHinePullToSit(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Cabeza se mantiene alineada y acompaña activa</option>
                      <option value={2}>2 - Intermedio / retraso leve</option>
                      <option value={1}>1 - Retraso marcado con caída posterior</option>
                      <option value={0}>0 - Cabeza cae completamente hacia atrás o hiperflexión</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Suspensión ventral</label>
                    <select
                      value={hineVentralSuspension}
                      onChange={e => setHineVentralSuspension(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Cabeza y tronco horizontales, miembros flexionados</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Caída en U moderada</option>
                      <option value={0}>0 - Cae en U invertida fláccida o hiperextensión rígida</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 5. REFLEJOS Y REACCIONES (Máx 15) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-black">5</span>
                    <span>5. Reflejos y Reacciones (Protección, Suspensión, Inclinación, Paracaídas, ROT) (Máx. 15 puntos)</span>
                  </h4>
                  <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                    Subtotal: {hineReflexesSubtotal} / 15
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Protección de brazos (tracción unilateral)</label>
                    <select
                      value={hineArmProtectionReaction}
                      onChange={e => setHineArmProtectionReaction(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Brazo y mano contrarios se extienden</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Brazo semi-flexionado</option>
                      <option value={0}>0 - Brazo completamente flexionado o ausente</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Suspensión vertical (pataleo activo)</label>
                    <select
                      value={hineVerticalSuspension}
                      onChange={e => setHineVerticalSuspension(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Patea simétricamente</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Patea más una pierna o pataleo pobre</option>
                      <option value={0}>0 - No patea incluso si estimulado o cruza en tijera</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Inclinación lateral (enderezamiento)</label>
                    <select
                      value={hineLateralTilting}
                      onChange={e => setHineLateralTilting(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Curvatura compensatoria simétrica de columna y cabeza</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Respuesta pobre o asimétrica</option>
                      <option value={0}>0 - Cae con la gravedad sin reacción</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Paracaídas hacia delante (&gt; 6 meses)</label>
                    <select
                      value={hineForwardParachute}
                      onChange={e => setHineForwardParachute(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Extensión simétrica de brazos y manos abiertas</option>
                      <option value={2}>2 - Intermedio</option>
                      <option value={1}>1 - Extensión incompleta o asimétrica</option>
                      <option value={0}>0 - Sin extensión de brazos</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Reflejos osteotendinosos (bíceps, rodilla, tobillo)</label>
                    <select
                      value={hineTendonReflexes}
                      onChange={e => setHineTendonReflexes(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                    >
                      <option value={3}>3 - Fácil de evocar (normal ++/++++)</option>
                      <option value={2}>2 - Levemente acelerado</option>
                      <option value={1}>1 - Vigoroso / hiperreflexia (+++)</option>
                      <option value={0}>0 - Clonus persistente o ausente (0 o ++++)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: HITOS MOTÓRICOS HINE (No puntuado; observe asimetrías) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="border-b border-slate-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">H</span>
                    <span>Sección 2: Hitos Motores del HINE (Evolutivos)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Registro de habilidades alcanzadas</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">1. Control de cabeza</span>
                    <select
                      value={hineMotorHeadControl}
                      onChange={e => setHineMotorHeadControl(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value="Incapaz de mantener cabeza erguida (normal hasta 3m)">Incapaz (hasta 3m)</option>
                      <option value="Temblores de cabeza (normal hasta 4m)">Temblores (hasta 4m)</option>
                      <option value="Mantenido derecha todo el tiempo (desde 5m)">Mantenido derecha todo el tiempo (desde 5m)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">2. Sedente (Sentándose)</span>
                    <select
                      value={hineMotorSitting}
                      onChange={e => setHineMotorSitting(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value="No puede sentarse">No puede sentarse</option>
                      <option value="Con soporte en caderas (4m)">Con soporte en caderas (4m)</option>
                      <option value="Props / apoyo anterior (6m)">Props / apoyo anterior (6m)</option>
                      <option value="Sentarse estable (7-8m)">Sentarse estable (7-8m)</option>
                      <option value="Pivota rotaciones en sedente (9m)">Pivota rotaciones (9m)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">3. Agarre voluntario</span>
                    <select
                      value={hineMotorVoluntaryGrasp}
                      onChange={e => setHineMotorVoluntaryGrasp(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value="Sin agarre voluntario">Sin agarre voluntario</option>
                      <option value="Utiliza toda la mano">Utiliza toda la mano (palmar)</option>
                      <option value="Dedillo y pulgar agarre inmaduro">Dedillo y pulgar inmaduro</option>
                      <option value="Agarre de pinza">Agarre de pinza fino</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">4. Patada en supino</span>
                    <select
                      value={hineMotorSupineKicking}
                      onChange={e => setHineMotorSupineKicking(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value="No patea">No patea</option>
                      <option value="Patea horizontalmente sin levantar">Patea horizontal sin levantar</option>
                      <option value="Hacia arriba vertical (3m)">Hacia arriba vertical (3m)</option>
                      <option value="Toca la pierna (4-5m)">Toca la pierna (4-5m)</option>
                      <option value="Toca los dedos de los pies (5-6m)">Toca los dedos de pies (5-6m)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">5. Giros (Rodando)</span>
                    <select
                      value={hineMotorRolling}
                      onChange={e => setHineMotorRolling(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value="Sin rodar">Sin rodar</option>
                      <option value="Rodando hacia un lado (4m)">Rodando hacia un lado (4m)</option>
                      <option value="De prono a supino (6m)">De prono a supino (6m)</option>
                      <option value="De supino a prono (6m)">De supino a prono (6m)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">6. Gateo</span>
                    <select
                      value={hineMotorCrawling}
                      onChange={e => setHineMotorCrawling(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value="No levanta cabeza en prono">No levanta cabeza</option>
                      <option value="Sobre codos (3m)">Sobre codos (3m)</option>
                      <option value="Brazos extendidos manos (4m)">Brazos extendidos manos (4m)</option>
                      <option value="Arrastre boca abajo abdomen (8m)">Arrastre sobre abdomen (8m)</option>
                      <option value="Sobre manos y rodillas (10m)">Sobre manos y rodillas (10m)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">7. De pie</span>
                    <select
                      value={hineMotorStanding}
                      onChange={e => setHineMotorStanding(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value="No sostiene el peso">No sostiene el peso</option>
                      <option value="Sostiene el peso (4m)">Sostiene el peso (4m)</option>
                      <option value="Se mantiene con soporte (7m)">Se mantiene con soporte (7m)</option>
                      <option value="Se pone de pie sin ayuda (12m)">De pie sin ayuda (12m)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">8. Caminando</span>
                    <select
                      value={hineMotorWalking}
                      onChange={e => setHineMotorWalking(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value="Rebotando (6m)">Rebotando (6m)</option>
                      <option value="Desplazamiento agarrándose marcha lateral (12m)">Marcha lateral con apoyo (12m)</option>
                      <option value="Caminando independientemente (15m)">Marcha independiente (15m)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: COMPORTAMIENTO HINE (Escala 1 a 6) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black">C</span>
                    <span>Sección 3: Comportamiento Durante el Examen HINE</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Escala oficial de 1 a 6</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Estado Consciente</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">{hineBehaviorConscious}/6</span>
                    </div>
                    <select
                      value={hineBehaviorConscious}
                      onChange={e => setHineBehaviorConscious(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value={1}>1 - Inarrojable / insomne</option>
                      <option value={2}>2 - Somnoliento</option>
                      <option value={3}>3 - Duerme pero se despierta fácilmente</option>
                      <option value={4}>4 - Despierto pero no muestra interés</option>
                      <option value={5}>5 - Pierde interés intermitente</option>
                      <option value={6}>6 - Mantiene interés activo y alerta</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Estado Emocional</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">{hineBehaviorEmotional}/6</span>
                    </div>
                    <select
                      value={hineBehaviorEmotional}
                      onChange={e => setHineBehaviorEmotional(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value={1}>1 - Irritable, no consolable</option>
                      <option value={2}>2 - Irritable, cuidador puede consolar</option>
                      <option value={3}>3 - Irritable cuando acercado</option>
                      <option value={4}>4 - Ni feliz o infeliz (neutro)</option>
                      <option value={5}>5 - Feliz y sonriendo</option>
                      <option value={6}>6 - Muy feliz, cooperador y risueño</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Orientación Social</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">{hineBehaviorSocial}/6</span>
                    </div>
                    <select
                      value={hineBehaviorSocial}
                      onChange={e => setHineBehaviorSocial(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    >
                      <option value={1}>1 - Evitando, retirado</option>
                      <option value={2}>2 - Dudoso / retraído</option>
                      <option value={3}>3 - Acepta acercamiento con pausa</option>
                      <option value={4}>4 - Amistoso y responde a contacto</option>
                      <option value={5}>5 - Muy amistoso, busca interacción</option>
                      <option value={6}>6 - Totalmente comunicativo y conectado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Observaciones HINE */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <label className="font-bold text-slate-800 block text-xs">
                  Observaciones Clínicas y Asimetrías del Examen HINE:
                </label>
                <textarea
                  rows={3}
                  value={hineObservations}
                  onChange={e => setHineObservations(e.target.value)}
                  placeholder="Detallar asimetrías de tono, hemicuerpo predominante, respuesta a estímulos y signos de alerta neurológica..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 outline-hidden"
                />
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECCIÓN 3: ASIMETRÍAS CRANEALES (< 2 años)                            */}
          {/* ========================================================================= */}
          {activeSection === 'cranial' && ageDecision === 'menor_2_anos' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-sky-950 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-sky-600" />
                    <span>Protocolo de Mediciones de Asimetrías Craneales</span>
                  </h3>
                  <p className="text-xs text-sky-800 mt-0.5">
                    Cálculo automático de CVAI (Plagiocefalia) e Índice Cefálico (Braquicefalia).
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-sky-200 text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Diferencia |D1 - D2|</span>
                    <strong className="text-base text-sky-900 font-mono">{cranialDifference} mm</strong>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-[10px] text-slate-500 block">CVAI</span>
                    <strong className="text-base text-sky-900 font-mono">{cranialCvai}%</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diagonal 1 (D1) en mm</label>
                  <input
                    type="number"
                    value={cranialD1Mm}
                    onChange={e => setCranialD1Mm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diagonal 2 (D2) en mm</label>
                  <input
                    type="number"
                    value={cranialD2Mm}
                    onChange={e => setCranialD2Mm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diámetro Anteroposterior (AP) mm</label>
                  <input
                    type="number"
                    value={cranialApMm}
                    onChange={e => setCranialApMm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diámetro Biparietal (BP) mm</label>
                  <input
                    type="number"
                    value={cranialBpMm}
                    onChange={e => setCranialBpMm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Perímetro Cefálico (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={headCircumferenceCm}
                    onChange={e => setHeadCircumferenceCm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severidad Plagiocefalia</label>
                  <div className="px-3 py-2 bg-slate-100 rounded-xl font-bold text-slate-800">
                    {plagiocephalySeverity}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Índice Cefálico / Braquicefalia</label>
                  <div className="px-3 py-2 bg-slate-100 rounded-xl font-bold text-slate-800">
                    {cephalicIndex}% — {brachycephalyClassification}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Indicación de Tratamiento</label>
                  <input
                    type="text"
                    value={cranialTreatmentIndication}
                    onChange={e => setCranialTreatmentIndication(e.target.value)}
                    placeholder="Pauta de reposicionamiento y kine"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECCIÓN 4: PAUTA DE PILAR ARNAIZ (>= 2 años y NO recibe órdenes)       */}
          {/* ========================================================================= */}
          {activeSection === 'arnaiz' && ageDecision === 'mayor_2_anos' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-amber-950 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-600" />
                      <span>Pauta de Observación de Parámetros Psicomotores de Pilar Arnaiz</span>
                    </h3>
                    <p className="text-xs text-amber-900 mt-1">
                      Evaluación cualitativa en sesión de juego libre y vivenciado para niños que <strong>no siguen órdenes verbales directas</strong>. Haz clic en las etiquetas para seleccionarlas rápidamente o escribe observaciones personalizadas.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-200 text-amber-900 font-bold text-xs rounded-full shrink-0">
                    Observación Espontánea
                  </span>
                </div>
              </div>

              {/* 1. Motricidad y Movimiento */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">1</span>
                  <span>Motricidad, Movimiento y Tono Corporal</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Movimientos más frecuentes */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Movimientos más frecuentes</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Balanceos', 'Giros', 'Caídas', 'Volteretas', 'Caminar', 'Correr', 'Saltar', 'Rodar', 'Subir y Bajar', 'Trepar', 'Gateo', 'Reptar'].map(tag => {
                        const active = arnaizMovementsFrequent.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizMovementsFrequent ? arnaizMovementsFrequent.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizMovementsFrequent(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizMovementsFrequent}
                      onChange={e => setArnaizMovementsFrequent(e.target.value)}
                      placeholder="Balanceos, giros, caídas, saltos, carreras..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Calidad de los movimientos */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Calidad del movimiento</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Coordinados', 'Armónicos', 'Abiertos', 'Cerrados', 'Rápidos', 'Lentos', 'Pesados', 'Ligeros', 'Bruscos', 'Impulsivos', 'Rígidos', 'Crispados', 'Con sincinesias'].map(tag => {
                        const active = arnaizMovementsQuality.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizMovementsQuality ? arnaizMovementsQuality.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizMovementsQuality(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizMovementsQuality}
                      onChange={e => setArnaizMovementsQuality(e.target.value)}
                      placeholder="Coordinados, armónicos, impulsivos, rígidos..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Grado de movilidad corporal */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Grado y nivel de movilidad corporal</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Todo el cuerpo activo', 'Movilidad armónica', 'Hipoactividad motriz', 'Hiperactividad / descarga continua', 'Disociación segmentaria', 'Bloqueos axiales'].map(tag => {
                        const active = arnaizBodyMobility.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizBodyMobility ? arnaizBodyMobility.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizBodyMobility(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizBodyMobility}
                      onChange={e => setArnaizBodyMobility(e.target.value)}
                      placeholder="Todo el cuerpo activo, articulaciones, tronco..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Posturas habituales y Tono */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Posturas habituales y Tono muscular</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Bipedestación activa', 'En cuclillas', 'Sedente libre', 'Decúbito prono', 'Decúbito supino', 'Arrodillado', 'Normotonía', 'Hipotonía de base', 'Hipertonía / rigidez', 'Tono fluctuante'].map(tag => {
                        const active = arnaizPostures.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizPostures ? arnaizPostures.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizPostures(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizPostures}
                      onChange={e => setArnaizPostures(e.target.value)}
                      placeholder="De pie, cuclillas, tono elástico o fluctuante..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 2. El Espacio y el Tiempo */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">2</span>
                  <span>El Espacio y el Tiempo en la Sesión</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ocupación del Espacio */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Ocupación del Espacio</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Ocupa toda la sala', 'Espacio reducido', 'Zonas periféricas / paredes', 'Rincones / refugio', 'Centro de la sala', 'Kinésfera inmediata', 'Huye o invade'].map(tag => {
                        const active = arnaizSpaceOccupancy.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizSpaceOccupancy ? arnaizSpaceOccupancy.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizSpaceOccupancy(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizSpaceOccupancy}
                      onChange={e => setArnaizSpaceOccupancy(e.target.value)}
                      placeholder="Con el cuerpo, voz, mirada, objetos; invade o se aísla..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Vías de Desplazamiento y Niveles */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Vías de Desplazamiento y Niveles</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Líneas rectas', 'Trayectorias circulares', 'En zig-zag', 'Erráticas / sin dirección fija', 'Nivel bajo (suelo)', 'Nivel medio (mesas/bancos)', 'Nivel alto (espalderas/alturas)'].map(tag => {
                        const active = arnaizSpaceTrajectory.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizSpaceTrajectory ? arnaizSpaceTrajectory.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizSpaceTrajectory(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizSpaceTrajectory}
                      onChange={e => setArnaizSpaceTrajectory(e.target.value)}
                      placeholder="Trayectorias circulares, periféricas, nivel bajo o alto..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Ritmo de acción */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Ritmo de acción</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Lento', 'Rápido', 'Acelerado', 'Pausado', 'Precipitado', 'Con momentos de descarga', 'Ajuste adecuado a la sesión'].map(tag => {
                        const active = arnaizRhythmQuality.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizRhythmQuality ? arnaizRhythmQuality.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizRhythmQuality(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizRhythmQuality}
                      onChange={e => setArnaizRhythmQuality(e.target.value)}
                      placeholder="Regular, acelerado, lento, arrítmico..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Duración de las actividades */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Duración y persistencia en actividades</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Persistente / sostenida', 'Fugaz / cambio continuo', 'Dispersa', 'Dificultad para cerrar actividad', 'Perseverativa'].map(tag => {
                        const active = arnaizActivityDuration.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizActivityDuration ? arnaizActivityDuration.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizActivityDuration(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizActivityDuration}
                      onChange={e => setArnaizActivityDuration(e.target.value)}
                      placeholder="Sostenida, fugaz, dispersa, dificultad de cambio..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Los Objetos y Relación con los Demás */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">3</span>
                  <span>Relación con los Objetos, Iguales y el Adulto</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Uso de los objetos */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Elección y uso de objetos</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Sensoriomotor (lanzar/chocar)', 'Simbólico (hacer como si...)', 'De construcción', 'Reglado / social', 'Objetos duros', 'Objetos blandos', 'Desestructurados (telas/cuerdas)'].map(tag => {
                        const active = arnaizObjectUsage.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizObjectUsage ? arnaizObjectUsage.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizObjectUsage(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizObjectUsage}
                      onChange={e => setArnaizObjectUsage(e.target.value)}
                      placeholder="Funcional, creativo/simbólico, hábil, impulsivo..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Relación de objetos con los demás */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Relación de objetos con los demás</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Comparte espontáneamente', 'Retiene / posesivo', 'Quita objetos a otros', 'Rechaza materiales', 'Indiferente'].map(tag => {
                        const active = arnaizObjectRelations.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizObjectRelations ? arnaizObjectRelations.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizObjectRelations(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizObjectRelations}
                      onChange={e => setArnaizObjectRelations(e.target.value)}
                      placeholder="Comparte, quita, rechaza, retiene..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Relación con sus pares */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Relación con sus pares / compañeros</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Juego en paralelo', 'Busca contacto', 'Agrede o empuja', 'Ignora a otros', 'Comparte y colabora', 'Líder', 'Pasivo o aislado'].map(tag => {
                        const active = arnaizCompanionsRelation.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizCompanionsRelation ? arnaizCompanionsRelation.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizCompanionsRelation(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizCompanionsRelation}
                      onChange={e => setArnaizCompanionsRelation(e.target.value)}
                      placeholder="Juega solo, en paralelo, con otro, en pequeños grupos..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Relación con el adulto / terapeuta */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block text-xs">Relación con el adulto / terapeuta</label>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {['Demanda constante de mirada/aprobación', 'Desafío u oposición lúdica', 'Colabora abiertamente', 'Evita contacto físico', 'Acepta límites y contención'].map(tag => {
                        const active = arnaizAdultRelation.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const list = arnaizAdultRelation ? arnaizAdultRelation.split(',').map(s => s.trim()).filter(Boolean) : [];
                              setArnaizAdultRelation(active ? list.filter(i => i !== tag).join(', ') : [...list, tag].join(', '));
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                              active ? 'bg-amber-500 text-white shadow-xs' : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={arnaizAdultRelation}
                      onChange={e => setArnaizAdultRelation(e.target.value)}
                      placeholder="Lo busca, lo provoca, colabora, espera aprobación..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  {/* Síntesis e Impresión Psicomotriz Global */}
                  <div className="md:col-span-2 space-y-1.5 pt-2">
                    <label className="font-bold text-slate-800 block text-xs">
                      Síntesis e Impresión Diagnóstica Psicomotriz (Pilar Arnaiz)
                    </label>
                    <textarea
                      rows={3}
                      value={arnaizGlobalSynthesis}
                      onChange={e => setArnaizGlobalSynthesis(e.target.value)}
                      placeholder="Conclusiones clínicas de la observación de juego libre y parámetros psicomotores..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECCIÓN 4.B: HABILIDADES DE COMUNICACIÓN CRÍTICAS Y FUNCIONALES        */}
          {/* ========================================================================= */}
          {activeSection === 'critical_communication' && ageDecision === 'mayor_2_anos' && !followsCommandsDecision && (
            <div className="space-y-6 animate-in fade-in">
              <CriticalCommunicationForm
                data={criticalCommData}
                onChange={setCriticalCommData}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECCIÓN 5: BATERÍA DE VÍTOR DA FONSECA (>= 2 años y SÍ recibe órdenes) */}
          {/* ========================================================================= */}
          {activeSection === 'da_fonseca' && ageDecision === 'mayor_2_anos' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header Bar */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-600" />
                    <span>Batería Psicomotora (BPM) de Vítor da Fonseca</span>
                  </h3>
                  <p className="text-xs text-emerald-900 mt-1">
                    Evaluación estandarizada de 7 factores psicomotores. Haz clic en las puntuaciones del <strong>1 al 4</strong> para registrar cada subfactor en tiempo real.
                  </p>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border border-emerald-200 text-right shadow-xs shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Puntaje Total BPM</span>
                  <div className="text-2xl font-black text-emerald-700">{bpmTotal} <span className="text-xs font-normal text-slate-400">/ 28 pts</span></div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                    bpmTotal >= 21 ? 'bg-emerald-100 text-emerald-800' :
                    bpmTotal >= 14 ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {bpmProfileResult}
                  </span>
                </div>
              </div>

              {/* Guía de Calificación Escala 1 a 4 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                  <strong className="block text-rose-900 font-black">1 - Apráxico</strong>
                  <span className="text-[10px]">Incapacidad / Deficitario</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <strong className="block text-amber-900 font-black">2 - Dispráxico</strong>
                  <span className="text-[10px]">Dificultades / Control débil</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <strong className="block text-emerald-900 font-black">3 - Eupráxico</strong>
                  <span className="text-[10px]">Realización adecuada</span>
                </div>
                <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800">
                  <strong className="block text-sky-900 font-black">4 - Hiperpráxico</strong>
                  <span className="text-[10px]">Excelente / Fluido</span>
                </div>
              </div>

              {/* 7 Factores de Vitor Da Fonseca detallados */}
              <div className="space-y-4">
                
                {/* FACTOR 1: TONICIDAD */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">1</span>
                      <strong className="text-sm text-slate-900">Tonicidad (Tonicidade)</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Promedio Factor:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        bpmTonicityScore >= 3 ? 'bg-emerald-100 text-emerald-800' : bpmTonicityScore === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {bpmTonicityScore} / 4
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                    {/* 1.1 Extensibilidad */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">1.1 Extensibilidad</div>
                      <p className="text-[10px] text-slate-500">Miembros superiores e inferiores</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmTonicityExtensibility(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmTonicityExtensibility === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 1.2 Pasividad */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">1.2 Pasividad</div>
                      <p className="text-[10px] text-slate-500">Balanceo pasivo de extremidades</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmTonicityPassivity(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmTonicityPassivity === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 1.3 Paratonía */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">1.3 Paratonía</div>
                      <p className="text-[10px] text-slate-500">Resistencia o incapacidad de relajar</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmTonicityParatonia(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmTonicityParatonia === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 1.4 Diadococinesias */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">1.4 Diadococinesias</div>
                      <p className="text-[10px] text-slate-500">Marionetas manuales rápidas</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmTonicityDiadochokinesia(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmTonicityDiadochokinesia === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 1.5 Sincinesias */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">1.5 Sincinesias</div>
                      <p className="text-[10px] text-slate-500">Movimientos parásitos bucales/distales</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmTonicitySynkinesia(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmTonicitySynkinesia === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* FACTOR 2: EQUILIBRIO */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black">2</span>
                      <strong className="text-sm text-slate-900">Equilibrio (Equilibração)</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Promedio Factor:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        bpmEquilibriumScore >= 3 ? 'bg-emerald-100 text-emerald-800' : bpmEquilibriumScore === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {bpmEquilibriumScore} / 4
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* 2.1 Inmovilidad */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">2.1 Inmovilidad</div>
                      <p className="text-[10px] text-slate-500">Postura bípeda ojos cerrados (60s)</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmEquilibriumImmobility(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmEquilibriumImmobility === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2.2 Equilibrio Estático */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">2.2 Equilibrio Estático</div>
                      <p className="text-[10px] text-slate-500">Apoyo monopodal (20s) y puntillas</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmEquilibriumStatic(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmEquilibriumStatic === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2.3 Equilibrio Dinámico */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">2.3 Equilibrio Dinámico</div>
                      <p className="text-[10px] text-slate-500">Marcha talón-punta y salto a un pie</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmEquilibriumDynamic(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmEquilibriumDynamic === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* FACTOR 3: LATERALIDAD */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">3</span>
                      <strong className="text-sm text-slate-900">Lateralidad (Lateralidade)</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Promedio Factor:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        bpmLateralityScore >= 3 ? 'bg-emerald-100 text-emerald-800' : bpmLateralityScore === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {bpmLateralityScore} / 4
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                    {/* 3.1 Ocular */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">3.1 Ocular (Tubo)</div>
                      <p className="text-[10px] text-slate-500">Visión monocular dominante</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmLateralityOcular(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmLateralityOcular === v ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3.2 Auditiva */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">3.2 Auditiva (Reloj)</div>
                      <p className="text-[10px] text-slate-500">Escucha preferente monoaural</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmLateralityAuditory(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmLateralityAuditory === v ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3.3 Manual */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">3.3 Manual (Lanzar/Escribir)</div>
                      <p className="text-[10px] text-slate-500">Uso unimanual preferente</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmLateralityManual(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmLateralityManual === v ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3.4 Podal */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">3.4 Podal (Balón/Rayuela)</div>
                      <p className="text-[10px] text-slate-500">Chutar pelota con pie hábil</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmLateralityPodal(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmLateralityPodal === v ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Perfil de Lateralidad */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">Perfil Resultante</div>
                      <select
                        value={bpmLateralityProfile}
                        onChange={e => setBpmLateralityProfile(e.target.value as any)}
                        className="w-full text-xs font-bold border border-slate-300 rounded-lg p-1.5 mt-1 bg-slate-50"
                      >
                        <option value="Diestro Completo">Diestro Completo</option>
                        <option value="Zurdo Completo">Zurdo Completo</option>
                        <option value="Cruzado">Cruzado</option>
                        <option value="Ambidiestro / Indefinido">Ambidiestro / Indefinido</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* FACTOR 4: NOCIÓN DEL CUERPO */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-xs font-black">4</span>
                      <strong className="text-sm text-slate-900">Noción del Cuerpo (Noção do Corpo)</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Promedio Factor:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        bpmBodyNotionScore >= 3 ? 'bg-emerald-100 text-emerald-800' : bpmBodyNotionScore === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {bpmBodyNotionScore} / 4
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* 4.1 Sentido Kinestésico */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">4.1 Sentido Kinestésico</div>
                      <p className="text-[10px] text-slate-500">Señalar partes del cuerpo a ciegas</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmBodyNotionKinesthetic(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmBodyNotionKinesthetic === v ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4.2 Reconocimiento Derecha/Izquierda */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">4.2 Derecha / Izquierda</div>
                      <p className="text-[10px] text-slate-500">En sí mismo y en el examinador</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmBodyNotionRightLeft(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmBodyNotionRightLeft === v ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4.3 Autoimagen */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">4.3 Autoimagen</div>
                      <p className="text-[10px] text-slate-500">Esquema / dibujo de figura humana</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmBodyNotionAutoimage(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmBodyNotionAutoimage === v ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4.4 Imitación de Gestos */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">4.4 Imitación de Gestos</div>
                      <p className="text-[10px] text-slate-500">4 gestos simétricos y 4 cruzados</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmBodyNotionGestures(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmBodyNotionGestures === v ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* FACTOR 5: ESPACIO-TEMPORAL */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-black">5</span>
                      <strong className="text-sm text-slate-900">Estructuración Espacio-Temporal</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Promedio Factor:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        bpmSpatialTemporalScore >= 3 ? 'bg-emerald-100 text-emerald-800' : bpmSpatialTemporalScore === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {bpmSpatialTemporalScore} / 4
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* 5.1 Organización Espacial */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">5.1 Organización Espacial</div>
                      <p className="text-[10px] text-slate-500">Cálculo de pasos y distancias</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmSpatialOrganization(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmSpatialOrganization === v ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5.2 Orientación Espacial */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">5.2 Orientación Espacial</div>
                      <p className="text-[10px] text-slate-500">Topología: delante/detrás, arriba/abajo</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmSpatialOrientation(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmSpatialOrientation === v ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5.3 Estructuración Rítmica */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">5.3 Estructuración Rítmica</div>
                      <p className="text-[10px] text-slate-500">Reproducción de ritmos de Stambak</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmSpatialRhythm(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmSpatialRhythm === v ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* FACTOR 6: PRAXIA GLOBAL */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-black">6</span>
                      <strong className="text-sm text-slate-900">Praxia Global (Praxia Global)</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Promedio Factor:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        bpmGlobalPraxiaScore >= 3 ? 'bg-emerald-100 text-emerald-800' : bpmGlobalPraxiaScore === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {bpmGlobalPraxiaScore} / 4
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* 6.1 Óculo-Manual */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">6.1 Óculo-Manual</div>
                      <p className="text-[10px] text-slate-500">Lanzamiento a blanco y recepción</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmGlobalPraxiaOculomanual(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmGlobalPraxiaOculomanual === v ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 6.2 Óculo-Pedal */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">6.2 Óculo-Pedal</div>
                      <p className="text-[10px] text-slate-500">Conducción y tiro a portería</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmGlobalPraxiaOculopodal(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmGlobalPraxiaOculopodal === v ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 6.3 Dismetría */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">6.3 Dismetría</div>
                      <p className="text-[10px] text-slate-500">Frenado y precisión del alcance</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmGlobalPraxiaDysmetria(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmGlobalPraxiaDysmetria === v ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 6.4 Disociación Motriz */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">6.4 Disociación Motriz</div>
                      <p className="text-[10px] text-slate-500">Independencia de extremidades</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmGlobalPraxiaDissociation(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmGlobalPraxiaDissociation === v ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* FACTOR 7: PRAXIA FINA */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black">7</span>
                      <strong className="text-sm text-slate-900">Praxia Fina (Praxia Fina)</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Promedio Factor:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        bpmFinePraxiaScore >= 3 ? 'bg-emerald-100 text-emerald-800' : bpmFinePraxiaScore === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {bpmFinePraxiaScore} / 4
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* 7.1 Coordinación Dinámica Manual */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">7.1 Oposición Digital</div>
                      <p className="text-[10px] text-slate-500">Tocar pulgar con dedos 1-2-3-4 y reverso</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmFinePraxiaDynamic(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmFinePraxiaDynamic === v ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 7.2 Tamborileo Digital */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">7.2 Tamborileo Digital</div>
                      <p className="text-[10px] text-slate-500">Percusión secuencial dedos en mesa</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmFinePraxiaDigital(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmFinePraxiaDigital === v ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 7.3 Velocidad y Precisión Grafomotora */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">7.3 Precisión Grafomotora</div>
                      <p className="text-[10px] text-slate-500">Trazado continuo y puntos en círculos</p>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {[1, 2, 3, 4].map(v => (
                          <button key={v} type="button" onClick={() => setBpmFinePraxiaGraphomotor(v)}
                            className={`py-1 rounded font-bold cursor-pointer text-xs ${bpmFinePraxiaGraphomotor === v ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Conclusiones de la Batería Da Fonseca */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
                <label className="font-bold text-slate-800 block text-xs">
                  Conclusiones Clínicas de la Batería Psicomotora de Da Fonseca
                </label>
                <textarea
                  rows={3}
                  value={bpmConclusions}
                  onChange={e => setBpmConclusions(e.target.value)}
                  placeholder="Detallar perfil apráxico, dispráxico, eupráxico o hiperpráxico, factores más comprometidos y metas terapéuticas..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* SUB-SECCIÓN 6: PERFIL SENSORIAL SPM-2 (4-9m, 10-30m, 2-5a, >5a)            */}
          {/* ========================================================================= */}
          {activeSection === 'spm2' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-blue-50 border border-indigo-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                      SPM-2 Estandarizado por Rango de Edad
                    </span>
                    <span className="text-[11px] font-bold text-indigo-900 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Bebés (4-9m) · Niños Pequeños (10-30m) · Preescolar (2-5a) · Escolar (5-12a)
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-indigo-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Medida de Procesamiento Sensorial (SPM-2 / SPM-P / SPM)</span>
                  </h3>
                  <p className="text-xs text-indigo-800">
                    Modalidad: <strong className="capitalize">{spmApplicationMethod.replace('_', ' ')}</strong> {spmRespondentName ? `· Respondido por: ${spmRespondentName}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const pAge = calculatePatientAge(currentPatient?.birthDate || '');
                      const months = (pAge.years * 12) + pAge.months;
                      if (months <= 9) setModalSpmAgeGroup('bebes_4_9');
                      else if (months <= 30) setModalSpmAgeGroup('10_a_30_meses');
                      else if (months <= 60) setModalSpmAgeGroup('2_a_5_anos');
                      else setModalSpmAgeGroup('mayor_5_anos');
                      setShowSPMLinkModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer hover:scale-105"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Abrir Cuestionario Completo por Edad</span>
                  </button>
                </div>
              </div>

              {/* Tarjetas de los 4 Cuestionarios SPM por Rango de Edad (Incluyendo Bebés 4-9m y 10-30m) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Bebés 4 a 9 meses */}
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-purple-950 flex items-center gap-1.5">
                        👶 SPM-2 Bebés (4-9 meses)
                      </span>
                      <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                        80 Ítems
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Formulario oficial para lactantes de 4 a 9 meses (estratos 4-6m y 7-9m): visión, oído, tacto, gusto/olfato, cuerpo, equilibrio, ideas y participación social.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setModalSpmAgeGroup('bebes_4_9');
                        setShowSPMLinkModal(true);
                      }}
                      className="w-full py-1.5 px-2.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Abrir SPM-2 Bebés (4-9m) →
                    </button>
                    <a
                      href="/assets/aistudio/ilide.info-spm-2-bebes-4-a-9-meses-pr_604339aa0daad77c6d3025399d0c5995_3843a8f7.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-purple-800 hover:underline text-center"
                    >
                      📄 Ver PDF Oficial 4-9 meses
                    </a>
                  </div>
                </div>

                {/* 2. Niños Pequeños 10 a 30 meses */}
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-purple-950 flex items-center gap-1.5">
                        🍼 SPM-2 (10-30 meses)
                      </span>
                      <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                        80 Ítems
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Formulario oficial Toddler para niños pequeños de 10 a 30 meses: respuestas sensoriales, exploración motriz, alimentación y rutinas.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setModalSpmAgeGroup('10_a_30_meses');
                        setShowSPMLinkModal(true);
                      }}
                      className="w-full py-1.5 px-2.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Abrir SPM-2 (10-30m) →
                    </button>
                    <a
                      href="/assets/aistudio/SPM_10-30_meses_5312c45e.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-purple-800 hover:underline text-center"
                    >
                      📄 Ver PDF Oficial 10-30 meses
                    </a>
                  </div>
                </div>

                {/* 3. Preescolar 2 a 5 años */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                        🎨 Preescolar (2-5 años)
                      </span>
                      <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                        75 Ítems
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Cuestionarios para Padres (Hogar) y Educadoras (Jardín Infantil) de 2 a 5 años.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setModalSpmAgeGroup('2_a_5_anos');
                        setShowSPMLinkModal(true);
                      }}
                      className="w-full py-1.5 px-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Abrir SPM Preescolar →
                    </button>
                    <a
                      href="/assets/aistudio/Cuestionario_Padres_Pre_Escolar_ea5af9a8.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-blue-700 hover:underline text-center"
                    >
                      📄 Ver PDF Preescolar
                    </a>
                  </div>
                </div>

                {/* 4. Escolar 5 a 12 años */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                        🧒 Escolar (5-12 años)
                      </span>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                        75 / 62 Ítems
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Cuestionarios para Padres (Hogar) y Profesores / PIE (Escuela) de 5 a 12 años.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setModalSpmAgeGroup('mayor_5_anos');
                        setShowSPMLinkModal(true);
                      }}
                      className="w-full py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Abrir SPM Escolar →
                    </button>
                    <a
                      href="/assets/aistudio/Cuestionario_Padres_Escolares_460ca90f.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-indigo-700 hover:underline text-center"
                    >
                      📄 Ver PDF Escolar
                    </a>
                  </div>
                </div>
              </div>

              {/* 8 Dimensiones Sensoriales con Semáforo y Puntuación T */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Dimensiones y Puntajes Estándar (T-Score):
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Típico: 40-59 · Algunos Problemas: 60-69 · Disfunción Definida: 70-80
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Participación Social (SOC)', val: spmSocial, setter: setSpmSocial },
                    { label: 'Visión (VIS)', val: spmVision, setter: setSpmVision },
                    { label: 'Audición (HEA)', val: spmHearing, setter: setSpmHearing },
                    { label: 'Tacto (TOU)', val: spmTouch, setter: setSpmTouch },
                    { label: 'Gusto y Olfato (TS)', val: spmTasteSmell, setter: setSpmTasteSmell },
                    { label: 'Conciencia Corporal (BOD)', val: spmBodyAwareness, setter: setSpmBodyAwareness },
                    { label: 'Equilibrio y Mov. (BAL)', val: spmBalanceMotion, setter: setSpmBalanceMotion },
                    { label: 'Planificación e Ideas (PLA)', val: spmPlanningIdeas, setter: setSpmPlanningIdeas }
                  ].map((scaleItem, idx) => {
                    const rangeLabel = getSpmRange(scaleItem.val);
                    const isSevere = scaleItem.val >= 21;
                    const isModerate = scaleItem.val >= 16 && scaleItem.val <= 20;

                    return (
                      <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800 truncate" title={scaleItem.label}>
                            {scaleItem.label}
                          </span>
                          <span className="font-mono font-black text-xs text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                            {scaleItem.val} pts
                          </span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={35}
                          value={scaleItem.val}
                          onChange={e => scaleItem.setter(Number(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Rango:</span>
                          <span className={`font-bold px-2 py-0.5 rounded-md ${
                            isSevere 
                              ? 'bg-rose-100 text-rose-800' 
                              : isModerate 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {rangeLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resumen Total TOT */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider block">
                    Puntuación Compuesta
                  </span>
                  <div className="text-sm font-extrabold text-white">
                    Total Sistemas Sensoriales (TOT): <span className="font-mono text-sky-300 text-base">{spmTotal} pts</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-semibold">Clasificación Global:</span>
                  <span className={`px-3 py-1 rounded-xl font-black text-xs ${
                    spmTotal < 125 
                      ? 'bg-emerald-500 text-white' 
                      : spmTotal <= 155 
                      ? 'bg-amber-400 text-slate-950' 
                      : 'bg-rose-500 text-white'
                  }`}>
                    {spmTotal < 125 ? 'Típico (40-59)' : spmTotal <= 155 ? 'Algunos Problemas (60-69)' : 'Disfunción Definida (70-80)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECCIÓN 7: DIAGNÓSTICO CIF, PLAN Y RECOMENDACIONES                    */}
          {/* ========================================================================= */}
          {activeSection === 'cif_plan' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Encabezado Asistente CIF */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                        OMS · Marco C.I.F. Pediátrico
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Válido Comités PIE y Salud
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white mt-1 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-sky-400" />
                      <span>Diagnóstico Funcional CIF, Objetivos Terapéuticos & Plan Integral</span>
                    </h3>
                    <p className="text-xs text-blue-200 mt-0.5 max-w-2xl">
                      Estructura formal basada en Funciones (b), Estructuras (s), Actividades y Participación (d), y Factores Ambientales (e) con sugerencias clínicas automáticas basadas en la evaluación.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const autoDiagnosis = generateAutomaticCIFDiagnosis(
                        currentPatient,
                        anamnesisData[currentPatient?.id || ''],
                        evaluationsData[currentPatient?.id || '']
                      );
                      setFunctionalDiagnosisCIF(autoDiagnosis);

                      // Detect and extract CIF codes mentioned in the diagnosis
                      const codesFound = CIF_CODES_BANK
                        .filter(item => autoDiagnosis.includes(item.code))
                        .map(item => item.code);
                      if (codesFound.length > 0) {
                        setSelectedCifCodes(prev => Array.from(new Set([...prev, ...codesFound])));
                      }

                      setSavedSuccessAlert('⚡ Diagnóstico CIF autogenerado a partir de los datos clínicos del paciente.');
                      setTimeout(() => setSavedSuccessAlert(null), 3500);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 hover:scale-102 active:scale-98"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>⚡ Autogenerar CIF desde Pruebas</span>
                  </button>
                </div>

                {/* Códigos CIF Activos */}
                {selectedCifCodes.length > 0 && (
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-bold text-blue-200 mr-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-300" /> Códigos CIF Seleccionados ({selectedCifCodes.length}):
                    </span>
                    {selectedCifCodes.map(code => {
                      const meta = CIF_CODES_BANK.find(c => c.code === code);
                      return (
                        <span
                          key={code}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-800/80 border border-blue-400/40 text-[11px] font-mono font-bold text-white shadow-2xs"
                        >
                          <span>{code}</span>
                          {meta && <span className="font-sans font-normal text-blue-200">({meta.title.slice(0, 20)}...)</span>}
                          <button
                            type="button"
                            onClick={() => setSelectedCifCodes(prev => prev.filter(c => c !== code))}
                            className="hover:text-rose-300 ml-0.5 cursor-pointer font-bold"
                            title="Quitar código"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selector Interactivo de Códigos CIF Oficiales (OMS) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5 text-blue-600" />
                      <span>Banco de Códigos CIF Específicos para Kinesiología Pediátrica</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Haz clic en cualquier código para insertarlo con su calificación oficial en el texto del diagnóstico.
                    </p>
                  </div>

                  {/* Selector de Severidad / Calificador */}
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-[11px] font-bold text-slate-600">Calificador:</label>
                    <select
                      value={cifSeverityQualifier}
                      onChange={e => setCifSeverityQualifier(e.target.value)}
                      className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {CIF_QUALIFIERS.map(q => (
                        <option key={q.value} value={q.value}>{q.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pestañas de Dominio CIF: b, s, d, e */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'b', label: 'Funciones Corporales (b)', count: CIF_CODES_BANK.filter(c => c.domain === 'b').length, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                    { id: 's', label: 'Estructuras Corporales (s)', count: CIF_CODES_BANK.filter(c => c.domain === 's').length, color: 'text-purple-700 bg-purple-50 border-purple-200' },
                    { id: 'd', label: 'Actividades y Participación (d)', count: CIF_CODES_BANK.filter(c => c.domain === 'd').length, color: 'text-teal-700 bg-teal-50 border-teal-200' },
                    { id: 'e', label: 'Factores Ambientales (e)', count: CIF_CODES_BANK.filter(c => c.domain === 'e').length, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCifActiveDomain(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        cifActiveDomain === tab.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${cifActiveDomain === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Grid de Códigos del Dominio Activo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {CIF_CODES_BANK
                    .filter(item => item.domain === cifActiveDomain)
                    .map(item => {
                      const isSelected = selectedCifCodes.includes(item.code);
                      return (
                        <div
                          key={item.code}
                          className={`p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-300'
                              : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono font-black text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                                {item.code}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold">
                                {item.domainLabel.split(' ')[0]}
                              </span>
                            </div>
                            <strong className="text-slate-800 block text-xs mt-1 leading-tight">
                              {item.title}
                            </strong>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                const qualifierToUse = item.domain === 'e' ? item.defaultQualifier : cifSeverityQualifier;
                                const formattedLine = `• ${item.code}${qualifierToUse} ${item.title}: ${item.description}`;
                                
                                setFunctionalDiagnosisCIF(prev => {
                                  if (prev.includes(item.code)) {
                                    return prev;
                                  }
                                  return prev ? `${prev}\n${formattedLine}` : formattedLine;
                                });

                                setSelectedCifCodes(prev => Array.from(new Set([...prev, item.code])));
                              }}
                              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <PlusCircle className="w-3 h-3" />
                              <span>{isSelected ? 'Reinsertar en texto' : '+ Agregar código'}</span>
                            </button>
                            <span className="text-slate-400 font-mono text-[10px]">
                              {item.domain === 'e' ? item.defaultQualifier : cifSeverityQualifier}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Textarea del Diagnóstico Funcional CIF */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <span>Texto Oficial del Diagnóstico Funcional CIF:</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Editable libremente · Se imprimirá en la sección 7 del informe consolidado
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={functionalDiagnosisCIF}
                    onChange={e => setFunctionalDiagnosisCIF(e.target.value)}
                    placeholder="Describa el diagnóstico funcional CIF completo: Funciones corporales (b), Estructuras (s), Actividades y participación (d), Factores ambientales (e) y Síntesis diagnóstica kinésica..."
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-sans leading-relaxed focus:ring-2 focus:ring-blue-500 outline-hidden bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Bloque: Objetivos Terapéuticos Corto y Largo Plazo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* 1. Corto Plazo */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-blue-600" />
                        <span>Objetivos a Corto Plazo (SMART: 4 - 8 Semanas)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Metas medibles y específicas orientadas a la función
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const goals = generateShortTermGoals(
                          currentPatient,
                          evaluationsData[currentPatient?.id || '']
                        );
                        setTherapeuticGoalsShortTerm(goals);
                      }}
                      className="text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Sugerir SMART</span>
                    </button>
                  </div>

                  {/* Chips de Inserción Rápida */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {[
                      { label: '+ Equilibrio estático y dinámico', text: 'Mejorar el equilibrio estático y dinámico monopodal durante 6 segundos alternando extremidades en circuito de psicomotricidad.' },
                      { label: '+ Disociación de cinturas', text: 'Desarrollar disociación escapular y pélvica en saltos bipodales y marcha en tándem sin caídas.' },
                      { label: '+ Regulación de alerta', text: 'Favorecer la autorregulación motriz mediante actividades de trabajo pesado para lograr 20 min de atención sostenida en mesa.' },
                      { label: '+ Prensión y fuerza manual', text: 'Graduar la fuerza propioceptiva y prensión funcional en tareas de destreza bimanual y uso de tijeras/lápiz.' },
                      { label: '+ Tummy Time y rolado (Bebés)', text: 'Consolidar control cefálico estable en prono 5 min continuos y rolado bidireccional fluido.' }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTherapeuticGoalsShortTerm(prev => prev ? `${prev}\n• ${chip.text}` : `• ${chip.text}`);
                        }}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={therapeuticGoalsShortTerm}
                    onChange={e => setTherapeuticGoalsShortTerm(e.target.value)}
                    placeholder="1) Lograr control cefálico estable en prono...\n2) Mejorar equilibrio dinámico monopodal..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                  />
                </div>

                {/* 2. Largo Plazo */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Objetivos a Largo Plazo (3 - 6 Meses)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Metas de autonomía global y participación escolar/familiar
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const goals = generateLongTermGoals(
                          currentPatient,
                          evaluationsData[currentPatient?.id || '']
                        );
                        setTherapeuticGoalsLongTerm(goals);
                      }}
                      className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Sugerir Metas</span>
                    </button>
                  </div>

                  {/* Chips de Inserción Rápida */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {[
                      { label: '+ Perfil psicomotor eutráxico', text: 'Alcanzar un perfil psicomotor armónico y eutráxico que permita la participación activa y coordinada en juegos de recreo y educación física.' },
                      { label: '+ Marcha y transiciones fluidas', text: 'Consolidar transiciones posturales fluidas desde el suelo a bipedestación y marcha independiente funcional en desniveles.' },
                      { label: '+ Autonomía en AVD', text: 'Consolidar autonomía en actividades de la vida diaria: vestido, abotonado, manipulación de cubiertos y prensión eficaz del lápiz.' },
                      { label: '+ Autorregulación sensorial', text: 'Desarrollar estrategias autónomas de autorregulación frente a ruidos, transiciones escolares y espacios masivos.' }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTherapeuticGoalsLongTerm(prev => prev ? `${prev}\n• ${chip.text}` : `• ${chip.text}`);
                        }}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={therapeuticGoalsLongTerm}
                    onChange={e => setTherapeuticGoalsLongTerm(e.target.value)}
                    placeholder="1) Consolidar marcha autónoma en superficies irregulares...\n2) Participación activa y coordinada en juegos escolares..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                  />
                </div>

              </div>

              {/* Plan de Intervención y Frecuencia Kinésica */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      <span>Plan de Intervención Detallado y Frecuencia Kinésica</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Modalidad, sesiones semanales, abordajes terapéuticos y controles de reevaluación
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const plan = generateTreatmentPlan(
                        currentPatient,
                        evaluationsData[currentPatient?.id || '']
                      );
                      setTreatmentPlan(plan);
                    }}
                    className="text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Sugerir Plan Detallado</span>
                  </button>
                </div>

                {/* Chips de Frecuencia y Técnicas */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    { label: '• 2 sesiones/sem (45 min) + Control a 3 meses', text: 'FRECUENCIA: 2 sesiones semanales de 45 minutos presenciales. Reevaluación estandarizada formal a los 3 meses (12 semanas).' },
                    { label: '• Circuitos psicomotores y praxias', text: 'ABORDAJE: Circuitos motores de obstáculos para potenciar praxia global, equilibrio dinámico y coordinación óculo-pedal.' },
                    { label: '• Dieta sensorial y trabajo pesado', text: 'SENSORIAL: Dieta sensorial clínica con actividades de trabajo pesado propioceptivo (empuje, tracción, suspensión).' },
                    { label: '• Concepto Bobath y Tummy Time', text: 'NEURODESARROLLO: Enfoque Bobath para facilitación de hitos motores y pautas de Tummy Time graduado.' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTreatmentPlan(prev => prev ? `${prev}\n\n${preset.text}` : preset.text);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={treatmentPlan}
                  onChange={e => setTreatmentPlan(e.target.value)}
                  placeholder="FRECUENCIA: 2 sesiones semanales de 45 minutos...\n1. Neurorehabilitación sensoriomotriz...\n2. Dieta sensorial propioceptiva..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Recomendaciones Detalladas para el Hogar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        Recomendaciones Detalladas para el Hogar (Familia & Cuidadores)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Pautas prácticas diarias, juegos con sentido y adaptaciones ambientales en casa
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const list = getRecommendedHomeList(
                        currentPatient,
                        evaluationsData[currentPatient?.id || '']
                      );
                      const text = list.join('\n');
                      setHomeRecommendations(text);
                      setHomeAndSchoolRecommendations([text, schoolRecommendations].filter(Boolean).join('\n\n'));
                    }}
                    className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Cargar Banco Hogar</span>
                  </button>
                </div>

                {/* Tarjetas Interactivas de Recomendaciones Hogar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {HOME_RECOMMENDATIONS_BANK.map(item => {
                    const isAdded = homeRecommendations.includes(item.title);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          const snippet = `• ${item.title}: ${item.description}`;
                          setHomeRecommendations(prev => {
                            const updated = prev.includes(item.title) ? prev : prev ? `${prev}\n${snippet}` : snippet;
                            setHomeAndSchoolRecommendations([updated, schoolRecommendations].filter(Boolean).join('\n\n'));
                            return updated;
                          });
                        }}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-medium'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                          <span>{item.category}</span>
                          <span className={isAdded ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                            {isAdded ? '✓ Agregado' : '+ Agregar'}
                          </span>
                        </div>
                        <strong className="block text-xs text-slate-900 leading-tight">
                          {item.title}
                        </strong>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={4}
                  value={homeRecommendations}
                  onChange={e => {
                    setHomeRecommendations(e.target.value);
                    setHomeAndSchoolRecommendations([e.target.value, schoolRecommendations].filter(Boolean).join('\n\n'));
                  }}
                  placeholder="• Trabajo Pesado antes de tareas: ayudar a empujar canastas de juguetes...\n• Rincón de la calma con cojines y luces tenues...\n• Juego descalzo en superficies variadas para propiocepción..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Recomendaciones Detalladas para el Sistema Educativo */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                          Recomendaciones para el Sistema Educativo (Jardín / Escuela / Aula PIE)
                        </h4>
                        {calculatePatientAge(currentPatient?.birthDate).isOlderThanThree ? (
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                            Paciente &gt; 3 años
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            &lt; 3 años (Sala cuna / Hogar)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Pautas para educadoras de párvulos, profesores de Educación Física y equipo PIE
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const list = getRecommendedSchoolList(
                        currentPatient,
                        evaluationsData[currentPatient?.id || '']
                      );
                      const text = list.join('\n');
                      setSchoolRecommendations(text);
                      setHomeAndSchoolRecommendations([homeRecommendations, text].filter(Boolean).join('\n\n'));
                    }}
                    className="text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Cargar Banco Educativo</span>
                  </button>
                </div>

                {/* Tarjetas Interactivas de Recomendaciones Escuela */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {SCHOOL_RECOMMENDATIONS_BANK.map(item => {
                    const isAdded = schoolRecommendations.includes(item.title);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          const snippet = `• ${item.title}: ${item.description}`;
                          setSchoolRecommendations(prev => {
                            const updated = prev.includes(item.title) ? prev : prev ? `${prev}\n${snippet}` : snippet;
                            setHomeAndSchoolRecommendations([homeRecommendations, updated].filter(Boolean).join('\n\n'));
                            return updated;
                          });
                        }}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-blue-50/90 border-blue-300 text-blue-950 font-medium'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                          <span>{item.category}</span>
                          <span className={isAdded ? 'text-blue-600 font-black' : 'text-slate-400'}>
                            {isAdded ? '✓ Agregado' : '+ Agregar'}
                          </span>
                        </div>
                        <strong className="block text-xs text-slate-900 leading-tight">
                          {item.title}
                        </strong>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={4}
                  value={schoolRecommendations}
                  onChange={e => {
                    setSchoolRecommendations(e.target.value);
                    setHomeAndSchoolRecommendations([homeRecommendations, e.target.value].filter(Boolean).join('\n\n'));
                  }}
                  placeholder="• Pausas activas sensoriomotoras cada 25-30 minutos...\n• Ubicación estratégica en la primera fila, centrado a la pizarra...\n• Apoyos propioceptivos en pupitre (elástico en patas de la silla)..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Barra Final de Guardado y Consolidación */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Evaluación Clínica y Diagnóstico CIF Completados
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Guarda los cambios o genera directamente el informe médico consolidado en Word y PDF
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAll}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-blue-600" />
                    <span>Guardar Diagnóstico & Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateAndOpenReport}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer hover:scale-102"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>Generar Informe Consolidado (Word / PDF)</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Floating Sticky Save Bar when there are unsaved changes */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Modificaciones sin Guardar
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-xs text-slate-200">
                Has modificado la ficha de <strong className="text-white">{currentPatient ? `${currentPatient.firstName} ${currentPatient.lastName}` : 'este paciente'}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios Ahora (Ctrl + S)</span>
            </button>
          </div>
        </div>
      )}

      {/* Online SPM Modal */}
      <SPMOnlineFormModal
        patientId={currentPatient?.id || ''}
        patientName={`${currentPatient?.firstName || ''} ${currentPatient?.lastName || ''}`}
        initialAgeGroup={modalSpmAgeGroup}
        isOpen={showSPMLinkModal}
        onClose={() => setShowSPMLinkModal(false)}
        onSubmitResults={handleApplySPMOnlineResults}
      />

    </div>
  );
};

import { User, PatientAnamnesis, ClinicalEvaluations, ProgressNote, ComprehensiveReport, SessionResult, AnonymizedClinicalCase } from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'kinesfera_patients_data_v2',
  ANAMNESIS: 'kinesfera_anamnesis_data_v2',
  EVALUATIONS: 'kinesfera_evaluations_data_v2',
  PROGRESS_NOTES: 'kinesfera_progress_notes_data_v2',
  REPORTS: 'kinesfera_comprehensive_reports_data_v2',
  SESSION_HISTORY: 'kinesfera_session_history_data_v2',
  BACKUP: 'kinesfera_clinical_full_backup_v2',
  ANONYMIZED_CASES: 'kinesfera_anonymized_clinical_cases_v2',
  SELECTED_PATIENT_ID: 'kinesfera_selected_patient_id'
};

// Fallback patients (Miranda Victoria, Mauro Valentino, Wagner Amir, and Blaz)
const DEFAULT_FALLBACK_PATIENTS: User[] = [
  {
    id: 'patient_mauro_mora',
    email: 'familia.mora@kinesfera.cl',
    role: 'Padre/Niño',
    firstName: 'Mauro Valentino',
    lastName: 'Mora Cofre',
    rut: '28.314.590-1',
    birthDate: '2024-02-09',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 90,
    assignedExercise: 'armsUp',
    diagnosis: 'Plagiocefalia posicional derecha y tortícolis postural congénita',
    medicalRecordNumber: 'KIN-2024-042',
    emergencyContact: {
      name: 'Padres de Mauro',
      relationship: 'Madre / Padre',
      phone: '+56 9 8456 1234'
    },
    avatarConfig: {
      skinTone: '#F1C27D',
      hairColor: '#3B2F2F',
      shirtColor: '#0284C7'
    }
  },
  {
    id: 'patient_miranda_coromoto',
    email: 'miranda.coromoto@kinesfera.cl',
    role: 'Padre/Niño',
    firstName: 'Miranda Victoria',
    lastName: 'Coromoto Ramos',
    rut: '27.145.892-3',
    birthDate: '2019-05-13',
    gender: 'Mujer',
    plan: 'Premium',
    credits: 80,
    assignedExercise: 'armsUp',
    diagnosis: 'Déficit de Atención',
    medicalRecordNumber: 'KIN-2026-089',
    emergencyContact: {
      name: 'Padres de Miranda',
      relationship: 'Madre / Padre',
      phone: '+56 9 8456 1234'
    },
    avatarConfig: {
      skinTone: '#F1C27D',
      hairColor: '#4A3728',
      shirtColor: '#0284C7'
    }
  },
  {
    id: 'patient_wagner_vasquez',
    email: 'familia.vasquez@kinesfera.cl',
    role: 'Padre/Niño',
    firstName: 'Wagner Amir',
    lastName: 'Vásquez Venegas',
    rut: '25.918.442-9',
    birthDate: '2015-01-23',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 75,
    assignedExercise: 'squats',
    diagnosis: 'Trastorno del Espectro Autista (TEA) · Integración Sensorial',
    medicalRecordNumber: 'KIN-2024-108',
    emergencyContact: {
      name: 'Familia de Wagner',
      relationship: 'Madre / Padre',
      phone: '+56 9 8456 1234'
    },
    avatarConfig: {
      skinTone: '#E0AC69',
      hairColor: '#1F2937',
      shirtColor: '#10B981'
    }
  },
  {
    id: 'patient_blaz_01',
    email: 'blaz@kinesfera.cl',
    role: 'Padre/Niño',
    firstName: 'Blaz',
    lastName: '',
    rut: '26.840.119-K',
    birthDate: '2022-04-12',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 60,
    assignedExercise: 'squats',
    diagnosis: 'Kinesiología Pediátrica · Evaluación del Neurodesarrollo y Psicomotricidad',
    medicalRecordNumber: 'NN-104',
    emergencyContact: {
      name: 'Tutor / Familia de Blaz',
      relationship: 'Madre / Padre',
      phone: '+56 9 8456 1234'
    },
    avatarConfig: {
      skinTone: '#E0AC69',
      hairColor: '#3B2F2F',
      shirtColor: '#00A8B5'
    }
  }
];

const DEFAULT_FALLBACK_ANAMNESIS: Record<string, PatientAnamnesis> = {
  patient_mauro_mora: {
    id: 'anam_patient_mauro_mora',
    patientId: 'patient_mauro_mora',
    evaluatorName: 'Aldo Olivares Araya',
    evaluationDate: '2024-06-06',
    ageCategory: 'bebe_hasta_18_meses',
    caregiverName: 'Padres de Mauro',
    caregiverPhone: '+56 9 8456 1234',
    schoolOrCenter: 'Cuidado en el hogar',
    educationalLevel: 'Lactante (4 meses)',
    pieSupport: false,
    householdMembers: 'Madre, Padre y Mauro',
    consultationReason: 'Mauro asiste a evaluación kinesiológica por asimetría craneal posterior derecha observada por sus padres y pediatra, asociada a preferencia postural de cabeza hacia la derecha y limitación activa de giro cervical hacia la izquierda.',
    problemNoticedWhen: 'A los 2 meses de vida',
    specialistsVisited: 'Pediatra de cabecera',
    previousTreatments: 'Indicaciones de reposicionamiento básico en cuna',
    familyExpectations: 'Recuperar la simetría de la cabecita, recuperar la movilidad de cuello y recibir pautas prácticas de estimulación y posicionamiento en el hogar.',
    pregnancyHistory: 'Embarazo único, controlado, sin complicaciones perinatales.',
    gestationalAgeWeeks: '39 semanas',
    birthWeightGrams: '3420 g',
    birthLengthCm: '50 cm',
    birthType: 'Parto por cesárea',
    birthPresentation: 'Cefálica',
    apgarScore: '9/10',
    neonatalComplications: 'Sin complicaciones perinatales',
    surgeries: 'Sin cirugías',
    assistiveDevices: 'Ninguna',
    feedingType: 'Lactancia materna exclusiva',
    sleepPattern: 'Sueño nocturno de 8 a 9 horas con preferencia de apoyo sobre hemicráneo derecho.',
    headControlMonths: '3 meses',
    independentSittingMonths: 'En desarrollo',
    crawlingMonths: 'En desarrollo',
    standingMonths: 'En desarrollo',
    walkingMonths: 'En desarrollo',
    currentMotorStatus: 'Movilidad activa en supino con pataleo simétrico. En prono tolera apoyo en antebrazos con fatiga progresiva. Limitación de rotación cervical izquierda a 45° con restricción miofascial.',
    followsInstructions: 'Atento al contacto visual, sonríe a estímulos vocales y auditivos.',
    isRestless: 'Tranquilo durante la sesión, tolera las maniobras de valoración y movilización.',
    medicalDiagnoses: 'Plagiocefalia posicional derecha moderada y tortícolis postural congénita',
    pharmacology: 'Sin fármacos',
    allergicConditions: 'Sin alergias',
    cranialMeasurements: {
      d1Mm: 145,
      d2Mm: 132,
      differenceMm: 13,
      apMm: 135,
      bpMm: 119,
      cephalicIndex: 88.1,
      plagiocephalySeverity: 'Moderada (10-12 mm)',
      brachycephalyClassification: 'Braquicefalia (> 85%)',
      cervicalRomRightDegInitial: 80,
      cervicalRomLeftDegInitial: 45,
      cervicalRomRightDegFinal: 85,
      cervicalRomLeftDegFinal: 80,
      intermediateD1Mm: 142,
      intermediateD2Mm: 135,
      intermediateDifferenceMm: 7,
      finalD1Mm: 139,
      finalD2Mm: 136,
      finalDifferenceMm: 3
    }
  },
  patient_wagner_vasquez: {
    id: 'anam_patient_wagner_vasquez',
    patientId: 'patient_wagner_vasquez',
    evaluatorName: 'Aldo Olivares Araya',
    evaluationDate: '2024-09-24',
    ageCategory: 'mayor_2_anos',
    caregiverName: 'Familia de Wagner',
    caregiverPhone: '+56 9 8456 1234',
    schoolOrCenter: 'Colegio Adventista de Copiapó',
    educationalLevel: '4° básico',
    pieSupport: true,
    householdMembers: 'Padres y hermano menor',
    consultationReason: 'Wagner asiste a evaluación kinésica y psicomotriz derivado por Neurología Infantil en el contexto de su diagnóstico de Trastorno del Espectro Autista. Se busca evaluar su perfil sensoriomotriz (SPM-2) y organización psicomotora (batería da Fonseca) para fortalecer su autorregulación, equilibrio y autonomía escolar.',
    problemNoticedWhen: 'Desde etapa preescolar, con mayor desafío en el ámbito escolar',
    specialistsVisited: 'Neurólogo infantil, terapeuta ocupacional',
    previousTreatments: 'Apoyo PIE escolar y terapia ocupacional previa',
    familyExpectations: 'Mejorar tolerancia a estímulos sensoriales, equilibrio dinámico y coordinación para el juego con pares.',
    pregnancyHistory: 'Parto de término a las 38 semanas sin complicaciones agudas.',
    gestationalAgeWeeks: '38 semanas',
    birthWeightGrams: '3200 g',
    birthLengthCm: '49 cm',
    birthType: 'Parto por cesárea',
    birthPresentation: 'Cefálica',
    apgarScore: '9/10',
    neonatalComplications: 'Sin complicaciones perinatales',
    surgeries: 'Sin cirugías',
    assistiveDevices: 'Ninguna',
    sleepPattern: 'Sueño adecuado con rutina de descanso estructurada.',
    headControlMonths: '3 meses',
    independentSittingMonths: '6 meses',
    crawlingMonths: '9 meses',
    standingMonths: '11 meses',
    walkingMonths: '13 meses',
    currentMotorStatus: 'Marcha independiente, dismetrías leves en saltos coordinados y agarre del lápiz con presión moderada.',
    followsInstructions: 'Colaborador y receptivo a dinámicas estructuradas con apoyos visuales.',
    medicalDiagnoses: 'Trastorno del Espectro Autista (TEA)',
    pharmacology: 'Sin fármacos permanentes',
    allergicConditions: 'Sin alergias conocidas'
  },
  patient_miranda_coromoto: {
    id: 'anam_patient_miranda_coromoto',
    patientId: 'patient_miranda_coromoto',
    evaluatorName: 'Aldo Olivares Araya',
    evaluationDate: '2026-09-24',
    ageCategory: 'mayor_2_anos',
    caregiverName: 'Padres de Miranda',
    caregiverPhone: '+56 9 8456 1234',
    schoolOrCenter: 'Colegio San Agustín',
    educationalLevel: '1° básico',
    pieSupport: true,
    householdMembers: 'Padres y Miranda (duerme con sus padres)',
    consultationReason: 'Miranda asiste a consulta derivada por su neuróloga, debido a un diagnóstico de Trastorno por Déficit Atencional. Se encuentra cursando 1° básico y desde el inicio de la etapa escolar se han observado dificultades en la concentración y en el rendimiento académico, especialmente en las asignaturas de Lenguaje y Matemáticas. La lectura se está adquiriendo, pero aún no es fluida.',
    problemNoticedWhen: 'Al inicio de la etapa escolar de 1° básico',
    specialistsVisited: 'Neuróloga infantil',
    previousTreatments: 'Control neurológico y pediátrico',
    familyExpectations: 'Mejorar concentración, rendimiento escolar en lectura y matemáticas, organización espacial y autonomía en el hogar.',
    pregnancyHistory: 'Nació a las 37 semanas por parto de cesárea, sin complicaciones perinatales.',
    gestationalAgeWeeks: '37 semanas',
    birthWeightGrams: '3100 g',
    birthLengthCm: '49 cm',
    birthType: 'Parto por cesárea',
    birthPresentation: 'Cefálica',
    apgarScore: '9/10',
    neonatalComplications: 'Sin complicaciones perinatales',
    surgeries: 'Sin cirugías',
    assistiveDevices: 'Ninguna',
    feedingType: 'Alimentación regular, suplementación con Omega 3',
    sleepPattern: 'En cuanto al sueño, no presenta despertares nocturnos, duerme con sus padres.',
    headControlMonths: '3 meses',
    independentSittingMonths: '6 meses',
    crawlingMonths: '8 meses',
    standingMonths: '10 meses',
    walkingMonths: '12 meses',
    currentMotorStatus: 'A nivel de autonomía, se limpia con algunas dificultades. No se reportan antecedentes familiares relevantes ni enfermedades previas de importancia.',
    followsInstructions: 'Buena comprensión de instrucciones, mostrando buena motivación por la actividad, moderada tolerancia a la frustración, moderado nivel de impulsividad y con bajos indicadores de fatigabilidad.',
    isRestless: 'Actualmente, utiliza el celular entre 1 y 2 horas diarias.',
    medicalDiagnoses: 'Déficit de Atención',
    pharmacology: 'Recibe suplementación con Omega 3. Sin fármacos psicotrópicos reportados.',
    allergicConditions: 'Sin alergias'
  },
  patient_blaz_01: {
    id: 'anam_patient_blaz_01',
    patientId: 'patient_blaz_01',
    evaluatorName: 'Klgo. Aldo Olivares Araya',
    evaluationDate: new Date().toISOString().slice(0, 10),
    ageCategory: 'mayor_2_anos',
    caregiverName: 'Familia de Blaz',
    caregiverPhone: '+56 9 8456 1234',
    schoolOrCenter: 'Jardín Infantil Copiapó',
    educationalLevel: 'Nivel Medio Mayor',
    pieSupport: false,
    householdMembers: 'Madre, Padre, Blaz',
    consultationReason: 'Evaluación de psicomotricidad y patrones motores del desarrollo infantil',
    problemNoticedWhen: 'Familia consulta para optimizar coordinación, equilibrio y juego motor adaptado',
    specialistsVisited: 'Pediatra de cabecera',
    previousTreatments: 'Control de niño sano',
    familyExpectations: 'Favorecer autonomía, integración sensorio-motriz y juego activo con sentido',
    pregnancyHistory: 'Embarazo controlado sin complicaciones',
    gestationalAgeWeeks: '39 semanas',
    birthWeightGrams: '3350 g',
    birthLengthCm: '50 cm',
    birthType: 'Parto vaginal eutócico',
    birthPresentation: 'Cefálica',
    apgarScore: '9/10',
    neonatalComplications: 'Sin complicaciones reportadas',
    surgeries: 'Sin cirugías',
    assistiveDevices: 'Ninguna',
    feedingType: 'Lactancia mixta inicial, alimentación complementaria normal',
    colic: 'Ocasionales en primeros 3 meses',
    sleepPattern: 'Sueño nocturno estructurado de 9 a 10 horas',
    headControlMonths: '3 meses',
    independentSittingMonths: '6 meses',
    crawlingMonths: '8 meses',
    standingMonths: '10 meses',
    walkingMonths: '12 meses',
    firstWords: '11 meses',
    firstPhrases: '20 meses',
    currentMotorStatus: 'Marcha independiente activa, en proceso de consolidación de salto bipodal y equilibrio monopodal',
    followsInstructions: 'Sigue instrucciones lúdicas y demostrativas con motivación positiva',
    isRestless: 'Activo durante el juego libre, busca movimiento y exploración sensorial',
    playsAloneOrAccompanied: 'Juego interactivo y compartido con mediación del adulto',
    medicalDiagnoses: 'Evaluación del neurodesarrollo motor y psicomotricidad infantil',
    pharmacology: 'Sin medicamentos permanentes',
    allergicConditions: 'Sin alergias conocidas'
  }
};

const DEFAULT_FALLBACK_EVALUATIONS: Record<string, ClinicalEvaluations> = {
  patient_mauro_mora: {
    id: 'eval_patient_mauro_mora',
    patientId: 'patient_mauro_mora',
    evaluationDate: '2024-06-06',
    evaluatorName: 'Aldo Olivares Araya',
    patientAgeCategory: 'menor_2_anos',
    gmfcsLevel: 'Nivel I',
    macsLevel: 'Nivel I',
    eedpOrTepsiScore: 'EEDP: Coeficiente de desarrollo psicomotor normal (0.92)',
    ashworthScore: '0',
    tonePattern: 'Normotonía en 4 extremidades con hipertonía leve en ECM derecho',
    deepTendonReflexes: 'Normales ++/++++ rotulianos y bicipitales simétricos',
    hipFlexionExt: '150° / 0°',
    kneeFlexionExt: '140° / 0°',
    ankleDorsiflexion: '30° bilateral',
    shoulderMobility: 'Completa sin restricciones pasivas',
    headAndTrunkControl: 'Control cefálico en desarrollo, con fatiga en prono prolongado',
    rightingReactions: 'Presentes en supino y sedente asistido',
    protectiveResponses: 'Reacciones de enderezamiento presentes con soporte',
    balanceSittingAndStanding: 'Sedente con asistencia',
    transferAbility: 'Giros espontáneos a la derecha, en facilitación hacia la izquierda',
    gaitObservation: 'Etapa pre-marcha (lactante 4 meses)',
    sensoryProfile: 'Responde a estímulos auditivos y visuales con mayor atención a la derecha',
    followsCommands: false,
    functionalDiagnosisCIF: 'Lactante de 4 meses con asimetría craneal posicional moderada (diferencia de 13 mm) y restricción de movilidad activa cervical izquierda secundaria a tortícolis postural. Se evidencia conservación de hitos motores globales con necesidad de estimulación kinésica simétrica.',
    initialConclusions: 'Diagnóstico kinésico de Plagiocefalia postural moderada derecha con limitación de rango cervical izquierdo. Pronóstico de recuperación favorable mediante terapia motriz, Tummy Time y pautas de higiene postural familiar.',
    prognosis: 'Favorable con alta adherencia a recomendaciones en el hogar y control periódico.',
    interventionGoals: [
      'Alcanzar la simetría de la bóveda craneal reduciendo la diferencia diagonal por debajo de 5 mm.',
      'Restablecer el rango completo de rotación cervical izquierda (80°-90°) sin dolor ni compensaciones.',
      'Fortalecer la musculatura extensora del cuello y tronco mediante Tummy Time (guatita abajo) activo.',
      'Promover giros coordinados y simétricos hacia ambos lados en colchoneta.',
      'Capacitar a la familia en posiciones de porteo, juego y descanso para evitar puntos de presión continua.'
    ],
    therapeuticGoalsShortTerm: 'Lograr 70° de rotación cervical izquierda y tolerancia a 15 minutos acumulados de Tummy Time diario.',
    therapeuticGoalsLongTerm: 'Simetría craneal completa (< 3 mm de diferencia) e hitos de sedestación independiente consolidados.',
    treatmentPlan: 'Kinesioterapia motriz y sensoriomotriz 1 a 2 veces por semana, movilizaciones cervicales miofasciales suaves y juego con sentido Kinesfera.',
    homeRecommendations: 'Posicionamiento alternado durante el sueño, uso de juguetes sonoros hacia el lado izquierdo y juego en colchoneta supervisado.',
    schoolRecommendations: 'No aplica (lactante).'
  },
  patient_wagner_vasquez: {
    id: 'eval_patient_wagner_vasquez',
    patientId: 'patient_wagner_vasquez',
    evaluationDate: '2024-09-24',
    evaluatorName: 'Aldo Olivares Araya',
    patientAgeCategory: 'mayor_2_anos',
    gmfcsLevel: 'Nivel I',
    macsLevel: 'Nivel I',
    eedpOrTepsiScore: 'Desarrollo motor grueso funcional con dispraxia leve',
    ashworthScore: '0',
    tonePattern: 'Normotonía con fluctuación tónica durante tareas de alta demanda atencional',
    deepTendonReflexes: 'Normales ++/++++ rotulianos y bicipitales simétricos',
    hipFlexionExt: '120° / 0°',
    kneeFlexionExt: '135° / 0°',
    ankleDorsiflexion: '20°',
    shoulderMobility: 'Completa sin restricciones',
    headAndTrunkControl: 'Conservado y estable',
    rightingReactions: 'Presentes y funcionales',
    protectiveResponses: 'Presentes en todos los planos',
    balanceSittingAndStanding: 'Dificultades leves en apoyo unipodal estático',
    transferAbility: 'Independiente en todas las transiciones',
    gaitObservation: 'Marcha independiente, leve disociación en balanceo de brazos',
    sensoryProfile: 'SPM-2: Dificultades moderadas en reactividad táctil y conciencia corporal',
    followsCommands: true,
    functionalDiagnosisCIF: 'Escolar de 9 años con diagnóstico de TEA que presenta desafíos en modulación sensorial (SPM-2: reactividad táctil y conciencia corporal) y dispraxia moderada en la batería de Vítor da Fonseca (equilibrio dinámico y praxia fina).',
    initialConclusions: 'Evaluación kinésica y psicomotriz compatible con necesidades de integración vestibular-propioceptiva, regulación tónica y estructuración temporo-espacial para el desempeño escolar y recreativo.',
    prognosis: 'Favorable con intervención psicomotriz continua y adecuaciones sensoriomotrices en el aula.',
    therapeuticGoalsShortTerm: '1. Modular fuerza manual y agarre del lápiz con menor fatiga.\n2. Mejorar estabilidad en circuitos motores de salto y balanceo.',
    therapeuticGoalsLongTerm: '1. Optimizar autorregulación e integración sensoriomotriz en aula escolar.\n2. Afianzar praxias globales y coordinación visomotora.',
    homeRecommendations: 'Promover pausas sensoriales activas de 5 minutos, juegos de tracción/empuje y actividades al aire libre.',
    schoolRecommendations: 'Apoyo PIE con adaptaciones en tiempos de descanso motor y descansos propioceptivos durante la jornada.',
    interventionGoals: [
      'Contribuir al desarrollo de una óptima integración sensorio-motriz que favorezca el aprendizaje y la autorregulación.',
      'Regulación del tono muscular, la fuerza y la energía para una mejor ejecución motora.',
      'Mejorar el equilibrio, las reacciones de protección y la coordinación vestibular al moverse o saltar.',
      'Potenciar la noción del cuerpo, la conciencia corporal y el mapa mental propioceptivo.',
      'Afianzar la estructuración espacio-temporal para una mejor orientación en rutinas escolares y papel.',
      'Favorecer la praxia global y fina, con especial énfasis en la grafomotricidad.',
      'Desarrollar la atención sostenida a través del juego y el movimiento guiado.',
      'Entregar estrategias de regulación sensorial a la familia y al colegio PIE.'
    ],
    daFonsecaBpm: {
      tonicityExtensibility: 3,
      tonicityPassivity: 3,
      tonicityParatonia: 3,
      tonicityDiadochokinesia: 3,
      tonicitySynkinesia: 3,
      tonicityScore: 3,
      equilibriumImmobility: 2,
      equilibriumStatic: 2,
      equilibriumDynamic: 2,
      equilibriumScore: 2,
      lateralityOcular: 3,
      lateralityAuditory: 3,
      lateralityManual: 3,
      lateralityPodal: 3,
      lateralityProfile: 'Diestro Completo',
      lateralityScore: 3,
      bodyNotionKinesthetic: 2,
      bodyNotionRightLeft: 2,
      bodyNotionAutoimage: 2,
      bodyNotionGesturesImitation: 2,
      bodyNotionScore: 2,
      spatialOrientation: 2,
      spatialOrganization: 2,
      spatialRhythmStructure: 2,
      spatialTemporalScore: 2,
      globalPraxiaOculomanual: 2,
      globalPraxiaOculopodal: 2,
      globalPraxiaDysmetria: 2,
      globalPraxiaDissociation: 2,
      globalPraxiaScore: 2,
      finePraxiaDynamicCoordination: 3,
      finePraxiaDigitalDrumming: 3,
      finePraxiaGraphomotorSpeed: 3,
      finePraxiaScore: 3,
      totalScore: 17,
      profileResult: 'Perfil Dispráxico (14-21 puntos)',
      conclusions: 'Dificultades en equilibrio estático/dinámico y estructuración espacial, con buena conservación de tonicidad y praxia fina.'
    },
    spmSensoryMeasure: {
      socialParticipationScore: 62,
      socialParticipationRange: 'Dificultades Moderadas (60-69)',
      visionScore: 61,
      visionRange: 'Dificultades Moderadas (60-69)',
      hearingScore: 50,
      hearingRange: 'Típico (40-59)',
      touchScore: 63,
      touchRange: 'Dificultades Moderadas (60-69)',
      tasteSmellScore: 48,
      tasteSmellRange: 'Típico (40-59)',
      bodyAwarenessScore: 67,
      bodyAwarenessRange: 'Dificultades Moderadas (60-69)',
      balanceMotionScore: 62,
      balanceMotionRange: 'Dificultades Moderadas (60-69)',
      planningIdeasScore: 61,
      planningIdeasRange: 'Dificultades Moderadas (60-69)',
      totalSensoryScore: 62,
      totalSensoryRange: 'Dificultades Moderadas (60-69)',
      applicationMethod: 'presencial',
      respondentName: 'Familia de Wagner'
    },
    treatmentPlan: 'Programa de intervención psicomotriz Kinesfera 1 a 2 sesiones semanales enfocado en circuitos vestibulares, propiocepción y juego reglado.'
  },
  patient_blaz_01: {
    id: 'eval_patient_blaz_01',
    patientId: 'patient_blaz_01',
    evaluationDate: new Date().toISOString().slice(0, 10),
    evaluatorName: 'Klgo. Aldo Olivares Araya',
    gmfcsLevel: 'Nivel I',
    macsLevel: 'Nivel I',
    eedpOrTepsiScore: 'Desarrollo psicomotor acorde a edad cronológica',
    ashworthScore: '0',
    tonePattern: 'Normotonía con adecuada extensibilidad miotendinosa',
    deepTendonReflexes: 'Normales ++/++++ rotulianos y bicipitales simétricos',
    hipFlexionExt: '120° / 0°',
    kneeFlexionExt: '135° / 0°',
    ankleDorsiflexion: '20°',
    shoulderMobility: 'Completa sin restricciones',
    headAndTrunkControl: 'Conservado y estable en transiciones posturales',
    rightingReactions: 'Presentes en todos los planos espaciales',
    protectiveResponses: 'Presentes en plano anterior, lateral y posterior',
    balanceSittingAndStanding: 'Funcional, buen ajuste postural anticipatorio',
    transferAbility: 'Autónomo en suelo a bipedestación',
    gaitObservation: 'Marcha activa con adecuada cadencia y balanceo de brazos',
    sensoryProfile: 'Procesamiento sensorial armónico',
    patientAgeCategory: 'mayor_2_anos',
    followsCommands: true,
    daFonsecaBpm: {
      tonicityExtensibility: 3,
      tonicityPassivity: 3,
      tonicityParatonia: 3,
      tonicityDiadochokinesia: 3,
      tonicitySynkinesia: 3,
      tonicityScore: 3,
      equilibriumImmobility: 3,
      equilibriumStatic: 3,
      equilibriumDynamic: 3,
      equilibriumScore: 3,
      lateralityOcular: 3,
      lateralityAuditory: 3,
      lateralityManual: 3,
      lateralityPodal: 3,
      lateralityProfile: 'Diestro Completo',
      lateralityScore: 3,
      bodyNotionKinesthetic: 3,
      bodyNotionRightLeft: 2,
      bodyNotionAutoimage: 3,
      bodyNotionGesturesImitation: 3,
      bodyNotionScore: 3,
      spatialOrientation: 3,
      spatialOrganization: 3,
      spatialRhythmStructure: 3,
      spatialTemporalScore: 3,
      globalPraxiaOculomanual: 3,
      globalPraxiaOculopodal: 2,
      globalPraxiaDysmetria: 3,
      globalPraxiaDissociation: 2,
      globalPraxiaScore: 3,
      finePraxiaDynamicCoordination: 3,
      finePraxiaDigitalDrumming: 3,
      finePraxiaGraphomotorSpeed: 2,
      finePraxiaScore: 3,
      totalScore: 21,
      profileResult: 'Perfil Eupráxico (21-26 puntos)',
      conclusions: 'Buen desempeño general con área de oportunidad en disociación de cinturas y coordinación óculo-pédica.'
    },
    spmSensoryMeasure: {
      socialParticipationScore: 48,
      socialParticipationRange: 'Típico (40-59)',
      visionScore: 50,
      visionRange: 'Típico (40-59)',
      hearingScore: 52,
      hearingRange: 'Típico (40-59)',
      touchScore: 55,
      touchRange: 'Típico (40-59)',
      tasteSmellScore: 46,
      tasteSmellRange: 'Típico (40-59)',
      bodyAwarenessScore: 61,
      bodyAwarenessRange: 'Dificultades Moderadas (60-69)',
      balanceMotionScore: 58,
      balanceMotionRange: 'Típico (40-59)',
      planningIdeasScore: 54,
      planningIdeasRange: 'Típico (40-59)',
      totalSensoryScore: 53,
      totalSensoryRange: 'Típico (40-59)',
      applicationMethod: 'presencial',
      respondentName: 'Madre / Padre de Blaz'
    },
    functionalDiagnosisCIF: 'Blaz presenta adecuado potencial de desarrollo psicomotor con necesidad de estimulación kinésica orientada al ajuste vestibular-propioceptivo, equilibrio dinámico y coordinación bimanual.',
    therapeuticGoalsShortTerm: '1. Consolidar equilibrio dinámico monopodal y salto sobre obstáculos.\n2. Fortalecer control postural del tronco y disociación de cinturas en juegos de suelo.',
    therapeuticGoalsLongTerm: '1. Lograr integración sensorio-motriz óptima para actividades lúdicas grupales.\n2. Afianzar praxias globales y finas con autonomía e iniciativa en el entorno escolar.',
    treatmentPlan: 'Sesiones kinésicas lúdicas y psicomotrices semanales de 45 minutos basadas en el concepto Kinesfera (juego con sentido).',
    homeRecommendations: 'Promover juego al aire libre, circuitos motores con cojines, gateo y trepa supervisada en casa.',
    schoolRecommendations: 'Favorecer pausas activas motrices, permitir cambios de postura y felicitar sus logros de interacción motriz.'
  }
};

const DEFAULT_FALLBACK_PROGRESS_NOTES: ProgressNote[] = [
  {
    id: 'note_blaz_01',
    patientId: 'patient_blaz_01',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Particular',
    notes: 'Sesión psicomotriz inicial. Blaz participa activamente en circuitos de gateo, trepa en rampa de gomaespuma y lanzamientos dirigidos. Excelente conexión vincular. Indicaciones al hogar: juegos de carga en suelo y saltos rítmicos.',
    professionalName: 'Klgo. Aldo Olivares Araya'
  }
];

export const DEFAULT_DEMO_PATIENT_IDS = new Set([
  'patient_mauro_mora',
  'patient_miranda_coromoto',
  'patient_wagner_vasquez',
  'patient_blaz_01'
]);

export const clinicalStorage = {
  loadPatients(): User[] {
    try {
      // 1. Try primary storage key
      const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      // 2. Try legacy storage key
      const legacyRaw = localStorage.getItem('kinesfera_saved_patients');
      if (legacyRaw) {
        const parsedLegacy = JSON.parse(legacyRaw);
        if (Array.isArray(parsedLegacy)) {
          return parsedLegacy;
        }
      }

      return [];
    } catch (err) {
      console.error('Error reading patients from localStorage:', err);
      return [];
    }
  },

  savePatients(patients: User[]): void {
    try {
      const STAFF_ROLES = new Set(['Profesionales Clínicos', 'Educadores', 'Administrador (Neuronexin)']);
      // Keep all non-staff patient users, ensuring role is set to 'Padre/Niño' so UI filters never hide them
      const patientUsers = patients
        .filter(u => u && u.id && !STAFF_ROLES.has(u.role as string))
        .map(u => ({
          ...u,
          role: 'Padre/Niño' as const
        }));
      
      // Deduplicate patient users by id, preserving latest entry
      const uniqueMap = new Map<string, User>();
      patientUsers.forEach(p => uniqueMap.set(p.id, p));
      const safePatientUsers = Array.from(uniqueMap.values());

      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(safePatientUsers));
      localStorage.setItem('kinesfera_saved_patients', JSON.stringify(safePatientUsers));
      
      // Save individual backups for each patient
      safePatientUsers.forEach(p => {
        try {
          localStorage.setItem(`kinesfera_patient_backup_${p.id}`, JSON.stringify(p));
        } catch {
          // ignore quota warnings on single-item backup
        }
      });

      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving patients to localStorage:', err);
    }
  },

  saveSinglePatient(patient: User): void {
    try {
      const normalizedPatient: User = {
        ...patient,
        role: 'Padre/Niño'
      };
      const current = this.loadPatients();
      const existingIdx = current.findIndex(p => p.id === normalizedPatient.id);
      let updated: User[];
      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = normalizedPatient;
      } else {
        updated = [...current, normalizedPatient];
      }
      this.savePatients(updated);
      this.saveSelectedPatientId(normalizedPatient.id);
      localStorage.setItem(`kinesfera_patient_backup_${normalizedPatient.id}`, JSON.stringify(normalizedPatient));
    } catch (err) {
      console.error('Error saving single patient:', err);
    }
  },

  savePatientFullProfile(
    patient: User,
    anamnesis?: PatientAnamnesis,
    evaluations?: ClinicalEvaluations
  ): void {
    try {
      this.saveSinglePatient(patient);
      if (anamnesis) {
        const curAnam = this.loadAnamnesis();
        curAnam[patient.id] = anamnesis;
        this.saveAnamnesis(curAnam);
      }
      if (evaluations) {
        const curEval = this.loadEvaluations();
        curEval[patient.id] = evaluations;
        this.saveEvaluations(curEval);
      }
      const snapshot = {
        patient,
        anamnesis,
        evaluations,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`kinesfera_snapshot_${patient.id}`, JSON.stringify(snapshot));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving full patient profile snapshot:', err);
    }
  },

  loadAnamnesis(): Record<string, PatientAnamnesis> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ANAMNESIS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }

      const legacy = localStorage.getItem('kinesfera_saved_anamnesis');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (parsedLegacy && typeof parsedLegacy === 'object') {
          return parsedLegacy;
        }
      }

      return {};
    } catch (err) {
      console.error('Error reading anamnesis from localStorage:', err);
      return {};
    }
  },

  saveAnamnesis(data: Record<string, PatientAnamnesis>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ANAMNESIS, JSON.stringify(data));
      localStorage.setItem('kinesfera_saved_anamnesis', JSON.stringify(data));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving anamnesis:', err);
    }
  },

  loadEvaluations(): Record<string, ClinicalEvaluations> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }

      const legacy = localStorage.getItem('kinesfera_saved_evaluations');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (parsedLegacy && typeof parsedLegacy === 'object') {
          return parsedLegacy;
        }
      }

      return {};
    } catch (err) {
      console.error('Error reading evaluations from localStorage:', err);
      return {};
    }
  },

  saveEvaluations(data: Record<string, ClinicalEvaluations>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(data));
      localStorage.setItem('kinesfera_saved_evaluations', JSON.stringify(data));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving evaluations:', err);
    }
  },

  loadProgressNotes(): ProgressNote[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS_NOTES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }

      const legacy = localStorage.getItem('kinesfera_progress_notes');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy)) {
          return parsedLegacy;
        }
      }

      return [];
    } catch (err) {
      console.error('Error reading progress notes from localStorage:', err);
      return [];
    }
  },

  saveProgressNotes(notes: ProgressNote[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS_NOTES, JSON.stringify(notes));
      localStorage.setItem('kinesfera_progress_notes', JSON.stringify(notes));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving progress notes:', err);
    }
  },

  loadReports(): ComprehensiveReport[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch (err) {
      console.error('Error reading reports from localStorage:', err);
      return [];
    }
  },

  saveReports(reports: ComprehensiveReport[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving reports:', err);
    }
  },

  loadSessionHistory(): SessionResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  saveSessionHistory(history: SessionResult[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(history));
    } catch (err) {
      console.error('Error saving session history:', err);
    }
  },

  clearAllClinicalData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      localStorage.removeItem('kinesfera_saved_patients');
      localStorage.removeItem('kinesfera_saved_anamnesis');
      localStorage.removeItem('kinesfera_saved_evaluations');
      localStorage.removeItem('kinesfera_progress_notes');
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
  },

  getSelectedPatientId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_PATIENT_ID) || '';
    } catch {
      return '';
    }
  },

  saveSelectedPatientId(id: string): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_PATIENT_ID, id);
      }
    } catch {
      // ignore
    }
  },

  recordAnonymizedClinicalCase(caseData: Omit<AnonymizedClinicalCase, 'id' | 'timestamp'>): void {
    try {
      const existing = this.getAnonymizedClinicalCases();
      const newCase: AnonymizedClinicalCase = {
        ...caseData,
        id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toISOString()
      };
      const updated = [newCase, ...existing].slice(0, 50); // keep last 50
      localStorage.setItem(STORAGE_KEYS.ANONYMIZED_CASES, JSON.stringify(updated));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error recording anonymized case:', err);
    }
  },

  getAnonymizedClinicalCases(): AnonymizedClinicalCase[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ANONYMIZED_CASES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Initial default cases
      const defaults: AnonymizedClinicalCase[] = [
        {
          id: 'case_default_1',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          pathologyOrReason: 'Hipotonía axial y retraso en consolidación de marcha',
          ageCategory: 'mayor_2_anos',
          observedProgress: 'Consolidación de equilibrio estático monopodal y salto en dos pies tras 4 semanas de estimulación vestibular',
          treatmentApproach: 'Juego motor con sentido Kinesfera, circuitos de desestabilización en balancín y planos inclinados',
          clinicalResults: 'Aumento de tono axial, mayor autonomía motriz en suelo y disminución de caídas'
        },
        {
          id: 'case_default_2',
          timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
          pathologyOrReason: 'Asimetría postural craneal posicional (Plagiocefalia) y preferencia cervical',
          ageCategory: 'bebe_hasta_18_meses',
          observedProgress: 'Reducción de CVAI de 9.2% a 4.1% con rango cervical simétrico bilateral',
          treatmentApproach: 'Terapia miofascial cervical suave, reposicionamiento lúdico y Tummy Time activo asistido',
          clinicalResults: 'Simetría craneal corregida sin necesidad de órtesis craneal'
        },
        {
          id: 'case_default_3',
          timestamp: new Date(Date.now() - 86400000 * 12).toISOString(),
          pathologyOrReason: 'Dificultades en desarrollo psicomotor (SPM-2: reactividad táctil y búsqueda propioceptiva)',
          ageCategory: 'mayor_2_anos',
          observedProgress: 'Mejor tolerancia a texturas y autorregulación en aula escolar PIE',
          treatmentApproach: 'Dieta sensoriomotriz Kinesfera, juego de arrastre con resistencia y presión profunda',
          clinicalResults: 'Mayor tiempo de atención focalizada y reducción de conductas de agitación motriz'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ANONYMIZED_CASES, JSON.stringify(defaults));
      return defaults;
    } catch {
      return [];
    }
  },

  exportFullClinicalBackupJson(): string {
    const backupData = {
      version: '2.1.0-cloud',
      exportDate: new Date().toISOString(),
      institution: 'Centro Clínico Kinesfera Copiapó',
      patients: this.loadPatients(),
      anamnesis: this.loadAnamnesis(),
      evaluations: this.loadEvaluations(),
      progressNotes: this.loadProgressNotes(),
      reports: this.loadReports(),
      sessionHistory: this.loadSessionHistory(),
      anonymizedCases: this.getAnonymizedClinicalCases()
    };
    return JSON.stringify(backupData, null, 2);
  },

  importFullClinicalBackupJson(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'El archivo JSON no tiene un formato válido.' };
      }

      if (Array.isArray(data.patients) && data.patients.length > 0) {
        this.savePatients(data.patients);
      }
      if (data.anamnesis && typeof data.anamnesis === 'object') {
        this.saveAnamnesis(data.anamnesis);
      }
      if (data.evaluations && typeof data.evaluations === 'object') {
        this.saveEvaluations(data.evaluations);
      }
      if (Array.isArray(data.progressNotes)) {
        this.saveProgressNotes(data.progressNotes);
      }
      if (Array.isArray(data.reports)) {
        this.saveReports(data.reports);
      }
      if (Array.isArray(data.sessionHistory)) {
        this.saveSessionHistory(data.sessionHistory);
      }
      if (Array.isArray(data.anonymizedCases)) {
        localStorage.setItem(STORAGE_KEYS.ANONYMIZED_CASES, JSON.stringify(data.anonymizedCases));
      }

      this.triggerStorageEvent();
      return { success: true, message: 'Respaldo clínico procesado en caché local.' };
    } catch (err: any) {
      return { success: false, message: `Error al procesar el archivo: ${err?.message || 'Formato inválido'}` };
    }
  },

  triggerStorageEvent(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('kinesfera_clinical_data_updated'));
    }
  }
};

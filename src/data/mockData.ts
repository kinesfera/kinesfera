import { 
  Exercise, 
  User, 
  Report, 
  Chat, 
  ChatMessage, 
  SessionResult, 
  ProgressNote, 
  LeadProspect,
  PatientAnamnesis,
  ClinicalEvaluations,
  ComprehensiveReport
} from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'squats',
    name: 'Sentadillas de Carga Bipedestada',
    friendlyName: 'Sentadillas Cósmicas del Explorador',
    description: 'Baja despacio doblando tus rodillas como si te sentaras en una roca lunar, ¡sin levantar los talones!',
    category: 'fuerza_piernas',
    difficulty: 'intermedio',
    ageRange: { min: 4, max: 15 },
    thumbnailIcon: 'activity',
    detection: {
      requiredKeypoints: ['left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'],
      validations: [
        {
          type: 'angulo',
          joint: 'rodilla',
          points: ['hip', 'knee', 'ankle'],
          min: 80,
          max: 110,
          tolerance: 15,
          errorMessage: 'Baja un poco más las rodillas con control',
          successMessage: '¡Excelente ángulo y profundidad!',
          priority: 'alta'
        },
        {
          type: 'alineacion',
          joint: 'tronco',
          axis: 'vertical',
          min: 10,
          max: 35,
          tolerance: 10,
          errorMessage: 'Mantén el pecho erguido mirando al frente',
          successMessage: 'Tronco bien alineado',
          priority: 'media'
        }
      ]
    },
    gamification: {
      type: 'contador',
      objective: 8,
      starsMin: 3,
      starsMed: 6,
      starsMax: 8,
      visualElement: 'cohete_ascendiendo',
      sound: 'chime_repetition',
      maxTime: 120,
      startMessage: '¡Prepárate para despegar! Separa tus pies a la anchura de hombros.',
      progressMessage: '¡Gran esfuerzo! Siente la fuerza en tus piernas.',
      midwayMessage: '¡Ya vas en la mitad del viaje estelar!',
      finalMessage: '¡Misión cumplida! Has ganado 3 estrellas de oro.'
    },
    adaptations: {
      TEA: {
        waitTime: 4,
        visualFeedback: 'indicador_visual_suave_sin_parpadeo',
        audioFeedback: 'tono_senoidal_calmante',
        slowTransitions: true,
        predictability: 'barra_progreso_fija_con_conteo_visible',
        immediateRewards: true
      },
      TDAH: {
        fastVariation: true,
        frequentRewards: true,
        maxTime: 60,
        surpriseElements: false,
        visualChanges: 'cambio_estrellas_dinamico'
      },
      down: {
        visualAids: 'silueta_humana_espejo_de_guia',
        reducedSpeed: true,
        extraRest: true,
        simpleInstructions: true,
        visualDemonstration: true
      },
      motor_difficulty: {
        reducedRangeOfMotion: 30, // 30% menos de flexión requerida
        extraTime: 30,
        posturalAids: true,
        reducedObjective: 5
      }
    },
    clinicalIndicators: {
      rangeOfMotion: {
        normal: [85, 105],
        attention: [70, 84],
        alert: [0, 69]
      },
      compensationPatterns: [
        'Valgo dinámico de rodillas',
        'Anteversión pélvica excesiva',
        'Despegue prematuro de retropié'
      ],
      therapeuticObjectives: [
        'Fortalecimiento concéntrico y excéntrico de cuádriceps y glúteo mayor',
        'Optimización del control propioceptivo de miembros inferiores',
        'Alineación del eje mecánico cadera-rodilla-tobillo'
      ]
    },
    createdBy: 'prof_elena_ramirez',
    createdAt: '2026-03-01T10:00:00Z',
    isPublic: true
  },
  {
    id: 'kneeTouch',
    name: 'Flexión Alterna de Cadera en Bipedestación',
    friendlyName: 'Toque de Rodillas Intergaláctico',
    description: 'Levanta una rodilla y tócala con la mano contraria, como cruzando rayos de luz de colores.',
    category: 'coordinacion_bilateral',
    difficulty: 'facil',
    ageRange: { min: 3, max: 14 },
    thumbnailIcon: 'footprints',
    detection: {
      requiredKeypoints: ['left_wrist', 'right_wrist', 'left_knee', 'right_knee', 'left_hip', 'right_hip'],
      validations: [
        {
          type: 'angulo',
          joint: 'cadera',
          points: ['shoulder', 'hip', 'knee'],
          min: 80,
          max: 115,
          tolerance: 15,
          errorMessage: 'Sube la rodilla un poquito más alto',
          successMessage: '¡Cruce bilateral impecable!',
          priority: 'alta'
        }
      ]
    },
    gamification: {
      type: 'contador',
      objective: 10,
      starsMin: 4,
      starsMed: 7,
      starsMax: 10,
      visualElement: 'portal_magico',
      sound: 'harp_harmonic',
      maxTime: 90,
      startMessage: '¡Activa tu coordinación! Toca rodilla con mano contraria.',
      progressMessage: '¡Izquierda, derecha, con ritmo constante!',
      midwayMessage: '¡5 toques completados con equilibrio!',
      finalMessage: '¡Coordinación estelar dominada con éxito!'
    },
    adaptations: {
      TEA: {
        waitTime: 3,
        visualFeedback: 'resaltado_de_color_en_extremidad_activa',
        audioFeedback: 'tono_suave',
        slowTransitions: true,
        predictability: 'alternancia_estricta_predecible',
        immediateRewards: true
      },
      TDAH: {
        fastVariation: true,
        frequentRewards: true,
        maxTime: 45,
        surpriseElements: false,
        visualChanges: 'destellos_sutiles'
      },
      down: {
        visualAids: 'puntos_guia_en_pantalla',
        reducedSpeed: true,
        extraRest: true,
        simpleInstructions: true,
        visualDemonstration: true
      },
      motor_difficulty: {
        reducedRangeOfMotion: 25,
        extraTime: 20,
        posturalAids: true,
        reducedObjective: 6
      }
    },
    clinicalIndicators: {
      rangeOfMotion: {
        normal: [80, 110],
        attention: [60, 79],
        alert: [0, 59]
      },
      compensationPatterns: [
        'Inclinación lateral excesiva de tronco ipsilateral',
        'Pérdida de base de sustentación'
      ],
      therapeuticObjectives: [
        'Cruce de línea media corporal y disociación de cinturas',
        'Equilibrio dinámico en fase de apoyo monopodal',
        'Estimulación cerebelosa y coordinación motora fina/gruesa'
      ]
    },
    createdBy: 'prof_elena_ramirez',
    createdAt: '2026-03-05T12:00:00Z',
    isPublic: true
  },
  {
    id: 'armsUp',
    name: 'Abducción y Elevación Escapular Bilateral',
    friendlyName: 'Alcanzar las Estrellas Lejanas',
    description: 'Estira tus dos brazos hacia el cielo lo más alto que puedas, como atrapando constelaciones brillantes.',
    category: 'patrones_alcance',
    difficulty: 'facil',
    ageRange: { min: 3, max: 16 },
    thumbnailIcon: 'sparkles',
    detection: {
      requiredKeypoints: ['left_shoulder', 'right_shoulder', 'left_wrist', 'right_wrist', 'left_elbow', 'right_elbow'],
      validations: [
        {
          type: 'angulo',
          joint: 'hombro',
          points: ['hip', 'shoulder', 'wrist'],
          min: 150,
          max: 180,
          tolerance: 15,
          errorMessage: '¡Estira un poco más arriba tus brazos!',
          successMessage: '¡Estiramiento y alcance perfecto!',
          priority: 'alta'
        }
      ]
    },
    gamification: {
      type: 'tiempo',
      objective: 15, // 15 segundos sostenidos
      starsMin: 5,
      starsMed: 10,
      starsMax: 15,
      visualElement: 'aurora_boreal',
      sound: 'celeste_bell',
      maxTime: 60,
      startMessage: '¡Manos al cielo! Recoge energía del cosmos.',
      progressMessage: '¡Sostén la postura con respiración tranquila!',
      midwayMessage: '¡Mitad del tiempo alcanzado, fuerza en tu espalda!',
      finalMessage: '¡Brillante alcance! Estrellas recolectadas.'
    },
    adaptations: {
      TEA: {
        waitTime: 2,
        visualFeedback: 'colores_pasteles_calmos',
        audioFeedback: 'musica_ambiental_suave',
        slowTransitions: true,
        predictability: 'temporizador_circular_continuo',
        immediateRewards: true
      },
      TDAH: {
        fastVariation: false,
        frequentRewards: true,
        maxTime: 30,
        surpriseElements: false,
        visualChanges: 'contador_de_puntos_segundo_a_segundo'
      },
      down: {
        visualAids: 'modelo_visual_3d',
        reducedSpeed: true,
        extraRest: true,
        simpleInstructions: true,
        visualDemonstration: true
      },
      motor_difficulty: {
        reducedRangeOfMotion: 35,
        extraTime: 15,
        posturalAids: true,
        reducedObjective: 10
      }
    },
    clinicalIndicators: {
      rangeOfMotion: {
        normal: [155, 180],
        attention: [130, 154],
        alert: [0, 129]
      },
      compensationPatterns: [
        'Elevación en bloque con trapecio superior hipertónico',
        'Hiperextensión lumbar de compensación'
      ],
      therapeuticObjectives: [
        'Activación de serrato anterior y estabilizadores escapulares',
        'Elongación de cadena anterior y corrección de postura cifótica',
        'Aumento de capacidad ventilatoria diafragmática'
      ]
    },
    createdBy: 'prof_elena_ramirez',
    createdAt: '2026-03-08T09:30:00Z',
    isPublic: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_clinician_1',
    email: 'kinesferaspa@gmail.com',
    role: 'Profesionales Clínicos',
    firstName: 'Aldo',
    lastName: 'Olivares Araya',
    rut: '16.789.432-1',
    gender: 'Hombre',
    specialty: 'Kinesiólogo, Especialista en Psicomotricidad',
    institution: 'Centro Clínico Kinesfera',
    plan: 'Premium',
    credits: 500,
    consultationAddress: {
      region: 'Región de Atacama',
      commune: 'Copiapó',
      street: 'Centro Kinesfera Copiapó',
      number: '100'
    },
    contactInfo: {
      whatsapp: '+56 9 8456 1234',
      website: 'www.kinesfera.cl'
    },
    patients: [],
    avatarConfig: {
      skinTone: '#E0AC69',
      hairColor: '#3B2F2F',
      shirtColor: '#00A8B5'
    }
  },
  {
    id: 'user_educator_1',
    email: 'educacion@kinesfera.cl',
    role: 'Educadores',
    firstName: 'Marcela',
    lastName: 'Soto Araya',
    rut: '14.892.113-7',
    gender: 'Mujer',
    specialty: 'Educadora Diferencial · Coordinadora PIE',
    institution: 'Programa PIE y Redes Escolares',
    plan: 'Premium',
    credits: 100,
    students: [],
    consultationAddress: {
      region: 'Región de Atacama',
      commune: 'Copiapó',
      street: 'Copiapó',
      number: '200'
    },
    contactInfo: {
      whatsapp: '+56 9 7789 4432'
    },
    avatarConfig: {
      skinTone: '#F1C27D',
      hairColor: '#4A3728',
      shirtColor: '#047857'
    }
  },
  {
    id: 'user_admin_1',
    email: 'admin@kinesfera.cl',
    role: 'Administrador (Neuronexin)',
    firstName: 'Administrador',
    lastName: 'Kinesfera',
    rut: '12.654.321-9',
    gender: 'Hombre',
    institution: 'Centro Clínico Kinesfera',
    plan: 'Premium',
    credits: 9999,
    avatarConfig: {
      skinTone: '#E0AC69',
      hairColor: '#1F2937',
      shirtColor: '#0F172A'
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

export const INITIAL_REPORTS: Report[] = [];

export const INITIAL_CHATS: Chat[] = [];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {};

export const INITIAL_SESSION_HISTORY: SessionResult[] = [];

export const INITIAL_PROGRESS_NOTES: ProgressNote[] = [
  {
    id: 'note_blaz_01',
    patientId: 'patient_blaz_01',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Particular',
    notes: 'Sesión psicomotriz inicial. Blaz participa activamente en circuitos de gateo, trepa en rampa de gomaespuma y lanzamientos dirigidos. Excelente conexión vincular. Indicaciones al hogar: juegos de carga en suelo y saltos rítmicos.',
    professionalName: 'Klgo. Aldo Olivares Araya'
  }
];

export const INITIAL_LEADS: LeadProspect[] = [
  {
    id: 'lead_1',
    fullName: 'Dra. Paulina Oyarzún',
    email: 'paulina.oyarzun@neurorehab.cl',
    phone: '+56 9 9234 5678',
    roleType: 'Profesionales Clínicos',
    institution: 'Centro NeuroRehab Las Condes',
    region: 'Región Metropolitana',
    commune: 'Las Condes',
    interestDetails: 'Interés en paquete de 15 licencias para sala de estimulación sensorial y teleterapia.',
    estimatedPatients: '15-20 pacientes',
    status: 'En Demostración',
    commercialNotes: 'Reunión agendada para demostración de sensor de IA el jueves 15 hrs.',
    registeredAt: '2026-08-05T14:30:00Z',
    consentContact: true
  },
  {
    id: 'lead_2',
    fullName: 'Juan Carlos Beltrán',
    email: 'familia.beltran@gmail.com',
    phone: '+56 9 8123 9988',
    roleType: 'Padre/Niño',
    institution: 'Hogar Particular',
    region: 'Región Metropolitana',
    commune: 'Providencia',
    interestDetails: 'Padre de Juan Beltrán (bebé de 2 años con hipotonía). Interesado en suscripción anual y seguimiento kinésico.',
    estimatedPatients: '1 paciente',
    status: 'Venta Cerrada (Premium)',
    commercialNotes: 'Plan Premium anual activado. Excelente feedback con la plantilla de progreso.',
    registeredAt: '2026-07-28T10:15:00Z',
    consentContact: true
  },
  {
    id: 'lead_3',
    fullName: 'Marcela Valdés',
    email: 'mvaldes@colegiosanignacio.cl',
    phone: '+56 9 7654 3210',
    roleType: 'Educadores',
    institution: 'Colegio San Ignacio El Bosque (Equipo PIE)',
    region: 'Región Metropolitana',
    commune: 'Providencia',
    interestDetails: 'Convenio escolar para 20 estudiantes neurodivergentes de básica. Necesitan pausas activas en aula.',
    estimatedPatients: '20 estudiantes',
    status: 'Contactado',
    commercialNotes: 'Enviada propuesta formal institucional con cotización de licencias PIE.',
    registeredAt: '2026-08-02T11:20:00Z',
    consentContact: true
  },
  {
    id: 'lead_4',
    fullName: 'Dr. Roberto Manríquez',
    email: 'rmanriquez@alemanatemuco.cl',
    phone: '+56 9 6443 1122',
    roleType: 'Institución',
    institution: 'Clínica Alemana Temuco (Servicio de Fisiatría)',
    region: 'Región de La Araucanía',
    commune: 'Temuco',
    interestDetails: 'Implementación de telerrehabilitación pediátrica para pacientes de zonas rurales de la IX Región.',
    estimatedPatients: '40+ pacientes',
    status: 'En Demostración',
    commercialNotes: 'Interesados en interoperabilidad con fichas FONASA e ISAPRE.',
    registeredAt: '2026-08-06T16:45:00Z',
    consentContact: true
  },
  {
    id: 'lead_5',
    fullName: 'Camila Palacios',
    email: 'familia.victoria@gmail.com',
    phone: '+56 9 3221 0099',
    roleType: 'Padre/Niño',
    institution: 'Hogar Particular',
    region: 'Región de Valparaíso',
    commune: 'Viña del Mar',
    interestDetails: 'Madre de Victoria Palacios. Busca ejercicios para postura cervical simétrica.',
    estimatedPatients: '1 paciente',
    status: 'Nuevo Prospecto',
    commercialNotes: 'Registrado desde la página de inicio. Pendiente llamada de bienvenida.',
    registeredAt: '2026-08-07T09:10:00Z',
    consentContact: true
  }
];

export const INITIAL_ANAMNESIS: Record<string, PatientAnamnesis> = {
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

export const INITIAL_CLINICAL_EVALUATIONS: Record<string, ClinicalEvaluations> = {
  patient_blaz_01: {
    id: 'eval_patient_blaz_01',
    patientId: 'patient_blaz_01',
    evaluationDate: new Date().toISOString().slice(0, 10),
    evaluatorName: 'Klgo. Aldo Olivares Araya',
    gmfcsLevel: 'Nivel I',
    macsLevel: 'Nivel I',
    ashworthScore: '0',
    tonePattern: 'Normotonía con adecuada extensibilidad miotendinosa',
    deepTendonReflexes: 'Normales ++/++++ rotulianos y bicipitales simétricos',
    headAndTrunkControl: 'Conservado y estable en transiciones posturales',
    rightingReactions: 'Presentes en todos los planos espaciales',
    protectiveResponses: 'Presentes en plano anterior, lateral y posterior',
    balanceSittingAndStanding: 'Funcional, buen ajuste postural anticipatorio',
    transferAbility: 'Autónomo en suelo a bipedestación',
    gaitObservation: 'Marcha activa con adecuada cadencia y balanceo de brazos',
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
    therapeuticObjectivesShortTerm: '1. Consolidar equilibrio dinámico monopodal y salto sobre obstáculos.\n2. Fortalecer control postural del tronco y disociación de cinturas en juegos de suelo.',
    therapeuticObjectivesLongTerm: '1. Lograr integración sensorio-motriz óptima para actividades lúdicas grupales.\n2. Afianzar praxias globales y finas con autonomía e iniciativa en el entorno escolar.',
    treatmentPlan: 'Sesiones kinésicas lúdicas y psicomotrices semanales de 45 minutos basadas en el concepto Kinesfera (juego con sentido).',
    homeRecommendations: 'Promover juego al aire libre, circuitos motores con cojines, gateo y trepa supervisada en casa.',
    schoolRecommendations: 'Favorecer pausas activas motrices, permitir cambios de postura y felicitar sus logros de interacción motriz.'
  }
};

export const INITIAL_COMPREHENSIVE_REPORTS: ComprehensiveReport[] = [];



import { Exercise, User, Report, Chat, ChatMessage, SessionResult, ProgressNote, LeadProspect } from '../types';

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
    email: 'elena.ramirez@neuronexo.cl',
    role: 'Profesionales Clínicos',
    firstName: 'Dra. Elena',
    lastName: 'Ramírez Soto',
    rut: '15.342.890-K',
    gender: 'Mujer',
    specialty: 'Kinesióloga Pediátrica · Neurorehabilitación',
    institution: 'Instituto Teletón Santiago / Centro NeuroNexo',
    plan: 'Premium',
    credits: 150,
    consultationAddress: {
      region: 'Región Metropolitana',
      commune: 'Providencia',
      street: 'Av. Providencia',
      number: '1240, Of. 602'
    },
    contactInfo: {
      whatsapp: '+56 9 8456 1234',
      website: 'www.neuronexo.cl/clinica'
    },
    patients: ['user_patient_lucas', 'user_patient_sofia', 'user_patient_mateo'],
    avatarConfig: {
      skinTone: '#E0AC69',
      hairColor: '#3B2F2F',
      shirtColor: '#1E3A8A'
    }
  },
  {
    id: 'user_educator_1',
    email: 'marcela.soto@educacion.cl',
    role: 'Educadores',
    firstName: 'Marcela',
    lastName: 'Soto Araya',
    rut: '14.892.113-7',
    gender: 'Mujer',
    specialty: 'Educadora Diferencial · Coordinadora PIE',
    institution: 'Colegio Antares de la Reina (Programa PIE)',
    plan: 'Premium',
    credits: 100,
    students: ['user_patient_lucas', 'user_patient_mateo'],
    consultationAddress: {
      region: 'Región Metropolitana',
      commune: 'La Reina',
      street: 'Av. Larraín',
      number: '7520'
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
    id: 'user_patient_lucas',
    email: 'familia.morales@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Lucas',
    lastName: 'Morales Alarcón',
    rut: '24.312.984-2',
    birthDate: '2018-05-14',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 45,
    assignedExercise: 'squats',
    assignedAt: '2026-03-09T14:30:00Z',
    diagnosis: 'Condición del Espectro Autista (TEA Grado 1) + Hipotonía Axial Leve',
    medicalRecordNumber: 'NN-2026-084',
    emergencyContact: {
      name: 'Carlos Morales (Padre)',
      relationship: 'Padre / Tutor',
      phone: '+56 9 9123 4567'
    },
    professionals: ['user_clinician_1'],
    educators: ['user_educator_1'],
    avatarConfig: {
      skinTone: '#F5D0A9',
      hairColor: '#4A3319',
      shirtColor: '#2563EB',
      accessory: 'Gorra Aventurero',
      name: 'Comandante Lucas'
    }
  },
  {
    id: 'user_patient_sofia',
    email: 'familia.valenzuela@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Sofía',
    lastName: 'Valenzuela Herrera',
    rut: '25.109.845-6',
    birthDate: '2020-02-20',
    gender: 'Mujer',
    plan: 'Gratis',
    credits: 20,
    assignedExercise: 'kneeTouch',
    assignedAt: '2026-03-07T11:00:00Z',
    diagnosis: 'Síndrome de Down · Dispraxia Motora Bilateral',
    medicalRecordNumber: 'NN-2026-112',
    emergencyContact: {
      name: 'Carolina Herrera (Madre)',
      relationship: 'Madre',
      phone: '+56 9 8234 5678'
    },
    professionals: ['user_clinician_1'],
    educators: [],
    avatarConfig: {
      skinTone: '#FFE0BD',
      hairColor: '#B8860B',
      shirtColor: '#D97706',
      accessory: 'Insignia Estelar',
      name: 'Exploradora Sofi'
    }
  },
  {
    id: 'user_patient_mateo',
    email: 'familia.silva@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Mateo',
    lastName: 'Silva Concha',
    rut: '23.456.789-1',
    birthDate: '2016-11-04',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 80,
    assignedExercise: 'armsUp',
    assignedAt: '2026-03-08T16:00:00Z',
    diagnosis: 'TDAH subtipo Combinado · Inestabilidad Postural Dinámica',
    medicalRecordNumber: 'NN-2026-049',
    emergencyContact: {
      name: 'Andrea Concha (Madre)',
      relationship: 'Madre',
      phone: '+56 9 7654 3210'
    },
    professionals: ['user_clinician_1'],
    educators: ['user_educator_1'],
    avatarConfig: {
      skinTone: '#D29B69',
      hairColor: '#262626',
      shirtColor: '#7C3AED',
      name: 'Héroe Mateo'
    }
  },
  {
    id: 'user_patient_juan',
    email: 'familia.beltran@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Juan',
    lastName: 'Beltrán',
    rut: '26.840.119-3',
    birthDate: '2024-04-12',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 50,
    assignedExercise: 'squats',
    assignedAt: '2026-07-28T10:00:00Z',
    diagnosis: 'Retraso del Desarrollo Psicomotor · Hipotonía y Control de Sedente',
    medicalRecordNumber: 'NN-2026-015',
    emergencyContact: {
      name: 'María José Beltrán (Madre)',
      relationship: 'Madre',
      phone: '+56 9 8123 9988'
    },
    professionals: ['user_clinician_1'],
    educators: [],
    avatarConfig: {
      skinTone: '#F5D0A9',
      hairColor: '#3B2F2F',
      shirtColor: '#2563EB',
      name: 'Pequeño Juan'
    }
  },
  {
    id: 'user_patient_cristopher',
    email: 'familia.cristopher@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Cristopher',
    lastName: 'Pérez',
    rut: '25.991.304-K',
    birthDate: '2022-09-18',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 35,
    assignedExercise: 'kneeTouch',
    diagnosis: 'Trastorno de Coordinación Motora · Dispraxia',
    medicalRecordNumber: 'NN-2026-022',
    emergencyContact: {
      name: 'Claudia Pérez (Madre)',
      relationship: 'Madre',
      phone: '+56 9 7321 4455'
    },
    professionals: ['user_clinician_1']
  },
  {
    id: 'user_patient_wagner',
    email: 'familia.wagner@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Wagner',
    lastName: 'Muñoz',
    rut: '24.120.553-8',
    birthDate: '2021-03-30',
    gender: 'Hombre',
    plan: 'Gratis',
    credits: 15,
    assignedExercise: 'squats',
    diagnosis: 'Condición del Espectro Autista (TEA) · Hipoactividad Propioceptiva',
    medicalRecordNumber: 'NN-2026-033',
    emergencyContact: {
      name: 'Jorge Muñoz (Padre)',
      relationship: 'Padre',
      phone: '+56 9 9445 1122'
    },
    professionals: ['user_clinician_1']
  },
  {
    id: 'user_patient_fernando',
    email: 'familia.fernando@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Fernando',
    lastName: 'Castro',
    rut: '25.334.890-1',
    birthDate: '2023-01-15',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 40,
    assignedExercise: 'armsUp',
    diagnosis: 'Hipotonía Benigna de la Infancia · Estimulación Cefálica',
    medicalRecordNumber: 'NN-2026-041',
    emergencyContact: {
      name: 'Paula Castro (Madre)',
      relationship: 'Madre',
      phone: '+56 9 8776 2233'
    },
    professionals: ['user_clinician_1']
  },
  {
    id: 'user_patient_alexis',
    email: 'familia.alexis@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Alexis',
    lastName: 'Fuentes',
    rut: '24.890.123-4',
    birthDate: '2020-07-22',
    gender: 'Hombre',
    plan: 'Gratis',
    credits: 20,
    assignedExercise: 'kneeTouch',
    diagnosis: 'TDAH · Inestabilidad en Apoyo Monopodal',
    medicalRecordNumber: 'NN-2026-052',
    emergencyContact: {
      name: 'Verónica Fuentes (Madre)',
      relationship: 'Madre',
      phone: '+56 9 6554 9988'
    },
    professionals: ['user_clinician_1']
  },
  {
    id: 'user_patient_estefan',
    email: 'familia.estefan@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Estefan',
    lastName: 'Lagos',
    rut: '26.112.784-9',
    birthDate: '2023-11-08',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 60,
    assignedExercise: 'squats',
    diagnosis: 'Síndrome Hipotónico · Fortalecimiento Pélvico',
    medicalRecordNumber: 'NN-2026-063',
    emergencyContact: {
      name: 'Rodrigo Lagos (Padre)',
      relationship: 'Padre',
      phone: '+56 9 5443 2211'
    },
    professionals: ['user_clinician_1']
  },
  {
    id: 'user_patient_joaquin',
    email: 'familia.joaquin@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Joaquín',
    lastName: 'Molina',
    rut: '25.670.345-2',
    birthDate: '2022-04-19',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 45,
    assignedExercise: 'squats',
    diagnosis: 'Retraso Psicomotor Leve · Transición a Bipedestación',
    medicalRecordNumber: 'NN-2026-074',
    emergencyContact: {
      name: 'Daniela Molina (Madre)',
      relationship: 'Madre',
      phone: '+56 9 4332 1100'
    },
    professionals: ['user_clinician_1']
  },
  {
    id: 'user_patient_victoria',
    email: 'familia.victoria@gmail.com',
    role: 'Padre/Niño',
    firstName: 'Victoria',
    lastName: 'Palacios',
    rut: '26.445.891-7',
    birthDate: '2023-08-05',
    gender: 'Mujer',
    plan: 'Premium',
    credits: 50,
    assignedExercise: 'armsUp',
    diagnosis: 'Tortícolis Congénita Resuelta · Control Postural Simétrico',
    medicalRecordNumber: 'NN-2026-085',
    emergencyContact: {
      name: 'Camila Palacios (Madre)',
      relationship: 'Madre',
      phone: '+56 9 3221 0099'
    },
    professionals: ['user_clinician_1']
  },
  {
    id: 'user_admin_1',
    email: 'admin@neuronexo.cl',
    role: 'Administrador (Neuronexin)',
    firstName: 'Ignacio',
    lastName: 'Guzmán',
    rut: '12.654.321-9',
    gender: 'Hombre',
    institution: 'Dirección Central NeuroNexo Adventures',
    plan: 'Premium',
    credits: 9999,
    avatarConfig: {
      skinTone: '#E0AC69',
      hairColor: '#1F2937',
      shirtColor: '#0F172A'
    }
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep_lucas_01',
    patientId: 'user_patient_lucas',
    patientName: 'Lucas Morales Alarcón',
    patientRut: '24.312.984-2',
    professionalId: 'user_clinician_1',
    professionalName: 'Dra. Elena Ramírez Soto',
    professionalSpecialty: 'Kinesióloga Pediátrica · Reg. SIS 48291',
    creatorRole: 'Profesionales Clínicos',
    generatedAt: '2026-03-08T17:45:00Z',
    content: {
      summary: 'Evolución favorable tras 4 semanas de tele-intervención con videojuego de sentadillas y apoyos monopoidales adaptados para TEA.',
      progressObserved: 'Aumento del rango articular de flexión de rodilla a 92° promedio (antes 74°). Disminuyó la fatiga en bipedestación durante la jornada escolar de 15 min a 40 min continuos.',
      achievements: '88% de adherencia a las sesiones domiciliarias. Logro de 3 estrellas consecutivas en sentadillas con mínima asistencia verbal.',
      areasToFocus: 'Mantener control del valgo dinámico en el tercio final de la serie (repeticiones 7 y 8).',
      nextSteps: 'Prescripción de Toque de Rodillas Intergaláctico para estimulación de cruce de línea media.',
      romAverage: 92,
      adherencePercentage: 88,
      compensationCount: 2
    }
  },
  {
    id: 'rep_sofia_01',
    patientId: 'user_patient_sofia',
    patientName: 'Sofía Valenzuela Herrera',
    patientRut: '25.109.845-6',
    professionalId: 'user_clinician_1',
    professionalName: 'Dra. Elena Ramírez Soto',
    professionalSpecialty: 'Kinesióloga Pediátrica',
    creatorRole: 'Profesionales Clínicos',
    generatedAt: '2026-03-06T15:20:00Z',
    content: {
      summary: 'Sesiones de coordinación bimanual y marcha con feedback visual aumentado (Modo Síndrome de Down activado).',
      progressObserved: 'Mejora en la anticipación visual y apoyo plantar simétrico. La paciente disfruta las misiones con pausas cada 3 repeticiones.',
      achievements: 'Completó 12 misiones en el mes con acompañamiento de la madre.',
      areasToFocus: 'Coordinación visomotora al alcanzar objetos en el plano sagital alto.',
      nextSteps: 'Continuar con el ejercicio Toque de Rodillas a velocidad reducida.',
      romAverage: 84,
      adherencePercentage: 75,
      compensationCount: 4
    }
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_lucas',
    patientId: 'user_patient_lucas',
    patientName: 'Lucas Morales (Familia & Equipo)',
    participants: ['user_patient_lucas', 'user_clinician_1', 'user_educator_1'],
    lastMessage: {
      text: '¡Hola Dra. Elena! Lucas completó sus sentadillas hoy con el modo TEA activo y estuvo muy contento.',
      timestamp: '2026-03-10T14:15:00Z'
    },
    unreadCount: 1
  },
  {
    id: 'chat_sofia',
    patientId: 'user_patient_sofia',
    patientName: 'Sofía Valenzuela (Familia)',
    participants: ['user_patient_sofia', 'user_clinician_1'],
    lastMessage: {
      text: 'Confirmamos la tele-evaluación del viernes a las 11:30 hrs.',
      timestamp: '2026-03-09T18:00:00Z'
    },
    unreadCount: 0
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  chat_lucas: [
    {
      id: 'm1',
      senderId: 'user_clinician_1',
      senderName: 'Dra. Elena Ramírez',
      senderRole: 'Profesionales Clínicos',
      text: 'Estimada familia Morales, revisé los datos cinemáticos de la sesión de ayer. Lucas mantuvo un promedio de flexión de 92° con excelente postura.',
      timestamp: '2026-03-09T09:30:00Z'
    },
    {
      id: 'm2',
      senderId: 'user_educator_1',
      senderName: 'Marcela Soto (PIE)',
      senderRole: 'Educadores',
      text: 'En la escuela implementamos la misma pausa activa de 3 minutos antes de matemáticas y notamos mucha mejor autorregulación.',
      timestamp: '2026-03-09T11:45:00Z'
    },
    {
      id: 'm3',
      senderId: 'user_patient_lucas',
      senderName: 'Carlos Morales (Papá)',
      senderRole: 'Padre/Niño',
      text: '¡Hola Dra. Elena! Lucas completó sus sentadillas hoy con el modo TEA activo y estuvo muy contento.',
      timestamp: '2026-03-10T14:15:00Z'
    }
  ],
  chat_sofia: [
    {
      id: 'ms1',
      senderId: 'user_clinician_1',
      senderName: 'Dra. Elena Ramírez',
      senderRole: 'Profesionales Clínicos',
      text: 'Hola Carolina, les recuerdo mantener los apoyos de descanso cada 3 repeticiones en el Toque de Rodillas.',
      timestamp: '2026-03-08T16:00:00Z'
    },
    {
      id: 'ms2',
      senderId: 'user_patient_sofia',
      senderName: 'Carolina Herrera (Mamá)',
      senderRole: 'Padre/Niño',
      text: 'Confirmamos la tele-evaluación del viernes a las 11:30 hrs.',
      timestamp: '2026-03-09T18:00:00Z'
    }
  ]
};

export const INITIAL_SESSION_HISTORY: SessionResult[] = [
  {
    exerciseId: 'squats',
    repsCompleted: 8,
    targetReps: 8,
    accuracy: 94,
    starsEarned: 3,
    averageAngle: 92,
    durationSeconds: 58,
    compensationsAvoided: 7,
    neurodiversityMode: 'TEA',
    timestamp: '2026-03-10T14:10:00Z'
  },
  {
    exerciseId: 'squats',
    repsCompleted: 7,
    targetReps: 8,
    accuracy: 88,
    starsEarned: 2,
    averageAngle: 89,
    durationSeconds: 65,
    compensationsAvoided: 5,
    neurodiversityMode: 'TEA',
    timestamp: '2026-03-08T15:30:00Z'
  },
  {
    exerciseId: 'kneeTouch',
    repsCompleted: 10,
    targetReps: 10,
    accuracy: 96,
    starsEarned: 3,
    averageAngle: 98,
    durationSeconds: 48,
    compensationsAvoided: 9,
    neurodiversityMode: 'standard',
    timestamp: '2026-03-06T11:20:00Z'
  }
];

export const INITIAL_PROGRESS_NOTES: ProgressNote[] = [
  // Juan Beltrán (exact notes from user's spreadsheet image)
  {
    id: 'pn_juan_1',
    patientId: 'user_patient_juan',
    date: '07/28/2026',
    paymentMethod: 'Efectivo',
    notes: 'Usuario llega con su madre, acompañado de padre y hermana, se realizan movimientos generales de articulacion, se explora movimiento mas alto encontrado de forma autonoma, permanece en decubito supino por 7 min, inicia giro, de preferencia hacia la izquierda. Se trabaja en traccion al sedente soportando su cabeza. Se trabaja equilibrio en sedente en plano antero posterior, y sagital. Se trabaja flexibilidad EEII, movimilidad activa y pasiva de cuello. Se facilita el giro y paso a sedente. Se trabaja extensores de columna en prono, con rollo de espuma. Se educa en todo momento a la familia.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },
  {
    id: 'pn_juan_2',
    patientId: 'user_patient_juan',
    date: '07/31/2026',
    paymentMethod: 'Efectivo',
    notes: 'Usuario llega con su madre, se realizan movimientos generales de articulacion, se explora movimiento mas alto encontrado de forma autonoma, permanece en decubito supino por 7 min, inicia giro, de preferencia hacia la izquierda. Se trabaja en traccion al sedente soportando su cabeza. Se trabaja equilibrio en sedente en plano antero posterior, y sagital. Se trabaja flexibilidad EEII, movimilidad activa y pasiva de cuello. Se facilita el giro y paso a sedente. Se trabaja extensores de columna en prono, con rollo de espuma. Se educa en todo momento a la familia.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },
  {
    id: 'pn_juan_3',
    patientId: 'user_patient_juan',
    date: '08/04/2026',
    paymentMethod: 'Transferencia',
    notes: 'Usuario asiste con madre. Se observa mayor tolerancia a decúbito prono con rollo de espuma (10 min). Se estimula alcance bimanual en sedente con apoyo anterior. Mejor alineación de cabeza y tronco. Se dejan tareas de estimulación táctil y apoyo podal en el hogar.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },
  {
    id: 'pn_juan_4',
    patientId: 'user_patient_juan',
    date: '08/07/2026',
    paymentMethod: 'Efectivo',
    notes: 'Usuario acude con madre y padre. Se realiza movilización activa-asistida de EEII y flexores de cadera. Mayor estabilidad de tronco en sedente con apoyo monopodal asistido en cuña terapéutica. Se refuerzan pautas para cambio postural en cuna y alfombra sensorial.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },

  // Cristopher
  {
    id: 'pn_cris_1',
    patientId: 'user_patient_cristopher',
    date: '08/01/2026',
    paymentMethod: 'Fonasa',
    notes: 'Sesión enfocada en disociación escapular y coordinación bimanual. Se trabaja patrón cruzado con balones sensoriales y circuito psicomotor en colchoneta.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },
  {
    id: 'pn_cris_2',
    patientId: 'user_patient_cristopher',
    date: '08/05/2026',
    paymentMethod: 'Fonasa',
    notes: 'Buena adherencia. Logra mantener apoyo monopodal por 4 segundos con retroalimentación visual en pantalla. Se avanza a saltos controlados bipodales.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },

  // Wagner
  {
    id: 'pn_wag_1',
    patientId: 'user_patient_wagner',
    date: '07/29/2026',
    paymentMethod: 'Particular',
    notes: 'Usuario ingresa tranquilo. Se implementa rutina estructurada con apoyos pictográficos. Se realizan sentadillas con guía háptica y balance en balancín.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },

  // Fernando
  {
    id: 'pn_fer_1',
    patientId: 'user_patient_fernando',
    date: '07/30/2026',
    paymentMethod: 'Transferencia',
    notes: 'Estimulación de reacciones de enderezamiento laberíntico y óptico. Se trabaja control cefálico en prono sobre cuña y tracción a sedente con buen tono.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },

  // Alexis
  {
    id: 'pn_ale_1',
    patientId: 'user_patient_alexis',
    date: '08/02/2026',
    paymentMethod: 'Efectivo',
    notes: 'Pautas de inhibición motora y regulación del nivel de alerta. Se realizan circuitos de 3 minutos de alta intensidad seguidos de descarga propioceptiva.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },

  // Estefan
  {
    id: 'pn_est_1',
    patientId: 'user_patient_estefan',
    date: '08/03/2026',
    paymentMethod: 'Isapre',
    notes: 'Fortalecimiento de faja lumbopélvica mediante puente glúteo asistido y balance en pelota Bobath. Se educa a madre en transferencias seguras.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },

  // Joaquín Molina
  {
    id: 'pn_joaq_1',
    patientId: 'user_patient_joaquin',
    date: '08/06/2026',
    paymentMethod: 'Transferencia',
    notes: 'Transición bípeda asistida en espaldera. Excelente motivación con los videojuegos de NeuroNexo. Apoyo plantar completo sin eversión.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },

  // Victoria Palacios
  {
    id: 'pn_vic_1',
    patientId: 'user_patient_victoria',
    date: '08/07/2026',
    paymentMethod: 'Efectivo',
    notes: 'Simetría activa de rotación cervical derecha e izquierda. Alcance bimanual en plano medio sin inclinación compensatoria de cabeza.',
    professionalName: 'Dra. Elena Ramírez Soto'
  },

  // Lucas Morales
  {
    id: 'pn_lucas_1',
    patientId: 'user_patient_lucas',
    date: '08/08/2026',
    paymentMethod: 'Bono Web',
    notes: 'Lucas asiste con su padre. Realiza sesión de sentadillas en modo TEA con 8 repeticiones y 92° de flexión. Mantiene talones adheridos al suelo.',
    professionalName: 'Dra. Elena Ramírez Soto'
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


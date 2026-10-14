import { 
  MarketingReferralContact, 
  DigitalInquiryCRM, 
  MarketingBusinessTask, 
  Month1MarketingGoals, 
  SessionPackageOffering 
} from '../types';

// ============================================================================
// METAS PRIMER MES (Plan de Asesoramiento Kinesfera)
// ============================================================================
export const INITIAL_MONTH1_GOALS: Month1MarketingGoals = {
  activePatientsTargetMin: 6,
  activePatientsTargetMax: 8,
  exPatientsFollowUpTargetPercent: 100,
  referrersTargetContacted: 10,
  referrersTargetResponse: 5,
  referrersTargetActive: 2,
  publishedPostsTarget: 12, // 3 por semana: Lunes, Miércoles y Viernes
  digitalInquiriesTargetMin: 10,
  digitalInquiriesTargetMax: 20,
  scheduledEvaluationsTargetMin: 6,
  scheduledEvaluationsTargetMax: 10,
  groupServiceProtocolReady: true
};

// ============================================================================
// DIRECTORIO DE PROSPECCIÓN COMERCIAL Y DERIVADORES (COPIAPÓ)
// Extraído de la base real de prospección de Kinesfera
// ============================================================================
export const INITIAL_REFERRAL_CONTACTS: MarketingReferralContact[] = [
  {
    id: 'ref-1',
    name: 'Dr. Ricardo Paredes',
    specialty: 'Pediatra',
    institutionOrAddress: 'Yerbas Buenas 570',
    zone: 'Copiapó Centro',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-09-01',
    nextStep: 'Visita de presentación con dípticos',
    notes: 'Dejar carta de presentación y folletos enfocados en tortícolis y plagiocefalia.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-2',
    name: 'Dra. Pilar Navarrete',
    specialty: 'Neuróloga Infantil',
    institutionOrAddress: 'Colipi 484, Oficina 507',
    zone: 'Mall Plaza Real / Copiapó',
    status: 'Vigente / Alianza Activa',
    lastInteractionDate: '2026-09-01',
    nextStep: 'Llevar más flyers y formato de contrarreferencia',
    notes: 'Ha derivado pacientes por TDA y retraso en neurodesarrollo. Mantener contacto prioritario.',
    patientsReferredCount: 2
  },
  {
    id: 'ref-3',
    name: 'Dra. Eith Arias',
    specialty: 'Pediatra',
    institutionOrAddress: 'Mall Plaza / Integramédica Copiapó',
    zone: 'Copiapó',
    status: 'Vigente / Alianza Activa',
    lastInteractionDate: '2026-09-01',
    nextStep: 'Llevar más flyers y resultados de evolución',
    notes: 'Derivó casos de plagiocefalia e hipertonía distal. Excelente receptividad.',
    patientsReferredCount: 3
  },
  {
    id: 'ref-4',
    name: 'Dr. Alejandro Rojas',
    specialty: 'Pediatra',
    institutionOrAddress: 'Manuel Rodríguez 483',
    zone: 'Copiapó',
    status: 'Vigente / Alianza Activa',
    lastInteractionDate: '2026-09-01',
    nextStep: 'Llevar más flyers y reportes clínicos',
    notes: 'Derivó paciente respiratorio y motor. Contactar mensualmente.',
    patientsReferredCount: 2
  },
  {
    id: 'ref-5',
    name: 'Dr. Omar Luz',
    specialty: 'Pediatra',
    institutionOrAddress: 'Colipi 570, Edificio Valle de Copiapó',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación presencial',
    notes: 'Insistir en horario previo al inicio de su consulta.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-6',
    name: 'Dra. M. Pilar Merino',
    specialty: 'Pediatra',
    institutionOrAddress: 'Rodríguez 483',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación con dossier clínico',
    notes: 'Coordinar entrega de información clínica sobre desarrollo psicomotor.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-7',
    name: 'Dr. Guillermo Concha',
    specialty: 'Pediatra',
    institutionOrAddress: 'Colipi 484, Mall Plaza Real',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Entregar pauta de detección temprana de asimetrías.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-8',
    name: 'Dr. Robert Serrano',
    specialty: 'Pediatra',
    institutionOrAddress: 'Colipi 484, Torre Flamenco - Clínica Vitalli',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Clínica Vitalli: gran flujo de lactantes y controles de niño sano.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-9',
    name: 'Dr. Carlos Gajardo',
    specialty: 'Pediatra',
    institutionOrAddress: 'Colipi 570, Edificio Valle de Copiapó',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Buscar espacio entre citas para saludo personal.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-10',
    name: 'Dr. Ricardo Varas',
    specialty: 'Pediatra',
    institutionOrAddress: 'Manuel Rodríguez 483',
    zone: 'Copiapó',
    status: 'Vigente / Alianza Activa',
    lastInteractionDate: '2026-09-01',
    nextStep: 'Llevar más flyers y actualización de talleres',
    notes: 'Receptivo con terapias de neurorehabilitación temprana.',
    patientsReferredCount: 1
  },
  {
    id: 'ref-11',
    name: 'Dra. Julia Suárez',
    specialty: 'Pediatra',
    institutionOrAddress: 'Maipú 0110, Integramédica',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Presentar protocolo de descarte precoz de craneosinostosis vs plagiocefalia.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-12',
    name: 'Dr. Bernardo Almeida',
    specialty: 'Pediatra',
    institutionOrAddress: 'Av. Los Carrera 1320',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Zona Los Carrera.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-13',
    name: 'Dr. José Revello',
    specialty: 'Pediatra',
    institutionOrAddress: 'Salas 593',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Coordinar con asistente para breve presentación de 5 minutos.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-14',
    name: 'Dr. Claudio Melo',
    specialty: 'Pediatra',
    institutionOrAddress: 'Colipi 570, Edificio Valle de Copiapó',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Propuesta de trabajo interdisciplinar.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-15',
    name: 'Dr. Aurelio Quiroga',
    specialty: 'Pediatra',
    institutionOrAddress: 'Calle Cosmocentro Plaza Real',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Cosmocentro Plaza Real.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-16',
    name: 'Dr. Sergio Arancia',
    specialty: 'Pediatra',
    institutionOrAddress: 'Rodríguez 483',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Entregar trípticos de pautas de estimulación en prono (tummy time).',
    patientsReferredCount: 0
  },
  {
    id: 'ref-17',
    name: 'Flgo. Rodrigo Castro',
    specialty: 'Fonoaudiólogo',
    institutionOrAddress: 'Rancagua 94',
    zone: 'Copiapó',
    status: 'No hay nadie / Reprogramar',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Ir en horario diferente (tarde)',
    notes: 'Interés potencial en deglución pediátrica y habilidades críticas de comunicación.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-18',
    name: 'Flga. Estefanía Jorquera',
    specialty: 'Fonoaudióloga',
    institutionOrAddress: 'Mackenna 344',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Ir en horario de consulta',
    notes: 'Alianza estratégica para derivación cruzada lenguaje-psicomotricidad.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-19',
    name: 'Dr. Alejandro Aguirre',
    specialty: 'Pediatra',
    institutionOrAddress: 'Vallejos 535',
    zone: 'Copiapó',
    status: 'Solo recibe secretaria',
    lastInteractionDate: '2026-08-27',
    nextStep: 'Visita de presentación',
    notes: 'Vallejos 535.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-20',
    name: 'Flgo. Ignacio Núñez',
    specialty: 'Fonoaudiólogo',
    institutionOrAddress: 'Vallejos 828',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Presentar protocolo de evaluación motriz y perfil sensorial SPM.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-21',
    name: 'Flga. Alexandra Cardozo',
    specialty: 'Fonoaudióloga',
    institutionOrAddress: 'O\'Higgins 1250',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Intervención en TEA y neurodesarrollo.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-22',
    name: 'Flga. Vanessa Cisterna',
    specialty: 'Fonoaudióloga',
    institutionOrAddress: 'Infante 434',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Infante 434.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-23',
    name: 'Flgo. José de la Barra',
    specialty: 'Fonoaudiólogo',
    institutionOrAddress: 'Colipi 484, Oficina 504, Plaza Real',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Ubicado en el mismo edificio que Dra. Navarrete.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-24',
    name: 'Ps. Ingrid Miranda',
    specialty: 'Psicóloga Infantil',
    institutionOrAddress: 'Colipi 570, Edificio Valle de Copiapó',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Enfoque en regulación emocional y psicomotricidad relacional.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-25',
    name: 'Ps. Gisselle Adaos',
    specialty: 'Psicóloga Infantil',
    institutionOrAddress: 'Diego Portales 958',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Diego Portales 958.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-26',
    name: 'Ps. Patricia Aguirre',
    specialty: 'Psicóloga Infantil',
    institutionOrAddress: 'Mackenna 344',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Mackenna 344.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-27',
    name: 'Ps. Francisca Ahumada',
    specialty: 'Psicóloga Infantil',
    institutionOrAddress: 'José Joaquín Vallejos 535, Of 402, Centro Médico Croata',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Centro Médico Croata.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-28',
    name: 'Ps. Marisel Paganini',
    specialty: 'Psicóloga Infantil',
    institutionOrAddress: 'Atacama 581, Edificio Alcázar',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Edificio Alcázar.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-29',
    name: 'Ps. Daniela Fuentes',
    specialty: 'Psicóloga Infantil',
    institutionOrAddress: 'Atacama 581, Edificio Alcázar',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Edificio Alcázar.',
    patientsReferredCount: 0
  },
  {
    id: 'ref-30',
    name: 'Ps. Fernanda Labbé',
    specialty: 'Psicóloga Infantil',
    institutionOrAddress: 'Atacama 581, Edificio Alcázar',
    zone: 'Copiapó',
    status: 'Prospecto Frío',
    lastInteractionDate: undefined,
    nextStep: 'Visita de presentación',
    notes: 'Edificio Alcázar.',
    patientsReferredCount: 0
  }
];

// ============================================================================
// REGISTRO Y SEGUIMIENTO DE PACIENTES - CONSULTAS DIGITALES (CRM)
// Extraído de la planilla de consultas recibidas por WhatsApp / Instagram
// ============================================================================
export const INITIAL_DIGITAL_INQUIRIES: DigitalInquiryCRM[] = [
  {
    id: 'inq-1',
    contactDate: '2026-07-27',
    caregiverName: 'Karla',
    patientName: 'Joaquín y Benjamín',
    phone: '56932512066',
    channel: 'WhatsApp',
    reason: 'Estimulación Temprana',
    status: 'En Tratamiento Activo',
    scheduledDate: '2026-08-04',
    sessionOrPackValue: 70000,
    referredBy: 'Dr. Rojas',
    notes: 'Gemelos en atención continua. Contactarla de nuevo para control de seguimiento.'
  },
  {
    id: 'inq-2',
    contactDate: '2026-08-31',
    caregiverName: 'Claudia',
    patientName: 'Sofía Araya',
    phone: '9 6551 2225',
    channel: 'WhatsApp',
    reason: 'Estimulación Temprana',
    status: 'En Espera / Seguimiento',
    scheduledDate: undefined,
    sessionOrPackValue: 35000,
    referredBy: 'Dra. Eith Arias',
    notes: 'Contactó por DM de Instagram buscando informe para colegio. Enviar propuesta de pack.'
  },
  {
    id: 'inq-3',
    contactDate: '2026-09-08',
    caregiverName: 'Valeria',
    patientName: 'Mauro Mora',
    phone: '997049438',
    channel: 'WhatsApp',
    reason: 'Plagiocefalia y Asimetría Craneal',
    status: 'Evaluación Agendada',
    scheduledDate: '2026-09-09',
    sessionOrPackValue: 35000,
    referredBy: 'Dra. Eith Arias',
    notes: 'Obs Plagiocefalia. Medir con craneómetro en primera sesión y presentar plan.'
  },
  {
    id: 'inq-4',
    contactDate: '2026-09-09',
    caregiverName: 'Sofía',
    patientName: 'Mariano Araya',
    phone: '7974 7972',
    channel: 'Instagram',
    reason: 'Respiratorio / Motor',
    status: 'Evaluación Agendada',
    scheduledDate: '2026-09-10',
    sessionOrPackValue: 25000,
    referredBy: 'Dr. Rojas',
    notes: 'Respiratorio / continuar con rehabilitación motora.'
  },
  {
    id: 'inq-5',
    contactDate: '2026-09-24',
    caregiverName: 'Karol',
    patientName: 'Liam Barraza',
    phone: '56 9 3080 0958',
    channel: 'Recomendación / Boca a Boca',
    reason: 'Hipertonía distal',
    status: 'Primer Contacto',
    scheduledDate: undefined,
    sessionOrPackValue: 35000,
    referredBy: 'Dra. Eith Arias',
    notes: 'Hipertonía distal derivada por Pediatra Edith. Agendar llamada de calificación.'
  },
  {
    id: 'inq-6',
    contactDate: '2026-09-24',
    caregiverName: 'Perla',
    patientName: 'Miranda Coromoto',
    phone: '56 9 5876 6275',
    channel: 'Recomendación / Boca a Boca',
    reason: 'TDA / Neurodesarrollo',
    status: 'Primer Contacto',
    scheduledDate: undefined,
    sessionOrPackValue: 35000,
    referredBy: 'Dra. Pilar Navarrete',
    notes: 'TDA derivada por neuróloga Pilar. Interés en sesión presencial o taller.'
  },
  {
    id: 'inq-7',
    contactDate: '2026-10-02',
    caregiverName: 'Camila Morales',
    patientName: 'Lucas Morales',
    phone: '56 9 8452 1190',
    channel: 'Instagram',
    reason: 'Tortícolis Muscular Congénita',
    status: 'Evaluación Agendada',
    scheduledDate: '2026-10-14',
    sessionOrPackValue: 35000,
    referredBy: 'Meta Ads',
    notes: 'Consulta por giro preferente de cabeza. Cita agendada para medición goniométrica.'
  },
  {
    id: 'inq-8',
    contactDate: '2026-10-05',
    caregiverName: 'Francisca Vega',
    patientName: 'Mateo Vega',
    phone: '56 9 6612 9081',
    channel: 'WhatsApp',
    reason: 'Estimulación Temprana',
    status: 'Pack de Sesiones Pagado',
    scheduledDate: '2026-10-12',
    sessionOrPackValue: 120000,
    referredBy: 'Recomendación',
    notes: 'Adquirió Pack de 4 Sesiones con pauta para el hogar tras la evaluación inicial.'
  }
];

// ============================================================================
// GESTIÓN DE TAREAS Y PROYECTOS - KINESFERA / NEUROXION
// Basado en el Dashboard de Seguimiento de Tareas real y Cronograma Semanal
// ============================================================================
export const INITIAL_BUSINESS_TASKS: MarketingBusinessTask[] = [
  {
    id: 'TK-001',
    description: 'Hacer protocolos de atención clínica (Tortícolis TMC y Plagiocefalia)',
    area: 'Gestión / Admin',
    responsible: 'Aldo',
    priority: 'Alta',
    startDate: '2026-09-01',
    dueDate: '2026-09-05',
    status: 'En Proceso',
    progressPercent: 90,
    weekPhase: 'Semana 1',
    notes: 'Añadir fotos del local, mediciones objetivas y criterios de derivación.'
  },
  {
    id: 'TK-002',
    description: 'Crear servicio de atención grupal (Taller Psicomotriz)',
    area: 'Gestión / Admin',
    responsible: 'Aldo',
    priority: 'Media',
    startDate: '2026-09-02',
    dueDate: '2026-09-08',
    status: 'En Proceso',
    progressPercent: 60,
    weekPhase: 'Semana 2',
    notes: 'Enfoque en psicomotricidad relacional, desarrollo motor y filtros de ingreso.'
  },
  {
    id: 'TK-003',
    description: 'Listado de médicos visitados y prospección Copiapó',
    area: 'Marketing Digital',
    responsible: 'Aldo',
    priority: 'Alta',
    startDate: '2026-08-25',
    dueDate: '2026-09-02',
    status: 'Completada',
    progressPercent: 100,
    weekPhase: 'Semana 1',
    notes: 'Directorio inicial de 30 profesionales consolidado y compartido con asesor.'
  },
  {
    id: 'TK-004',
    description: 'Subir contenido a Instagram (12 posts / 3 por semana)',
    area: 'Marketing Digital',
    responsible: 'Aldo',
    priority: 'Media',
    startDate: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'Completada',
    progressPercent: 100,
    weekPhase: 'Semana 1',
    notes: 'Lunes, Miércoles y Viernes según calendario editorial acordado.'
  },
  {
    id: 'TK-005',
    description: 'Subir contenido educativo a Facebook Fan Page',
    area: 'Marketing Digital',
    responsible: 'Aldo',
    priority: 'Alta',
    startDate: '2026-08-28',
    dueDate: '2026-09-03',
    status: 'Completada',
    progressPercent: 100,
    weekPhase: 'Semana 2',
    notes: 'Vincular con Meta Business Manager y botón directo de WhatsApp.'
  },
  {
    id: 'TK-006',
    description: 'Subir videos dinámicos a TikTok (ejercicios y consejos)',
    area: 'Marketing Digital',
    responsible: 'Aldo',
    priority: 'Media',
    startDate: '2026-09-03',
    dueDate: '2026-09-10',
    status: 'Completada',
    progressPercent: 100,
    weekPhase: 'Semana 2',
    notes: 'Videos cortos demostrando tummy time y agarre palmar.'
  },
  {
    id: 'TK-007',
    description: 'Visita a jardines infantiles y colegios (Charla Jardín Girasol)',
    area: 'Clínica / Atención',
    responsible: 'Aldo',
    priority: 'Baja',
    startDate: '2026-09-05',
    dueDate: '2026-09-20',
    status: 'Completada',
    progressPercent: 100,
    weekPhase: 'Semana 3',
    notes: 'Charla ejecutada en Jardín Girasol sobre hitos del desarrollo motor.'
  },
  {
    id: 'TK-008',
    description: 'Registro de pacientes CRM y seguimiento activo de ex-pacientes',
    area: 'Gestión / Admin',
    responsible: 'Aldo',
    priority: 'Alta',
    startDate: '2026-09-10',
    dueDate: '2026-09-25',
    status: 'En Proceso',
    progressPercent: 80,
    weekPhase: 'Semana 1',
    notes: 'Reactivar a todos los ex-pacientes de los últimos 12 meses con motivo de control.'
  },
  {
    id: 'TK-009',
    description: 'Estandarizar protocolo de primera evaluación y entrega de informe',
    area: 'Clínica / Atención',
    responsible: 'Aldo',
    priority: 'Alta',
    startDate: '2026-09-15',
    dueDate: '2026-09-30',
    status: 'Completada',
    progressPercent: 100,
    weekPhase: 'Semana 3',
    notes: 'Generación automática de informe con HINE, Pilar Arnaiz y SPM.'
  },
  {
    id: 'TK-010',
    description: 'Revisión mensual de métricas y ajuste de campaña publicitaria',
    area: 'Finanzas',
    responsible: 'Aldo + Asesor',
    priority: 'Media',
    startDate: '2026-09-28',
    dueDate: '2026-10-05',
    status: 'Pendiente',
    progressPercent: 30,
    weekPhase: 'Semana 4',
    notes: 'Evaluar costo por adquisición de paciente y conversión de paquetes de sesiones.'
  }
];

// ============================================================================
// OFERTA DE PAQUETES DE SESIONES (ESTRATEGIA COMERCIAL ÉTICA)
// Cómo transformar sesiones sueltas en continuidad terapéutica
// ============================================================================
export const INITIAL_SESSION_PACKAGES: SessionPackageOffering[] = [
  {
    id: 'pack-eval',
    name: 'Evaluación Kinésica Integral + Informe',
    badge: 'Paso 1 Obligatorio',
    sessionCount: 1,
    totalPriceCLP: 35000,
    pricePerSessionCLP: 35000,
    discountOrBonus: 'Incluye informe clínico oficial en PDF/Word',
    idealFor: 'Lactantes y niños con motivo de consulta inicial, asimetría o derivación médica.',
    includesHomeGuide: true,
    includesReevaluation: false,
    active: true
  },
  {
    id: 'pack-4',
    name: 'Pack Liberación & Reposicionamiento (4 Sesiones)',
    badge: 'Más Popular Lactantes',
    sessionCount: 4,
    totalPriceCLP: 120000,
    pricePerSessionCLP: 30000,
    discountOrBonus: 'Ahorro de $20.000 + Pauta ilustrada para el hogar',
    idealFor: 'Tortícolis postural leve o plagiocefalia inicial (< 6 meses de edad).',
    includesHomeGuide: true,
    includesReevaluation: true,
    active: true
  },
  {
    id: 'pack-8',
    name: 'Pack Neurodesarrollo & Simetría (8 Sesiones)',
    badge: 'Recomendado Clínico',
    sessionCount: 8,
    totalPriceCLP: 220000,
    pricePerSessionCLP: 27500,
    discountOrBonus: 'Ahorro de $60.000 + 2 Reevaluaciones antropométricas',
    idealFor: 'Tortícolis muscular con nódulo, plagiocefalia moderada/severa o retraso motor.',
    includesHomeGuide: true,
    includesReevaluation: true,
    active: true
  },
  {
    id: 'pack-12',
    name: 'Programa de Rehabilitación Integral (12 Sesiones)',
    badge: 'Máxima Continuidad',
    sessionCount: 12,
    totalPriceCLP: 300000,
    pricePerSessionCLP: 25000,
    discountOrBonus: 'Ahorro de $120.000 + Informe de alta + Soporte WhatsApp',
    idealFor: 'Condiciones del neurodesarrollo complejas, hipotonía central o apoyo prolongado.',
    includesHomeGuide: true,
    includesReevaluation: true,
    active: true
  },
  {
    id: 'pack-group-4',
    name: 'Taller Grupal Psicomotriz & Estimulación (4 Sesiones)',
    badge: 'Nuevo Servicio Grupal',
    sessionCount: 4,
    totalPriceCLP: 60000,
    pricePerSessionCLP: 15000,
    discountOrBonus: 'Cupo para 4 a 6 niños + interacción con pares',
    idealFor: 'Niños de 2 a 4 años con evaluación previa, estimulación de motricidad y juego.',
    includesHomeGuide: true,
    includesReevaluation: false,
    active: true
  }
];

// ============================================================================
// GUIONES Y ARGUMENTARIOS CLÍNICOS DE VENTA ÉTICA
// (Extraídos directamente de los protocolos de Tortícolis TMC y Plagiocefalia)
// ============================================================================
export const CLINICAL_SCRIPTS = {
  torticolis: {
    title: 'Protocolo Tortícolis Muscular Congénita (TMC)',
    firstConsult: `“Es muy común que los bebés nazcan con una pequeña tensión en el cuello debido a la postura dentro del útero o al momento del parto. Lo más importante es que el cuello del bebé es un tejido blando y altamente moldeable. Si trabajamos ahora en liberar esa tensión, no solo recuperará la movilidad completa del cuello, sino que evitamos que la cabecita se aplane de un solo lado o que le cueste explorar su entorno.”`,
    objectiveMeasurement: `“Hoy medimos los grados de giro de su cabeza. Hacia el lado derecho gira 90°, pero hacia el izquierdo le cuesta y solo llega a 50°. Esa diferencia de 40° es la tensión del músculo que está acortado. Nuestro objetivo semana a semana será ir ganando esos grados hasta que ambos lados estén 100% simétricos.”`,
    treatmentPlan: `“Para que esto se resuelva de forma definitiva no sirve una sola sesión aislada. Planteamos un ciclo de 4 a 8 sesiones donde combinamos terapia manual suave en consulta con ejercicios guiados que ustedes aplicarán en casa durante el juego y la lactancia.”`
  },
  plagiocefalia: {
    title: 'Protocolo Plagiocefalia & Deformidades Craneales',
    firstConsult: `“Es perfectamente normal que sientan dudas; hoy en día los bebés pasan mucho tiempo de espalda por seguridad y esto es sumamente frecuente. La gran noticia es que están aquí justo a tiempo: los primeros meses de vida son la ventana de oro porque el cráneo es sumamente moldeable y el cerebro crece muy rápido. Si intervenimos ahora, aprovechamos esa plasticidad natural para corregirlo de forma rápida y sin procedimientos invasivos.”`,
    objectiveMeasurement: `“No nos vamos a quedar con una apreciación visual. Con el craneómetro medimos en milímetros la diferencia exacta entre las diagonales del cráneo de su bebé. Hoy su índice de asimetría está en un nivel moderado. Medir esto nos permite confirmar exactamente qué necesita y, lo más importante, demostrarles con números en 4 semanas cómo va evolucionando.”`,
    treatmentPlan: `“Para corregir esto no basta con venir a la clínica; el verdadero cambio ocurre en el día a día. Nuestro plan consta de varias semanas donde combinamos la terapia manual y estimulación en consulta con la pauta que ustedes aplican en casa. Tratamos el cráneo, pero también desbloqueamos el cuello para que el bebé vuelva a mirar hacia ambos lados con libertad. Si trabajamos juntos como equipo estas semanas, le evitamos complicaciones futuras en su desarrollo motor o la necesidad de usar casco ortopédico.”`
  },
  objections: [
    {
      objection: '“El pediatra me dijo que con el tiempo se le acomoda solo.”',
      response: '“Es verdad que algunas asimetrías leves mejoran cuando el bebé empieza a sentarse, pero cuando hay una preferencia cervical o un aplanamiento moderado, la gravedad sigue presionando el mismo lado al dormir. Intervenir ahora nos asegura que la corrección sea simétrica y rápida, evitando que se fije a medida que el cráneo se consolida.”',
      tip: 'Validar al pediatra sin desautorizar, enfocando en la prevención activa.'
    },
    {
      objection: '“Me da miedo que le duela cuando le estiran o manipulan el cuello.”',
      response: '“Es totalmente comprensible su temor. La kinesiología infantil moderna no trabaja con dolor ni con fuerza bruta. Usamos técnicas manuales muy suaves y el juego para que el propio bebé active sus músculos. Si el bebé llora, es por incomodidad a la postura o frustración, pero siempre respetamos su límite para que sea una experiencia segura.”',
      tip: 'Transmitir seguridad técnica y empatía con el instinto protector parental.'
    },
    {
      objection: '“No sé si podré venir todas las semanas por tiempo o presupuesto (comprar un pack).”',
      response: '“Entiendo perfectamente que organizar los tiempos con un bebé es un desafío. Por eso coordinamos un plan estructurado: las primeras semanas son clave para liberar la tensión cervical y enseñarles el manejo en casa. Mientras más constantes seamos al principio con el paquete de sesiones, más rápido podremos distanciar las sesiones y darles el alta definitiva.”',
      tip: 'Posicionar el paquete como un ahorro de tiempo y dinero a largo plazo.'
    },
    {
      objection: '“Prefiero pagar sesión a sesión a ver cómo va.”',
      response: '“Puede pagar sesión a sesión sin problema, pero le recomiendo el pack por dos razones: primero, le garantiza el seguimiento continuo y las reevaluaciones periódicas con informe sin costo adicional; y segundo, tiene una bonificación de precio que hace el tratamiento mucho más accesible.”',
      tip: 'Dar la libertad de elegir pero destacando el beneficio del compromiso.'
    }
  ],
  communicationPillars: [
    {
      pillar: 'Encuadre Inicial',
      avoid: '“Tiene una deformidad en la cabeza.”',
      recommended: '“Estamos en el momento perfecto para moldear su cabecita aprovechando su crecimiento.”'
    },
    {
      pillar: 'Evaluación',
      avoid: '“Se le nota aplanado en la parte de atrás.”',
      recommended: '“Utilizamos antropometría objetiva para medir en milímetros y evaluar el progreso real.”'
    },
    {
      pillar: 'Propuesta de Valor',
      avoid: '“Tiene que venir a 10 sesiones de kinesiología.”',
      recommended: '“Diseñamos un programa de acompañamiento para la familia con pautas claras para el hogar.”'
    },
    {
      pillar: 'Prevención',
      avoid: '“Si no lo trata le va a quedar mal.”',
      recommended: '“Tratarlo hoy le garantiza libertad de movimiento y previene tratamientos más complejos a futuro.”'
    }
  ]
};

// ============================================================================
// META ADS DESDE CERO - GUÍA & GENERADOR DE ANUNCIOS (COPIAPÓ / ATACAMA)
// Basado en el material de Álvaro Zamora / Business Builders
// ============================================================================
export const META_ADS_CONFIG = {
  budgets: {
    copiapoLocal: {
      range: '$5.000 – $12.000 CLP / día',
      monthlyEst: '~$80.000 – $150.000 CLP / mes',
      target: 'Ideal para servicios locales y consultorio en Copiapó'
    },
    atacamaRegional: {
      range: '$10.000 – $20.000 CLP / día',
      monthlyEst: '~$120.000 – $250.000 CLP / mes',
      target: 'Amplía alcance a Chañaral, Diego de Almagro y Tierra Amarilla'
    }
  },
  keyMetrics: [
    { metric: 'CPM', target: '< $3 USD (~$2.800 CLP)', desc: 'Si es muy alto, el anzuelo no engancha o la audiencia es muy pequeña.' },
    { metric: 'CTR (Click Through Rate)', target: '> 1.5%', desc: 'Si es bajo, revisa el creativo visual y la primera línea del copy.' },
    { metric: 'CPC (Costo por Clic)', target: '< $0.80 USD (~$750 CLP)', desc: 'Alto CPC indica audiencia equivocada o copy débil.' },
    { metric: 'ROAS', target: '> 3x', desc: 'Por cada $1 invertido en publicidad, deberías generar al menos $3 en sesiones o packs.' }
  ],
  adHooks: [
    {
      topic: 'Tortícolis & Preferencia Postural',
      hook1: '¿Tu bebé siempre mira hacia el mismo lado cuando duerme o toma pecho?',
      hook2: 'El error más común al ver que tu bebé solo gira la cabeza hacia la derecha.',
      hook3: 'No es maña ni costumbre: esa tensión en el cuello se corrige en semanas si actúas hoy.',
      primaryText: 'Es normal notar que un recién nacido tiene su lado favorito, pero si le cuesta girar hacia el otro lado, puede ser una contractura muscular del parto. En Kinesfera Copiapó evaluamos y liberamos la movilidad con técnicas manuales suaves y sin dolor. Agenda tu evaluación esta semana.',
      headline: 'Cuello libre y sin dolor en Copiapó'
    },
    {
      topic: 'Plagiocefalia & Cabeza Aplanada',
      hook1: '¿Notas que la cabecita de tu bebé se está aplanando de un lado?',
      hook2: 'La ventana de los primeros 6 meses: por qué no debes esperar a que "se acomode sola".',
      hook3: 'Cómo medimos en milímetros la asimetría craneal sin procedimientos invasivos.',
      primaryText: 'El cráneo de los bebés es blando y moldeable. Medimos con craneometría exacta la diferencia y diseñamos un plan de reposicionamiento y terapia para evitar el uso futuro de cascos. Cupos limitados en Copiapó.',
      headline: 'Evaluación de asimetría craneal · Copiapó'
    },
    {
      topic: 'Estimulación Temprana & Retraso Motor',
      hook1: '¿Tu bebé tiene más de 6 meses y todavía no logra sentarse o girar?',
      hook2: '3 señales de alerta en el desarrollo motor de tu hijo que puedes detectar en casa.',
      hook3: 'No todos los bebés van al mismo ritmo, pero si hay trabas motoras, la kinesiología ayuda.',
      primaryText: 'Acompañamos a tu bebé a conquistar cada hito motor a través del juego y el movimiento libre. Evaluamos control de cabeza, gateo y marcha con protocolos clínicos estandarizados.',
      headline: 'Estimulación motriz pediátrica · Kinesfera'
    }
  ]
};

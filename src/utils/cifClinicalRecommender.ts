import { User, PatientAnamnesis, ClinicalEvaluations } from '../types';
import { calculatePatientAge } from './ageHelper';

export interface RecommendationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  tags?: string[];
}

export interface CIFCodeItem {
  code: string;
  domain: 'b' | 's' | 'd' | 'e';
  domainLabel: string;
  title: string;
  description: string;
  defaultQualifier: string; // e.g. '.1' o '.2'
}

/**
 * Banco oficial de Códigos CIF (OMS) adaptado a Kinesiología Pediátrica,
 * Neurodesarrollo y Psicomotricidad Infantil.
 */
export const CIF_CODES_BANK: CIFCodeItem[] = [
  // ==========================================
  // FUNCIONES CORPORALES (b)
  // ==========================================
  {
    code: 'b760',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Control de los movimientos voluntarios',
    description: 'Control y coordinación motora simple y compleja, praxia global, disociación de cinturas y patrones motores voluntarios.',
    defaultQualifier: '.2'
  },
  {
    code: 'b755',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Funciones involuntarias del movimiento',
    description: 'Respuestas de equilibración, reacciones de enderezamiento y apoyo protector postural ante perturbaciones gravitatorias.',
    defaultQualifier: '.1'
  },
  {
    code: 'b735',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Funciones del tono muscular',
    description: 'Modulación del tono postural (hipotonía axial, hipertonía fásica, paratonía o extensibilidad articular).',
    defaultQualifier: '.2'
  },
  {
    code: 'b730',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Funciones de la fuerza muscular',
    description: 'Fuerza antigravitatoria de tronco, cinturas escapular y pélvica requerida para la estabilidad postural y bipedestación.',
    defaultQualifier: '.1'
  },
  {
    code: 'b260',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Funciones propioceptivas',
    description: 'Esquema corporal, graduación de la fuerza, sentido de la posición articular y retroalimentación neuromuscular.',
    defaultQualifier: '.2'
  },
  {
    code: 'b235',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Funciones vestibulares de la posición y equilibrio',
    description: 'Sensación de movimiento corporal, aceleración lineal/angular y estabilidad de la mirada durante el desplazamiento.',
    defaultQualifier: '.1'
  },
  {
    code: 'b147',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Funciones psicomotoras',
    description: 'Integración motriz, organización en el espacio, imitación de gestos, ritmo psicomotor y juego sensoriomotor.',
    defaultQualifier: '.2'
  },
  {
    code: 'b710',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Movilidad de las articulaciones',
    description: 'Rango de movilidad activa y pasiva en columna cervical (rotación e inclinación lateral) y articulaciones periféricas.',
    defaultQualifier: '.1'
  },
  {
    code: 'b130',
    domain: 'b',
    domainLabel: 'Funciones Corporales (b)',
    title: 'Funciones de la energía y del impulso (Alerta)',
    description: 'Nivel de alerta fisiológica, autorregulación y motivación para la exploración activa en el entorno lúdico.',
    defaultQualifier: '.1'
  },

  // ==========================================
  // ESTRUCTURAS CORPORALES (s)
  // ==========================================
  {
    code: 's110',
    domain: 's',
    domainLabel: 'Estructuras Corporales (s)',
    title: 'Estructura del cerebro y encéfalo',
    description: 'Circuitos corticosubcorticales, vías de mielinización activa e integración sensoriomotriz central.',
    defaultQualifier: '.1'
  },
  {
    code: 's710',
    domain: 's',
    domainLabel: 'Estructuras Corporales (s)',
    title: 'Estructura de la cabeza y cuello',
    description: 'Bóveda craneana (asimetría craneofacial posicional, CVAI), columna cervical y musculatura suboccipital/ECM.',
    defaultQualifier: '.2'
  },
  {
    code: 's760',
    domain: 's',
    domainLabel: 'Estructuras Corporales (s)',
    title: 'Estructura del tronco y columna vertebral',
    description: 'Alineación de la columna toracolumbar, estabilidad pelviana y control de musculatura paravertebral y abdominal.',
    defaultQualifier: '.1'
  },
  {
    code: 's750',
    domain: 's',
    domainLabel: 'Estructuras Corporales (s)',
    title: 'Estructura de la extremidad inferior',
    description: 'Articulaciones coxofemorales, rodillas, tobillos y bóveda plantar en carga y dinámica.',
    defaultQualifier: '.1'
  },
  {
    code: 's730',
    domain: 's',
    domainLabel: 'Estructuras Corporales (s)',
    title: 'Estructura de la extremidad superior',
    description: 'Cintura escapular, articulación glenohumeral, antebrazo y mano para prensión y alcance funcional.',
    defaultQualifier: '.0'
  },

  // ==========================================
  // ACTIVIDADES Y PARTICIPACIÓN (d)
  // ==========================================
  {
    code: 'd450',
    domain: 'd',
    domainLabel: 'Actividades y Participación (d)',
    title: 'Andar y desplazarse',
    description: 'Marcha en diversas superficies, saltos bipodales/monopodales, carrera y cambios de dirección coordinados.',
    defaultQualifier: '.2'
  },
  {
    code: 'd455',
    domain: 'd',
    domainLabel: 'Actividades y Participación (d)',
    title: 'Desplazarse por el entorno y salvar obstáculos',
    description: 'Sortear desniveles, trepar en juegos de plaza, subir y bajar escaleras de forma autónoma con apoyo alterno.',
    defaultQualifier: '.1'
  },
  {
    code: 'd410',
    domain: 'd',
    domainLabel: 'Actividades y Participación (d)',
    title: 'Cambiar las posturas corporales básicas',
    description: 'Transiciones posturales fluidas: rolado, decúbito a sedente, cuatro puntos a hincado y pase a bipedestación.',
    defaultQualifier: '.2'
  },
  {
    code: 'd415',
    domain: 'd',
    domainLabel: 'Actividades y Participación (d)',
    title: 'Mantener la posición del cuerpo',
    description: 'Sedente activo libre de apoyo, prono con apoyo de antebrazos o palmas, y bipedestación estática prolongada.',
    defaultQualifier: '.1'
  },
  {
    code: 'd440',
    domain: 'd',
    domainLabel: 'Actividades y Participación (d)',
    title: 'Uso fino de la mano y manipulación de objetos',
    description: 'Prensión palmar y pinza digital, uso bimanual coordinado, grafomotricidad y manipulación de útiles escolares.',
    defaultQualifier: '.2'
  },
  {
    code: 'd710',
    domain: 'd',
    domainLabel: 'Actividades y Participación (d)',
    title: 'Relaciones interpersonales básicas y juego compartido',
    description: 'Interacción lúdica con pares y adultos, turnos de juego, seguimiento de reglas motoras y permanencia en la actividad.',
    defaultQualifier: '.1'
  },
  {
    code: 'd815',
    domain: 'd',
    domainLabel: 'Actividades y Participación (d)',
    title: 'Educación preescolar y vida en aula',
    description: 'Permanencia en el puesto de trabajo, seguimiento de instrucciones grupales y participación en Educación Física y recreos.',
    defaultQualifier: '.2'
  },

  // ==========================================
  // FACTORES AMBIENTALES (e)
  // ==========================================
  {
    code: 'e310',
    domain: 'e',
    domainLabel: 'Factores Ambientales (e)',
    title: 'Familia cercana y cuidadores inmediatos (Facilitador)',
    description: 'Cuidadores con alta motivación y adherencia al programa kinésico y rutinas hogareñas (+3 Facilitador sustancial).',
    defaultQualifier: '+3'
  },
  {
    code: 'e585',
    domain: 'e',
    domainLabel: 'Factores Ambientales (e)',
    title: 'Servicios, sistemas y políticas de educación (PIE / Escuela)',
    description: 'Equipo de integración escolar, educadoras de párvulos y profesores de Educación Física coordinados.',
    defaultQualifier: '+2'
  },
  {
    code: 'e115',
    domain: 'e',
    domainLabel: 'Factores Ambientales (e)',
    title: 'Productos y tecnología de apoyo para la vida diaria',
    description: 'Adaptaciones ergonómicas en aula (cojines propioceptivos, banda elástica en silla) y juegos sensoriales en hogar.',
    defaultQualifier: '+2'
  },
  {
    code: 'e250',
    domain: 'e',
    domainLabel: 'Factores Ambientales (e)',
    title: 'Sonido y acústica ambiental (Barrera potencial)',
    description: 'Ruidos intensos en recreos escolares, salas concurridas o timbres que generan sobrecarga sensorial auditiva (-2 Barrera).',
    defaultQualifier: '-2'
  }
];

export const CIF_QUALIFIERS = [
  { value: '.0', label: '.0 Sin problema (0-4%)', desc: 'No existe dificultad apreciable en la función o actividad.' },
  { value: '.1', label: '.1 Dificultad leve (5-24%)', desc: 'Presente en baja intensidad, rendimiento funcional conservado.' },
  { value: '.2', label: '.2 Dificultad moderada (25-49%)', desc: 'Interfiere notoriamente en actividades cotidianas o escolares.' },
  { value: '.3', label: '.3 Dificultad grave (50-95%)', desc: 'Afectación significativa que requiere apoyo asistido constante.' },
  { value: '.4', label: '.4 Dificultad completa (96-100%)', desc: 'Incapacidad total para ejecutar la función o actividad.' }
];

/**
 * Genera automáticamente el Diagnóstico Funcional según el marco C.I.F. (OMS)
 * evaluando Funciones Corporales (b), Estructuras Corporales (s),
 * Actividades y Participación (d), y Factores Ambientales (e).
 */
export function generateAutomaticCIFDiagnosis(
  patient?: User,
  anamnesis?: PatientAnamnesis,
  evaluations?: ClinicalEvaluations
): string {
  const ageInfo = calculatePatientAge(patient?.birthDate);
  const isBaby = ageInfo.totalMonths < 24;

  const bDeficits: string[] = [];
  const dLimitations: string[] = [];
  const sStructures: string[] = [];
  const eFactors: string[] = [];

  // Factores Ambientales comunes
  eFactors.push('e310+3 Familia y cuidadores comprometidos con el plan terapéutico kinésico (Facilitador sustancial)');
  if (ageInfo.isOlderThanThree || anamnesis?.pieSupport) {
    eFactors.push('e585+2 Entorno educativo coordinado (Jardín / Escuela / Equipo PIE) (Facilitador moderado)');
  }
  eFactors.push('e115+2 Apoyos y adaptaciones ergonómicas en el entorno habitual del hogar y aula');

  // Evaluación específica por edad y pruebas
  if (isBaby) {
    // Lactante: HINE + Asimetría craneal
    const hine = evaluations?.hineExam;
    const cranial = anamnesis?.cranialMeasurements;

    sStructures.push('s110.1 Estructura del sistema nervioso central en fase activa de neurodesarrollo y mielinización');

    if (cranial && (cranial.differenceMm ?? 0) > 4) {
      sStructures.push(`s710.2 Estructura ósea craneofacial con asimetría posicional (${cranial.differenceMm} mm diferencia, ${cranial.plagiocephalySeverity || 'asimetría'})`);
      bDeficits.push('b710.2 Funciones de movilidad y alineación articular cervical occipitoatloidea');
      dLimitations.push('d410.2 Dificultad para mantener postura cefálica neutra simétrica en sedente con apoyo y decúbito prono');
    }

    if (hine) {
      const score = hine.totalScore ?? 0;
      if (score < 65) {
        bDeficits.push(`b735.2 Alteración del tono muscular y reacciones posturales tempranas (HINE: ${score}/78, Riesgo)`);
        bDeficits.push('b760.2 Dificultad en control motor antigravitatorio temprano y disociación de cinturas');
        dLimitations.push('d415.2 Limitación en transiciones posturales (rolado, control de cabeza en prono, sedente asistido)');
      } else {
        bDeficits.push(`b730.1 Tono muscular y reflejos dentro de parámetros esperados con requerimiento de estimulación (HINE: ${score}/78)`);
        dLimitations.push('d410.1 Adquisición de hitos del desarrollo motor acorde a edad cronológica y corregida');
      }
    } else {
      bDeficits.push('b760.1 Funciones de control de los movimientos voluntarios y modulación postural');
      dLimitations.push('d410.1 Mantenimiento y transición de posturas corporales según hitos del neurodesarrollo');
    }
  } else {
    // Mayor a 2 años: Da Fonseca o Pilar Arnaiz + SPM-2
    sStructures.push('s110.1 Estructura encefálica y circuitos de integración sensoriomotriz');
    sStructures.push('s798.1 Estructuras musculoesqueléticas relacionadas con la postura, equilibrio y marcha');

    // BPM Da Fonseca
    const bpm = evaluations?.daFonsecaBpm;
    if (bpm) {
      const score = bpm.totalScore ?? 0;
      const isDyspraxic = score > 0 && score <= 13;
      const isDispractor = score >= 14 && score <= 21;

      if (isDyspraxic) {
        bDeficits.push(`b760.3 Dificultad severa en control de movimientos voluntarios y praxias (BPM: ${score}/28, Perfil Dispráxico)`);
        bDeficits.push('b735.2 Alteración de la tonicidad muscular y extensibilidad corporal');
        bDeficits.push('b755.3 Dificultad en respuestas de equilibración estática y dinámica');
        dLimitations.push('d450.3 Dificultad para correr, saltar y sortear obstáculos de forma coordinada');
        dLimitations.push('d440.2 Limitación en motricidad fina, prensión de utensilios y grafomotricidad');
      } else if (isDispractor) {
        bDeficits.push(`b760.2 Inmadurez en integración práxica, ritmo y disociación motora (BPM: ${score}/28, Perfil Dispractor)`);
        bDeficits.push('b755.2 Desajustes en coordinación dinámica y equilibrio monopodal');
        dLimitations.push('d455.2 Dificultad en desplazamientos con cambio de ritmo y velocidad en aula/recreo');
        dLimitations.push('d440.2 Precisión bimanual que requiere modelado y mediación verbal continua');
      } else {
        bDeficits.push(`b760.1 Perfil psicomotor armónico eutráxico (BPM: ${score}/28) con áreas de optimización`);
        dLimitations.push('d450.1 Participación adecuada en juegos motores con requerimiento de resistencia a la fatiga');
      }
    }

    // Pilar Arnaiz
    const arnaiz = evaluations?.psychomotorObservation;
    if (arnaiz) {
      bDeficits.push('b147.2 Funciones psicomotoras de expresión corporal, modulación tónica y juego sensoriomotor libre');
      dLimitations.push('d710.2 Limitación en permanencia compartida e interacción con pares en el juego estructurado');
    }

    // Perfil SPM-2
    const spm = evaluations?.spmSensoryMeasure;
    if (spm) {
      const issues: string[] = [];
      const touch = spm.touchScore ?? 0;
      const bal = spm.balanceMotionScore ?? 0;
      const body = spm.bodyAwarenessScore ?? 0;
      const hea = spm.hearingScore ?? 0;

      if (spm.touchRange?.includes('dificultad') || spm.touchRange?.includes('Dificultades') || touch >= 20) {
        issues.push('modulación táctil');
      }
      if (spm.balanceMotionRange?.includes('dificultad') || spm.balanceMotionRange?.includes('Dificultades') || bal >= 19) {
        issues.push('procesamiento vestibular');
      }
      if (spm.bodyAwarenessRange?.includes('dificultad') || spm.bodyAwarenessRange?.includes('Dificultades') || body >= 19) {
        issues.push('propiocepción y graduación de fuerza');
      }
      if (spm.hearingRange?.includes('dificultad') || spm.hearingRange?.includes('Dificultades') || hea >= 15) {
        issues.push('reactividad auditiva');
      }

      if (issues.length > 0) {
        bDeficits.push(`b260.2-b270.2 Dificultades en procesamiento sensorial con afectación en: ${issues.join(', ')}`);
        dLimitations.push('d815.2 Sobrecarga sensorial que interfiere en la permanencia en sala de clases y rutinas grupales');
      } else {
        bDeficits.push('b260.0 Perfil sensorial global equilibrado (sin dificultades significativas en modulación)');
      }
    }
  }

  // Fallback si no hay pruebas cargadas todavía
  if (bDeficits.length === 0) {
    bDeficits.push('b760.2 Control motor voluntario y modulación del tono postural');
    bDeficits.push('b755.2 Coordinación y equilibración dinámica en actividades cotidianas');
  }
  if (dLimitations.length === 0) {
    dLimitations.push('d450.2 Desplazamientos autónomos y participación activa en juegos de patio y aula');
    dLimitations.push('d440.2 Destrezas visomotoras y manipulación funcional en actividades de la vida diaria');
  }

  return `CLASIFICACIÓN DEL DIAGNÓSTICO FUNCIONAL (C.I.F. - OMS):

1. FUNCIONES CORPORALES (b):
${bDeficits.map(b => `• ${b}`).join('\n')}

2. ESTRUCTURAS CORPORALES (s):
${sStructures.map(s => `• ${s}`).join('\n')}

3. ACTIVIDADES Y PARTICIPACIÓN (d):
${dLimitations.map(d => `• ${d}`).join('\n')}

4. FACTORES AMBIENTALES (e):
${eFactors.map(e => `• ${e}`).join('\n')}

SÍNTESIS DIAGNÓSTICA KINÉSICA:
Paciente de ${ageInfo.ageText || 'edad pediátrica'} que presenta compromiso en la modulación sensoriomotriz y funciones de control motor voluntario, lo cual genera limitaciones en la coordinación dinámica, praxia y participación en actividades lúdicas y escolares, requiriendo intervención kinésica especializada con enfoque ecológico en el hogar y aula educacional.`;
}

/**
 * Propuestas de Objetivos Terapéuticos a Corto Plazo (SMART)
 */
export function generateShortTermGoals(
  patient?: User,
  evaluations?: ClinicalEvaluations
): string {
  const ageInfo = calculatePatientAge(patient?.birthDate);
  const isBaby = ageInfo.totalMonths < 24;

  if (isBaby) {
    return `1) Lograr control cefálico estable en posición decúbito prono y sedente con apoyo durante al menos 3 a 5 minutos continuos sin inclinación lateral fija.
2) Fomentar el rolado voluntario bidireccional (supino a prono y viceversa) facilitando la disociación pélvica en 4 de 5 ensayos.
3) Promover apoyo simétrico de antebrazos y descarga de peso en cuatro puntos para estimular la transición al gateo autónomo.
4) Disminuir la asimetría posicional cervical facilitando giros cefálicos completos activos hacia ambos hemicuerpos mediante estímulos visuales y sonoros.`;
  }

  const spm = evaluations?.spmSensoryMeasure;
  const hasSensoryIssues = spm && ((spm.touchScore ?? 0) >= 18 || (spm.balanceMotionScore ?? 0) >= 19 || (spm.bodyAwarenessScore ?? 0) >= 19);

  return `1) Mejorar el equilibrio estático y dinámico monopodal durante al menos 6 segundos alternando ambas extremidades inferiores sobre superficie plana y colchoneta.
2) Desarrollar la coordinación dinámica general y disociación de cinturas en circuitos motores de saltos bipodales y marcha en tándem sin caídas.
3) Favorecer la graduación de fuerza propioceptiva y prensión funcional en actividades bimanuales y uso de útiles escolares.
4) Regular el nivel de alerta mediante actividades de trabajo pesado y estímulos vestibulares lineales para lograr una permanencia sostenida de 15 a 20 minutos en actividades de mesa.
${hasSensoryIssues ? '5) Incrementar la tolerancia a texturas táctiles variadas (secas y húmedas) sin conductas defensivas durante al menos 10 minutos de juego lúdico.' : '5) Afianzar esquemas de praxia fina y coordinación visomotriz en tareas de enhebrado y encaje guiado.'}`;
}

/**
 * Propuestas de Objetivos Terapéuticos a Largo Plazo
 */
export function generateLongTermGoals(
  patient?: User,
  _evaluations?: ClinicalEvaluations
): string {
  const ageInfo = calculatePatientAge(patient?.birthDate);
  const isBaby = ageInfo.totalMonths < 24;

  if (isBaby) {
    return `1) Consolidar la marcha independiente, funcional y equilibrada en diferentes superficies hogareñas con adecuado braceo recíproco y reacciones de enderezamiento óptimas.
2) Adquirir transiciones posturales fluidas y autónomas desde el suelo a bipedestación sin requerir tracción de extremidades superiores.
3) Normalizar la simetría craneocervical y prevenir deformidades posturales secundarias, alcanzando un neurodesarrollo motor grueso y fino armónico para su edad corregida.`;
  }

  return `1) Lograr un perfil psicomotor funcional y eutráxico que permita la participación activa, coordinada y segura en actividades de educación física, juegos de recreo y desplazamientos en comunidad.
2) Desarrollar estrategias efectivas de autorregulación sensoriomotriz frente a demandas ambientales exigentes (ruidos, transiciones de aula y espacios concurridos).
3) Consolidar la autonomía en destrezas de motricidad fina y actividades de la vida diaria (abotonado, atado de cordones, uso de cubiertos y prensión de lápiz).
4) Fortalecer la autoeficacia motriz, autoestima y vínculo social positivo en el entorno escolar (PIE / Jardín) y familiar.`;
}

/**
 * Sugerencias de Plan de Intervención y Frecuencia Kinésica
 */
export function generateTreatmentPlan(
  patient?: User,
  _evaluations?: ClinicalEvaluations
): string {
  const ageInfo = calculatePatientAge(patient?.birthDate);
  const isBaby = ageInfo.totalMonths < 24;

  if (isBaby) {
    return `FRECUENCIA KINÉSICA RECOMENDADA:
• 2 sesiones semanales de Kinesiología y Neurodesarrollo Pediátrico (45 minutos por sesión).
• Controles de seguimiento y reevaluación craneal cada 4 a 6 semanas.

PLAN DE INTERVENCIÓN TERAPÉUTICA:
1. Enfoque de Neurodesarrollo (Concepto Bobath) para facilitación de hitos motores: control cefálico, rolado, sedente activo y transición al gateo.
2. Terapia de reposicionamiento activo y pautas de Tummy Time graduado para corrección de asimetrías posturales.
3. Estimulación vestibular y propioceptiva suave sobre balón terapéutico Bobath.
4. Educación y empoderamiento a la familia en técnicas de manipulación, alce y juego en el suelo.`;
  }

  return `FRECUENCIA KINÉSICA RECOMENDADA:
• 2 sesiones semanales presenciales de Kinesiología Pediátrica y Psicomotricidad (45 minutos por sesión).
• Reevaluación estandarizada formal a los 3 meses (12 semanas) para medir progreso con BPM Da Fonseca y SPM-2.

PLAN DE INTERVENCIÓN TERAPÉUTICA:
1. Neurorehabilitación sensoriomotriz: circuitos de obstáculos para optimizar praxia global, equilibrio dinámico y coordinación óculo-manual/pedal.
2. Dieta sensorial clínica: actividades de trabajo pesado propioceptivo (tracción, empuje, suspensión y soporte de peso corporal) para regular modulación y alerta.
3. Estimulación de praxia fina y tono postural axial: juegos de estabilización en plano inclinado y manipulación bimanual.
4. Trabajo transdisciplinario y asesoramiento continuo al equipo del Jardín Infantil / Escuela / Aula PIE y entrega de ficha semanal de práctica en el hogar.`;
}

/**
 * Banco completo de Recomendaciones para el Hogar
 */
export const HOME_RECOMMENDATIONS_BANK: RecommendationItem[] = [
  {
    id: 'heavy_work',
    category: 'Sensorial & Tono',
    title: 'Rutina de Trabajo Pesado (Propiocepción)',
    description: 'Realizar actividades de esfuerzo muscular antes de momentos de concentración: ayudar a guardar canastas de juguetes, empujar sillas o gatear imitando animales (oso, cangrejo).'
  },
  {
    id: 'calm_corner',
    category: 'Autorregulación',
    title: 'Rincón de la Calma y Descarga',
    description: 'Crear un espacio seguro en la habitación con cojines grandes, manta de peso o luces tenues donde el niño pueda acudir a autorregularse cuando se sienta sobreestimulado.'
  },
  {
    id: 'barefoot_play',
    category: 'Equilibrio & Postura',
    title: 'Juego Descalzo en Superficies Variadas',
    description: 'Permitir caminar descalzo en alfombras, pasto, tierra y cojines para activar receptores plantares, fortalecer el arco del pie y mejorar la estabilidad articular.'
  },
  {
    id: 'living_circuits',
    category: 'Coordinación Motora',
    title: 'Circuitos Motores en el Living',
    description: 'Diseñar circuitos seguros con cojines, cintas en el suelo y túneles bajo mesas para practicar saltos, equilibrio sobre un pie y reptado.'
  },
  {
    id: 'tactile_play',
    category: 'Procesamiento Táctil',
    title: 'Exploración Táctil Progresiva',
    description: 'Juegos de cocina con masas, gelatina, arena mágica o espuma de afeitar. Si hay rechazo, iniciar con herramientas (cucharas) antes del contacto directo.'
  },
  {
    id: 'screens_routine',
    category: 'Higiene del Desarrollo',
    title: 'Reducción de Pantallas y Juego Activo',
    description: 'Limitar pantallas a menos de 1 hora diaria y fomentar al menos 60 minutos de movimiento vigoroso al aire libre para regular neurotransmisores y patrones de sueño.'
  },
  {
    id: 'tummy_time_baby',
    category: 'Lactantes (< 2 años)',
    title: 'Tummy Time (Juego en Prono) Asistido',
    description: 'Colocar al bebé boca abajo sobre el pecho de los padres o en colchoneta firme durante períodos breves y frecuentes (3 a 5 min tras cada muda) con juguetes a la altura de sus ojos.'
  }
];

/**
 * Banco completo de Recomendaciones para Jardín / Escuela / Aula PIE
 */
export const SCHOOL_RECOMMENDATIONS_BANK: RecommendationItem[] = [
  {
    id: 'sensory_breaks',
    category: 'Atención & Alerta',
    title: 'Pausas Sensoriales Activas en Aula (cada 25-30 min)',
    description: 'Permitir levantarse a repartir cuadernos, estirar extremidades contra la pared o realizar 5 saltos suaves para reactivar el sistema nervioso sin interrumpir la clase.'
  },
  {
    id: 'classroom_placement',
    category: 'Ambiente Escolar',
    title: 'Ubicación Estratégica en la Sala',
    description: 'Ubicar al estudiante en las primeras filas, centrado respecto a la pizarra y lejos de ventanas o puertas con tránsito constante para disminuir la sobrecarga visual y auditiva.'
  },
  {
    id: 'ergonomic_supports',
    category: 'Postura & Sedente',
    title: 'Apoyos Propioceptivos en el Pupitre',
    description: 'Incorporar una banda elástica de resistencia en las patas de la silla para apoyar y mover los pies, o un cojín de aire dinámico para favorecer la estabilidad del tronco.'
  },
  {
    id: 'pe_adaptations',
    category: 'Educación Física',
    title: 'Adecuación en Clases de Educación Física',
    description: 'Fraccionar consignas complejas en pasos simples de 1 o 2 instrucciones, permitir apoyos visuales y priorizar la participación y coordinación sobre la velocidad.'
  },
  {
    id: 'visual_schedules',
    category: 'Estructura & Transición',
    title: 'Anticipación Visual de Rutinas y Transiciones',
    description: 'Avisar 3 a 5 minutos antes de cambiar de actividad o asignatura mediante apoyo visual (horario o temporizador de colores) para evitar respuestas de frustración.'
  },
  {
    id: 'sound_decompression',
    category: 'Sensibilidad Auditiva',
    title: 'Manejo de Ruidos Fuertes y Recreos',
    description: 'Permitir el uso de protectores auditivos tipo copa o salida anticipada 2 minutos antes del toque de timbre durante actos cívicos o recreos masivos si manifiesta malestar.'
  },
  {
    id: 'pie_coordination',
    category: 'Equipo Diferencial',
    title: 'Coordinación Semanal con Educadora Diferencial / PIE',
    description: 'Alinear los objetivos kinésicos con el Plan de Adecuación Curricular Individual (PACI) y registrar adaptaciones en el cuaderno de aula compartida.'
  }
];

export function getRecommendedHomeList(
  patient?: User,
  evaluations?: ClinicalEvaluations
): string[] {
  const ageInfo = calculatePatientAge(patient?.birthDate);
  const isBaby = ageInfo.totalMonths < 24;

  if (isBaby) {
    return [
      '• Tummy Time estructurado: 4 a 6 repeticiones diarias de 5 minutos sobre colchoneta firme o pecho materno/paterno.',
      '• Estimulación de giros activos hacia ambos lados usando juguetes sonoros a 30 cm de distancia.',
      '• Alternancia estricta de la postura de la cabeza durante el sueño y porteo ergonómico para liberar presiones craneales.',
      '• Masajes propioceptivos suaves en extremidades y abdomen tras el baño para favorecer el esquema corporal.'
    ];
  }

  const list: string[] = [
    '• Rutina diaria de "Trabajo Pesado" antes de tareas: empujar canasta de juguetes, gatear como animales y ayudar a acarrear compras livianas.',
    '• Rincón de la calma en casa con cojines y mantita pesada para momentos de frustración o sobrecarga sensorial.',
    '• Fomentar juego descalzo sobre texturas variadas (pasto, colchoneta, alfombra) para potenciar equilibrio y tono plantar.',
    '• Circuito motor casero en el living: pasar bajo sillas, caminar en línea recta con un cojín en la cabeza y saltar dos almohadas.',
    '• Actividades de amasado con plastilina o masa casera para regular fuerza manual y destreza bimanual.'
  ];

  const spm = evaluations?.spmSensoryMeasure;
  const touch = spm?.touchScore ?? 0;
  if (spm && (touch >= 18 || spm.touchRange?.includes('dificultad') || spm.touchRange?.includes('Dificultades'))) {
    list.push('• Exposición táctil gradual a texturas sin forzar (espumas, harina, semillas) mediante juego lúdico guiado.');
  }

  return list;
}

export function getRecommendedSchoolList(
  patient?: User,
  _evaluations?: ClinicalEvaluations
): string[] {
  const ageInfo = calculatePatientAge(patient?.birthDate);
  if (!ageInfo.isOlderThanThree) {
    return [
      '• Por la edad del paciente (< 3 años), las pautas se concentran en el hogar o sala cuna si asiste.',
      '• En sala cuna: promover libertad de movimiento en el suelo y evitar uso prolongado de andadores o sillas nido.'
    ];
  }

  return [
    '• Pausas activas sensoriomotoras cada 25-30 minutos (estiramientos en la pared, saltos suaves o repartir materiales de clase).',
    '• Ubicación preferente en la sala de clases: alejado de ventanas y puertas distractoras, centrado a la educadora.',
    '• Apoyo propioceptivo en el asiento: elástico en patas de la silla para apoyo de pies o cojín de estimulación vestibular.',
    '• Anticipación visual de rutinas y cambios de actividad para reducir estrés en las transiciones escolares.',
    '• Adaptación en Educación Física: consignas cortas, demostración previa y permitir descanso ante fatiga motriz.',
    '• Coordinación periódica entre el equipo kinésico de KinesFera y el equipo PIE / Educadora diferencial.'
  ];
}

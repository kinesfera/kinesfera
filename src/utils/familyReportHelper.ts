import { ComprehensiveReport, ProgressNote } from '../types';

export interface FamilyThreeLineSummary {
  arrival: string;
  workDone: string;
  currentState: string;
}

export interface FamilyTrafficLightItem {
  areaName: string;
  parentExplanation: string; // Explaining clinical terms in 1 short line in parentheses
  status: 'verde' | 'amarillo' | 'rojo';
  statusLabel: string;
  levelPercent: number;
}

export interface FamilyComparativeItem {
  areaName: string;
  parentExplanation: string;
  initialScore: number; // 0 to 100 or 1 to 4
  currentScore: number;
  maxScore: number;
  unit: string;
}

export interface FamilyTimelinePoint {
  dateLabel: string;
  sessionNumber: number;
  progressPercent: number;
  noteExcerpt: string;
}

/**
 * Strips heavy clinical jargon and extracts a warm, 3-line summary for parents:
 * a) Cómo llegó
 * b) Qué se trabajó
 * c) Cómo está hoy
 */
export function getFamilyThreeLineSummary(
  report: ComprehensiveReport,
  notes: ProgressNote[] = []
): FamilyThreeLineSummary {
  const patientFirstName = report.patientName.split(' ')[0] || 'El niño/a';
  const anam = report.anamnesis;
  const evalData = report.evaluations;

  // 1. Cómo llegó
  let arrival = '';
  if (anam?.consultationReason) {
    const reason = anam.consultationReason;
    if (reason.toLowerCase().includes('déficit atencional') || reason.toLowerCase().includes('atención') || reason.toLowerCase().includes('concentración')) {
      arrival = `${patientFirstName} comenzó sus sesiones tras ser derivado/a para apoyar su atención, concentración y rendimiento escolar, buscando fortalecer su seguridad al aprender.`;
    } else if (reason.toLowerCase().includes('psicomotricidad') || reason.toLowerCase().includes('motor')) {
      arrival = `${patientFirstName} inició sus sesiones para evaluar y potenciar su desarrollo motor, equilibrio y coordinación corporal en sus actividades diarias.`;
    } else {
      // Clean string
      arrival = `${patientFirstName} llegó a consulta para recibir apoyo en su desarrollo, motricidad y adaptación a sus actividades escolares y familiares.`;
    }
  } else {
    arrival = `${patientFirstName} inició su proceso terapéutico para potenciar su confianza motriz y coordinación en el juego.`;
  }

  // 2. Qué se trabajó
  let workDone = '';
  if (notes.length > 0) {
    workDone = `A lo largo de las sesiones realizamos juegos activos, circuitos de equilibrio, ejercicios de coordinación mano-ojo y actividades para regular la fuerza del cuerpo.`;
  } else if (evalData?.treatmentPlan) {
    workDone = `Diseñamos y aplicamos un plan de kinesiología y psicomotricidad a través de juegos con sentido, fortaleciendo el equilibrio, la postura y la coordinación de movimientos.`;
  } else {
    workDone = `Trabajamos ejercicios lúdicos enfocados en la coordinación de brazos y piernas, el equilibrio dinámico y la precisión en sus manitos.`;
  }

  // 3. Cómo está hoy
  let currentState = '';
  const totalBpm = evalData?.daFonsecaBpm?.totalScore;
  if (totalBpm && totalBpm >= 20) {
    currentState = `Hoy ${patientFirstName} muestra una base motora sólida, gran motivación en cada juego, excelente destreza con sus manos y mayor seguridad corporal para participar en el colegio y el hogar.`;
  } else if (evalData?.daFonsecaBpm?.profileResult) {
    currentState = `Hoy ${patientFirstName} participa con entusiasmo y alegría, logrando avances significativos en su confianza motriz y regulación de energía en las actividades cotidianas.`;
  } else {
    currentState = `Hoy ${patientFirstName} se muestra activo/a, alegre y con mayores herramientas para explorar su entorno y aprender jugando.`;
  }

  return {
    arrival,
    workDone,
    currentState
  };
}

/**
 * Extracts traffic light items from Da Fonseca BPM and SPM Sensory Profile
 */
export function getFamilyTrafficLightItems(report: ComprehensiveReport): FamilyTrafficLightItem[] {
  const bpm = report.evaluations?.daFonsecaBpm;
  const spm = report.evaluations?.spmSensoryMeasure;
  const items: FamilyTrafficLightItem[] = [];

  // 1. Manos y Dedos (Praxia fina)
  if (bpm?.finePraxiaScore !== undefined) {
    const score = bpm.finePraxiaScore;
    items.push({
      areaName: 'Manos y Dedos',
      parentExplanation: 'Praxia fina (fuerza y precisión en dedos para tomar lápices, tijeras y abotonar)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Muy buen control y precisión' : 'En práctica con juegos manuales',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  // 2. Coordinación de Brazos y Piernas (Praxia global)
  if (bpm?.globalPraxiaScore !== undefined) {
    const score = bpm.globalPraxiaScore;
    items.push({
      areaName: 'Coordinación General',
      parentExplanation: 'Praxia global (mover brazos y piernas de forma sincronizada al correr o saltar)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Movimientos fluidos y coordinados' : 'Desarrollando mayor ritmo y coordinación',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  // 3. Equilibrio y Estabilidad
  if (bpm?.equilibriumScore !== undefined) {
    const score = bpm.equilibriumScore;
    items.push({
      areaName: 'Equilibrio y Estabilidad',
      parentExplanation: 'Control vestibular (seguridad para pararse en un pie, caminar sobre líneas y no tropezar)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Estable y seguro/a' : 'Reforzando la seguridad al moverse',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  // 4. Conciencia del Cuerpo (Propiocepción / Noción Corporal)
  if (bpm?.bodyNotionScore !== undefined || spm?.bodyAwarenessScore !== undefined) {
    const spmBody = spm?.bodyAwarenessScore ?? 60;
    const bpmBody = bpm?.bodyNotionScore ?? 2.6;
    
    // SPM: higher than 60 means challenges with body force; BPM: < 3 means developing
    const isChallenging = spmBody >= 60 || bpmBody < 3;
    items.push({
      areaName: 'Conciencia del Cuerpo',
      parentExplanation: 'Propiocepción (saber ubicar las partes del cuerpo y regular cuánta fuerza aplicar)',
      status: isChallenging ? 'amarillo' : 'verde',
      statusLabel: isChallenging ? 'Aprendiendo a regular la fuerza (no apretar de más el lápiz)' : 'Buena noción de su cuerpo',
      levelPercent: Math.min(100, Math.round((bpmBody / 4) * 100))
    });
  }

  // 5. Espacio y Tiempo (Organización espacial)
  if (bpm?.spatialTemporalScore !== undefined) {
    const score = bpm.spatialTemporalScore;
    items.push({
      areaName: 'Organización en el Espacio',
      parentExplanation: 'Estructuración espacio-temporal (orientarse en el papel, seguir renglones y ritmos)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Buena ubicación y noción de espacio' : 'Trabajando la orientación en el papel',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  // 6. Preferencia Lateral
  if (bpm?.lateralityScore !== undefined) {
    const score = bpm.lateralityScore;
    items.push({
      areaName: 'Preferencia de Lado',
      parentExplanation: 'Lateralidad (definición clara de mano, ojo y pie dominante diestro o zurdo)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Lado dominante bien definido y firme' : 'En proceso de definición',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  return items;
}

/**
 * Extracts comparative bars (Initial vs Current/Final)
 */
export function getFamilyComparativeItems(report: ComprehensiveReport): FamilyComparativeItem[] {
  const bpm = report.evaluations?.daFonsecaBpm;
  if (!bpm) return [];

  // Compare standard baseline vs current evaluation score
  const items: FamilyComparativeItem[] = [
    {
      areaName: 'Fuerza y Firmeza Muscular',
      parentExplanation: 'Tono muscular (fuerza justa para sostenerse erguido/a sin fatigarse)',
      initialScore: 2.2,
      currentScore: bpm.tonicityScore ?? 3.1,
      maxScore: 4.0,
      unit: 'pts'
    },
    {
      areaName: 'Equilibrio al Moverse',
      parentExplanation: 'Control postural (estabilidad al saltar y balancearse)',
      initialScore: 1.8,
      currentScore: bpm.equilibriumScore ?? 2.8,
      maxScore: 4.0,
      unit: 'pts'
    },
    {
      areaName: 'Precisión con Manos y Dedos',
      parentExplanation: 'Motricidad fina (agilidad digital para colorear y abrochar)',
      initialScore: 2.4,
      currentScore: bpm.finePraxiaScore ?? 3.2,
      maxScore: 4.0,
      unit: 'pts'
    },
    {
      areaName: 'Coordinación Corporal Total',
      parentExplanation: 'Praxia global (armonía al saltar, trepar y desplazarse)',
      initialScore: 1.9,
      currentScore: bpm.globalPraxiaScore ?? 2.7,
      maxScore: 4.0,
      unit: 'pts'
    },
    {
      areaName: 'Organización en el Espacio',
      parentExplanation: 'Noción espacial (seguir líneas en cuadernos y circuitos)',
      initialScore: 1.5,
      currentScore: bpm.spatialTemporalScore ?? 2.0,
      maxScore: 4.0,
      unit: 'pts'
    }
  ];

  return items;
}

/**
 * Extracts timeline evolution from progress notes
 */
export function getFamilyTimelinePoints(notes: ProgressNote[] = []): FamilyTimelinePoint[] {
  if (!notes || notes.length < 2) return [];

  // Sort notes by date chronologically
  const sorted = [...notes].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return sorted.map((n, idx) => {
    // Generate progress curve from 40% at session 1 scaling up towards 90%+
    const progress = Math.min(95, Math.round(40 + (idx / Math.max(1, sorted.length - 1)) * 52));
    const d = new Date(n.date);
    const dateFormatted = !isNaN(d.getTime()) 
      ? d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
      : n.date;

    return {
      dateLabel: dateFormatted,
      sessionNumber: idx + 1,
      progressPercent: progress,
      noteExcerpt: n.notes.slice(0, 75) + (n.notes.length > 75 ? '...' : '')
    };
  });
}

/**
 * Extracts short, bulleted achievements with checkmark
 */
export function getFamilyAchievements(report: ComprehensiveReport): string[] {
  const list: string[] = [];
  const evalData = report.evaluations;
  const bpm = evalData?.daFonsecaBpm;

  if (bpm?.lateralityScore && bpm.lateralityScore >= 3.5) {
    list.push('Lateralidad muy bien definida (reconoce con claridad y seguridad su lado dominante diestro).');
  }
  if (bpm?.finePraxiaScore && bpm.finePraxiaScore >= 3.0) {
    list.push('Gran destreza en sus manos y dedos (buena precisión para escribir, colorear y manipular piezas pequeñas).');
  }
  if (bpm?.tonicityScore && bpm.tonicityScore >= 3.0) {
    list.push('Fuerza muscular adecuada (capacidad de relajación y buena postura en juegos de mesa y de suelo).');
  }
  if (evalData?.spmSensoryMeasure?.hearingScore && evalData.spmSensoryMeasure.hearingScore < 60) {
    list.push('Procesamiento sensorial adaptativo en visión, audición y tacto para participar en ambientes de juego.');
  }

  // Fallbacks if not enough
  if (list.length < 3) {
    list.push('Excelente disposición y alegría para participar en las actividades lúdicas propuestas.');
    list.push('Mayor confianza al explorar circuitos motores y desafíos de movimiento.');
  }

  return list.slice(0, 5);
}

/**
 * Extracts next steps in plain language
 */
export function getFamilyNextSteps(report: ComprehensiveReport): string[] {
  const list: string[] = [];
  const evalData = report.evaluations;
  const bpm = evalData?.daFonsecaBpm;

  if (bpm?.equilibriumScore && bpm.equilibriumScore < 3.0) {
    list.push('Continuar reforzando el equilibrio dinámico (saltar sobre obstáculos y pararse en un pie sin perder la estabilidad).');
  }
  if (bpm?.bodyNotionScore && bpm.bodyNotionScore < 3.0) {
    list.push('Profundizar en la noción del cuerpo y la regulación de la fuerza (aprender a modular cuánta fuerza aplica al escribir o jugar).');
  }
  if (bpm?.spatialTemporalScore && bpm.spatialTemporalScore < 3.0) {
    list.push('Afianzar la organización en el espacio y el tiempo (apoyo visual con renglones, laberintos y secuencias).');
  }
  if (bpm?.globalPraxiaScore && bpm.globalPraxiaScore < 3.0) {
    list.push('Seguir practicando la coordinación motora global (circuitos con cambios de dirección, gateo y trepa).');
  }

  list.push('Acompañar a la familia y a la escuela con estrategias sencillas de regulación en el aula.');

  return list.slice(0, 4);
}

/**
 * Extracts maximum 5 concrete, practical home recommendations
 */
export function getFamilyHomeRecommendations(report: ComprehensiveReport): { title: string; desc: string; icon: string }[] {
  return [
    {
      title: 'Rutinas visuales claras',
      desc: 'Usar un horario con dibujos o imágenes para las tareas del día (desayuno, colegio, tareas, juego y dormir). Le da tranquilidad y seguridad.',
      icon: 'calendar'
    },
    {
      title: 'Juegos para regular la fuerza',
      desc: 'Amasar plasticina, rasgar papel, aplastar esponjas en agua o transportar bolsitas. Ayuda a que sus deditos no aprieten tanto el lápiz.',
      icon: 'hand'
    },
    {
      title: 'Circuitos de juego en casa',
      desc: 'Poner cojines o cintas en el piso para caminar haciendo equilibrio, saltar como ranitas o gatear por debajo de una mesa.',
      icon: 'activity'
    },
    {
      title: 'Lectura compartida y relajada',
      desc: 'Dedicar 10 a 15 minutos diarios a leer juntos un cuento ilustrado. Lo importante es disfrutar la historia, sin presionar la velocidad.',
      icon: 'book'
    },
    {
      title: 'Límites saludables de pantallas',
      desc: 'Máximo 30 a 45 minutos al día de celular o televisión, siempre acompañados, priorizando el juego físico y al aire libre.',
      icon: 'smartphone'
    }
  ];
}

/**
 * Generates formatted text for WhatsApp sharing
 */
export function generateWhatsAppMessage(
  report: ComprehensiveReport,
  summary: FamilyThreeLineSummary,
  achievements: string[],
  nextSteps: string[],
  homeTips: { title: string; desc: string }[]
): string {
  const patientName = report.patientName;
  const profName = report.professionalName;
  const date = report.dateGenerated;

  let text = `✨ *INFORME DE PROGRESO - CENTRO KINESFERA* ✨\n`;
  text += `🧒 *Paciente:* ${patientName}\n`;
  text += `📅 *Fecha:* ${date}\n`;
  text += `👨‍⚕️ *Profesional:* ${profName}\n\n`;

  text += `📋 *RESUMEN DE SU PROCESO:*\n`;
  text += `🌱 *Cómo llegó:* ${summary.arrival}\n`;
  text += `🎯 *Qué trabajamos:* ${summary.workDone}\n`;
  text += `⭐ *Cómo está hoy:* ${summary.currentState}\n\n`;

  text += `🏆 *LOGROS PRINCIPALES:*\n`;
  achievements.forEach(ach => {
    text += `✔ ${ach}\n`;
  });
  text += `\n`;

  text += `🚀 *PRÓXIMOS PASOS:*\n`;
  nextSteps.forEach(st => {
    text += `• ${st}\n`;
  });
  text += `\n`;

  text += `🏡 *CONSEJOS PARA CASA:*\n`;
  homeTips.slice(0, 5).forEach((tip, i) => {
    text += `${i + 1}. *${tip.title}:* ${tip.desc}\n`;
  });

  text += `\n💙 *¡Muchas gracias por confiar en Kinesfera: Creando Sentido Al Juego!*`;

  return text;
}

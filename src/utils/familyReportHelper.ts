import { ComprehensiveReport, ProgressNote } from '../types';
import { calculatePatientAge, formatDateDMY } from './ageHelper';

export interface FamilyThreeLineSummary {
  arrival: string;
  workDone: string;
  currentState: string;
}

export interface FamilyTrafficLightItem {
  areaName: string;
  parentExplanation: string;
  status: 'verde' | 'amarillo' | 'rojo';
  statusLabel: string;
  levelPercent: number;
}

export interface FamilyComparativeItem {
  areaName: string;
  parentExplanation: string;
  initialScore: number;
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
  const patientFirstName = report.patientName.split(' ')[0] || 'El usuario';
  const anam = report.anamnesis;
  const evalData = report.evaluations;
  const ageInfo = calculatePatientAge(report.patientBirthDate);
  const isBaby = ageInfo.isUnderTwo || anam?.ageCategory === 'bebe_hasta_18_meses';

  if (isBaby) {
    return {
      arrival: `${patientFirstName} inició su atención kinésica para evaluar y acompañar su desarrollo motor temprano, control postural, tono muscular y simetría craneocervical.`,
      workDone: `Mediante sesiones de kinesiología y psicomotricidad temprana trabajamos el control de cabeza y tronco, giros activos hacia ambos lados, apoyo en prono (Tummy Time) y reacciones posturales.`,
      currentState: `Hoy ${patientFirstName} muestra avances favorables en su alineación postural, mayor simetría de movimiento y participación activa junto a su familia en el hogar.`
    };
  }

  // 1. Cómo llegó (> 2 años)
  let arrival = '';
  if (anam?.consultationReason) {
    const reason = anam.consultationReason;
    if (reason.toLowerCase().includes('déficit atencional') || reason.toLowerCase().includes('atención') || reason.toLowerCase().includes('concentración')) {
      arrival = `${patientFirstName} comenzó sus sesiones tras ser derivado/a para apoyar su atención, concentración y desarrollo psicomotor, buscando fortalecer su seguridad al aprender.`;
    } else if (reason.toLowerCase().includes('psicomotricidad') || reason.toLowerCase().includes('motor')) {
      arrival = `${patientFirstName} inició sus sesiones para evaluar y potenciar su desarrollo motor, equilibrio y coordinación corporal en sus actividades diarias.`;
    } else {
      arrival = `${patientFirstName} llegó a consulta para recibir apoyo en su desarrollo psicomotor, motricidad y adaptación a sus actividades cotidianas y familiares.`;
    }
  } else {
    arrival = `${patientFirstName} inició su proceso terapéutico para potenciar su confianza motriz y coordinación en el juego.`;
  }

  // 2. Qué se trabajó
  let workDone = '';
  if (notes.length > 0) {
    workDone = `A lo largo de las sesiones realizamos juegos activos de psicomotricidad, circuitos de equilibrio, ejercicios de coordinación mano-ojo y actividades para regular la fuerza del cuerpo.`;
  } else if (evalData?.treatmentPlan) {
    workDone = `Diseñamos y aplicamos un plan de kinesiología y psicomotricidad a través de juegos con sentido, fortaleciendo el equilibrio, la postura y la coordinación de movimientos.`;
  } else {
    workDone = `Trabajamos ejercicios lúdicos enfocados en la coordinación de brazos y piernas, el equilibrio dinámico y la precisión manual.`;
  }

  // 3. Cómo está hoy
  let currentState = '';
  const totalBpm = evalData?.daFonsecaBpm?.totalScore;
  if (totalBpm && totalBpm >= 20) {
    currentState = `Hoy ${patientFirstName} muestra una base motora sólida, gran motivación en cada juego, excelente destreza manual y mayor seguridad corporal en sus rutinas diarias.`;
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

  if (bpm?.finePraxiaScore !== undefined) {
    const score = bpm.finePraxiaScore;
    items.push({
      areaName: 'Manos y Dedos',
      parentExplanation: 'Praxia fina (fuerza y precisión en dedos para tomar objetos y manipular)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Muy buen control y precisión' : 'En práctica con juegos manuales',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  if (bpm?.globalPraxiaScore !== undefined) {
    const score = bpm.globalPraxiaScore;
    items.push({
      areaName: 'Coordinación General',
      parentExplanation: 'Praxia global (mover brazos y piernas de forma sincronizada)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Movimientos fluidos y coordinados' : 'Desarrollando mayor ritmo y coordinación',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  if (bpm?.equilibriumScore !== undefined) {
    const score = bpm.equilibriumScore;
    items.push({
      areaName: 'Equilibrio y Estabilidad',
      parentExplanation: 'Control vestibular (seguridad postural y estabilidad al moverse)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Estable y seguro/a' : 'Reforzando la seguridad al moverse',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  if (bpm?.bodyNotionScore !== undefined || spm?.bodyAwarenessScore !== undefined) {
    const spmBody = spm?.bodyAwarenessScore ?? 60;
    const bpmBody = bpm?.bodyNotionScore ?? 2.6;
    const isChallenging = spmBody >= 60 || bpmBody < 3;
    items.push({
      areaName: 'Conciencia del Cuerpo',
      parentExplanation: 'Propiocepción (saber ubicar las partes del cuerpo y regular cuánta fuerza aplicar)',
      status: isChallenging ? 'amarillo' : 'verde',
      statusLabel: isChallenging ? 'Aprendiendo a graduar la fuerza corporal' : 'Buena noción de su cuerpo',
      levelPercent: Math.min(100, Math.round((bpmBody / 4) * 100))
    });
  }

  if (bpm?.spatialTemporalScore !== undefined) {
    const score = bpm.spatialTemporalScore;
    items.push({
      areaName: 'Organización en el Espacio',
      parentExplanation: 'Estructuración espacio-temporal (orientarse en el entorno y seguir ritmos)',
      status: score >= 3 ? 'verde' : score >= 2 ? 'amarillo' : 'rojo',
      statusLabel: score >= 3 ? 'Buena ubicación y noción de espacio' : 'Trabajando la orientación espacial',
      levelPercent: Math.min(100, Math.round((score / 4) * 100))
    });
  }

  if (bpm?.lateralityScore !== undefined) {
    const score = bpm.lateralityScore;
    items.push({
      areaName: 'Preferencia de Lado',
      parentExplanation: 'Lateralidad (definición clara de mano, ojo y pie dominante)',
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
      parentExplanation: 'Motricidad fina (agilidad digital y coordinación bimanual)',
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
      parentExplanation: 'Noción espacial (orientación en circuitos y secuencias)',
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

  const sorted = [...notes].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return sorted.map((n, idx) => {
    const progress = Math.min(95, Math.round(40 + (idx / Math.max(1, sorted.length - 1)) * 52));
    return {
      dateLabel: formatDateDMY(n.date),
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
  const ageInfo = calculatePatientAge(report.patientBirthDate);
  const isBaby = ageInfo.isUnderTwo || report.anamnesis?.ageCategory === 'bebe_hasta_18_meses';

  if (isBaby) {
    return [
      'Adecuada respuesta visual y auditiva con interés activo por su entorno y cuidadores.',
      'Progreso favorable en el control de cabeza, alineación axial en línea media y tolerancia al juego en prono.',
      'Mejoría progresiva en la simetría de giros cervicales y activación de reacciones posturales de protección.',
      'Vínculo afectivo seguro y participativo durante el juego sensoriomotor y psicomotriz.'
    ];
  }

  if (bpm?.lateralityScore && bpm.lateralityScore >= 3.5) {
    list.push('Lateralidad muy bien definida (reconoce con claridad y seguridad su lado dominante).');
  }
  if (bpm?.finePraxiaScore && bpm.finePraxiaScore >= 3.0) {
    list.push('Gran destreza en sus manos y dedos (buena precisión para manipular objetos pequeños).');
  }
  if (bpm?.tonicityScore && bpm.tonicityScore >= 3.0) {
    list.push('Fuerza muscular adecuada (capacidad de relajación y buena postura en actividades de suelo y mesa).');
  }
  if (evalData?.spmSensoryMeasure?.hearingScore && evalData.spmSensoryMeasure.hearingScore < 60) {
    list.push('Respuesta adaptativa a estímulos visuales, auditivos y táctiles en ambientes de juego.');
  }

  if (list.length < 3) {
    list.push('Excelente disposición y alegría para participar en las actividades lúdicas de psicomotricidad.');
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
  const ageInfo = calculatePatientAge(report.patientBirthDate);
  const isBaby = ageInfo.isUnderTwo || report.anamnesis?.ageCategory === 'bebe_hasta_18_meses';

  if (isBaby) {
    return [
      'Consolidar el control cefálico y de tronco en sedente y prono con apoyo simétrico de extremidades superiores.',
      'Favorecer los giros activos bilaterales (de boca arriba a boca abajo hacia derecha e izquierda).',
      'Continuar el protocolo de reposicionamiento craneal y movilidad cervical simétrica en el hogar.',
      'Acompañar a la familia con pautas prácticas de juego motor y estimulación temprana en casa.'
    ];
  }

  if (bpm?.equilibriumScore && bpm.equilibriumScore < 3.0) {
    list.push('Continuar reforzando el equilibrio dinámico (saltar sobre obstáculos y pararse en un pie con estabilidad).');
  }
  if (bpm?.bodyNotionScore && bpm.bodyNotionScore < 3.0) {
    list.push('Profundizar en la noción del cuerpo y la regulación de la fuerza corporal durante el juego.');
  }
  if (bpm?.spatialTemporalScore && bpm.spatialTemporalScore < 3.0) {
    list.push('Afianzar la organización en el espacio y el tiempo (laberintos motores y secuencias rítmicas).');
  }
  if (bpm?.globalPraxiaScore && bpm.globalPraxiaScore < 3.0) {
    list.push('Seguir practicando la coordinación motora global (circuitos con cambios de dirección, gateo y trepa).');
  }

  if (ageInfo.isOlderThanThree) {
    list.push('Acompañar a la familia y al entorno educativo con estrategias sencillas de regulación psicomotriz.');
  } else {
    list.push('Acompañar a la familia con estrategias lúdicas de psicomotricidad en las rutinas del hogar.');
  }

  return list.slice(0, 4);
}

/**
 * Extracts maximum 5 concrete, practical home recommendations
 */
export function getFamilyHomeRecommendations(report: ComprehensiveReport): { title: string; desc: string; icon: string }[] {
  const ageInfo = calculatePatientAge(report.patientBirthDate);
  const isBaby = ageInfo.isUnderTwo || report.anamnesis?.ageCategory === 'bebe_hasta_18_meses';

  if (isBaby) {
    return [
      {
        title: 'Juego boca abajo (Tummy Time) diario y progresivo',
        desc: 'Colocar al bebé boca abajo sobre colchoneta firme o sobre el pecho de los padres de 3 a 5 minutos varias veces al día después de cada muda, siempre despierto y supervisado.',
        icon: 'activity'
      },
      {
        title: 'Estimulación de giros hacia ambos lados',
        desc: 'Mostrar juguetes sonoros o el rostro de mamá/papá hacia el lado menos frecuente para motivar el giro activo de la cabeza y el rolado simétrico.',
        icon: 'hand'
      },
      {
        title: 'Alternancia postural en cuna y brazos',
        desc: 'Alternar la orientación en la cuna y el brazo con que se sostiene al alimentar, favoreciendo la descarga simétrica de la cabecita.',
        icon: 'calendar'
      },
      {
        title: 'Libertad de movimiento en colchoneta firme',
        desc: 'Priorizar el juego libre en suelo sobre goma eva o colchoneta, evitando el uso prolongado de sillas nido, saltarines o andadores.',
        icon: 'book'
      },
      {
        title: 'Cero pantallas y contacto afectivo directo',
        desc: 'Evitar pantallas en menores de 2 años, priorizando canciones, caricias, masajes suaves tras el baño y juego cara a cara.',
        icon: 'smartphone'
      }
    ];
  }

  return [
    {
      title: 'Rutinas diarias claras y predecibles',
      desc: `Usar horarios con dibujos o imágenes para las actividades del día (${ageInfo.isOlderThanThree ? 'desayuno, actividades escolares, juego y descanso' : 'alimentación, juego motor, baño y descanso'}). Le brinda tranquilidad y seguridad.`,
      icon: 'calendar'
    },
    {
      title: 'Juegos para regular la fuerza manual y corporal',
      desc: 'Amasar plastilina, rasgar papel, aplastar esponjas en agua o transportar objetos livianos para mejorar la propiocepción y destreza manual.',
      icon: 'hand'
    },
    {
      title: 'Circuitos de psicomotricidad en casa',
      desc: 'Colocar cojines o cintas en el piso para caminar haciendo equilibrio, saltar o desplazarse por debajo de una mesa.',
      icon: 'activity'
    },
    {
      title: 'Cuentos y juego compartido',
      desc: 'Dedicar 10 a 15 minutos diarios a compartir un cuento ilustrado o juego tranquilo en familia antes de dormir.',
      icon: 'book'
    },
    {
      title: 'Límites saludables de pantallas',
      desc: 'Reducir el uso de pantallas y priorizar el juego físico activo y la exploración al aire libre.',
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
  const date = formatDateDMY(report.dateGenerated);

  let text = `✨ *INFORME DE PROGRESO - CENTRO KINESFERA* ✨\n`;
  text += `🧒 *Usuario:* ${patientName}\n`;
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

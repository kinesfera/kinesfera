import { ComprehensiveReport } from '../types';
import { calculatePatientAge, formatDateDMY } from './ageHelper';
import { getCompanyBranding } from './brandingConfig';
import { getKinesferaLogoSvgString } from '../components/KinesferaLogo';
import { 
  getFamilyThreeLineSummary,
  getFamilyAchievements,
  getFamilyNextSteps,
  getFamilyHomeRecommendations 
} from './familyReportHelper';

function explainHineScoreText(val: number | undefined, opt: string, mid: string, low: string): string {
  const s = val ?? 3;
  if (s === 3) return `<strong>${s}/3</strong> (Óptimo: ${opt})`;
  if (s === 2) return `<strong>${s}/3</strong> (En maduración: ${mid})`;
  if (s === 1) return `<strong>${s}/3</strong> (Leve asimetría/inmadurez: ${low})`;
  return `<strong>${s}/3</strong> (Hallazgo a trabajar: ${low})`;
}

/**
 * Generates and downloads a clean, formatted Microsoft Word (.doc) document
 * containing the full user anamnesis, cranial protocols, HINE with explanations,
 * clinical evaluations (Kinesfera, SPM-2, Da Fonseca), and treatment plan.
 */
export function downloadReportAsWord(report: ComprehensiveReport) {
  const { anamnesis, evaluations } = report;
  const cranial = anamnesis?.cranialMeasurements;
  const earlyObs = anamnesis?.earlyInfantObservation;
  const psychomotor = evaluations?.psychomotorObservation;
  const criticalComm = evaluations?.criticalCommunication;
  const hine = evaluations?.hineExam;
  const spm = evaluations?.spmSensoryMeasure;
  const bpm = evaluations?.daFonsecaBpm;
  const ageInfo = calculatePatientAge(report.patientBirthDate);
  const isBaby = ageInfo.isUnderTwo || anamnesis?.ageCategory === 'bebe_hasta_18_meses';
  const branding = getCompanyBranding();

  const formattedEmissionDate = formatDateDMY(report.dateGenerated);
  const formattedBirthDate = formatDateDMY(report.patientBirthDate);

  const summary = getFamilyThreeLineSummary(report);
  const achievements = getFamilyAchievements(report);
  const nextSteps = getFamilyNextSteps(report);
  const homeTips = getFamilyHomeRecommendations(report);

  let logoMarkup = '';
  if (branding.showLogo) {
    if (branding.logoType === 'custom' && branding.customLogoUrl) {
      logoMarkup = `<div style="text-align: right; margin-bottom: 8pt;"><img src="${branding.customLogoUrl}" style="height: 60px; max-width: 180px; object-fit: contain;" /></div>`;
    } else {
      logoMarkup = getKinesferaLogoSvgString(160, 70);
    }
  }

  // Clean diagnosis text for infants so school context never appears
  let cleanFunctionalDiagnosis = evaluations?.functionalDiagnosisCIF || report.clinicalSummary || '';
  if (isBaby) {
    cleanFunctionalDiagnosis = cleanFunctionalDiagnosis
      .replace(/y escolares/gi, 'y familiares')
      .replace(/y aula educacional/gi, 'y su entorno familiar')
      .replace(/en el hogar y aula/gi, 'en el hogar');
  }

  let rawHtmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Informe Clínico - ${report.patientName}</title>
      <style>
        @page {
          size: letter;
          margin: 2cm 2cm 2cm 2cm;
          mso-header-margin: 1cm;
          mso-footer-margin: 1cm;
        }
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 10pt;
          line-height: 1.35;
          color: #1e293b;
        }
        h1 {
          font-size: 15pt;
          color: #0f172a;
          text-align: center;
          text-transform: uppercase;
          margin-bottom: 2pt;
          font-weight: bold;
        }
        h2 {
          font-size: 11pt;
          color: #0284c7;
          border-bottom: 1.5pt solid #0284c7;
          padding-bottom: 2pt;
          margin-top: 12pt;
          margin-bottom: 5pt;
          text-transform: uppercase;
        }
        h3 {
          font-size: 10pt;
          color: #0369a1;
          margin-top: 6pt;
          margin-bottom: 2pt;
        }
        p {
          margin-top: 2pt;
          margin-bottom: 4pt;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 4pt;
          margin-bottom: 7pt;
        }
        th, td {
          border: 1pt solid #cbd5e1;
          padding: 4pt 6pt;
          font-size: 9.5pt;
          vertical-align: top;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          color: #334155;
          text-align: left;
        }
        .header-meta {
          text-align: center;
          font-size: 9.5pt;
          color: #64748b;
          margin-bottom: 12pt;
        }
        .highlight-box {
          background-color: #f8fafc;
          border: 1pt solid #cbd5e1;
          padding: 5pt 7pt;
          margin-bottom: 6pt;
        }
        .signature-box {
          margin-top: 30pt;
          text-align: center;
          width: 250pt;
          margin-left: auto;
          margin-right: auto;
          border-top: 1pt solid #0f172a;
          padding-top: 6pt;
          font-size: 9.5pt;
        }
      </style>
    </head>
    <body>

      ${logoMarkup}

      <div class="header-meta">
        <strong>${branding.companyName || report.institution}</strong><br>
        ${branding.tagline ? `${branding.tagline.toUpperCase()}<br>` : ''}
        ${branding.subtext || 'DEPARTAMENTO DE KINESIOLOGÍA PEDIÁTRICA & PSICOMOTRICIDAD'}
      </div>

      <h1>INFORME DE EVALUACIÓN KINESIOLÓGICA</h1>
      <p style="text-align: center; font-size: 9.5pt; color: #475569;">
        Fecha de Emisión: <strong>${formattedEmissionDate}</strong> | Ficha Clínica N°: <strong>${report.medicalRecordNumber}</strong>
      </p>

      <!-- RESUMEN EN 3 LÍNEAS PARA LA FAMILIA -->
      <div style="background-color: #f0fdf4; border: 1.5pt solid #86efac; padding: 10pt; margin-top: 10pt; margin-bottom: 12pt; border-radius: 6pt;">
        <h2 style="color: #166534; border: none; margin-top: 0; padding-bottom: 2pt;">A) RESUMEN DEL PROCESO PARA LA FAMILIA</h2>
        <p><strong>🌱 1. ¿Cómo llegó?:</strong> ${summary.arrival}</p>
        <p><strong>🎯 2. ¿Qué se trabajó?:</strong> ${summary.workDone}</p>
        <p><strong>⭐ 3. ¿Cómo está hoy?:</strong> ${summary.currentState}</p>
      </div>

      <!-- LOGROS -->
      <div style="background-color: #f0fdfa; border: 1.5pt solid #5eead4; padding: 10pt; margin-bottom: 12pt; border-radius: 6pt;">
        <h2 style="color: #115e59; border: none; margin-top: 0; padding-bottom: 2pt;">B) LOGROS Y FORTALEZAS OBSERVADAS</h2>
        <ul style="margin-top: 4pt; margin-bottom: 4pt; padding-left: 18pt;">
          ${achievements.map(a => `<li><strong>✔</strong> ${a}</li>`).join('')}
        </ul>
      </div>

      <!-- QUÉ SIGUE -->
      <div style="background-color: #eef2ff; border: 1.5pt solid #a5b4fc; padding: 10pt; margin-bottom: 12pt; border-radius: 6pt;">
        <h2 style="color: #3730a3; border: none; margin-top: 0; padding-bottom: 2pt;">C) ¿QUÉ SIGUE? (PRÓXIMOS PASOS EN TERAPIA)</h2>
        <ul style="margin-top: 4pt; margin-bottom: 4pt; padding-left: 18pt;">
          ${nextSteps.map(s => `<li>• ${s}</li>`).join('')}
        </ul>
      </div>

      <!-- RECOMENDACIONES HOGAR -->
      <div style="background-color: #fffbeb; border: 1.5pt solid #fde68a; padding: 10pt; margin-bottom: 12pt; border-radius: 6pt;">
        <h2 style="color: #92400e; border: none; margin-top: 0; padding-bottom: 2pt;">D) RECOMENDACIONES PARA EL HOGAR (MÁXIMO 5)</h2>
        <ol style="margin-top: 4pt; margin-bottom: 4pt; padding-left: 18pt;">
          ${homeTips.slice(0, 5).map(t => `<li><strong>${t.title}:</strong> ${t.desc}</li>`).join('')}
        </ol>
      </div>

      <h2>1. Identificación del Usuario y Antecedentes Generales</h2>
      <table>
        <tr>
          <th width="25%">Nombre del Usuario</th>
          <td width="25%"><strong>${report.patientName}</strong></td>
          <th width="25%">R.U.T.</th>
          <td width="25%"><strong>${report.patientRut}</strong></td>
        </tr>
        <tr>
          <th>Fecha de Nacimiento</th>
          <td>${formattedBirthDate} (${ageInfo.detailedChronologicalAge || ageInfo.ageText})</td>
          <th>${isBaby ? 'Modalidad de Cuidado' : 'Establecimiento / Nivel'}</th>
          <td>${isBaby ? (anamnesis?.schoolOrCenter || 'Cuidado familiar en el hogar') : `${anamnesis?.schoolOrCenter || 'No informado'} (${anamnesis?.educationalLevel || '-'})`}</td>
        </tr>
        <tr>
          <th>Personas en el Hogar</th>
          <td colspan="3">${anamnesis?.householdMembers || 'No informado'}</td>
        </tr>
        <tr>
          <th>Apoderado / Contacto</th>
          <td>${anamnesis?.caregiverName || 'No informado'}</td>
          <th>Teléfono Contacto</th>
          <td>${anamnesis?.caregiverPhone || '-'}</td>
        </tr>
        <tr>
          <th>Motivo de Consulta</th>
          <td colspan="3"><strong>${anamnesis?.consultationReason || '-'}</strong></td>
        </tr>
        <tr>
          <th>¿Cuándo lo notaron?</th>
          <td>${anamnesis?.problemNoticedWhen || '-'}</td>
          <th>Especialistas Previos</th>
          <td>${anamnesis?.specialistsVisited || '-'}</td>
        </tr>
        <tr>
          <th>Tratamientos Previos</th>
          <td>${anamnesis?.previousTreatments || '-'}</td>
          <th>Expectativas Familiares</th>
          <td>${anamnesis?.familyExpectations || '-'}</td>
        </tr>
      </table>

      <h2>2. Embarazo, Parto y Antecedentes Perinatales</h2>
      <table>
        <tr>
          <th width="30%">Historia del Embarazo</th>
          <td width="70%">${anamnesis?.pregnancyHistory || 'Embarazo controlado sin complicaciones reportadas'}</td>
        </tr>
        <tr>
          <th>Edad Gestacional y Parto</th>
          <td>EG: <strong>${anamnesis?.gestationalAgeWeeks || '-'}</strong> | Tipo de parto: ${anamnesis?.birthType || '-'} | Presentación: ${anamnesis?.birthPresentation || '-'}</td>
        </tr>
        <tr>
          <th>Somatometría Neonatal</th>
          <td>Peso al nacer: <strong>${anamnesis?.birthWeightGrams || '-'}</strong> | Talla: ${anamnesis?.birthLengthCm || '-'} | Perímetro Craneal: ${cranial?.headCircumferenceCm ? cranial.headCircumferenceCm + ' cm' : '-'}</td>
        </tr>
        <tr>
          <th>Score APGAR y Adaptación</th>
          <td>Score APGAR: <strong>${anamnesis?.apgarScore || '-'}</strong> | Complicaciones: ${anamnesis?.neonatalComplications || 'Ninguna'}</td>
        </tr>
        ${(isBaby || anamnesis?.hipXrayScreening) ? `
        <tr>
          <th>Radiografía / Ecografía de Caderas (Tamizaje Lactante)</th>
          <td><strong>${anamnesis?.hipXrayScreening || 'Tamizaje de pelvis / caderas en control pediátrico'}</strong></td>
        </tr>
        ` : ''}
        <tr>
          <th>Alimentación y Sueño</th>
          <td>Lactancia: ${anamnesis?.feedingType || '-'} | Cólicos: ${anamnesis?.colic || '-'} | Patrón de sueño: ${anamnesis?.sleepPattern || '-'}</td>
        </tr>
      </table>

      <h2>3. Hitos del Desarrollo Psicomotor y del Lenguaje</h2>
      <table>
        <tr>
          <th width="30%">Control Cefálico</th>
          <td width="70%">${anamnesis?.headControlMonths || '-'}</td>
        </tr>
        <tr>
          <th>Sedente Autónomo</th>
          <td>${anamnesis?.independentSittingMonths || '-'}</td>
        </tr>
        <tr>
          <th>Gateo y Cuadrupedia</th>
          <td>${anamnesis?.crawlingMonths || '-'}</td>
        </tr>
        <tr>
          <th>Bipedestación</th>
          <td>${anamnesis?.standingMonths || '-'}</td>
        </tr>
        <tr>
          <th>Marcha Independiente</th>
          <td>${anamnesis?.walkingMonths || '-'}</td>
        </tr>
        <tr>
          <th>Desarrollo del Lenguaje</th>
          <td>Primeras palabras: ${anamnesis?.firstWords || '-'} | Primeras frases: ${anamnesis?.firstPhrases || '-'} | Dificultades: ${anamnesis?.languageDifficulties || 'Sin dificultades'}</td>
        </tr>
        <tr>
          <th>Estado Motor Actual</th>
          <td><strong>${anamnesis?.currentMotorStatus || '-'}</strong></td>
        </tr>
      </table>

      ${cranial && (cranial.d1Mm !== undefined || cranial.apMm !== undefined) ? `
      <h2>4. Protocolo Clínico de Asimetrías Craneales (Craneometría)</h2>
      <table>
        <tr>
          <th width="35%">Protocolo de Plagiocefalia</th>
          <td width="65%">
            • Diagonal 1 (D1): <strong>${cranial.d1Mm || '-'} mm</strong><br>
            • Diagonal 2 (D2): <strong>${cranial.d2Mm || '-'} mm</strong><br>
            • Diferencia Craneal (|D1 - D2|): <strong>${cranial.differenceMm || '-'} mm</strong><br>
            • Índice de Asimetría (CVAI): <strong>${cranial.cvaiPercent ? cranial.cvaiPercent + '%' : '-'}</strong><br>
            • Clasificación de Plagiocefalia: <strong style="color: #0284c7;">${cranial.plagiocephalySeverity || '-'}</strong>
          </td>
        </tr>
        <tr>
          <th>Protocolo de Braquicefalia / Dolicocefalia</th>
          <td>
            • Diámetro Anteroposterior (AP): <strong>${cranial.apMm || '-'} mm</strong><br>
            • Diámetro Biparietal (BP): <strong>${cranial.bpMm || '-'} mm</strong><br>
            • Índice Cefalométrico [(BP/AP)*100]: <strong>${cranial.cephalicIndex ? cranial.cephalicIndex + '%' : '-'}</strong><br>
            • Clasificación: <strong style="color: #0284c7;">${cranial.brachycephalyClassification || '-'}</strong>
          </td>
        </tr>
        <tr>
          <th>Indicación Kinésica Craneal</th>
          <td>${cranial.treatmentIndication || 'Pauta de reposicionamiento y seguimiento.'}</td>
        </tr>
      </table>
      ` : ''}

      ${earlyObs ? `
      <h2>Observación del Primer Momento (Bebés 0-12 Meses)</h2>
      <table>
        <tr>
          <th width="35%">Relación con el Adulto</th>
          <td width="65%">${earlyObs.adultInteractionProps || '-'}</td>
        </tr>
        <tr>
          <th>Iniciativa del Niño</th>
          <td>${earlyObs.childInitiative || '-'}</td>
        </tr>
        <tr>
          <th>Ajuste de Ritmos</th>
          <td>${earlyObs.rhythmAdjustment || '-'}</td>
        </tr>
        <tr>
          <th>Respuesta Emocional y Corporal</th>
          <td>${earlyObs.childResponse || '-'}</td>
        </tr>
        <tr>
          <th>Relación con el Objeto</th>
          <td>${earlyObs.objectRelation || '-'}</td>
        </tr>
        <tr>
          <th>Tono y Diálogo Tónico</th>
          <td>${earlyObs.posturalAndTonicDevelopment || '-'}</td>
        </tr>
      </table>
      ` : ''}

      ${!isBaby && anamnesis?.followsInstructions && anamnesis?.followsInstructions !== 'No corresponde' ? `
      <h2>5. Conductas Emocionales, Conductuales y Familiares</h2>
      <table>
        <tr>
          <th width="35%">¿Sigue instrucciones?</th>
          <td width="65%">${anamnesis.followsInstructions} | ¿Se muestra inquieto?: ${anamnesis.isRestless || '-'}</td>
        </tr>
        <tr>
          <th>Juego y Autonomía</th>
          <td>${anamnesis.playsAloneOrAccompanied || '-'}</td>
        </tr>
        <tr>
          <th>Rutina al Acostarse</th>
          <td>${anamnesis.bedtimeRoutine || '-'} | Pesadillas: ${anamnesis.nightmares || '-'}</td>
        </tr>
        <tr>
          <th>Miedos y Comportamiento con Extraños</th>
          <td>Miedos: ${anamnesis.hasFears || '-'} | Extraños: ${anamnesis.strangerReaction || '-'}</td>
        </tr>
        <tr>
          <th>Regulación Emocional y Rabietas</th>
          <td>Rabietas/Enfados: ${anamnesis.tantrums || '-'} | ¿Se le ve triste?: ${anamnesis.appearsSad || '-'}</td>
        </tr>
        <tr>
          <th>Relaciones Interpersonales</th>
          <td>Familia: ${anamnesis.familyRelationships || '-'} ${ageInfo.isOlderThanThree ? `| Jardín/Escuela: ${anamnesis.schoolRelationships || '-'}` : ''}</td>
        </tr>
        <tr>
          <th>Antecedentes Familiares (TEA / TDAH / Otros)</th>
          <td><strong>${anamnesis.familyDiagnoses || 'Sin antecedentes reportados'}</strong></td>
        </tr>
        <tr>
          <th>Farmacología y Suplementos Actuales</th>
          <td><strong>${anamnesis.pharmacology || 'Sin fármacos'}</strong></td>
        </tr>
      </table>
      ` : ''}

      <h2>6. Evaluaciones Clínicas y Parámetros Psicomotores Aplicados</h2>
      
      ${hine ? `
      <h3>Examen Neurológico Infantil de Hammersmith (HINE - Oficial 78 Pts con Significado Clínico):</h3>
      <table>
        <tr>
          <th width="35%">Puntaje Global y Significado Clínico</th>
          <td width="65%">
            <strong>${hine.totalScore ?? 0} / 78 puntos</strong> | Clasificación: <strong>${hine.riskLevel || 'Evaluado'}</strong><br>
            <em>Significado: ${(hine.totalScore ?? 72) >= 65
              ? 'Puntaje dentro del rango óptimo de neurodesarrollo motor y postural para su edad.'
              : (hine.totalScore ?? 72) >= 56
              ? 'Rango de seguimiento kinésico por inmadurez postural o asimetrías transitorias que responden a estimulación temprana.'
              : 'Puntaje bajo el corte esperado; requiere intervención kinésica enfocada en control postural y tono muscular.'}</em>
          </td>
        </tr>
        <tr>
          <th>1. Función de Pares Craneales (${hine.cranialNervesSubtotal ?? 15}/15 pts)</th>
          <td>
            • Apariencia facial: ${explainHineScoreText(hine.facialAnimation, 'sonríe y reacciona simétricamente', 'reactividad presente', 'gestualidad disminuida')}<br>
            • Movimientos oculares: ${explainHineScoreText(hine.eyeMovements, 'conjugados sin desviación', 'seguimiento intermitente', 'rango ocular limitado a un lado')}<br>
            • Seguimiento visual: ${explainHineScoreText(hine.visualFollow, 'arco completo de 180° bilateral', 'rango parcial', 'preferencia hacia un lado con giro incompleto')}<br>
            • Respuesta auditiva: ${explainHineScoreText(hine.auditoryResponse, 'localiza sonido en ambos oídos', 'latencia leve', 'orientación asimétrica')}<br>
            • Succión y deglución: ${explainHineScoreText(hine.suckSwallow, 'buen acople y deglución segura', 'succión funcional', 'fatiga al succionar')}
          </td>
        </tr>
        <tr>
          <th>2. Postura Corporal (${hine.postureSubtotal ?? 18}/18 pts)</th>
          <td>
            • Cabeza en sentado: ${explainHineScoreText(hine.headPosture, 'erguida en línea media', 'ligera desviación corregible', 'inclinación/rotación preferente')}<br>
            • Tronco en sentado: ${explainHineScoreText(hine.trunkPosture, 'alineado acorde a su edad', 'leve cifosis en maduración', 'redondeado, requiere soporte')}<br>
            • Brazos en reposo: ${explainHineScoreText(hine.armPosture, 'neutros y simétricos', 'ligera flexión', 'asimetría postural')}<br>
            • Manos: ${explainHineScoreText(hine.handsPosture, 'abiertas para explorar', 'apertura intermitente', 'empuñadas o pulgar aducido')}<br>
            • Piernas y Pies: ${explainHineScoreText(hine.legPosture, 'alineación simétrica y tobillos neutros', 'semiflexión funcional', 'rotación o apoyo en punta')}
          </td>
        </tr>
        <tr>
          <th>3. Movimientos Espontáneos (${hine.movementsSubtotal ?? 6}/6 pts)</th>
          <td>
            • Cantidad: ${explainHineScoreText(hine.movementsQuantity, 'actividad motora activa y variada', 'moderada', 'reducida o inquieta')}<br>
            • Calidad: ${explainHineScoreText(hine.movementsQuality, 'movimientos libres, fluidos y alternantes', 'leve asimetría', 'movimientos rígidos o en bloque')}
          </td>
        </tr>
        <tr>
          <th>4. Tono Muscular Pasivo y Activo (${hine.toneSubtotal ?? 24}/24 pts)</th>
          <td>
            • Signo del chal y hombro pasivo: ${explainHineScoreText(hine.scarfSign, 'extensibilidad escapular simétrica', 'rango funcional', 'hipotonía o resistencia asimétrica')}<br>
            • Pronación/supinación: ${explainHineScoreText(hine.pronationSupination, 'giro libre sin rigidez', 'funcional', 'resistencia al giro')}<br>
            • Aductores de cadera y ángulo poplíteo: ${explainHineScoreText(hine.adductorsAngle, 'apertura simétrica (80°-150°)', 'rango funcional', 'laxitud o acortamiento leve')}<br>
            • Dorsiflexión de tobillo: ${explainHineScoreText(hine.ankleDorsiflexionAngle, 'rango libre (30°-85°)', 'conservada', 'resistencia plantar')}<br>
            • Tracción al sedente (Pull-to-sit): ${explainHineScoreText(hine.pullToSit, 'cabeza alineada activa con el tronco', 'leve rezago inicial', 'rezago cefálico, requiere fortalecer flexores cervicales')}<br>
            • Suspensión ventral: ${explainHineScoreText(hine.ventralSuspension, 'cabeza y tronco horizontales contra gravedad', 'extensión parcial', 'menor sostén antigravitatorio')}
          </td>
        </tr>
        <tr>
          <th>5. Reflejos y Reacciones (${hine.reflexesSubtotal ?? 15}/15 pts)</th>
          <td>
            • Protección de brazos: ${explainHineScoreText(hine.armProtectionReaction, 'extensión simétrica defensiva', 'en maduración', 'incompleta')}<br>
            • Suspensión vertical (pataleo): ${explainHineScoreText(hine.verticalSuspension, 'pataleo alternante y simétrico', 'leve preferencia', 'asimetría')}<br>
            • Inclinación lateral (enderezamiento): ${explainHineScoreText(hine.lateralTilting, 'endereza cabeza y tronco', 'respuesta parcial', 'respuesta lenta hacia un lado')}<br>
            • Paracaídas anterior: ${explainHineScoreText(hine.forwardParachute, 'extensión protectora simétrica', 'en aparición según edad', 'en etapa previa por edad')}<br>
            • Reflejos osteotendinosos: ${explainHineScoreText(hine.tendonReflexes, 'normorreflexia bilateral', 'presentes', 'exaltados o disminuidos')}
          </td>
        </tr>
        ${hine.motorMilestones ? `
        <tr>
          <th>Sección 2: Hitos Motores Observados</th>
          <td>
            • Control cabeza: ${hine.motorMilestones.headControl || '-'} | • Sedente: ${hine.motorMilestones.sitting || '-'}<br>
            • Agarre voluntario: ${hine.motorMilestones.voluntaryGrasp || '-'} | • Patada en supino: ${hine.motorMilestones.supineKicking || '-'}<br>
            • Giros: ${hine.motorMilestones.rolling || '-'} | • Gateo: ${hine.motorMilestones.crawling || '-'}<br>
            • De pie: ${hine.motorMilestones.standing || '-'} | • Caminando: ${hine.motorMilestones.walking || '-'}
          </td>
        </tr>
        ` : ''}
        ${hine.behavior ? `
        <tr>
          <th>Sección 3: Comportamiento y Alerta (1-6)</th>
          <td>
            Estado Consciente: <strong>${hine.behavior.consciousState ?? '-'}/6</strong> (Despierto y mantiene interés) | Estado Emocional: <strong>${hine.behavior.emotionalState ?? '-'}/6</strong> (Feliz y regulado) | Orientación Social: <strong>${hine.behavior.socialOrientation ?? '-'}/6</strong> (Receptivo y cooperador)
          </td>
        </tr>
        ` : ''}
        ${hine.clinicalObservations ? `
        <tr>
          <th>Observaciones Clínicas HINE</th>
          <td>${hine.clinicalObservations}</td>
        </tr>
        ` : ''}
      </table>
      ` : ''}

      ${!isBaby && psychomotor ? `
      <h3>Observación de Parámetros de Psicomotricidad de Pilar Arnaiz:</h3>
      <table>
        <tr>
          <th width="30%">Movimientos Frecuentes</th>
          <td width="70%">${psychomotor.movementsFrequent || '-'}</td>
        </tr>
        <tr>
          <th>Calidad de Movimientos</th>
          <td>${psychomotor.movementsQuality || '-'}</td>
        </tr>
        <tr>
          <th>Movilidad Corporal</th>
          <td>${psychomotor.bodyMobilityLevel || '-'}</td>
        </tr>
        <tr>
          <th>Posturas Frecuentes</th>
          <td>${psychomotor.posturesFrequent || '-'}</td>
        </tr>
        <tr>
          <th>Calidad del Tono</th>
          <td>${psychomotor.toneQuality || '-'}</td>
        </tr>
        <tr>
          <th>Uso de Objetos</th>
          <td>${psychomotor.objectUsage || '-'} | En relación a otros: ${psychomotor.objectsRelationWithOthers || '-'}</td>
        </tr>
        <tr>
          <th>Espacio y Relación con Adulto</th>
          <td>Ocupación del espacio: ${psychomotor.spaceOccupancy || '-'} | Relación con el adulto: ${psychomotor.adultRelation || '-'}</td>
        </tr>
        ${psychomotor.globalSynthesis ? `
        <tr>
          <th>Síntesis de Psicomotricidad Global</th>
          <td><strong>${psychomotor.globalSynthesis}</strong></td>
        </tr>
        ` : ''}
      </table>
      ` : ''}

      ${spm ? `
      <h3>Medida de Exploración y Respuesta a Estímulos en Psicomotricidad (SPM-2):</h3>
      <table>
        <tr>
          <th>Escala</th>
          <th>Puntaje</th>
          <th>Rango Interpretativo</th>
        </tr>
        <tr>
          <td>Participación Social (SOC)</td>
          <td>${spm.socialParticipationScore || '-'}</td>
          <td><strong>${spm.socialParticipationRange || 'Típico'}</strong></td>
        </tr>
        <tr>
          <td>Visión (VIS)</td>
          <td>${spm.visionScore || '-'}</td>
          <td><strong>${spm.visionRange || 'Típico'}</strong></td>
        </tr>
        <tr>
          <td>Audición (HEA)</td>
          <td>${spm.hearingScore || '-'}</td>
          <td><strong>${spm.hearingRange || 'Típico'}</strong></td>
        </tr>
        <tr>
          <td>Tacto (TOU)</td>
          <td>${spm.touchScore || '-'}</td>
          <td><strong>${spm.touchRange || 'Típico'}</strong></td>
        </tr>
        <tr>
          <td>Gusto y Olfato (T&S)</td>
          <td>${spm.tasteSmellScore || '-'}</td>
          <td><strong>${spm.tasteSmellRange || 'Típico'}</strong></td>
        </tr>
        <tr>
          <td>Conciencia Corporal / Propiocepción (BOD)</td>
          <td>${spm.bodyAwarenessScore || '-'}</td>
          <td><strong>${spm.bodyAwarenessRange || 'Típico'}</strong></td>
        </tr>
        <tr>
          <td>Equilibrio y Movimiento / Vestibular (BAL)</td>
          <td>${spm.balanceMotionScore || '-'}</td>
          <td><strong>${spm.balanceMotionRange || 'Típico'}</strong></td>
        </tr>
        <tr>
          <td>Planificación e Ideas / Praxis (PLN)</td>
          <td>${spm.planningIdeasScore || '-'}</td>
          <td><strong>${spm.planningIdeasRange || 'Típico'}</strong></td>
        </tr>
        <tr style="background-color: #f1f5f9;">
          <td><strong>TOTAL ESTÍMULOS (ST)</strong></td>
          <td><strong>${spm.totalSensoryScore || '-'}</strong></td>
          <td><strong style="color: #0284c7;">${spm.totalSensoryRange || 'Típico'}</strong></td>
        </tr>
      </table>
      ` : ''}

      ${!isBaby && bpm ? `
      <h3>Batería Psicomotora (BPM) de Vítor da Fonseca:</h3>
      <table>
        <tr>
          <th width="35%">Factores Psicomotores</th>
          <td width="65%">
            • Tonicidad: ${bpm.tonicityScore}/4 | • Equilibrio: ${bpm.equilibriumScore}/4<br>
            • Lateralidad: ${bpm.lateralityScore}/4 | • Noción del Cuerpo: ${bpm.bodyNotionScore}/4<br>
            • Estructuración Espacio-Temporal: ${bpm.spatialTemporalScore}/4<br>
            • Praxia Global: ${bpm.globalPraxiaScore}/4 | • Praxia Fina: ${bpm.finePraxiaScore}/4
          </td>
        </tr>
        <tr>
          <th>Puntaje Total y Perfil</th>
          <td>Puntaje: <strong>${bpm.totalScore}/28</strong> | Resultado: <strong style="color: #0284c7;">${bpm.profileResult}</strong></td>
        </tr>
        <tr>
          <th>Conclusiones BPM</th>
          <td>${bpm.conclusions || '-'}</td>
        </tr>
      </table>
      ` : ''}

      ${!isBaby && criticalComm && (criticalComm.reinforcersAppropriate || criticalComm.askHelpAppropriate || criticalComm.generalObservations) ? `
      <h3>Complemento Funcional: Habilidades de Comunicación en Sesión:</h3>
      <table>
        <tr>
          <th width="35%">Pedir Reforzadores y Apoyos</th>
          <td width="65%">
            • Pedir reforzadores: <strong>${criticalComm.reinforcersAppropriate || '-'}</strong> | • Pedir ayuda: <strong>${criticalComm.askHelpAppropriate || '-'}</strong><br>
            • Pedir descansos: <strong>${criticalComm.askBreaksAppropriate || '-'}</strong> | • Transición actividades: <strong>${criticalComm.transitionActivitiesAppropriate || '-'}</strong>
          </td>
        </tr>
        ${criticalComm.generalObservations ? `
        <tr>
          <th>Observaciones</th>
          <td>${criticalComm.generalObservations}</td>
        </tr>
        ` : ''}
      </table>
      ` : ''}

      <h2>7. Síntesis Diagnóstica Kinésica (C.I.F.) y Objetivos Terapéuticos</h2>
      <div class="highlight-box">
        <p><strong>Diagnóstico Funcional (Clasificación Internacional del Funcionamiento):</strong></p>
        <p>${cleanFunctionalDiagnosis}</p>
      </div>

      <p><strong>Objetivos Terapéuticos a Corto Plazo:</strong><br>${evaluations?.therapeuticGoalsShortTerm || '-'}</p>
      <p><strong>Objetivos Terapéuticos a Largo Plazo:</strong><br>${evaluations?.therapeuticGoalsLongTerm || '-'}</p>

      <h2>8. Plan de Tratamiento e Indicaciones ${ageInfo.isOlderThanThree ? 'al Hogar / Escuela' : 'al Hogar y Familia'}</h2>
      <p><strong>Plan de Intervención en Psicomotricidad y Kinesiología:</strong> ${evaluations?.treatmentPlan || report.planAndFollowUp}</p>
      
      <p><strong>Recomendaciones Específicas para el Hogar:</strong><br>${evaluations?.homeRecommendations || evaluations?.homeAndSchoolRecommendations || 'Pauta de estimulación en el hogar.'}</p>

      ${ageInfo.isOlderThanThree ? `
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 8px; margin: 12px 0;">
        <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 6px;">Recomendaciones para Jardín Infantil / Escuela / Aula PIE (Usuario Mayor a 3 Años):</h4>
        <p style="color: #1e3a8a; margin-bottom: 0;">${evaluations?.schoolRecommendations || 'Pautas de adecuación postural y pausas activas de psicomotricidad para el aula.'}</p>
      </div>
      ` : ''}

      <div class="signature-box">
        <strong>${report.professionalName || 'Aldo Olivares Araya'}</strong><br>
        Registro SIS: 515956<br>
        Kinesiólogo, Especialista en Psicomotricidad<br>
        ${report.institution || 'Centro Clínico Kinesfera · Creando Sentido Al Juego'}
      </div>

    </body>
    </html>
  `;

  // Final sanitization pass on downloaded report:
  // 1. Replace "integración sensorial" / "integración sensorio-motriz" with "psicomotricidad"
  // 2. Replace "Paciente" / "paciente" with "Usuario" / "usuario"
  const htmlContent = rawHtmlContent
    .replace(/óptima integración sensorio-?motriz/gi, 'óptimo desarrollo en psicomotricidad')
    .replace(/integración sensorio-?motriz/gi, 'psicomotricidad')
    .replace(/integración sensorial/gi, 'psicomotricidad')
    .replace(/\bPacientes\b/g, 'Usuarios')
    .replace(/\bpacientes\b/g, 'usuarios')
    .replace(/\bPaciente\b/g, 'Usuario')
    .replace(/\bpaciente\b/g, 'usuario');

  const blob = new Blob(['\uFEFF' + htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = report.patientName.replace(/\s+/g, '_');
  link.download = `Informe_Clinico_${safeName}_${formattedEmissionDate}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

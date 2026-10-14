import { ComprehensiveReport } from '../types';
import { calculatePatientAge } from './ageHelper';
import { getCompanyBranding } from './brandingConfig';
import { getKinesferaLogoSvgString } from '../components/KinesferaLogo';

/**
 * Generates and downloads a clean, formatted Microsoft Word (.doc) document
 * containing the full patient anamnesis, cranial protocols, behavioral patterns,
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
  const branding = getCompanyBranding();

  let logoMarkup = '';
  if (branding.showLogo) {
    if (branding.logoType === 'custom' && branding.customLogoUrl) {
      logoMarkup = `<div style="text-align: right; margin-bottom: 8pt;"><img src="${branding.customLogoUrl}" style="height: 60px; max-width: 180px; object-fit: contain;" /></div>`;
    } else {
      logoMarkup = getKinesferaLogoSvgString(160, 70);
    }
  }

  const htmlContent = `
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
        ${branding.subtext || 'DEPARTAMENTO DE NEUROREHABILITACIÓN PEDIÁTRICA & KINESIOLOGÍA'}
      </div>

      <h1>INFORME CLÍNICO DE EVALUACIÓN NEUROPSICOMOTRIZ</h1>
      <p style="text-align: center; font-size: 9.5pt; color: #475569;">
        Fecha de Emisión: <strong>${report.dateGenerated}</strong> | Ficha Clínica N°: <strong>${report.medicalRecordNumber}</strong>
      </p>

      <h2>1. Identificación del Paciente y Antecedentes Generales</h2>
      <table>
        <tr>
          <th width="25%">Nombre Paciente</th>
          <td width="25%"><strong>${report.patientName}</strong></td>
          <th width="25%">R.U.T.</th>
          <td width="25%"><strong>${report.patientRut}</strong></td>
        </tr>
        <tr>
          <th>Fecha de Nacimiento</th>
          <td>${report.patientBirthDate}</td>
          <th>Colegio / Curso</th>
          <td>${anamnesis?.schoolOrCenter || 'No informado'} (${anamnesis?.educationalLevel || '-'})</td>
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

      ${cranial ? `
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

      ${anamnesis?.followsInstructions && anamnesis?.followsInstructions !== 'No corresponde' ? `
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
          <td>Familia: ${anamnesis.familyRelationships || '-'} | Colegio: ${anamnesis.schoolRelationships || '-'}</td>
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
      <h3>Examen Neurológico Infantil de Hammersmith (HINE - Oficial 78 Pts):</h3>
      <table>
        <tr>
          <th width="35%">Puntaje Global y Clasificación</th>
          <td width="65%"><strong>${hine.totalScore ?? 0} / 78 puntos</strong> | Nivel de Riesgo: <strong>${hine.riskLevel || 'Evaluado'}</strong></td>
        </tr>
        <tr>
          <th>Subtotales por Dominio</th>
          <td>
            • Pares Craneales: <strong>${hine.cranialNervesSubtotal ?? '-'}/15</strong> | • Postura: <strong>${hine.postureSubtotal ?? '-'}/18</strong><br>
            • Movimientos: <strong>${hine.movementsSubtotal ?? '-'}/6</strong> | • Tono Muscular: <strong>${hine.toneSubtotal ?? '-'}/24</strong><br>
            • Reflejos y Reacciones: <strong>${hine.reflexesSubtotal ?? '-'}/15</strong>
          </td>
        </tr>
        <tr>
          <th>1. Pares Craneales (0-3)</th>
          <td>
            Apariencia facial: ${hine.facialAnimation ?? '-'}/3 | Mov. oculares: ${hine.eyeMovements ?? '-'}/3<br>
            Seguimiento visual: ${hine.visualFollow ?? '-'}/3 | Respuesta auditiva: ${hine.auditoryResponse ?? '-'}/3<br>
            Succión / deglución: ${hine.suckSwallow ?? '-'}/3
          </td>
        </tr>
        <tr>
          <th>2. Postura (0-3)</th>
          <td>
            Cabeza en sentado: ${hine.headPosture ?? '-'}/3 | Tronco en sentado: ${hine.trunkPosture ?? '-'}/3<br>
            Brazos en reposo: ${hine.armPosture ?? '-'}/3 | Manos: ${hine.handsPosture ?? '-'}/3<br>
            Piernas en sentado: ${hine.legPosture ?? '-'}/3 | Piernas en supino/pie: ${hine.legsSupineProne ?? '-'}/3<br>
            Pies en supino y bipedestación: ${hine.feetPosture ?? '-'}/3
          </td>
        </tr>
        <tr>
          <th>3. Movimientos Espontáneos (0-3)</th>
          <td>
            Cantidad en supino: ${hine.movementsQuantity ?? '-'}/3 | Calidad espontánea: ${hine.movementsQuality ?? '-'}/3
          </td>
        </tr>
        <tr>
          <th>4. Tono Muscular (0-3)</th>
          <td>
            Signo del chal: ${hine.scarfSign ?? '-'}/3 | Mov. hombro pasivo (elevación): ${hine.passiveShoulderElevation ?? '-'}/3<br>
            Pronación/supinación antebrazo: ${hine.pronationSupination ?? '-'}/3 | Aductores de cadera: ${hine.adductorsAngle ?? '-'}/3<br>
            Ángulo poplíteo: ${hine.poplitealAngle ?? '-'}/3 | Dorsiflexión de tobillo: ${hine.ankleDorsiflexionAngle ?? '-'}/3<br>
            Tracción al sedente: ${hine.pullToSit ?? '-'}/3 | Suspensión ventral: ${hine.ventralSuspension ?? '-'}/3
          </td>
        </tr>
        <tr>
          <th>5. Reflejos y Reacciones (0-3)</th>
          <td>
            Protección de brazos: ${hine.armProtectionReaction ?? '-'}/3 | Suspensión vertical (pataleo): ${hine.verticalSuspension ?? '-'}/3<br>
            Inclinación lateral: ${hine.lateralTilting ?? '-'}/3 | Paracaídas hacia adelante: ${hine.forwardParachute ?? '-'}/3<br>
            Reflejos osteotendinosos: ${hine.tendonReflexes ?? '-'}/3
          </td>
        </tr>
        ${hine.motorMilestones ? `
        <tr>
          <th>Sección 2: Hitos Motores</th>
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
          <th>Sección 3: Comportamiento (1-6)</th>
          <td>
            Estado Consciente: <strong>${hine.behavior.consciousState ?? '-'}/6</strong> | Estado Emocional: <strong>${hine.behavior.emotionalState ?? '-'}/6</strong> | Orientación Social: <strong>${hine.behavior.socialOrientation ?? '-'}/6</strong>
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

      ${psychomotor ? `
      <h3>Observación de Parámetros Psicomotores de Pilar Arnaiz:</h3>
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
          <th>Síntesis Psicomotriz Global</th>
          <td><strong>${psychomotor.globalSynthesis}</strong></td>
        </tr>
        ` : ''}
      </table>
      ` : ''}

      ${criticalComm ? `
      <h3>Lista de Control de Habilidades de Comunicación Críticas (Pyramid):</h3>
      <table>
        <tr>
          <th width="35%">1. Pedir Reforzadores</th>
          <td width="65%">
            ¿Apropiado?: <strong>${criticalComm.reinforcersAppropriate || '-'}</strong><br>
            • Comestibles: ${criticalComm.reinforcersFood || '-'} | • Juguetes: ${criticalComm.reinforcersToys || '-'} | • Actividades: ${criticalComm.reinforcersActivities || '-'}
          </td>
        </tr>
        <tr>
          <th>Habilidades de Comunicación (2 al 7)</th>
          <td>
            • Pedir ayuda: <strong>${criticalComm.askHelpAppropriate || '-'}</strong> (${criticalComm.askHelpExample || '-' })<br>
            • Pedir descansos: <strong>${criticalComm.askBreaksAppropriate || '-'}</strong> (${criticalComm.askBreaksExample || '-' })<br>
            • Rechazar (No): <strong>${criticalComm.rejectAppropriate || '-'}</strong> (${criticalComm.rejectExample || '-' })<br>
            • Aceptar (Sí): <strong>${criticalComm.affirmAcceptAppropriate || '-'}</strong> (${criticalComm.affirmAcceptExample || '-' })<br>
            • Responder a espera: <strong>${criticalComm.respondWaitAppropriate || '-'}</strong> (${criticalComm.respondWaitExample || '-' })<br>
            • Transición actividades: <strong>${criticalComm.transitionActivitiesAppropriate || '-'}</strong> (${criticalComm.transitionActivitiesExample || '-' })
          </td>
        </tr>
        <tr>
          <th>8. Responder a Instrucciones</th>
          <td>
            <strong>Con Apoyo Visual (Gestos/Señalamiento):</strong><br>
            ${criticalComm.visualOrientToName ? `• Orientarse al nombre: ${criticalComm.visualOrientToName}<br>` : ''}
            ${criticalComm.visualComeHere ? `• "Ven aquí": ${criticalComm.visualComeHere}<br>` : ''}
            ${criticalComm.visualStop ? `• "Para": ${criticalComm.visualStop}<br>` : ''}
            ${criticalComm.visualSitDown ? `• "Siéntate": ${criticalComm.visualSitDown}<br>` : ''}
            ${criticalComm.visualGiveItToMe ? `• "Dámelo": ${criticalComm.visualGiveItToMe}<br>` : ''}
            <br>
            <strong>Solo Verbal (Sin apoyo visual):</strong><br>
            ${criticalComm.verbalOrientToName ? `• Orientarse al nombre: ${criticalComm.verbalOrientToName}<br>` : ''}
            ${criticalComm.verbalComeHere ? `• "Ven aquí": ${criticalComm.verbalComeHere}<br>` : ''}
            ${criticalComm.verbalStop ? `• "Para": ${criticalComm.verbalStop}<br>` : ''}
            ${criticalComm.verbalSitDown ? `• "Siéntate": ${criticalComm.verbalSitDown}<br>` : ''}
            ${criticalComm.verbalGiveItToMe ? `• "Dámelo": ${criticalComm.verbalGiveItToMe}<br>` : ''}
          </td>
        </tr>
        <tr>
          <th>Horario Visual y Observaciones</th>
          <td>
            Sigue horario visual: <strong>${criticalComm.followsVisualSchedule || '-'}</strong> (${criticalComm.visualScheduleNotes || '-'})<br>
            Observaciones generales: ${criticalComm.generalObservations || '-'}
          </td>
        </tr>
      </table>
      ` : ''}

      ${spm ? `
      <h3>Medida de Procesamiento Sensorial (SPM / SPM-2):</h3>
      <table>
        <tr>
          <th>Escala Sensorial</th>
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
          <td><strong>TOTAL SENSORIAL (ST)</strong></td>
          <td><strong>${spm.totalSensoryScore || '-'}</strong></td>
          <td><strong style="color: #0284c7;">${spm.totalSensoryRange || 'Típico'}</strong></td>
        </tr>
      </table>
      ` : ''}

      ${bpm ? `
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

      <h2>7. Síntesis Diagnóstica Kinésica (C.I.F.) y Objetivos Terapéuticos</h2>
      <div class="highlight-box">
        <p><strong>Diagnóstico Funcional (Clasificación Internacional del Funcionamiento):</strong></p>
        <p>${evaluations?.functionalDiagnosisCIF || report.clinicalSummary}</p>
      </div>

      <p><strong>Objetivos Terapéuticos a Corto Plazo:</strong><br>${evaluations?.therapeuticGoalsShortTerm || '-'}</p>
      <p><strong>Objetivos Terapéuticos a Largo Plazo:</strong><br>${evaluations?.therapeuticGoalsLongTerm || '-'}</p>

      <h2>8. Plan de Tratamiento e Indicaciones al Hogar / Escuela</h2>
      <p><strong>Plan de Intervención:</strong> ${evaluations?.treatmentPlan || report.planAndFollowUp}</p>
      
      <p><strong>Recomendaciones Específicas para el Hogar:</strong><br>${evaluations?.homeRecommendations || evaluations?.homeAndSchoolRecommendations || 'Pauta de estimulación en el hogar.'}</p>

      ${ageInfo.isOlderThanThree ? `
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 8px; margin: 12px 0;">
        <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 6px;">Recomendaciones para Jardín Infantil / Escuela / Aula PIE (Paciente Mayor a 3 Años):</h4>
        <p style="color: #1e3a8a; margin-bottom: 0;">${evaluations?.schoolRecommendations || 'Pautas de adecuación postural y pausas sensoriales activas para el aula escolar.'}</p>
      </div>
      ` : `
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; margin: 12px 0;">
        <h4 style="color: #166534; margin-top: 0; margin-bottom: 6px;">Estimulación Temprana y Entorno Familiar (Menor a 3 Años):</h4>
        <p style="color: #14532d; margin-bottom: 0;">Por su edad pediátrica (&lt; 3 años), las pautas terapéuticas se concentran en el hogar y cuidadores primarios (o sala cuna en caso de asistir).</p>
      </div>
      `}

      <div class="signature-box">
        <strong>${report.professionalName}</strong><br>
        ${report.professionalSpecialty}<br>
        ${report.professionalRegistry}<br>
        ${report.institution}
      </div>

    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = report.patientName.replace(/\s+/g, '_');
  link.download = `Informe_Clinico_${safeName}_${report.dateGenerated}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

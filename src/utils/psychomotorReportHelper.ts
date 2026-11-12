import { 
  PsychomotorWorkshopGroup, 
  PsychomotorParticipant, 
  PsychomotorParticipantEvaluation, 
  PsychomotorWorkshopSession 
} from '../types';
import { PSYCHOMOTOR_AREAS } from '../services/psychomotorWorkshopService';
import { formatDateDMY } from './ageHelper';

export function generateParticipantReportHtml(
  participant: PsychomotorParticipant,
  group: PsychomotorWorkshopGroup,
  initialEval?: PsychomotorParticipantEvaluation,
  finalEval?: PsychomotorParticipantEvaluation,
  sessions: PsychomotorWorkshopSession[] = []
): string {
  // Calcular asistencia
  const participantSessions = sessions.filter(s => 
    s.participants && s.participants.some(p => p.participantId === participant.id)
  );
  const presentCount = participantSessions.filter(s => 
    s.participants.find(p => p.participantId === participant.id)?.attendance === 'presente'
  ).length;
  const attendanceRate = participantSessions.length > 0 
    ? Math.round((presentCount / participantSessions.length) * 100) 
    : 100;

  // Filas de áreas
  const areaRows = PSYCHOMOTOR_AREAS.map(area => {
    const initScore = initialEval?.scores?.[area.key]?.score;
    const finScore = finalEval?.scores?.[area.key]?.score;

    const getScoreBadge = (sc?: number) => {
      if (!sc) return '<span style="color:#94a3b8; font-weight:bold;">Sin registrar</span>';
      if (sc === 4) return '<span style="color:#16a34a; font-weight:bold; background:#dcfce7; padding:2px 8px; border-radius:6px;">4 · Consolidado</span>';
      if (sc === 3) return '<span style="color:#2563eb; font-weight:bold; background:#dbeafe; padding:2px 8px; border-radius:6px;">3 · Emergente</span>';
      if (sc === 2) return '<span style="color:#ca8a04; font-weight:bold; background:#fef9c3; padding:2px 8px; border-radius:6px;">2 · En Proceso</span>';
      return '<span style="color:#dc2626; font-weight:bold; background:#fee2e2; padding:2px 8px; border-radius:6px;">1 · Con Apoyo</span>';
    };

    return `
      <tr>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; font-weight:600; color:#1e293b;">
          ${area.label}
          <div style="font-size:11px; font-weight:normal; color:#64748b;">${area.description}</div>
        </td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; text-align:center;">
          ${getScoreBadge(initScore)}
        </td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; text-align:center;">
          ${getScoreBadge(finScore)}
        </td>
      </tr>
    `;
  }).join('');

  const goalsList = [
    ...(initialEval?.recommendedGoals || []),
    ...(finalEval?.recommendedGoals || [])
  ];
  const uniqueGoals = Array.from(new Set(goalsList));

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe de Taller de Psicomotricidad - ${participant.firstName} ${participant.lastName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 32px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      color: #0369a1;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .brand-sub {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    .badge-report {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .grid-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .info-item {
      font-size: 13px;
    }
    .info-label {
      font-weight: 700;
      color: #475569;
      font-size: 11px;
      text-transform: uppercase;
    }
    .info-val {
      color: #0f172a;
      font-weight: 600;
      margin-top: 2px;
    }
    h2 {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      border-left: 4px solid #0284c7;
      padding-left: 10px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 13px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      padding: 10px 12px;
      font-weight: 700;
      text-align: left;
      border-bottom: 2px solid #cbd5e1;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    @media print {
      body { padding: 16px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h1 class="brand-title">Kinesfera Copiapó · Centro Kinésico Infantil</h1>
        <div class="brand-sub">Desarrollo Psicomotor · Juego con Sentido · Atención Pediátrica</div>
        <div class="badge-report">Informe del Taller de Psicomotricidad</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px; color:#64748b;">Fecha de emisión</div>
        <div style="font-size:13px; font-weight:700; color:#0f172a;">${formatDateDMY(new Date().toISOString())}</div>
      </div>
    </div>
  </div>

  <div class="grid-info">
    <div class="info-item">
      <div class="info-label">Participante</div>
      <div class="info-val" style="font-size:15px; color:#0369a1;">${participant.firstName} ${participant.lastName}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Grupo / Taller</div>
      <div class="info-val">${group.name} (${group.ageRangeLabel})</div>
    </div>
    <div class="info-item">
      <div class="info-label">Fecha de Nacimiento</div>
      <div class="info-val">${formatDateDMY(participant.birthDate)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Apoderado / Contacto</div>
      <div class="info-val">${participant.caregiverName} · ${participant.caregiverPhone}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Profesional a Cargo</div>
      <div class="info-val">${group.leadProfessional || 'Klgo. Profesional Tratante'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Asistencia al Taller</div>
      <div class="info-val" style="color:#0284c7;">${attendanceRate}% (${presentCount} de ${participantSessions.length} sesiones)</div>
    </div>
  </div>

  <h2>1. Resumen y Evolución por Áreas Psicomotrices</h2>
  <p style="font-size:12px; color:#475569; margin-top:-4px; margin-bottom:12px;">
    Escala de evaluación pedagógica y psicomotriz simple (1 a 4) orientada a valorar la autonomía, la iniciativa motriz y la interacción con pares y objetos.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width:50%;">Área del Desarrollo Psicomotor</th>
        <th style="width:25%; text-align:center;">Evaluación Inicial</th>
        <th style="width:25%; text-align:center;">Evaluación Final</th>
      </tr>
    </thead>
    <tbody>
      ${areaRows}
    </tbody>
  </table>

  <h2>2. Objetivos y Logros Principales</h2>
  <div class="card" style="background:#f8fafc;">
    ${uniqueGoals.length > 0 ? `
      <ul style="margin:0; padding-left:20px; font-size:13px; color:#334155;">
        ${uniqueGoals.map(g => `<li style="margin-bottom:6px;"><strong>${g}</strong></li>`).join('')}
      </ul>
    ` : `
      <p style="font-size:13px; color:#64748b; margin:0;">
        Promover el despliegue motor espontáneo, el juego compartido y la regulación corporal en un espacio cuidado y estructurado.
      </p>
    `}
  </div>

  ${(initialEval?.generalObservations || finalEval?.generalObservations) ? `
    <h2>3. Observaciones del Profesional</h2>
    <div class="card">
      ${initialEval?.generalObservations ? `
        <div style="margin-bottom:12px;">
          <strong style="font-size:12px; color:#0369a1; text-transform:uppercase;">Ingreso al Taller (${formatDateDMY(initialEval.evaluationDate)}):</strong>
          <p style="margin:4px 0 0 0; font-size:13px; color:#334155;">${initialEval.generalObservations}</p>
        </div>
      ` : ''}
      ${finalEval?.generalObservations ? `
        <div>
          <strong style="font-size:12px; color:#16a34a; text-transform:uppercase;">Cierre del Ciclo (${formatDateDMY(finalEval.evaluationDate)}):</strong>
          <p style="margin:4px 0 0 0; font-size:13px; color:#334155;">${finalEval.generalObservations}</p>
        </div>
      ` : ''}
    </div>
  ` : ''}

  <h2>4. Recomendaciones para el Hogar</h2>
  <div class="card" style="border-left:4px solid #10b981;">
    <ul style="margin:0; padding-left:20px; font-size:13px; color:#334155;">
      <li style="margin-bottom:6px;">Continuar promoviendo espacios de juego motriz libre en parques, plazas o alfombra (trepar, saltar, reptar).</li>
      <li style="margin-bottom:6px;">Validar y acompañar la expresión de emociones a través del cuerpo y del juego simbólico.</li>
      <li style="margin-bottom:6px;">Fomentar la autonomía en rutinas cotidianas manteniendo consignas claras, cálidas y concisas.</li>
    </ul>
  </div>

  <div class="footer">
    Centro Kinésico Infantil Kinesfera Copiapó · Atención y Terapia Psicomotriz en Infancia y Adolescencia<br>
    Documento informativo confidencial para la familia y cuidadores.
  </div>

</body>
</html>
  `;
}

export function openPrintableParticipantReport(
  participant: PsychomotorParticipant,
  group: PsychomotorWorkshopGroup,
  initialEval?: PsychomotorParticipantEvaluation,
  finalEval?: PsychomotorParticipantEvaluation,
  sessions: PsychomotorWorkshopSession[] = []
): void {
  const html = generateParticipantReportHtml(participant, group, initialEval, finalEval, sessions);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 600);
  }
}

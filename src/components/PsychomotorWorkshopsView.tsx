import React, { useState, useMemo } from 'react';
import { 
  User, 
  PsychomotorWorkshopGroup, 
  PsychomotorParticipant, 
  PsychomotorParticipantEvaluation, 
  PsychomotorWorkshopSession,
  PsychomotorAreaKey,
  WorkshopPaymentStatus,
  WorkshopPaymentMethod,
  AttendanceStatus,
  PsychomotorEvaluationAreaScore
} from '../types';
import { 
  psychomotorWorkshopService, 
  PSYCHOMOTOR_AREAS, 
  INSTRUCTION_FOLLOWING_AUTOMATIC_GOAL 
} from '../services/psychomotorWorkshopService';
import { calculatePatientAge, formatDateDMY } from '../utils/ageHelper';
import { openPrintableParticipantReport } from '../utils/psychomotorReportHelper';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  UserCheck, 
  UserX, 
  Printer, 
  Save, 
  X, 
  Activity, 
  Award,
  Link as LinkIcon,
  Check,
  Archive,
  BarChart3,
  Send
} from 'lucide-react';

interface PsychomotorWorkshopsViewProps {
  currentUserId: string;
  clinicianName?: string;
  existingPatients: User[];
  groups: PsychomotorWorkshopGroup[];
  participants: PsychomotorParticipant[];
  evaluations: PsychomotorParticipantEvaluation[];
  sessions: PsychomotorWorkshopSession[];
}

export const PsychomotorWorkshopsView: React.FC<PsychomotorWorkshopsViewProps> = ({
  currentUserId,
  clinicianName = 'Klgo. Aldo Olivares Araya',
  existingPatients,
  groups,
  participants,
  evaluations,
  sessions
}) => {
  // Sub-sección activa: 'grupos' | 'participantes' | 'evaluaciones' | 'sesiones' | 'pagos'
  const [activeSection, setActiveSection] = useState<'grupos' | 'participantes' | 'evaluaciones' | 'sesiones' | 'pagos'>('grupos');
  
  // Grupo seleccionado para filtrar o inspeccionar
  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
    return groups[0]?.id || '';
  });

  // Participante seleccionado
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');

  // Notificaciones locales
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setStatusNotice({ type, message });
    setTimeout(() => setStatusNotice(null), 5000);
  };

  // --------------------------------------------------------------------------
  // MODALES
  // --------------------------------------------------------------------------
  // Modal Grupo (Crear / Editar)
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PsychomotorWorkshopGroup | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupMinAge, setGroupMinAge] = useState(36); // meses
  const [groupMaxAge, setGroupMaxAge] = useState(72); // meses
  const [groupAgeLabel, setGroupAgeLabel] = useState('3 a 5 años');
  const [groupDayTime, setGroupDayTime] = useState('Miércoles y Viernes 16:30 - 17:30');
  const [groupLocation, setGroupLocation] = useState('Sala Psicomotriz Kinesfera Copiapó');
  const [groupLead, setGroupLead] = useState(clinicianName);
  const [groupMaxCapacity, setGroupMaxCapacity] = useState(8);
  const [groupStartDate, setGroupStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [groupEndDate, setGroupEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [groupStatus, setGroupStatus] = useState<'activo' | 'finalizado' | 'archivado'>('activo');
  const [groupObjective, setGroupObjective] = useState('Favorecer un desarrollo psicomotor armónico, juego espontáneo y modulación tónica.');

  // Modal Participante (Crear / Editar)
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<PsychomotorParticipant | null>(null);
  const [partGroupId, setPartGroupId] = useState('');
  const [partPatientId, setPartPatientId] = useState('');
  const [partFirstName, setPartFirstName] = useState('');
  const [partLastName, setPartLastName] = useState('');
  const [partBirthDate, setPartBirthDate] = useState('');
  const [partCaregiverName, setPartCaregiverName] = useState('');
  const [partCaregiverPhone, setPartCaregiverPhone] = useState('');
  const [partCaregiverEmail, setPartCaregiverEmail] = useState('');
  const [partConsentGranted, setPartConsentGranted] = useState(false);
  const [partConsentBy, setPartConsentBy] = useState('');
  const [partConsentDate, setPartConsentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [partConsentRut, setPartConsentRut] = useState('');
  const [partPaymentStatus, setPartPaymentStatus] = useState<WorkshopPaymentStatus>('Pendiente');
  const [partPaymentAmount, setPartPaymentAmount] = useState<number>(35000);
  const [partPaymentMethod, setPartPaymentMethod] = useState<WorkshopPaymentMethod>('Particular');
  const [partPaymentDate, setPartPaymentDate] = useState('');

  // Modal Evaluación (Inicial / Final)
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalParticipantId, setEvalParticipantId] = useState('');
  const [evalType, setEvalType] = useState<'inicial' | 'final'>('inicial');
  const [evalDate, setEvalDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evalScores, setEvalScores] = useState<Record<PsychomotorAreaKey, number>>({
    movimiento: 3,
    posturaYTono: 3,
    relacionConObjetos: 3,
    espacioYTiempo: 3,
    relacionConElOtro: 3,
    lenguajeYComunicacion: 3,
    seguimientoDeInstrucciones: 3
  });
  const [evalAreaNotes, setEvalAreaNotes] = useState<Record<PsychomotorAreaKey, string>>({
    movimiento: '',
    posturaYTono: '',
    relacionConObjetos: '',
    espacioYTiempo: '',
    relacionConElOtro: '',
    lenguajeYComunicacion: '',
    seguimientoDeInstrucciones: ''
  });
  const [evalGeneralObs, setEvalGeneralObs] = useState('');

  // Modal Nueva Sesión
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionGroupId, setSessionGroupId] = useState('');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionAttendance, setSessionAttendance] = useState<Record<string, { attendance: AttendanceStatus; observation: string; score: number }>>({});

  // --------------------------------------------------------------------------
  // CÁLCULOS Y ESTADÍSTICAS
  // --------------------------------------------------------------------------
  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const groupParticipants = useMemo(() => {
    if (!activeGroup) return [];
    return participants.filter(p => p.groupId === activeGroup.id);
  }, [participants, activeGroup]);

  const groupSessions = useMemo(() => {
    if (!activeGroup) return [];
    return sessions.filter(s => s.groupId === activeGroup.id);
  }, [sessions, activeGroup]);

  // Cupos ocupados vs disponibles
  const occupiedSpots = groupParticipants.length;
  const availableSpots = activeGroup ? Math.max(0, activeGroup.maxCapacity - occupiedSpots) : 0;

  // Recaudación del grupo
  const groupTotalRevenue = groupParticipants.reduce((sum, p) => p.paymentStatus === 'Pagado' ? sum + (p.paymentAmount || 0) : sum, 0);
  const groupPendingRevenue = groupParticipants.reduce((sum, p) => p.paymentStatus === 'Pendiente' ? sum + (p.paymentAmount || 0) : sum, 0);

  // --------------------------------------------------------------------------
  // MANEJADORES DE GRUPOS
  // --------------------------------------------------------------------------
  const handleOpenCreateGroup = () => {
    setEditingGroup(null);
    setGroupName('');
    setGroupMinAge(36);
    setGroupMaxAge(72);
    setGroupAgeLabel('3 a 5 años');
    setGroupDayTime('Miércoles y Viernes 16:30 - 17:30');
    setGroupLocation('Sala Psicomotriz Kinesfera Copiapó');
    setGroupLead(clinicianName);
    setGroupMaxCapacity(8);
    setGroupStartDate(new Date().toISOString().slice(0, 10));
    setGroupStatus('activo');
    setShowGroupModal(true);
  };

  const handleOpenEditGroup = (grp: PsychomotorWorkshopGroup) => {
    setEditingGroup(grp);
    setGroupName(grp.name);
    setGroupMinAge(grp.minAgeMonths);
    setGroupMaxAge(grp.maxAgeMonths);
    setGroupAgeLabel(grp.ageRangeLabel);
    setGroupDayTime(grp.dayAndTime);
    setGroupLocation(grp.location);
    setGroupLead(grp.leadProfessional);
    setGroupMaxCapacity(grp.maxCapacity);
    setGroupStartDate(grp.startDate);
    setGroupEndDate(grp.endDate);
    setGroupStatus(grp.status);
    setGroupObjective(grp.objectiveSummary || '');
    setShowGroupModal(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      notify('Por favor indica un nombre para el grupo.', 'error');
      return;
    }

    const payload: PsychomotorWorkshopGroup = {
      id: editingGroup ? editingGroup.id : `grp_${Date.now()}`,
      userId: currentUserId,
      name: groupName.trim(),
      minAgeMonths: Number(groupMinAge),
      maxAgeMonths: Number(groupMaxAge),
      ageRangeLabel: groupAgeLabel.trim(),
      dayAndTime: groupDayTime.trim(),
      location: groupLocation.trim(),
      leadProfessional: groupLead.trim(),
      maxCapacity: Number(groupMaxCapacity) || 8,
      startDate: groupStartDate,
      endDate: groupEndDate,
      status: groupStatus,
      objectiveSummary: groupObjective.trim(),
      createdAt: editingGroup ? editingGroup.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await psychomotorWorkshopService.saveGroup(currentUserId, payload);
      setSelectedGroupId(payload.id);
      setShowGroupModal(false);
      notify(`Grupo "${payload.name}" guardado con éxito en Firebase Firestore.`);
    } catch (err: any) {
      notify(`Error al guardar grupo: ${err.message}`, 'error');
    }
  };

  const handleDeleteGroup = async (groupId: string, groupTitle: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el grupo "${groupTitle}"? Se conservarán los pacientes vinculados.`)) return;
    try {
      await psychomotorWorkshopService.deleteGroup(currentUserId, groupId);
      notify(`Grupo "${groupTitle}" eliminado.`);
    } catch (err: any) {
      notify(`Error al eliminar grupo: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // MANEJADORES DE PARTICIPANTES
  // --------------------------------------------------------------------------
  const handleOpenAddParticipant = (grpId?: string) => {
    setEditingParticipant(null);
    setPartGroupId(grpId || selectedGroupId || (groups[0]?.id || ''));
    setPartPatientId('');
    setPartFirstName('');
    setPartLastName('');
    setPartBirthDate('');
    setPartCaregiverName('');
    setPartCaregiverPhone('+56 9 ');
    setPartCaregiverEmail('');
    setPartConsentGranted(false);
    setPartConsentBy('');
    setPartConsentDate(new Date().toISOString().slice(0, 10));
    setPartConsentRut('');
    setPartPaymentStatus('Pendiente');
    setPartPaymentAmount(35000);
    setPartPaymentMethod('Particular');
    setPartPaymentDate('');
    setShowParticipantModal(true);
  };

  // Al seleccionar paciente existente, autocompletar datos para no duplicar
  const handleLinkPatient = (patientId: string) => {
    setPartPatientId(patientId);
    if (!patientId) return;
    const pat = existingPatients.find(p => p.id === patientId);
    if (pat) {
      setPartFirstName(pat.firstName);
      setPartLastName(pat.lastName);
      setPartBirthDate(pat.birthDate || '');
      setPartCaregiverName(pat.emergencyContact?.name || '');
      setPartCaregiverPhone(pat.emergencyContact?.phone || '');
      setPartCaregiverEmail(pat.email || '');
    }
  };

  const handleSaveParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partFirstName.trim() || !partBirthDate) {
      notify('Indica nombre y fecha de nacimiento del niño.', 'error');
      return;
    }

    if (!partConsentGranted || !partConsentBy.trim()) {
      notify('REQUERIDO: Debes registrar el consentimiento del apoderado (fecha y quién lo otorgó) antes de registrar al participante.', 'error');
      return;
    }

    const payload: PsychomotorParticipant = {
      id: editingParticipant ? editingParticipant.id : `part_${Date.now()}`,
      userId: currentUserId,
      groupId: partGroupId,
      patientId: partPatientId || undefined,
      firstName: partFirstName.trim(),
      lastName: partLastName.trim(),
      birthDate: partBirthDate,
      caregiverName: partCaregiverName.trim(),
      caregiverPhone: partCaregiverPhone.trim(),
      caregiverEmail: partCaregiverEmail.trim() || undefined,
      enrollmentDate: editingParticipant ? editingParticipant.enrollmentDate : new Date().toISOString().slice(0, 10),
      consent: {
        granted: true,
        grantedBy: partConsentBy.trim(),
        consentDate: partConsentDate,
        rutOrId: partConsentRut.trim() || undefined
      },
      paymentStatus: partPaymentStatus,
      paymentAmount: Number(partPaymentAmount) || 0,
      paymentMethod: partPaymentMethod,
      paymentDate: partPaymentDate || undefined,
      createdAt: editingParticipant ? editingParticipant.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await psychomotorWorkshopService.saveParticipant(currentUserId, payload);
      setShowParticipantModal(false);
      notify(`Participante "${payload.firstName} ${payload.lastName}" guardado con consentimiento registrado.`);
    } catch (err: any) {
      notify(`Error al guardar participante: ${err.message}`, 'error');
    }
  };

  const handleDeleteParticipant = async (participantId: string, partName: string) => {
    if (!window.confirm(`¿Deseas eliminar a "${partName}" de este taller?`)) return;
    try {
      await psychomotorWorkshopService.deleteParticipant(currentUserId, participantId);
      notify(`Participante "${partName}" eliminado del taller.`);
    } catch (err: any) {
      notify(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // MANEJADORES DE EVALUACIONES
  // --------------------------------------------------------------------------
  const handleOpenEvaluation = (participant: PsychomotorParticipant, type: 'inicial' | 'final') => {
    setEvalParticipantId(participant.id);
    setEvalType(type);
    setEvalDate(new Date().toISOString().slice(0, 10));

    // Si ya existe una evaluación de este tipo, cargar sus valores
    const existing = evaluations.find(e => e.participantId === participant.id && e.type === type);
    if (existing) {
      const initialScores: Record<PsychomotorAreaKey, number> = {} as any;
      const initialNotes: Record<PsychomotorAreaKey, string> = {} as any;
      PSYCHOMOTOR_AREAS.forEach(area => {
        initialScores[area.key] = existing.scores?.[area.key]?.score || 3;
        initialNotes[area.key] = existing.scores?.[area.key]?.notes || '';
      });
      setEvalScores(initialScores);
      setEvalAreaNotes(initialNotes);
      setEvalGeneralObs(existing.generalObservations || '');
    } else {
      setEvalScores({
        movimiento: 3,
        posturaYTono: 3,
        relacionConObjetos: 3,
        espacioYTiempo: 3,
        relacionConElOtro: 3,
        lenguajeYComunicacion: 3,
        seguimientoDeInstrucciones: 3
      });
      setEvalAreaNotes({
        movimiento: '',
        posturaYTono: '',
        relacionConObjetos: '',
        espacioYTiempo: '',
        relacionConElOtro: '',
        lenguajeYComunicacion: '',
        seguimientoDeInstrucciones: ''
      });
      setEvalGeneralObs('');
    }

    setShowEvalModal(true);
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    const part = participants.find(p => p.id === evalParticipantId);
    if (!part) return;

    const ageInfo = calculatePatientAge(part.birthDate);

    const scoresMap: Record<PsychomotorAreaKey, PsychomotorEvaluationAreaScore> = {} as any;
    PSYCHOMOTOR_AREAS.forEach(area => {
      scoresMap[area.key] = {
        key: area.key,
        label: area.label,
        score: evalScores[area.key] || 3,
        notes: evalAreaNotes[area.key]?.trim() || undefined
      };
    });

    const instructionScore = evalScores.seguimientoDeInstrucciones;
    const hasLimitation = instructionScore <= 2;
    const recommendedGoals: string[] = [];
    if (hasLimitation) {
      recommendedGoals.push(INSTRUCTION_FOLLOWING_AUTOMATIC_GOAL);
    }

    const payload: PsychomotorParticipantEvaluation = {
      id: `peval_${part.id}_${evalType}`,
      userId: currentUserId,
      groupId: part.groupId,
      participantId: part.id,
      type: evalType,
      evaluationDate: evalDate,
      chronologicalAgeText: ageInfo.ageText,
      evaluatorName: clinicianName,
      scores: scoresMap,
      generalObservations: evalGeneralObs.trim(),
      hasInstructionFollowLimitation: hasLimitation,
      recommendedGoals,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await psychomotorWorkshopService.saveEvaluation(currentUserId, payload);
      setShowEvalModal(false);
      notify(`Evaluación ${evalType.toUpperCase()} de "${part.firstName}" guardada.${hasLimitation ? ' Se agregó automáticamente el objetivo de seguimiento de instrucciones.' : ''}`);
      
      // Auto-sincronizar datos agregados anónimos con Marketing si corresponde
      triggerAggregatedMarketingSync(part.groupId);
    } catch (err: any) {
      notify(`Error guardando evaluación: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // MANEJADORES DE SESIONES
  // --------------------------------------------------------------------------
  const handleOpenAddSession = (grpId?: string) => {
    const targetGroupId = grpId || selectedGroupId;
    setSessionGroupId(targetGroupId);
    setSessionDate(new Date().toISOString().slice(0, 10));
    setSessionTopic('');
    setSessionNotes('');

    const grpParts = participants.filter(p => p.groupId === targetGroupId);
    const initialAtt: Record<string, { attendance: AttendanceStatus; observation: string; score: number }> = {};
    grpParts.forEach(p => {
      initialAtt[p.id] = { attendance: 'presente', observation: '', score: 3 };
    });
    setSessionAttendance(initialAtt);
    setShowSessionModal(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTopic.trim()) {
      notify('Indica el tema o actividad de la sesión.', 'error');
      return;
    }

    const currentGrpSessions = sessions.filter(s => s.groupId === sessionGroupId);
    const sessionParticipantsList = Object.entries(sessionAttendance).map(([pid, record]) => ({
      participantId: pid,
      attendance: record.attendance,
      observation: record.observation.trim() || undefined,
      sessionScore: record.score
    }));

    const payload: PsychomotorWorkshopSession = {
      id: `psess_${Date.now()}`,
      userId: currentUserId,
      groupId: sessionGroupId,
      sessionNumber: currentGrpSessions.length + 1,
      date: sessionDate,
      topicOrActivity: sessionTopic.trim(),
      generalNotes: sessionNotes.trim() || undefined,
      participants: sessionParticipantsList,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await psychomotorWorkshopService.saveSession(currentUserId, payload);
      setShowSessionModal(false);
      notify(`Sesión #${payload.sessionNumber} guardada en Firebase Firestore.`);
      triggerAggregatedMarketingSync(sessionGroupId);
    } catch (err: any) {
      notify(`Error guardando sesión: ${err.message}`, 'error');
    }
  };

  // --------------------------------------------------------------------------
  // SINCRONIZACIÓN AGREGADA CON MARKETING (100% ANÓNIMA)
  // --------------------------------------------------------------------------
  const triggerAggregatedMarketingSync = async (grpId: string) => {
    const grp = groups.find(g => g.id === grpId);
    if (!grp) return;

    const grpParts = participants.filter(p => p.groupId === grpId);
    if (grpParts.length === 0) return;

    // Calcular edad promedio en meses
    let totalMonthsSum = 0;
    grpParts.forEach(p => {
      const age = calculatePatientAge(p.birthDate);
      totalMonthsSum += age.totalMonths;
    });
    const avgMonths = Math.round(totalMonthsSum / grpParts.length);
    const avgYears = Math.floor(avgMonths / 12);
    const remMonths = avgMonths % 12;

    // Calcular áreas con mayor avance entre evaluaciones inicial y final
    const areaImprovements: Record<string, number> = {};
    PSYCHOMOTOR_AREAS.forEach(a => areaImprovements[a.label] = 0);

    grpParts.forEach(p => {
      const init = evaluations.find(e => e.participantId === p.id && e.type === 'inicial');
      const fin = evaluations.find(e => e.participantId === p.id && e.type === 'final');
      if (init && fin) {
        PSYCHOMOTOR_AREAS.forEach(a => {
          const diff = (fin.scores?.[a.key]?.score || 0) - (init.scores?.[a.key]?.score || 0);
          if (diff > 0) {
            areaImprovements[a.label] += diff;
          }
        });
      }
    });

    const topAreas = Object.entries(areaImprovements)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, val]) => val > 0)
      .map(([label]) => label)
      .slice(0, 3);

    // Actividades exitosas de las sesiones
    const grpSessions = sessions.filter(s => s.groupId === grpId);
    const successfulActivities = grpSessions.map(s => s.topicOrActivity).filter(Boolean).slice(-4);

    // % Asistencia promedio
    let totalAttRecords = 0;
    let presentCount = 0;
    grpSessions.forEach(s => {
      s.participants?.forEach(p => {
        totalAttRecords++;
        if (p.attendance === 'presente') presentCount++;
      });
    });
    const avgAttendance = totalAttRecords > 0 ? Math.round((presentCount / totalAttRecords) * 100) : 100;

    const marketingPayload = {
      groupId: grp.id,
      groupName: grp.name,
      averageAgeMonths: avgMonths,
      averageAgeYearsText: `${avgYears} años y ${remMonths} meses`,
      participantCount: grpParts.length,
      topProgressAreas: topAreas.length > 0 ? topAreas : ['Movimiento y Coordinación Dinámica', 'Postura y Modulación Tónica', 'Juego y Relación con el Otro'],
      successfulActivities: successfulActivities.length > 0 ? successfulActivities : ['Circuitos de desestabilización lúdica', 'Construcción con módulos de espuma', 'Juegos de seguimiento y detención'],
      averageAttendancePercent: avgAttendance,
      generatedDate: new Date().toISOString()
    };

    await psychomotorWorkshopService.syncAggregatedMarketingInsights(currentUserId, marketingPayload);
  };

  // --------------------------------------------------------------------------
  // RENDERIZADO
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-6">

      {/* BANNER SUPERIOR INFORMATIVO */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                Módulo Grupal Clínico
              </span>
              <span className="text-[10px] font-bold text-emerald-200 bg-white/10 px-2 py-0.5 rounded-full">
                Grupos Reducidos & Psicomotricidad
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              <span>Talleres de Psicomotricidad Kinesfera</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-3xl leading-relaxed">
              Gestión integral de grupos, participantes con consentimiento informado, evaluación psicomotriz en 7 áreas (escala 1 a 4), asistencia por sesión, control de pagos e informes breves para apoderados sin terminología no autorizada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenCreateGroup}
              className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-300/60"
            >
              <Plus className="w-4 h-4" />
              <span>+ Crear Nuevo Grupo</span>
            </button>

            <button
              onClick={() => handleOpenAddParticipant()}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
            >
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>+ Inscribir Participante</span>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICACIÓN FLOTANTE */}
      {statusNotice && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-bold animate-in fade-in ${
          statusNotice.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : statusNotice.type === 'error'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-blue-50 border-blue-300 text-blue-900'
        }`}>
          <div className="flex items-center gap-2">
            {statusNotice.type === 'success' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
            {statusNotice.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{statusNotice.message}</span>
          </div>
          <button onClick={() => setStatusNotice(null)} className="text-slate-500 hover:text-slate-800 cursor-pointer">✕</button>
        </div>
      )}

      {/* SUB-NAVEGACIÓN INTERNA DEL MÓDULO */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSection('grupos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'grupos'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Grupos ({groups.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('participantes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'participantes'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Participantes ({participants.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('evaluaciones')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'evaluaciones'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>3. Evaluación Inicial y Final</span>
          </button>

          <button
            onClick={() => setActiveSection('sesiones')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'sesiones'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>4. Sesiones & Asistencia</span>
          </button>

          <button
            onClick={() => setActiveSection('pagos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'pagos'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>5. Pagos & Recaudación</span>
          </button>
        </div>

        {/* SELECTOR DE GRUPO ACTIVO */}
        {groups.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filtrar por grupo:</span>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.ageRangeLabel}) — {g.status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 1: LISTA Y GESTIÓN DE GRUPOS                                 */}
      {/* ===================================================================== */}
      {activeSection === 'grupos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(grp => {
              const grpParts = participants.filter(p => p.groupId === grp.id);
              const spotsLeft = Math.max(0, grp.maxCapacity - grpParts.length);
              const isFull = spotsLeft === 0;

              return (
                <div 
                  key={grp.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                    selectedGroupId === grp.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        grp.status === 'activo' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : grp.status === 'finalizado'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {grp.status}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditGroup(grp)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                          title="Editar grupo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(grp.id, grp.name)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                          title="Eliminar grupo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {grp.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">
                      Rango etario: {grp.ageRangeLabel}
                    </p>

                    <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{grp.dayAndTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{grp.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>A cargo: <strong className="text-slate-800">{grp.leadProfessional}</strong></span>
                      </div>
                    </div>

                    {/* Barra de Cupos */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-600">Cupos:</span>
                        <span className="font-black text-slate-900">
                          {grpParts.length} / {grp.maxCapacity} {isFull ? '(COMPLETO)' : `(${spotsLeft} disponibles)`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all rounded-full ${
                            isFull ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (grpParts.length / grp.maxCapacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedGroupId(grp.id);
                        setActiveSection('participantes');
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver {grpParts.length} participantes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenAddParticipant(grp.id)}
                      disabled={isFull}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                        isFull 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Inscribir</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {groups.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No hay grupos de psicomotricidad creados</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Crea tu primer grupo indicando rango de edad, cupo máximo y horario para comenzar a inscribir participantes.
                </p>
                <button
                  onClick={handleOpenCreateGroup}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-500 cursor-pointer shadow-xs"
                >
                  + Crear Primer Grupo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 2: PARTICIPANTES & CONSENTIMIENTO INFORMADO                  */}
      {/* ===================================================================== */}
      {activeSection === 'participantes' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Participantes de: <span className="text-emerald-700">{activeGroup?.name || 'Selecciona un grupo'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {groupParticipants.length} inscritos · {availableSpots} cupos disponibles · Rango del grupo: {activeGroup?.ageRangeLabel}
              </p>
            </div>

            <button
              onClick={() => handleOpenAddParticipant(selectedGroupId)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Inscribir Niño</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Niño / Participante</th>
                    <th className="py-3 px-4">Edad Calculada</th>
                    <th className="py-3 px-4">Apoderado & Contacto</th>
                    <th className="py-3 px-4">Consentimiento Apoderado</th>
                    <th className="py-3 px-4">Evaluaciones</th>
                    <th className="py-3 px-4">Estado Pago</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {groupParticipants.map(part => {
                    const age = calculatePatientAge(part.birthDate);
                    const initEval = evaluations.find(e => e.participantId === part.id && e.type === 'inicial');
                    const finEval = evaluations.find(e => e.participantId === part.id && e.type === 'final');
                    
                    // Comprobar si queda fuera del rango etario del grupo
                    const outOfRange = activeGroup 
                      ? (age.totalMonths < activeGroup.minAgeMonths || age.totalMonths > activeGroup.maxAgeMonths)
                      : false;

                    return (
                      <tr key={part.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            {part.firstName} {part.lastName}
                          </div>
                          {part.patientId && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200 mt-0.5">
                              <LinkIcon className="w-2.5 h-2.5" />
                              <span>Paciente Vinculado</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{age.ageText}</div>
                          <div className="text-[10px] text-slate-400">Nac: {formatDateDMY(part.birthDate)}</div>
                          {outOfRange && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                              <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                              <span>Fuera de rango del grupo</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{part.caregiverName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{part.caregiverPhone}</div>
                        </td>

                        <td className="py-3 px-4">
                          {part.consent?.granted ? (
                            <div className="text-emerald-700 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <div className="text-[11px]">Otorgado por: {part.consent.grantedBy}</div>
                                <div className="text-[10px] text-slate-400 font-normal">Fecha: {formatDateDMY(part.consent.consentDate)}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Sin consentimiento</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEvaluation(part, 'inicial')}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                                initEval 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                              }`}
                              title={initEval ? 'Editar evaluación inicial' : 'Realizar evaluación inicial'}
                            >
                              {initEval ? '✓ Inicial' : '+ Inicial'}
                            </button>

                            <button
                              onClick={() => handleOpenEvaluation(part, 'final')}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                                finEval 
                                  ? 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100'
                                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                              }`}
                              title={finEval ? 'Editar evaluación final' : 'Realizar evaluación final'}
                            >
                              {finEval ? '✓ Final' : '+ Final'}
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            part.paymentStatus === 'Pagado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {part.paymentStatus} (${(part.paymentAmount || 0).toLocaleString('es-CL')})
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (!activeGroup) return;
                                openPrintableParticipantReport(part, activeGroup, initEval, finEval, groupSessions);
                              }}
                              className="p-1.5 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Generar informe breve en PDF para apoderados"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setEditingParticipant(part);
                                setPartGroupId(part.groupId);
                                setPartPatientId(part.patientId || '');
                                setPartFirstName(part.firstName);
                                setPartLastName(part.lastName);
                                setPartBirthDate(part.birthDate);
                                setPartCaregiverName(part.caregiverName);
                                setPartCaregiverPhone(part.caregiverPhone);
                                setPartCaregiverEmail(part.caregiverEmail || '');
                                setPartConsentGranted(part.consent?.granted || false);
                                setPartConsentBy(part.consent?.grantedBy || '');
                                setPartConsentDate(part.consent?.consentDate || new Date().toISOString().slice(0, 10));
                                setPartConsentRut(part.consent?.rutOrId || '');
                                setPartPaymentStatus(part.paymentStatus);
                                setPartPaymentAmount(part.paymentAmount);
                                setPartPaymentMethod(part.paymentMethod);
                                setPartPaymentDate(part.paymentDate || '');
                                setShowParticipantModal(true);
                              }}
                              className="p-1.5 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                              title="Editar datos del participante"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteParticipant(part.id, `${part.firstName} ${part.lastName}`)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar de este taller"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {groupParticipants.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No hay participantes inscritos en este grupo aún. Haz clic en <strong>+ Inscribir Niño</strong> para registrar al primero con consentimiento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 3: EVALUACIÓN INICIAL Y FINAL (7 ÁREAS, ESCALA 1 A 4)        */}
      {/* ===================================================================== */}
      {activeSection === 'evaluaciones' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Pauta de Evaluación Psicomotriz (Escala Simple de 1 a 4)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Valoración rápida al ingresar (Inicial) y al término del ciclo (Final). Incluye semáforo por área y genera automáticamente el objetivo kinésico si el participante presenta dificultad en el seguimiento de instrucciones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span><strong>1 · Con Apoyo:</strong> Dificultad severa / No observado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span><strong>2 · En Proceso:</strong> Requiere mediación constante</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span><strong>3 · Emergente:</strong> Mayormente autónomo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span><strong>4 · Consolidado:</strong> Logro pleno acorde a la edad</span>
              </div>
            </div>

            {/* TABLA COMPARATIVA INICIAL VS FINAL POR PARTICIPANTE */}
            <div className="space-y-3">
              {groupParticipants.map(part => {
                const init = evaluations.find(e => e.participantId === part.id && e.type === 'inicial');
                const fin = evaluations.find(e => e.participantId === part.id && e.type === 'final');

                return (
                  <div key={part.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{part.firstName} {part.lastName}</span>
                        <span className="text-xs text-slate-500">({calculatePatientAge(part.birthDate).ageText})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEvaluation(part, 'inicial')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            init 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {init ? `✓ Inicial (${formatDateDMY(init.evaluationDate)})` : '+ Realizar Evaluación Inicial'}
                        </button>

                        <button
                          onClick={() => handleOpenEvaluation(part, 'final')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            fin 
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {fin ? `✓ Final (${formatDateDMY(fin.evaluationDate)})` : '+ Realizar Evaluación Final'}
                        </button>

                        <button
                          onClick={() => {
                            if (!activeGroup) return;
                            openPrintableParticipantReport(part, activeGroup, init, fin, groupSessions);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Descargar Informe PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* GRÁFICO / BARRAS COMPARATIVAS POR ÁREA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                      {PSYCHOMOTOR_AREAS.map(area => {
                        const initScore = init?.scores?.[area.key]?.score || 0;
                        const finScore = fin?.scores?.[area.key]?.score || 0;

                        const getColor = (sc: number) => {
                          if (sc === 4) return 'bg-emerald-500';
                          if (sc === 3) return 'bg-blue-500';
                          if (sc === 2) return 'bg-amber-500';
                          if (sc === 1) return 'bg-rose-500';
                          return 'bg-slate-200';
                        };

                        return (
                          <div key={area.key} className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-2xs">
                            <span className="text-[11px] font-bold text-slate-700 block truncate" title={area.label}>
                              {area.label}
                            </span>
                            <div className="flex items-center justify-center gap-2 mt-2">
                              <div>
                                <span className="text-[9px] text-slate-400 block">INI</span>
                                <span className={`inline-block w-6 h-6 rounded-md text-white font-bold text-xs leading-6 ${getColor(initScore)}`}>
                                  {initScore || '-'}
                                </span>
                              </div>
                              <span className="text-slate-300">→</span>
                              <div>
                                <span className="text-[9px] text-slate-400 block">FIN</span>
                                <span className={`inline-block w-6 h-6 rounded-md text-white font-bold text-xs leading-6 ${getColor(finScore)}`}>
                                  {finScore || '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ALERTA OBJETIVO AUTOMÁTICO SEGUIMIENTO DE INSTRUCCIONES */}
                    {init && init.scores?.seguimientoDeInstrucciones?.score <= 2 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          <strong>Objetivo Automático Activado:</strong> "{INSTRUCTION_FOLLOWING_AUTOMATIC_GOAL}".
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {groupParticipants.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No hay participantes para evaluar en este grupo.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 4: SEGUIMIENTO Y ASISTENCIA POR SESIÓN                       */}
      {/* ===================================================================== */}
      {activeSection === 'sesiones' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Historial de Sesiones: <span className="text-emerald-700">{activeGroup?.name || 'Selecciona un grupo'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {groupSessions.length} sesiones registradas · Asistencia individual y bitácora clínica de actividades
              </p>
            </div>

            <button
              onClick={() => handleOpenAddSession(selectedGroupId)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar Nueva Sesión</span>
            </button>
          </div>

          <div className="space-y-3">
            {groupSessions.map(sess => {
              const presentCount = sess.participants?.filter(p => p.attendance === 'presente').length || 0;
              const totalParts = sess.participants?.length || 0;
              const attRate = totalParts > 0 ? Math.round((presentCount / totalParts) * 100) : 0;

              return (
                <div key={sess.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                        #{sess.sessionNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{sess.topicOrActivity}</h4>
                        <span className="text-[11px] text-slate-500">Fecha: {formatDateDMY(sess.date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Asistencia: {presentCount} / {totalParts} ({attRate}%)
                      </span>
                    </div>
                  </div>

                  {sess.generalNotes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 italic">
                      "{sess.generalNotes}"
                    </p>
                  )}

                  {/* Tabla de asistencia de la sesión */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {sess.participants?.map(record => {
                      const partObj = participants.find(p => p.id === record.participantId);
                      if (!partObj) return null;

                      return (
                        <div key={record.participantId} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block truncate">{partObj.firstName} {partObj.lastName}</span>
                            {record.observation && (
                              <span className="text-[10px] text-slate-500 italic block">{record.observation}</span>
                            )}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            record.attendance === 'presente'
                              ? 'bg-emerald-100 text-emerald-800'
                              : record.attendance === 'justificado'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {record.attendance}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {groupSessions.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                Aún no has registrado ninguna sesión para este grupo. Haz clic en <strong>+ Registrar Nueva Sesión</strong>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 5: PAGOS & RECAUDACIÓN DEL TALLER                            */}
      {/* ===================================================================== */}
      {activeSection === 'pagos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Recaudación Pagada</span>
              <span className="text-2xl font-black text-emerald-600 block mt-1">
                ${groupTotalRevenue.toLocaleString('es-CL')}
              </span>
              <span className="text-[11px] text-slate-400">Total confirmado en este grupo</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pendiente de Cobro</span>
              <span className="text-2xl font-black text-amber-600 block mt-1">
                ${groupPendingRevenue.toLocaleString('es-CL')}
              </span>
              <span className="text-[11px] text-slate-400">Por regularizar con apoderados</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Proyectado</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                ${(groupTotalRevenue + groupPendingRevenue).toLocaleString('es-CL')}
              </span>
              <span className="text-[11px] text-slate-400">{groupParticipants.length} participantes activos</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Participante</th>
                  <th className="py-3 px-4">Apoderado</th>
                  <th className="py-3 px-4">Monto Taller</th>
                  <th className="py-3 px-4">Medio de Pago</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupParticipants.map(part => (
                  <tr key={part.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {part.firstName} {part.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {part.caregiverName} ({part.caregiverPhone})
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      ${(part.paymentAmount || 0).toLocaleString('es-CL')}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {part.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        part.paymentStatus === 'Pagado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {part.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={async () => {
                          const newStatus = part.paymentStatus === 'Pagado' ? 'Pendiente' : 'Pagado';
                          try {
                            await psychomotorWorkshopService.saveParticipant(currentUserId, {
                              ...part,
                              paymentStatus: newStatus,
                              paymentDate: newStatus === 'Pagado' ? new Date().toISOString().slice(0, 10) : undefined
                            });
                            notify(`Estado de pago de "${part.firstName}" cambiado a ${newStatus}.`);
                          } catch (err: any) {
                            notify(`Error: ${err.message}`, 'error');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg border text-[10px] font-bold bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Marcar como {part.paymentStatus === 'Pagado' ? 'Pendiente' : 'Pagado'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CREAR / EDITAR GRUPO                                          */}
      {/* ===================================================================== */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingGroup ? 'Editar Grupo de Psicomotricidad' : 'Crear Nuevo Grupo de Psicomotricidad'}
              </h3>
              <button onClick={() => setShowGroupModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Grupo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej: Taller Pequeños Exploradores (3 a 5 años)"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Edad Mín (meses)</label>
                  <input
                    type="number"
                    min="12"
                    max="180"
                    value={groupMinAge}
                    onChange={e => {
                      const min = Number(e.target.value);
                      setGroupMinAge(min);
                      setGroupAgeLabel(`${Math.floor(min / 12)} a ${Math.floor(groupMaxAge / 12)} años`);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Edad Máx (meses)</label>
                  <input
                    type="number"
                    min="12"
                    max="180"
                    value={groupMaxAge}
                    onChange={e => {
                      const max = Number(e.target.value);
                      setGroupMaxAge(max);
                      setGroupAgeLabel(`${Math.floor(groupMinAge / 12)} a ${Math.floor(max / 12)} años`);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Etiqueta Rango</label>
                  <input
                    type="text"
                    value={groupAgeLabel}
                    onChange={e => setGroupAgeLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Día y Horario</label>
                  <input
                    type="text"
                    value={groupDayTime}
                    onChange={e => setGroupDayTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cupo Máximo</label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={groupMaxCapacity}
                    onChange={e => setGroupMaxCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lugar</label>
                <input
                  type="text"
                  value={groupLocation}
                  onChange={e => setGroupLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Profesional a Cargo</label>
                <input
                  type="text"
                  value={groupLead}
                  onChange={e => setGroupLead(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={groupStartDate}
                    onChange={e => setGroupStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha Término</label>
                  <input
                    type="date"
                    value={groupEndDate}
                    onChange={e => setGroupEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado</label>
                  <select
                    value={groupStatus}
                    onChange={e => setGroupStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="activo">Activo</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="archivado">Archivado</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Guardar Grupo en Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: INSCRIBIR PARTICIPANTE CON CONSENTIMIENTO                    */}
      {/* ===================================================================== */}
      {showParticipantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingParticipant ? 'Editar Participante' : 'Inscribir Niño en Taller de Psicomotricidad'}
              </h3>
              <button onClick={() => setShowParticipantModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParticipant} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Grupo Asignado</label>
                <select
                  value={partGroupId}
                  onChange={e => setPartGroupId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.ageRangeLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Opción de vincular a paciente existente para no duplicar datos */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
                <label className="font-bold text-blue-900 block flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vincular a Paciente Existente (Opcional)</span>
                </label>
                <select
                  value={partPatientId}
                  onChange={e => handleLinkPatient(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs"
                >
                  <option value="">(Registrar niño como nuevo participante)</option>
                  {existingPatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} — RUT: {p.rut}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={partFirstName}
                    onChange={e => setPartFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellidos</label>
                  <input
                    type="text"
                    value={partLastName}
                    onChange={e => setPartLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  required
                  value={partBirthDate}
                  onChange={e => setPartBirthDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
                {partBirthDate && (
                  <span className="text-[11px] font-bold text-emerald-700 mt-1 block">
                    Edad calculada: {calculatePatientAge(partBirthDate).ageText}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre Apoderado *</label>
                  <input
                    type="text"
                    required
                    value={partCaregiverName}
                    onChange={e => setPartCaregiverName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono Contacto *</label>
                  <input
                    type="text"
                    required
                    value={partCaregiverPhone}
                    onChange={e => setPartCaregiverPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* CONSENTIMIENTO DEL APODERADO (EXIGENCIA BLOQUEANTE) */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <strong className="text-emerald-950 font-bold text-xs">
                    Consentimiento Informado del Apoderado (Requerido)
                  </strong>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={partConsentGranted}
                    onChange={e => setPartConsentGranted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <span className="text-[11px] text-emerald-900 leading-tight">
                    El apoderado autoriza formalmente la participación del niño en el taller y el registro clínico psicomotor.
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="font-bold text-emerald-900 text-[11px] block mb-0.5">Quién otorgó el consentimiento *</label>
                    <input
                      type="text"
                      placeholder="ej: María Pérez (Madre)"
                      value={partConsentBy}
                      onChange={e => setPartConsentBy(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-emerald-900 text-[11px] block mb-0.5">Fecha del consentimiento *</label>
                    <input
                      type="date"
                      value={partConsentDate}
                      onChange={e => setPartConsentDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* PAGOS DEL TALLER */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monto ($)</label>
                  <input
                    type="number"
                    value={partPaymentAmount}
                    onChange={e => setPartPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medio Pago</label>
                  <select
                    value={partPaymentMethod}
                    onChange={e => setPartPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Particular">Particular</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta / Débito">Tarjeta / Débito</option>
                    <option value="Fonasa">Fonasa</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado Pago</label>
                  <select
                    value={partPaymentStatus}
                    onChange={e => setPartPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowParticipantModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Guardar Participante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: EVALUACIÓN PSICOMOTRIZ (INICIAL / FINAL)                      */}
      {/* ===================================================================== */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Evaluación {evalType.toUpperCase()} de Psicomotricidad
                </h3>
                <p className="text-xs text-slate-500">
                  Puntuación simple de 1 a 4 por área para comparar evolución de ingreso y cierre
                </p>
              </div>
              <button onClick={() => setShowEvalModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-700 block">Fecha de Evaluación:</span>
                  <input
                    type="date"
                    required
                    value={evalDate}
                    onChange={e => setEvalDate(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs mt-1"
                  />
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500">Evaluador:</span>
                  <span className="font-bold text-slate-800 block">{clinicianName}</span>
                </div>
              </div>

              {/* 7 ÁREAS EVALUADAS */}
              <div className="space-y-3">
                {PSYCHOMOTOR_AREAS.map(area => {
                  const currentScore = evalScores[area.key] || 3;

                  return (
                    <div key={area.key} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <strong className="text-slate-900 font-bold block">{area.label}</strong>
                          <span className="text-[11px] text-slate-500">{area.description}</span>
                        </div>

                        {/* SELECTOR TIPO RADIO BOTONES (1 A 4) */}
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setEvalScores(prev => ({ ...prev, [area.key]: val }))}
                              className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                currentScore === val 
                                  ? val === 4 ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                                  : val === 3 ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                  : val === 2 ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                                  : 'bg-rose-600 text-white ring-2 ring-rose-400'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Observación específica de esta área (opcional)"
                        value={evalAreaNotes[area.key] || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setEvalAreaNotes(prev => ({ ...prev, [area.key]: val }));
                        }}
                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  );
                })}
              </div>

              {/* AVISO AUTOMÁTICO SEGUIMIENTO DE INSTRUCCIONES */}
              {evalScores.seguimientoDeInstrucciones <= 2 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Regla Automática Activada:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Al obtener puntaje ≤ 2 en seguimiento de instrucciones, se agregará automáticamente el objetivo:
                    <strong> "{INSTRUCTION_FOLLOWING_AUTOMATIC_GOAL}"</strong>.
                  </p>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observaciones Generales del Profesional</label>
                <textarea
                  rows={3}
                  placeholder="Detalla fortalezas motrices observadas, iniciativa lúdica y vínculo con pares..."
                  value={evalGeneralObs}
                  onChange={e => setEvalGeneralObs(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEvalModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Guardar Evaluación en Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: NUEVA SESIÓN Y ASISTENCIA                                     */}
      {/* ===================================================================== */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Registrar Sesión y Asistencia
              </h3>
              <button onClick={() => setShowSessionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha de la Sesión *</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={e => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tema / Actividad Principal *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej: Circuito de saltos y caídas seguras"
                    value={sessionTopic}
                    onChange={e => setSessionTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Asistencia por Participante</label>
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  {participants.filter(p => p.groupId === sessionGroupId).map(p => {
                    const record = sessionAttendance[p.id] || { attendance: 'presente', observation: '', score: 3 };

                    return (
                      <div key={p.id} className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900">{p.firstName} {p.lastName}</span>
                          <div className="flex items-center gap-1">
                            {(['presente', 'ausente', 'justificado'] as AttendanceStatus[]).map(st => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  setSessionAttendance(prev => ({
                                    ...prev,
                                    [p.id]: { ...record, attendance: st }
                                  }));
                                }}
                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                  record.attendance === st
                                    ? st === 'presente' ? 'bg-emerald-600 text-white'
                                    : st === 'justificado' ? 'bg-blue-600 text-white'
                                    : 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Observación breve del niño en esta sesión (ej: gran entusiasmo en trepa)"
                          value={record.observation || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setSessionAttendance(prev => ({
                              ...prev,
                              [p.id]: { ...record, observation: val }
                            }));
                          }}
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notas Generales de la Sesión</label>
                <textarea
                  rows={2}
                  placeholder="Dinámica general del grupo, respuesta a los límites..."
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Guardar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

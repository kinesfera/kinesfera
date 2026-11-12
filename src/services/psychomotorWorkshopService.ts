import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  PsychomotorWorkshopGroup,
  PsychomotorParticipant,
  PsychomotorParticipantEvaluation,
  PsychomotorWorkshopSession,
  PsychomotorAreaKey,
  AggregatedWorkshopMarketingPayload
} from '../types';
import { 
  sanitizeForFirestore, 
  sanitizeDocId, 
  reportFirebaseErrorToUI, 
  handleFirestoreError, 
  OperationType 
} from './firebaseClinicalService';

const STORAGE_KEYS = {
  GROUPS: 'kinesfera_psychomotor_groups_v1',
  PARTICIPANTS: 'kinesfera_psychomotor_participants_v1',
  EVALS: 'kinesfera_psychomotor_evals_v1',
  SESSIONS: 'kinesfera_psychomotor_sessions_v1'
};

export const PSYCHOMOTOR_AREAS: { key: PsychomotorAreaKey; label: string; description: string }[] = [
  { 
    key: 'movimiento', 
    label: 'Movimiento', 
    description: 'Coordinación dinámica general, desplazamientos, saltos y exploración motriz.' 
  },
  { 
    key: 'posturaYTono', 
    label: 'Postura y tono', 
    description: 'Ajuste postural, equilibrio, modulación tónica y relajación muscular.' 
  },
  { 
    key: 'relacionConObjetos', 
    label: 'Relación con objetos', 
    description: 'Manipulación, prensión, construcción, uso simbólico y creativo del material.' 
  },
  { 
    key: 'espacioYTiempo', 
    label: 'Espacio y tiempo', 
    description: 'Orientación en la sala, límites espaciales, ritmos y nociones antes/después.' 
  },
  { 
    key: 'relacionConElOtro', 
    label: 'Relación con el otro', 
    description: 'Juego compartido, respeto de turnos, contacto visual y vínculo con pares y terapeuta.' 
  },
  { 
    key: 'lenguajeYComunicacion', 
    label: 'Lenguaje y comunicación', 
    description: 'Expresión verbal o gestual de deseos, pedidos de ayuda y comunicación funcional.' 
  },
  { 
    key: 'seguimientoDeInstrucciones', 
    label: 'Seguimiento de instrucciones', 
    description: 'Comprensión y ejecución de consignas lúdicas simples y complejas en el encuadre.' 
  }
];

export const INSTRUCTION_FOLLOWING_AUTOMATIC_GOAL = 
  'Lograr que siga instrucciones a través de la intervención kinésica y psicomotriz';

export const psychomotorWorkshopService = {
  // ==========================================================================
  // GRUPOS
  // ==========================================================================
  subscribeGroups(userId: string, onUpdate: (groups: PsychomotorWorkshopGroup[]) => void): Unsubscribe {
    const colPath = `users/${userId}/psychomotorGroups`;
    try {
      const colRef = collection(db, 'users', userId, 'psychomotorGroups');
      return onSnapshot(colRef, (snapshot) => {
        const groups: PsychomotorWorkshopGroup[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as PsychomotorWorkshopGroup;
          groups.push({ ...data, id: data.id || d.id });
        });
        // Ordenar por fecha de creación o inicio
        groups.sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime());
        localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
        onUpdate(groups);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  async saveGroup(userId: string, group: PsychomotorWorkshopGroup): Promise<PsychomotorWorkshopGroup> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar el grupo: sesión de Firebase no autenticada.');
      throw new Error('Usuario no autenticado.');
    }
    const gid = sanitizeDocId(group.id, 'group');
    const docPath = `users/${userId}/psychomotorGroups/${gid}`;
    const cleanGroup: PsychomotorWorkshopGroup = sanitizeForFirestore({
      ...group,
      id: gid,
      userId,
      updatedAt: new Date().toISOString()
    });

    try {
      const docRef = doc(db, 'users', userId, 'psychomotorGroups', gid);
      await setDoc(docRef, cleanGroup, { merge: true });
      return cleanGroup;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
      return cleanGroup;
    }
  },

  async deleteGroup(userId: string, groupId: string): Promise<void> {
    if (!userId) return;
    const gid = sanitizeDocId(groupId, 'group');
    const docPath = `users/${userId}/psychomotorGroups/${gid}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'psychomotorGroups', gid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // ==========================================================================
  // PARTICIPANTES
  // ==========================================================================
  subscribeParticipants(userId: string, onUpdate: (participants: PsychomotorParticipant[]) => void): Unsubscribe {
    const colPath = `users/${userId}/psychomotorParticipants`;
    try {
      const colRef = collection(db, 'users', userId, 'psychomotorParticipants');
      return onSnapshot(colRef, (snapshot) => {
        const list: PsychomotorParticipant[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as PsychomotorParticipant;
          list.push({ ...data, id: data.id || d.id });
        });
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(list));
        onUpdate(list);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  async saveParticipant(userId: string, participant: PsychomotorParticipant): Promise<PsychomotorParticipant> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar el participante: sesión no autenticada.');
      throw new Error('Usuario no autenticado.');
    }
    const pid = sanitizeDocId(participant.id, 'part');
    const docPath = `users/${userId}/psychomotorParticipants/${pid}`;
    const cleanPart: PsychomotorParticipant = sanitizeForFirestore({
      ...participant,
      id: pid,
      userId,
      updatedAt: new Date().toISOString()
    });

    try {
      const docRef = doc(db, 'users', userId, 'psychomotorParticipants', pid);
      await setDoc(docRef, cleanPart, { merge: true });
      return cleanPart;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
      return cleanPart;
    }
  },

  async deleteParticipant(userId: string, participantId: string): Promise<void> {
    if (!userId) return;
    const pid = sanitizeDocId(participantId, 'part');
    const docPath = `users/${userId}/psychomotorParticipants/${pid}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'psychomotorParticipants', pid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // ==========================================================================
  // EVALUACIONES (INICIAL / FINAL)
  // ==========================================================================
  subscribeEvaluations(userId: string, onUpdate: (evals: PsychomotorParticipantEvaluation[]) => void): Unsubscribe {
    const colPath = `users/${userId}/psychomotorEvals`;
    try {
      const colRef = collection(db, 'users', userId, 'psychomotorEvals');
      return onSnapshot(colRef, (snapshot) => {
        const list: PsychomotorParticipantEvaluation[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as PsychomotorParticipantEvaluation;
          list.push({ ...data, id: data.id || d.id });
        });
        localStorage.setItem(STORAGE_KEYS.EVALS, JSON.stringify(list));
        onUpdate(list);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  async saveEvaluation(userId: string, evaluation: PsychomotorParticipantEvaluation): Promise<PsychomotorParticipantEvaluation> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar la evaluación del taller: usuario no autenticado.');
      throw new Error('Usuario no autenticado.');
    }
    const eid = sanitizeDocId(evaluation.id, 'peval');
    const docPath = `users/${userId}/psychomotorEvals/${eid}`;

    // Revisar si el seguimiento de instrucciones requiere el objetivo automático
    const instructionScore = evaluation.scores?.seguimientoDeInstrucciones?.score || 4;
    const hasInstructionFollowLimitation = instructionScore <= 2;

    const recommendedGoals = [...(evaluation.recommendedGoals || [])];
    if (hasInstructionFollowLimitation && !recommendedGoals.includes(INSTRUCTION_FOLLOWING_AUTOMATIC_GOAL)) {
      recommendedGoals.push(INSTRUCTION_FOLLOWING_AUTOMATIC_GOAL);
    } else if (!hasInstructionFollowLimitation) {
      const idx = recommendedGoals.indexOf(INSTRUCTION_FOLLOWING_AUTOMATIC_GOAL);
      if (idx >= 0) recommendedGoals.splice(idx, 1);
    }

    const cleanEval: PsychomotorParticipantEvaluation = sanitizeForFirestore({
      ...evaluation,
      id: eid,
      userId,
      hasInstructionFollowLimitation,
      recommendedGoals,
      updatedAt: new Date().toISOString()
    });

    try {
      const docRef = doc(db, 'users', userId, 'psychomotorEvals', eid);
      await setDoc(docRef, cleanEval, { merge: true });
      return cleanEval;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
      return cleanEval;
    }
  },

  async deleteEvaluation(userId: string, evalId: string): Promise<void> {
    if (!userId) return;
    const eid = sanitizeDocId(evalId, 'peval');
    const docPath = `users/${userId}/psychomotorEvals/${eid}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'psychomotorEvals', eid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // ==========================================================================
  // SESIONES Y ASISTENCIA
  // ==========================================================================
  subscribeSessions(userId: string, onUpdate: (sessions: PsychomotorWorkshopSession[]) => void): Unsubscribe {
    const colPath = `users/${userId}/psychomotorSessions`;
    try {
      const colRef = collection(db, 'users', userId, 'psychomotorSessions');
      return onSnapshot(colRef, (snapshot) => {
        const list: PsychomotorWorkshopSession[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as PsychomotorWorkshopSession;
          list.push({ ...data, id: data.id || d.id });
        });
        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(list));
        onUpdate(list);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  async saveSession(userId: string, session: PsychomotorWorkshopSession): Promise<PsychomotorWorkshopSession> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar la sesión: usuario no autenticado.');
      throw new Error('Usuario no autenticado.');
    }
    const sid = sanitizeDocId(session.id, 'psess');
    const docPath = `users/${userId}/psychomotorSessions/${sid}`;
    const cleanSession: PsychomotorWorkshopSession = sanitizeForFirestore({
      ...session,
      id: sid,
      userId,
      updatedAt: new Date().toISOString()
    });

    try {
      const docRef = doc(db, 'users', userId, 'psychomotorSessions', sid);
      await setDoc(docRef, cleanSession, { merge: true });
      return cleanSession;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
      return cleanSession;
    }
  },

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    if (!userId) return;
    const sid = sanitizeDocId(sessionId, 'psess');
    const docPath = `users/${userId}/psychomotorSessions/${sid}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'psychomotorSessions', sid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // ==========================================================================
  // CONEXIÓN CON MARKETING (DATOS AGREGADOS Y ANÓNIMOS SOLAMENTE)
  // ==========================================================================
  async syncAggregatedMarketingInsights(
    userId: string,
    payload: AggregatedWorkshopMarketingPayload
  ): Promise<void> {
    if (!userId) return;
    const cleanPayload = sanitizeForFirestore(payload);
    try {
      // 1. Guardar en documento de insights de marketing en Firestore
      const insightRef = doc(db, 'users', userId, 'marketingPlan', `workshop_insight_${payload.groupId}`);
      await setDoc(insightRef, {
        ...cleanPayload,
        userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 2. Registrar en la lista de ideas/temas del plan de contenidos
      const currentPlanRef = doc(db, 'users', userId, 'marketingPlan', 'current_plan');
      const currentSnap = await getDoc(currentPlanRef);
      const existingData = currentSnap.exists() ? currentSnap.data() : {};
      const existingInsights = Array.isArray(existingData.workshopInsights) ? existingData.workshopInsights : [];
      const updatedInsights = [
        cleanPayload,
        ...existingInsights.filter((item: any) => item.groupId !== payload.groupId)
      ].slice(0, 10);

      await setDoc(currentPlanRef, {
        workshopInsights: updatedInsights,
        lastWorkshopSyncDate: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Error sincronizando métricas agregadas con Marketing:', err);
    }
  }
};

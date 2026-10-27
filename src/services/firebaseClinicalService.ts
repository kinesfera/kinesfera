import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  query,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  User, 
  PatientAnamnesis, 
  ClinicalEvaluations, 
  ProgressNote, 
  ComprehensiveReport 
} from '../types';
import { clinicalStorage } from '../utils/clinicalStorage';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function reportFirebaseErrorToUI(message: string, details?: unknown) {
  console.error('[Firebase Error]:', message, details || '');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kinesfera_firebase_error', {
        detail: {
          message,
          timestamp: new Date().toISOString()
        }
      })
    );
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: rawMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  reportFirebaseErrorToUI(`Error de Firebase (${operationType} en ${path || 'nube'}): ${rawMessage}`, errInfo);
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Recursively strips `undefined` values from objects/arrays because Firestore rejects `undefined`.
 */
export function sanitizeForFirestore<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }
  if (Array.isArray(input)) {
    return input
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof input === 'object' && !(input instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(input as Record<string, any>)) {
      if (val !== undefined) {
        cleaned[key] = sanitizeForFirestore(val);
      }
    }
    return cleaned as T;
  }
  return input;
}

/**
 * Ensures document ID is a valid non-empty string without slashes
 */
export function sanitizeDocId(rawId: unknown, fallbackPrefix = 'doc'): string {
  if (typeof rawId === 'string' && rawId.trim().length > 0) {
    return rawId.trim().replace(/\//g, '_');
  }
  if (typeof rawId === 'number') {
    return String(rawId);
  }
  return `${fallbackPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Result of local storage migration to Firestore
export interface MigrationResult {
  migrated: boolean;
  patientsCount: number;
  anamnesisCount: number;
  evaluationsCount: number;
  progressNotesCount: number;
  reportsCount: number;
  marketingCount: number;
  message: string;
}

export interface CloudImportResult {
  success: boolean;
  patientsCount: number;
  anamnesisCount: number;
  evaluationsCount: number;
  progressNotesCount: number;
  paymentsCount: number;
  reportsCount: number;
  backupId?: string;
  message: string;
}

const DEMO_PATIENT_IDS = new Set([
  'patient_mauro_mora',
  'patient_miranda_coromoto',
  'patient_wagner_vasquez',
  'patient_blaz_01'
]);

export const firebaseClinicalService = {
  /**
   * Migrate existing localStorage clinical data into Firestore under the authenticated user.
   * Never overwrites existing cloud data and never uploads default mock data if cloud already has records.
   */
  async migrateLocalStorageToFirestore(userId: string): Promise<MigrationResult> {
    if (!userId) {
      throw new Error('No se puede sincronizar sin un UID de usuario autenticado.');
    }
    const metaPath = `users/${userId}/migrationMeta/local_storage_migration`;
    try {
      // 1. Check if migration has already been executed OR if cloud already has patients
      const [metaSnap, existingPatientsSnap] = await Promise.all([
        getDoc(doc(db, 'users', userId, 'migrationMeta', 'local_storage_migration')),
        getDocs(collection(db, 'users', userId, 'patients'))
      ]);

      if (!existingPatientsSnap.empty) {
        // Cloud already has data! Never overwrite cloud data on startup.
        if (!metaSnap.exists()) {
          await setDoc(doc(db, 'users', userId, 'migrationMeta', 'local_storage_migration'), {
            completedAt: new Date().toISOString(),
            patientsCount: existingPatientsSnap.size,
            note: 'Cloud already contained patient records; skipped local overwrite.'
          }, { merge: true });
        }
        return {
          migrated: false,
          patientsCount: existingPatientsSnap.size,
          anamnesisCount: 0,
          evaluationsCount: 0,
          progressNotesCount: 0,
          reportsCount: 0,
          marketingCount: 0,
          message: 'Datos cargados directamente desde Firebase Firestore.'
        };
      }

      if (metaSnap.exists()) {
        const data = metaSnap.data();
        return {
          migrated: false,
          patientsCount: data.patientsCount || 0,
          anamnesisCount: data.anamnesisCount || 0,
          evaluationsCount: data.evaluationsCount || 0,
          progressNotesCount: data.progressNotesCount || 0,
          reportsCount: data.reportsCount || 0,
          marketingCount: data.marketingCount || 0,
          message: 'Tus datos clínicos ya se encontraban sincronizados con la nube de Firebase.'
        };
      }

      // 2. Read local data (excluding demo fallback records if user hasn't created real data)
      const localPatients = clinicalStorage.loadPatients().filter(p => p && p.id && !DEMO_PATIENT_IDS.has(p.id));
      const localAnamnesis = clinicalStorage.loadAnamnesis();
      const localEvaluations = clinicalStorage.loadEvaluations();
      const localNotes = clinicalStorage.loadProgressNotes().filter(n => n && n.id && n.id !== 'note_blaz_01');
      const localReports = clinicalStorage.loadReports();

      // 3. Save User Profile document with merge: true
      const userProfileRef = doc(db, 'users', userId);
      await setDoc(userProfileRef, sanitizeForFirestore({
        uid: userId,
        email: auth.currentUser?.email || '',
        displayName: auth.currentUser?.displayName || 'Profesional Tratante',
        role: 'Profesionales Clínicos',
        specialty: localStorage.getItem('kinesfera_clinician_specialty') || 'Kinesiología Pediátrica y Neurodesarrollo',
        institution: localStorage.getItem('kinesfera_clinician_institution') || 'Centro Kinésico Infantil Kinesfera Copiapó',
        rut: localStorage.getItem('kinesfera_clinician_rut') || '16.789.432-1',
        registry: localStorage.getItem('kinesfera_clinician_registry') || 'RNPI-582914',
        updatedAt: new Date().toISOString()
      }), { merge: true });

      let patientCounter = 0;
      let anamnesisCounter = 0;
      let evalCounter = 0;
      let notesCounter = 0;
      let reportsCounter = 0;

      if (localPatients.length > 0) {
        const patientBatch = writeBatch(db);
        for (const p of localPatients) {
          const pid = sanitizeDocId(p.id, 'patient');
          const patientRef = doc(db, 'users', userId, 'patients', pid);
          patientBatch.set(patientRef, sanitizeForFirestore({
            ...p,
            id: pid,
            role: 'Padre/Niño',
            userId,
            updatedAt: new Date().toISOString()
          }), { merge: true });
          patientCounter++;
        }
        await patientBatch.commit();

        const anamnesisBatch = writeBatch(db);
        for (const [patientId, aData] of Object.entries(localAnamnesis)) {
          if (patientId && aData && !DEMO_PATIENT_IDS.has(patientId)) {
            const pid = sanitizeDocId(patientId, 'patient');
            const aRef = doc(db, 'users', userId, 'anamnesis', pid);
            anamnesisBatch.set(aRef, sanitizeForFirestore({
              ...aData,
              userId,
              patientId: pid,
              updatedAt: new Date().toISOString()
            }), { merge: true });
            anamnesisCounter++;
          }
        }
        if (anamnesisCounter > 0) await anamnesisBatch.commit();

        const evalBatch = writeBatch(db);
        for (const [patientId, eData] of Object.entries(localEvaluations)) {
          if (patientId && eData && !DEMO_PATIENT_IDS.has(patientId)) {
            const pid = sanitizeDocId(patientId, 'patient');
            const eRef = doc(db, 'users', userId, 'evaluations', pid);
            evalBatch.set(eRef, sanitizeForFirestore({
              ...eData,
              userId,
              patientId: pid,
              updatedAt: new Date().toISOString()
            }), { merge: true });
            evalCounter++;
          }
        }
        if (evalCounter > 0) await evalBatch.commit();
      }

      if (localNotes.length > 0) {
        const notesBatch = writeBatch(db);
        for (const note of localNotes) {
          const nid = sanitizeDocId(note.id, 'pn');
          const noteRef = doc(db, 'users', userId, 'progressNotes', nid);
          notesBatch.set(noteRef, sanitizeForFirestore({
            ...note,
            id: nid,
            userId,
            paymentStatus: note.paymentStatus || (note.paymentMethod === 'Pendiente' ? 'Pendiente' : 'Pagado'),
            amount: note.amount || (note.paymentMethod === 'Fonasa' ? 14500 : note.paymentMethod === 'Particular' ? 30000 : 25000),
            paymentDate: note.paymentDate || note.date,
            updatedAt: new Date().toISOString()
          }), { merge: true });
          notesCounter++;
        }
        await notesBatch.commit();
      }

      if (localReports.length > 0) {
        const reportsBatch = writeBatch(db);
        for (const report of localReports) {
          if (report && report.id) {
            const rid = sanitizeDocId(report.id, 'rep');
            const rRef = doc(db, 'users', userId, 'reports', rid);
            reportsBatch.set(rRef, sanitizeForFirestore({
              ...report,
              id: rid,
              userId,
              updatedAt: new Date().toISOString()
            }), { merge: true });
            reportsCounter++;
          }
        }
        if (reportsCounter > 0) await reportsBatch.commit();
      }

      // Mark migration completed with merge: true
      await setDoc(doc(db, 'users', userId, 'migrationMeta', 'local_storage_migration'), {
        completedAt: new Date().toISOString(),
        patientsCount: patientCounter,
        anamnesisCount: anamnesisCounter,
        evaluationsCount: evalCounter,
        progressNotesCount: notesCounter,
        reportsCount: reportsCounter,
        marketingCount: 0
      }, { merge: true });

      return {
        migrated: patientCounter > 0 || notesCounter > 0,
        patientsCount: patientCounter,
        anamnesisCount: anamnesisCounter,
        evaluationsCount: evalCounter,
        progressNotesCount: notesCounter,
        reportsCount: reportsCounter,
        marketingCount: 0,
        message: patientCounter > 0
          ? `¡Sincronización completada! Se guardaron ${patientCounter} usuarios, ${evalCounter} evaluaciones y ${notesCounter} sesiones en Firebase Firestore.`
          : 'Conectado a Firebase Firestore.'
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, metaPath);
      return {
        migrated: false,
        patientsCount: 0,
        anamnesisCount: 0,
        evaluationsCount: 0,
        progressNotesCount: 0,
        reportsCount: 0,
        marketingCount: 0,
        message: 'Error al verificar migración inicial en Firestore.'
      };
    }
  },

  /**
   * Create an automatic backup of all current cloud data in Firestore and localStorage before any import
   */
  async createAutomaticCloudBackup(userId: string): Promise<string> {
    if (!userId) {
      throw new Error('Usuario no autenticado para crear respaldo previo.');
    }
    const backupId = `auto_backup_${Date.now()}`;
    const backupPath = `users/${userId}/backups/${backupId}`;
    try {
      const [
        patientsSnap,
        anamnesisSnap,
        evalsSnap,
        notesSnap,
        reportsSnap,
        spmSnap,
        commSnap,
        marketingSnap
      ] = await Promise.all([
        getDocs(collection(db, 'users', userId, 'patients')),
        getDocs(collection(db, 'users', userId, 'anamnesis')),
        getDocs(collection(db, 'users', userId, 'evaluations')),
        getDocs(collection(db, 'users', userId, 'progressNotes')),
        getDocs(collection(db, 'users', userId, 'reports')),
        getDocs(collection(db, 'users', userId, 'spmEvaluations')),
        getDocs(collection(db, 'users', userId, 'communicationSkills')),
        getDoc(doc(db, 'users', userId, 'marketingPlan', 'current_plan'))
      ]);

      const patients: User[] = [];
      patientsSnap.forEach(d => patients.push(d.data() as User));

      const anamnesis: Record<string, PatientAnamnesis> = {};
      anamnesisSnap.forEach(d => {
        const data = d.data() as PatientAnamnesis;
        anamnesis[data.patientId || d.id] = data;
      });

      const evaluations: Record<string, ClinicalEvaluations> = {};
      evalsSnap.forEach(d => {
        const data = d.data() as ClinicalEvaluations;
        evaluations[data.patientId || d.id] = data;
      });

      const progressNotes: ProgressNote[] = [];
      notesSnap.forEach(d => progressNotes.push(d.data() as ProgressNote));

      const reports: ComprehensiveReport[] = [];
      reportsSnap.forEach(d => reports.push(d.data() as ComprehensiveReport));

      const spmEvaluations: Record<string, any> = {};
      spmSnap.forEach(d => {
        const data = d.data();
        spmEvaluations[data.patientId || d.id] = data;
      });

      const communicationSkills: Record<string, any> = {};
      commSnap.forEach(d => {
        const data = d.data();
        communicationSkills[data.patientId || d.id] = data;
      });

      const snapshotPayload = sanitizeForFirestore({
        backupId,
        createdAt: new Date().toISOString(),
        reason: 'pre_import_automatic_backup',
        userId,
        counts: {
          patients: patients.length,
          anamnesis: Object.keys(anamnesis).length,
          evaluations: Object.keys(evaluations).length,
          progressNotes: progressNotes.length,
          reports: reports.length
        },
        patients,
        anamnesis,
        evaluations,
        progressNotes,
        reports,
        spmEvaluations,
        communicationSkills,
        marketingPlan: marketingSnap.exists() ? marketingSnap.data() : null
      });

      // Save in localStorage as immediate fallback
      try {
        localStorage.setItem('kinesfera_pre_import_cloud_backup', JSON.stringify(snapshotPayload));
      } catch (e) {
        console.warn('Could not cache pre-import backup in localStorage:', e);
      }

      // Save metadata & snapshot in Firestore under users/{uid}/backups/{backupId}
      await setDoc(doc(db, 'users', userId, 'backups', backupId), snapshotPayload, { merge: true });
      return backupId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, backupPath);
      return backupId;
    }
  },

  /**
   * Import full JSON backup directly into Firestore with setDoc/writeBatch({ merge: true }),
   * waiting for server confirmation before returning counts.
   */
  async importBackupToFirestore(userId: string, jsonString: string): Promise<CloudImportResult> {
    if (!userId) {
      const msg = 'Debes iniciar sesión con tu cuenta antes de importar datos a la nube.';
      reportFirebaseErrorToUI(msg);
      return {
        success: false,
        patientsCount: 0,
        anamnesisCount: 0,
        evaluationsCount: 0,
        progressNotesCount: 0,
        paymentsCount: 0,
        reportsCount: 0,
        message: msg
      };
    }

    let rawData: any;
    try {
      rawData = JSON.parse(jsonString);
    } catch (parseErr: any) {
      const msg = `El archivo seleccionado no es un JSON válido: ${parseErr?.message || 'Error de sintaxis'}`;
      reportFirebaseErrorToUI(msg, parseErr);
      return {
        success: false,
        patientsCount: 0,
        anamnesisCount: 0,
        evaluationsCount: 0,
        progressNotesCount: 0,
        paymentsCount: 0,
        reportsCount: 0,
        message: msg
      };
    }

    if (!rawData || typeof rawData !== 'object') {
      const msg = 'El archivo JSON no contiene un objeto de respaldo válido.';
      reportFirebaseErrorToUI(msg);
      return {
        success: false,
        patientsCount: 0,
        anamnesisCount: 0,
        evaluationsCount: 0,
        progressNotesCount: 0,
        paymentsCount: 0,
        reportsCount: 0,
        message: msg
      };
    }

    // Unwrap if nested under `data` or `backup`
    const data = (rawData.data && typeof rawData.data === 'object' && !Array.isArray(rawData.data) && (rawData.data.patients || rawData.data.usuarios))
      ? rawData.data
      : rawData;

    try {
      // 1. Automatic backup of current cloud data BEFORE importing
      const backupId = await this.createAutomaticCloudBackup(userId);

      // 2. Extract and normalize collections from JSON
      const STAFF_ROLES = new Set(['Profesionales Clínicos', 'Educadores', 'Administrador (Neuronexin)']);
      const rawPatientsList: any[] = Array.isArray(data.patients)
        ? data.patients
        : Array.isArray(data.usuarios)
        ? data.usuarios
        : Array.isArray(data.users)
        ? data.users.filter((u: any) => !STAFF_ROLES.has(u?.role))
        : (data.patients && typeof data.patients === 'object')
        ? Object.values(data.patients)
        : [];

      const rawAnamnesisMap: Record<string, any> = {};
      if (Array.isArray(data.anamnesis)) {
        data.anamnesis.forEach((item: any) => {
          const pid = item?.patientId || item?.userId || item?.id;
          if (pid) rawAnamnesisMap[String(pid)] = item;
        });
      } else if (data.anamnesis && typeof data.anamnesis === 'object') {
        Object.entries(data.anamnesis).forEach(([k, v]: [string, any]) => {
          if (v && typeof v === 'object') {
            const pid = v.patientId || k;
            rawAnamnesisMap[String(pid)] = v;
          }
        });
      }

      const rawEvaluationsMap: Record<string, any> = {};
      const evalSource = data.evaluations || data.evaluaciones || data.clinicalEvaluations;
      if (Array.isArray(evalSource)) {
        evalSource.forEach((item: any) => {
          const pid = item?.patientId || item?.id;
          if (pid) rawEvaluationsMap[String(pid)] = item;
        });
      } else if (evalSource && typeof evalSource === 'object') {
        Object.entries(evalSource).forEach(([k, v]: [string, any]) => {
          if (v && typeof v === 'object') {
            const pid = v.patientId || k;
            rawEvaluationsMap[String(pid)] = v;
          }
        });
      }

      const rawSpmMap: Record<string, any> = {};
      const spmSource = data.spmEvaluations || data.evaluacionesSpm;
      if (Array.isArray(spmSource)) {
        spmSource.forEach((item: any) => {
          const pid = item?.patientId || item?.id;
          if (pid) rawSpmMap[String(pid)] = item;
        });
      } else if (spmSource && typeof spmSource === 'object') {
        Object.entries(spmSource).forEach(([k, v]: [string, any]) => {
          if (v && typeof v === 'object') {
            const pid = v.patientId || k;
            rawSpmMap[String(pid)] = v;
          }
        });
      }

      const rawCommMap: Record<string, any> = {};
      const commSource = data.communicationSkills || data.communicationEvaluations || data.habilidadesComunicacion;
      if (Array.isArray(commSource)) {
        commSource.forEach((item: any) => {
          const pid = item?.patientId || item?.id;
          if (pid) rawCommMap[String(pid)] = item;
        });
      } else if (commSource && typeof commSource === 'object') {
        Object.entries(commSource).forEach(([k, v]: [string, any]) => {
          if (v && typeof v === 'object') {
            const pid = v.patientId || k;
            rawCommMap[String(pid)] = v;
          }
        });
      }

      const rawNotesList: any[] = Array.isArray(data.progressNotes)
        ? data.progressNotes
        : Array.isArray(data.notes)
        ? data.notes
        : Array.isArray(data.pagos)
        ? data.pagos
        : Array.isArray(data.payments)
        ? data.payments
        : (data.progressNotes && typeof data.progressNotes === 'object')
        ? Object.values(data.progressNotes)
        : [];

      const rawReportsList: any[] = Array.isArray(data.reports)
        ? data.reports
        : Array.isArray(data.comprehensiveReports)
        ? data.comprehensiveReports
        : Array.isArray(data.informes)
        ? data.informes
        : (data.reports && typeof data.reports === 'object')
        ? Object.values(data.reports)
        : [];

      // Prepare queued Firestore write operations (chunked by 400 to respect 500 batch limit)
      const operations: { ref: any; payload: any }[] = [];

      let patientsCount = 0;
      let anamnesisCount = 0;
      let evaluationsCount = 0;
      let spmCount = 0;
      let commCount = 0;
      let progressNotesCount = 0;
      let paymentsCount = 0;
      let reportsCount = 0;

      const normalizedPatients: User[] = [];
      for (const rawP of rawPatientsList) {
        if (!rawP || typeof rawP !== 'object') continue;
        const pid = sanitizeDocId(rawP.id || rawP.rut || `patient_${patientsCount + 1}`, 'patient');
        const firstName = rawP.firstName || rawP.nombre || rawP.name || 'Usuario';
        const lastName = rawP.lastName || rawP.apellido || '';
        const normalizedP: User = sanitizeForFirestore({
          ...rawP,
          id: pid,
          role: 'Padre/Niño',
          firstName,
          lastName,
          email: rawP.email || `${pid}@kinesfera.cl`,
          rut: rawP.rut || '',
          birthDate: rawP.birthDate || rawP.fechaNacimiento || '',
          gender: rawP.gender || 'Hombre',
          plan: rawP.plan || 'Premium',
          credits: typeof rawP.credits === 'number' ? rawP.credits : 60,
          userId,
          updatedAt: new Date().toISOString()
        });
        normalizedPatients.push(normalizedP);
        operations.push({
          ref: doc(db, 'users', userId, 'patients', pid),
          payload: normalizedP
        });
        patientsCount++;

        // If patient object had embedded anamnesis or evaluations, extract them too
        if (rawP.anamnesis && typeof rawP.anamnesis === 'object' && !rawAnamnesisMap[pid]) {
          rawAnamnesisMap[pid] = rawP.anamnesis;
        }
        if (rawP.evaluations && typeof rawP.evaluations === 'object' && !rawEvaluationsMap[pid]) {
          rawEvaluationsMap[pid] = rawP.evaluations;
        }
      }

      const normalizedAnamnesis: Record<string, PatientAnamnesis> = {};
      for (const [rawPid, aData] of Object.entries(rawAnamnesisMap)) {
        if (!aData || typeof aData !== 'object') continue;
        const pid = sanitizeDocId(aData.patientId || rawPid, 'patient');
        const cleanA = sanitizeForFirestore({
          ...aData,
          id: aData.id || `anam_${pid}`,
          patientId: pid,
          userId,
          updatedAt: new Date().toISOString()
        });
        normalizedAnamnesis[pid] = cleanA;
        operations.push({
          ref: doc(db, 'users', userId, 'anamnesis', pid),
          payload: cleanA
        });
        anamnesisCount++;
      }

      const normalizedEvaluations: Record<string, ClinicalEvaluations> = {};
      for (const [rawPid, eData] of Object.entries(rawEvaluationsMap)) {
        if (!eData || typeof eData !== 'object') continue;
        const pid = sanitizeDocId(eData.patientId || rawPid, 'patient');
        const cleanE = sanitizeForFirestore({
          ...eData,
          id: eData.id || `eval_${pid}`,
          patientId: pid,
          userId,
          updatedAt: new Date().toISOString()
        });
        normalizedEvaluations[pid] = cleanE;
        operations.push({
          ref: doc(db, 'users', userId, 'evaluations', pid),
          payload: cleanE
        });
        evaluationsCount++;
      }

      for (const [rawPid, sData] of Object.entries(rawSpmMap)) {
        if (!sData || typeof sData !== 'object') continue;
        const pid = sanitizeDocId(sData.patientId || rawPid, 'patient');
        const cleanSpm = sanitizeForFirestore({
          ...sData,
          patientId: pid,
          userId,
          updatedAt: new Date().toISOString()
        });
        operations.push({
          ref: doc(db, 'users', userId, 'spmEvaluations', pid),
          payload: cleanSpm
        });
        spmCount++;
      }

      for (const [rawPid, cData] of Object.entries(rawCommMap)) {
        if (!cData || typeof cData !== 'object') continue;
        const pid = sanitizeDocId(cData.patientId || rawPid, 'patient');
        const cleanComm = sanitizeForFirestore({
          ...cData,
          patientId: pid,
          userId,
          updatedAt: new Date().toISOString()
        });
        operations.push({
          ref: doc(db, 'users', userId, 'communicationSkills', pid),
          payload: cleanComm
        });
        commCount++;
      }

      const normalizedNotes: ProgressNote[] = [];
      for (const rawN of rawNotesList) {
        if (!rawN || typeof rawN !== 'object') continue;
        const nid = sanitizeDocId(rawN.id, 'pn');
        const paymentMethod = rawN.paymentMethod || 'Particular';
        const paymentStatus = rawN.paymentStatus || (paymentMethod === 'Pendiente' ? 'Pendiente' : 'Pagado');
        const amount = typeof rawN.amount === 'number'
          ? rawN.amount
          : (paymentMethod === 'Fonasa' ? 14500 : paymentMethod === 'Particular' ? 30000 : 25000);
        const cleanNote: ProgressNote = sanitizeForFirestore({
          ...rawN,
          id: nid,
          patientId: sanitizeDocId(rawN.patientId || 'general', 'patient'),
          date: rawN.date || new Date().toISOString().slice(0, 10),
          paymentMethod,
          paymentStatus,
          amount,
          paymentDate: rawN.paymentDate || rawN.date || new Date().toISOString().slice(0, 10),
          notes: rawN.notes || '',
          professionalName: rawN.professionalName || 'Klgo. Profesional Tratante',
          userId,
          updatedAt: new Date().toISOString()
        });
        normalizedNotes.push(cleanNote);
        operations.push({
          ref: doc(db, 'users', userId, 'progressNotes', nid),
          payload: cleanNote
        });
        progressNotesCount++;
        paymentsCount++;
      }

      const normalizedReports: ComprehensiveReport[] = [];
      for (const rawR of rawReportsList) {
        if (!rawR || typeof rawR !== 'object') continue;
        const rid = sanitizeDocId(rawR.id || `comprep_${rawR.patientId || reportsCount}`, 'comprep');
        const cleanReport: ComprehensiveReport = sanitizeForFirestore({
          ...rawR,
          id: rid,
          userId,
          updatedAt: new Date().toISOString()
        });
        normalizedReports.push(cleanReport);
        operations.push({
          ref: doc(db, 'users', userId, 'reports', rid),
          payload: cleanReport
        });
        reportsCount++;
      }

      // Marketing data if present in backup
      const marketingSource = data.marketingPlan || data.marketing;
      if (marketingSource && typeof marketingSource === 'object') {
        operations.push({
          ref: doc(db, 'users', userId, 'marketingPlan', 'current_plan'),
          payload: sanitizeForFirestore({
            ...marketingSource,
            userId,
            updatedAt: new Date().toISOString()
          })
        });
      } else if (data.referrals || data.inquiries || data.tasks || data.packages) {
        const mPayload: Record<string, any> = { userId, updatedAt: new Date().toISOString() };
        if (Array.isArray(data.referrals)) mPayload.referrals = data.referrals;
        if (Array.isArray(data.inquiries)) mPayload.inquiries = data.inquiries;
        if (Array.isArray(data.tasks)) mPayload.tasks = data.tasks;
        if (Array.isArray(data.packages)) mPayload.packages = data.packages;
        operations.push({
          ref: doc(db, 'users', userId, 'marketingPlan', 'current_plan'),
          payload: sanitizeForFirestore(mPayload)
        });
      }

      if (operations.length === 0) {
        const msg = 'El archivo JSON no contiene registros de pacientes, evaluaciones ni pagos para importar.';
        reportFirebaseErrorToUI(msg);
        return {
          success: false,
          patientsCount: 0,
          anamnesisCount: 0,
          evaluationsCount: 0,
          progressNotesCount: 0,
          paymentsCount: 0,
          reportsCount: 0,
          backupId,
          message: msg
        };
      }

      // 3. Commit all operations in batches of 400 with { merge: true } and AWAIT confirmation
      const CHUNK_SIZE = 400;
      for (let i = 0; i < operations.length; i += CHUNK_SIZE) {
        const chunk = operations.slice(i, i + CHUNK_SIZE);
        const batch = writeBatch(db);
        for (const op of chunk) {
          batch.set(op.ref, op.payload, { merge: true });
        }
        await batch.commit();
      }

      // 4. Update migration metadata so startup never overwrites imported data
      await setDoc(doc(db, 'users', userId, 'migrationMeta', 'local_storage_migration'), {
        lastImportAt: new Date().toISOString(),
        patientsCount,
        anamnesisCount,
        evaluationsCount,
        progressNotesCount,
        reportsCount,
        lastPreImportBackupId: backupId
      }, { merge: true });

      // 5. Update localStorage cache so offline cache matches Firestore
      if (normalizedPatients.length > 0) {
        const currentLocal = clinicalStorage.loadPatients();
        const mergedPatientsMap = new Map<string, User>();
        currentLocal.forEach(p => mergedPatientsMap.set(p.id, p));
        normalizedPatients.forEach(p => mergedPatientsMap.set(p.id, p));
        clinicalStorage.savePatients(Array.from(mergedPatientsMap.values()));
      }
      if (Object.keys(normalizedAnamnesis).length > 0) {
        const currentAnam = clinicalStorage.loadAnamnesis();
        clinicalStorage.saveAnamnesis({ ...currentAnam, ...normalizedAnamnesis });
      }
      if (Object.keys(normalizedEvaluations).length > 0) {
        const currentEval = clinicalStorage.loadEvaluations();
        clinicalStorage.saveEvaluations({ ...currentEval, ...normalizedEvaluations });
      }
      if (normalizedNotes.length > 0) {
        const currentNotes = clinicalStorage.loadProgressNotes();
        const notesMap = new Map<string, ProgressNote>();
        currentNotes.forEach(n => notesMap.set(n.id, n));
        normalizedNotes.forEach(n => notesMap.set(n.id, n));
        clinicalStorage.saveProgressNotes(Array.from(notesMap.values()));
      }
      if (normalizedReports.length > 0) {
        const currentReports = clinicalStorage.loadReports();
        const repMap = new Map<string, ComprehensiveReport>();
        currentReports.forEach(r => repMap.set(r.id, r));
        normalizedReports.forEach(r => repMap.set(r.id, r));
        clinicalStorage.saveReports(Array.from(repMap.values()));
      }

      const totalEvaluationsCount = evaluationsCount + anamnesisCount + spmCount + commCount;

      return {
        success: true,
        patientsCount,
        anamnesisCount,
        evaluationsCount: totalEvaluationsCount,
        progressNotesCount,
        paymentsCount,
        reportsCount,
        backupId,
        message: `Importación exitosa: ${patientsCount} usuarios/pacientes, ${totalEvaluationsCount} evaluaciones (${evaluationsCount} clínicas, ${anamnesisCount} anamnesis${spmCount > 0 ? `, ${spmCount} SPM` : ''}${commCount > 0 ? `, ${commCount} comunicación` : ''}) y ${paymentsCount} pagos/sesiones guardados y confirmados en Firebase Firestore.`
      };
    } catch (error: any) {
      const rawMsg = error instanceof Error ? error.message : String(error);
      reportFirebaseErrorToUI(`Error al guardar el respaldo importado en Firestore: ${rawMsg}`, error);
      return {
        success: false,
        patientsCount: 0,
        anamnesisCount: 0,
        evaluationsCount: 0,
        progressNotesCount: 0,
        paymentsCount: 0,
        reportsCount: 0,
        message: `Error de Firebase al importar: ${rawMsg}`
      };
    }
  },

  /**
   * Subscribe to Patients for this clinician
   */
  subscribePatients(userId: string, onUpdate: (patients: User[]) => void): Unsubscribe {
    const colPath = `users/${userId}/patients`;
    try {
      const colRef = collection(db, 'users', userId, 'patients');
      return onSnapshot(colRef, (snapshot) => {
        const patients: User[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as User;
          patients.push({
            ...data,
            id: data.id || d.id,
            role: 'Padre/Niño'
          });
        });
        onUpdate(patients);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  /**
   * Save or update a single patient in Firestore
   */
  async savePatient(userId: string, patient: User): Promise<void> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar el usuario: sesión de Firebase no autenticada.');
      return;
    }
    const pid = sanitizeDocId(patient.id, 'patient');
    const docPath = `users/${userId}/patients/${pid}`;
    try {
      const patientRef = doc(db, 'users', userId, 'patients', pid);
      await setDoc(patientRef, sanitizeForFirestore({
        ...patient,
        id: pid,
        role: 'Padre/Niño',
        userId,
        updatedAt: new Date().toISOString()
      }), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Subscribe to Anamnesis collection
   */
  subscribeAnamnesis(userId: string, onUpdate: (data: Record<string, PatientAnamnesis>) => void): Unsubscribe {
    const colPath = `users/${userId}/anamnesis`;
    try {
      const colRef = collection(db, 'users', userId, 'anamnesis');
      return onSnapshot(colRef, (snapshot) => {
        const result: Record<string, PatientAnamnesis> = {};
        snapshot.forEach((d) => {
          const item = d.data() as PatientAnamnesis;
          const pid = item?.patientId || d.id;
          if (pid) {
            result[pid] = { ...item, patientId: pid };
          }
        });
        onUpdate(result);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  /**
   * Save Anamnesis record
   */
  async saveAnamnesis(userId: string, patientId: string, anamnesis: PatientAnamnesis): Promise<void> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar la anamnesis: sesión de Firebase no autenticada.');
      return;
    }
    const pid = sanitizeDocId(patientId, 'patient');
    const docPath = `users/${userId}/anamnesis/${pid}`;
    try {
      const aRef = doc(db, 'users', userId, 'anamnesis', pid);
      await setDoc(aRef, sanitizeForFirestore({
        ...anamnesis,
        userId,
        patientId: pid,
        updatedAt: new Date().toISOString()
      }), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Subscribe to Clinical Evaluations
   */
  subscribeEvaluations(userId: string, onUpdate: (data: Record<string, ClinicalEvaluations>) => void): Unsubscribe {
    const colPath = `users/${userId}/evaluations`;
    try {
      const colRef = collection(db, 'users', userId, 'evaluations');
      return onSnapshot(colRef, (snapshot) => {
        const result: Record<string, ClinicalEvaluations> = {};
        snapshot.forEach((d) => {
          const item = d.data() as ClinicalEvaluations;
          const pid = item?.patientId || d.id;
          if (pid) {
            result[pid] = { ...item, patientId: pid };
          }
        });
        onUpdate(result);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  /**
   * Save Clinical Evaluations record
   */
  async saveEvaluations(userId: string, patientId: string, evaluations: ClinicalEvaluations): Promise<void> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar la evaluación: sesión de Firebase no autenticada.');
      return;
    }
    const pid = sanitizeDocId(patientId, 'patient');
    const docPath = `users/${userId}/evaluations/${pid}`;
    try {
      const eRef = doc(db, 'users', userId, 'evaluations', pid);
      await setDoc(eRef, sanitizeForFirestore({
        ...evaluations,
        userId,
        patientId: pid,
        updatedAt: new Date().toISOString()
      }), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Subscribe to Progress Notes (with payment tracking)
   */
  subscribeProgressNotes(userId: string, onUpdate: (notes: ProgressNote[]) => void): Unsubscribe {
    const colPath = `users/${userId}/progressNotes`;
    try {
      const colRef = collection(db, 'users', userId, 'progressNotes');
      return onSnapshot(colRef, (snapshot) => {
        const notes: ProgressNote[] = [];
        snapshot.forEach((d) => {
          const item = d.data() as ProgressNote;
          notes.push({ ...item, id: item.id || d.id });
        });
        // Sort descending by date
        notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        onUpdate(notes);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  /**
   * Save or update a progress note with payment tracking
   */
  async saveProgressNote(userId: string, note: ProgressNote): Promise<void> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar el registro de sesión/pago: sesión de Firebase no autenticada.');
      return;
    }
    const nid = sanitizeDocId(note.id, 'pn');
    const docPath = `users/${userId}/progressNotes/${nid}`;
    try {
      const noteRef = doc(db, 'users', userId, 'progressNotes', nid);
      await setDoc(noteRef, sanitizeForFirestore({
        ...note,
        id: nid,
        userId,
        paymentStatus: note.paymentStatus || (note.paymentMethod === 'Pendiente' ? 'Pendiente' : 'Pagado'),
        amount: note.amount || (note.paymentMethod === 'Fonasa' ? 14500 : note.paymentMethod === 'Particular' ? 30000 : 25000),
        paymentDate: note.paymentDate || note.date,
        updatedAt: new Date().toISOString()
      }), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Delete a progress note
   */
  async deleteProgressNote(userId: string, noteId: string): Promise<void> {
    if (!userId) return;
    const nid = sanitizeDocId(noteId, 'pn');
    const docPath = `users/${userId}/progressNotes/${nid}`;
    try {
      const noteRef = doc(db, 'users', userId, 'progressNotes', nid);
      await deleteDoc(noteRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  /**
   * Subscribe to Comprehensive Reports
   */
  subscribeReports(userId: string, onUpdate: (reports: ComprehensiveReport[]) => void): Unsubscribe {
    const colPath = `users/${userId}/reports`;
    try {
      const colRef = collection(db, 'users', userId, 'reports');
      return onSnapshot(colRef, (snapshot) => {
        const reports: ComprehensiveReport[] = [];
        snapshot.forEach((d) => {
          const item = d.data() as ComprehensiveReport;
          reports.push({ ...item, id: item.id || d.id });
        });
        onUpdate(reports);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, colPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      return () => {};
    }
  },

  /**
   * Save Comprehensive Report
   */
  async saveReport(userId: string, report: ComprehensiveReport): Promise<void> {
    if (!userId) {
      reportFirebaseErrorToUI('No se puede guardar el informe: sesión de Firebase no autenticada.');
      return;
    }
    const rid = sanitizeDocId(report.id, 'comprep');
    const docPath = `users/${userId}/reports/${rid}`;
    try {
      const rRef = doc(db, 'users', userId, 'reports', rid);
      await setDoc(rRef, sanitizeForFirestore({
        ...report,
        id: rid,
        userId,
        updatedAt: new Date().toISOString()
      }), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Subscribe to Marketing Plan and CRM data
   */
  subscribeMarketingHub(userId: string, onUpdate: (data: any) => void): Unsubscribe {
    const docPath = `users/${userId}/marketingPlan/current_plan`;
    try {
      const mRef = doc(db, 'users', userId, 'marketingPlan', 'current_plan');
      return onSnapshot(mRef, (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data());
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, docPath);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
      return () => {};
    }
  },

  /**
   * Save Marketing Hub and Monthly Plan data
   */
  async saveMarketingHub(userId: string, marketingData: any): Promise<void> {
    if (!userId) return;
    const docPath = `users/${userId}/marketingPlan/current_plan`;
    try {
      const mRef = doc(db, 'users', userId, 'marketingPlan', 'current_plan');
      await setDoc(mRef, sanitizeForFirestore({
        ...marketingData,
        userId,
        updatedAt: new Date().toISOString()
      }), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Export complete clinical backup as JSON download
   */
  async exportFullCloudBackup(
    userId: string, 
    localState: {
      patients: User[];
      anamnesis: Record<string, PatientAnamnesis>;
      evaluations: Record<string, ClinicalEvaluations>;
      progressNotes: ProgressNote[];
      reports: ComprehensiveReport[];
    }
  ): Promise<void> {
    try {
      const backupData = {
        exportDate: new Date().toISOString(),
        version: '2.1.0-firebase-cloud',
        userId,
        institution: 'Centro Kinésico Infantil Kinesfera Copiapó',
        patientsCount: localState.patients.length,
        notesCount: localState.progressNotes.length,
        patients: localState.patients,
        anamnesis: localState.anamnesis,
        evaluations: localState.evaluations,
        progressNotes: localState.progressNotes,
        reports: localState.reports
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `kinesfera_respaldo_completo_${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting backup JSON:', err);
      reportFirebaseErrorToUI('Error al exportar el respaldo JSON.', err);
    }
  }
};

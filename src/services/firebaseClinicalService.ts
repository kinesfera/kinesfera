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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  throw new Error(JSON.stringify(errInfo));
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

export const firebaseClinicalService = {
  /**
   * Migrate existing localStorage clinical data into Firestore under the authenticated user.
   * Runs safely, prevents duplicate writes, and leaves localStorage intact as offline backup.
   */
  async migrateLocalStorageToFirestore(userId: string): Promise<MigrationResult> {
    const metaPath = `users/${userId}/migrationMeta/local_storage_migration`;
    try {
      // 1. Check if migration has already been executed for this user
      const metaSnap = await getDoc(doc(db, 'users', userId, 'migrationMeta', 'local_storage_migration'));
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
          message: 'Tus datos clínicos ya se encontraban migrados y sincronizados con la nube de Firebase.'
        };
      }

      // 2. Read local data
      const localPatients = clinicalStorage.loadPatients();
      const localAnamnesis = clinicalStorage.loadAnamnesis();
      const localEvaluations = clinicalStorage.loadEvaluations();
      const localNotes = clinicalStorage.loadProgressNotes();
      const localReports = clinicalStorage.loadReports();

      // Marketing data
      let localReferrals: any[] = [];
      let localTasks: any[] = [];
      let localInquiries: any[] = [];
      let localPackages: any[] = [];
      try {
        const refStr = localStorage.getItem('kinesfera_referrals');
        if (refStr) localReferrals = JSON.parse(refStr);
        const taskStr = localStorage.getItem('kinesfera_business_tasks');
        if (taskStr) localTasks = JSON.parse(taskStr);
        const inqStr = localStorage.getItem('kinesfera_crm_inquiries');
        if (inqStr) localInquiries = JSON.parse(inqStr);
        const pkgStr = localStorage.getItem('kinesfera_session_packages');
        if (pkgStr) localPackages = JSON.parse(pkgStr);
      } catch (e) {
        console.warn('Error reading local marketing data:', e);
      }

      // 3. Save User Profile document
      const userProfileRef = doc(db, 'users', userId);
      await setDoc(userProfileRef, {
        uid: userId,
        email: auth.currentUser?.email || '',
        displayName: auth.currentUser?.displayName || 'Profesional Tratante',
        role: 'Profesionales Clínicos',
        specialty: localStorage.getItem('kinesfera_clinician_specialty') || 'Kinesiología Pediátrica y Neurodesarrollo',
        institution: localStorage.getItem('kinesfera_clinician_institution') || 'Centro Kinésico Infantil Kinesfera Copiapó',
        rut: localStorage.getItem('kinesfera_clinician_rut') || '16.789.432-1',
        registry: localStorage.getItem('kinesfera_clinician_registry') || 'RNPI-582914',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 4. Upload Patients (deduplicated by ID)
      const patientBatch = writeBatch(db);
      let patientCounter = 0;
      for (const p of localPatients) {
        if (p && p.id) {
          const patientRef = doc(db, 'users', userId, 'patients', p.id);
          patientBatch.set(patientRef, {
            ...p,
            userId,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          patientCounter++;
        }
      }
      if (patientCounter > 0) {
        await patientBatch.commit();
      }

      // 5. Upload Anamnesis
      const anamnesisBatch = writeBatch(db);
      let anamnesisCounter = 0;
      for (const [patientId, aData] of Object.entries(localAnamnesis)) {
        if (patientId && aData) {
          const aRef = doc(db, 'users', userId, 'anamnesis', patientId);
          anamnesisBatch.set(aRef, {
            ...aData,
            userId,
            patientId,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          anamnesisCounter++;
        }
      }
      if (anamnesisCounter > 0) {
        await anamnesisBatch.commit();
      }

      // 6. Upload Evaluations
      const evalBatch = writeBatch(db);
      let evalCounter = 0;
      for (const [patientId, eData] of Object.entries(localEvaluations)) {
        if (patientId && eData) {
          const eRef = doc(db, 'users', userId, 'evaluations', patientId);
          evalBatch.set(eRef, {
            ...eData,
            userId,
            patientId,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          evalCounter++;
        }
      }
      if (evalCounter > 0) {
        await evalBatch.commit();
      }

      // 7. Upload Progress Notes
      const notesBatch = writeBatch(db);
      let notesCounter = 0;
      for (const note of localNotes) {
        if (note && note.id) {
          const noteRef = doc(db, 'users', userId, 'progressNotes', note.id);
          notesBatch.set(noteRef, {
            ...note,
            userId,
            paymentStatus: note.paymentStatus || (note.paymentMethod === 'Pendiente' ? 'Pendiente' : 'Pagado'),
            amount: note.amount || (note.paymentMethod === 'Fonasa' ? 14500 : note.paymentMethod === 'Particular' ? 30000 : 25000),
            paymentDate: note.paymentDate || note.date,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          notesCounter++;
        }
      }
      if (notesCounter > 0) {
        await notesBatch.commit();
      }

      // 8. Upload Reports
      const reportsBatch = writeBatch(db);
      let reportsCounter = 0;
      for (const report of localReports) {
        if (report && report.id) {
          const rRef = doc(db, 'users', userId, 'reports', report.id);
          reportsBatch.set(rRef, {
            ...report,
            userId,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          reportsCounter++;
        }
      }
      if (reportsCounter > 0) {
        await reportsBatch.commit();
      }

      // 9. Upload Marketing Hub Data
      let marketingCounter = 0;
      const marketingRef = doc(db, 'users', userId, 'marketingPlan', 'current_plan');
      await setDoc(marketingRef, {
        userId,
        referrals: localReferrals,
        tasks: localTasks,
        inquiries: localInquiries,
        packages: localPackages,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      marketingCounter = localReferrals.length + localTasks.length + localInquiries.length;

      // 10. Mark migration completed
      await setDoc(doc(db, 'users', userId, 'migrationMeta', 'local_storage_migration'), {
        completedAt: new Date().toISOString(),
        patientsCount: patientCounter,
        anamnesisCount: anamnesisCounter,
        evaluationsCount: evalCounter,
        progressNotesCount: notesCounter,
        reportsCount: reportsCounter,
        marketingCount: marketingCounter
      });

      return {
        migrated: true,
        patientsCount: patientCounter,
        anamnesisCount: anamnesisCounter,
        evaluationsCount: evalCounter,
        progressNotesCount: notesCounter,
        reportsCount: reportsCounter,
        marketingCount: marketingCounter,
        message: `¡Migración completada con éxito! Se subieron ${patientCounter} pacientes, ${anamnesisCounter} anamnesis, ${evalCounter} evaluaciones clínicas y ${notesCounter} notas de progreso a Firebase Firestore.`
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
        message: 'Ocurrió un error al migrar los datos a Firestore.'
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
          patients.push(d.data() as User);
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
    const docPath = `users/${userId}/patients/${patient.id}`;
    try {
      const patientRef = doc(db, 'users', userId, 'patients', patient.id);
      await setDoc(patientRef, {
        ...patient,
        userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
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
          if (item && item.patientId) {
            result[item.patientId] = item;
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
    const docPath = `users/${userId}/anamnesis/${patientId}`;
    try {
      const aRef = doc(db, 'users', userId, 'anamnesis', patientId);
      await setDoc(aRef, {
        ...anamnesis,
        userId,
        patientId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
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
          if (item && item.patientId) {
            result[item.patientId] = item;
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
    const docPath = `users/${userId}/evaluations/${patientId}`;
    try {
      const eRef = doc(db, 'users', userId, 'evaluations', patientId);
      await setDoc(eRef, {
        ...evaluations,
        userId,
        patientId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
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
          notes.push(d.data() as ProgressNote);
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
    const docPath = `users/${userId}/progressNotes/${note.id}`;
    try {
      const noteRef = doc(db, 'users', userId, 'progressNotes', note.id);
      await setDoc(noteRef, {
        ...note,
        userId,
        paymentStatus: note.paymentStatus || (note.paymentMethod === 'Pendiente' ? 'Pendiente' : 'Pagado'),
        amount: note.amount || (note.paymentMethod === 'Fonasa' ? 14500 : note.paymentMethod === 'Particular' ? 30000 : 25000),
        paymentDate: note.paymentDate || note.date,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Delete a progress note
   */
  async deleteProgressNote(userId: string, noteId: string): Promise<void> {
    const docPath = `users/${userId}/progressNotes/${noteId}`;
    try {
      const noteRef = doc(db, 'users', userId, 'progressNotes', noteId);
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
          reports.push(d.data() as ComprehensiveReport);
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
    const docPath = `users/${userId}/reports/${report.id}`;
    try {
      const rRef = doc(db, 'users', userId, 'reports', report.id);
      await setDoc(rRef, {
        ...report,
        userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
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
    const docPath = `users/${userId}/marketingPlan/current_plan`;
    try {
      const mRef = doc(db, 'users', userId, 'marketingPlan', 'current_plan');
      await setDoc(mRef, {
        ...marketingData,
        userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
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
        version: '2.0.0-firebase-cloud',
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
    }
  }
};

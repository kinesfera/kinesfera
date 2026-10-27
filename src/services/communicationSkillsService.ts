import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  PatientCommunicationEvaluation,
  CommunicationChecklistItemEvaluation
} from '../types';
import { libraryStorageService } from './libraryStorageService';
import { sanitizeForFirestore, sanitizeDocId, reportFirebaseErrorToUI } from './firebaseClinicalService';

const LOCAL_STORAGE_COMM_KEY = 'kinesfera_communication_evaluations_v1';

export const INSTRUCTION_FOLLOWING_GOAL = 'Lograr que el paciente siga instrucciones a través de la intervención kinésica y psicomotriz';

// Default initial checklist items based on the official CAA checklist
export function generateDefaultChecklistItems(): CommunicationChecklistItemEvaluation[] {
  return [
    {
      id: 'comm_1_reforzadores',
      skillName: '1. Pedir Reforzadores (comida, juguetes, actividades)',
      statusInitial: 'en_proceso',
      statusFinal: 'si',
      observations: 'Pide juguetes mediante señalización y gestos en sesión.',
      isInstructionFollowing: false
    },
    {
      id: 'comm_2_ayuda',
      skillName: '2. Pedir Ayuda',
      statusInitial: 'en_proceso',
      statusFinal: 'si',
      observations: 'Toma la mano del adulto cuando no alcanza un objeto.',
      isInstructionFollowing: false
    },
    {
      id: 'comm_3_descansos',
      skillName: '3. Pedir Descansos / Pausas',
      statusInitial: 'no',
      statusFinal: 'en_proceso',
      observations: 'Requiere anticipación con tarjeta de pausa.',
      isInstructionFollowing: false
    },
    {
      id: 'comm_4_rechazo',
      skillName: '4. Rechazar de forma apropiada ("No")',
      statusInitial: 'en_proceso',
      statusFinal: 'si',
      observations: 'Empuja suavemente el objeto o dice "no" sin desregulación.',
      isInstructionFollowing: false
    },
    {
      id: 'comm_5_aceptacion',
      skillName: '5. Afirmar / Aceptar apropiadamente ("Sí")',
      statusInitial: 'si',
      statusFinal: 'si',
      observations: 'Asiente con la cabeza y sonríe ante propuestas lúdicas.',
      isInstructionFollowing: false
    },
    {
      id: 'comm_6_espera',
      skillName: '6. Responder a esperar (tolerancia a la espera)',
      statusInitial: 'no',
      statusFinal: 'en_proceso',
      observations: 'Tolera espera con apoyo de conteo regresivo con los dedos.',
      isInstructionFollowing: false
    },
    {
      id: 'comm_7_transiciones',
      skillName: '7. Transición entre actividades',
      statusInitial: 'en_proceso',
      statusFinal: 'si',
      observations: 'Acepta pasar de la colchoneta a la mesa con aviso previo.',
      isInstructionFollowing: false
    },
    {
      id: 'comm_8_instrucciones',
      skillName: '8. Seguir instrucciones (simples y complejas)',
      statusInitial: 'no',
      statusFinal: 'en_proceso',
      observations: 'Presenta dificultad para seguir instrucciones complejas de más de 2 pasos sin modelo visual.',
      isInstructionFollowing: true
    },
    {
      id: 'comm_9_horario_visual',
      skillName: '9. Seguir horario visual y rutinas estructuradas',
      statusInitial: 'en_proceso',
      statusFinal: 'si',
      observations: 'Utiliza el tablero de pictogramas con buen seguimiento.',
      isInstructionFollowing: false
    }
  ];
}

export const DEFAULT_COMM_EVALUATIONS: Record<string, PatientCommunicationEvaluation> = {
  patient_wagner_vasquez: {
    id: 'comm_eval_wagner',
    patientId: 'patient_wagner_vasquez',
    sourceFileId: 'lib_checklist_comunicacion_critica',
    sourceFileName: 'Lista de Control de Habilidades de Comunicación Críticas y Funcionales',
    updatedAt: '2024-09-24',
    evaluatorName: 'Klgo. Aldo Olivares Araya',
    hasInstructionFollowLimitation: true, // No sigue instrucciones complejas sin apoyo visual
    items: [
      {
        id: 'comm_1_reforzadores',
        skillName: '1. Pedir Reforzadores (comida, juguetes, actividades)',
        statusInitial: 'si',
        statusFinal: 'si',
        observations: 'Comunica preferencias claramente mediante lenguaje verbal y señalamiento.',
        isInstructionFollowing: false
      },
      {
        id: 'comm_2_ayuda',
        skillName: '2. Pedir Ayuda',
        statusInitial: 'en_proceso',
        statusFinal: 'si',
        observations: 'Pide ayuda cuando la tarea motora supera su nivel de tolerancia.',
        isInstructionFollowing: false
      },
      {
        id: 'comm_3_descansos',
        skillName: '3. Pedir Descansos / Pausas',
        statusInitial: 'en_proceso',
        statusFinal: 'si',
        observations: 'Identifica fatiga motriz y solicita microdescansos.',
        isInstructionFollowing: false
      },
      {
        id: 'comm_4_rechazo',
        skillName: '4. Rechazar de forma apropiada ("No")',
        statusInitial: 'si',
        statusFinal: 'si',
        observations: 'Rechaza estímulos aversivos verbalmente.',
        isInstructionFollowing: false
      },
      {
        id: 'comm_5_aceptacion',
        skillName: '5. Afirmar / Aceptar apropiadamente ("Sí")',
        statusInitial: 'si',
        statusFinal: 'si',
        observations: 'Confirma aceptación de consignas con entusiasmo.',
        isInstructionFollowing: false
      },
      {
        id: 'comm_6_espera',
        skillName: '6. Responder a esperar (tolerancia a la espera)',
        statusInitial: 'en_proceso',
        statusFinal: 'si',
        observations: 'Ha mejorado sustancialmente la tolerancia al turno en juegos compartidos.',
        isInstructionFollowing: false
      },
      {
        id: 'comm_7_transiciones',
        skillName: '7. Transición entre actividades',
        statusInitial: 'en_proceso',
        statusFinal: 'si',
        observations: 'Realiza transiciones fluidas con apoyo de agenda de sesión.',
        isInstructionFollowing: false
      },
      {
        id: 'comm_8_instrucciones',
        skillName: '8. Seguir instrucciones (simples y complejas)',
        statusInitial: 'no',
        statusFinal: 'en_proceso',
        observations: 'Requiere repetición de 3 a 5 veces ante instrucciones verbales complejas; necesita mediación kinésica.',
        isInstructionFollowing: true
      },
      {
        id: 'comm_9_horario_visual',
        skillName: '9. Seguir horario visual y rutinas estructuradas',
        statusInitial: 'si',
        statusFinal: 'si',
        observations: 'Autónomo en el chequeo de la secuencia visual de la sesión.',
        isInstructionFollowing: false
      }
    ]
  }
};

export const communicationSkillsService = {
  /**
   * Load communication evaluations from Firestore (single source of truth when authenticated)
   */
  async loadCommunicationEvaluations(userId?: string): Promise<Record<string, PatientCommunicationEvaluation>> {
    try {
      const currentUid = userId || auth.currentUser?.uid;
      if (currentUid) {
        const colRef = collection(db, 'users', currentUid, 'communicationSkills');
        const snap = await getDocs(colRef);
        const result: Record<string, PatientCommunicationEvaluation> = {};
        snap.forEach(docSnap => {
          const data = docSnap.data() as PatientCommunicationEvaluation;
          const pid = data.patientId || docSnap.id;
          result[pid] = { ...data, patientId: pid };
        });
        localStorage.setItem(LOCAL_STORAGE_COMM_KEY, JSON.stringify(result));
        return result;
      }

      const cached = localStorage.getItem(LOCAL_STORAGE_COMM_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }

      return {};
    } catch (err) {
      reportFirebaseErrorToUI('Error al cargar evaluaciones de comunicación desde Firebase Firestore.', err);
      return {};
    }
  },

  /**
   * Save communication evaluation for patient using setDoc(..., { merge: true })
   */
  async saveCommunicationEvaluation(
    evaluation: PatientCommunicationEvaluation,
    userId?: string
  ): Promise<PatientCommunicationEvaluation> {
    const currentUid = userId || auth.currentUser?.uid;
    if (!currentUid) {
      reportFirebaseErrorToUI('No se puede guardar la evaluación de comunicación: usuario no autenticado.');
      throw new Error('Usuario no autenticado en Firebase.');
    }

    const pid = sanitizeDocId(evaluation.patientId, 'patient');
    const instructionItem = evaluation.items.find(i => i.isInstructionFollowing || i.skillName.toLowerCase().includes('instrucc'));
    const limitation = instructionItem 
      ? (instructionItem.statusInitial === 'no' || instructionItem.statusFinal === 'no')
      : evaluation.hasInstructionFollowLimitation;

    const finalEval: PatientCommunicationEvaluation = sanitizeForFirestore({
      ...evaluation,
      patientId: pid,
      hasInstructionFollowLimitation: limitation
    });

    try {
      const docRef = doc(db, 'users', currentUid, 'communicationSkills', pid);
      await setDoc(docRef, {
        ...finalEval,
        userId: currentUid,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (fsErr) {
      reportFirebaseErrorToUI('Error al guardar evaluación de comunicación en Firebase Firestore.', fsErr);
      throw fsErr;
    }

    const current = await this.loadCommunicationEvaluations(currentUid);
    const updated = {
      ...current,
      [pid]: finalEval
    };
    localStorage.setItem(LOCAL_STORAGE_COMM_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kinesfera_communication_updated', { detail: finalEval }));
    }

    return finalEval;
  },

  /**
   * Determine if the automatic instruction-following goal should be added
   */
  shouldAddInstructionFollowingGoal(evaluation?: PatientCommunicationEvaluation | null): boolean {
    if (!evaluation) return false;
    if (evaluation.hasInstructionFollowLimitation) return true;
    const item = evaluation.items.find(i => i.isInstructionFollowing || i.skillName.toLowerCase().includes('instrucc'));
    if (item && (item.statusInitial === 'no' || item.statusFinal === 'no')) {
      return true;
    }
    return false;
  }
};

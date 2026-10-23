import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  SPMEvaluationRecord, 
  SPMAgeCategory, 
  SPMScaleScore 
} from '../types';

const LOCAL_STORAGE_SPM_KEY = 'kinesfera_spm_evaluations_v1';

/**
 * Determine SPM-2 Age Category based on age in months
 */
export function determineSPMFormByAge(ageMonths: number): {
  category: SPMAgeCategory;
  formTitle: string;
  recommendedEvaluator: string;
} {
  if (ageMonths < 10) {
    return {
      category: 'bebes_4_9',
      formTitle: 'SPM-2 Bebés (4 a 9 meses)',
      recommendedEvaluator: 'Padres / Cuidador principal'
    };
  } else if (ageMonths <= 30) {
    return {
      category: 'toddler_10_30',
      formTitle: 'SPM-2 Niños Pequeños (10 a 30 meses)',
      recommendedEvaluator: 'Padres / Cuidador principal'
    };
  } else if (ageMonths <= 60) {
    return {
      category: 'preescolar_2_5',
      formTitle: 'SPM-Preescolar (2 a 5 años)',
      recommendedEvaluator: 'Padres (Hogar) o Educadora (Jardín)'
    };
  } else if (ageMonths <= 144) {
    return {
      category: 'escolar_5_12',
      formTitle: 'SPM Escolar (5 a 12 años)',
      recommendedEvaluator: 'Padres (Hogar) o Profesor Jefe / PIE (Escuela)'
    };
  } else {
    return {
      category: 'adolescente_adulto',
      formTitle: 'SPM-2 Adolescente / Adulto',
      recommendedEvaluator: 'Autoinforme o Padres'
    };
  }
}

/**
 * Convert raw score to T-score and clinical range using SPM-2 normative curves
 */
export function calculateSPMScaleScore(raw: number, maxRaw: number = 40): SPMScaleScore {
  // Approximate normative T-score calculation (Mean 50, SD 10, baseline typical 10-18 raw)
  const minRaw = 10;
  const clampedRaw = Math.max(minRaw, Math.min(maxRaw, raw));
  
  // Linear interpolation calibrated to SPM-2 conversion tables
  // Raw 10-14 -> T ~40-48
  // Raw 15-20 -> T ~49-59 (Típico)
  // Raw 21-25 -> T ~60-66 (Dificultades Moderadas)
  // Raw 26-40 -> T ~67-80 (Dificultades Severas)
  let tScore = 40;
  if (clampedRaw <= 14) {
    tScore = 40 + Math.round(((clampedRaw - 10) / 4) * 8);
  } else if (clampedRaw <= 20) {
    tScore = 49 + Math.round(((clampedRaw - 15) / 5) * 10);
  } else if (clampedRaw <= 26) {
    tScore = 60 + Math.round(((clampedRaw - 21) / 5) * 9);
  } else {
    tScore = 70 + Math.round(((clampedRaw - 27) / 13) * 10);
  }

  tScore = Math.min(80, Math.max(40, tScore));

  let range: SPMScaleScore['range'] = 'Típico (40-59)';
  let interpretation = 'Respuesta típica y adecuada a los estímulos de la vida diaria.';

  if (tScore >= 70) {
    range = 'Dificultades Severas (≥ 70)';
    interpretation = 'Dificultades severas consistentes que interfieren significativamente en el desempeño y participación.';
  } else if (tScore >= 60) {
    range = 'Dificultades Moderadas (60-69)';
    interpretation = 'Dificultades moderadas en el procesamiento y modulación de estímulos; requiere apoyos y adaptaciones.';
  }

  return {
    raw: clampedRaw,
    tScore,
    range,
    interpretation
  };
}

// Pre-seeded evaluation for Wagner (Escolar 5-12) and Miranda
export const DEFAULT_SPM_EVALUATIONS: Record<string, SPMEvaluationRecord> = {
  patient_wagner_vasquez: {
    id: 'spm_eval_wagner_01',
    patientId: 'patient_wagner_vasquez',
    patientName: 'Wagner Amir Vásquez Venegas',
    ageMonths: 116, // 9 años y 8 meses
    ageCategory: 'escolar_5_12',
    formTitle: 'SPM Escolar (5 a 12 años)',
    formContext: 'Hogar / Padres',
    evaluationDate: '2024-09-24',
    evaluatorName: 'Familia de Wagner',
    evaluatorRole: 'Padres / Hogar',
    includeInReport: true,
    notes: 'Completado por los padres. Se observan reactividades elevadas al tacto y conciencia corporal.',
    responses: {},
    scales: {
      vis: { raw: 16, tScore: 61, range: 'Dificultades Moderadas (60-69)', interpretation: 'Dificultades moderadas de filtrado visual.' },
      hea: { raw: 14, tScore: 50, range: 'Típico (40-59)', interpretation: 'Respuesta auditiva típica.' },
      tou: { raw: 22, tScore: 63, range: 'Dificultades Moderadas (60-69)', interpretation: 'Reactividad táctil con rechazo a texturas.' },
      ts: { raw: 13, tScore: 48, range: 'Típico (40-59)', interpretation: 'Rango típico en gusto y olfato.' },
      bod: { raw: 25, tScore: 67, range: 'Dificultades Moderadas (60-69)', interpretation: 'Desafíos en graduación de fuerza y propiocepción.' },
      bal: { raw: 21, tScore: 62, range: 'Dificultades Moderadas (60-69)', interpretation: 'Inseguridad en equilibrio dinámico.' },
      st: { raw: 98, tScore: 62, range: 'Dificultades Moderadas (60-69)', interpretation: 'Puntuación total que refleja necesidad de apoyo.' },
      pln: { raw: 21, tScore: 61, range: 'Dificultades Moderadas (60-69)', interpretation: 'Desafíos leves en planificación de secuencias motoras.' },
      soc: { raw: 22, tScore: 62, range: 'Dificultades Moderadas (60-69)', interpretation: 'Interacción social que requiere mediación del adulto.' }
    }
  },
  patient_mauro_mora: {
    id: 'spm_eval_mauro_01',
    patientId: 'patient_mauro_mora',
    patientName: 'Mauro Valentino Mora Cofre',
    ageMonths: 4,
    ageCategory: 'bebes_4_9',
    formTitle: 'SPM-2 Bebés (4 a 9 meses)',
    formContext: 'Hogar / Padres',
    evaluationDate: '2024-06-06',
    evaluatorName: 'Padres de Mauro',
    evaluatorRole: 'Padres / Cuidadores',
    includeInReport: true,
    notes: 'Lactante de 4 meses evaluado con SPM-2 Bebés. Destaca adecuado tono y vínculo con ligera preferencia postural derecha.',
    responses: {},
    scales: {
      vis: { raw: 14, tScore: 48, range: 'Típico (40-59)', interpretation: 'Seguimiento visual simétrico adecuado.' },
      hea: { raw: 12, tScore: 47, range: 'Típico (40-59)', interpretation: 'Respuesta auditiva a la voz materna normal.' },
      tou: { raw: 13, tScore: 49, range: 'Típico (40-59)', interpretation: 'Acepta contacto corporal y masoterapia.' },
      ts: { raw: 11, tScore: 46, range: 'Típico (40-59)', interpretation: 'Buena succión y deglución.' },
      bod: { raw: 15, tScore: 52, range: 'Típico (40-59)', interpretation: 'Conciencia corporal acorde al trimestre.' },
      bal: { raw: 18, tScore: 55, range: 'Típico (40-59)', interpretation: 'Control cefálico en proceso de consolidación.' },
      st: { raw: 83, tScore: 50, range: 'Típico (40-59)', interpretation: 'Desempeño global armónico.' },
      pln: { raw: 14, tScore: 48, range: 'Típico (40-59)', interpretation: 'Intentos tempranos de alcance y exploración.' },
      soc: { raw: 12, tScore: 45, range: 'Típico (40-59)', interpretation: 'Excelente sonrisa social y contacto visual.' }
    }
  }
};

export const spmEvaluationService = {
  /**
   * Load SPM evaluations from Firestore or localStorage
   */
  async loadSPMEvaluations(userId?: string): Promise<Record<string, SPMEvaluationRecord>> {
    try {
      const currentUid = userId || auth.currentUser?.uid;
      if (currentUid) {
        const colRef = collection(db, 'users', currentUid, 'spmEvaluations');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const result: Record<string, SPMEvaluationRecord> = {};
          snap.forEach(docSnap => {
            const data = docSnap.data() as SPMEvaluationRecord;
            result[data.patientId] = data;
          });
          localStorage.setItem(LOCAL_STORAGE_SPM_KEY, JSON.stringify(result));
          return result;
        }
      }

      // Check localStorage
      const cached = localStorage.getItem(LOCAL_STORAGE_SPM_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_SPM_EVALUATIONS, ...parsed };
        }
      }

      localStorage.setItem(LOCAL_STORAGE_SPM_KEY, JSON.stringify(DEFAULT_SPM_EVALUATIONS));
      return DEFAULT_SPM_EVALUATIONS;
    } catch {
      return DEFAULT_SPM_EVALUATIONS;
    }
  },

  /**
   * Save an SPM evaluation for a patient
   */
  async saveSPMEvaluation(
    evaluation: SPMEvaluationRecord,
    userId?: string
  ): Promise<SPMEvaluationRecord> {
    const currentUid = userId || auth.currentUser?.uid || 'guest_user';

    // 1. Save in Firestore
    try {
      if (currentUid && currentUid !== 'guest_user') {
        const docRef = doc(db, 'users', currentUid, 'spmEvaluations', evaluation.patientId);
        await setDoc(docRef, evaluation);
      }
    } catch (fsErr) {
      console.warn('Could not save SPM evaluation to Firestore, caching locally:', fsErr);
    }

    // 2. Cache in localStorage
    const current = await this.loadSPMEvaluations(currentUid);
    const updated = {
      ...current,
      [evaluation.patientId]: evaluation
    };
    localStorage.setItem(LOCAL_STORAGE_SPM_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kinesfera_spm_updated', { detail: evaluation }));
    }

    return evaluation;
  },

  /**
   * Delete an SPM evaluation
   */
  async deleteSPMEvaluation(patientId: string, userId?: string): Promise<boolean> {
    const currentUid = userId || auth.currentUser?.uid || 'guest_user';
    try {
      if (currentUid && currentUid !== 'guest_user') {
        const docRef = doc(db, 'users', currentUid, 'spmEvaluations', patientId);
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.warn('Error deleting SPM evaluation:', err);
    }

    const current = await this.loadSPMEvaluations(currentUid);
    delete current[patientId];
    localStorage.setItem(LOCAL_STORAGE_SPM_KEY, JSON.stringify(current));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kinesfera_spm_updated'));
    }

    return true;
  }
};

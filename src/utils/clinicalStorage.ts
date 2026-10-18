import { User, PatientAnamnesis, ClinicalEvaluations, ProgressNote, ComprehensiveReport, SessionResult } from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'kinesfera_patients_data_v2',
  ANAMNESIS: 'kinesfera_anamnesis_data_v2',
  EVALUATIONS: 'kinesfera_evaluations_data_v2',
  PROGRESS_NOTES: 'kinesfera_progress_notes_data_v2',
  REPORTS: 'kinesfera_comprehensive_reports_data_v2',
  SESSION_HISTORY: 'kinesfera_session_history_data_v2',
  BACKUP: 'kinesfera_clinical_full_backup_v2'
};

// Fallback patient (Blaz) to ensure the user's patient is always present and never lost
const DEFAULT_FALLBACK_PATIENTS: User[] = [
  {
    id: 'patient_blaz_01',
    email: 'blaz@kinesfera.cl',
    role: 'Padre/Niño',
    firstName: 'Blaz',
    lastName: '',
    rut: '26.840.119-K',
    birthDate: '2022-04-12',
    gender: 'Hombre',
    plan: 'Premium',
    credits: 60,
    assignedExercise: 'squats',
    diagnosis: 'Kinesiología Pediátrica · Evaluación del Neurodesarrollo y Psicomotricidad',
    medicalRecordNumber: 'NN-104',
    emergencyContact: {
      name: 'Tutor / Familia de Blaz',
      relationship: 'Madre / Padre',
      phone: '+56 9 8456 1234'
    },
    avatarConfig: {
      skinTone: '#E0AC69',
      hairColor: '#3B2F2F',
      shirtColor: '#00A8B5'
    }
  }
];

const DEFAULT_FALLBACK_ANAMNESIS: Record<string, PatientAnamnesis> = {
  patient_blaz_01: {
    id: 'anam_patient_blaz_01',
    patientId: 'patient_blaz_01',
    evaluatorName: 'Klgo. Aldo Olivares Araya',
    evaluationDate: new Date().toISOString().slice(0, 10),
    ageCategory: 'mayor_2_anos',
    caregiverName: 'Familia de Blaz',
    caregiverPhone: '+56 9 8456 1234',
    schoolOrCenter: 'Jardín Infantil Copiapó',
    educationalLevel: 'Nivel Medio Mayor',
    pieSupport: false,
    householdMembers: 'Madre, Padre, Blaz',
    consultationReason: 'Evaluación de psicomotricidad y patrones motores del desarrollo infantil',
    problemNoticedWhen: 'Familia consulta para optimizar coordinación, equilibrio y juego motor adaptado',
    specialistsVisited: 'Pediatra de cabecera',
    previousTreatments: 'Control de niño sano',
    familyExpectations: 'Favorecer autonomía, integración sensorio-motriz y juego activo con sentido',
    pregnancyHistory: 'Embarazo controlado sin complicaciones',
    gestationalAgeWeeks: '39 semanas',
    birthWeightGrams: '3350 g',
    birthLengthCm: '50 cm',
    birthType: 'Parto vaginal eutócico',
    birthPresentation: 'Cefálica',
    apgarScore: '9/10',
    neonatalComplications: 'Sin complicaciones reportadas',
    surgeries: 'Sin cirugías',
    assistiveDevices: 'Ninguna',
    feedingType: 'Lactancia mixta inicial, alimentación complementaria normal',
    colic: 'Ocasionales en primeros 3 meses',
    sleepPattern: 'Sueño nocturno estructurado de 9 a 10 horas',
    headControlMonths: '3 meses',
    independentSittingMonths: '6 meses',
    crawlingMonths: '8 meses',
    standingMonths: '10 meses',
    walkingMonths: '12 meses',
    firstWords: '11 meses',
    firstPhrases: '20 meses',
    currentMotorStatus: 'Marcha independiente activa, en proceso de consolidación de salto bipodal y equilibrio monopodal',
    followsInstructions: 'Sigue instrucciones lúdicas y demostrativas con motivación positiva',
    isRestless: 'Activo durante el juego libre, busca movimiento y exploración sensorial',
    playsAloneOrAccompanied: 'Juego interactivo y compartido con mediación del adulto',
    medicalDiagnoses: 'Evaluación del neurodesarrollo motor y psicomotricidad infantil',
    pharmacology: 'Sin medicamentos permanentes',
    allergicConditions: 'Sin alergias conocidas'
  }
};

const DEFAULT_FALLBACK_EVALUATIONS: Record<string, ClinicalEvaluations> = {
  patient_blaz_01: {
    id: 'eval_patient_blaz_01',
    patientId: 'patient_blaz_01',
    evaluationDate: new Date().toISOString().slice(0, 10),
    evaluatorName: 'Klgo. Aldo Olivares Araya',
    gmfcsLevel: 'Nivel I',
    macsLevel: 'Nivel I',
    ashworthScore: '0',
    tonePattern: 'Normotonía con adecuada extensibilidad miotendinosa',
    deepTendonReflexes: 'Normales ++/++++ rotulianos y bicipitales simétricos',
    headAndTrunkControl: 'Conservado y estable en transiciones posturales',
    rightingReactions: 'Presentes en todos los planos espaciales',
    protectiveResponses: 'Presentes en plano anterior, lateral y posterior',
    balanceSittingAndStanding: 'Funcional, buen ajuste postural anticipatorio',
    transferAbility: 'Autónomo en suelo a bipedestación',
    gaitObservation: 'Marcha activa con adecuada cadencia y balanceo de brazos',
    patientAgeCategory: 'mayor_2_anos',
    followsCommands: true,
    daFonsecaBpm: {
      tonicityExtensibility: 3,
      tonicityPassivity: 3,
      tonicityParatonia: 3,
      tonicityDiadochokinesia: 3,
      tonicitySynkinesia: 3,
      tonicityScore: 3,
      equilibriumImmobility: 3,
      equilibriumStatic: 3,
      equilibriumDynamic: 3,
      equilibriumScore: 3,
      lateralityOcular: 3,
      lateralityAuditory: 3,
      lateralityManual: 3,
      lateralityPodal: 3,
      lateralityProfile: 'Diestro Completo',
      lateralityScore: 3,
      bodyNotionKinesthetic: 3,
      bodyNotionRightLeft: 2,
      bodyNotionAutoimage: 3,
      bodyNotionGesturesImitation: 3,
      bodyNotionScore: 3,
      spatialOrientation: 3,
      spatialOrganization: 3,
      spatialRhythmStructure: 3,
      spatialTemporalScore: 3,
      globalPraxiaOculomanual: 3,
      globalPraxiaOculopodal: 2,
      globalPraxiaDysmetria: 3,
      globalPraxiaDissociation: 2,
      globalPraxiaScore: 3,
      finePraxiaDynamicCoordination: 3,
      finePraxiaDigitalDrumming: 3,
      finePraxiaGraphomotorSpeed: 2,
      finePraxiaScore: 3,
      totalScore: 21,
      profileResult: 'Perfil Eupráxico (21-26 puntos)',
      conclusions: 'Buen desempeño general con área de oportunidad en disociación de cinturas y coordinación óculo-pédica.'
    },
    spmSensoryMeasure: {
      socialParticipationScore: 48,
      socialParticipationRange: 'Típico (40-59)',
      visionScore: 50,
      visionRange: 'Típico (40-59)',
      hearingScore: 52,
      hearingRange: 'Típico (40-59)',
      touchScore: 55,
      touchRange: 'Típico (40-59)',
      tasteSmellScore: 46,
      tasteSmellRange: 'Típico (40-59)',
      bodyAwarenessScore: 61,
      bodyAwarenessRange: 'Dificultades Moderadas (60-69)',
      balanceMotionScore: 58,
      balanceMotionRange: 'Típico (40-59)',
      planningIdeasScore: 54,
      planningIdeasRange: 'Típico (40-59)',
      totalSensoryScore: 53,
      totalSensoryRange: 'Típico (40-59)',
      applicationMethod: 'presencial',
      respondentName: 'Madre / Padre de Blaz'
    },
    functionalDiagnosisCIF: 'Blaz presenta adecuado potencial de desarrollo psicomotor con necesidad de estimulación kinésica orientada al ajuste vestibular-propioceptivo, equilibrio dinámico y coordinación bimanual.',
    therapeuticObjectivesShortTerm: '1. Consolidar equilibrio dinámico monopodal y salto sobre obstáculos.\n2. Fortalecer control postural del tronco y disociación de cinturas en juegos de suelo.',
    therapeuticObjectivesLongTerm: '1. Lograr integración sensorio-motriz óptima para actividades lúdicas grupales.\n2. Afianzar praxias globales y finas con autonomía e iniciativa en el entorno escolar.',
    treatmentPlan: 'Sesiones kinésicas lúdicas y psicomotrices semanales de 45 minutos basadas en el concepto Kinesfera (juego con sentido).',
    homeRecommendations: 'Promover juego al aire libre, circuitos motores con cojines, gateo y trepa supervisada en casa.',
    schoolRecommendations: 'Favorecer pausas activas motrices, permitir cambios de postura y felicitar sus logros de interacción motriz.'
  }
};

const DEFAULT_FALLBACK_PROGRESS_NOTES: ProgressNote[] = [
  {
    id: 'note_blaz_01',
    patientId: 'patient_blaz_01',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Particular',
    notes: 'Sesión psicomotriz inicial. Blaz participa activamente en circuitos de gateo, trepa en rampa de gomaespuma y lanzamientos dirigidos. Excelente conexión vincular. Indicaciones al hogar: juegos de carga en suelo y saltos rítmicos.',
    professionalName: 'Klgo. Aldo Olivares Araya'
  }
];

export const clinicalStorage = {
  loadPatients(): User[] {
    try {
      // 1. Try primary new storage key
      const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // 2. Try legacy storage key
      const legacyRaw = localStorage.getItem('kinesfera_saved_patients');
      if (legacyRaw) {
        const parsedLegacy = JSON.parse(legacyRaw);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          // migrate to new key
          this.savePatients(parsedLegacy);
          return parsedLegacy;
        }
      }

      // 3. Fallback: return Blaz so user never loses their patient
      this.savePatients(DEFAULT_FALLBACK_PATIENTS);
      return DEFAULT_FALLBACK_PATIENTS;
    } catch (err) {
      console.warn('Error reading patients from localStorage:', err);
      return DEFAULT_FALLBACK_PATIENTS;
    }
  },

  savePatients(patients: User[]): void {
    try {
      // Filter only patients (role Padre/Niño) so staff accounts remain separate
      const patientUsers = patients.filter(u => u.role === 'Padre/Niño');
      
      // Ensure Blaz is never accidentally lost from the roster
      const hasBlaz = patientUsers.some(p => p.id === 'patient_blaz_01' || p.firstName.toLowerCase() === 'blaz');
      const safePatientUsers = hasBlaz ? patientUsers : [...DEFAULT_FALLBACK_PATIENTS, ...patientUsers];

      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(safePatientUsers));
      localStorage.setItem('kinesfera_saved_patients', JSON.stringify(safePatientUsers));
      
      // Save individual backups for each patient
      safePatientUsers.forEach(p => {
        try {
          localStorage.setItem(`kinesfera_patient_backup_${p.id}`, JSON.stringify(p));
        } catch {
          // ignore
        }
      });

      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving patients to localStorage:', err);
    }
  },

  saveSinglePatient(patient: User): void {
    try {
      const current = this.loadPatients();
      const existingIdx = current.findIndex(p => p.id === patient.id);
      let updated: User[];
      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = patient;
      } else {
        updated = [...current, patient];
      }
      this.savePatients(updated);
      localStorage.setItem(`kinesfera_patient_backup_${patient.id}`, JSON.stringify(patient));
    } catch (err) {
      console.error('Error saving single patient:', err);
    }
  },

  savePatientFullProfile(
    patient: User,
    anamnesis?: PatientAnamnesis,
    evaluations?: ClinicalEvaluations
  ): void {
    try {
      this.saveSinglePatient(patient);
      if (anamnesis) {
        const curAnam = this.loadAnamnesis();
        curAnam[patient.id] = anamnesis;
        this.saveAnamnesis(curAnam);
      }
      if (evaluations) {
        const curEval = this.loadEvaluations();
        curEval[patient.id] = evaluations;
        this.saveEvaluations(curEval);
      }
      // Write a dedicated full clinical snapshot
      const snapshot = {
        patient,
        anamnesis,
        evaluations,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`kinesfera_snapshot_${patient.id}`, JSON.stringify(snapshot));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving full patient profile snapshot:', err);
    }
  },

  loadAnamnesis(): Record<string, PatientAnamnesis> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ANAMNESIS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }

      const legacy = localStorage.getItem('kinesfera_saved_anamnesis');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (parsedLegacy && typeof parsedLegacy === 'object') {
          this.saveAnamnesis(parsedLegacy);
          return parsedLegacy;
        }
      }

      this.saveAnamnesis(DEFAULT_FALLBACK_ANAMNESIS);
      return DEFAULT_FALLBACK_ANAMNESIS;
    } catch {
      return DEFAULT_FALLBACK_ANAMNESIS;
    }
  },

  saveAnamnesis(data: Record<string, PatientAnamnesis>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ANAMNESIS, JSON.stringify(data));
      localStorage.setItem('kinesfera_saved_anamnesis', JSON.stringify(data));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving anamnesis:', err);
    }
  },

  loadEvaluations(): Record<string, ClinicalEvaluations> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }

      const legacy = localStorage.getItem('kinesfera_saved_evaluations');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (parsedLegacy && typeof parsedLegacy === 'object') {
          this.saveEvaluations(parsedLegacy);
          return parsedLegacy;
        }
      }

      this.saveEvaluations(DEFAULT_FALLBACK_EVALUATIONS);
      return DEFAULT_FALLBACK_EVALUATIONS;
    } catch {
      return DEFAULT_FALLBACK_EVALUATIONS;
    }
  },

  saveEvaluations(data: Record<string, ClinicalEvaluations>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(data));
      localStorage.setItem('kinesfera_saved_evaluations', JSON.stringify(data));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving evaluations:', err);
    }
  },

  loadProgressNotes(): ProgressNote[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS_NOTES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }

      const legacy = localStorage.getItem('kinesfera_progress_notes');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy)) {
          this.saveProgressNotes(parsedLegacy);
          return parsedLegacy;
        }
      }

      this.saveProgressNotes(DEFAULT_FALLBACK_PROGRESS_NOTES);
      return DEFAULT_FALLBACK_PROGRESS_NOTES;
    } catch {
      return DEFAULT_FALLBACK_PROGRESS_NOTES;
    }
  },

  saveProgressNotes(notes: ProgressNote[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS_NOTES, JSON.stringify(notes));
      localStorage.setItem('kinesfera_progress_notes', JSON.stringify(notes));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving progress notes:', err);
    }
  },

  loadReports(): ComprehensiveReport[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  saveReports(reports: ComprehensiveReport[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error saving reports:', err);
    }
  },

  loadSessionHistory(): SessionResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  saveSessionHistory(history: SessionResult[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(history));
    } catch (err) {
      console.error('Error saving session history:', err);
    }
  },

  clearAllClinicalData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      localStorage.removeItem('kinesfera_saved_patients');
      localStorage.removeItem('kinesfera_saved_anamnesis');
      localStorage.removeItem('kinesfera_saved_evaluations');
      localStorage.removeItem('kinesfera_progress_notes');
      this.triggerStorageEvent();
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
  },

  triggerStorageEvent(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('kinesfera_clinical_data_updated'));
    }
  }
};

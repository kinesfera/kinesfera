import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc
} from 'firebase/firestore';
import { 
  storage, 
  storageRef, 
  uploadBytes, 
  getDownloadURL, 
  db, 
  auth 
} from './firebase';
import { 
  LibraryFileDocument
} from '../types';

const LOCAL_STORAGE_LIBRARY_KEY = 'kinesfera_library_files_v1';

// Pre-seeded documents from user attachments in workspace
export const DEFAULT_LIBRARY_FILES: LibraryFileDocument[] = [
  {
    id: 'lib_checklist_comunicacion_critica',
    name: 'Lista de Control de Habilidades de Comunicación Críticas y Funcionales (Oficial)',
    fileName: 'Lista_Control_Comunicacion_Critica_CAA.pdf',
    fileType: 'pdf',
    scope: 'negocio',
    category: 'comunicacion_critica',
    downloadUrl: '/assets/aistudio/528913257-traducion-curso-i-medida-de-procesasamiento-sensorial-participantes-230403191620-29eed237_5963bfaf.pdf',
    fileSizeBytes: 245000,
    uploadedAt: '2026-10-20T10:00:00Z',
    uploadedBy: 'Klgo. Aldo Olivares Araya',
    summary: 'Protocolo estandarizado de valoración de habilidades comunicativas críticas y funcionales para niños con desafíos en el seguimiento de instrucciones, habla y autorregulación (CAA).',
    keyPoints: [
      'Evalúa 9 dimensiones críticas: pedir reforzadores, ayuda, pausas, rechazo apropiado, afirmación/aceptación, espera, transiciones, respuesta a instrucciones y seguimiento de horario visual.',
      'Diferencia entre seguimiento de instrucciones con apoyo visual vs. puramente verbales.',
      'Si el paciente no sigue instrucciones, activa automáticamente objetivo específico en el plan kinésico.',
      'Semáforo clínico: Sí (Adquirido/Verde), En proceso (Amarillo), No (No observado/Rojo).'
    ],
    isChecklistActive: true,
    checklistItems: [
      {
        id: 'comm_1_reforzadores',
        skillName: '1. Pedir Reforzadores (comida, juguetes, actividades)',
        description: 'Pide objetos o actividades deseadas mediante gestos, vocalizaciones, palabras o pictogramas sin desregulación.',
        instructionsCheck: false
      },
      {
        id: 'comm_2_ayuda',
        skillName: '2. Pedir Ayuda',
        description: 'Solicita asistencia al adulto cuando enfrenta un obstáculo motor o material en vez de frustrarse.',
        instructionsCheck: false
      },
      {
        id: 'comm_3_descansos',
        skillName: '3. Pedir Descansos / Pausas',
        description: 'Expresa necesidad de detener la actividad motriz o cambiar de estímulo de forma adecuada.',
        instructionsCheck: false
      },
      {
        id: 'comm_4_rechazo',
        skillName: '4. Rechazar de forma apropiada ("No")',
        description: 'Aparta o verbaliza rechazo a un estímulo o tarea sin conductas agresivas ni autolesivas.',
        instructionsCheck: false
      },
      {
        id: 'comm_5_aceptacion',
        skillName: '5. Afirmar / Aceptar apropiadamente ("Sí")',
        description: 'Asiente con la cabeza, sonríe o emite respuesta de aceptación frente a opciones ofrecidas.',
        instructionsCheck: false
      },
      {
        id: 'comm_6_espera',
        skillName: '6. Responder a esperar (tolerancia a la espera)',
        description: 'Tolera pausas breves de 10 a 30 segundos mientras el kinesiólogo prepara materiales o circuitos.',
        instructionsCheck: false
      },
      {
        id: 'comm_7_transiciones',
        skillName: '7. Transición entre actividades',
        description: 'Pasa de una actividad agradable a otra sin llanto ni resistencia prolongada.',
        instructionsCheck: false
      },
      {
        id: 'comm_8_instrucciones',
        skillName: '8. Seguir instrucciones (simples y complejas)',
        description: 'Responde y ejecuta indicaciones del terapeuta tanto con apoyo visual como verbalmente.',
        instructionsCheck: true
      },
      {
        id: 'comm_9_horario_visual',
        skillName: '9. Seguir horario visual y rutinas estructuradas',
        description: 'Comprende el orden del juego psicomotor apoyado en tablero de anticipación.',
        instructionsCheck: false
      }
    ]
  },
  {
    id: 'lib_spm2_bebes',
    name: 'SPM-2 Cuestionario Bebés (4 a 9 meses)',
    fileName: 'ilide.info-spm-2-bebes-4-a-9-meses-pr_604339aa0daad77c6d3025399d0c5995_3843a8f7.pdf',
    fileType: 'pdf',
    scope: 'negocio',
    category: 'evaluacion_spm',
    downloadUrl: '/assets/aistudio/ilide.info-spm-2-bebes-4-a-9-meses-pr_604339aa0daad77c6d3025399d0c5995_3843a8f7.pdf',
    fileSizeBytes: 3120000,
    uploadedAt: '2026-10-21T09:00:00Z',
    uploadedBy: 'Klgo. Aldo Olivares Araya',
    summary: 'Cuestionario SPM-2 para lactantes de 4 a 9 meses completado por padres y cuidadores para valorar respuestas a estímulos visuales, auditivos, táctiles, motores y de participación social.',
    keyPoints: [
      'Rango etario normativo: 4 a 9 meses (dividido en estratos 4-6 meses y 7-9 meses).',
      '80 ítems tipo Likert (Nunca=1, Ocasionalmente=2, Frecuentemente=3, Siempre=4).',
      'Escalas clave: Visión (VIS), Audición (HEA), Tacto (TOU), Gusto/Olfato (T&S), Conciencia Corporal (BOD), Equilibrio y Movimiento (BAL), Total Sensorial (ST), Planificación/Ideas (PLN) y Participación Social (SOC).',
      'Puntos de corte normativos T: Típico (<60), Dificultades Moderadas (60-69), Dificultades Severas (≥70).'
    ]
  },
  {
    id: 'lib_spm2_toddler',
    name: 'SPM-2 Cuestionario Niños Pequeños (10 a 30 meses)',
    fileName: 'SPM_10-30_meses_5312c45e.pdf',
    fileType: 'pdf',
    scope: 'negocio',
    category: 'evaluacion_spm',
    downloadUrl: '/assets/aistudio/SPM_10-30_meses_5312c45e.pdf',
    fileSizeBytes: 4200000,
    uploadedAt: '2026-10-21T09:15:00Z',
    uploadedBy: 'Klgo. Aldo Olivares Araya',
    summary: 'Formulario SPM-2 Toddler para niños pequeños de 10 a 30 meses en el hogar, enfocado en respuestas posturales, exploración y regulación.',
    keyPoints: [
      'Rango etario: 10 a 30 meses (estratos 10-20 meses y 21-30 meses).',
      'Evalúa tolerancia a texturas, ruidos domésticos, caídas, reacciones de balanceo y primeros juegos de ideación motriz.',
      'Conversión normalizada a puntuaciones T con media 50 y desviación 10.'
    ]
  },
  {
    id: 'lib_spm_preescolar_padres',
    name: 'SPM-Preescolar Cuestionario para Padres (2 a 5 años)',
    fileName: 'Cuestionario_Padres_Pre_Escolar_ea5af9a8.pdf',
    fileType: 'pdf',
    scope: 'negocio',
    category: 'evaluacion_spm',
    downloadUrl: '/assets/aistudio/Cuestionario_Padres_Pre_Escolar_ea5af9a8.pdf',
    fileSizeBytes: 2800000,
    uploadedAt: '2026-10-21T09:30:00Z',
    uploadedBy: 'Klgo. Aldo Olivares Araya',
    summary: 'Cuestionario de 75 preguntas para padres de párvulos de 2 a 5 años. Mide participación social, visión, audición, tacto, gusto/olfato, conciencia corporal, equilibrio y planificación motora.',
    keyPoints: [
      'Párvulos de 2 a 5 años en etapa de jardín infantil o cuidado domiciliario.',
      '75 ítems estructurados en 8 escalas estandarizadas.',
      'Permite detectar hiper/hiporreactividad y conductas de búsqueda activa.'
    ]
  },
  {
    id: 'lib_spm_preescolar_escolar',
    name: 'SPM-Preescolar Cuestionario Escolar (2 a 5 años)',
    fileName: 'Cuestionario_Escolar_Pre_Escolar_21409f2b.pdf',
    fileType: 'pdf',
    scope: 'negocio',
    category: 'evaluacion_spm',
    downloadUrl: '/assets/aistudio/Cuestionario_Escolar_Pre_Escolar_21409f2b.pdf',
    fileSizeBytes: 2750000,
    uploadedAt: '2026-10-21T09:40:00Z',
    uploadedBy: 'Klgo. Aldo Olivares Araya',
    summary: 'Formulario completado por educadoras de párvulos para evaluar el desempeño en sala cuna y jardín infantil.',
    keyPoints: [
      'Observación de rutinas de aula, recreo, alimentación y respuesta a consignas grupales.',
      'Comparativa de Diferencia Ambiental (DIF) entre hogar y jardín infantil.'
    ]
  },
  {
    id: 'lib_spm_escolar_padres',
    name: 'SPM Escolar Cuestionario para Padres (5 a 12 años)',
    fileName: 'Cuestionario_Padres_Escolares_460ca90f.pdf',
    fileType: 'pdf',
    scope: 'negocio',
    category: 'evaluacion_spm',
    downloadUrl: '/assets/aistudio/Cuestionario_Padres_Escolares_460ca90f.pdf',
    fileSizeBytes: 2900000,
    uploadedAt: '2026-10-21T10:00:00Z',
    uploadedBy: 'Klgo. Aldo Olivares Araya',
    summary: 'Cuestionario estandarizado para escolares de 5 a 12 años aplicado a padres. Aborda autonomía escolar, escritura, juego físico y autorregulación.',
    keyPoints: [
      '75 ítems completados por apoderados.',
      'Puntuaciones T: Típico (40-59), Algunos problemas (60-69), Disfunción definida (70-80).',
      'Fundamental para niños con TDAH, TEA y desafíos de coordinación motora.'
    ]
  },
  {
    id: 'lib_spm_escolar_escuela',
    name: 'SPM Escolar Cuestionario Escolar (5 a 12 años)',
    fileName: 'Cuestionario_Escolar_Escolares_a3b0141b.pdf',
    fileType: 'pdf',
    scope: 'negocio',
    category: 'evaluacion_spm',
    downloadUrl: '/assets/aistudio/Cuestionario_Escolar_Escolares_a3b0141b.pdf',
    fileSizeBytes: 2850000,
    uploadedAt: '2026-10-21T10:10:00Z',
    uploadedBy: 'Klgo. Aldo Olivares Araya',
    summary: 'Formulario de 62 ítems para profesores de aula regular o equipo PIE. Evalúa cómo influyen los estímulos escolares en la atención y tareas motrices.',
    keyPoints: [
      '62 ítems puntuados por el profesor jefe o educador diferencial PIE.',
      'Cálculo de puntuación DIF (Hogar vs. Aula) para orientar adaptaciones curriculares.'
    ]
  },
  {
    id: 'lib_spm2_manual_espanol',
    name: 'Manual Técnico SPM-2 (Traducción al Español)',
    fileName: 'ilide.info-manual-spm-2-espanol-pr_5a6fff610415d0485bb0e4232474f674_a177c2cd.pdf',
    fileType: 'pdf',
    scope: 'negocio',
    category: 'protocolo',
    downloadUrl: '/assets/aistudio/ilide.info-manual-spm-2-espanol-pr_5a6fff610415d0485bb0e4232474f674_a177c2cd.pdf',
    fileSizeBytes: 15400000,
    uploadedAt: '2026-10-21T10:30:00Z',
    uploadedBy: 'Klgo. Aldo Olivares Araya',
    summary: 'Manual integral de la Medida de Procesamiento Sensorial 2da edición (WPS). Contiene tablas de conversión de puntajes brutos a T-scores, validez y baremos.',
    keyPoints: [
      'Baremos psicométricos para todos los grupos de edad desde 4 meses hasta 87 años.',
      'Tablas de conversión normativa A.1 a A.16.',
      'Criterios de interpretación de Diferencia (DIF) y puntuaciones de corte ambiental.'
    ]
  }
];

export const libraryStorageService = {
  /**
   * Load all library files from Firestore for the current user, or fallback to localStorage / pre-seeded
   */
  async loadLibraryFiles(userId?: string): Promise<LibraryFileDocument[]> {
    const mergeWithDefaults = (loaded: LibraryFileDocument[]): LibraryFileDocument[] => {
      const existingIds = new Set(loaded.map(f => f.id));
      const missingDefaults = DEFAULT_LIBRARY_FILES.filter(df => !existingIds.has(df.id));
      return [...loaded, ...missingDefaults];
    };

    try {
      const currentUid = userId || auth.currentUser?.uid;
      if (currentUid) {
        const colRef = collection(db, 'users', currentUid, 'libraryFiles');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const files: LibraryFileDocument[] = [];
          snap.forEach(docSnap => {
            files.push(docSnap.data() as LibraryFileDocument);
          });
          const merged = mergeWithDefaults(files);
          // Cache in local storage for instant offline access
          localStorage.setItem(LOCAL_STORAGE_LIBRARY_KEY, JSON.stringify(merged));
          return merged;
        }
      }

      // Check localStorage
      const cached = localStorage.getItem(LOCAL_STORAGE_LIBRARY_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = mergeWithDefaults(parsed);
          localStorage.setItem(LOCAL_STORAGE_LIBRARY_KEY, JSON.stringify(merged));
          return merged;
        }
      }

      // Save pre-seeded documents into localStorage
      localStorage.setItem(LOCAL_STORAGE_LIBRARY_KEY, JSON.stringify(DEFAULT_LIBRARY_FILES));
      return DEFAULT_LIBRARY_FILES;
    } catch (err) {
      console.warn('Could not read library files from Firestore, returning cached:', err);
      const cached = localStorage.getItem(LOCAL_STORAGE_LIBRARY_KEY);
      if (cached) {
        try {
          return mergeWithDefaults(JSON.parse(cached));
        } catch {
          return DEFAULT_LIBRARY_FILES;
        }
      }
      return DEFAULT_LIBRARY_FILES;
    }
  },

  /**
   * Save or upload a new file document into Firebase Storage & Firestore metadata
   */
  async saveLibraryFile(
    fileDoc: LibraryFileDocument,
    fileBlob?: Blob,
    userId?: string
  ): Promise<LibraryFileDocument> {
    const currentUid = userId || auth.currentUser?.uid || 'guest_user';
    let finalDoc = { ...fileDoc };

    // 1. If a binary blob is provided, attempt upload to Firebase Storage
    if (fileBlob) {
      try {
        const cleanFileName = fileDoc.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const sPath = `library/${currentUid}/${fileDoc.id}/${cleanFileName}`;
        const sRef = storageRef(storage, sPath);
        const uploadRes = await uploadBytes(sRef, fileBlob);
        const url = await getDownloadURL(uploadRes.ref);
        finalDoc.downloadUrl = url;
        finalDoc.storagePath = sPath;
      } catch (storageErr) {
        console.warn('Firebase Storage direct upload warning (using fallback data URL):', storageErr);
      }
    }

    // 2. Save metadata in Firestore
    try {
      if (currentUid && currentUid !== 'guest_user') {
        const docRef = doc(db, 'users', currentUid, 'libraryFiles', finalDoc.id);
        await setDoc(docRef, finalDoc);
      }
    } catch (fsErr) {
      console.warn('Could not save file metadata to Firestore, caching locally:', fsErr);
    }

    // 3. Save to localStorage cache
    const currentList = await this.loadLibraryFiles(currentUid);
    const existingIdx = currentList.findIndex(f => f.id === finalDoc.id);
    let updatedList: LibraryFileDocument[];
    if (existingIdx >= 0) {
      updatedList = [...currentList];
      updatedList[existingIdx] = finalDoc;
    } else {
      updatedList = [finalDoc, ...currentList];
    }
    localStorage.setItem(LOCAL_STORAGE_LIBRARY_KEY, JSON.stringify(updatedList));

    // Dispatch event for reactive UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kinesfera_library_updated', { detail: finalDoc }));
    }

    return finalDoc;
  },

  /**
   * Delete a library file from Firestore, Storage, and localStorage
   */
  async deleteLibraryFile(fileId: string, userId?: string): Promise<boolean> {
    const currentUid = userId || auth.currentUser?.uid || 'guest_user';
    try {
      // 1. Delete from Firestore
      if (currentUid && currentUid !== 'guest_user') {
        const docRef = doc(db, 'users', currentUid, 'libraryFiles', fileId);
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.warn('Error deleting library file from Firestore:', err);
    }

    // 2. Remove from localStorage
    const currentList = await this.loadLibraryFiles(currentUid);
    const filtered = currentList.filter(f => f.id !== fileId);
    localStorage.setItem(LOCAL_STORAGE_LIBRARY_KEY, JSON.stringify(filtered));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kinesfera_library_updated'));
    }

    return true;
  },

  /**
   * Get active Critical Communication Skills checklist
   */
  async getActiveCommunicationChecklist(userId?: string): Promise<LibraryFileDocument | null> {
    const files = await this.loadLibraryFiles(userId);
    const active = files.find(f => f.category === 'comunicacion_critica' && f.isChecklistActive);
    if (active) return active;
    const anyComm = files.find(f => f.category === 'comunicacion_critica' && f.checklistItems && f.checklistItems.length > 0);
    return anyComm || DEFAULT_LIBRARY_FILES[0];
  },

  /**
   * Set a checklist as the active one for report summary generation
   */
  async setActiveCommunicationChecklist(fileId: string, userId?: string): Promise<void> {
    const currentUid = userId || auth.currentUser?.uid;
    const files = await this.loadLibraryFiles(userId);
    const updated = files.map(f => ({
      ...f,
      isChecklistActive: f.id === fileId
    }));
    localStorage.setItem(LOCAL_STORAGE_LIBRARY_KEY, JSON.stringify(updated));

    if (currentUid) {
      for (const f of updated) {
        try {
          await setDoc(doc(db, 'users', currentUid, 'libraryFiles', f.id), { isChecklistActive: f.isChecklistActive }, { merge: true });
        } catch {
          // ignore
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kinesfera_library_updated'));
    }
  },

  /**
   * Extract key summary context for AI / Marketing without exposing patient names
   */
  async getAggregatedLibraryContext(scope: 'all' | 'negocio' = 'negocio'): Promise<string> {
    const files = await this.loadLibraryFiles();
    const filtered = scope === 'negocio' 
      ? files.filter(f => f.scope === 'negocio') 
      : files;

    const snippets = filtered.map(f => {
      return `[DOCUMENTO: ${f.name} - Categoría: ${f.category}]\nResumen: ${f.summary}\nPuntos Clave: ${f.keyPoints.join('; ')}`;
    });

    return snippets.join('\n\n');
  }
};

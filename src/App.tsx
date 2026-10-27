import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  User, 
  Exercise, 
  Report, 
  SessionResult, 
  AvatarConfig,
  ProgressNote,
  PatientAnamnesis,
  ClinicalEvaluations,
  ComprehensiveReport,
  LeadProspect
} from './types';
import { 
  INITIAL_EXERCISES, 
  INITIAL_USERS, 
  INITIAL_REPORTS, 
  INITIAL_CHATS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_SESSION_HISTORY,
  INITIAL_PROGRESS_NOTES,
  INITIAL_ANAMNESIS,
  INITIAL_CLINICAL_EVALUATIONS,
  INITIAL_COMPREHENSIVE_REPORTS,
  INITIAL_LEADS
} from './data/mockData';
import { clinicalStorage } from './utils/clinicalStorage';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { ChildAdventureView } from './components/ChildAdventureView';
import { ClinicalPortalView } from './components/ClinicalPortalView';
import { EducatorPortalView } from './components/EducatorPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { ExerciseSessionModal } from './components/ExerciseSessionModal';
import { ChatSystemModal } from './components/ChatSystemModal';
import { 
  auth, 
  onAuthStateChanged, 
  signOut, 
  FirebaseUser,
  testFirestoreConnection
} from './services/firebase';
import { firebaseClinicalService, reportFirebaseErrorToUI } from './services/firebaseClinicalService';
import { CheckCircle2, X as CloseIcon, Loader2, Cloud, AlertTriangle } from 'lucide-react';

export default function App() {
  // Authentication & session state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [initialCloudLoaded, setInitialCloudLoaded] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeLoggedInUserId, setActiveLoggedInUserId] = useState<string>('');
  const [migrationNotice, setMigrationNotice] = useState<string | null>(null);
  const [firebaseErrorNotice, setFirebaseErrorNotice] = useState<string | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('syncing');

  // Global application states: Firestore is the single source of truth (never initialized with mock patients)
  const [users, setUsers] = useState<User[]>(() => INITIAL_USERS.filter(u => u.role !== 'Padre/Niño'));
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [sessionHistory, setSessionHistory] = useState<SessionResult[]>([]);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([]);
  const [anamnesisData, setAnamnesisData] = useState<Record<string, PatientAnamnesis>>({});
  const [evaluationsData, setEvaluationsData] = useState<Record<string, ClinicalEvaluations>>({});
  const [comprehensiveReports, setComprehensiveReports] = useState<ComprehensiveReport[]>([]);
  const [leads, setLeads] = useState<LeadProspect[]>(INITIAL_LEADS);

  // Active view & role
  const [currentRole, setCurrentRole] = useState<UserRole>('Profesionales Clínicos');
  const [activeTab, setActiveTab] = useState<'child' | 'clinical' | 'educator' | 'admin'>('clinical');

  // Verify connection to Firestore on initialization & listen to real Firebase errors
  useEffect(() => {
    testFirestoreConnection();

    const handleFirebaseError = (event: Event) => {
      const customEvt = event as CustomEvent<{ message: string; timestamp: string }>;
      if (customEvt.detail?.message) {
        setFirebaseErrorNotice(customEvt.detail.message);
      }
    };
    window.addEventListener('kinesfera_firebase_error', handleFirebaseError);
    return () => {
      window.removeEventListener('kinesfera_firebase_error', handleFirebaseError);
    };
  }, []);

  // 1. Listen to Firebase Auth state & safely check migration without overwriting cloud data
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setIsLoggedIn(true);
        setActiveLoggedInUserId(user.uid);
        setAuthLoading(false);

        try {
          setCloudSyncStatus('syncing');
          const migResult = await firebaseClinicalService.migrateLocalStorageToFirestore(user.uid);
          if (migResult.migrated) {
            setMigrationNotice(migResult.message);
          }
        } catch (migErr: any) {
          const msg = migErr instanceof Error ? migErr.message : String(migErr);
          console.error('Error en verificación inicial de Firestore:', migErr);
          setFirebaseErrorNotice(`Error de sincronización inicial en Firebase: ${msg}`);
        }
      } else {
        setFirebaseUser(null);
        setIsLoggedIn(false);
        setInitialCloudLoaded(false);
        setActiveLoggedInUserId('');
        setUsers(INITIAL_USERS.filter(u => u.role !== 'Padre/Niño'));
        setProgressNotes([]);
        setAnamnesisData({});
        setEvaluationsData({});
        setComprehensiveReports([]);
        setAuthLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Firestore subscriptions for authenticated user (Single Source of Truth: users/{uid}/...)
  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const uid = firebaseUser.uid;
    setCloudSyncStatus('syncing');

    const loadedFlags = {
      patients: false,
      anamnesis: false,
      evaluations: false,
      notes: false,
      reports: false
    };

    const checkAllLoaded = () => {
      if (
        loadedFlags.patients &&
        loadedFlags.anamnesis &&
        loadedFlags.evaluations &&
        loadedFlags.notes &&
        loadedFlags.reports
      ) {
        setInitialCloudLoaded(true);
        setCloudSyncStatus('synced');
      }
    };

    const unsubPatients = firebaseClinicalService.subscribePatients(uid, (remotePatients) => {
      loadedFlags.patients = true;
      setUsers(prev => {
        const staff = prev.filter(u => u.role !== 'Padre/Niño');
        return [...staff, ...remotePatients];
      });
      clinicalStorage.savePatients(remotePatients);
      checkAllLoaded();
    });

    const unsubAnamnesis = firebaseClinicalService.subscribeAnamnesis(uid, (remoteAnamnesis) => {
      loadedFlags.anamnesis = true;
      setAnamnesisData(remoteAnamnesis);
      clinicalStorage.saveAnamnesis(remoteAnamnesis);
      checkAllLoaded();
    });

    const unsubEvaluations = firebaseClinicalService.subscribeEvaluations(uid, (remoteEvaluations) => {
      loadedFlags.evaluations = true;
      setEvaluationsData(remoteEvaluations);
      clinicalStorage.saveEvaluations(remoteEvaluations);
      checkAllLoaded();
    });

    const unsubNotes = firebaseClinicalService.subscribeProgressNotes(uid, (remoteNotes) => {
      loadedFlags.notes = true;
      setProgressNotes(remoteNotes);
      clinicalStorage.saveProgressNotes(remoteNotes);
      checkAllLoaded();
    });

    const unsubReports = firebaseClinicalService.subscribeReports(uid, (remoteReports) => {
      loadedFlags.reports = true;
      setComprehensiveReports(remoteReports);
      clinicalStorage.saveReports(remoteReports);
      checkAllLoaded();
    });

    return () => {
      unsubPatients();
      unsubAnamnesis();
      unsubEvaluations();
      unsubNotes();
      unsubReports();
    };
  }, [firebaseUser?.uid]);

  // Synchronized persistence to localStorage ONLY AFTER authentication and initial cloud data have loaded
  useEffect(() => {
    if (isLoggedIn && initialCloudLoaded && firebaseUser?.uid) {
      clinicalStorage.savePatients(users);
    }
  }, [users, isLoggedIn, initialCloudLoaded, firebaseUser?.uid]);

  useEffect(() => {
    if (isLoggedIn && initialCloudLoaded && firebaseUser?.uid) {
      clinicalStorage.saveProgressNotes(progressNotes);
    }
  }, [progressNotes, isLoggedIn, initialCloudLoaded, firebaseUser?.uid]);

  useEffect(() => {
    if (isLoggedIn && initialCloudLoaded && firebaseUser?.uid) {
      clinicalStorage.saveAnamnesis(anamnesisData);
    }
  }, [anamnesisData, isLoggedIn, initialCloudLoaded, firebaseUser?.uid]);

  useEffect(() => {
    if (isLoggedIn && initialCloudLoaded && firebaseUser?.uid) {
      clinicalStorage.saveEvaluations(evaluationsData);
    }
  }, [evaluationsData, isLoggedIn, initialCloudLoaded, firebaseUser?.uid]);

  useEffect(() => {
    if (isLoggedIn && initialCloudLoaded && firebaseUser?.uid) {
      clinicalStorage.saveReports(comprehensiveReports);
    }
  }, [comprehensiveReports, isLoggedIn, initialCloudLoaded, firebaseUser?.uid]);

  useEffect(() => {
    if (isLoggedIn && initialCloudLoaded && firebaseUser?.uid) {
      clinicalStorage.saveSessionHistory(sessionHistory);
    }
  }, [sessionHistory, isLoggedIn, initialCloudLoaded, firebaseUser?.uid]);

  // Modals
  const [activeExerciseForSession, setActiveExerciseForSession] = useState<{
    exercise: Exercise;
    neurodiversityMode: 'standard' | 'TEA' | 'TDAH' | 'down' | 'motor';
  } | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);

  // Current active user based on role or selected profile
  const loggedInUser = users.find(u => u.id === activeLoggedInUserId);
  const childUser = users.find(u => u.id === 'user_patient_juan') || users.find(u => u.role === 'Padre/Niño') || users[2];
  const clinicianUser = users.find(u => u.role === 'Profesionales Clínicos') || users[0];
  const educatorUser = users.find(u => u.role === 'Educadores') || users[1];
  const adminUser = users.find(u => u.role === 'Administrador (Neuronexin)') || users[5];

  const currentUser = loggedInUser || (
    currentRole === 'Padre/Niño' 
      ? childUser 
      : currentRole === 'Profesionales Clínicos' 
      ? clinicianUser 
      : currentRole === 'Educadores' 
      ? educatorUser 
      : adminUser
  );

  // Login handler
  const handleLoginSuccess = (user: User, role: UserRole) => {
    setActiveLoggedInUserId(user.id);
    setCurrentRole(role);
    if (role === 'Padre/Niño') setActiveTab('child');
    else if (role === 'Profesionales Clínicos') setActiveTab('clinical');
    else if (role === 'Educadores') setActiveTab('educator');
    else if (role === 'Administrador (Neuronexin)') setActiveTab('admin');
    setIsLoggedIn(true);
  };

  // Handlers
  const handleStartExercise = (
    exercise: Exercise, 
    mode: 'standard' | 'TEA' | 'TDAH' | 'down' | 'motor'
  ) => {
    setActiveExerciseForSession({ exercise, neurodiversityMode: mode });
  };

  const handleFinishSession = (result: SessionResult) => {
    setSessionHistory(prev => [result, ...prev]);

    // Update child credits & stars
    setUsers(prev => prev.map(u => {
      if (u.id === childUser.id) {
        return {
          ...u,
          credits: u.credits + result.starsEarned * 5
        };
      }
      return u;
    }));
  };

  const handleUpdateAvatar = (newConfig: AvatarConfig) => {
    setUsers(prev => prev.map(u => {
      if (u.id === childUser.id) {
        return {
          ...u,
          avatarConfig: newConfig
        };
      }
      return u;
    }));
  };

  const handleAssignExercise = (patientId: string, exerciseId: 'squats' | 'kneeTouch' | 'armsUp') => {
    setUsers(prev => prev.map(u => {
      if (u.id === patientId) {
        return {
          ...u,
          assignedExercise: exerciseId,
          assignedAt: new Date().toISOString()
        };
      }
      return u;
    }));
  };

  const handleCreateReport = (newReport: Report) => {
    setReports(prev => [newReport, ...prev]);
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`,
      senderRole: currentRole,
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          lastMessage: {
            text,
            timestamp: newMessage.timestamp
          }
        };
      }
      return c;
    }));
  };

  const handleAddCredits = (userId: string, amount: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, credits: u.credits + amount };
      }
      return u;
    }));
  };

  const handleTogglePlan = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, plan: u.plan === 'Premium' ? 'Gratis' : 'Premium' };
      }
      return u;
    }));
  };

  const ensureReadyForWrite = (): string | null => {
    if (!firebaseUser?.uid) {
      reportFirebaseErrorToUI('No se puede guardar en la nube: el usuario aún no ha iniciado sesión en Firebase.');
      return null;
    }
    if (!initialCloudLoaded) {
      reportFirebaseErrorToUI('Espera unos segundos: cargando datos iniciales desde Firebase Firestore antes de guardar.');
      return null;
    }
    return firebaseUser.uid;
  };

  const handleAddProgressNote = (newNoteData: Omit<ProgressNote, 'id'>) => {
    const uid = ensureReadyForWrite();
    if (!uid) return;
    const newNote: ProgressNote = {
      ...newNoteData,
      id: `pn_${Date.now()}`
    };
    setProgressNotes(prev => {
      const updated = [newNote, ...prev];
      clinicalStorage.saveProgressNotes(updated);
      return updated;
    });
    firebaseClinicalService.saveProgressNote(uid, newNote).catch((err) => {
      console.error('Error guardando nota de progreso en Firestore:', err);
    });
  };

  const handleUpdateProgressNote = (updatedNote: ProgressNote) => {
    const uid = ensureReadyForWrite();
    if (!uid) return;
    setProgressNotes(prev => {
      const updated = prev.map(n => n.id === updatedNote.id ? updatedNote : n);
      clinicalStorage.saveProgressNotes(updated);
      return updated;
    });
    firebaseClinicalService.saveProgressNote(uid, updatedNote).catch((err) => {
      console.error('Error actualizando nota de progreso en Firestore:', err);
    });
  };

  const handleDeleteProgressNote = (noteId: string) => {
    const uid = ensureReadyForWrite();
    if (!uid) return;
    setProgressNotes(prev => {
      const updated = prev.filter(n => n.id !== noteId);
      clinicalStorage.saveProgressNotes(updated);
      return updated;
    });
    firebaseClinicalService.deleteProgressNote(uid, noteId).catch((err) => {
      console.error('Error eliminando nota de progreso en Firestore:', err);
    });
  };

  const handleAddNewPatient = (newPatient: User) => {
    const uid = ensureReadyForWrite();
    if (!uid) return;
    const normalizedPatient: User = {
      ...newPatient,
      role: 'Padre/Niño'
    };
    setUsers(prev => {
      const filtered = prev.filter(u => u.id !== normalizedPatient.id);
      const updated = [...filtered, normalizedPatient];
      clinicalStorage.savePatients(updated);
      return updated;
    });
    clinicalStorage.saveSelectedPatientId(normalizedPatient.id);
    firebaseClinicalService.savePatient(uid, normalizedPatient).catch((err) => {
      console.error('Error guardando usuario en Firestore:', err);
    });
  };

  const handleUpdatePatient = (updatedPatient: User) => {
    const uid = ensureReadyForWrite();
    if (!uid) return;
    const normalizedPatient: User = {
      ...updatedPatient,
      role: 'Padre/Niño'
    };
    setUsers(prev => {
      const exists = prev.some(u => u.id === normalizedPatient.id);
      const updated = exists 
        ? prev.map(u => u.id === normalizedPatient.id ? normalizedPatient : u)
        : [...prev, normalizedPatient];
      clinicalStorage.savePatients(updated);
      return updated;
    });
    clinicalStorage.saveSelectedPatientId(normalizedPatient.id);
    firebaseClinicalService.savePatient(uid, normalizedPatient).catch((err) => {
      console.error('Error actualizando usuario en Firestore:', err);
    });
  };

  const handleSaveAnamnesis = (patientId: string, data: PatientAnamnesis) => {
    const uid = ensureReadyForWrite();
    if (!uid) return;
    setAnamnesisData(prev => {
      const updated = { ...prev, [patientId]: data };
      clinicalStorage.saveAnamnesis(updated);
      return updated;
    });
    firebaseClinicalService.saveAnamnesis(uid, patientId, data).catch((err) => {
      console.error('Error guardando anamnesis en Firestore:', err);
    });
  };

  const handleSaveEvaluations = (patientId: string, data: ClinicalEvaluations) => {
    const uid = ensureReadyForWrite();
    if (!uid) return;
    setEvaluationsData(prev => {
      const updated = { ...prev, [patientId]: data };
      clinicalStorage.saveEvaluations(updated);
      return updated;
    });
    firebaseClinicalService.saveEvaluations(uid, patientId, data).catch((err) => {
      console.error('Error guardando evaluación en Firestore:', err);
    });
  };

  const handleGenerateComprehensiveReport = (newReport: ComprehensiveReport) => {
    const uid = ensureReadyForWrite();
    if (!uid) return;
    setComprehensiveReports(prev => {
      const updated = [newReport, ...prev.filter(r => r.patientId !== newReport.patientId)];
      clinicalStorage.saveReports(updated);
      return updated;
    });
    firebaseClinicalService.saveReport(uid, newReport).catch((err) => {
      console.error('Error guardando informe consolidado en Firestore:', err);
    });
  };

  const handleClearAllPatients = () => {
    // Wipe local state only when explicitly requested
    setUsers(prev => prev.filter(u => u.role !== 'Padre/Niño'));
    setProgressNotes([]);
    setAnamnesisData({});
    setEvaluationsData({});
    setComprehensiveReports([]);
    setReports([]);
    setSessionHistory([]);
    clinicalStorage.clearAllClinicalData();
  };

  // Export full backup as JSON
  const handleExportBackup = () => {
    firebaseClinicalService.exportFullCloudBackup(
      firebaseUser?.uid || 'offline',
      {
        patients: users.filter(u => u.role === 'Padre/Niño'),
        anamnesis: anamnesisData,
        evaluations: evaluationsData,
        progressNotes: progressNotes,
        reports: comprehensiveReports
      }
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign-out error:', err);
    }
    setIsLoggedIn(false);
    setFirebaseUser(null);
    setInitialCloudLoaded(false);
    setActiveLoggedInUserId('');
  };

  // Loading indicator while Firebase verifies authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
          <span className="text-sm font-bold text-slate-700">Verificando sesión segura en Firebase...</span>
          <span className="text-xs text-slate-400">Protección Zero-Trust y Base de Datos en la Nube</span>
        </div>
      </div>
    );
  }

  // If not logged in, render the login view: Enforces "Sin login no se muestra ningún dato"
  if (!isLoggedIn) {
    return (
      <LoginView
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={(newUser) => setUsers(prev => [...prev, newUser])}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        onSelectRole={setCurrentRole}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        unreadCount={chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0)}
        onOpenChat={() => setIsChatOpen(true)}
        onLogout={handleLogout}
        onExportBackup={handleExportBackup}
        cloudSyncStatus={cloudSyncStatus}
      />

      {/* Real Firebase Error Banner (Never hidden) */}
      {firebaseErrorNotice && (
        <div className="bg-rose-600 text-white px-6 py-3 shadow-sm flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 text-rose-200 shrink-0" />
            <span>{firebaseErrorNotice}</span>
          </div>
          <button
            onClick={() => setFirebaseErrorNotice(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar alerta de error de Firebase"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Migration Success / Notice Banner */}
      {migrationNotice && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-3 shadow-sm flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{migrationNotice}</span>
          </div>
          <button
            onClick={() => setMigrationNotice(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar aviso de migración"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Portals */}
      <main className="flex-1">
        {currentRole === 'Profesionales Clínicos' ? (
          <ClinicalPortalView
            clinician={currentUser.role === 'Profesionales Clínicos' ? currentUser : clinicianUser}
            patients={users.filter(u => u.role === 'Padre/Niño')}
            exercises={exercises}
            reports={reports}
            sessionHistory={sessionHistory}
            progressNotes={progressNotes}
            anamnesisData={anamnesisData}
            evaluationsData={evaluationsData}
            comprehensiveReports={comprehensiveReports}
            onAssignExercise={handleAssignExercise}
            onCreateReport={handleCreateReport}
            onAddProgressNote={handleAddProgressNote}
            onUpdateProgressNote={handleUpdateProgressNote}
            onDeleteProgressNote={handleDeleteProgressNote}
            onAddNewPatient={handleAddNewPatient}
            onUpdatePatient={handleUpdatePatient}
            onSaveAnamnesis={handleSaveAnamnesis}
            onSaveEvaluations={handleSaveEvaluations}
            onGenerateComprehensiveReport={handleGenerateComprehensiveReport}
            onClearAllPatients={handleClearAllPatients}
          />
        ) : (
          <>
            {activeTab === 'child' && (
              <ChildAdventureView
                currentUser={currentUser.role === 'Padre/Niño' ? currentUser : childUser}
                exercises={exercises}
                sessionHistory={sessionHistory}
                onStartExercise={handleStartExercise}
                onUpdateAvatar={handleUpdateAvatar}
              />
            )}

            {activeTab === 'clinical' && (
              <ClinicalPortalView
                clinician={currentUser.role === 'Profesionales Clínicos' ? currentUser : clinicianUser}
                patients={users.filter(u => u.role === 'Padre/Niño')}
                exercises={exercises}
                reports={reports}
                sessionHistory={sessionHistory}
                progressNotes={progressNotes}
                anamnesisData={anamnesisData}
                evaluationsData={evaluationsData}
                comprehensiveReports={comprehensiveReports}
                onAssignExercise={handleAssignExercise}
                onCreateReport={handleCreateReport}
                onAddProgressNote={handleAddProgressNote}
                onUpdateProgressNote={handleUpdateProgressNote}
                onDeleteProgressNote={handleDeleteProgressNote}
                onAddNewPatient={handleAddNewPatient}
                onUpdatePatient={handleUpdatePatient}
                onSaveAnamnesis={handleSaveAnamnesis}
                onSaveEvaluations={handleSaveEvaluations}
                onGenerateComprehensiveReport={handleGenerateComprehensiveReport}
                onClearAllPatients={handleClearAllPatients}
              />
            )}

            {activeTab === 'educator' && (
              <EducatorPortalView
                educator={currentUser.role === 'Educadores' ? currentUser : educatorUser}
                students={users.filter(u => u.role === 'Padre/Niño')}
                exercises={exercises}
                onStartActiveBreak={(ex) => handleStartExercise(ex, 'TEA')}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPortalView
                adminUser={currentUser.role === 'Administrador (Neuronexin)' ? currentUser : adminUser}
                allUsers={users}
                exercises={exercises}
                leads={leads}
                onAddCredits={handleAddCredits}
                onTogglePlan={handleTogglePlan}
                onUpdateLeadStatus={(leadId, status) => {
                  setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Interactive Motion Session Modal */}
      {activeExerciseForSession && (
        <ExerciseSessionModal
          exercise={activeExerciseForSession.exercise}
          neurodiversityMode={activeExerciseForSession.neurodiversityMode}
          onClose={() => setActiveExerciseForSession(null)}
          onFinishSession={handleFinishSession}
        />
      )}

      {/* Interdisciplinary Chat Modal */}
      {isChatOpen && (
        <ChatSystemModal
          chats={chats}
          messages={messages}
          currentUserRole={currentRole}
          currentUserId={currentUser.id}
          currentUserName={currentUser.firstName}
          onSendMessage={handleSendMessage}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Minimalist Footnote Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NeuroNexo Adventures · Plataforma de Telerrehabilitación Neurodiversa Pediátrica.</p>
          <div className="flex items-center gap-6">
            <span>Validación Biomecánica con IA</span>
            <span>·</span>
            <span>Compatible con Teletón & Redes PIE Chile</span>
            <span>·</span>
            <span>Privacidad y Bioética Pediátrica</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

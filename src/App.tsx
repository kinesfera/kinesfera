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
import { firebaseClinicalService } from './services/firebaseClinicalService';
import { CheckCircle2, X as CloseIcon, Loader2, Cloud } from 'lucide-react';

export default function App() {
  // Authentication & session state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeLoggedInUserId, setActiveLoggedInUserId] = useState<string>('');
  const [migrationNotice, setMigrationNotice] = useState<string | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Global application states with robust persistent storage
  const [users, setUsers] = useState<User[]>(() => {
    const savedPatients = clinicalStorage.loadPatients();
    const baseStaff = INITIAL_USERS.filter(u => u.role !== 'Padre/Niño');
    return [...baseStaff, ...savedPatients];
  });
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [sessionHistory, setSessionHistory] = useState<SessionResult[]>(() => clinicalStorage.loadSessionHistory());
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>(() => clinicalStorage.loadProgressNotes());
  const [anamnesisData, setAnamnesisData] = useState<Record<string, PatientAnamnesis>>(() => clinicalStorage.loadAnamnesis());
  const [evaluationsData, setEvaluationsData] = useState<Record<string, ClinicalEvaluations>>(() => clinicalStorage.loadEvaluations());
  const [comprehensiveReports, setComprehensiveReports] = useState<ComprehensiveReport[]>(() => clinicalStorage.loadReports());
  const [leads, setLeads] = useState<LeadProspect[]>(INITIAL_LEADS);

  // Active view & role
  const [currentRole, setCurrentRole] = useState<UserRole>('Profesionales Clínicos');
  const [activeTab, setActiveTab] = useState<'child' | 'clinical' | 'educator' | 'admin'>('clinical');

  // Verify connection to Firestore on initialization (Mandated by Firebase Skill)
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // 1. Listen to Firebase Auth state & safely migrate local data upon login
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(false);
      if (user) {
        setFirebaseUser(user);
        setIsLoggedIn(true);
        setActiveLoggedInUserId(user.uid);

        // Run safe automated migration from localStorage to Firestore
        try {
          setCloudSyncStatus('syncing');
          const migResult = await firebaseClinicalService.migrateLocalStorageToFirestore(user.uid);
          if (migResult.migrated) {
            setMigrationNotice(migResult.message);
          }
          setCloudSyncStatus('synced');
        } catch (migErr) {
          console.warn('Migration completed with notice:', migErr);
          setCloudSyncStatus('synced');
        }
      } else {
        setFirebaseUser(null);
        setIsLoggedIn(false);
        setActiveLoggedInUserId('');
        // Enforce: "Sin login no se muestra ningún dato"
        setUsers(INITIAL_USERS.filter(u => u.role !== 'Padre/Niño'));
        setProgressNotes([]);
        setAnamnesisData({});
        setEvaluationsData({});
        setComprehensiveReports([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Firestore subscriptions for authenticated user
  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const uid = firebaseUser.uid;
    setCloudSyncStatus('syncing');

    const unsubPatients = firebaseClinicalService.subscribePatients(uid, (remotePatients) => {
      if (remotePatients && remotePatients.length > 0) {
        setUsers(prev => {
          const staff = prev.filter(u => u.role !== 'Padre/Niño');
          return [...staff, ...remotePatients];
        });
        clinicalStorage.savePatients(remotePatients);
      }
      setCloudSyncStatus('synced');
    });

    const unsubAnamnesis = firebaseClinicalService.subscribeAnamnesis(uid, (remoteAnamnesis) => {
      if (remoteAnamnesis && Object.keys(remoteAnamnesis).length > 0) {
        setAnamnesisData(remoteAnamnesis);
        clinicalStorage.saveAnamnesis(remoteAnamnesis);
      }
      setCloudSyncStatus('synced');
    });

    const unsubEvaluations = firebaseClinicalService.subscribeEvaluations(uid, (remoteEvaluations) => {
      if (remoteEvaluations && Object.keys(remoteEvaluations).length > 0) {
        setEvaluationsData(remoteEvaluations);
        clinicalStorage.saveEvaluations(remoteEvaluations);
      }
      setCloudSyncStatus('synced');
    });

    const unsubNotes = firebaseClinicalService.subscribeProgressNotes(uid, (remoteNotes) => {
      if (remoteNotes && remoteNotes.length > 0) {
        setProgressNotes(remoteNotes);
        clinicalStorage.saveProgressNotes(remoteNotes);
      }
      setCloudSyncStatus('synced');
    });

    const unsubReports = firebaseClinicalService.subscribeReports(uid, (remoteReports) => {
      if (remoteReports && remoteReports.length > 0) {
        setComprehensiveReports(remoteReports);
        clinicalStorage.saveReports(remoteReports);
      }
      setCloudSyncStatus('synced');
    });

    return () => {
      unsubPatients();
      unsubAnamnesis();
      unsubEvaluations();
      unsubNotes();
      unsubReports();
    };
  }, [firebaseUser?.uid]);

  // Synchronized persistence to local storage as offline cache
  useEffect(() => {
    if (isLoggedIn) {
      clinicalStorage.savePatients(users);
    }
  }, [users, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      clinicalStorage.saveProgressNotes(progressNotes);
    }
  }, [progressNotes, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      clinicalStorage.saveAnamnesis(anamnesisData);
    }
  }, [anamnesisData, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      clinicalStorage.saveEvaluations(evaluationsData);
    }
  }, [evaluationsData, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      clinicalStorage.saveReports(comprehensiveReports);
    }
  }, [comprehensiveReports, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      clinicalStorage.saveSessionHistory(sessionHistory);
    }
  }, [sessionHistory, isLoggedIn]);

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

  const handleAddProgressNote = (newNoteData: Omit<ProgressNote, 'id'>) => {
    const newNote: ProgressNote = {
      ...newNoteData,
      id: `pn_${Date.now()}`
    };
    setProgressNotes(prev => {
      const updated = [newNote, ...prev];
      clinicalStorage.saveProgressNotes(updated);
      return updated;
    });
    if (firebaseUser?.uid) {
      firebaseClinicalService.saveProgressNote(firebaseUser.uid, newNote);
    }
  };

  const handleUpdateProgressNote = (updatedNote: ProgressNote) => {
    setProgressNotes(prev => {
      const updated = prev.map(n => n.id === updatedNote.id ? updatedNote : n);
      clinicalStorage.saveProgressNotes(updated);
      return updated;
    });
    if (firebaseUser?.uid) {
      firebaseClinicalService.saveProgressNote(firebaseUser.uid, updatedNote);
    }
  };

  const handleDeleteProgressNote = (noteId: string) => {
    setProgressNotes(prev => {
      const updated = prev.filter(n => n.id !== noteId);
      clinicalStorage.saveProgressNotes(updated);
      return updated;
    });
    if (firebaseUser?.uid) {
      firebaseClinicalService.deleteProgressNote(firebaseUser.uid, noteId);
    }
  };

  const handleAddNewPatient = (newPatient: User) => {
    setUsers(prev => {
      const filtered = prev.filter(u => u.id !== newPatient.id);
      const updated = [...filtered, newPatient];
      clinicalStorage.savePatients(updated);
      return updated;
    });
    clinicalStorage.saveSelectedPatientId(newPatient.id);
    if (firebaseUser?.uid) {
      firebaseClinicalService.savePatient(firebaseUser.uid, newPatient);
    }
  };

  const handleUpdatePatient = (updatedPatient: User) => {
    setUsers(prev => {
      const exists = prev.some(u => u.id === updatedPatient.id);
      const updated = exists 
        ? prev.map(u => u.id === updatedPatient.id ? updatedPatient : u)
        : [...prev, updatedPatient];
      clinicalStorage.savePatients(updated);
      return updated;
    });
    clinicalStorage.saveSelectedPatientId(updatedPatient.id);
    if (firebaseUser?.uid) {
      firebaseClinicalService.savePatient(firebaseUser.uid, updatedPatient);
    }
  };

  const handleSaveAnamnesis = (patientId: string, data: PatientAnamnesis) => {
    setAnamnesisData(prev => {
      const updated = { ...prev, [patientId]: data };
      clinicalStorage.saveAnamnesis(updated);
      return updated;
    });
    if (firebaseUser?.uid) {
      firebaseClinicalService.saveAnamnesis(firebaseUser.uid, patientId, data);
    }
  };

  const handleSaveEvaluations = (patientId: string, data: ClinicalEvaluations) => {
    setEvaluationsData(prev => {
      const updated = { ...prev, [patientId]: data };
      clinicalStorage.saveEvaluations(updated);
      return updated;
    });
    if (firebaseUser?.uid) {
      firebaseClinicalService.saveEvaluations(firebaseUser.uid, patientId, data);
    }
  };

  const handleGenerateComprehensiveReport = (newReport: ComprehensiveReport) => {
    setComprehensiveReports(prev => {
      const updated = [newReport, ...prev.filter(r => r.patientId !== newReport.patientId)];
      clinicalStorage.saveReports(updated);
      return updated;
    });
    if (firebaseUser?.uid) {
      firebaseClinicalService.saveReport(firebaseUser.uid, newReport);
    }
  };

  const handleClearAllPatients = () => {
    // Wipe patients, evaluations, anamnesis, progress notes and reports
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

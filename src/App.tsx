/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { ChildAdventureView } from './components/ChildAdventureView';
import { ClinicalPortalView } from './components/ClinicalPortalView';
import { EducatorPortalView } from './components/EducatorPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { ExerciseSessionModal } from './components/ExerciseSessionModal';
import { ChatSystemModal } from './components/ChatSystemModal';

export default function App() {
  // Global application states
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [sessionHistory, setSessionHistory] = useState<SessionResult[]>(INITIAL_SESSION_HISTORY);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>(INITIAL_PROGRESS_NOTES);
  const [anamnesisData, setAnamnesisData] = useState<Record<string, PatientAnamnesis>>(INITIAL_ANAMNESIS);
  const [evaluationsData, setEvaluationsData] = useState<Record<string, ClinicalEvaluations>>(INITIAL_CLINICAL_EVALUATIONS);
  const [comprehensiveReports, setComprehensiveReports] = useState<ComprehensiveReport[]>(INITIAL_COMPREHENSIVE_REPORTS);
  const [leads, setLeads] = useState<LeadProspect[]>(INITIAL_LEADS);

  // Authentication & session state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeLoggedInUserId, setActiveLoggedInUserId] = useState<string>('user_clinician_1');

  // Active view & role
  const [currentRole, setCurrentRole] = useState<UserRole>('Profesionales Clínicos');
  const [activeTab, setActiveTab] = useState<'child' | 'clinical' | 'educator' | 'admin'>('clinical');

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

  const handleLogout = () => {
    setIsLoggedIn(false);
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
    setProgressNotes(prev => [newNote, ...prev]);
  };

  const handleUpdateProgressNote = (updatedNote: ProgressNote) => {
    setProgressNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteProgressNote = (noteId: string) => {
    setProgressNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleAddNewPatient = (newPatient: User) => {
    setUsers(prev => [...prev, newPatient]);
  };

  const handleSaveAnamnesis = (patientId: string, data: PatientAnamnesis) => {
    setAnamnesisData(prev => ({ ...prev, [patientId]: data }));
  };

  const handleSaveEvaluations = (patientId: string, data: ClinicalEvaluations) => {
    setEvaluationsData(prev => ({ ...prev, [patientId]: data }));
  };

  const handleGenerateComprehensiveReport = (newReport: ComprehensiveReport) => {
    setComprehensiveReports(prev => [newReport, ...prev.filter(r => r.patientId !== newReport.patientId)]);
  };

  const handleClearAllPatients = () => {
    // Completely wipe all previous patients, evaluations, anamnesis, progress notes and reports
    setUsers(prev => prev.filter(u => u.role !== 'Padre/Niño'));
    setProgressNotes([]);
    setAnamnesisData({});
    setEvaluationsData({});
    setComprehensiveReports([]);
    setReports([]);
    setSessionHistory([]);
    try {
      localStorage.removeItem('kinesfera_saved_patients');
      localStorage.removeItem('kinesfera_saved_anamnesis');
      localStorage.removeItem('kinesfera_saved_evaluations');
      localStorage.removeItem('kinesfera_progress_notes');
    } catch {
      // ignore
    }
  };

  // If not logged in, render the harmonious pastel login view
  if (!isLoggedIn) {
    return (
      <LoginView
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={(newUser) => setUsers(prev => [...prev, newUser])}
        onExploreAsGuest={() => setIsLoggedIn(true)}
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
      />

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

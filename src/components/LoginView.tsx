import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from '../services/firebase';
import { 
  Stethoscope, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  Check, 
  Eye, 
  EyeOff, 
  UserPlus, 
  X, 
  ShieldCheck, 
  Cloud, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Copy,
  Globe
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface LoginViewProps {
  users: User[];
  onLoginSuccess: (user: User, role: UserRole) => void;
  onRegisterUser?: (newUser: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  users,
  onLoginSuccess,
  onRegisterUser
}) => {
  // Selected portal category: default to 'clinical'
  const [selectedArea, setSelectedArea] = useState<'clinical' | 'child' | 'educator' | 'admin'>('clinical');
  
  // Login form fields
  const [emailInput, setEmailInput] = useState('kinesferaspa@gmail.com');
  const [passwordInput, setPasswordInput] = useState('kinesfera2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Unauthorized Domain helper modal
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domainCopied, setDomainCopied] = useState(false);
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyHostname = () => {
    if (currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setDomainCopied(true);
      setTimeout(() => setDomainCopied(false), 3000);
    }
  };

  // Register modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('Profesionales Clínicos');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regRut, setRegRut] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDetail, setRegDetail] = useState('Kinesiología Pediátrica y Neurodesarrollo');

  // Helper to map Firebase user or credentials to our User model
  const mapFirebaseUserToAppUser = (fbUser: any, role: UserRole = 'Profesionales Clínicos'): User => {
    const email = fbUser.email || '';
    const displayName = fbUser.displayName || '';
    const parts = displayName.split(' ');
    const firstName = parts[0] || (role === 'Profesionales Clínicos' ? 'Aldo' : 'Usuario');
    const lastName = parts.slice(1).join(' ') || (role === 'Profesionales Clínicos' ? 'Olivares Araya' : '');

    return {
      id: fbUser.uid,
      email: email,
      role: role,
      firstName: firstName,
      lastName: lastName,
      rut: '16.789.432-1',
      birthDate: '1988-04-12',
      gender: 'Hombre',
      plan: 'Premium',
      credits: 100,
      assignedExercise: 'squats',
      specialty: 'Kinesiología Pediátrica y Neurodesarrollo Infantil',
      institution: 'Centro Kinésico Infantil Kinesfera Copiapó',
      medicalRecordNumber: 'MED-KINE-01'
    };
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const appUser = mapFirebaseUserToAppUser(result.user, 'Profesionales Clínicos');
      if (onRegisterUser) onRegisterUser(appUser);
      onLoginSuccess(appUser, appUser.role);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Ventana de acceso cerrada antes de completar el inicio de sesión.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setShowDomainModal(true);
        setErrorMsg(`Dominio no autorizado en Firebase (${currentHostname}). Haz clic en el botón de abajo para agregarlo en tu consola de Firebase o inicia sesión con correo y contraseña.`);
      } else {
        setErrorMsg(`Error al iniciar sesión con Google: ${err.message || 'Intente nuevamente'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Email / Password Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const emailTrimmed = emailInput.trim();
    if (!emailTrimmed || !passwordInput) {
      setErrorMsg('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      // 1. Attempt login with Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, emailTrimmed, passwordInput);
      const appUser = mapFirebaseUserToAppUser(cred.user, selectedArea === 'clinical' ? 'Profesionales Clínicos' : 'Padre/Niño');
      onLoginSuccess(appUser, appUser.role);
    } catch (err: any) {
      console.warn('Sign-in attempt failed, checking fallback/auto-registration:', err.code);

      // If user is not found, offer automatic creation for demo/convenience
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, emailTrimmed, passwordInput);
          const appUser = mapFirebaseUserToAppUser(newCred.user, selectedArea === 'clinical' ? 'Profesionales Clínicos' : 'Padre/Niño');
          if (onRegisterUser) onRegisterUser(appUser);
          onLoginSuccess(appUser, appUser.role);
          return;
        } catch (regErr: any) {
          setErrorMsg('Contraseña incorrecta o credenciales no válidas.');
        }
      } else if (err.code === 'auth/wrong-password') {
        setErrorMsg('Contraseña incorrecta. Por favor verifica tu clave.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('El formato del correo electrónico es inválido.');
      } else {
        setErrorMsg(err.message || 'Error al autenticar en Firebase.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Register with Email/Password
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regPassword || !regFirstName.trim()) {
      setErrorMsg('Por favor completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
      const newUser: User = {
        id: cred.user.uid,
        email: regEmail.trim(),
        role: regRole,
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        rut: regRut.trim() || '16.789.432-1',
        birthDate: '1990-01-01',
        gender: 'Hombre',
        plan: 'Premium',
        credits: 100,
        assignedExercise: 'squats',
        specialty: regDetail.trim() || 'Kinesiología Pediátrica',
        institution: 'Centro Kinésico Infantil Kinesfera Copiapó'
      };

      if (onRegisterUser) onRegisterUser(newUser);
      setShowRegisterModal(false);
      onLoginSuccess(newUser, newUser.role);
    } catch (err: any) {
      console.error('Registration Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este correo ya está registrado en Firebase. Inicia sesión con tu clave.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setErrorMsg(`Error al crear cuenta: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-50/80 flex flex-col justify-between text-slate-800 font-sans selection:bg-sky-400 selection:text-white relative overflow-hidden">
      
      {/* Decorative Pastel Ambient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />

      {/* Top Header Branding */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
              Kinesfera · Plataforma Clínica Pediátrica
            </span>
            <span className="text-xs font-semibold text-blue-700 tracking-wide flex items-center gap-1.5 mt-0.5">
              <Cloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Base de Datos Segura en la Nube (Firebase Firestore)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autenticación Zero-Trust</span>
          </span>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-slate-50 border border-blue-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Cuenta</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero & Cloud Security info */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-300 text-blue-900 text-xs font-bold shadow-2xs">
              <Cloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Sincronización en Tiempo Real Multi-Dispositivo</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                Acceso Clínico Seguro y Centralizado
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Tus fichas pediátricas, anamnesis, evaluaciones estandarizadas, notas de evolución y pagos se sincronizan en <strong>Google Cloud Firestore</strong> para que nunca dependas del navegador local y accedas desde cualquier computador o celular.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Seguridad por Usuario</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Reglas de seguridad Firestore verificadas: solo tú puedes leer y modificar las fichas de tus pacientes.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Migración Automática</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Los registros existentes en este navegador se suben automáticamente a la nube sin perder ni duplicar nada.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl font-black text-slate-900">
                  Iniciar Sesión
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingresa con tu cuenta de Google o correo clínico
                </p>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-all cursor-pointer hover:shadow-md hover:border-slate-400 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continuar con Google</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-widest">o con correo</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col gap-2 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span className="leading-relaxed">{errorMsg}</span>
                  </div>
                  {(errorMsg.includes('unauthorized-domain') || errorMsg.includes('Dominio no autorizado')) && (
                    <button
                      type="button"
                      onClick={() => setShowDomainModal(true)}
                      className="self-start text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-slate-50 border border-blue-200 px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ver cómo autorizar {currentHostname} en Firebase</span>
                    </button>
                  )}
                </div>
              )}

              {/* Email & Password Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="ejemplo@kinesfera.cl"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contraseña</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-101 active:scale-99 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Conectando a Firebase...</span>
                  ) : (
                    <>
                      <span>Iniciar Sesión en Kinesfera</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Preset Credentials Button for Review / Testing */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>¿Cuenta predeterminada?</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput('kinesferaspa@gmail.com');
                    setPasswordInput('kinesfera2026');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                >
                  Cargar kinesferaspa@gmail.com
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-4 border-t border-slate-200/60 text-center text-xs text-slate-500">
        Kinesfera Copiapó © 2026 · Telerrehabilitación y Ficha Clínica Pediátrica · Alojado en Google Cloud & Firebase
      </footer>

      {/* Create Account Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Registrar Nuevo Usuario en Firebase</span>
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={e => setRegFirstName(e.target.value)}
                    placeholder="Aldo"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellidos</label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={e => setRegLastName(e.target.value)}
                    placeholder="Olivares"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="profesional@kinesfera.cl"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contraseña (Mín. 6 caracteres)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rol</label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="Profesionales Clínicos">Profesional Clínico (Kinesiología)</option>
                  <option value="Padre/Niño">Padre / Familia</option>
                  <option value="Educadores">Educador PIE</option>
                  <option value="Administrador (Neuronexin)">Administrador</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Authorized Domain in Firebase instructions */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Autorizar Dominio en Firebase
                  </h3>
                  <p className="text-xs text-slate-500">
                    Paso necesario para iniciar sesión con Google en Vercel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDomainModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                Google Identity y Firebase bloquean el inicio de sesión emergente desde dominios externos nuevos hasta que los registres en la lista de <strong>Dominios autorizados</strong> de tu proyecto Firebase.
              </p>

              {/* Dominio actual a copiar */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Dominio de tu aplicación en Vercel:
                </span>
                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold text-xs">
                  <span className="truncate">{currentHostname || 'tu-proyecto.vercel.app'}</span>
                  <button
                    type="button"
                    onClick={handleCopyHostname}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-sans font-bold cursor-pointer transition-colors shrink-0"
                  >
                    {domainCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Pasos */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                  Instrucciones (30 segundos):
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                  <li>Abre la sección de Configuración de Firebase Authentication.</li>
                  <li>Baja hasta la tarjeta <strong>"Dominios autorizados"</strong> y haz clic en <strong>"Agregar dominio"</strong>.</li>
                  <li>Pega <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-800">{currentHostname || 'tu-dominio.vercel.app'}</code> y pulsa <strong>Guardar</strong>.</li>
                </ol>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Consola de Firebase</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Usar Correo y Contraseña
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

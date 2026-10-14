import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Compass, 
  Stethoscope, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  Check, 
  Heart,
  Eye,
  EyeOff,
  UserPlus,
  X,
  KeyRound
} from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLoginSuccess: (user: User, role: UserRole) => void;
  onRegisterUser?: (newUser: User) => void;
  onExploreAsGuest?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  users,
  onLoginSuccess,
  onRegisterUser,
  onExploreAsGuest
}) => {
  // Selected portal category: 'child' | 'clinical' | 'educator' | 'admin'
  const [selectedArea, setSelectedArea] = useState<'child' | 'clinical' | 'educator' | 'admin'>('child');
  
  // Login form fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSentNotice, setForgotSentNotice] = useState(false);

  // Register form fields
  const [regRole, setRegRole] = useState<UserRole>('Padre/Niño');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regRut, setRegRut] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDetail, setRegDetail] = useState(''); // Diagnosis or Specialty

  // Pre-configured profiles by area
  const childProfiles = users.filter(u => u.role === 'Padre/Niño');
  const clinicalProfiles = users.filter(u => u.role === 'Profesionales Clínicos');
  const educatorProfiles = users.filter(u => u.role === 'Educadores');
  const adminProfiles = users.filter(u => u.role === 'Administrador (Neuronexin)');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailTrimmed = emailInput.trim().toLowerCase();

    // Look for matching user by email or RUT
    let match = users.find(u => 
      u.email.toLowerCase() === emailTrimmed || 
      u.rut.replace(/\./g, '').toLowerCase() === emailTrimmed.replace(/\./g, '')
    );

    if (match) {
      onLoginSuccess(match, match.role);
    } else {
      // Default to selected area profile if no specific email provided
      let fallbackUser: User | undefined;
      if (selectedArea === 'child') fallbackUser = childProfiles[0];
      else if (selectedArea === 'clinical') fallbackUser = clinicalProfiles[0];
      else if (selectedArea === 'educator') fallbackUser = educatorProfiles[0];
      else fallbackUser = adminProfiles[0];

      if (fallbackUser) {
        onLoginSuccess(fallbackUser, fallbackUser.role);
      } else {
        setErrorMsg('Credenciales no encontradas. Si eres nuevo, haz clic en "Registrarse".');
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regEmail.trim()) return;

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: regEmail.trim(),
      role: regRole,
      firstName: regFirstName.trim(),
      lastName: regLastName.trim() || '',
      rut: regRut.trim() || '26.100.200-3',
      birthDate: regRole === 'Padre/Niño' ? '2022-06-15' : '1990-01-01',
      gender: 'Hombre',
      plan: 'Premium',
      credits: regRole === 'Padre/Niño' ? 50 : 100,
      assignedExercise: 'squats',
      diagnosis: regRole === 'Padre/Niño' ? (regDetail.trim() || 'Evaluación Psicomotriz en Proceso') : undefined,
      specialty: regRole !== 'Padre/Niño' ? (regDetail.trim() || 'Especialista en Neurorehabilitación') : undefined,
      institution: regRole === 'Educadores' ? 'Programa PIE' : 'Centro Clínico NeuroNexo',
      avatarConfig: {
        skinTone: '#F5D0A9',
        hairColor: '#3B2F2F',
        shirtColor: '#2563EB',
        name: `${regFirstName} Aventurero`
      }
    };

    if (onRegisterUser) {
      onRegisterUser(newUser);
    }

    setShowRegisterModal(false);
    onLoginSuccess(newUser, newUser.role);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSentNotice(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSentNotice(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-blue-50/60 to-cyan-50/80 flex flex-col justify-between text-slate-800 font-sans selection:bg-sky-400 selection:text-white relative overflow-hidden">
      
      {/* Decorative Pastel Ambient Orbs (Soft Celeste to Sky Blue) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-blue-200/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-cyan-200/30 blur-3xl pointer-events-none" />

      {/* Top Header Branding */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
              NeuroNexo Adventures
            </span>
            <span className="text-[11px] font-medium text-sky-700 tracking-wide block">
              Plataforma de Telerrehabilitación Neurodiversa Pediátrica
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 bg-white/90 hover:bg-white border border-sky-200 px-3.5 py-1.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Cuenta</span>
          </button>
          {onExploreAsGuest && (
            <button
              onClick={onExploreAsGuest}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Invitado
            </button>
          )}
        </div>
      </header>

      {/* Central Login Card Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 py-6 flex-1 flex flex-col justify-center">
        <div className="bg-white/90 backdrop-blur-xl border border-sky-100 rounded-3xl shadow-xl shadow-sky-900/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
          
          {/* Left Column: Visual Storytelling & Pastel Harmony (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
            
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-md">
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Salud & Neurodesarrollo</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                Rehabilitación con amor, ciencia y juego.
              </h2>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                Un entorno clínico, educativo y familiar diseñado para potenciar el movimiento de cada niño en su propio ritmo.
              </p>
            </div>

            {/* Pastel Highlights */}
            <div className="relative z-10 space-y-3 pt-6 border-t border-white/20 text-xs text-sky-50">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white shrink-0 font-bold text-[10px]">✓</span>
                <span>Adaptaciones sensoriales para TEA, TDAH y Síndrome de Down</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white shrink-0 font-bold text-[10px]">✓</span>
                <span>Plantilla de Progreso con seguimiento de sesiones kinésicas</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white shrink-0 font-bold text-[10px]">✓</span>
                <span>Videojuegos biomecánicos con detección de movimiento</span>
              </div>
            </div>

            <div className="relative z-10 pt-6 text-[11px] text-sky-200">
              Certificado en Tele-Rehabilitación Pediátrica · Chile 2026
            </div>
          </div>

          {/* Right Column: Portal Area Switcher & Authentication Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            
            <div>
              <div className="mb-5">
                <span className="text-[11px] uppercase font-extrabold tracking-wider text-sky-600 block">
                  Portal de Acceso Unificado
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Selecciona tu Área de Ingreso
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Elige tu perfil para acceder a tus herramientas especializadas
                </p>
              </div>

              {/* Area Selector Tabs (Pastel Palette from Celeste to Soft Blue) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                
                {/* 1. Niño / Familia */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArea('child');
                    setErrorMsg(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedArea === 'child'
                      ? 'bg-gradient-to-b from-sky-100 to-sky-200/70 border-sky-400 text-sky-950 shadow-xs ring-2 ring-sky-300/60'
                      : 'bg-white hover:bg-sky-50/50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedArea === 'child' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Compass className="w-4 h-4" />
                    </div>
                    {selectedArea === 'child' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">Niño / Familia</span>
                    <span className="text-[10px] text-slate-500 block">Aventura</span>
                  </div>
                </button>

                {/* 2. Área Clínica */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArea('clinical');
                    setErrorMsg(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedArea === 'clinical'
                      ? 'bg-gradient-to-b from-blue-100 to-blue-200/70 border-blue-400 text-blue-950 shadow-xs ring-2 ring-blue-300/60'
                      : 'bg-white hover:bg-blue-50/50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedArea === 'clinical' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    {selectedArea === 'clinical' && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">Clínico</span>
                    <span className="text-[10px] text-slate-500 block">Kinesiología</span>
                  </div>
                </button>

                {/* 3. Área Educativa */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArea('educator');
                    setErrorMsg(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedArea === 'educator'
                      ? 'bg-gradient-to-b from-cyan-100 to-cyan-200/70 border-cyan-400 text-cyan-950 shadow-xs ring-2 ring-cyan-300/60'
                      : 'bg-white hover:bg-cyan-50/50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedArea === 'educator' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    {selectedArea === 'educator' && <Check className="w-4 h-4 text-cyan-600" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">Educativo</span>
                    <span className="text-[10px] text-slate-500 block">PIE / Aula</span>
                  </div>
                </button>

                {/* 4. Administrador */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArea('admin');
                    setErrorMsg(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedArea === 'admin'
                      ? 'bg-gradient-to-b from-slate-100 to-slate-200 border-slate-400 text-slate-900 shadow-xs ring-2 ring-slate-300'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedArea === 'admin' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    {selectedArea === 'admin' && <Check className="w-4 h-4 text-slate-700" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">Admin</span>
                    <span className="text-[10px] text-slate-500 block">Neuronexin</span>
                  </div>
                </button>

              </div>

              {/* Standard Form Authentication */}
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Correo Electrónico o RUT
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder={
                        selectedArea === 'child'
                          ? 'correo@familia.cl o RUT del paciente'
                          : selectedArea === 'clinical'
                          ? 'correo@profesional.cl o RUT profesional'
                          : selectedArea === 'educator'
                          ? 'correo@escuela.cl o RUT educador'
                          : 'admin@kinesfera.cl o RUT'
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-hidden text-xs"
                    />
                  </div>
                </div>

                <div>
                  {/* Where it says "¿Olvidaste tu contraseña?", now includes the option to Register! */}
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <label className="font-bold text-slate-700">Contraseña</label>
                    
                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedArea === 'child') setRegRole('Padre/Niño');
                          else if (selectedArea === 'clinical') setRegRole('Profesionales Clínicos');
                          else if (selectedArea === 'educator') setRegRole('Educadores');
                          else setRegRole('Administrador (Neuronexin)');
                          setShowRegisterModal(true);
                        }}
                        className="font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
                      >
                        Registrarse
                      </button>
                      <span className="text-slate-300 font-semibold">·</span>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-hidden text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded-sm border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>Recordar sesión en este dispositivo</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>Iniciar Sesión en Área {selectedArea === 'child' ? 'Niño / Familia' : selectedArea === 'clinical' ? 'Clínica' : selectedArea === 'educator' ? 'Educativa' : 'Administración'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
              <div>
                <span>¿Aún no tienes cuenta? </span>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="font-bold text-sky-600 hover:text-sky-800 underline cursor-pointer"
                >
                  Regístrate aquí
                </button>
              </div>
              <span className="text-slate-400">Protección de Datos Pediátricos (Ley 20.584)</span>
            </div>

          </div>

        </div>
      </main>

      {/* Harmonious Minimal Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-800/80">
        <p>© 2026 NeuroNexo Adventures · Sistema de Telerrehabilitación Neurodiversa.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Colores Pasteles Terapéuticos</span>
          <span>·</span>
          <span>Neurodivergencia & PIE</span>
          <span>·</span>
          <span>Colegio de Kinesiólogos de Chile</span>
        </div>
      </footer>

      {/* MODAL 1: REGISTRARSE (Sign Up) */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-sky-100 rounded-3xl shadow-2xl max-w-lg w-full p-7 space-y-4 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-sky-600 block">
                  Nuevo Usuario
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-sky-600" />
                  <span>Crear Cuenta en NeuroNexo</span>
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              
              {/* Role Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tipo de Cuenta / Rol *
                </label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-sky-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-semibold outline-hidden"
                >
                  <option value="Padre/Niño">Niño / Familia (Aventura)</option>
                  <option value="Profesionales Clínicos">Profesional Clínico (Kinesiólogo/Terapeuta)</option>
                  <option value="Educadores">Educador (Programa PIE / Escuela)</option>
                  <option value="Administrador (Neuronexin)">Administrador Institucional</option>
                </select>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre"
                    value={regFirstName}
                    onChange={e => setRegFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Apellido</label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={regLastName}
                    onChange={e => setRegLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                  />
                </div>
              </div>

              {/* RUT & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">RUT</label>
                  <input
                    type="text"
                    placeholder="RUT"
                    value={regRut}
                    onChange={e => setRegRut(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.cl"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Diagnosis or Specialty */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {regRole === 'Padre/Niño' 
                    ? 'Diagnóstico o Motivo de Consulta' 
                    : 'Especialidad / Centro o Escuela'}
                </label>
                <input
                  type="text"
                  placeholder={
                    regRole === 'Padre/Niño'
                      ? 'Motivo de consulta o diagnóstico inicial'
                      : 'Especialidad profesional o institución'
                  }
                  value={regDetail}
                  onChange={e => setRegDetail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contraseña *</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  Registrarse e Iniciar Sesión
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ¿OLVIDASTE TU CONTRASEÑA? */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-sky-100 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-sky-600 block">
                  Seguridad de Acceso
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-sky-600" />
                  <span>Recuperar Contraseña</span>
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSentNotice ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">¡Instrucciones enviadas!</h4>
                <p>
                  Hemos enviado un enlace seguro para restablecer tu contraseña a <strong>{forgotEmail || 'tu correo'}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3.5 text-xs">
                <p className="text-slate-500 leading-relaxed">
                  Ingresa el correo electrónico o RUT asociado a tu cuenta. Te enviaremos un enlace seguro para restablecer tu clave.
                </p>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Correo Electrónico o RUT registrado
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. correo@ejemplo.cl o 26.840.119-3"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Enviar Enlace de Recuperación
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

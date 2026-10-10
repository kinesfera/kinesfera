import React, { useState } from 'react';
import { Exercise, User, SessionResult, AvatarConfig } from '../types';
import { 
  Play, 
  Star, 
  Sparkles, 
  Trophy, 
  Sliders, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  Heart,
  Palette
} from 'lucide-react';

interface ChildAdventureViewProps {
  currentUser: User;
  exercises: Exercise[];
  sessionHistory: SessionResult[];
  onStartExercise: (exercise: Exercise, mode: 'standard' | 'TEA' | 'TDAH' | 'down' | 'motor') => void;
  onUpdateAvatar: (newConfig: AvatarConfig) => void;
}

export const ChildAdventureView: React.FC<ChildAdventureViewProps> = ({
  currentUser,
  exercises,
  sessionHistory,
  onStartExercise,
  onUpdateAvatar
}) => {
  const [neuroMode, setNeuroMode] = useState<'standard' | 'TEA' | 'TDAH' | 'down' | 'motor'>('TEA');
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  
  // Customizer state
  const [skinTone, setSkinTone] = useState(currentUser.avatarConfig?.skinTone || '#F5D0A9');
  const [hairColor, setHairColor] = useState(currentUser.avatarConfig?.hairColor || '#4A3319');
  const [shirtColor, setShirtColor] = useState(currentUser.avatarConfig?.shirtColor || '#2563EB');
  const [heroName, setHeroName] = useState(currentUser.avatarConfig?.name || 'Comandante Lucas');

  // Total stars calculated
  const totalStars = sessionHistory.reduce((acc, curr) => acc + curr.starsEarned, 8);

  // Find assigned exercise
  const assignedExerciseId = currentUser.assignedExercise || 'squats';
  const assignedExercise = exercises.find(e => e.id === assignedExerciseId) || exercises[0];

  const handleSaveAvatar = () => {
    onUpdateAvatar({
      skinTone,
      hairColor,
      shirtColor,
      name: heroName
    });
    setShowAvatarCustomizer(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      
      {/* Hero Welcome Section with Visual Presence */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-10">
          
          {/* Avatar & Player Card */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-indigo-400/40 shadow-2xl bg-indigo-950">
                <img
                  src="/src/assets/images/avatar_child_player_1791671211827.jpg"
                  alt="Avatar del Aventurero"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <button
                onClick={() => setShowAvatarCustomizer(!showAvatarCustomizer)}
                className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg border border-indigo-400/30 transition-transform active:scale-95 cursor-pointer"
                title="Personalizar Avatar"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nivel 3 · Guardián de las Galaxias</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
                {currentUser.avatarConfig?.name || `¡Hola, ${currentUser.firstName}!`}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Ficha: <strong className="text-slate-300 font-mono">{currentUser.rut}</strong> · Plan {currentUser.plan}
              </p>
            </div>

            {/* Quick Stats Pill Replacement */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white font-mono tabular-nums">{totalStars}</span> Estrellas
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-bold text-white font-mono tabular-nums">{sessionHistory.length + 3}</span> Misiones
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white font-mono tabular-nums">{currentUser.credits}</span> Créditos
              </span>
            </div>
          </div>

          {/* Active Mission Spotlight (Prescribed Exercise) */}
          <div className="lg:col-span-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Misión Recetada por Kinesiología
                </span>
                <span className="text-xs text-slate-400">
                  Indicación: Dra. Elena Ramírez
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {assignedExercise.friendlyName}
              </h2>
              <p className="text-sm text-slate-200 mt-2 max-w-xl leading-relaxed">
                {assignedExercise.description}
              </p>
            </div>

            {/* Neurodiversity Sensory Setting Control */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sliders className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Configuración Sensorial Neurodiversa:</span>
                </span>
                <span className="text-[11px] text-indigo-300">
                  Adaptado para {neuroMode.toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'TEA', label: 'Modo TEA (Calmante)' },
                  { id: 'TDAH', label: 'Modo TDAH (Dinámico)' },
                  { id: 'down', label: 'Modo Síndrome de Down' },
                  { id: 'motor', label: 'Adaptación Motora' },
                  { id: 'standard', label: 'Estándar' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setNeuroMode(mode.id as 'standard' | 'TEA' | 'TDAH' | 'down' | 'motor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      neuroMode === mode.id
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-white/5 hover:bg-white/15 text-slate-300'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Exercise CTA Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Objetivo: <strong>{assignedExercise.gamification.objective} repeticiones</strong></span>
                <span>·</span>
                <span>Premio: <strong>3 Estrellas</strong></span>
              </div>

              <button
                onClick={() => onStartExercise(assignedExercise, neuroMode)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>¡Iniciar Aventura Ahora!</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Avatar Customizer Dropdown Drawer (if toggled) */}
      {showAvatarCustomizer && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Personalizar Mi Aventurero NeuroNexo</span>
            </h3>
            <button
              onClick={() => setShowAvatarCustomizer(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Nombre de Héroe</label>
              <input
                type="text"
                value={heroName}
                onChange={e => setHeroName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                placeholder="Ej. Comandante Lucas"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Tono de Piel</label>
              <div className="flex items-center gap-2">
                {['#F5D0A9', '#FFE0BD', '#E0AC69', '#C68642', '#8D5524'].map(tone => (
                  <button
                    key={tone}
                    onClick={() => setSkinTone(tone)}
                    style={{ backgroundColor: tone }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      skinTone === tone ? 'scale-110 border-indigo-600 shadow-sm' : 'border-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Color de Pelo</label>
              <div className="flex items-center gap-2">
                {['#4A3319', '#1F2937', '#B8860B', '#A0522D', '#7C2D12'].map(color => (
                  <button
                    key={color}
                    onClick={() => setHairColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      hairColor === color ? 'scale-110 border-indigo-600 shadow-sm' : 'border-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Traje Espacial</label>
              <div className="flex items-center gap-2">
                {['#2563EB', '#059669', '#7C3AED', '#DC2626', '#D97706'].map(shirt => (
                  <button
                    key={shirt}
                    onClick={() => setShirtColor(shirt)}
                    style={{ backgroundColor: shirt }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      shirtColor === shirt ? 'scale-110 border-indigo-600 shadow-sm' : 'border-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAvatar}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Guardar Mi Avatar
            </button>
          </div>
        </div>
      )}

      {/* Available Missions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Biblioteca de Misiones Terapéuticas
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ejercicios validados biomecánicamente para desarrollo psicomotor y propiocepción
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exercises.map((ex) => {
            const isAssigned = ex.id === assignedExerciseId;
            return (
              <div
                key={ex.id}
                className={`bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md ${
                  isAssigned ? 'border-indigo-400 shadow-xs ring-2 ring-indigo-100' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="capitalize">{ex.category.replace('_', ' ')}</span>
                    <span className="capitalize font-medium">Dificultad {ex.difficulty}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {ex.friendlyName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {ex.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Meta: <strong className="text-slate-800">{ex.gamification.objective} {ex.gamification.type === 'tiempo' ? 'seg' : 'reps'}</strong></span>
                    <span>Edad: {ex.ageRange.min}–{ex.ageRange.max} años</span>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    onClick={() => onStartExercise(ex, neuroMode)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isAssigned
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isAssigned ? 'Entrenar Misión Asignada' : 'Jugar Esta Misión'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History of Completed Sessions (Journey Log) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Bitácora de Logros y Entrenamientos Realizados</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Registros cinemáticos enviados automáticamente al expediente clínico
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {sessionHistory.length} sesiones registradas
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sessionHistory.map((s, idx) => {
            const exInfo = exercises.find(e => e.id === s.exerciseId);
            return (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">
                      {exInfo?.friendlyName || s.exerciseId}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{new Date(s.timestamp).toLocaleDateString('es-CL')}</span>
                      <span>·</span>
                      <span>Modo {s.neurodiversityMode.toUpperCase()}</span>
                      <span>·</span>
                      <span>Duración: {s.durationSeconds}s</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="text-xs">
                    <span className="text-slate-500 block text-[10px]">Precisión</span>
                    <span className="font-bold text-emerald-600 font-mono tabular-nums">{s.accuracy}%</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map(st => (
                      <Star
                        key={st}
                        className={`w-4 h-4 ${
                          st <= s.starsEarned
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Therapeutic Foundations Badge Footer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>NeuroNexo Adventures está regulado bajo directrices de tele-rehabilitación pediátrica (Colegio de Kinesiólogos de Chile).</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400 shrink-0">v2.4 TeleRehab</span>
      </div>

    </div>
  );
};

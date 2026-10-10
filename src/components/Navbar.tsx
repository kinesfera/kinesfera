import React from 'react';
import { UserRole, User } from '../types';
import { Sparkles, MessageSquare, Shield, Users, Stethoscope, Compass, LogOut } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentUser?: User;
  onSelectRole: (role: UserRole) => void;
  activeTab: 'child' | 'clinical' | 'educator' | 'admin';
  onChangeTab: (tab: 'child' | 'clinical' | 'educator' | 'admin') => void;
  unreadCount: number;
  onOpenChat: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onSelectRole,
  activeTab,
  onChangeTab,
  unreadCount,
  onOpenChat,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-3.5">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <button 
            onClick={() => onChangeTab('child')}
            className="text-left cursor-pointer focus:outline-hidden"
          >
            <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap block">
              NeuroNexo Adventures
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onChangeTab('child')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'child'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Aventura Niño</span>
          </button>

          <button
            onClick={() => {
              onChangeTab('clinical');
              if (currentRole !== 'Profesionales Clínicos') {
                onSelectRole('Profesionales Clínicos');
              }
            }}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'clinical'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Portal Clínico</span>
          </button>

          <button
            onClick={() => {
              onChangeTab('educator');
              if (currentRole !== 'Educadores') {
                onSelectRole('Educadores');
              }
            }}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'educator'
                ? 'text-cyan-600 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Portal PIE</span>
          </button>

          <button
            onClick={() => {
              onChangeTab('admin');
              if (currentRole !== 'Administrador (Neuronexin)') {
                onSelectRole('Administrador (Neuronexin)');
              }
            }}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'admin'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Institución</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Active User Name Chip */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-sky-50/80 border border-sky-100 rounded-lg text-xs text-sky-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold truncate max-w-[130px]">{currentUser.firstName} {currentUser.lastName}</span>
            </div>
          )}

          {/* Chat Quick Access */}
          <button
            onClick={onOpenChat}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            title="Abrir Chat Interdisciplinario"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Quick Switcher */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <select
              value={currentRole}
              onChange={(e) => {
                const role = e.target.value as UserRole;
                onSelectRole(role);
                if (role === 'Padre/Niño') onChangeTab('child');
                else if (role === 'Profesionales Clínicos') onChangeTab('clinical');
                else if (role === 'Educadores') onChangeTab('educator');
                else if (role === 'Administrador (Neuronexin)') onChangeTab('admin');
              }}
              className="text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="Padre/Niño">Niño / Familia</option>
              <option value="Profesionales Clínicos">Clínico</option>
              <option value="Educadores">Educativo PIE</option>
              <option value="Administrador (Neuronexin)">Admin</option>
            </select>
          </div>

          {/* Change Account / Logout Button returning to harmonious login view */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg border border-sky-200/80 transition-colors cursor-pointer"
              title="Cambiar de cuenta o volver a la pantalla de inicio de sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

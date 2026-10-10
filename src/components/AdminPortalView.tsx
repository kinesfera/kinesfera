import React, { useState } from 'react';
import { User, Exercise, LeadProspect, LeadStatus } from '../types';
import { 
  Shield, 
  Building2, 
  Sparkles, 
  Download, 
  Search, 
  Phone, 
  Mail, 
  MessageCircle, 
  UserPlus, 
  Briefcase, 
  Users, 
  Check, 
  DollarSign
} from 'lucide-react';

interface AdminPortalViewProps {
  adminUser: User;
  allUsers: User[];
  exercises: Exercise[];
  leads: LeadProspect[];
  onAddCredits: (userId: string, amount: number) => void;
  onTogglePlan: (userId: string) => void;
  onUpdateLeadStatus?: (leadId: string, newStatus: LeadStatus) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  adminUser,
  allUsers,
  exercises,
  leads,
  onAddCredits,
  onTogglePlan,
  onUpdateLeadStatus
}) => {
  // Tabs: 'leads' (Prospects for future sales) | 'users' | 'exercises' | 'institutions'
  const [selectedTab, setSelectedTab] = useState<'leads' | 'users' | 'exercises' | 'institutions'>('leads');
  
  // Search and status filter for leads
  const [leadSearch, setLeadSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  const institutions = [
    { name: 'Instituto Teletón Santiago', type: 'Centro de Rehabilitación Pediátrica', patients: 24, status: 'Activo' },
    { name: 'Centro Clínico NeuroDesarrollo Las Condes', type: 'Clínica Privada', patients: 18, status: 'Activo' },
    { name: 'Colegio Antares de la Reina (PIE)', type: 'Programa de Integración Escolar', patients: 12, status: 'Activo' },
    { name: 'Hospital de Niños Dr. Exequiel González Cortés', type: 'Servicio de Salud Público (FONASA)', patients: 35, status: 'Activo' }
  ];

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.fullName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      (l.institution && l.institution.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.interestDetails && l.interestDetails.toLowerCase().includes(leadSearch.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export full leads base to CSV for CRM or future sales
  const handleExportLeadsCSV = () => {
    const headers = [
      'NOMBRE COMPLETO',
      'CORREO ELECTRONICO',
      'TELEFONO / WHATSAPP',
      'PERFIL / SEGMENTO',
      'INSTITUCION / CLINICA',
      'REGION',
      'COMUNA',
      'DETALLES DE INTERES / PACIENTES',
      'ESTADO COMERCIAL',
      'NOTAS DE VENTA',
      'FECHA DE REGISTRO',
      'AUTORIZACION CONTACTO'
    ];

    const rows = leads.map(l => [
      `"${l.fullName}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.roleType}"`,
      `"${l.institution || ''}"`,
      `"${l.region || ''}"`,
      `"${l.commune || ''}"`,
      `"${(l.interestDetails || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.commercialNotes || '').replace(/"/g, '""')}"`,
      `"${new Date(l.registeredAt).toLocaleString('es-CL')}"`,
      `"${l.consentContact ? 'SI' : 'NO'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `NeuroNexo_Base_Leads_Comerciales_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessNotice(`Base de datos de ${leads.length} prospectos comerciales exportada con éxito en CSV.`);
    setTimeout(() => setDownloadSuccessNotice(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Admin Top Dashboard Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-sky-600/30">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consola Maestra de Administración y Ventas</span>
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5">
              NeuroNexo Central · {adminUser.firstName} {adminUser.lastName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Plataforma de Telerrehabilitación Neurodiversa · Chile & Latam
            </p>
          </div>
        </div>

        {/* Global Key Metrics Strip */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Leads Registrados</span>
            <span className="text-xl font-bold text-sky-400 font-mono">{leads.length}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pacientes Activos</span>
            <span className="text-xl font-bold text-white font-mono">{allUsers.filter(u => u.role === 'Padre/Niño').length}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Centros de Salud</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{institutions.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedTab('leads')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            selectedTab === 'leads'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4 text-sky-400" />
          <span>Base de Prospectos & Ventas (Leads)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/20 text-white">
            {leads.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            selectedTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Gestión de Usuarios y Planes</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/20 text-white">
            {allUsers.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('institutions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            selectedTab === 'institutions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Centros Clínicos y Escuelas</span>
        </button>

        <button
          onClick={() => setSelectedTab('exercises')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            selectedTab === 'exercises'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Parámetros de Detección IA</span>
        </button>
      </div>

      {downloadSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccessNotice}</span>
        </div>
      )}

      {/* TAB 1: BASE DE PROSPECTOS Y LEADS DE VENTA (Requested feature!) */}
      {selectedTab === 'leads' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-0">
          
          {/* Header of Leads CRM */}
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-600 block">
                Base Comercial & Registro de Oportunidades
              </span>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <Briefcase className="w-5 h-5 text-sky-600" />
                <span>Base de Prospectos Registrados para Futura Venta</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Datos recolectados desde el formulario de registro: familias, clínicas, profesionales y escuelas interesadas
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportLeadsCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Descargar base completa de prospectos en formato CSV para Excel/CRM"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Base de Leads (CSV)</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards for Sales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 border-b border-slate-200 bg-white">
            <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-xl">
              <span className="text-[10px] font-bold text-sky-700 uppercase block">Total Leads</span>
              <span className="text-2xl font-black text-sky-950 font-mono tabular-nums">{leads.length}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Registrados en la plataforma</span>
            </div>
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">En Demostración</span>
              <span className="text-2xl font-black text-blue-950 font-mono tabular-nums">
                {leads.filter(l => l.status === 'En Demostración').length}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Reuniones de prueba agendadas</span>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Ventas Cerradas</span>
              <span className="text-2xl font-black text-emerald-950 font-mono tabular-nums">
                {leads.filter(l => l.status === 'Venta Cerrada (Premium)').length}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Planes Premium activos</span>
            </div>
            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Nuevos Prospectos</span>
              <span className="text-2xl font-black text-amber-950 font-mono tabular-nums">
                {leads.filter(l => l.status === 'Nuevo Prospecto').length}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Pendientes de primer contacto</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="px-6 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar prospecto por nombre, teléfono, clínica o correo..."
                value={leadSearch}
                onChange={e => setLeadSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs text-slate-500 whitespace-nowrap">Estado:</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
              >
                <option value="all">Todos los Estados</option>
                <option value="Nuevo Prospecto">Nuevo Prospecto</option>
                <option value="Contactado">Contactado</option>
                <option value="En Demostración">En Demostración</option>
                <option value="Venta Cerrada (Premium)">Venta Cerrada (Premium)</option>
                <option value="Seguimiento">Seguimiento</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Prospecto / Contacto</th>
                  <th className="py-3 px-4">Segmento / Rol</th>
                  <th className="py-3 px-4">Institución & Ciudad</th>
                  <th className="py-3 px-4">Interés Comercial / Pacientes</th>
                  <th className="py-3 px-4">Estado del Lead</th>
                  <th className="py-3 px-4 text-right">Acción Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 italic">
                      No se encontraron prospectos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(lead => {
                    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Name and Direct Contact */}
                        <td className="py-3.5 px-4 align-top">
                          <strong className="text-slate-900 block font-bold text-[13px]">{lead.fullName}</strong>
                          <div className="flex flex-col gap-0.5 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <a href={`mailto:${lead.email}`} className="text-sky-600 hover:underline">{lead.email}</a>
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{lead.phone}</span>
                            </span>
                          </div>
                        </td>

                        {/* Role Segment */}
                        <td className="py-3.5 px-4 align-top">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md font-semibold text-[11px] ${
                            lead.roleType === 'Profesionales Clínicos'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : lead.roleType === 'Padre/Niño'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : lead.roleType === 'Educadores'
                              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {lead.roleType}
                          </span>
                        </td>

                        {/* Institution and Location */}
                        <td className="py-3.5 px-4 align-top text-slate-600">
                          <strong className="text-slate-800 block text-xs">{lead.institution || 'Particular'}</strong>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {lead.commune}, {lead.region}
                          </span>
                        </td>

                        {/* Commercial Interest Note */}
                        <td className="py-3.5 px-4 align-top text-slate-700 max-w-xs">
                          <p className="line-clamp-2 leading-relaxed text-xs">
                            {lead.interestDetails}
                          </p>
                          {lead.estimatedPatients && (
                            <span className="text-[10px] text-sky-700 font-semibold block mt-1">
                              Volumen estimado: {lead.estimatedPatients}
                            </span>
                          )}
                        </td>

                        {/* Lead Status Selector */}
                        <td className="py-3.5 px-4 align-top">
                          <select
                            value={lead.status}
                            onChange={(e) => {
                              if (onUpdateLeadStatus) {
                                onUpdateLeadStatus(lead.id, e.target.value as LeadStatus);
                              }
                            }}
                            className={`text-[11px] font-bold rounded-lg px-2 py-1 border outline-hidden cursor-pointer ${
                              lead.status === 'Venta Cerrada (Premium)'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : lead.status === 'En Demostración'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : lead.status === 'Contactado'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="Nuevo Prospecto">Nuevo Prospecto</option>
                            <option value="Contactado">Contactado</option>
                            <option value="En Demostración">En Demostración</option>
                            <option value="Venta Cerrada (Premium)">Venta Cerrada (Premium)</option>
                            <option value="Seguimiento">Seguimiento</option>
                          </select>
                          <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                            {new Date(lead.registeredAt).toLocaleDateString('es-CL')}
                          </span>
                        </td>

                        {/* Quick Contact Actions (WhatsApp / Mail) */}
                        <td className="py-3.5 px-4 text-right align-top whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(lead.fullName)},%20te%20contacto%20desde%20NeuroNexo%20Adventures%20sobre%20tu%20registro...`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs"
                                title="Contactar por WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                            <a
                              href={`mailto:${lead.email}?subject=Bienvenido%20a%20NeuroNexo%20Adventures%20-%20Informaci%C3%B3n%20Comercial`}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] inline-flex items-center gap-1"
                              title="Enviar correo"
                            >
                              <Mail className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: Users & Subscription Management */}
      {selectedTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Población de Usuarios Registrados
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Asignación de suscripción Premium y recarga de créditos para telerehabilitación
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">RUT</th>
                  <th className="py-3 px-4">Plan Actual</th>
                  <th className="py-3 px-4">Créditos</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {user.firstName} {user.lastName}
                      <span className="block text-[11px] font-normal text-slate-400">{user.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {user.role}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {user.rut}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        user.plan === 'Premium' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 tabular-nums">
                      {user.credits}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onAddCredits(user.id, 25)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        +25 Créditos
                      </button>
                      <button
                        onClick={() => onTogglePlan(user.id)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Cambiar a {user.plan === 'Premium' ? 'Gratis' : 'Premium'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Institutions */}
      {selectedTab === 'institutions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {institutions.map(inst => (
            <div key={inst.name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{inst.name}</h3>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {inst.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{inst.type}</p>
                <p className="text-xs text-indigo-600 font-semibold mt-3">
                  {inst.patients} pacientes vinculados a teleterapia
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Exercise Library Parameters */}
      {selectedTab === 'exercises' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exercises.map(ex => (
            <div key={ex.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                  {ex.id}
                </span>
                <span className="text-xs text-slate-400 capitalize">Dificultad {ex.difficulty}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{ex.name}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{ex.description}</p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <strong className="text-slate-800 block text-[11px]">Keypoints Requeridos (IA):</strong>
                <div className="flex flex-wrap gap-1">
                  {ex.detection.requiredKeypoints.map(kp => (
                    <span key={kp} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono text-slate-700">
                      {kp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <p>Rango normal: <strong className="font-mono text-slate-800">[{ex.clinicalIndicators.rangeOfMotion.normal.join('° - ')}°]</strong></p>
                <p>Compensaciones: <span className="text-slate-700">{ex.clinicalIndicators.compensationPatterns.join(', ')}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

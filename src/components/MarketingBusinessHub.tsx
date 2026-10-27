import React, { useState, useEffect } from 'react';
import { 
  MarketingReferralContact, 
  DigitalInquiryCRM, 
  MarketingBusinessTask, 
  SessionPackageOffering,
  InquiryProcessStatus,
  ReferralStatus,
  BusinessTaskStatus
} from '../types';
import { 
  INITIAL_MONTH1_GOALS, 
  INITIAL_REFERRAL_CONTACTS, 
  INITIAL_DIGITAL_INQUIRIES, 
  INITIAL_BUSINESS_TASKS, 
  INITIAL_SESSION_PACKAGES,
  CLINICAL_SCRIPTS,
  META_ADS_CONFIG
} from '../data/marketingData';
import { auth } from '../services/firebase';
import { firebaseClinicalService } from '../services/firebaseClinicalService';
import { 
  TrendingUp, 
  Target, 
  Users, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Phone, 
  Instagram, 
  MapPin, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Sparkles, 
  DollarSign, 
  AlertCircle, 
  Award, 
  FileText, 
  Send,
  Zap,
  Calendar,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MonthlyContentPlanView } from './MonthlyContentPlanView';

export const MarketingBusinessHub: React.FC = () => {
  // Navigation Sub-tab inside Marketing
  const [activeSection, setActiveSection] = useState<
    'goals_dashboard' | 'referrals' | 'crm_inquiries' | 'tasks_schedule' | 'sales_strategy' | 'meta_ads' | 'group_service' | 'content_plans'
  >('goals_dashboard');

  // 1. Data States (Firestore single source of truth when available, with localStorage cache)
  const [referrals, setReferrals] = useState<MarketingReferralContact[]>(() => {
    const saved = localStorage.getItem('kinesfera_referrals');
    return saved ? JSON.parse(saved) : INITIAL_REFERRAL_CONTACTS;
  });

  const [inquiries, setInquiries] = useState<DigitalInquiryCRM[]>(() => {
    const saved = localStorage.getItem('kinesfera_crm_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_DIGITAL_INQUIRIES;
  });

  const [tasks, setTasks] = useState<MarketingBusinessTask[]>(() => {
    const saved = localStorage.getItem('kinesfera_business_tasks');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_TASKS;
  });

  const [packages, setPackages] = useState<SessionPackageOffering[]>(() => {
    const saved = localStorage.getItem('kinesfera_session_packages');
    return saved ? JSON.parse(saved) : INITIAL_SESSION_PACKAGES;
  });

  // Subscribe to Firestore Marketing Plan for authenticated user
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsub = firebaseClinicalService.subscribeMarketingHub(uid, (cloudData) => {
      if (!cloudData) return;
      if (Array.isArray(cloudData.referrals) && cloudData.referrals.length > 0) {
        setReferrals(cloudData.referrals);
        localStorage.setItem('kinesfera_referrals', JSON.stringify(cloudData.referrals));
      }
      if (Array.isArray(cloudData.inquiries) && cloudData.inquiries.length > 0) {
        setInquiries(cloudData.inquiries);
        localStorage.setItem('kinesfera_crm_inquiries', JSON.stringify(cloudData.inquiries));
      }
      if (Array.isArray(cloudData.tasks) && cloudData.tasks.length > 0) {
        setTasks(cloudData.tasks);
        localStorage.setItem('kinesfera_business_tasks', JSON.stringify(cloudData.tasks));
      }
      if (Array.isArray(cloudData.packages) && cloudData.packages.length > 0) {
        setPackages(cloudData.packages);
        localStorage.setItem('kinesfera_session_packages', JSON.stringify(cloudData.packages));
      }
    });

    return () => unsub();
  }, []);

  const persistMarketingToCloud = (patch: Partial<{
    referrals: MarketingReferralContact[];
    inquiries: DigitalInquiryCRM[];
    tasks: MarketingBusinessTask[];
    packages: SessionPackageOffering[];
  }>) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    firebaseClinicalService.saveMarketingHub(uid, patch).catch((err) => {
      console.error('Error guardando Marketing en Firestore:', err);
    });
  };

  // Copied alert state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Search & Filters for Referrals
  const [referralSearch, setReferralSearch] = useState('');
  const [referralStatusFilter, setReferralStatusFilter] = useState<string>('all');
  const [referralSpecialtyFilter, setReferralSpecialtyFilter] = useState<string>('all');

  // Search & Filters for CRM Inquiries
  const [crmSearch, setCrmSearch] = useState('');
  const [crmStatusFilter, setCrmStatusFilter] = useState<string>('all');
  const [crmChannelFilter, setCrmChannelFilter] = useState<string>('all');

  // Modal / Form States
  const [showAddInquiryModal, setShowAddInquiryModal] = useState(false);
  const [newInquiryCaregiver, setNewInquiryCaregiver] = useState('');
  const [newInquiryPatient, setNewInquiryPatient] = useState('');
  const [newInquiryPhone, setNewInquiryPhone] = useState('');
  const [newInquiryChannel, setNewInquiryChannel] = useState<'WhatsApp' | 'Instagram' | 'Recomendación / Boca a Boca' | 'Flayer'>('WhatsApp');
  const [newInquiryReason, setNewInquiryReason] = useState('Estimulación Temprana');
  const [newInquiryReferredBy, setNewInquiryReferredBy] = useState('');
  const [newInquiryNotes, setNewInquiryNotes] = useState('');

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskArea, setNewTaskArea] = useState<'Gestión / Admin' | 'Marketing Digital' | 'Clínica / Atención' | 'Finanzas'>('Marketing Digital');
  const [newTaskResponsible, setNewTaskResponsible] = useState('Aldo');
  const [newTaskPriority, setNewTaskPriority] = useState<'Alta' | 'Media' | 'Baja'>('Alta');
  const [newTaskDueDate, setNewTaskDueDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Meta Ads Generator Interactive State
  const [adBusinessTopic, setAdBusinessTopic] = useState('Tortícolis & Preferencia de Giro');
  const [adTargetChildAge, setAdTargetChildAge] = useState('Lactantes 0-6 meses');
  const [adCityLocation, setAdCityLocation] = useState('Copiapó, Chile');
  const [generatedAdResult, setGeneratedAdResult] = useState<string | null>(null);

  // Quick state update helpers
  const updateReferralStatus = (id: string, newStatus: ReferralStatus, nextStep?: string) => {
    const updated = referrals.map(r => r.id === id ? { ...r, status: newStatus, nextStep: nextStep || r.nextStep } : r);
    setReferrals(updated);
    localStorage.setItem('kinesfera_referrals', JSON.stringify(updated));
    persistMarketingToCloud({ referrals: updated });
  };

  const updateInquiryStatus = (id: string, newStatus: InquiryProcessStatus) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i);
    setInquiries(updated);
    localStorage.setItem('kinesfera_crm_inquiries', JSON.stringify(updated));
    persistMarketingToCloud({ inquiries: updated });
  };

  const updateTaskProgress = (id: string, progress: number) => {
    const status: BusinessTaskStatus = progress === 100 ? 'Completada' : progress > 0 ? 'En Proceso' : 'Pendiente';
    const updated = tasks.map(t => t.id === id ? { ...t, progressPercent: progress, status } : t);
    setTasks(updated);
    localStorage.setItem('kinesfera_business_tasks', JSON.stringify(updated));
    persistMarketingToCloud({ tasks: updated });
  };

  // Add Inquiry Submit
  const handleAddInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiryCaregiver.trim()) return;

    const newInq: DigitalInquiryCRM = {
      id: `inq-${Date.now()}`,
      contactDate: new Date().toISOString().slice(0, 10),
      caregiverName: newInquiryCaregiver.trim(),
      patientName: newInquiryPatient.trim() || 'Hijo/a',
      phone: newInquiryPhone.trim(),
      channel: newInquiryChannel,
      reason: newInquiryReason,
      status: 'Primer Contacto',
      referredBy: newInquiryReferredBy.trim() || undefined,
      notes: newInquiryNotes.trim() || undefined,
      sessionOrPackValue: 35000
    };

    const updated = [newInq, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('kinesfera_crm_inquiries', JSON.stringify(updated));
    persistMarketingToCloud({ inquiries: updated });

    // Reset Form
    setNewInquiryCaregiver('');
    setNewInquiryPatient('');
    setNewInquiryPhone('');
    setNewInquiryNotes('');
    setShowAddInquiryModal(false);
  };

  // Add Task Submit
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) return;

    const newTask: MarketingBusinessTask = {
      id: `TK-0${tasks.length + 1}`,
      description: newTaskDesc.trim(),
      area: newTaskArea,
      responsible: newTaskResponsible,
      priority: newTaskPriority,
      startDate: new Date().toISOString().slice(0, 10),
      dueDate: newTaskDueDate,
      status: 'Pendiente',
      progressPercent: 0,
      weekPhase: 'Semana 1'
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem('kinesfera_business_tasks', JSON.stringify(updated));
    persistMarketingToCloud({ tasks: updated });

    setNewTaskDesc('');
    setShowAddTaskModal(false);
  };

  // Calculated KPI Metrics
  const activePatientsCount = inquiries.filter(i => i.status === 'En Tratamiento Activo' || i.status === 'Pack de Sesiones Pagado').length;
  const activeReferrersCount = referrals.filter(r => r.status === 'Vigente / Alianza Activa').length;
  const contactedReferrersCount = referrals.filter(r => r.status !== 'Prospecto Frío').length;
  const scheduledEvaluationsCount = inquiries.filter(i => i.status === 'Evaluación Agendada').length;
  const totalInquiriesCount = inquiries.length;
  const completedTasksCount = tasks.filter(t => t.status === 'Completada').length;
  const taskProgressPercent = Math.round((completedTasksCount / (tasks.length || 1)) * 100);

  // Generate Ad Hook with AI Template
  const handleGenerateAdCopy = () => {
    const text = `🎯 ANUNCIO GENERADO PARA ${adCityLocation.toUpperCase()}:

TITULAR (Headline):
"Cuello libre y simétrico en tu bebé · Copiapó"

TEXTO PRINCIPAL (Primary Text):
¿Tu bebé siempre mira hacia el mismo lado cuando duerme o toma pecho? En los primeros meses su cráneo y cuello son altamente moldeables. En Kinesfera evaluamos con goniometría y liberamos contracturas con técnicas manuales suaves y sin dolor. Agenda tu evaluación hoy en Copiapó.

3 GANCHOS DE PRUEBA A/B:
1. "El error más común al ver que tu bebé solo gira la cabeza hacia la derecha."
2. "¿Sabías que esperar a que 'se le acomode solo' puede aplanar su cabecita?"
3. "No es maña ni postura favorita: esa tensión cervical se resuelve en pocas semanas."

LLAMADO A LA ACCIÓN (CTA):
Enviar mensaje por WhatsApp para agendar evaluación presencial.`;
    setGeneratedAdResult(text);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: 3 Strategic Pillars of Growth */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                Plan Estratégico de Crecimiento
              </span>
              <span className="text-[10px] font-bold text-sky-200 bg-white/10 px-2 py-0.5 rounded-full">
                Copiapó & Región de Atacama
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-sky-400" />
              <span>Marketing, Ventas Éticas & Captación de Pacientes</span>
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-3xl leading-relaxed">
              Consolidación de las 3 áreas prioritarias del asesoramiento: <strong>1. Captación Directa</strong> (Motor de derivadores y ex-pacientes), <strong>2. Confianza Digital</strong> (Meta Ads, contenido y WhatsApp) y <strong>3. Preparación del Nuevo Servicio Grupal</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveSection('content_plans')}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ring-2 ring-amber-300/60"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Plan Contenidos (Noviembre)</span>
            </button>
            <button
              onClick={() => setShowAddInquiryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva Consulta CRM</span>
            </button>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva Tarea</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-sky-300 flex items-center justify-center shrink-0 font-bold">1</div>
            <div>
              <strong className="text-white block font-bold">Captación Directa</strong>
              <span className="text-sky-200 text-[11px] block mt-0.5">
                Alianzas con pediatras y neurólogos en Copiapó + Reactivación de ex-pacientes.
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 font-bold">2</div>
            <div>
              <strong className="text-white block font-bold">Confianza Digital</strong>
              <span className="text-indigo-200 text-[11px] block mt-0.5">
                12 publicaciones (lun/mié/vie), Meta Ads locales y respuesta rápida por WhatsApp.
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">3</div>
            <div>
              <strong className="text-white block font-bold">Servicio Grupal</strong>
              <span className="text-emerald-200 text-[11px] block mt-0.5">
                Estructura de taller psicomotriz, validación de necesidad y filtros de ingreso.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Marketing Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveSection('goals_dashboard')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'goals_dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>1. Metas Mes 1 & Tablero</span>
          </button>

          <button
            onClick={() => setActiveSection('referrals')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'referrals'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Motor de Derivadores ({referrals.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('crm_inquiries')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'crm_inquiries'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>3. CRM Consultas Digitales ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('tasks_schedule')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'tasks_schedule'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>4. Tareas & Cronograma ({completedTasksCount}/{tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('sales_strategy')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'sales_strategy'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>5. Ventas Éticas & Paquetes</span>
          </button>

          <button
            onClick={() => setActiveSection('meta_ads')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'meta_ads'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>6. Kit Meta Ads Copiapó</span>
          </button>

          <button
            onClick={() => setActiveSection('group_service')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'group_service'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>7. Servicio Grupal</span>
          </button>

          <button
            onClick={() => setActiveSection('content_plans')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'content_plans'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>8. Plan de Contenidos por Mes</span>
            <span className="text-[10px] bg-amber-200 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
              Noviembre Activo
            </span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 1: METAS MES 1 Y TABLERO EJECUTIVO                            */}
      {/* ===================================================================== */}
      {activeSection === 'goals_dashboard' && (
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Pacientes Activos</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {activePatientsCount} <span className="text-xs text-slate-400 font-normal">/ meta {INITIAL_MONTH1_GOALS.activePatientsTargetMin}-{INITIAL_MONTH1_GOALS.activePatientsTargetMax}</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                {activePatientsCount >= INITIAL_MONTH1_GOALS.activePatientsTargetMin ? '✓ Meta cumplida' : 'En progreso'}
              </span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Derivadores Activos</span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {activeReferrersCount} <span className="text-xs text-slate-400 font-normal">/ meta {INITIAL_MONTH1_GOALS.referrersTargetActive}</span>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                {contactedReferrersCount} contactados en Copiapó
              </span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Consultas Digitales</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {totalInquiriesCount} <span className="text-xs text-slate-400 font-normal">/ meta 10-20</span>
              </div>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1">
                WhatsApp + Instagram
              </span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Evaluaciones Agendadas</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {scheduledEvaluationsCount} <span className="text-xs text-slate-400 font-normal">/ meta 6-10</span>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Flujo de conversión activo
              </span>
            </div>
          </div>

          {/* Tabla de Metas del Primer Mes y Criterio de Cumplimiento */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Matriz de Metas del Primer Mes (Asesoría Kinesfera)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Control objetivo de cumplimiento para asegurar la tracción financiera y clínica inicial.
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full">
                Mes 1 de Activación
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3 font-bold">Área</th>
                    <th className="py-2.5 px-3 font-bold">Meta Mes 1</th>
                    <th className="py-2.5 px-3 font-bold">Criterio de Cumplimiento</th>
                    <th className="py-2.5 px-3 font-bold text-right">Estado Actual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-800">Pacientes activos</td>
                    <td className="py-3 px-3 font-semibold text-blue-600">6 a 8 pacientes activos</td>
                    <td className="py-3 px-3 text-slate-600">Evaluación realizada + sesión pagada o pack de sesiones adquirido.</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold font-mono px-2 py-1 rounded bg-slate-100 text-slate-800">
                        {activePatientsCount} / 8 pacientes
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-800">Ex-pacientes</td>
                    <td className="py-3 px-3 font-semibold text-blue-600">100% contactados</td>
                    <td className="py-3 px-3 text-slate-600">Enviar mensaje de seguimiento a todos los ex-pacientes de los últimos 12 meses.</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold font-mono px-2 py-1 rounded bg-emerald-50 text-emerald-800">
                        100% listados (Reactivación en curso)
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-800">Derivadores</td>
                    <td className="py-3 px-3 font-semibold text-blue-600">10 contactados / 5 con respuesta / 2 activos</td>
                    <td className="py-3 px-3 text-slate-600">Pediatras, fonoaudiólogos, psicólogos infantiles, terapeutas ocupacionales y colegios/jardines.</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold font-mono px-2 py-1 rounded bg-blue-50 text-blue-800">
                        {contactedReferrersCount} cont. / {activeReferrersCount} activos
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-amber-50/50 transition-colors cursor-pointer" onClick={() => setActiveSection('content_plans')}>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>Contenido Digital</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          Ver Plan Mes
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-600">12 publicaciones</td>
                    <td className="py-3 px-3 text-slate-600">3 publicaciones por semana: Lunes, Miércoles y Viernes en Instagram y Facebook.</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSection('content_plans');
                        }}
                        className="font-bold font-mono px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                      >
                        <span>12 / 12 (Noviembre)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-800">Consultas digitales</td>
                    <td className="py-3 px-3 font-semibold text-blue-600">10 a 20 conversaciones</td>
                    <td className="py-3 px-3 text-slate-600">Preguntas reales de padres por DM o WhatsApp, no solo interacciones superficiales.</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold font-mono px-2 py-1 rounded bg-indigo-50 text-indigo-800">
                        {totalInquiriesCount} registradas
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-800">Evaluaciones agendadas</td>
                    <td className="py-3 px-3 font-semibold text-blue-600">6 a 10 evaluaciones</td>
                    <td className="py-3 px-3 text-slate-600">Provenientes de derivadores, ex-pacientes y contenido en redes.</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold font-mono px-2 py-1 rounded bg-amber-50 text-amber-800">
                        {scheduledEvaluationsCount} agendadas
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-bold text-slate-800">Nuevo Servicio Grupal</td>
                    <td className="py-3 px-3 font-semibold text-blue-600">Estructura y protocolos listos</td>
                    <td className="py-3 px-3 text-slate-600">No lanzar a ciegas; primero validar edad, perfil, necesidad y filtros de ingreso.</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold font-mono px-2 py-1 rounded bg-emerald-50 text-emerald-800">
                        Protocolo validado
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 2: MOTOR DE DERIVADORES (DIRECTORIO MÉDICO COPIAPÓ)           */}
      {/* ===================================================================== */}
      {activeSection === 'referrals' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Directorio de Prospección Comercial y Derivadores (Copiapó)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Red estratégica de 30 pediatras, neurólogos, fonoaudiólogos y psicólogos en Copiapó para derivación cruzada de pacientes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar doctor o calle..."
                  value={referralSearch}
                  onChange={e => setReferralSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50 w-48 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={referralStatusFilter}
                onChange={e => setReferralStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
              >
                <option value="all">Todos los Estados</option>
                <option value="Vigente / Alianza Activa">Alianza Activa</option>
                <option value="Solo recibe secretaria">Solo recibe secretaria</option>
                <option value="Prospecto Frío">Prospecto Frío</option>
              </select>
            </div>
          </div>

          {/* Cards Grid of Referrals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {referrals
              .filter(r => {
                const matchSearch = r.name.toLowerCase().includes(referralSearch.toLowerCase()) || 
                  r.institutionOrAddress.toLowerCase().includes(referralSearch.toLowerCase()) ||
                  r.specialty.toLowerCase().includes(referralSearch.toLowerCase());
                const matchStatus = referralStatusFilter === 'all' || r.status === referralStatusFilter;
                return matchSearch && matchStatus;
              })
              .map(ref => (
                <div key={ref.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                          {ref.specialty}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">
                          {ref.name}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        ref.status === 'Vigente / Alianza Activa' ? 'bg-emerald-100 text-emerald-800' :
                        ref.status === 'Solo recibe secretaria' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {ref.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ref.institutionOrAddress}</span>
                    </div>

                    {ref.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1.5 bg-slate-50 p-2 rounded-lg">
                        {ref.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Próximo paso:</span>
                      <strong className="text-slate-800">{ref.nextStep}</strong>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => updateReferralStatus(ref.id, 'Vigente / Alianza Activa', 'Llevar más flyers y resultados')}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] text-center transition-all cursor-pointer"
                      >
                        ✓ Activar Alianza
                      </button>

                      <button
                        type="button"
                        onClick={() => updateReferralStatus(ref.id, 'Solo recibe secretaria', 'Visita de presentación')}
                        className="py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] transition-all cursor-pointer"
                      >
                        Secretaria
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 3: CRM DE CONSULTAS DIGITALES & CONVERSIONES                  */}
      {/* ===================================================================== */}
      {activeSection === 'crm_inquiries' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Header Strip & Metrics */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Panel de Control de Consultas y Conversiones (CRM)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Seguimiento de mensajes recibidos por WhatsApp, Instagram y Boca a Boca hasta el cierre de evaluación o pack.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddInquiryModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ingresar Consulta</span>
              </button>
            </div>
          </div>

          {/* CRM Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50">
                    <th className="py-3 px-4 font-bold">Fecha</th>
                    <th className="py-3 px-4 font-bold">Apoderado / Paciente</th>
                    <th className="py-3 px-4 font-bold">Canal</th>
                    <th className="py-3 px-4 font-bold">Motivo / Derivado por</th>
                    <th className="py-3 px-4 font-bold">Estado del Proceso</th>
                    <th className="py-3 px-4 font-bold">Valor</th>
                    <th className="py-3 px-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {inq.contactDate}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{inq.caregiverName}</strong>
                        <span className="text-[11px] text-slate-500 block">Niño: {inq.patientName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{inq.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          inq.channel === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' :
                          inq.channel === 'Instagram' ? 'bg-pink-100 text-pink-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {inq.channel}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{inq.reason}</span>
                        {inq.referredBy && (
                          <span className="text-[10px] text-blue-600 block">Derivó: {inq.referredBy}</span>
                        )}
                        {inq.notes && (
                          <span className="text-[10px] text-slate-400 italic block line-clamp-1">{inq.notes}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={inq.status}
                          onChange={e => updateInquiryStatus(inq.id, e.target.value as InquiryProcessStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer ${
                            inq.status === 'En Tratamiento Activo' || inq.status === 'Pack de Sesiones Pagado'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : inq.status === 'Evaluación Agendada'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : inq.status === 'En Espera / Seguimiento'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Primer Contacto">Primer Contacto</option>
                          <option value="Evaluación Agendada">Evaluación Agendada</option>
                          <option value="En Espera / Seguimiento">En Espera / Seguimiento</option>
                          <option value="En Tratamiento Activo">En Tratamiento Activo</option>
                          <option value="Pack de Sesiones Pagado">Pack de Sesiones Pagado</option>
                          <option value="Alta Terapéutica">Alta Terapéutica</option>
                          <option value="No Interesado / Inactivo">No Interesado / Inactivo</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        ${(inq.sessionOrPackValue || 35000).toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(inq.caregiverName)},%20te%20escribimos%20desde%20Centro%20Cl%C3%ADnico%20Kinesfera%20para%20dar%20seguimiento%20a%20la%20consulta%20de%20${encodeURIComponent(inq.patientName)}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] inline-flex items-center gap-1 shadow-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 4: TAREAS COMERCIALES & OPERATIVAS                            */}
      {/* ===================================================================== */}
      {activeSection === 'tasks_schedule' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Dashboard Summary Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Dashboard de Tareas</span>
              <h3 className="font-extrabold text-base text-slate-900 mt-0.5">Control de Avance Operativo y Comercial</h3>
              <p className="text-xs text-slate-500 mt-1">
                Seguimiento de las tareas prioritarias acordadas con el asesor para el mes 1.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center min-w-[180px]">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">% Cumplimiento Total</span>
              <div className="text-2xl font-black text-blue-600 font-mono mt-0.5">
                {taskProgressPercent}%
              </div>
              <span className="text-[10px] text-slate-600 block mt-0.5">
                {completedTasksCount} de {tasks.length} tareas completadas
              </span>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.area === 'Marketing Digital' ? 'bg-pink-100 text-pink-800' :
                      task.area === 'Gestión / Admin' ? 'bg-indigo-100 text-indigo-800' :
                      task.area === 'Clínica / Atención' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {task.area}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Resp: <strong>{task.responsible}</strong>
                    </span>
                    {task.weekPhase && (
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                        {task.weekPhase}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {task.description}
                  </h4>

                  {task.notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      {task.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-28 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Avance</span>
                      <strong className="font-mono">{task.progressPercent}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${task.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateTaskProgress(task.id, task.progressPercent === 100 ? 50 : 100)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      task.status === 'Completada'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-300'
                    }`}
                    title={task.status === 'Completada' ? 'Marcar incompleta' : 'Marcar completada 100%'}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 5: ESTRATEGIA DE VENTAS ÉTICAS & PAQUETES DE SESIONES         */}
      {/* ===================================================================== */}
      {activeSection === 'sales_strategy' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Paquetes de Sesiones y Precios */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Catálogo de Servicios y Packs</span>
              <h3 className="font-extrabold text-base text-slate-900 mt-0.5">Estructura de Paquetes de Tratamiento para Familias</h3>
              <p className="text-xs text-slate-500 mt-1">
                La venta por paquete asegura el compromiso de la familia con el plan terapéutico completo, evita el abandono precoz y mejora el flujo de ingresos de la clínica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map(pkg => (
                <div key={pkg.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                  <div>
                    {pkg.badge && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block mb-1.5">
                        {pkg.badge}
                      </span>
                    )}
                    <h4 className="font-extrabold text-sm text-slate-900">{pkg.name}</h4>
                    <p className="text-[11px] text-slate-600 mt-1">{pkg.idealFor}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                    <div>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        ${pkg.totalPriceCLP.toLocaleString('es-CL')}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        ${pkg.pricePerSessionCLP.toLocaleString('es-CL')} por sesión ({pkg.sessionCount} sesiones)
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg">
                      ✓ {pkg.discountOrBonus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guiones Clínicos Éticos (Tortícolis y Plagiocefalia) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Guiones Clínicos por Etapas</span>
              <h3 className="font-extrabold text-base text-slate-900 mt-0.5">Cómo Presentar el Plan a la Familia sin Miedo ni Falsa Esperanza</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tortícolis TMC */}
              <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 space-y-3 text-xs">
                <strong className="text-sky-950 font-bold block text-sm">
                  {CLINICAL_SCRIPTS.torticolis.title}
                </strong>
                
                <div className="space-y-1">
                  <span className="font-bold text-sky-900 text-[11px] uppercase">1. En la primera consulta (Reducir Culpa):</span>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-sky-100">
                    {CLINICAL_SCRIPTS.torticolis.firstConsult}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-sky-900 text-[11px] uppercase">2. Uso de Datos Objetivos (Grados de Giro):</span>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-sky-100">
                    {CLINICAL_SCRIPTS.torticolis.objectiveMeasurement}
                  </p>
                </div>
              </div>

              {/* Plagiocefalia */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3 text-xs">
                <strong className="text-amber-950 font-bold block text-sm">
                  {CLINICAL_SCRIPTS.plagiocefalia.title}
                </strong>

                <div className="space-y-1">
                  <span className="font-bold text-amber-900 text-[11px] uppercase">1. En la primera consulta (Ventana de Oro):</span>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-amber-100">
                    {CLINICAL_SCRIPTS.plagiocefalia.firstConsult}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-amber-900 text-[11px] uppercase">2. Medición Antropométrica (Milímetros CVAI):</span>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-amber-100">
                    {CLINICAL_SCRIPTS.plagiocefalia.objectiveMeasurement}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Manejo de Objeciones Frecuentes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Manejo de Objeciones Frecuentes de los Padres</span>
            </h3>

            <div className="space-y-3 text-xs">
              {CLINICAL_SCRIPTS.objections.map((obj, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <strong className="text-slate-800 block text-xs">
                    Objeción: {obj.objection}
                  </strong>
                  <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    Respuesta: {obj.response}
                  </p>
                  <span className="text-[10px] text-blue-600 font-semibold block">
                    Tip Clínico: {obj.tip}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 6: KIT META ADS DESDE CERO (COPIAPÓ)                          */}
      {/* ===================================================================== */}
      {activeSection === 'meta_ads' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Presupuesto y Regla de 3 Segundos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Presupuesto Sugerido</span>
              <h4 className="font-extrabold text-sm text-slate-900">Inversión Publicitaria por Día (Meta Ads)</h4>
              
              <div className="space-y-2 pt-2">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-0.5">
                  <strong className="text-blue-950 block">Solo Copiapó: {META_ADS_CONFIG.budgets.copiapoLocal.range}</strong>
                  <span className="text-[11px] text-blue-800 block">{META_ADS_CONFIG.budgets.copiapoLocal.target}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">Estimado: {META_ADS_CONFIG.budgets.copiapoLocal.monthlyEst}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <strong className="text-slate-900 block">Región Atacama: {META_ADS_CONFIG.budgets.atacamaRegional.range}</strong>
                  <span className="text-[11px] text-slate-600 block">{META_ADS_CONFIG.budgets.atacamaRegional.target}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">Estimado: {META_ADS_CONFIG.budgets.atacamaRegional.monthlyEst}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Fórmula del Anzuelo (Hook)</span>
              <h4 className="font-extrabold text-sm text-slate-900">La Regla de los 3 Segundos para Detener el Scroll</h4>
              
              <div className="space-y-2 text-[11px] text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block font-bold">Paso 1: Identifica el Problema o Deseo</strong>
                  <span>¿Qué le quita el sueño a la mamá o papá? (Ej. "Mi bebé solo mira hacia la derecha").</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block font-bold">Paso 2: Crea Tensión o Curiosidad</strong>
                  <span>Haz una afirmación que rompa mitos (Ej. "Esperar a que se acomode solo puede aplanar su cabeza").</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block font-bold">Paso 3: Promete el Beneficio Concreto</strong>
                  <span>"Recupera la movilidad simétrica con kinesiología suave en pocas semanas".</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banco de Anzuelos y Creativos Listos para Copiar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Biblioteca de Anuncios Validados para Kinesfera</h3>
                <p className="text-xs text-slate-500">Copies y titulares listos para pautar en Meta Ads de Copiapó.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {META_ADS_CONFIG.adHooks.map((ad, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      {ad.topic}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs block mt-1">
                      {ad.headline}
                    </strong>

                    <p className="text-slate-600 text-[11px] mt-2 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                      {ad.primaryText}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Variaciones de Gancho (A/B):</span>
                    <ul className="text-[11px] text-slate-700 space-y-1">
                      <li>• {ad.hook1}</li>
                      <li>• {ad.hook2}</li>
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleCopy(`ad-${idx}`, `${ad.headline}\n\n${ad.primaryText}\n\nGancho: ${ad.hook1}`)}
                      className="w-full mt-2 py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      {copiedId === `ad-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === `ad-${idx}` ? '¡Copiado!' : 'Copiar Anuncio'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 7: PREPARACIÓN DEL NUEVO SERVICIO GRUPAL                      */}
      {/* ===================================================================== */}
      {activeSection === 'group_service' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5 animate-in fade-in">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Estructura & Validación</span>
            <h3 className="font-extrabold text-base text-slate-900 mt-0.5">Taller Grupal de Psicomotricidad & Neurodesarrollo</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Como recomendó la asesoría: "No lanzar a ciegas; primero validar edad, perfil y necesidad, definiendo filtros claros de ingreso antes de abrir cupos".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <h4 className="font-bold text-emerald-950">Filtros de Ingreso al Servicio</h4>
              <ul className="text-slate-700 space-y-1 text-[11px] list-disc pl-4">
                <li>Evaluación individual previa realizada (descarte de patologías agudas).</li>
                <li>Niños con capacidad de interacción motriz en grupo (3 a 5 niños).</li>
                <li>Sin crisis sensoriales no reguladas previamente en consulta 1 a 1.</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <h4 className="font-bold text-blue-950">Grupos por Cohortes de Edad</h4>
              <ul className="text-slate-700 space-y-1 text-[11px] list-disc pl-4">
                <li><strong>Lactantes (6 a 12 meses):</strong> Gateo, sedente y estimulación sensoriomotriz con mamá/papá.</li>
                <li><strong>Preescolares (2 a 4 años):</strong> Psicomotricidad relacional, juego simbólico y equilibrio.</li>
                <li><strong>Escolares (5 a 8 años):</strong> Coordinación dinámica, praxis y regulación de atención.</li>
              </ul>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <h4 className="font-bold text-indigo-950">Modelo Financiero & Pack</h4>
              <ul className="text-slate-700 space-y-1 text-[11px] list-disc pl-4">
                <li>Pack de 4 sesiones mensuales: $60.000 CLP ($15.000 por sesión).</li>
                <li>Grupo de 4 niños = $240.000 CLP de facturación por módulo mensual.</li>
                <li>Mayor rentabilidad por hora clínica que sesión individual estándar.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 8: PLAN MENSUAL DE CONTENIDOS CON ANÁLISIS DE DATOS Y NICHO   */}
      {/* ===================================================================== */}
      {activeSection === 'content_plans' && (
        <MonthlyContentPlanView />
      )}
      {/* MODAL: INGRESAR NUEVA CONSULTA DIGITAL AL CRM                         */}
      {/* ===================================================================== */}
      {showAddInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Ingresar Consulta Digital al CRM</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddInquiryModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInquirySubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre Apoderado/a *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Francisca"
                    value={newInquiryCaregiver}
                    onChange={e => setNewInquiryCaregiver(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre Paciente (Niño/a)</label>
                  <input
                    type="text"
                    placeholder="Ej. Mateo"
                    value={newInquiryPatient}
                    onChange={e => setNewInquiryPatient(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Ej. 56912345678"
                    value={newInquiryPhone}
                    onChange={e => setNewInquiryPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Canal de Entrada</label>
                  <select
                    value={newInquiryChannel}
                    onChange={e => setNewInquiryChannel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Recomendación / Boca a Boca">Recomendación / Boca a Boca</option>
                    <option value="Flayer">Flayer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Motivo de Consulta</label>
                  <input
                    type="text"
                    placeholder="Ej. Plagiocefalia / Tortícolis"
                    value={newInquiryReason}
                    onChange={e => setNewInquiryReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">¿Quién Deriva?</label>
                  <input
                    type="text"
                    placeholder="Ej. Dra. Eith Arias"
                    value={newInquiryReferredBy}
                    onChange={e => setNewInquiryReferredBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notas / Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de la conversación..."
                  value={newInquiryNotes}
                  onChange={e => setNewInquiryNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddInquiryModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Guardar en CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: AGREGAR NUEVA TAREA AL DASHBOARD                               */}
      {/* ===================================================================== */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Agregar Nueva Tarea Operativa</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción de la Tarea *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Enviar mensaje de seguimiento a ex-pacientes"
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Área</label>
                  <select
                    value={newTaskArea}
                    onChange={e => setNewTaskArea(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  >
                    <option value="Marketing Digital">Marketing Digital</option>
                    <option value="Gestión / Admin">Gestión / Admin</option>
                    <option value="Clínica / Atención">Clínica / Atención</option>
                    <option value="Finanzas">Finanzas</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prioridad</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Responsable</label>
                  <input
                    type="text"
                    value={newTaskResponsible}
                    onChange={e => setNewTaskResponsible(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={e => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

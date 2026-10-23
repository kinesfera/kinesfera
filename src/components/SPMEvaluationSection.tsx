import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  SPMEvaluationRecord, 
  SPMAgeCategory 
} from '../types';
import { 
  spmEvaluationService, 
  determineSPMFormByAge, 
  calculateSPMScaleScore,
  DEFAULT_SPM_EVALUATIONS 
} from '../services/spmEvaluationService';
import { 
  getSPMQuestions, 
  SPMQuestion, 
  SPMAgeGroupKey 
} from '../data/spmQuestionnaires';
import { calculatePatientAge } from '../utils/ageHelper';
import { 
  ClipboardCheck, 
  Save, 
  Eye, 
  Volume2, 
  Hand, 
  Coffee, 
  Activity, 
  Brain, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  FileText,
  Download,
  ListChecks,
  BarChart3,
  X
} from 'lucide-react';

interface SPMEvaluationSectionProps {
  patient: User;
  onSaveEvaluation?: (evalRecord: SPMEvaluationRecord) => void;
  onGoToReport?: () => void;
}

export const SPMEvaluationSection: React.FC<SPMEvaluationSectionProps> = ({
  patient,
  onSaveEvaluation,
  onGoToReport
}) => {
  const ageInfo = calculatePatientAge(patient.birthDate);
  const totalMonths = (ageInfo.years * 12) + ageInfo.months;
  const autoRecommendation = determineSPMFormByAge(totalMonths);

  const [activeCategory, setActiveCategory] = useState<SPMAgeCategory>(autoRecommendation.category);
  const [evalRecord, setEvalRecord] = useState<SPMEvaluationRecord | null>(null);
  const [formContext, setFormContext] = useState<'Hogar / Padres' | 'Escuela / Aula'>('Hogar / Padres');
  const [evaluatorName, setEvaluatorName] = useState('Familia / Evaluador');
  const [includeInReport, setIncludeInReport] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Interactive Questionnaire States
  const [viewMode, setViewMode] = useState<'questions_and_scores' | 'questions_only' | 'scores_only'>('questions_and_scores');
  const [selectedScaleFilter, setSelectedScaleFilter] = useState<string>('ALL');
  const [itemResponses, setItemResponses] = useState<Record<number, 1 | 2 | 3 | 4>>({});
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  // Map SPMAgeCategory to SPMAgeGroupKey for question bank
  const mappedAgeGroupKey: SPMAgeGroupKey = useMemo(() => {
    switch (activeCategory) {
      case 'bebes_4_9':
        return 'bebes_4_9';
      case 'toddler_10_30':
        return '10_a_30_meses';
      case 'preescolar_2_5':
        return '2_a_5_anos';
      case 'escolar_5_12':
      case 'adolescente_adulto':
      default:
        return 'mayor_5_anos';
    }
  }, [activeCategory]);

  const currentQuestions: SPMQuestion[] = useMemo(() => {
    const contextKey = formContext === 'Escuela / Aula' ? 'escuela' : 'hogar';
    return getSPMQuestions(mappedAgeGroupKey, contextKey);
  }, [mappedAgeGroupKey, formContext]);

  const filteredQuestions = useMemo(() => {
    if (selectedScaleFilter === 'ALL') return currentQuestions;
    return currentQuestions.filter(q => q.scale === selectedScaleFilter);
  }, [currentQuestions, selectedScaleFilter]);

  // Official PDF URL for the active category
  const getCategoryPdfInfo = (cat: SPMAgeCategory) => {
    switch (cat) {
      case 'bebes_4_9':
        return {
          title: 'SPM-2 Cuestionario Oficial Bebés (4 a 9 meses)',
          url: '/assets/aistudio/ilide.info-spm-2-bebes-4-a-9-meses-pr_604339aa0daad77c6d3025399d0c5995_3843a8f7.pdf',
          itemsCount: '80 preguntas oficiales (4-6 meses y 7-9 meses)'
        };
      case 'toddler_10_30':
        return {
          title: 'SPM-2 Cuestionario Oficial Niños Pequeños (10 a 30 meses)',
          url: '/assets/aistudio/SPM_10-30_meses_5312c45e.pdf',
          itemsCount: '80 preguntas oficiales (10-30 meses Toddler Form)'
        };
      case 'preescolar_2_5':
        return {
          title: formContext === 'Escuela / Aula'
            ? 'SPM-Preescolar Cuestionario Escolar (2 a 5 años)'
            : 'SPM-Preescolar Cuestionario para Padres (2 a 5 años)',
          url: formContext === 'Escuela / Aula'
            ? '/assets/aistudio/Cuestionario_Escolar_Pre_Escolar_21409f2b.pdf'
            : '/assets/aistudio/Cuestionario_Padres_Pre_Escolar_ea5af9a8.pdf',
          itemsCount: '75 preguntas oficiales Preescolar'
        };
      case 'escolar_5_12':
        return {
          title: formContext === 'Escuela / Aula'
            ? 'SPM Escolar Cuestionario Escolar (5 a 12 años)'
            : 'SPM Escolar Cuestionario para Padres (5 a 12 años)',
          url: formContext === 'Escuela / Aula'
            ? '/assets/aistudio/Cuestionario_Escolar_Escolares_a3b0141b.pdf'
            : '/assets/aistudio/Cuestionario_Padres_Escolares_460ca90f.pdf',
          itemsCount: formContext === 'Escuela / Aula' ? '62 preguntas Aula' : '75 preguntas Hogar'
        };
      case 'adolescente_adulto':
        return {
          title: 'Manual Técnico y Baremos SPM-2 (12+ años)',
          url: '/assets/aistudio/ilide.info-manual-spm-2-espanol-pr_5a6fff610415d0485bb0e4232474f674_a177c2cd.pdf',
          itemsCount: '80 ítems normativos SPM-2'
        };
    }
  };

  // Load existing evaluation for this patient
  useEffect(() => {
    let isMounted = true;
    spmEvaluationService.loadSPMEvaluations().then(allEvals => {
      if (!isMounted) return;
      if (allEvals[patient.id]) {
        const existing = allEvals[patient.id];
        setEvalRecord(existing);
        setActiveCategory(existing.ageCategory);
        setFormContext(existing.formContext as any);
        setEvaluatorName(existing.evaluatorName);
        setIncludeInReport(existing.includeInReport);
        setItemResponses(existing.responses || {});
      } else {
        const rec = DEFAULT_SPM_EVALUATIONS[patient.id] || {
          id: `spm_eval_${patient.id}_${Date.now()}`,
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientBirthDate: patient.birthDate,
          ageMonths: totalMonths,
          ageCategory: autoRecommendation.category,
          formTitle: autoRecommendation.formTitle,
          formContext: 'Hogar / Padres',
          evaluationDate: new Date().toISOString().slice(0, 10),
          evaluatorName: 'Familia de ' + patient.firstName,
          evaluatorRole: 'Padres / Hogar',
          includeInReport: true,
          responses: {},
          scales: {
            vis: calculateSPMScaleScore(14),
            hea: calculateSPMScaleScore(13),
            tou: calculateSPMScaleScore(15),
            ts: calculateSPMScaleScore(12),
            bod: calculateSPMScaleScore(16),
            bal: calculateSPMScaleScore(15),
            st: calculateSPMScaleScore(85, 240),
            pln: calculateSPMScaleScore(15),
            soc: calculateSPMScaleScore(16)
          }
        };
        setEvalRecord(rec);
        setActiveCategory(rec.ageCategory);
        setItemResponses(rec.responses || {});
      }
    });

    return () => {
      isMounted = false;
    };
  }, [patient.id, totalMonths]);

  // Recalculate scale scores whenever item responses change
  const recalculateScalesFromResponses = (newResponses: Record<number, 1 | 2 | 3 | 4>) => {
    if (!evalRecord) return;

    const rawTotals = {
      VIS: 0,
      HEA: 0,
      TOU: 0,
      TS: 0,
      BOD: 0,
      BAL: 0,
      PLA: 0,
      SOC: 0
    };

    const counts = {
      VIS: 0,
      HEA: 0,
      TOU: 0,
      TS: 0,
      BOD: 0,
      BAL: 0,
      PLA: 0,
      SOC: 0
    };

    currentQuestions.forEach(q => {
      const val = newResponses[q.num];
      if (val) {
        const pts = q.isReverseScored ? (5 - val) : val;
        rawTotals[q.scale] += pts;
        counts[q.scale]++;
      }
    });

    // For scales that have at least 1 answered question, compute extrapolated or direct raw score (base 10 items)
    const getScaleRaw = (scaleId: keyof typeof rawTotals, fallbackRaw: number) => {
      const totalQInScale = currentQuestions.filter(q => q.scale === scaleId).length || 10;
      const answeredCount = counts[scaleId];
      if (answeredCount === 0) return fallbackRaw;
      // If partially answered, fill unanswered with median (1.5) or use direct sum if all answered
      if (answeredCount < totalQInScale) {
        const missing = totalQInScale - answeredCount;
        return Math.round(rawTotals[scaleId] + missing * 1.4);
      }
      return rawTotals[scaleId];
    };

    const visRaw = getScaleRaw('VIS', evalRecord.scales.vis.raw);
    const heaRaw = getScaleRaw('HEA', evalRecord.scales.hea.raw);
    const touRaw = getScaleRaw('TOU', evalRecord.scales.tou.raw);
    const tsRaw = getScaleRaw('TS', evalRecord.scales.ts.raw);
    const bodRaw = getScaleRaw('BOD', evalRecord.scales.bod.raw);
    const balRaw = getScaleRaw('BAL', evalRecord.scales.bal.raw);
    const plnRaw = getScaleRaw('PLA', evalRecord.scales.pln.raw);
    const socRaw = getScaleRaw('SOC', evalRecord.scales.soc.raw);
    const stRaw = visRaw + heaRaw + touRaw + tsRaw + bodRaw + balRaw;

    setEvalRecord({
      ...evalRecord,
      responses: newResponses,
      scales: {
        vis: calculateSPMScaleScore(visRaw, 40),
        hea: calculateSPMScaleScore(heaRaw, 40),
        tou: calculateSPMScaleScore(touRaw, 40),
        ts: calculateSPMScaleScore(tsRaw, 40),
        bod: calculateSPMScaleScore(bodRaw, 40),
        bal: calculateSPMScaleScore(balRaw, 40),
        st: calculateSPMScaleScore(stRaw, 240),
        pln: calculateSPMScaleScore(plnRaw, 40),
        soc: calculateSPMScaleScore(socRaw, 40)
      }
    });
  };

  const handleAnswerQuestion = (qNum: number, val: 1 | 2 | 3 | 4) => {
    const updated = { ...itemResponses, [qNum]: val };
    setItemResponses(updated);
    recalculateScalesFromResponses(updated);
  };

  const handleQuickFillProfile = (profileType: 'tipico' | 'moderado') => {
    const filled: Record<number, 1 | 2 | 3 | 4> = {};
    currentQuestions.forEach(q => {
      if (profileType === 'tipico') {
        filled[q.num] = q.isReverseScored ? 4 : 1;
      } else {
        filled[q.num] = q.isReverseScored ? 2 : 3;
      }
    });
    setItemResponses(filled);
    recalculateScalesFromResponses(filled);
  };

  const handleScoreChange = (scaleKey: keyof SPMEvaluationRecord['scales'], rawValue: number) => {
    if (!evalRecord) return;
    const max = scaleKey === 'st' ? 240 : 40;
    const newScore = calculateSPMScaleScore(rawValue, max);
    const updatedScales = {
      ...evalRecord.scales,
      [scaleKey]: newScore
    };
    if (scaleKey !== 'st' && scaleKey !== 'pln' && scaleKey !== 'soc') {
      const newStRaw =
        updatedScales.vis.raw +
        updatedScales.hea.raw +
        updatedScales.tou.raw +
        updatedScales.ts.raw +
        updatedScales.bod.raw +
        updatedScales.bal.raw;
      updatedScales.st = calculateSPMScaleScore(newStRaw, 240);
    }
    setEvalRecord({
      ...evalRecord,
      scales: updatedScales
    });
  };

  const handleSave = async () => {
    if (!evalRecord) return;
    setSaving(true);
    try {
      const toSave: SPMEvaluationRecord = {
        ...evalRecord,
        ageCategory: activeCategory,
        formTitle: getCategoryTitle(activeCategory),
        formContext,
        evaluatorName,
        includeInReport,
        responses: itemResponses,
        evaluationDate: new Date().toISOString().slice(0, 10)
      };
      await spmEvaluationService.saveSPMEvaluation(toSave);
      if (onSaveEvaluation) {
        onSaveEvaluation(toSave);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error al guardar evaluación SPM:', err);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryTitle = (cat: SPMAgeCategory) => {
    switch (cat) {
      case 'bebes_4_9':
        return 'SPM-2 Bebés (4 a 9 meses)';
      case 'toddler_10_30':
        return 'SPM-2 Niños Pequeños (10 a 30 meses)';
      case 'preescolar_2_5':
        return 'SPM-Preescolar (2 a 5 años)';
      case 'escolar_5_12':
        return 'SPM Escolar (5 a 12 años)';
      case 'adolescente_adulto':
        return 'SPM-2 Adolescente / Adulto (12+ años)';
    }
  };

  const scalesList: {
    key: keyof SPMEvaluationRecord['scales'];
    scaleCode: string;
    name: string;
    code: string;
    icon: any;
    desc: string;
  }[] = [
    { key: 'vis', scaleCode: 'VIS', name: 'Visión', code: 'VIS', icon: Eye, desc: 'Filtro visual, seguimiento y respuesta a luces' },
    { key: 'hea', scaleCode: 'HEA', name: 'Audición (Oído)', code: 'HEA', icon: Volume2, desc: 'Tolerancia a sonidos domésticos y orientación auditiva' },
    { key: 'tou', scaleCode: 'TOU', name: 'Tacto', code: 'TOU', icon: Hand, desc: 'Tolerancia a texturas, ropa, higiene y contacto' },
    { key: 'ts', scaleCode: 'TS', name: 'Gusto y Olfato', code: 'T&S', icon: Coffee, desc: 'Reacción a sabores, olores y consistencias' },
    { key: 'bod', scaleCode: 'BOD', name: 'Conciencia del Cuerpo', code: 'BOD', icon: Activity, desc: 'Propiocepción, tono postural y graduación de fuerza' },
    { key: 'bal', scaleCode: 'BAL', name: 'Equilibrio y Movimiento', code: 'BAL', icon: Brain, desc: 'Control vestibular, giros, mecerse y control cefálico' },
    { key: 'st', scaleCode: 'ST', name: 'Total Sensorial', code: 'ST', icon: Sparkles, desc: 'Suma compuesta de VIS + HEA + TOU + T&S + BOD + BAL' },
    { key: 'pln', scaleCode: 'PLA', name: 'Planificación e Ideas', code: 'PLN', icon: ClipboardCheck, desc: 'Ideación, exploración de objetos e imitación motora' },
    { key: 'soc', scaleCode: 'SOC', name: 'Participación Social', code: 'SOC', icon: Users, desc: 'Contacto visual, sonrisas, atención conjunta y corregulación' }
  ];

  const answeredCount = Object.keys(itemResponses).length;
  const pdfInfo = getCategoryPdfInfo(activeCategory);

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300">
              Evaluaciones SPM-2 por Edad
            </span>
            <span className="text-xs font-bold text-slate-500">
              Edad Cronológica: <strong className="text-slate-900">{ageInfo.detailedChronologicalAge || ageInfo.ageText} ({totalMonths} meses)</strong>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            {getCategoryTitle(activeCategory)} — {patient.firstName} {patient.lastName}
          </h3>
          <p className="text-xs text-slate-500">
            Formulario oficial completo con sus preguntas ítem por ítem, hoja de puntuación (Scoring Worksheet) y conversión a Puntajes T.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setPreviewPdfUrl(pdfInfo.url)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Ver PDF Oficial ({activeCategory === 'bebes_4_9' ? '4-9m' : activeCategory === 'toddler_10_30' ? '10-30m' : 'SPM'})</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar Evaluación SPM'}</span>
          </button>

          {onGoToReport && (
            <button
              onClick={onGoToReport}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Ver en Informe Final</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>✓ Evaluación {getCategoryTitle(activeCategory)} guardada con éxito en Firebase y vinculada al Informe Final.</span>
        </div>
      )}

      {/* 2. Age Form Selector Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-purple-900 block">
            1. Selecciona el Formulario SPM según Rango de Edad:
          </label>
          <span className="text-[11px] font-semibold text-slate-500">
            Haz clic en cualquier rango etario para ver su cuestionario específico (incluye Bebés 4-9 meses y 10-30 meses)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {(['bebes_4_9', 'toddler_10_30', 'preescolar_2_5', 'escolar_5_12', 'adolescente_adulto'] as SPMAgeCategory[]).map(cat => {
            const isAuto = autoRecommendation.category === cat;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedScaleFilter('ALL');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 text-purple-950 shadow-sm ring-2 ring-purple-400'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {isAuto && (
                  <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white shadow-2xs">
                    Edad del Paciente
                  </span>
                )}
                <span className="font-black text-xs block">{getCategoryTitle(cat)}</span>
                <span className="text-[11px] text-slate-600 font-semibold block mt-1">
                  {cat === 'bebes_4_9' && '👶 Lactantes 4 a 9 meses (80 ítems)'}
                  {cat === 'toddler_10_30' && '🍼 Niños Pequeños 10 a 30m (80 ítems)'}
                  {cat === 'preescolar_2_5' && '🎨 Preescolar 2 a 5 años (75 ítems)'}
                  {cat === 'escolar_5_12' && '🧒 Escolar 5 a 12 años (75 ítems)'}
                  {cat === 'adolescente_adulto' && '🧑 Adolescente/Adulto 12+ años'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Official Document Banner for the Selected Form */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-black shadow-2xs">
              SPM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs sm:text-sm font-black text-slate-900">
                  {pdfInfo.title}
                </strong>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-950">
                  {pdfInfo.itemsCount}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {activeCategory === 'bebes_4_9' && 'Cuestionario oficial en español para bebés de 4 a 9 meses (Tablas de conversión 4-6 meses y 7-9 meses incluidas).'}
                {activeCategory === 'toddler_10_30' && 'Cuestionario oficial en español Infant & Toddler Form para niños pequeños de 10 a 30 meses.'}
                {activeCategory === 'preescolar_2_5' && 'Cuestionario oficial en español SPM-Preescolar de 2 a 5 años para padres y jardín infantil.'}
                {activeCategory === 'escolar_5_12' && 'Cuestionario oficial en español SPM Escolar de 5 a 12 años para hogar y sala de clases.'}
                {activeCategory === 'adolescente_adulto' && 'Baremos normativos SPM-2 para adolescentes y adultos.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewPdfUrl(pdfInfo.url)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-purple-50 text-purple-800 border border-purple-300 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Abrir Documento PDF</span>
            </button>
            <a
              href={pdfInfo.url}
              download
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </a>
          </div>
        </div>

        {/* Evaluator Context & View Mode Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="font-bold text-slate-600 block text-[11px]">Entorno / Contexto:</label>
            <select
              value={formContext}
              onChange={(e) => setFormContext(e.target.value as any)}
              className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="Hogar / Padres">Hogar / Padres (Cuidador)</option>
              <option value="Escuela / Aula">Sala Cuna / Jardín / Escuela</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-600 block text-[11px]">Nombre del Respondiente:</label>
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              placeholder="Ej: Madre / Padre / Educadora"
            />
          </div>

          <div>
            <label className="font-bold text-slate-600 block text-[11px]">Modo de Visualización:</label>
            <div className="grid grid-cols-3 gap-1 mt-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('questions_and_scores')}
                className={`py-1 px-2 rounded-lg font-bold text-[11px] cursor-pointer ${
                  viewMode === 'questions_and_scores' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Completo
              </button>
              <button
                type="button"
                onClick={() => setViewMode('questions_only')}
                className={`py-1 px-2 rounded-lg font-bold text-[11px] cursor-pointer ${
                  viewMode === 'questions_only' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Preguntas ({currentQuestions.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('scores_only')}
                className={`py-1 px-2 rounded-lg font-bold text-[11px] cursor-pointer ${
                  viewMode === 'scores_only' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Baremos T
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="include_in_report_check"
              checked={includeInReport}
              onChange={(e) => setIncludeInReport(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded-md cursor-pointer"
            />
            <label htmlFor="include_in_report_check" className="font-bold text-slate-800 text-xs cursor-pointer">
              Incluir resultados en el Informe Final
            </label>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE 80-QUESTION / 75-QUESTION FORM */}
      {(viewMode === 'questions_and_scores' || viewMode === 'questions_only') && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-purple-600" />
                <h4 className="text-base font-black text-slate-900">
                  Cuestionario Ítem por Ítem: {getCategoryTitle(activeCategory)}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                  {answeredCount} / {currentQuestions.length} respondidas
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Escala oficial de frecuencia: <strong>Nunca (N)</strong> · <strong>Ocasionalmente (O)</strong> · <strong>Frecuentemente (F)</strong> · <strong>Siempre (S)</strong>. Al marcar cada respuesta se calcula automáticamente el Puntaje Bruto y el Puntaje T.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFillProfile('tipico')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                ✓ Autocompletar Perfil Típico
              </button>
              <button
                type="button"
                onClick={() => handleQuickFillProfile('moderado')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                ⚡ Autocompletar Dificultad Moderada
              </button>
            </div>
          </div>

          {/* Filter by Scale Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedScaleFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                selectedScaleFilter === 'ALL'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas las Escalas ({currentQuestions.length})
            </button>
            {[
              { id: 'VIS', label: 'Visión (VIS)' },
              { id: 'HEA', label: 'Oído / Audición (HEA)' },
              { id: 'TOU', label: 'Tacto (TOU)' },
              { id: 'TS', label: 'Gusto y Olfato (T&S)' },
              { id: 'BOD', label: 'Conciencia del Cuerpo (BOD)' },
              { id: 'BAL', label: 'Equilibrio y Mov. (BAL)' },
              { id: 'PLA', label: 'Planificación e Ideas (PLN)' },
              { id: 'SOC', label: 'Participación Social (SOC)' }
            ].map(sc => {
              const countInScale = currentQuestions.filter(q => q.scale === sc.id).length;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScaleFilter(sc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    selectedScaleFilter === sc.id
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sc.label} ({countInScale})
                </button>
              );
            })}
          </div>

          {/* Questions List */}
          <div className="max-h-[520px] overflow-y-auto pr-1 space-y-2 divide-y divide-slate-100 border border-slate-200 rounded-2xl p-3 bg-slate-50/50">
            {filteredQuestions.map(q => {
              const currentAns = itemResponses[q.num];
              return (
                <div
                  key={q.num}
                  className={`pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl transition-colors ${
                    currentAns ? 'bg-white border border-purple-100 shadow-2xs' : 'hover:bg-white/80'
                  }`}
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-900 font-mono font-black text-xs flex items-center justify-center shrink-0">
                        {q.num}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        {q.scale} · {q.scaleName}
                      </span>
                      {q.vulnerability && (
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          {q.vulnerability}
                        </span>
                      )}
                      {q.isReverseScored && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Conducta Positiva (Puntaje Invertido)
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 pl-8">
                      {q.text}
                    </p>
                  </div>

                  {/* Likert 4 options: N, O, F, S */}
                  <div className="grid grid-cols-4 gap-1.5 shrink-0 sm:w-72 pl-8 sm:pl-0">
                    {[
                      { val: 1 as const, short: 'N', label: 'Nunca' },
                      { val: 2 as const, short: 'O', label: 'Ocasional' },
                      { val: 3 as const, short: 'F', label: 'Frecuente' },
                      { val: 4 as const, short: 'S', label: 'Siempre' }
                    ].map(opt => {
                      const active = currentAns === opt.val;
                      return (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => handleAnswerQuestion(q.num, opt.val)}
                          className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer border ${
                            active
                              ? 'bg-purple-700 text-white border-purple-700 font-black shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50 font-semibold'
                          }`}
                        >
                          <span className="block text-xs">{opt.short}</span>
                          <span className="block text-[9px] opacity-85">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Scales Scoring Matrix & T-Scores */}
      {(viewMode === 'questions_and_scores' || viewMode === 'scores_only') && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h4 className="text-base font-black text-slate-900">
                  Hoja de Puntuación y Baremos T — {getCategoryTitle(activeCategory)}
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                Puedes responder las preguntas arriba para cálculo automático o ingresar directamente los Puntajes Brutos de la hoja física.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Típico (40-59)
              </span>
              <span className="flex items-center gap-1.5 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Dificultad Moderada (60-69)
              </span>
              <span className="flex items-center gap-1.5 text-rose-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Dificultad Severa (≥70)
              </span>
            </div>
          </div>

          {/* Table of Scales */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-purple-50/70 border-b border-purple-100 text-purple-950 font-bold">
                  <th className="py-2.5 px-3">Escala / Dimensión</th>
                  <th className="py-2.5 px-3 text-center">Puntaje Bruto</th>
                  <th className="py-2.5 px-3 text-center">Puntaje T</th>
                  <th className="py-2.5 px-3">Rango Interpretativo</th>
                  <th className="py-2.5 px-3">Observación Clínica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {scalesList.map(sc => {
                  const currentScore = evalRecord?.scales[sc.key] || calculateSPMScaleScore(14);
                  const IconComponent = sc.icon;
                  const isModerate = currentScore.tScore >= 60 && currentScore.tScore < 70;
                  const isSevere = currentScore.tScore >= 70;

                  return (
                    <tr key={sc.key} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="text-slate-900 block font-bold">
                              {sc.name} ({sc.code})
                            </strong>
                            <span className="text-[11px] text-slate-500">{sc.desc}</span>
                          </div>
                        </div>
                      </td>

                      {/* Raw input */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={sc.key === 'st' ? 60 : 10}
                          max={sc.key === 'st' ? 240 : 40}
                          value={currentScore.raw}
                          onChange={(e) => handleScoreChange(sc.key, parseInt(e.target.value) || 10)}
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-center font-mono font-bold text-xs focus:ring-2 focus:ring-purple-500"
                        />
                      </td>

                      {/* T-score */}
                      <td className="py-3 px-3 text-center font-mono font-black text-sm">
                        <span className={`px-2 py-0.5 rounded-md ${
                          isSevere 
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : isModerate
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {currentScore.tScore} T
                        </span>
                      </td>

                      {/* Range */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          isSevere 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isModerate
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {currentScore.range}
                        </span>
                      </td>

                      {/* Interpretation */}
                      <td className="py-3 px-3 text-slate-600 text-[11px] leading-relaxed">
                        {currentScore.interpretation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Simple Bar Chart of T-Scores */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Gráfico de Perfil SPM: Puntuaciones T por Escala ({getCategoryTitle(activeCategory)})
            </span>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              {scalesList.map(sc => {
                const currentScore = evalRecord?.scales[sc.key] || calculateSPMScaleScore(14);
                const pct = Math.min(100, Math.max(0, ((currentScore.tScore - 40) / 40) * 100));
                const isSevere = currentScore.tScore >= 70;
                const isModerate = currentScore.tScore >= 60 && currentScore.tScore < 70;

                return (
                  <div key={sc.key} className="flex items-center gap-2 text-xs">
                    <span className="w-28 font-bold text-slate-700 shrink-0 text-[11px]">
                      {sc.code} ({sc.name})
                    </span>
                    <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden relative">
                      <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-amber-500 z-10" title="Corte Dificultad Moderada (60T)" />
                      <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-rose-500 z-10" title="Corte Dificultad Severa (70T)" />
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSevere ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono font-bold text-slate-800 text-[11px]">
                      {currentScore.tScore} T
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview for Official PDF */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-5xl w-full h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <strong className="text-sm font-black">{pdfInfo.title}</strong>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewPdfUrl}
                  download
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewPdfUrl(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <iframe
              src={previewPdfUrl}
              title={pdfInfo.title}
              className="w-full flex-1 border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

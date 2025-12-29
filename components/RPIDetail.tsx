
import React, { useState, useRef } from 'react';
import { RPI, PerformanceStatus, CAPA } from '../types.ts';
import { MOCK_TREND_DATA } from '../constants.ts';
import { getRootCauseSuggestion, generateSpeech } from '../services/geminiService.ts';
import { 
  ArrowLeft, 
  Info, 
  Clock, 
  User, 
  Database, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  Calendar,
  Plus,
  X,
  Send,
  Sparkles,
  Loader2,
  Volume2,
  BrainCircuit,
  ChevronRight,
  ClipboardCopy,
  ExternalLink
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface RPIDetailProps {
  rpi: RPI;
  onBack: () => void;
  capas: CAPA[];
  onAddCapa: (capa: CAPA) => void;
  onViewAllCapas: () => void;
}

const MetricBlock: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="p-6 text-center">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-slate-300">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  </div>
);

export default function RPIDetail({ rpi, onBack, capas, onAddCapa, onViewAllCapas }: RPIDetailProps) {
  const [showForm, setShowForm] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);
  
  const [newCapa, setNewCapa] = useState({
    rootCause: '',
    actionPlan: '',
    owner: '',
    dueDate: ''
  });

  const handleSpeech = async (text?: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const textToRead = text || `${rpi.code}: ${rpi.description}. Current value is ${rpi.currentValue}${rpi.unit} against a target of ${rpi.target}${rpi.unit}.`;
    const source = await generateSpeech(textToRead);
    if (source) {
      source.onended = () => setIsSpeaking(false);
    } else {
      setIsSpeaking(false);
    }
  };

  const handleGenerateInsight = async () => {
    setIsAiLoading(true);
    try {
      const suggestion = await getRootCauseSuggestion(rpi);
      if (suggestion) {
        setAiInsight(suggestion);
      }
    } catch (error) {
      console.error("Diagnostic failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyInsightToForm = () => {
    if (!aiInsight) return;
    setNewCapa({
      ...newCapa,
      rootCause: aiInsight.root_causes?.[0] || '',
      actionPlan: aiInsight.corrective_actions?.[0] || '',
    });
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newCapa.rootCause || newCapa.rootCause.length < 10) {
      newErrors.rootCause = 'Root cause is too brief.';
    }
    if (!newCapa.actionPlan || newCapa.actionPlan.length < 10) {
      newErrors.actionPlan = 'Action plan is too brief.';
    }
    if (!newCapa.owner) {
      newErrors.owner = 'Owner is required.';
    }
    if (!newCapa.dueDate) {
      newErrors.dueDate = 'Due date is required.';
    } else {
      const selectedDate = new Date(newCapa.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const capa: CAPA = {
      id: `c-${Date.now()}`,
      rpiId: rpi.id,
      rootCause: newCapa.rootCause,
      actionPlan: newCapa.actionPlan,
      owner: newCapa.owner,
      dueDate: newCapa.dueDate,
      status: 'Open'
    };
    onAddCapa(capa);
    setNewCapa({ rootCause: '', actionPlan: '', owner: '', dueDate: '' });
    setErrors({});
    setShowForm(false);
  };

  const isUnderperforming = rpi.status === PerformanceStatus.BEHIND || rpi.status === PerformanceStatus.RED_ALERT;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Back to Performance Tracker
        </button>
        <button 
          onClick={() => handleSpeech()}
          disabled={isSpeaking}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${isSpeaking ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
        >
          <Volume2 size={14} className={isSpeaking ? 'animate-pulse' : ''} />
          {isSpeaking ? 'Reading Metadata...' : 'Read Indicator Info'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] font-bold uppercase tracking-wider">
                  {rpi.function}
                </span>
                <span className="text-slate-400 text-xs font-mono">{rpi.code}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{rpi.description}</h2>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg ring-1 ring-white/10 ${
                rpi.status === PerformanceStatus.ACHIEVED ? 'bg-green-600' :
                rpi.status === PerformanceStatus.ON_TRACK ? 'bg-blue-600' :
                rpi.status === PerformanceStatus.BEHIND ? 'bg-amber-600' : 'bg-red-600'
              }`}>
                {rpi.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/30">
          <MetricBlock label="Baseline" value={`${rpi.baseline}${rpi.unit}`} color="text-slate-400" />
          <MetricBlock label="Current Value" value={`${rpi.currentValue}${rpi.unit}`} color={rpi.currentValue >= rpi.target ? "text-green-600" : "text-red-600"} />
          <MetricBlock label="Target" value={`${rpi.target}${rpi.unit}`} color="text-slate-900" />
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Info size={14} className="text-blue-500" /> Indicator Logistics
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <InfoItem icon={<Database size={16} />} label="Data Source" value={rpi.dataSource} />
                <InfoItem icon={<Clock size={16} />} label="Measurement Period" value={rpi.measurementPeriod} />
                <InfoItem icon={<User size={16} />} label="Responsible Role" value={rpi.responsibleRole} />
                <InfoItem icon={<ShieldCheck size={16} />} label="WHO GBT Link" value={rpi.whoGbtLinkage} />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Calculation Formula</h4>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Numerator</span>
                  <span className="text-sm text-slate-700 font-medium">{rpi.numeratorLogic}</span>
                </div>
                <div className="w-full h-[1px] bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Denominator</span>
                  <span className="text-sm text-slate-700 font-medium">{rpi.denominatorLogic}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BrainCircuit size={14} className="text-green-500" /> Performance Trend
            </h3>
            <div className="h-[280px] w-full bg-white rounded-2xl border border-slate-100 p-4 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="period" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                  <YAxis unit={rpi.unit} fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }}
                    name="Actual Performance"
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="target" 
                    stroke="#cbd5e1" 
                    strokeDasharray="5 5" 
                    name="Regulatory Target"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Insight Section */}
      <div className="bg-white rounded-2xl border-2 border-blue-50 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="p-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">ReguPulse AI Diagnostic Insight</h3>
                <p className="text-xs text-slate-500">Gemini-powered root-cause and CAPA advisory service</p>
              </div>
            </div>
            {!aiInsight && !isAiLoading && (
              <button 
                onClick={handleGenerateInsight}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles size={16} className="text-blue-400" />
                Generate Diagnostic Insight
              </button>
            )}
            {aiInsight && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSpeech(`AI Diagnosis for ${rpi.code}: ${aiInsight.root_causes[0]}. Recommendation: ${aiInsight.corrective_actions[0]}`)}
                  disabled={isSpeaking}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-all"
                >
                   <Volume2 size={16} /> Listen to Insight
                </button>
                <button 
                  onClick={applyInsightToForm}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                   <ClipboardCopy size={16} /> Apply to CAPA Log
                </button>
              </div>
            )}
          </div>

          {isAiLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <Loader2 size={48} className="animate-spin text-blue-600" />
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/20 scale-150"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Synthesizing Regulatory Data...</p>
                <p className="text-xs text-slate-400 mt-1">Cross-referencing WHO GBT ML4 benchmarks and historical variance patterns.</p>
              </div>
            </div>
          ) : aiInsight ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={14} /> Probable Root Causes
                </p>
                <div className="space-y-3">
                  {aiInsight.root_causes.map((cause: string, i: number) => (
                    <div key={i} className="flex gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-700 leading-relaxed font-medium">
                      <span className="text-blue-600 font-black">0{i+1}</span>
                      {cause}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} /> Recommended Corrective Actions
                </p>
                <div className="space-y-3">
                  {aiInsight.corrective_actions.map((action: string, i: number) => (
                    <div key={i} className="flex gap-3 p-4 bg-violet-50/50 rounded-xl border border-violet-100 text-sm text-slate-700 leading-relaxed font-medium">
                      <span className="text-violet-600 font-black">0{i+1}</span>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Compliance Justification (ML4)</p>
                <p className="text-xs text-slate-600 italic leading-relaxed">"{aiInsight.ml4_justification}"</p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-400 font-medium">Request an AI diagnostic to uncover the underlying causes of performance variance.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6" ref={formRef}>
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-500" /> Associated CAPAs
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={onViewAllCapas}
                className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline px-2"
              >
                Full Registry <ExternalLink size={12} />
              </button>
              <button 
                onClick={() => { setShowForm(!showForm); setErrors({}); }}
                className={`flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl transition-all ${showForm ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'}`}
              >
                {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Cancel' : 'Log New CAPA'}
              </button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleLogCapa} className="p-6 border border-blue-100 bg-blue-50/20 rounded-2xl space-y-5 animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">New CAPA Entry</span>
                {aiInsight && (
                  <span className="text-[9px] font-bold text-blue-500 flex items-center gap-1">
                    <Sparkles size={10} /> Fields pre-filled from AI Insight
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                    Root Cause Analysis 
                    {errors.rootCause && <span className="text-red-500 normal-case font-normal">{errors.rootCause}</span>}
                  </label>
                  <textarea 
                    value={newCapa.rootCause}
                    onChange={e => setNewCapa({...newCapa, rootCause: e.target.value})}
                    placeholder="Describe the underlying issue..."
                    className={`w-full p-3 mt-1.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${errors.rootCause ? 'border-red-300' : 'border-slate-200'}`}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                    Action Plan
                    {errors.actionPlan && <span className="text-red-500 normal-case font-normal">{errors.actionPlan}</span>}
                  </label>
                  <textarea 
                    value={newCapa.actionPlan}
                    onChange={e => setNewCapa({...newCapa, actionPlan: e.target.value})}
                    placeholder="Define specific mitigation steps..."
                    className={`w-full p-3 mt-1.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${errors.actionPlan ? 'border-red-300' : 'border-slate-200'}`}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                      Owner
                      {errors.owner && <span className="text-red-500 normal-case font-normal">{errors.owner}</span>}
                    </label>
                    <input 
                      type="text"
                      value={newCapa.owner}
                      onChange={e => setNewCapa({...newCapa, owner: e.target.value})}
                      placeholder="Role or Dept."
                      className={`w-full p-3 mt-1.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${errors.owner ? 'border-red-300' : 'border-slate-200'}`}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                      Due Date
                      {errors.dueDate && <span className="text-red-500 normal-case font-normal">{errors.dueDate}</span>}
                    </label>
                    <input 
                      type="date"
                      value={newCapa.dueDate}
                      onChange={e => setNewCapa({...newCapa, dueDate: e.target.value})}
                      className={`w-full p-3 mt-1.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${errors.dueDate ? 'border-red-300' : 'border-slate-200'}`}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
                <Send size={16} /> Finalize CAPA Entry
              </button>
            </form>
          )}

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {capas.length > 0 ? (
              capas.map(capa => (
                <div key={capa.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all hover:shadow-md group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${capa.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                        capa.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {capa.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                        <User size={12} className="text-slate-300" /> {capa.owner}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                      <Calendar size={13} /> {capa.dueDate}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Root Cause</p>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{capa.rootCause}</p>
                    </div>
                    <div className="pl-4 border-l-2 border-slate-200 bg-slate-100/30 p-2 rounded-r-lg">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Action Plan</p>
                      <p className="text-sm text-slate-800 font-semibold italic">"{capa.actionPlan}"</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-slate-300 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                <AlertCircle size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">No CAPA records found for this indicator.</p>
                <p className="text-[10px] uppercase font-bold mt-1 opacity-50">Generate an AI diagnostic to begin</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-500" /> Evidence Logs & Audit Trail
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group hover:border-green-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Q{i}_Performance_Validation_Report.pdf</p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">System Timestamp: Oct {10 + i}, 2024 | Verified by QMS Unit</p>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-green-600 transition-colors">
                  <ShieldCheck size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 p-5 bg-green-50/50 border border-green-100 rounded-2xl">
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">WLA Compliance Status</span>
             </div>
             <p className="text-xs text-green-700 leading-relaxed font-medium">
               This indicator is automatically linked to WHO GBT ML4 sub-indicator {rpi.whoGbtLinkage}. 
               Continuous monitoring evidence is verified as audit-ready.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

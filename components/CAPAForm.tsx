
import React, { useState } from 'react';
import { RPI, CAPA } from '../types.ts';
import { MOCK_RPIS } from '../constants.ts';
// Added ChevronDown to the imported icons
import { Save, X, Info, AlertCircle, CheckCircle, Search, ChevronDown } from 'lucide-react';

interface CAPAFormProps {
  onSave: (capa: CAPA) => void;
  onCancel: () => void;
}

export default function CAPAForm({ onSave, onCancel }: CAPAFormProps) {
  const [formData, setFormData] = useState({
    rpiId: '',
    rootCause: '',
    actionPlan: '',
    owner: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.rpiId) newErrors.rpiId = 'Indicator selection is required.';
    if (!formData.rootCause || formData.rootCause.length < 10) newErrors.rootCause = 'Root cause analysis is too short.';
    if (!formData.actionPlan || formData.actionPlan.length < 10) newErrors.actionPlan = 'Action plan is too short.';
    if (!formData.owner) newErrors.owner = 'Owner is required.';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newCapa: CAPA = {
        id: `c-${Date.now()}`,
        rpiId: formData.rpiId,
        rootCause: formData.rootCause,
        actionPlan: formData.actionPlan,
        owner: formData.owner,
        dueDate: formData.dueDate,
        status: 'Open',
      };
      onSave(newCapa);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Log New CAPA</h2>
          <p className="text-slate-500 mt-2 font-medium">Create a corrective or preventive action plan linked to a performance indicator.</p>
        </div>
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
        >
          <X size={18} /> Cancel
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest">Quality Compliance Record</h3>
              <p className="text-xs text-slate-400 font-medium">Institutional Improvement Workflow</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Record Status</p>
            <p className="text-sm font-bold text-green-500">DRAFTING</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* RPI Selection */}
            <div className="md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Link to Regulatory Indicator</label>
              <div className="relative">
                <select
                  value={formData.rpiId}
                  onChange={(e) => setFormData({ ...formData, rpiId: e.target.value })}
                  className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none transition-all ${
                    errors.rpiId ? 'border-red-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">-- Select an underperforming RPI --</option>
                  {MOCK_RPIS.map(rpi => (
                    <option key={rpi.id} value={rpi.id}>{rpi.code}: {rpi.description.substring(0, 80)}...</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {errors.rpiId && <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12} /> {errors.rpiId}</p>}
            </div>

            {/* Root Cause Analysis */}
            <div className="md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Root Cause Analysis (RCA)</label>
              <textarea
                value={formData.rootCause}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                placeholder="Describe why the performance variance occurred..."
                className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-green-500 focus:outline-none transition-all min-h-[120px] ${
                  errors.rootCause ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.rootCause ? (
                  <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12} /> {errors.rootCause}</p>
                ) : (
                  <p className="text-[10px] text-slate-400 font-medium italic">Gemini AI can suggest root causes in the Improvement Engine module.</p>
                )}
                <span className="text-[10px] text-slate-400 font-bold">{formData.rootCause.length}/500</span>
              </div>
            </div>

            {/* Action Plan */}
            <div className="md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Proposed Action Plan</label>
              <textarea
                value={formData.actionPlan}
                onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                placeholder="What specific steps will be taken to resolve the issue?"
                className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-green-500 focus:outline-none transition-all min-h-[120px] ${
                  errors.actionPlan ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.actionPlan && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12} /> {errors.actionPlan}</p>}
                <span className="text-[10px] text-slate-400 font-bold">{formData.actionPlan.length}/500</span>
              </div>
            </div>

            {/* Owner */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Responsible Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Department or Role"
                className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-green-500 focus:outline-none transition-all ${
                  errors.owner ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.owner && <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12} /> {errors.owner}</p>}
            </div>

            {/* Due Date */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Completion Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-green-500 focus:outline-none transition-all ${
                  errors.dueDate ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.dueDate && <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle size={12} /> {errors.dueDate}</p>}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-8 py-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-green-500/20 hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Save size={20} /> Finalize & Log CAPA
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
        <div className="p-2 bg-blue-100 rounded-lg h-fit">
          <Info size={20} className="text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1 tracking-tight">Quality Assurance Requirement</h4>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Institutional memory of CAPAs is a mandatory requirement for WHO GBT Maturity Level 4. Ensure all logged actions are specific, measurable, achievable, relevant, and time-bound (SMART).
          </p>
        </div>
      </div>
    </div>
  );
}

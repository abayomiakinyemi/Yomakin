
import React, { useState } from 'react';
import { MOCK_RPIS } from '../constants.ts';
import { CAPA } from '../types.ts';
import { ClipboardCheck, Calendar, User, ArrowRight, Edit3, X, Save, Search, ExternalLink, Info, Trash2 } from 'lucide-react';

interface CAPAManagementProps {
  capas: CAPA[];
  onUpdateCapa: (capa: CAPA) => void;
  onViewRpi: (id: string) => void;
  onDeleteCapa: (id: string) => void;
}

const CAPAManagement: React.FC<CAPAManagementProps> = ({ capas, onUpdateCapa, onViewRpi, onDeleteCapa }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCapa, setEditingCapa] = useState<CAPA | null>(null);

  const displayedCapas = capas.filter(capa => {
    const matchesStatus = statusFilter === 'All' || capa.status === statusFilter;
    const matchesSearch = 
      capa.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) || 
      capa.actionPlan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCapa) {
      onUpdateCapa(editingCapa);
      setEditingCapa(null);
    }
  };

  return (
    <div className="space-y-6 relative animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ClipboardCheck className="text-green-600" size={32} /> Central CAPA Registry
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Institutional memory of all performance improvement actions.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search root cause or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none w-full md:w-80 shadow-sm"
            />
          </div>

          {/* Status Filters */}
          <div className="flex bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm">
            {['All', 'Open', 'Resolved', 'Overdue'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  statusFilter === s ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {displayedCapas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pb-20">
          {displayedCapas.map(capa => {
            const rpi = MOCK_RPIS.find(r => r.id === capa.rpiId);
            return (
              <div key={capa.id} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-green-500/20 transition-all group animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${
                      capa.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                      capa.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {capa.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Registry ID: {capa.id.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      <Calendar size={14} className="text-slate-300" /> Due: {capa.dueDate}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      <User size={14} className="text-slate-300" /> {capa.owner}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onViewRpi(capa.rpiId)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all"
                        title="View RPI Details"
                      >
                        <Info size={20} />
                      </button>
                      <button 
                        onClick={() => setEditingCapa(capa)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        title="Edit Record"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this CAPA record?')) onDeleteCapa(capa.id);
                        }}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Delete Record"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  <div className="md:col-span-1 border-r border-slate-100 pr-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Linked Indicator</p>
                    <button 
                      onClick={() => onViewRpi(capa.rpiId)}
                      className="flex items-center gap-2 group/rpi mb-2"
                    >
                      <p className="text-sm font-bold text-slate-900 group-hover/rpi:text-green-600 transition-colors">{rpi?.code}</p>
                      <ExternalLink size={12} className="text-slate-300 group-hover/rpi:text-green-400" />
                    </button>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-3">{rpi?.description}</p>
                  </div>
                  <div className="md:col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Root Cause Analysis</p>
                    <p className="text-sm text-slate-700 leading-relaxed font-bold">{capa.rootCause}</p>
                  </div>
                  <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Corrective Action Plan</p>
                    <p className="text-base text-slate-900 font-bold italic leading-tight">"{capa.actionPlan}"</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-32 flex flex-col items-center justify-center text-slate-400">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <ClipboardCheck size={48} className="opacity-10 text-slate-900" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No CAPA Records Found</h3>
          <p className="text-sm font-medium mt-2">Try clearing your filters or create a new entry.</p>
          <button 
            onClick={() => {setSearchQuery(''); setStatusFilter('All');}}
            className="mt-6 text-xs font-black uppercase text-green-600 hover:text-green-700 tracking-widest border-b-2 border-green-600/30"
          >
            Reset Search Filters
          </button>
        </div>
      )}

      {/* Edit Modal (Keeping for CRUD/Edit functionality) */}
      {editingCapa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 tracking-tight">
                  <Edit3 size={20} className="text-green-400" /> Update CAPA Record
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Registry ID: {editingCapa.id}</p>
              </div>
              <button onClick={() => setEditingCapa(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Root Cause Analysis</label>
                <textarea 
                  required
                  value={editingCapa.rootCause}
                  onChange={e => setEditingCapa({...editingCapa, rootCause: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Action Plan</label>
                <textarea 
                  required
                  value={editingCapa.actionPlan}
                  onChange={e => setEditingCapa({...editingCapa, actionPlan: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Owner</label>
                  <input 
                    required
                    type="text"
                    value={editingCapa.owner}
                    onChange={e => setEditingCapa({...editingCapa, owner: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Due Date</label>
                  <input 
                    required
                    type="date"
                    value={editingCapa.dueDate}
                    onChange={e => setEditingCapa({...editingCapa, dueDate: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Resolution Status</label>
                <select 
                  value={editingCapa.status}
                  onChange={e => setEditingCapa({...editingCapa, status: e.target.value as any})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none"
                >
                  <option value="Open">Open</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setEditingCapa(null)}
                  className="flex-1 px-4 py-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-green-500/20 hover:bg-green-700 transition-all"
                >
                  <Save size={20} /> Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CAPAManagement;


import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import ImprovementEngine from './components/ImprovementEngine.tsx';
import WHOMapping from './components/WHOMapping.tsx';
import RPIDetail from './components/RPIDetail.tsx';
import CAPAManagement from './components/CAPAManagement.tsx';
import CAPAForm from './components/CAPAForm.tsx';
import LandingPage from './components/LandingPage.tsx';
import { MOCK_RPIS, MOCK_CAPAS } from './constants.ts';
import { PerformanceStatus, RPI, CAPA } from './types.ts';
import { Search, Filter, ChevronRight, Info, LayoutList } from 'lucide-react';

// Internal component for RPI List view
interface RPITrackerProps {
  onSelectRpi: (id: string) => void;
}

const RPITracker: React.FC<RPITrackerProps> = ({ onSelectRpi }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">RPI Performance Tracker</h2>
          <p className="text-slate-500 text-sm">Real-time monitoring of all 61 approved Regulatory Performance Indicators.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md">
            + New RPI Definition
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-4 px-6 border-b">Indicator Detail</th>
                <th className="py-4 px-6 border-b text-center">Baseline</th>
                <th className="py-4 px-6 border-b text-center">Target</th>
                <th className="py-4 px-6 border-b text-center">Actual</th>
                <th className="py-4 px-6 border-b">Status</th>
                <th className="py-4 px-6 border-b">Source</th>
                <th className="py-4 px-6 border-b text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RPIS.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 mb-1">{r.code} • {r.function}</span>
                      <span className="text-sm font-semibold text-slate-800 leading-tight">{r.description}</span>
                      <span className="text-[10px] text-green-600 font-bold mt-1">WHO Indicator: {r.whoGbtLinkage}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-slate-500">{r.baseline}{r.unit}</td>
                  <td className="py-4 px-6 text-center text-sm font-bold text-slate-700">{r.target}{r.unit}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-sm font-bold ${r.currentValue >= r.target ? 'text-green-600' : 'text-red-600'}`}>
                      {r.currentValue}{r.unit}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${
                        r.status === PerformanceStatus.ACHIEVED ? 'bg-green-100 text-green-700' :
                        r.status === PerformanceStatus.ON_TRACK ? 'bg-blue-100 text-blue-700' :
                        r.status === PerformanceStatus.BEHIND ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {r.status}
                      </span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-300" style={{ width: `${Math.min((r.currentValue / r.target) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold border border-slate-200 px-2 py-1 rounded text-slate-500">{r.dataSource}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => onSelectRpi(r.id)}
                      className="text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedRpiId, setSelectedRpiId] = useState<string | null>(null);
  const [capas, setCapas] = useState<CAPA[]>(MOCK_CAPAS);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleViewRpiDetail = (id: string) => {
    setSelectedRpiId(id);
    setActiveTab('rpi-detail');
  };

  const handleAddCapa = (capa: CAPA) => {
    setCapas(prev => [capa, ...prev]);
    setActiveTab('capa');
  };

  const handleDeleteCapa = (id: string) => {
    setCapas(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateCapa = (updatedCapa: CAPA) => {
    setCapas(prev => prev.map(c => c.id === updatedCapa.id ? updatedCapa : c));
  };

  const selectedRpi = MOCK_RPIS.find(r => r.id === selectedRpiId);

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onNavigate={handleTabChange} />;
      case 'dashboard':
        return <Dashboard />;
      case 'rpi':
        return <RPITracker onSelectRpi={(id) => handleViewRpiDetail(id)} />;
      case 'rpi-detail':
        return selectedRpi ? (
          <RPIDetail 
            rpi={selectedRpi} 
            onBack={() => {
              setSelectedRpiId(null);
              setActiveTab('rpi');
            }} 
            capas={capas.filter(c => c.rpiId === selectedRpiId)}
            onAddCapa={handleAddCapa}
            onViewAllCapas={() => setActiveTab('capa')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Info size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Indicator Selected</h3>
            <p className="text-slate-500 max-w-sm mt-2 mb-8">
              Detailed performance insights and AI diagnostics are generated on a per-indicator basis. Please select an RPI from the performance tracker to proceed.
            </p>
            <button 
              onClick={() => setActiveTab('rpi')}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95"
            >
              <LayoutList size={18} /> Go to Performance Tracker
            </button>
          </div>
        );
      case 'capa':
        return (
          <CAPAManagement 
            capas={capas} 
            onUpdateCapa={handleUpdateCapa} 
            onViewRpi={handleViewRpiDetail}
            onDeleteCapa={handleDeleteCapa}
          />
        );
      case 'capa-add':
        return (
          <CAPAForm 
            onSave={handleAddCapa}
            onCancel={() => setActiveTab('capa')}
          />
        );
      case 'improvement':
        return <ImprovementEngine />;
      case 'who':
        return <WHOMapping />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabChange} selectedRpiCode={selectedRpi?.code}>
      {renderContent()}
    </Layout>
  );
}

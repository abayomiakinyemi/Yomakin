
import React, { useState } from 'react';
import { MOCK_RPIS } from '../constants';
import { RPI, PerformanceStatus } from '../types';
import { getRootCauseSuggestion, generateSpeech } from '../services/geminiService';
import { BrainCircuit, Loader2, Plus, CheckCircle2, AlertCircle, Volume2 } from 'lucide-react';

const ImprovementEngine: React.FC = () => {
  const [selectedRpi, setSelectedRpi] = useState<RPI | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAnalyze = async (rpi: RPI) => {
    setLoading(true);
    setSelectedRpi(rpi);
    const result = await getRootCauseSuggestion(rpi);
    setSuggestion(result);
    setLoading(false);
  };

  const handleSpeech = async () => {
    if (!suggestion || isSpeaking) return;
    
    setIsSpeaking(true);
    const textToSpeak = `Analysis for ${selectedRpi?.code}. 
      Top root cause: ${suggestion.root_causes[0]}. 
      Primary recommendation: ${suggestion.corrective_actions[0]}. 
      ML4 Justification: ${suggestion.ml4_justification}`;
    
    const source = await generateSpeech(textToSpeak);
    if (source) {
      source.onended = () => setIsSpeaking(false);
    } else {
      setIsSpeaking(false);
    }
  };

  const criticalRpis = MOCK_RPIS.filter(r => r.status === PerformanceStatus.RED_ALERT || r.status === PerformanceStatus.BEHIND);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BrainCircuit /> ML4 Continuous Improvement Engine
        </h2>
        <p className="opacity-90 max-w-2xl">
          Automating root-cause analysis (RCA) and Corrective and Preventive Actions (CAPA) to institutionalize performance improvement as required by WHO GBT Maturity Level 4.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 px-2 uppercase text-xs tracking-wider">Variance Backlog (Red/Amber Indicators)</h3>
          {criticalRpis.map(rpi => (
            <div 
              key={rpi.id} 
              className={`p-4 bg-white border-2 rounded-xl transition-all cursor-pointer ${selectedRpi?.id === rpi.id ? 'border-green-500 shadow-md ring-2 ring-green-100' : 'border-slate-100 hover:border-slate-300'}`}
              onClick={() => handleAnalyze(rpi)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-500">{rpi.function}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${rpi.status === PerformanceStatus.RED_ALERT ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  {rpi.status}
                </span>
              </div>
              <h4 className="font-bold text-sm mb-1">{rpi.code}: {rpi.description.substring(0, 80)}...</h4>
              <div className="flex items-center gap-4 text-xs mt-2">
                <div>Target: <span className="font-bold">{rpi.target}{rpi.unit}</span></div>
                <div>Actual: <span className="font-bold text-red-600">{rpi.currentValue}{rpi.unit}</span></div>
                <div className="flex-1 text-right">
                  <button className="text-green-600 font-bold hover:underline flex items-center gap-1 ml-auto">
                    Analyze Root Cause <BrainCircuit size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 min-h-[500px] flex flex-col shadow-sm">
          {!selectedRpi ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <BrainCircuit size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Select an RPI from the backlog to generate AI-assisted RCA and CAPA.</p>
            </div>
          ) : loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <Loader2 size={48} className="animate-spin text-green-600 mb-4" />
              <p className="text-lg font-bold">Querying ReguPulse Intelligence Hub...</p>
              <p className="text-slate-500 text-sm">Analyzing historical performance and WHO GBT benchmarks.</p>
            </div>
          ) : suggestion ? (
            <div className="p-8 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Analysis Results</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handleSpeech}
                    disabled={isSpeaking}
                    className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-bold border transition-all ${isSpeaking ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                  >
                    <Volume2 size={16} className={isSpeaking ? 'animate-pulse' : ''} />
                    {isSpeaking ? 'Speaking...' : 'Listen'}
                  </button>
                  <button className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-green-700 transition-all">
                     <Plus size={16} /> Create Plan
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-500" /> Possible Root Causes
                </h4>
                <ul className="space-y-3">
                  {suggestion.root_causes?.map((rc: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <span className="font-bold text-green-600">{i+1}.</span>
                      {rc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                   <CheckCircle2 size={14} className="text-green-500" /> Corrective Actions
                </h4>
                <div className="grid gap-3">
                  {suggestion.corrective_actions?.map((ca: string, i: number) => (
                    <div key={i} className="p-4 border-l-4 border-green-500 bg-green-50/30 text-sm rounded-r-lg shadow-sm">
                      {ca}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">WHO ML4 Justification</h4>
                <p className="text-sm italic text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                  "{suggestion.ml4_justification}"
                </p>
              </div>
            </div>
          ) : (
             <div className="p-8 text-center text-red-500">Error generating suggestions. Please check API configuration.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImprovementEngine;

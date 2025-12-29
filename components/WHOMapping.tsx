
import React from 'react';
import { MOCK_RPIS } from '../constants';
import { FileText, ExternalLink, ShieldCheck, Download } from 'lucide-react';

const WHOMapping: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">WHO GBT & WLA Evidence Mapping</h2>
          <p className="text-slate-500 text-sm mt-1">Cross-referencing RPI performance with WHO indicators for audit readiness.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-slate-800">
          <Download size={18} /> Export Audit-Ready Pack
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-green-700 tracking-wider">ML4 Readiness Score</span>
            <ShieldCheck className="text-green-600" />
          </div>
          <div className="text-4xl font-bold text-green-700">88.4%</div>
          <p className="text-xs text-green-600/70 mt-2">Across 210 Sub-indicators</p>
          <div className="w-full h-2 bg-green-200 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-green-600 w-[88%]"></div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-blue-700 tracking-wider">WLA Recognition Potential</span>
            <ExternalLink className="text-blue-600" size={18} />
          </div>
          <div className="text-4xl font-bold text-blue-700">5 Functions</div>
          <p className="text-xs text-blue-600/70 mt-2">MA, LT, RI, RS, CT</p>
          <div className="flex gap-2 mt-4">
             <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">MA</div>
             <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">LT</div>
             <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">RI</div>
             <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">RS</div>
             <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">CT</div>
          </div>
        </div>

        <div className="bg-slate-100 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">System Integrations</span>
            <FileText className="text-slate-600" size={18} />
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">7/8 Live Links</div>
          <p className="text-xs text-slate-500 mt-2 italic">NAPAMS, VigiFlow, LIMS connected</p>
          <div className="mt-4 flex -space-x-2">
            {[1,2,3,4,5,6].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[8px] font-bold">S{i}</div>)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold">ML4 Indicator-to-Evidence Matrix</h3>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs">
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               Verified
             </div>
             <div className="flex items-center gap-2 text-xs">
               <div className="w-3 h-3 rounded-full bg-amber-500"></div>
               Pending
             </div>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/50">
              <th className="py-4 px-6 border-b">WHO GBT Indicator (ML4)</th>
              <th className="py-4 px-6 border-b">NAFDAC RPI Equivalent</th>
              <th className="py-4 px-6 border-b">Objective Evidence</th>
              <th className="py-4 px-6 border-b">Verification Status</th>
              <th className="py-4 px-6 border-b text-right">Preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_RPIS.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{r.whoGbtLinkage}</span>
                  <p className="text-xs text-slate-500 mt-1">Continuous improvement of {r.function} processes.</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm font-medium text-slate-900">{r.code}</p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <FileText size={14} />
                    {r.dataSource}_Perf_Report_Q3.pdf
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${r.currentValue >= r.target ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.currentValue >= r.target ? 'VERIFIED' : 'PENDING TARGET'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-900 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WHOMapping;

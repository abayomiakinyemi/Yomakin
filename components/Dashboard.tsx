
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { MOCK_RPIS, FUNCTION_COLORS } from '../constants.ts';
import { PerformanceStatus, RegulatoryFunction } from '../types.ts';
import { ArrowUpRight, ArrowDownRight, Activity, Target, AlertTriangle, ShieldCheck } from 'lucide-react';

const StatCard: React.FC<{title: string, value: string, change: string, icon: React.ReactNode, trend: string, isCritical?: boolean}> = ({
  title, value, change, icon, trend, isCritical
}) => (
  <div className={`p-6 bg-white rounded-xl border ${isCritical ? 'border-red-200 bg-red-50/20' : 'border-slate-200'} shadow-sm`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
      <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend === 'up' ? '+5.2%' : '-2.4%'}
      </div>
    </div>
    <h4 className="text-sm font-medium text-slate-500">{title}</h4>
    <p className="text-2xl font-bold mt-1">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{change}</p>
  </div>
);

export default function Dashboard() {
  // Aggregate data
  const statusCounts = MOCK_RPIS.reduce((acc, rpi) => {
    acc[rpi.status] = (acc[rpi.status] || 0) + 1;
    return acc;
  }, {} as Record<PerformanceStatus, number>);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  
  const functionPerformance = Object.values(RegulatoryFunction).map(func => {
    const fRpis = MOCK_RPIS.filter(r => r.function === func);
    if (fRpis.length === 0) return { name: func, score: 0 };
    const avg = fRpis.reduce((acc, curr) => acc + (curr.currentValue / curr.target) * 100, 0) / fRpis.length;
    return { name: func.substring(0, 15) + '...', score: Math.min(Math.round(avg), 100) };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total RPIs Tracked" 
          value="61" 
          change="+12% from prev yr" 
          icon={<Activity className="text-blue-500" />} 
          trend="up"
        />
        <StatCard 
          title="Avg Performance Score" 
          value="78%" 
          change="-2% vs target" 
          icon={<Target className="text-green-500" />} 
          trend="down"
        />
        <StatCard 
          title="Red Alert Indicators" 
          value="4" 
          change="Requires Action" 
          icon={<AlertTriangle className="text-red-500" />} 
          trend="down"
          isCritical
        />
        <StatCard 
          title="WHO Evidence Units" 
          value="142" 
          change="Audit Ready" 
          icon={<ShieldCheck className="text-violet-500" />} 
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            Regulatory Function Scorecard
            <span className="text-xs font-normal text-slate-400">(Avg. % Achievement of Targets)</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={functionPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis unit="%" domain={[0, 100]} fontSize={12} />
                <Tooltip />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {functionPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 85 ? '#10b981' : entry.score > 60 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Status Distribution</h3>
          <div className="h-[240px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === PerformanceStatus.ACHIEVED ? '#10b981' : 
                        entry.name === PerformanceStatus.ON_TRACK ? '#3b82f6' :
                        entry.name === PerformanceStatus.BEHIND ? '#f59e0b' : '#ef4444'
                      } 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">82%</span>
              <span className="text-xs text-slate-400">On-Track</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                   <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: i === 0 ? '#10b981' : i === 1 ? '#3b82f6' : i === 2 ? '#f59e0b' : '#ef4444'}}></div>
                   {d.name}
                </span>
                <span className="font-bold">{d.value} RPIs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Critical Indicators (Red Alerts)</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-400 border-b border-slate-100">
              <th className="py-3 px-4 font-semibold">Function</th>
              <th className="py-3 px-4 font-semibold">Indicator</th>
              <th className="py-3 px-4 font-semibold">Target</th>
              <th className="py-3 px-4 font-semibold">Current</th>
              <th className="py-3 px-4 font-semibold">Trend</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RPIS.filter(r => r.status === PerformanceStatus.RED_ALERT || r.status === PerformanceStatus.BEHIND).map((r, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                    {r.function}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-sm">{r.description}</td>
                <td className="py-3 px-4 text-sm">{r.target}{r.unit}</td>
                <td className="py-3 px-4 text-sm font-bold text-red-600">{r.currentValue}{r.unit}</td>
                <td className="py-3 px-4">
                  {r.trend === 'down' ? <ArrowDownRight className="text-red-500" /> : <ArrowUpRight className="text-green-500" />}
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-green-600 text-xs font-bold hover:underline">Launch CAPA</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

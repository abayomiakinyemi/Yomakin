
import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  ShieldCheck, 
  ClipboardList, 
  ClipboardCheck, 
  Settings, 
  ArrowRight,
  Target,
  FileSearch,
  Zap,
  ChevronRight,
  MonitorCheck,
  BadgeCheck
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

const ModuleCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  badge?: string;
}> = ({ title, description, icon, color, onClick, badge }) => (
  <button 
    onClick={onClick}
    className="group relative flex flex-col items-start p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-green-900/10 hover:border-[#006b35]/20 transition-all duration-500 text-left overflow-hidden h-full transform hover:-translate-y-1"
  >
    <div className={`absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 ${color}`}></div>
    
    <div className={`p-5 rounded-3xl mb-8 transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-sm ${color.replace('bg-', 'bg-').replace('-500', '-50')}`}>
      <div className={`${color.replace('bg-', 'text-')}`}>
        {icon}
      </div>
    </div>

    {badge && (
      <span className="absolute top-8 right-8 px-4 py-1.5 bg-red-100 text-red-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em] animate-pulse shadow-sm">
        {badge}
      </span>
    )}

    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#006b35] transition-colors">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed mb-10 font-medium">
      {description}
    </p>
    
    <div className="mt-auto flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#006b35]/40 group-hover:text-[#006b35] transition-all">
      Open Module <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);

const HeroSection = () => (
  <section className="relative h-[650px] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
    {/* Professional High-Fidelity Background with Green Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=2080" 
        alt="Regulatory Laboratory Professional" 
        className="w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#006b35]/95 via-[#004d26]/90 to-black/70 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
    </div>

    {/* Hero Content */}
    <div className="relative z-10 max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Central NAFDAC Logo */}
      <div className="mb-12 inline-block p-6 bg-white rounded-[3rem] shadow-2xl shadow-black/30 border-4 border-white transform transition-transform hover:scale-105 duration-700">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Nafdac_Logo.png" 
          alt="NAFDAC Official Logo" 
          className="h-32 w-auto object-contain"
          onError={(e) => {
            (e.target as any).style.display = 'none';
            (e.target as any).parentElement.innerHTML = '<div class="h-32 w-32 bg-[#006b35] rounded-3xl flex items-center justify-center font-black text-white italic text-5xl">N</div>';
          }}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-green-300 text-sm font-black uppercase tracking-[0.8em] drop-shadow-lg">FEDERAL REPUBLIC OF NIGERIA</h4>
        <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter leading-none drop-shadow-2xl">
          National Agency For Food <br /> & Drug Administration <span className="text-green-400">Control</span>
        </h1>
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="h-px w-16 bg-white/20"></div>
          <p className="text-xl text-green-100/90 font-medium italic">Continuous Performance Monitoring Hub • ReguPulse ML4</p>
          <div className="h-px w-16 bg-white/20"></div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-3">
          <BadgeCheck className="text-green-400" size={20} />
          <span className="text-sm font-bold text-white uppercase tracking-widest">WLA Readiness: 84.2%</span>
        </div>
        <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-3">
          <MonitorCheck className="text-blue-400" size={20} />
          <span className="text-sm font-bold text-white uppercase tracking-widest">Real-time Data Streams</span>
        </div>
      </div>
    </div>
  </section>
);

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const modules = [
    {
      id: 'dashboard',
      title: 'Executive View',
      description: 'Strategic intelligence suite for the Director General and Executive Directors. Integrated maturity trends.',
      icon: <LayoutDashboard size={36} />,
      color: 'bg-blue-600'
    },
    {
      id: 'rpi',
      title: 'RPI Performance',
      description: 'Granular tracking of all 61 Regulatory Performance Indicators. Automated WLA evidence generation.',
      icon: <BarChart3 size={36} />,
      color: 'bg-green-600',
      badge: '4 Red Alerts'
    },
    {
      id: 'capa',
      title: 'CAPA Management',
      description: 'Central registry for Corrective and Preventive Actions. Institutional memory for regulatory improvement.',
      icon: <ClipboardCheck size={36} />,
      color: 'bg-orange-500'
    },
    {
      id: 'improvement',
      title: 'Improvement Engine',
      description: 'AI-assisted RCA diagnostic hub. Gemini Intelligence mapping of performance gaps to ML4 targets.',
      icon: <Zap size={36} />,
      color: 'bg-purple-600'
    },
    {
      id: 'who',
      title: 'WHO Evidence',
      description: 'GBT Mapping module. Dynamic alignment of agency outputs to Global Benchmarking Tool criteria.',
      icon: <ShieldCheck size={36} />,
      color: 'bg-[#006b35]'
    },
    {
      id: 'settings',
      title: 'System Config',
      description: 'Gateway settings, indicator metadata management, and institutional timeline synchronization.',
      icon: <Settings size={36} />,
      color: 'bg-slate-700'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative pb-32">
      {/* Background Subtle Elements */}
      <div className="absolute top-[650px] left-0 w-full h-[500px] bg-gradient-to-b from-slate-50 to-white -z-10"></div>

      {/* Immersive Hero Header */}
      <HeroSection />

      {/* Module Selection Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in zoom-in-95 duration-1000 delay-300">
          {modules.map((m) => (
            <ModuleCard 
              key={m.id}
              title={m.title}
              description={m.description}
              icon={m.icon}
              color={m.color}
              badge={m.badge}
              onClick={() => onNavigate(m.id)}
            />
          ))}
        </div>

        {/* Actionable Footer for Landing Page */}
        <div className="mt-24 pt-16 border-t border-slate-100 text-center animate-in fade-in duration-1000 delay-500">
          <div className="inline-flex items-center gap-10 bg-slate-50 px-10 py-5 rounded-[2.5rem] border border-slate-200 mb-16 shadow-inner">
             <div className="flex flex-col items-start gap-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Version</span>
               <span className="text-sm font-bold text-slate-800">ReguPulse v4.1 (ML4 Edition)</span>
             </div>
             <div className="w-px h-8 bg-slate-200"></div>
             <div className="flex flex-col items-start gap-1 text-left">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-sm font-bold text-[#006b35]">All Modules Operational</span>
               </div>
             </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {['Official NAPAMS Site', 'WLA Dashboard', 'LIMS Central Hub', 'WHO GBT Portal'].map((link) => (
              <button key={link} className="group flex items-center gap-2 px-8 py-3 bg-white hover:bg-[#006b35] hover:text-white border border-slate-200 hover:border-[#006b35] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-sm">
                <FileSearch size={14} className="opacity-40 group-hover:opacity-100" /> {link}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] max-w-2xl mx-auto leading-loose">
            NAFDAC Internal Network • Strategic Information System <br />
            © 2024 NAFDAC Digital Transformation Office • Safeguarding Public Health
          </p>
        </div>
      </div>
    </div>
  );
}

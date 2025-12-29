
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  ShieldCheck, 
  ClipboardList, 
  ClipboardCheck,
  Settings, 
  Bell,
  Search,
  UserCircle,
  Info,
  Home,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  List
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  children?: { id: string; label: string; icon: React.ElementType }[];
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRpiCode?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, selectedRpiCode }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['capa-mgmt']);
  const isLanding = activeTab === 'landing';

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const menuItems: MenuItem[] = [
    { id: 'landing', label: 'Portal Home', icon: Home },
    { id: 'dashboard', label: 'Executive View', icon: LayoutDashboard },
    { id: 'rpi', label: 'RPI Performance', icon: BarChart3 },
    { id: 'rpi-detail', label: selectedRpiCode ? `RPI Detail: ${selectedRpiCode}` : 'RPI Details', icon: Info },
    { 
      id: 'capa-mgmt', 
      label: 'CAPA Management', 
      icon: ClipboardCheck,
      children: [
        { id: 'capa', label: 'Central Registry', icon: List },
        { id: 'capa-add', label: 'Add a CAPA', icon: PlusCircle },
      ]
    },
    { id: 'improvement', label: 'Improvement Engine', icon: ShieldCheck },
    { id: 'who', label: 'WHO Evidence', icon: ClipboardList },
    { id: 'settings', label: 'System Config', icon: Settings },
  ];

  const isActive = (item: MenuItem) => {
    if (activeTab === item.id) return true;
    if (item.children?.some(child => child.id === activeTab)) return true;
    return false;
  };

  // Completely clean view for the Landing Page
  if (isLanding) {
    return (
      <div className="h-screen w-full bg-white overflow-y-auto overflow-x-hidden font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      {/* Sidebar - Visible only on internal modules - NAFDAC Deep Green #006b35 */}
      <aside className="w-72 bg-[#006b35] text-white flex flex-col shrink-0 shadow-2xl z-20 border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 border-2 border-green-400 group-hover:scale-105 transition-transform shrink-0 shadow-lg overflow-hidden">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Nafdac_Logo.png" 
                 alt="NAFDAC" 
                 className="w-full h-full object-contain" 
                 onError={(e) => {
                   (e.target as any).style.display = 'none';
                   (e.target as any).parentElement.innerHTML = '<div class="w-full h-full bg-[#004d26] flex items-center justify-center font-black text-white italic text-2xl tracking-tighter">N</div>';
                 }} 
               />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ReguPulse <span className="text-green-400">ML4</span></h1>
              <p className="text-[8px] text-green-200 uppercase tracking-widest font-black opacity-80">NAFDAC PERFORMANCE</p>
            </div>
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isMenuExpanded = expandedMenus.includes(item.id);
            const active = isActive(item);

            if (item.children) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active ? 'text-white' : 'text-green-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </div>
                    {isMenuExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  
                  {isMenuExpanded && (
                    <div className="ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-left-2 duration-200">
                      {item.children.map(child => (
                        <button
                          key={child.id}
                          onClick={() => setActiveTab(child.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === child.id 
                              ? 'bg-green-500 text-white shadow-md' 
                              : 'text-green-200/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <child.icon size={14} />
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 bg-black/20">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
            <UserCircle className="text-green-300" />
            <div className="overflow-hidden text-green-50">
              <p className="text-sm font-bold truncate">Director General</p>
              <p className="text-[10px] text-green-400 uppercase font-black">Strategic User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header - Modern & Clean */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search RPIs, functions, or evidence..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#006b35] transition-all focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-[#006b35] uppercase">WLA Readiness: 84%</span>
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-green-500 w-[84%]"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

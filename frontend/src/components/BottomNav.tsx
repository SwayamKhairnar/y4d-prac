import React from 'react';
import { TabType } from '../types';
import { Home, ListFilter, LayoutDashboard, PlusCircle } from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenCreate: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  onOpenCreate,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#bcc9c6]/40 shadow-lg py-2 px-3 flex items-center justify-around"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)' }}
      id="mobile-bottom-navigation"
    >
      {/* Home Tab */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all active:scale-95 duration-150 ${
          currentTab === 'home'
            ? 'bg-[#008378] text-white shadow-xs'
            : 'text-[#3d4947] hover:bg-[#eff4ff]'
        }`}
        id="mobile-nav-home"
      >
        <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-xs font-medium mt-0.5">Home</span>
      </button>

      {/* Requests Tab */}
      <button
        onClick={() => onNavigate('requests')}
        className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all active:scale-95 duration-150 ${
          currentTab === 'requests'
            ? 'bg-[#008378] text-white shadow-xs'
            : 'text-[#3d4947] hover:bg-[#eff4ff]'
        }`}
        id="mobile-nav-requests"
      >
        <ListFilter className={`w-5 h-5 ${currentTab === 'requests' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-xs font-medium mt-0.5">Requests</span>
      </button>

      {/* Quick Create Button */}
      <button
        onClick={onOpenCreate}
        className="flex flex-col items-center justify-center px-3 py-1 rounded-xl text-[#00685f] hover:bg-[#eff4ff] active:scale-95 transition-all"
        id="mobile-nav-create"
      >
        <PlusCircle className="w-5 h-5 stroke-[2]" />
        <span className="text-xs font-medium mt-0.5">Post</span>
      </button>

      {/* Dashboard Tab */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all active:scale-95 duration-150 ${
          currentTab === 'dashboard'
            ? 'bg-[#008378] text-white shadow-xs'
            : 'text-[#3d4947] hover:bg-[#eff4ff]'
        }`}
        id="mobile-nav-dashboard"
      >
        <LayoutDashboard className={`w-5 h-5 ${currentTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-xs font-medium mt-0.5">Dashboard</span>
      </button>
    </nav>
  );
};

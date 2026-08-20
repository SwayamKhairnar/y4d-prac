import React, { useState } from 'react';
import { TabType, UserProfile } from '../types';
import { Menu, X, Plus, HeartHandshake, Bell, User, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenCreate: () => void;
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenCreate,
  user,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-40 h-16 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#bcc9c6]/40 transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
          {/* Left: Brand & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 rounded-full text-[#00685f] hover:bg-[#eff4ff] active:scale-95 transition-all"
              aria-label="Toggle menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer group select-none"
              id="brand-logo-btn"
            >
              <div className="w-9 h-9 rounded-xl bg-[#00685f] text-white flex items-center justify-center shadow-sm group-hover:bg-[#008378] transition-colors">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-headline text-xl md:text-2xl font-bold text-[#00685f] tracking-tight group-hover:text-[#008378] transition-colors">
                Y4D Help Hub
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#bcc9c6]/30">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'home'
                  ? 'bg-white text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#00685f] hover:bg-white/50'
              }`}
              id="nav-home-btn"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('requests')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'requests'
                  ? 'bg-white text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#00685f] hover:bg-white/50'
              }`}
              id="nav-requests-btn"
            >
              Requests
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-white text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#00685f] hover:bg-white/50'
              }`}
              id="nav-dashboard-btn"
            >
              Dashboard
            </button>
          </nav>

          {/* Right: Actions & User Avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreate}
              className="hidden sm:flex items-center gap-2 bg-[#00685f] hover:bg-[#008378] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
              id="create-request-header-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create Request</span>
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full border border-[#bcc9c6] overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#00685f] active:scale-95 transition-all"
                id="user-profile-menu-btn"
                aria-label="User Profile"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#bcc9c6]/40 p-4 z-50 animate-in fade-in slide-in-from-top-2"
                  id="user-profile-dropdown"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-[#eff4ff]">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#bcc9c6]/50"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#0d1c2e] truncate">{user.name}</p>
                      <p className="text-xs text-[#3d4947] truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <div className="text-xs text-[#3d4947] px-2 py-1 flex justify-between">
                      <span>Helped with:</span>
                      <span className="font-semibold text-[#00685f]">{user.helpedWithCount} requests</span>
                    </div>
                    <div className="text-xs text-[#3d4947] px-2 py-1 flex justify-between">
                      <span>Total contributions:</span>
                      <span className="font-semibold text-[#4648d4]">{user.totalContributionsCount} actions</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#eff4ff] space-y-1">
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-[#0d1c2e] hover:bg-[#eff4ff] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#00685f]" />
                      <span>View Activity Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenCreate();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-[#00685f] font-medium hover:bg-[#eff4ff] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Submit New Request</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#eff4ff]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span className="font-headline font-bold text-lg text-[#00685f]">Y4D Help Hub</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#3d4947] hover:bg-[#eff4ff]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => {
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    currentTab === 'home'
                      ? 'bg-[#eff4ff] text-[#00685f]'
                      : 'text-[#3d4947] hover:bg-[#f8f9ff]'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    onNavigate('requests');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    currentTab === 'requests'
                      ? 'bg-[#eff4ff] text-[#00685f]'
                      : 'text-[#3d4947] hover:bg-[#f8f9ff]'
                  }`}
                >
                  Community Requests
                </button>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    currentTab === 'dashboard'
                      ? 'bg-[#eff4ff] text-[#00685f]'
                      : 'text-[#3d4947] hover:bg-[#f8f9ff]'
                  }`}
                >
                  Your Activity Dashboard
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-[#eff4ff]">
                <button
                  onClick={() => {
                    onOpenCreate();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-[#00685f] text-white rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Request</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#eff4ff] flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0d1c2e] truncate">{user.name}</p>
                <p className="text-xs text-[#3d4947]">Active Citizen</p>
              </div>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

import React, { useState } from 'react';
import { Bell, Shield, User, ChevronDown, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface NavbarProps {
  activeIncidentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeIncidentsCount }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-[#0B1E36] text-white border-b border-[#1E3A5F] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Bharat RakshaMarg
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#1A365D] text-amber-300 border border-[#2B4C7E]">
                  SIH 2026 · PS26124
                </span>
              </div>
              <p className="text-xs text-slate-300 font-normal">
                Urban Intelligence Dashboard
              </p>
            </div>
          </div>

          {/* Right Section: Fleet Status, Notification, Transport Authority Profile */}
          <div className="flex items-center space-x-4">
            {/* Live Telemetry Pill */}
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#11294A] border border-[#224472] text-xs text-slate-200">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-300">Fleet AI Telemetry:</span>
              <span className="font-semibold text-emerald-300">Active</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="navbar-notifications-btn"
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 rounded-lg text-slate-200 hover:text-white hover:bg-[#1A365D] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {activeIncidentsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow">
                    {activeIncidentsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div 
                  id="notifications-dropdown"
                  className="absolute right-0 mt-2 w-80 rounded-lg bg-white text-slate-800 shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in"
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">Incident Alerts</span>
                    <span className="text-xs text-slate-500">{activeIncidentsCount} telemetry alerts</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    <div className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">Pothole detected by PMPML-102</p>
                          <p className="text-[11px] text-slate-500">FC Road transit lane · 08:14 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">High traffic density on Swargate</p>
                          <p className="text-[11px] text-slate-500">PMPML-108 · 07:45 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-2 text-center bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
                    Live mobile edge telemetry from Pune transport fleet
                  </div>
                </div>
              )}
            </div>

            {/* Transport Authority Profile */}
            <div className="relative">
              <button
                id="navbar-profile-btn"
                type="button"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-[#1A365D] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-amber-400 flex items-center justify-center text-[#0B1E36] font-bold text-xs">
                  <User className="w-4 h-4 text-slate-800" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">
                    Transport Authority
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Municipal Operations Desk
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-300 hidden sm:block" />
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div 
                  id="profile-dropdown"
                  className="absolute right-0 mt-2 w-64 rounded-lg bg-white text-slate-800 shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in"
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">Transport Authority</p>
                    <p className="text-xs text-slate-500">Division: Pune Municipal Corporation (PMC / PMPML)</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Edge Node Connectivity Online
                    </div>
                  </div>
                  <div className="px-4 py-2 text-[11px] text-slate-500">
                    Authority Role: Urban Mobility & Infrastructure Monitoring
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

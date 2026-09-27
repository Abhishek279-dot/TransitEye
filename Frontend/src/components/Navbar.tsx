import React, { useState } from 'react';
import { Bell, Shield, User, ChevronDown, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface NavbarProps {
  activeIncidentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeIncidentsCount }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="relative bg-[#0A192F] text-white shadow-lg sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Brand — logo mark + name, flush against the left edge */}
          <div className="flex items-center gap-3 shrink-0 mr-auto">
            <div className="relative w-11 h-11 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-emerald-600 opacity-90" />
              <div className="absolute inset-[2px] rounded-[10px] bg-[#0A192F] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" strokeWidth={2.2} />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0A192F] animate-pulse" />
            </div>

            <div className="flex flex-col justify-center leading-none text-left">
              <h1 className="text-[19px] font-extrabold tracking-tight text-white">
                Bharat <span className="text-amber-400">RakshaMarg</span>
              </h1>
              <p className="text-[10.5px] font-medium text-slate-400 uppercase tracking-[0.12em] mt-1">
                Urban Intelligence Dashboard
              </p>
            </div>
          </div>

          {/* Right cluster: telemetry, divider, bell, divider, profile */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Live Telemetry Pill */}
            <div className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-slate-300 text-xs whitespace-nowrap">Fleet AI Telemetry</span>
              <span className="font-bold text-emerald-300 text-xs whitespace-nowrap">Active</span>
            </div>

            <div className="hidden sm:block w-px h-6 bg-slate-700" />

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="navbar-notifications-btn"
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative flex items-center justify-center h-9 w-9 rounded-full bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="View notifications"
              >
                <Bell className="w-[18px] h-[18px]" />
                {activeIncidentsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow ring-2 ring-[#0A192F]">
                    {activeIncidentsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  id="notifications-dropdown"
                  className="absolute right-0 mt-3 w-80 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in"
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

            <div className="hidden sm:block w-px h-6 bg-slate-700" />

            {/* Transport Authority Profile */}
            <div className="relative">
              <button
                id="navbar-profile-btn"
                type="button"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2.5 h-9 pl-1.5 pr-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[#0A192F]" strokeWidth={2.5} />
                </div>
                <div className="hidden md:flex flex-col justify-center leading-tight text-left">
                  <span className="text-xs font-semibold text-white">
                    Transport Authority
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Municipal Operations Desk
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
              </button>

              {showProfileMenu && (
                <div
                  id="profile-dropdown"
                  className="absolute right-0 mt-3 w-64 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in"
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

      {/* Signature brand accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500" />
    </header>
  );
};
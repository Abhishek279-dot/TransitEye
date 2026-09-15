import React from 'react';
import { Incident } from '../types';
import { EVENT_TYPE_CONFIG, STATUS_CONFIG } from '../utils/constants';
import { Bus, Clock, ShieldAlert, Camera, MapPin, Check, AlertTriangle } from 'lucide-react';

interface RecentIncidentsPanelProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

export const RecentIncidentsPanel: React.FC<RecentIncidentsPanelProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
}) => {
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return '';
    }
  };

  return (
    <aside
      id="recent-incidents-panel"
      className="w-full lg:w-84 xl:w-96 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden shrink-0 shadow-sm"
    >
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Recent Incidents
          </h2>
        </div>
        <span 
          id="recent-incidents-counter"
          className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700"
        >
          {incidents.length} Events
        </span>
      </div>

      {/* Sub-header instruction */}
      <div className="px-3.5 py-1.5 bg-slate-100/60 border-b border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Click card to center & inspect on map</span>
        <span className="text-[10px] text-slate-400">YOLOv8 Edge Feed</span>
      </div>

      {/* Incidents List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {incidents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <AlertTriangle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No incidents found</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Adjust or clear filters in the left sidebar to view telemetry events.
            </p>
          </div>
        ) : (
          incidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const eventConfig = EVENT_TYPE_CONFIG[incident.event_type] || {
              label: incident.event_type,
              color: '#4B5563',
              bgLight: '#F3F4F6',
              borderColor: '#D1D5DB',
            };
            const statusConfig = STATUS_CONFIG[incident.status] || {
              label: incident.status,
              color: '#64748B',
              bg: '#F1F5F9',
              text: '#334155',
            };

            return (
              <div
                key={incident.id}
                id={`incident-card-${incident.id}`}
                onClick={() => onSelectIncident(incident)}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#0B1E36] bg-slate-50/90 shadow-md ring-2 ring-[#0B1E36]/15'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  {/* Evidence Thumbnail Placeholder */}
                  <div className="relative w-14 h-14 rounded-md bg-slate-900 shrink-0 overflow-hidden flex flex-col items-center justify-center border border-slate-700">
                    {/* Simulated Camera Lens Grid / Bounding Box corner markers */}
                    <div className="absolute inset-1 border border-dashed border-amber-400/40 rounded-xs pointer-events-none" />
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-amber-400" />
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-amber-400" />
                    <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-amber-400" />
                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-amber-400" />

                    <Camera className="w-4 h-4 text-slate-300 mb-0.5 opacity-80" />
                    <span className="text-[8px] font-mono text-amber-300 uppercase tracking-tighter">
                      CAM-AI
                    </span>

                    {/* Miniature confidence watermark */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-slate-300 py-0.2">
                      {Math.round(incident.confidence * 100)}%
                    </div>
                  </div>

                  {/* Incident Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: eventConfig.color }}
                        />
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {eventConfig.label}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.text,
                        }}
                      >
                        {incident.status}
                      </span>
                    </div>

                    {/* Bus ID and Location / Notes */}
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <Bus className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{incident.bus_id}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{formatTime(incident.timestamp)}</span>
                        <span className="text-[10px] text-slate-400">({formatDate(incident.timestamp)})</span>
                      </div>
                    </div>

                    {incident.location_name && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mb-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{incident.location_name}</span>
                      </div>
                    )}

                    {/* Plate number OCR (Hit and Run) */}
                    {incident.plate_number && (
                      <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-[10px] font-mono text-rose-800 font-bold">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        OCR: {incident.plate_number}
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[#0B1E36]">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Focused on Map</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

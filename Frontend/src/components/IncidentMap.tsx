import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Incident } from '../types';
import { EVENT_TYPE_CONFIG, STATUS_CONFIG } from '../utils/constants';
import { Bus, Calendar, Activity, Navigation, LocateFixed, ImageIcon, X } from 'lucide-react';

interface IncidentMapProps {
  incidents: Incident[];
  selectedIncident?: Incident | null;
  onSelectIncident?: (incident: Incident) => void;
}

// Helper component to smoothly fly to selected incident
const FlyToController: React.FC<{
  targetIncident?: Incident | null;
  onMapReady?: (map: L.Map) => void;
}> = ({ targetIncident, onMapReady }) => {
  const map = useMap();

  React.useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  React.useEffect(() => {
    if (targetIncident) {
      map.flyTo([targetIncident.latitude, targetIncident.longitude], 16, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [targetIncident, map]);

  return null;
};

// Create SVG colored pin icon for Leaflet
function createColoredPinIcon(color: string, eventType: string) {
  const iconHtml = `
    <div style="position: relative; width: 32px; height: 38px; display: flex; align-items: center; justify-content: center;">
      <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 4px rgba(0,0,0,0.35));">
        <path d="M16 0C7.16344 0 0 7.16344 0 16C0 25.5 16 38 16 38C16 38 32 25.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="${color}"/>
        <circle cx="16" cy="15" r="7" fill="white"/>
        <circle cx="16" cy="15" r="4.5" fill="${color}"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-pin',
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -36],
  });
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
}) => {
  const defaultCenter: [number, number] = [18.5204, 73.8567]; // Pune
  const defaultZoom = 12;
  const [mapInstance, setMapInstance] = React.useState<L.Map | null>(null);
  const [photoIncident, setPhotoIncident] = useState<Incident | null>(null);

  // Memoize icons by event type
  const iconMap = useMemo(() => {
    const map: Record<string, L.DivIcon> = {};
    Object.keys(EVENT_TYPE_CONFIG).forEach((key) => {
      const config = EVENT_TYPE_CONFIG[key as keyof typeof EVENT_TYPE_CONFIG];
      map[key] = createColoredPinIcon(config.color, key);
    });
    return map;
  }, []);

  const handleRecenter = () => {
    if (mapInstance) {
      mapInstance.flyTo(defaultCenter, defaultZoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div id="incident-map-container" className="relative w-full h-full min-h-[500px] flex-1">
      {/* Recenter Map Control */}
      <div className="absolute top-4 right-4 z-[400] flex items-center gap-2">
        <button
          id="recenter-map-btn"
          type="button"
          onClick={handleRecenter}
          className="bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#0B1E36]"
          title="Fly back to Pune city overview"
        >
          <LocateFixed className="w-3.5 h-3.5 text-slate-600" />
          <span>Recenter City View</span>
        </button>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%', minHeight: '550px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <FlyToController
          targetIncident={selectedIncident}
          onMapReady={setMapInstance}
        />

        {incidents.map((incident) => {
          const config = EVENT_TYPE_CONFIG[incident.event_type] || {
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
          const pinIcon = iconMap[incident.event_type] || iconMap.pothole;

          return (
            <Marker
              key={incident.id}
              position={[incident.latitude, incident.longitude]}
              icon={pinIcon}
              eventHandlers={{
                click: (e) => {
                  if (onSelectIncident) {
                    onSelectIncident(incident);
                  }
                  const map = e.target._map;
                  if (map && typeof map.flyTo === 'function') {
                    map.flyTo([incident.latitude, incident.longitude], 16, {
                      duration: 1.2,
                      easeLinearity: 0.25,
                    });
                  }
                },
              }}
            >
              <Popup className="custom-incident-popup" maxWidth={300}>
                <div className="font-sans text-slate-800 w-[268px] -m-1">
                  {/* Colored accent header strip */}
                  <div
                    className="flex items-center justify-between px-3 py-2.5 rounded-t-lg"
                    style={{ backgroundColor: config.color }}
                  >
                    <span className="font-bold text-[13.5px] text-white leading-tight">
                      {config.label}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 shrink-0"
                      style={{ color: statusConfig.text }}
                    >
                      {incident.status}
                    </span>
                  </div>

                  <div className="px-3 py-2.5">
                    {/* Location */}
                    {incident.location_name && (
                      <p className="text-[12.5px] font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                        <Navigation className="w-3.5 h-3.5 shrink-0" style={{ color: config.color }} />
                        {incident.location_name}
                      </p>
                    )}

                    {/* Notes */}
                    {incident.notes && (
                      <p className="text-[11px] text-slate-500 italic mb-2.5 leading-snug">
                        "{incident.notes}"
                      </p>
                    )}

                    {/* Compact info rows — no heavy boxes, just clean spacing + divider */}
                    <div className="space-y-1.5 py-2 border-y border-slate-100">
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Activity className="w-3.5 h-3.5 text-emerald-600" />
                          AI Confidence
                        </span>
                        <span className="font-bold text-slate-800">
                          {Math.round(incident.confidence * 100)}%
                          <span className="font-normal text-slate-400 ml-1">YOLOv8</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Bus className="w-3.5 h-3.5 text-indigo-600" />
                          Bus Sensor
                        </span>
                        <span className="font-bold text-slate-800">{incident.bus_id}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Detected
                        </span>
                        <span className="font-medium text-slate-700 text-[11px]">
                          {formatDateTime(incident.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Plate number, if applicable */}
                    {incident.plate_number && (
                      <div className="mt-2 flex items-center justify-between text-[11px] bg-rose-50 px-2 py-1.5 rounded-md">
                        <span className="font-semibold text-rose-800">Plate (OCR)</span>
                        <span className="font-mono font-bold text-rose-900 bg-white px-1.5 py-0.5 rounded border border-rose-200">
                          {incident.plate_number}
                        </span>
                      </div>
                    )}

                    {/* View Photo button */}
                    <button
                      type="button"
                      onClick={() => setPhotoIncident(incident)}
                      className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-white py-1.5 rounded-md transition-opacity hover:opacity-90"
                      style={{ backgroundColor: config.color }}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      View Photo
                    </button>

                    {/* GPS footer */}
                    <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div
        id="map-legend"
        className="absolute bottom-5 right-4 z-[400] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-3 shadow-md max-w-xs text-xs"
      >
        <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-2">
          <span className="uppercase tracking-wider text-[11px]">Map Legend</span>
          <span className="text-[10px] text-slate-500 font-normal">Active Events</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {Object.entries(EVENT_TYPE_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: cfg.color }}
              />
              <span className="text-slate-700 text-[11px] font-medium truncate">
                {cfg.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <span>Center: Pune (PMPML Fleet)</span>
          <span className="font-semibold text-emerald-700">Live GIS</span>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {photoIncident && (
        <div
          className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPhotoIncident(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-800">
                {(EVENT_TYPE_CONFIG[photoIncident.event_type]?.label) || photoIncident.event_type} — Detection Snapshot
              </span>
              <button
                type="button"
                onClick={() => setPhotoIncident(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-100 flex items-center justify-center min-h-[280px]">
              {(photoIncident as any).image_url ? (
                <img
                  src={(photoIncident as any).image_url}
                  alt="Detection snapshot"
                  className="w-full h-auto max-h-[420px] object-contain"
                />
              ) : (
                <div className="text-center text-slate-400 py-16 px-6">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No snapshot available for this event yet</p>
                </div>
              )}
            </div>
            <div className="px-4 py-2.5 text-[11px] text-slate-500 bg-slate-50 border-t border-slate-100">
              {photoIncident.bus_id} · {formatDateTime(photoIncident.timestamp)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
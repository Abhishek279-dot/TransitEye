import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Incident } from '../types';
import { EVENT_TYPE_CONFIG, STATUS_CONFIG } from '../utils/constants';
import { Bus, Calendar, Activity, Navigation, LocateFixed } from 'lucide-react';

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
                  // Animated FlyTo centering the map on the selected incident location with smooth zoom
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
              <Popup className="custom-incident-popup" maxWidth={320}>
                <div className="p-1 font-sans text-slate-800">
                  {/* Header with Type & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="font-bold text-sm text-slate-900 leading-tight">
                        {config.label}
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

                  {/* Incident Location / Notes */}
                  {incident.location_name && (
                    <p className="text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-slate-400 shrink-0" />
                      {incident.location_name}
                    </p>
                  )}

                  {incident.notes && (
                    <p className="text-[11px] text-slate-500 italic mb-2.5 bg-slate-50 p-1.5 rounded border border-slate-150">
                      "{incident.notes}"
                    </p>
                  )}

                  {/* Telemetry Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/80 p-2 rounded border border-slate-200 mb-2">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        AI Confidence
                      </span>
                      <div className="flex items-center gap-1 mt-0.5 font-bold text-slate-800">
                        <Activity className="w-3 h-3 text-emerald-600" />
                        {Math.round(incident.confidence * 100)}%
                        <span className="text-[10px] font-normal text-slate-500">
                          (YOLOv8)
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        Bus Sensor
                      </span>
                      <div className="flex items-center gap-1 mt-0.5 font-bold text-slate-800">
                        <Bus className="w-3 h-3 text-indigo-600" />
                        {incident.bus_id}
                      </div>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-slate-200/80">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        Detection Timestamp
                      </span>
                      <div className="flex items-center gap-1 mt-0.5 text-slate-700">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateTime(incident.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Hit and Run Plate Number display (only when applicable) */}
                  {incident.plate_number && (
                    <div className="mb-2 p-1.5 bg-rose-50 border border-rose-200 rounded text-[11px] flex items-center justify-between">
                      <span className="font-semibold text-rose-800">Plate (OCR):</span>
                      <span className="font-mono font-bold text-rose-900 bg-white px-1.5 py-0.5 rounded border border-rose-300">
                        {incident.plate_number}
                      </span>
                    </div>
                  )}

                  {/* GPS Coordinates */}
                  <div className="text-[10px] text-slate-600 flex justify-between font-mono bg-white px-1 py-0.5 rounded border border-slate-200">
                    <span>Lat: {incident.latitude.toFixed(4)}</span>
                    <span>Lng: {incident.longitude.toFixed(4)}</span>
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
    </div>
  );
};

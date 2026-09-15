import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SidebarFilters } from './components/SidebarFilters';
import { IncidentMap } from './components/IncidentMap';
import { RecentIncidentsPanel } from './components/RecentIncidentsPanel';
import { AnalyticsRow } from './components/AnalyticsRow';
import { Incident, FilterState, EventType, IncidentStatus, Bus } from './types';
import { fetchIncidents, fetchBuses } from './services/api';

const DEFAULT_EVENT_TYPES: EventType[] = [
  'pothole',
  'waterlogging',
  'traffic_congestion',
  'unsafe_pedestrian',
  'hit_and_run',
  'traffic_sign_issue',
];

const DEFAULT_STATUSES: IncidentStatus[] = [
  'Detected',
  'Verified',
  'Assigned',
  'Action Taken',
  'Resolved',
];

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    eventTypes: DEFAULT_EVENT_TYPES,
    dateFrom: '',
    dateTo: '',
    minConfidence: 0.8, // 80% default recommended threshold
    statuses: DEFAULT_STATUSES,
  });

  // Load incidents and buses from API service
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [incidentData, busData] = await Promise.all([
          fetchIncidents(),
          fetchBuses(),
        ]);
        setIncidents(incidentData);
        setBuses(busData);
      } catch (err) {
        console.error('Failed to load telemetry data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleResetFilters = () => {
    setFilters({
      eventTypes: DEFAULT_EVENT_TYPES,
      dateFrom: '',
      dateTo: '',
      minConfidence: 0,
      statuses: DEFAULT_STATUSES,
    });
  };

  // Filter incidents based on active filters
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      // 1. Event type filter
      if (!filters.eventTypes.includes(incident.event_type)) {
        return false;
      }

      // 2. Minimum confidence
      if (incident.confidence < filters.minConfidence) {
        return false;
      }

      // 3. Status filter
      if (!filters.statuses.includes(incident.status)) {
        return false;
      }

      // 4. Date range filter
      if (filters.dateFrom) {
        const incidentDate = incident.timestamp.slice(0, 10);
        if (incidentDate < filters.dateFrom) {
          return false;
        }
      }
      if (filters.dateTo) {
        const incidentDate = incident.timestamp.slice(0, 10);
        if (incidentDate > filters.dateTo) {
          return false;
        }
      }

      return true;
    });
  }, [incidents, filters]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      {/* 1. Top Navbar */}
      <Navbar activeIncidentsCount={filteredIncidents.length} />

      {/* 2. Middle Workspace: Sidebar (Left) + GIS Map (Center) + Recent Incidents (Right) */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 relative">
        {/* Left Sidebar Filters */}
        <SidebarFilters
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          totalCount={incidents.length}
          filteredCount={filteredIncidents.length}
        />

        {/* Main Map Area */}
        <section 
          id="main-gis-section" 
          aria-label="GIS Map View"
          className="flex-1 flex flex-col relative h-full bg-slate-200 overflow-hidden min-h-0"
        >
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center bg-slate-100 text-slate-600">
              <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <div className="w-5 h-5 border-2 border-[#0B1E36] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading urban sensor telemetry...</span>
              </div>
            </div>
          ) : (
            <IncidentMap
              incidents={filteredIncidents}
              selectedIncident={selectedIncident}
              onSelectIncident={setSelectedIncident}
            />
          )}
        </section>

        {/* Right Panel: Recent Incidents List */}
        <RecentIncidentsPanel
          incidents={filteredIncidents}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
        />
      </main>

      {/* 3. Bottom Analytics Row: 4 compact cards using Recharts */}
      <AnalyticsRow incidents={filteredIncidents} buses={buses} />
    </div>
  );
}


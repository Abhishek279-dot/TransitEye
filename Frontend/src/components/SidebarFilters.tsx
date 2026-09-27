import React, { useState } from 'react';
import {
  Filter,
  RotateCcw,
  Calendar,
  Gauge,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { EventType, IncidentStatus, FilterState } from '../types';
import { EVENT_TYPE_CONFIG, COMING_SOON_EVENT_TYPES, STATUS_CONFIG } from '../utils/constants';

interface SidebarFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

// Local, presentation-only collapsible wrapper — no external state involved
const FilterSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ icon, title, summary, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pt-3 border-t border-slate-200 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group"
      >
        <span className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            {title}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          {!open && summary && (
            <span className="text-[11px] text-slate-500 font-medium">{summary}</span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
      {open && <div className="mt-2.5">{children}</div>}
    </div>
  );
};

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const activeEventTypes: EventType[] = [
    'pothole',
    'waterlogging',
    'traffic_congestion',
    'unsafe_pedestrian',
    'hit_and_run',
    'traffic_sign_issue',
  ];

  const allStatuses: IncidentStatus[] = [
    'Detected',
    'Verified',
    'Assigned',
    'Action Taken',
    'Resolved',
  ];

  const toggleEventType = (type: EventType) => {
    const current = filters.eventTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFilterChange({ ...filters, eventTypes: next });
  };

  const toggleStatus = (status: IncidentStatus) => {
    const current = filters.statuses;
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFilterChange({ ...filters, statuses: next });
  };

  const handleConfidenceChange = (val: number) => {
    onFilterChange({ ...filters, minConfidence: val });
  };

  const handleDateChange = (key: 'dateFrom' | 'dateTo', value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const dateRangeSummary =
    filters.dateFrom || filters.dateTo
      ? `${filters.dateFrom || 'Any'} → ${filters.dateTo || 'Any'}`
      : 'All dates';

  return (
    <aside
      id="sidebar-filters-panel"
      className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto shrink-0 shadow-sm"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Incident Filters
          </h2>
        </div>
        <button
          id="clear-filters-btn"
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded px-2 py-1 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          <RotateCcw className="w-3 h-3 text-slate-500" />
          Clear Filters
        </button>
      </div>

      {/* Filter summary status pill */}
      <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 text-xs flex items-center justify-between text-slate-600">
        <span>Active Incidents:</span>
        <span className="font-semibold text-slate-800">
          {filteredCount} of {totalCount} shown
        </span>
      </div>

      <div className="p-4 space-y-0 flex-1">
        {/* 1. EVENT TYPES */}
        <FilterSection
          icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          title="Event Types"
          summary={`${filters.eventTypes.length} selected`}
          defaultOpen
        >
          <div className="space-y-1">
            {activeEventTypes.map((typeKey) => {
              const config = EVENT_TYPE_CONFIG[typeKey];
              const isChecked = filters.eventTypes.includes(typeKey);
              return (
                <label
                  key={typeKey}
                  id={`filter-event-${typeKey}`}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                    isChecked ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleEventType(typeKey)}
                    className="rounded border-slate-300 text-[#0B1E36] focus:ring-slate-400 h-3.5 w-3.5"
                  />
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="font-medium">{config.label}</span>
                </label>
              );
            })}
          </div>

          {/* Coming soon — compact chip row, not full boxes */}
          <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Coming soon
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMING_SOON_EVENT_TYPES.map((item) => (
                <span
                  key={item.label}
                  title={item.reason}
                  className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full cursor-not-allowed select-none"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* 2. DATE RANGE PICKER */}
        <FilterSection
          icon={<Calendar className="w-3.5 h-3.5 text-slate-600" />}
          title="Date Range"
          summary={dateRangeSummary}
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="filter-date-from" className="block text-[11px] text-slate-500 font-medium mb-1">
                From
              </label>
              <input
                id="filter-date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
              />
            </div>
            <div>
              <label htmlFor="filter-date-to" className="block text-[11px] text-slate-500 font-medium mb-1">
                To
              </label>
              <input
                id="filter-date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleDateChange('dateTo', e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B1E36]"
              />
            </div>
          </div>
        </FilterSection>

        {/* 3. MINIMUM CONFIDENCE SLIDER */}
        <FilterSection
          icon={<Gauge className="w-3.5 h-3.5 text-slate-600" />}
          title="Min. AI Confidence"
          summary={`${Math.round(filters.minConfidence * 100)}%`}
        >
          <input
            id="confidence-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={filters.minConfidence}
            onChange={(e) => handleConfidenceChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B1E36]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </FilterSection>

        {/* 4. INCIDENT STATUS CHECKBOXES */}
        <FilterSection
          icon={<span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
          title="Incident Status"
          summary={`${filters.statuses.length} selected`}
        >
          <div className="space-y-1">
            {allStatuses.map((status) => {
              const statusCfg = STATUS_CONFIG[status];
              const isChecked = filters.statuses.includes(status);
              return (
                <label
                  key={status}
                  id={`filter-status-${status.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                    isChecked ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleStatus(status)}
                    className="rounded border-slate-300 text-[#0B1E36] focus:ring-slate-400 h-3.5 w-3.5"
                  />
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: statusCfg.text }}
                  />
                  <span className="font-medium">{status}</span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Telemetric event data received from onboard YOLOv8 inference.</span>
      </div>
    </aside>
  );
};
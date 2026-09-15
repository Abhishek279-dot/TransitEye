import React from 'react';
import { Filter, RotateCcw, Calendar, Gauge, Info, AlertCircle } from 'lucide-react';
import { EventType, IncidentStatus, FilterState } from '../types';
import { EVENT_TYPE_CONFIG, COMING_SOON_EVENT_TYPES, STATUS_CONFIG } from '../utils/constants';

interface SidebarFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

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

      <div className="p-4 space-y-6 flex-1">
        {/* 1. EVENT TYPES */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Event Types
            </span>
            <span className="text-[11px] text-slate-500">
              {filters.eventTypes.length} selected
            </span>
          </div>

          {/* ACTIVE GROUP */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active Detections
            </div>
            <div className="space-y-1.5">
              {activeEventTypes.map((typeKey) => {
                const config = EVENT_TYPE_CONFIG[typeKey];
                const isChecked = filters.eventTypes.includes(typeKey);
                return (
                  <label
                    key={typeKey}
                    id={`filter-event-${typeKey}`}
                    className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-slate-50 border-slate-300 text-slate-900'
                        : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleEventType(typeKey)}
                        className="rounded border-slate-300 text-[#0B1E36] focus:ring-slate-400 h-4 w-4"
                      />
                      <span className="flex items-center gap-2 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: config.color }}
                        />
                        {config.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* COMING SOON GROUP */}
          <div className="pt-2 border-t border-dashed border-slate-200">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Future Capabilities (Coming Soon)
            </div>
            <div className="space-y-1.5">
              {COMING_SOON_EVENT_TYPES.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2 rounded-md bg-slate-50/80 border border-slate-200/80 text-xs opacity-60 cursor-not-allowed select-none"
                  title={`${item.label}: ${item.reason}`}
                >
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      disabled
                      checked={false}
                      className="rounded border-slate-300 bg-slate-200 text-slate-400 h-4 w-4 cursor-not-allowed"
                    />
                    <span className="font-normal text-slate-500 line-through decoration-slate-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. DATE RANGE PICKER */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Date Range
            </span>
          </div>
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
        </div>

        {/* 3. MINIMUM CONFIDENCE SLIDER */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Min. AI Confidence
              </span>
            </div>
            <span 
              id="confidence-display-badge"
              className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#0B1E36] border border-slate-200"
            >
              {Math.round(filters.minConfidence * 100)}%
            </span>
          </div>
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
            <span>80% (Recommended)</span>
            <span>100%</span>
          </div>
        </div>

        {/* 4. INCIDENT STATUS CHECKBOXES */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Incident Status
            </span>
            <span className="text-[11px] text-slate-500">
              {filters.statuses.length} selected
            </span>
          </div>
          <div className="space-y-1.5">
            {allStatuses.map((status) => {
              const statusCfg = STATUS_CONFIG[status];
              const isChecked = filters.statuses.includes(status);
              return (
                <label
                  key={status}
                  id={`filter-status-${status.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-slate-50 border-slate-300 text-slate-900'
                      : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStatus(status)}
                      className="rounded border-slate-300 text-[#0B1E36] focus:ring-slate-400 h-4 w-4"
                    />
                    <span className="font-medium text-slate-800">{status}</span>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: statusCfg.bg,
                      color: statusCfg.text,
                    }}
                  >
                    {status}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Telemetric event data received from onboard YOLOv8 inference.</span>
      </div>
    </aside>
  );
};

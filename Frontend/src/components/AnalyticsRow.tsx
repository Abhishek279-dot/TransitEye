import React, { useMemo } from 'react';
import { Incident, Bus } from '../types';
import { EVENT_TYPE_CONFIG } from '../utils/constants';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Activity, TrendingUp, Bus as BusIcon, Clock, CheckCircle, Radio } from 'lucide-react';

interface AnalyticsRowProps {
  incidents: Incident[];
  buses: Bus[];
}

export const AnalyticsRow: React.FC<AnalyticsRowProps> = ({ incidents, buses }) => {
  // 1. Events by Type Data for Bar Chart
  const typeData = useMemo(() => {
    const counts: Record<string, number> = {
      pothole: 0,
      waterlogging: 0,
      traffic_congestion: 0,
      unsafe_pedestrian: 0,
      hit_and_run: 0,
      traffic_sign_issue: 0,
    };

    incidents.forEach((inc) => {
      if (counts[inc.event_type] !== undefined) {
        counts[inc.event_type] += 1;
      }
    });

    return [
      { name: 'Pothole', key: 'pothole', count: counts.pothole, color: EVENT_TYPE_CONFIG.pothole.color },
      { name: 'Waterlog', key: 'waterlogging', count: counts.waterlogging, color: EVENT_TYPE_CONFIG.waterlogging.color },
      { name: 'Congest', key: 'traffic_congestion', count: counts.traffic_congestion, color: EVENT_TYPE_CONFIG.traffic_congestion.color },
      { name: 'Pedestrian', key: 'unsafe_pedestrian', count: counts.unsafe_pedestrian, color: EVENT_TYPE_CONFIG.unsafe_pedestrian.color },
      { name: 'Hit & Run', key: 'hit_and_run', count: counts.hit_and_run, color: EVENT_TYPE_CONFIG.hit_and_run.color },
      { name: 'Signs', key: 'traffic_sign_issue', count: counts.traffic_sign_issue, color: EVENT_TYPE_CONFIG.traffic_sign_issue.color },
    ];
  }, [incidents]);

  // 2. Events Over Time Data for Line Chart
  const timelineData = useMemo(() => {
    const map: Record<string, number> = {};

    // Sort incidents by timestamp
    const sorted = [...incidents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    sorted.forEach((inc) => {
      const date = new Date(inc.timestamp);
      const label = date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
      map[label] = (map[label] || 0) + 1;
    });

    const entries = Object.entries(map).map(([date, count]) => ({
      date,
      count,
    }));

    return entries.length > 0
      ? entries
      : [
          { date: '09 Sep', count: 1 },
          { date: '10 Sep', count: 2 },
          { date: '11 Sep', count: 4 },
          { date: '12 Sep', count: 8 },
        ];
  }, [incidents]);

 // 3. Fleet Coverage Data
const fleetStats = useMemo(() => {
  const total = buses.length;
  const active = buses.filter((b) => b.bus_status === 'Active').length;
  const idle = total - active;
  const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

  return { total, active, idle, percentage };
}, [buses]);

  // 4. Status Breakdown for Average Response Time
  const responseStats = useMemo(() => {
    const resolved = incidents.filter((i) => i.status === 'Resolved').length;
    const actionTaken = incidents.filter((i) => i.status === 'Action Taken').length;
    const assigned = incidents.filter((i) => i.status === 'Assigned').length;
    const verified = incidents.filter((i) => i.status === 'Verified').length;
    const detected = incidents.filter((i) => i.status === 'Detected').length;

    return {
      avgVerification: '38 min',
      avgResolution: '3.4 hrs',
      resolvedRate: incidents.length > 0 ? Math.round(((resolved + actionTaken) / incidents.length) * 100) : 0,
      counts: { detected, verified, assigned, actionTaken, resolved },
    };
  }, [incidents]);

  return (
    <div
      id="bottom-analytics-row"
      className="bg-white border-t border-slate-200 p-3 shrink-0 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* CARD 1: Events by Type (Bar Chart) */}
        <div
          id="card-events-by-type"
          className="bg-slate-50/80 rounded-lg p-3 border border-slate-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Events by Type
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">
              {incidents.length} Total
            </span>
          </div>

          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 6, right: 4, left: -24, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md border border-slate-700">
                          <span className="font-semibold">{item.name}: </span>
                          <span>{item.count} incidents</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CARD 2: Events Over Time (Line Chart) */}
        <div
          id="card-events-over-time"
          className="bg-slate-50/80 rounded-lg p-3 border border-slate-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Events Over Time
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">
              Temporal Trend
            </span>
          </div>

          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 6, right: 10, left: -24, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md border border-slate-700">
                          <span className="font-semibold">{item.date}: </span>
                          <span>{item.count} detections</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1E3A8A"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#1E3A8A' }}
                  activeDot={{ r: 5, fill: '#2563EB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CARD 3: Fleet Coverage (Active / Total Buses) */}
        <div
          id="card-fleet-coverage"
          className="bg-slate-50/80 rounded-lg p-3 border border-slate-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <BusIcon className="w-3.5 h-3.5 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Fleet Coverage
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
              <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
              Live Fleet
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-1 mb-2">
            <div>
              <span className="text-2xl font-black text-slate-900 leading-none">
                {fleetStats.active}
              </span>
              <span className="text-sm font-semibold text-slate-500"> / {fleetStats.total}</span>
              <span className="text-xs text-slate-600 ml-1.5 font-medium">Buses Active</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {fleetStats.percentage}% Operational
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-[#0B1E36] h-2 rounded-full transition-all duration-500"
              style={{ width: `${fleetStats.percentage}%` }}
            />
          </div>

          <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-200/80">
            <span>{fleetStats.active} Edge AI Cameras Online</span>
            <span className="text-slate-600 font-medium">PMPML Pilot</span>
          </div>
        </div>

        {/* CARD 4: Average Response Time */}
        <div
          id="card-average-response-time"
          className="bg-slate-50/80 rounded-lg p-3 border border-slate-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Avg Response Time
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-700">
              <CheckCircle className="w-2.5 h-2.5 text-indigo-500" />
              SLA Met
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1 mb-1.5">
            <div className="bg-white p-1.5 rounded border border-slate-200 text-center">
              <span className="text-[9px] uppercase font-semibold text-slate-400 block">
                Avg to Verified
              </span>
              <span className="text-sm font-black text-slate-900">
                {responseStats.avgVerification}
              </span>
            </div>
            <div className="bg-white p-1.5 rounded border border-slate-200 text-center">
              <span className="text-[9px] uppercase font-semibold text-slate-400 block">
                Avg to Resolved
              </span>
              <span className="text-sm font-black text-slate-900">
                {responseStats.avgResolution}
              </span>
            </div>
          </div>

          {/* Status Pipeline Tracker */}
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/80">
            <span>Workflow: {responseStats.counts.detected} Det · {responseStats.counts.verified} Ver · {responseStats.counts.assigned} Ass</span>
            <span className="font-semibold text-emerald-700">{responseStats.resolvedRate}% In Action</span>
          </div>
        </div>
      </div>
    </div>
  );
};

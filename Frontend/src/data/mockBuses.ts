import { Bus } from '../types';

export const mockBuses: Bus[] = [
  {
    bus_id: "PMPML-102",
    route_no: "Route 11: Swargate ⇄ Shivajinagar",
    driver_id: "DRV-4402",
    status: "Active",
    last_ping: "2026-09-12T09:42:10",
    current_location: { lat: 18.5314, lng: 73.8446 }
  },
  {
    bus_id: "PMPML-108",
    route_no: "Route 24: Katraj ⇄ Pune Station",
    driver_id: "DRV-1920",
    status: "Active",
    last_ping: "2026-09-12T09:40:55",
    current_location: { lat: 18.5018, lng: 73.8636 }
  },
  {
    bus_id: "PMPML-142",
    route_no: "Route 8: Kothrud Stand ⇄ Swargate",
    driver_id: "DRV-3811",
    status: "Idle",
    last_ping: "2026-09-12T09:30:00",
    current_location: { lat: 18.5089, lng: 73.8077 }
  },
  {
    bus_id: "PMPML-177",
    route_no: "Route 42: Manapa ⇄ Kalyani Nagar",
    driver_id: "DRV-2291",
    status: "Active",
    last_ping: "2026-09-12T09:41:22",
    current_location: { lat: 18.5445, lng: 73.8821 }
  },
  {
    bus_id: "PMPML-189",
    route_no: "Route 149: Pune Station ⇄ Airport",
    driver_id: "DRV-5012",
    status: "Active",
    last_ping: "2026-09-12T09:39:18",
    current_location: { lat: 18.5679, lng: 73.9143 }
  },
  {
    bus_id: "PMPML-214",
    route_no: "Route 100: Hinjewadi ⇄ Pune Station",
    driver_id: "DRV-8193",
    status: "Active",
    last_ping: "2026-09-12T09:43:00",
    current_location: { lat: 18.5284, lng: 73.8743 }
  },
  {
    bus_id: "PMPML-305",
    route_no: "Route 208: Nigdi ⇄ Hinjewadi Phase 3",
    driver_id: "DRV-7714",
    status: "Active",
    last_ping: "2026-09-12T09:42:45",
    current_location: { lat: 18.5590, lng: 73.7868 }
  }
];

import { Incident, Bus } from '../types';
import { mockIncidents } from '../data/mockIncidents';
import { mockBuses } from '../data/mockBuses';

/**
 * Service layer for Bharat RakshaMarg.
 * Designed so swapping mock data for real FastAPI + MySQL backend
 * is a single boolean flag change.
 */
const USE_MOCK_DATA = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchIncidents(): Promise<Incident[]> {
  if (USE_MOCK_DATA) {
    return Promise.resolve([...mockIncidents]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) {
      throw new Error(`Failed to fetch incidents: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.warn('Falling back to mock incidents, backend unreachable:', error);
    return [...mockIncidents];
  }
}

export async function fetchBuses(): Promise<Bus[]> {
  if (USE_MOCK_DATA) {
    return Promise.resolve([...mockBuses]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/buses/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch buses: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.warn('Falling back to mock buses, backend unreachable:', error);
    return [...mockBuses];
  }
}
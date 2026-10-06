import { ApiClient } from './apiClient';

export interface BookedDateRange {
  start: Date;
  end: Date;
}

interface StoredReservation {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  status?: string;
}

const LOCAL_STORAGE_RESERVATIONS_KEY = 'airbnb_local_reservations';

export const getLocalReservations = (): StoredReservation[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RESERVATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore storage errors */
  }
  return [];
};

export const saveLocalReservation = (reservation: StoredReservation): void => {
  try {
    const existing = getLocalReservations();
    const updated = [reservation, ...existing];
    localStorage.setItem(LOCAL_STORAGE_RESERVATIONS_KEY, JSON.stringify(updated));
  } catch {
    /* ignore storage errors */
  }
};

/**
 * Get all confirmed booked date ranges for a specific property.
 * Merges server API response with local storage reservations for offline/instant persistence.
 */
export const fetchBookedDateRanges = async (propertyId: string): Promise<BookedDateRange[]> => {
  const ranges: BookedDateRange[] = [];

  // Default seed ranges for demo (Oct 15-18, 2026 and Oct 22-25, 2026 for villa-glasshouse-kasauli-01)
  if (propertyId === 'villa-glasshouse-kasauli-01') {
    ranges.push({
      start: new Date(2026, 9, 15),
      end: new Date(2026, 9, 18)
    });
    ranges.push({
      start: new Date(2026, 9, 22),
      end: new Date(2026, 9, 25)
    });
  }

  // 1. Fetch from server API
  try {
    const res = await ApiClient.getPropertyReservations(propertyId);
    if (res && res.success && Array.isArray(res.data)) {
      res.data.forEach((r: { checkIn: string; checkOut: string }) => {
        const start = new Date(r.checkIn);
        const end = new Date(r.checkOut);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          ranges.push({ start, end });
        }
      });
    }
  } catch {
    /* fallback to local storage */
  }

  // 2. Fetch from local storage
  const localRes = getLocalReservations();
  localRes.forEach(r => {
    if (r.propertyId === propertyId && r.status !== 'CANCELLED') {
      const start = new Date(r.checkIn);
      const end = new Date(r.checkOut);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        ranges.push({ start, end });
      }
    }
  });

  return ranges;
};

export const cancelLocalReservation = (propertyIdOrId: string): void => {
  try {
    const existing = getLocalReservations();
    const updated = existing.map(r => r.propertyId === propertyIdOrId ? { ...r, status: 'CANCELLED' } : r);
    localStorage.setItem(LOCAL_STORAGE_RESERVATIONS_KEY, JSON.stringify(updated));
  } catch {
    /* ignore storage errors */
  }
};

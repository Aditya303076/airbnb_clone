/**
 * Date persistence service to ensure selected check-in and check-out dates
 * remain identical across page reloads and hard refreshes.
 */

const STORAGE_KEY_CHECKIN = 'airbnb_check_in_date';
const STORAGE_KEY_CHECKOUT = 'airbnb_check_out_date';

// Default fallback dates: Oct 11, 2026 to Oct 12, 2026
const DEFAULT_CHECKIN = new Date(2026, 9, 11);
const DEFAULT_CHECKOUT = new Date(2026, 9, 12);

export interface PersistedDateRange {
  checkInDate: Date;
  checkOutDate: Date;
}

export const getPersistedDates = (): PersistedDateRange => {
  try {
    const storedCheckIn = localStorage.getItem(STORAGE_KEY_CHECKIN);
    const storedCheckOut = localStorage.getItem(STORAGE_KEY_CHECKOUT);

    if (storedCheckIn && storedCheckOut) {
      const checkIn = new Date(storedCheckIn);
      const checkOut = new Date(storedCheckOut);

      if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime()) && checkIn < checkOut) {
        return { checkInDate: checkIn, checkOutDate: checkOut };
      }
    }
  } catch {
    /* ignore localStorage errors */
  }

  return { checkInDate: DEFAULT_CHECKIN, checkOutDate: DEFAULT_CHECKOUT };
};

export const persistDates = (checkIn: Date, checkOut: Date): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CHECKIN, checkIn.toISOString());
    localStorage.setItem(STORAGE_KEY_CHECKOUT, checkOut.toISOString());
  } catch {
    /* ignore localStorage errors */
  }
};

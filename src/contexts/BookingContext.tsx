"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export interface BookingState {
  pickupLocation: string;
  pickupLocationName: string;
  dropoffLocation: string;
  dropoffLocationName: string;
  sameAsPickup: boolean;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
}

const getDefaultState = (): BookingState => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    pickupLocation: "",
    pickupLocationName: "",
    dropoffLocation: "",
    dropoffLocationName: "",
    sameAsPickup: true,
    pickupDate: toDatetimeLocal(today).slice(0, 10),
    pickupTime: "10:00",
    dropoffDate: toDatetimeLocal(tomorrow).slice(0, 10),
    dropoffTime: "10:00",
  };
};

interface BookingContextValue extends BookingState {
  setPickupLocation: (code: string, name?: string) => void;
  setDropoffLocation: (code: string, name?: string) => void;
  setSameAsPickup: (v: boolean) => void;
  setPickupDateTime: (date: string, time: string) => void;
  setDropoffDateTime: (date: string, time: string) => void;
  updateState: (partial: Partial<BookingState>) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(getDefaultState);

  const setPickupLocation = useCallback((code: string, name = "") => {
    setState((s) => ({
      ...s,
      pickupLocation: code,
      pickupLocationName: name,
      ...(s.sameAsPickup ? { dropoffLocation: code, dropoffLocationName: name } : {}),
    }));
  }, []);

  const setDropoffLocation = useCallback((code: string, name = "") => {
    setState((s) => ({ ...s, dropoffLocation: code, dropoffLocationName: name }));
  }, []);

  const setSameAsPickup = useCallback((v: boolean) => {
    setState((s) => {
      if (v) {
        return {
          ...s,
          sameAsPickup: true,
          dropoffLocation: s.pickupLocation,
          dropoffLocationName: s.pickupLocationName,
        };
      }
      return { ...s, sameAsPickup: false };
    });
  }, []);

  const setPickupDateTime = useCallback((date: string, time: string) => {
    setState((s) => ({ ...s, pickupDate: date, pickupTime: time }));
  }, []);

  const setDropoffDateTime = useCallback((date: string, time: string) => {
    setState((s) => ({ ...s, dropoffDate: date, dropoffTime: time }));
  }, []);

  const updateState = useCallback((partial: Partial<BookingState>) => {
    setState((s) => ({ ...s, ...partial }));
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({
      ...state,
      setPickupLocation,
      setDropoffLocation,
      setSameAsPickup,
      setPickupDateTime,
      setDropoffDateTime,
      updateState,
    }),
    [state, setPickupLocation, setDropoffLocation, setSameAsPickup, setPickupDateTime, setDropoffDateTime, updateState]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

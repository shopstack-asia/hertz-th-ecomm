import type {
  Location,
  SearchResultVehicleGroup,
  VehicleDetail,
  Reservation,
  PricingBreakdown,
  AccountProfile,
} from "@/types";
import {
  mockLocations,
  mockVehicleGroups,
  mockReservations,
  getSearchResults,
  createMockPricingBreakdown,
  generateReservationNo,
} from "./data";
import { getVehicleDetailByGroupCode } from "./searchVehicles";

export const mockHandlers = {
  locations: {
    list: async (q?: string): Promise<Location[]> => {
      if (q) {
        const lower = q.toLowerCase();
        return mockLocations.filter(
          (l) =>
            l.name.toLowerCase().includes(lower) ||
            l.code.toLowerCase().includes(lower) ||
            (l.city?.toLowerCase().includes(lower) ?? false)
        );
      }
      return mockLocations;
    },
  },

  search: async (
    pickup: string,
    dropoff: string,
    pickupAt: string,
    dropoffAt: string
  ): Promise<SearchResultVehicleGroup[]> => {
    return getSearchResults(pickup, dropoff, pickupAt, dropoffAt);
  },

  vehicle: {
    getByGroupCode: async (groupCode: string): Promise<VehicleDetail | null> => {
      return mockVehicleGroups[groupCode] ?? getVehicleDetailByGroupCode(groupCode) ?? null;
    },
  },

  pricing: {
    validate: async (params: {
      vehicleGroupCode: string;
      pickupAt: string;
      dropoffAt: string;
      voucherCode?: string;
      bookingType?: "PAY_LATER" | "PAY_NOW";
    }): Promise<{ valid: boolean; breakdown?: PricingBreakdown }> => {
      const days = Math.max(
        1,
        Math.ceil(
          (new Date(params.dropoffAt).getTime() -
            new Date(params.pickupAt).getTime()) /
            (24 * 60 * 60 * 1000)
        )
      );
      const breakdown = createMockPricingBreakdown(
        params.vehicleGroupCode,
        days,
        params.voucherCode,
        params.bookingType
      );
      return { valid: true, breakdown };
    },
  },

  reservation: {
    create: async (params: {
      vehicleGroupCode: string;
      pickupLocation: string;
      pickupAt: string;
      dropoffLocation: string;
      dropoffAt: string;
      bookingType: "PAY_LATER" | "PAY_NOW";
      renterName: string;
      driverName?: string;
      contactEmail: string;
      contactPhone: string;
      voucherCode?: string;
    }): Promise<{ reservationNo: string; status: string }> => {
      const days = Math.max(
        1,
        Math.ceil(
          (new Date(params.dropoffAt).getTime() -
            new Date(params.pickupAt).getTime()) /
            (24 * 60 * 60 * 1000)
        )
      );
      const vehicle =
        mockVehicleGroups[params.vehicleGroupCode] ??
        getVehicleDetailByGroupCode(params.vehicleGroupCode);
      const pricing = createMockPricingBreakdown(
        params.vehicleGroupCode,
        days,
        params.voucherCode,
        params.bookingType
      );

      const reservationNo = generateReservationNo();
      const status =
        params.bookingType === "PAY_LATER"
          ? "PAY_AT_COUNTER"
          : "PENDING_PAYMENT";

      const reservation: Reservation = {
        reservationNo,
        status: status as Reservation["status"],
        bookingType: params.bookingType,
        paymentStatus: params.bookingType === "PAY_NOW" ? "PENDING" : undefined,
        pickupLocation: params.pickupLocation,
        pickupAt: params.pickupAt,
        dropoffLocation: params.dropoffLocation,
        dropoffAt: params.dropoffAt,
        vehicleGroupCode: params.vehicleGroupCode,
        vehicleName: vehicle?.name ?? params.vehicleGroupCode,
        renterName: params.renterName,
        driverName: params.driverName,
        contactEmail: params.contactEmail,
        contactPhone: params.contactPhone,
        pricing,
      };

      mockReservations[reservationNo] = reservation;
      return { reservationNo, status };
    },
  },

  payment: {
    initiate: async (reservationNo: string): Promise<{ paymentRedirectUrl: string }> => {
      return {
        paymentRedirectUrl: `/payment/status?reservationNo=${reservationNo}&status=success`,
      };
    },
    callback: async (params: {
      reservationNo: string;
      status: "success" | "fail" | "cancel";
    }): Promise<{ success: boolean }> => {
      const r = mockReservations[params.reservationNo];
      if (r && params.status === "success") {
        r.status = "CONFIRMED";
        r.paymentStatus = "PAID";
      }
      return { success: params.status === "success" };
    },
  },

  booking: {
    getByReservationNo: async (reservationNo: string): Promise<Reservation | null> => {
      return mockReservations[reservationNo] ?? null;
    },
  },

  account: {
    profile: {
      get: async (): Promise<AccountProfile> => {
        return {
          id: "mock-user-1",
          email: "guest@example.com",
          firstName: "John",
          lastName: "Doe",
          phone: "+66812345678",
        };
      },
      update: async (_data: Partial<AccountProfile>): Promise<AccountProfile> => {
        return mockHandlers.account.profile.get();
      },
    },
    bookings: {
      upcoming: async (): Promise<Reservation[]> => {
        return Object.values(mockReservations).filter(
          (r) =>
            r.status !== "CANCELLED" &&
            new Date(r.pickupAt) >= new Date()
        );
      },
      past: async (): Promise<Reservation[]> => {
        return Object.values(mockReservations).filter(
          (r) =>
            r.status !== "CANCELLED" &&
            new Date(r.dropoffAt) < new Date()
        );
      },
    },
  },
};

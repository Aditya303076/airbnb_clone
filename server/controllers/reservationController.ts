import { Request, Response } from 'express';
import { dbEngine } from '../db/database';
import { kafkaEngine } from '../messaging/kafkaService';
import { APIResponse, IReservation } from '../types/backend';
import { AuthenticatedRequest } from '../middleware/auth';

export class ReservationController {
  public async createReservation(req: AuthenticatedRequest, res: Response): Promise<void> {
    const startTime = performance.now();
    const { propertyId, checkIn, checkOut, guests, totalPrice, userId } = req.body;

    if (!propertyId || !checkIn || !checkOut || !totalPrice) {
      res.status(400).json({
        success: false,
        data: null,
        error: 'Missing required reservation fields (propertyId, checkIn, checkOut, totalPrice)'
      });
      return;
    }

    try {
      // 1. Verify property exists
      const property = await dbEngine.getPropertyById(propertyId);
      if (!property) {
        res.status(404).json({
          success: false,
          data: null,
          error: `Property '${propertyId}' not found`
        });
        return;
      }

      // 2. Validate booking rules: check-in date before check-out, min 1 night, guest capacity
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
        res.status(400).json({
          success: false,
          data: null,
          error: 'Invalid dates: Check-in date must be strictly before check-out date'
        });
        return;
      }

      const totalGuestCount = (guests?.adults || 1) + (guests?.children || 0);
      if (totalGuestCount > property.guestCapacity.guests) {
        res.status(400).json({
          success: false,
          data: null,
          error: `Guest limit exceeded: This property accommodates a maximum of ${property.guestCapacity.guests} guests.`
        });
        return;
      }

      // 3. Validate overlapping date availability
      const isAvailable = await dbEngine.checkAvailability(propertyId, checkIn, checkOut);
      if (!isAvailable) {
        res.status(409).json({
          success: false,
          data: null,
          error: 'Selected dates overlap with an existing confirmed reservation. Please select different dates.'
        });
        return;
      }

      // 4. Persist Reservation Transaction
      const reservation = await dbEngine.createReservation({
        propertyId,
        userId: userId || req.user?.id || 'usr-guest-001',
        checkIn,
        checkOut,
        guests: guests || { adults: 1, children: 0, infants: 0, pets: 0 },
        totalPrice,
        status: 'CONFIRMED'
      });

      // 5. Emit Kafka Events (Non-blocking async queue)
      kafkaEngine.produce('reservation-events', {
        reservationId: reservation.id,
        propertyId,
        totalPrice,
        guestCount: guests?.adults || 1
      });

      kafkaEngine.produce('cache-invalidation-events', {
        pattern: `property:${propertyId}`
      });

      const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
      const response: APIResponse<IReservation> = {
        success: true,
        data: reservation,
        meta: {
          total: 1,
          page: 1,
          limit: 1,
          executionTimeMs,
          cacheHit: false,
          cacheLayer: 'DATABASE'
        }
      };

      res.status(201).json(response);
    } catch (err) {
      console.error('[CREATE RESERVATION ERROR]', err);
      res.status(500).json({
        success: false,
        data: null,
        error: 'Failed to create reservation'
      });
    }
  }

  public async getUserReservations(req: Request, res: Response): Promise<void> {
    const userId = (req.query.userId as string) || 'usr-guest-001';
    const reservations = await dbEngine.getReservationsByUserId(userId);

    res.json({
      success: true,
      data: reservations
    });
  }

  public async cancelReservation(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updated = await dbEngine.cancelReservation(id);

    if (!updated) {
      res.status(404).json({ success: false, data: null, error: 'Reservation not found' });
      return;
    }

    res.json({
      success: true,
      data: updated
    });
  }

  public async checkAvailability(req: Request, res: Response): Promise<void> {
    const { propertyId, checkIn, checkOut } = req.query;
    if (!propertyId || !checkIn || !checkOut) {
      res.status(400).json({ success: false, available: false, error: 'Missing parameters' });
      return;
    }

    const available = await dbEngine.checkAvailability(
      propertyId as string,
      checkIn as string,
      checkOut as string
    );

    res.json({ success: true, available });
  }

  public async getPropertyReservations(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const reservations = await dbEngine.getReservationsByPropertyId(id);

    res.json({
      success: true,
      data: reservations
    });
  }
}

export const reservationController = new ReservationController();

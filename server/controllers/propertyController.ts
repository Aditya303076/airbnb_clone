import { Request, Response } from 'express';
import { dbEngine } from '../db/database';
import { redisCache } from '../cache/redisService';
import { kafkaEngine } from '../messaging/kafkaService';
import { APIResponse, IProperty, ISearchFilters } from '../types/backend';

export class PropertyController {
  /**
   * High-Throughput Properties Query Handler with Multi-Tier Caching
   */
  public async getProperties(req: Request, res: Response): Promise<void> {
    const startTime = performance.now();
    const filters: ISearchFilters = {
      destination: req.query.destination as string,
      category: req.query.category as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      guests: req.query.guests ? Number(req.query.guests) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const cacheKey = `properties:${JSON.stringify(filters)}`;

    try {
      // 1. Check Redis Cache
      const { data: cachedResult, layer } = await redisCache.get<{ items: IProperty[]; total: number }>(cacheKey);

      if (cachedResult) {
        const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
        const response: APIResponse<IProperty[]> = {
          success: true,
          data: cachedResult.items,
          meta: {
            total: cachedResult.total,
            page: filters.page!,
            limit: filters.limit!,
            executionTimeMs,
            cacheHit: true,
            cacheLayer: layer!
          }
        };
        res.json(response);
        return;
      }

      // 2. Query DB Engine (O(1) Hash Map lookup)
      const dbResult = await dbEngine.getProperties(filters);

      // 3. Populate Redis Cache (TTL 60 seconds)
      await redisCache.set(cacheKey, dbResult, 60);

      // 4. Emit Analytics Event to Kafka asynchronously
      kafkaEngine.produce('analytics-events', {
        action: 'SEARCH_QUERY',
        filters,
        resultCount: dbResult.total
      });

      const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
      const response: APIResponse<IProperty[]> = {
        success: true,
        data: dbResult.items,
        meta: {
          total: dbResult.total,
          page: filters.page!,
          limit: filters.limit!,
          executionTimeMs,
          cacheHit: false,
          cacheLayer: 'DATABASE'
        }
      };

      res.json(response);
    } catch (err) {
      console.error('[PROPERTY CONTROLLER ERROR]', err);
      res.status(500).json({
        success: false,
        data: [],
        error: 'Failed to retrieve properties'
      });
    }
  }

  /**
   * Fetch Destination Suggestions from DB
   */
  public async getDestinations(req: Request, res: Response): Promise<void> {
    const destinations = await dbEngine.getDestinations();
    res.json({
      success: true,
      data: destinations
    });
  }

  /**
   * Fetch Single Property Details by ID
   */
  public async getPropertyById(req: Request, res: Response): Promise<void> {
    const startTime = performance.now();
    const { id } = req.params;
    const cacheKey = `property:${id}`;

    try {
      const { data: cachedProp, layer } = await redisCache.get<IProperty>(cacheKey);

      if (cachedProp) {
        const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
        res.json({
          success: true,
          data: cachedProp,
          meta: {
            total: 1,
            page: 1,
            limit: 1,
            executionTimeMs,
            cacheHit: true,
            cacheLayer: layer!
          }
        });
        return;
      }

      const property = await dbEngine.getPropertyById(id);

      if (!property) {
        res.status(404).json({
          success: false,
          data: null,
          error: `Property with ID '${id}' not found`
        });
        return;
      }

      await redisCache.set(cacheKey, property, 120);

      // Produce view event to Kafka
      kafkaEngine.produce('property-views', { propertyId: id });

      const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
      res.json({
        success: true,
        data: property,
        meta: {
          total: 1,
          page: 1,
          limit: 1,
          executionTimeMs,
          cacheHit: false,
          cacheLayer: 'DATABASE'
        }
      });
    } catch (err) {
      console.error('[GET PROPERTY BY ID ERROR]', err);
      res.status(500).json({ success: false, data: null, error: 'Server error' });
    }
  }

  /**
   * Fetch Reviews for Property
   */
  public async getReviews(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const reviews = await dbEngine.getReviewsByPropertyId(id);
    res.json({
      success: true,
      data: reviews
    });
  }
}

export const propertyController = new PropertyController();

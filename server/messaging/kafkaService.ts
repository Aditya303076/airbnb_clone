import { IKafkaEvent } from '../types/backend';
import { redisCache } from '../cache/redisService';

/**
 * Enterprise Kafka Event Bus Simulator (NPCI-Grade Asynchronous Messaging Architecture)
 * Decouples write operations and heavy processing from the main HTTP response loop.
 */
export class KafkaEventBus {
  private eventLog: IKafkaEvent[] = [];
  private offsets: Map<string, number> = new Map();
  private subscribers: Map<string, Array<(event: IKafkaEvent) => Promise<void>>> = new Map();

  constructor() {
    this.registerCoreConsumers();
  }

  /**
   * Produce an event onto a Kafka topic (Non-blocking async execution)
   */
  public async produce<T extends Record<string, unknown>>(
    topic: IKafkaEvent['topic'],
    payload: T
  ): Promise<IKafkaEvent<T>> {
    const currentOffset = (this.offsets.get(topic) || 0) + 1;
    this.offsets.set(topic, currentOffset);

    const event: IKafkaEvent<T> = {
      eventId: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      topic,
      partition: Math.floor(Math.random() * 3),
      offset: currentOffset,
      timestamp: Date.now(),
      payload
    };

    this.eventLog.push(event as IKafkaEvent);

    // Asynchronously dispatch to subscribers without blocking caller
    setImmediate(() => {
      this.dispatchToSubscribers(event as IKafkaEvent);
    });

    return event;
  }

  /**
   * Subscribe to a Kafka topic
   */
  public subscribe(
    topic: IKafkaEvent['topic'],
    handler: (event: IKafkaEvent) => Promise<void>
  ): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(handler);
  }

  private async dispatchToSubscribers(event: IKafkaEvent): Promise<void> {
    const handlers = this.subscribers.get(event.topic) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[KAFKA CONSUMER ERROR] Topic ${event.topic}, Event ${event.eventId}:`, err);
      }
    }
  }

  /**
   * Register core background event processing consumers
   */
  private registerCoreConsumers() {
    // 1. Cache Invalidation Consumer
    this.subscribe('cache-invalidation-events', async (event) => {
      const { pattern } = event.payload as { pattern: string };
      if (pattern) {
        await redisCache.del(pattern);
      }
    });

    // 2. Reservation Confirmation Consumer
    this.subscribe('reservation-events', async (event) => {
      const { reservationId, propertyId } = event.payload as { reservationId: string; propertyId: string };
      console.log(`[KAFKA WORKER] Processing reservation confirmation #${reservationId} for Property #${propertyId}`);
      // Invalidate property cache for updated availability
      await redisCache.del(`property:${propertyId}`);
      await redisCache.del('properties:');
    });

    // 3. Analytics Consumer
    this.subscribe('analytics-events', async (event) => {
      console.log(`[KAFKA ANALYTICS] Metrics logged for Topic: ${event.topic}, Offset: ${event.offset}`);
    });
  }

  /**
   * Telemetry stats for Kafka Cluster
   */
  public getClusterStats() {
    return {
      totalEventsProduced: this.eventLog.length,
      topicOffsets: Object.fromEntries(this.offsets.entries()),
      activeSubscribers: Array.from(this.subscribers.keys()).map(t => ({
        topic: t,
        consumerCount: this.subscribers.get(t)!.length
      }))
    };
  }
}

export const kafkaEngine = new KafkaEventBus();

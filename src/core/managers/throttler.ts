import Redis from "ioredis";

type RateRecord = {
  count: number;
  resetTime: number;
};

type RedisConfig = {
  host: string;
  port: number;
  password?: string;
};

export type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
  redisConfig?: RedisConfig;
};

export default class RateLimitManager {
  private store: Map<string, RateRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private redis?: Redis;

  constructor(config: RateLimitConfig = { windowMs: 60_000, maxRequests: 60 }) {
    this.maxRequests = config.maxRequests ?? 60;
    this.windowMs = config.windowMs ?? 60_000;

    if (config.redisConfig) {
      this.redis = new Redis({
        host: config.redisConfig.host || "localhost",
        port: config.redisConfig.port || 6379,
        password: config.redisConfig.password,
        lazyConnect: true,
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
      });
      this.redis.on("connect", () =>
        console.log("Redis connected, ready to rate-limit like a boss! 😎"),
      );
      this.redis.on("error", (err: unknown) =>
        console.error("Redis error, check your config!", err),
      );
    }
  }
  public async getRateRecord(ip: string): Promise<RateRecord | null> {
    if (this.redis) {
      try {
        const record = await this.redis.get(ip);
        return record ? JSON.parse(record) : null;
      } catch (err) {
        console.error("Redis get failed, falling back to Map!", err);
        return this.store.get(ip) ?? null;
      }
    }
    return this.store.get(ip) ?? null; // Fallback to Map
  }
  public async setRateRecord(ip: string, record: RateRecord): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.set(ip, JSON.stringify(record), "PX", this.windowMs); // PX = expire in ms
      } catch (err) {
        console.error("Redis set failed, using Map instead!", err);
        this.store.set(ip, record);
      }
    } else {
      this.store.set(ip, record);
    }
  }
  public async check(ip: string): Promise<boolean> {
    const now = Date.now();
    let record = await this.getRateRecord(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + this.windowMs };
      await this.setRateRecord(ip, record);
      return true;
    }
    if (record.count < this.maxRequests) {
      record.count++;
      await this.setRateRecord(ip, record);
      return true;
    }
    return false;
  }
  public async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      console.log("Redis disconnected, see ya! 👋");
    }
  }
}

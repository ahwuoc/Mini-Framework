import Redis from "ioredis";

type RateRecord = {
  count: number;
  resetTime: number;
};

export type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
  redis?: Redis;
};

export default class RateLimitManager {
  private store: Map<string, RateRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private redis?: Redis;
  constructor(config: RateLimitConfig = { windowMs: 60_000, maxRequests: 60 }) {
    this.maxRequests = config.maxRequests ?? 60;
    this.windowMs = config.windowMs ?? 60_000;
    this.redis = config.redis;
  }
  public async getRateRecord(ip: string): Promise<RateRecord | null> {
    if (this.redis) {
      try {
        const record = await this.redis.get(ip);
        return record ? JSON.parse(record) : null;
      } catch (err) {
        return this.store.get(ip) ?? null;
      }
    }
    return this.store.get(ip) ?? null;
  }
  public async setRateRecord(ip: string, record: RateRecord): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.set(ip, JSON.stringify(record), "PX", this.windowMs); // PX = expire in ms
      } catch (err) {
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
}

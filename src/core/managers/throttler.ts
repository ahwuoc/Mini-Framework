type RateRecord = {
  count: number;
  resetTime: number;
};

type TRateLimitConfig = {
  windowsMS: number;
  maxReq: number;
};

export default class RateLimitManager {
  private store: Map<string, RateRecord> = new Map();
  private max: number;
  private windowsMS: number;

  constructor(config?: TRateLimitConfig) {
    this.max = config?.maxReq ?? 60;
    this.windowsMS = config?.windowsMS ?? 60_000;
  }

  public check(ip: string): boolean {
    const now = Date.now();
    const record = this.store.get(ip);

    if (!record || now > record.resetTime) {
      this.store.set(ip, { count: 1, resetTime: now + this.windowsMS });
      return true;
    }

    if (record.count < this.max) {
      record.count++;
      return true;
    }

    return false;
  }
}

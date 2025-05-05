import type { Context, Handler, Hook, Method } from "../utils/type-definitions";
import RateLimitManager, { type RateLimitConfig } from "./throttler";
import ResponseManager from "./http-response";
import { Router } from "./route-registry";
import MiddlewareManager, { type ErrorHook } from "./pipeline";

export type ExtendedRateLimitConfig = RateLimitConfig & {
  message?: string;
};
type TConfig = { RateConfig?: ExtendedRateLimitConfig };

export default class CoreApp {
  private router: Router;
  private response: ResponseManager;
  private middleware: MiddlewareManager;
  private ratelimit: RateLimitManager;
  private rateConfig?: ExtendedRateLimitConfig;

  constructor(config?: TConfig) {
    this.router = new Router();
    this.response = new ResponseManager();
    this.middleware = new MiddlewareManager();
    this.ratelimit = new RateLimitManager(config?.RateConfig);
    this.rateConfig = config?.RateConfig;
  }

  private async parseBody(req: Request): Promise<unknown> {
    const contentType = req.headers.get("Content-Type")?.toLowerCase();
    if (!contentType) return null;
    try {
      if (contentType.includes("application/json")) return await req.json();
      if (contentType.includes("text/plain")) return await req.text();
      return null;
    } catch {
      return { error: "Invalid body format" };
    }
  }

  public listen(port: number, callback?: () => void): void {
    const server = Bun.serve({
      development: true,
      port,
      ...this.handlerFetch(),
    });
    if (callback) callback();
    else
      console.log(
        `🔥 Server is running at http://${server.hostname}:${server.port}`,
      );
  }

  private async handlerRate(req: Request) {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const allowed = await this.ratelimit.check(ip);
    if (!allowed) {
      return this.response.error(
        this.rateConfig?.message ?? "Too many requests, chill bro!",
        429,
      );
    }
    return undefined;
  }

  private handlerFetch() {
    return {
      fetch: async (req: Request) => {
        const rateResponse = await this.handlerRate(req);
        if (rateResponse) return rateResponse;
        const url = new URL(req.url);
        const method = req.method.toUpperCase() as Method;
        const route = this.router.findRoute(method, url.pathname);
        if (!route) return this.response.error("Not Found", 404);
        const match = url.pathname.match(route.pattern);
        const params: Record<string, string> = {};
        if (match) {
          route.paramNames.forEach((name, i) => {
            const value = match[i + 1];
            if (value !== undefined) params[name] = value;
          });
        }
        const body = await this.parseBody(req);
        const ctx: Context = { req, res: this.response, body, params };
        return await this.middleware.applyHooks(ctx, route.handler);
      },
    };
  }

  // ========= ROUTING ==========
  public get(path: string, handler: Handler) {
    this.router.addRoute("GET", path, handler);
  }
  public post(path: string, handler: Handler) {
    this.router.addRoute("POST", path, handler);
  }
  public put(path: string, handler: Handler) {
    this.router.addRoute("PUT", path, handler);
  }
  public patch(path: string, handler: Handler) {
    this.router.addRoute("PATCH", path, handler);
  }
  public delete(path: string, handler: Handler) {
    this.router.addRoute("DELETE", path, handler);
  }

  // ========= MIDDLEWARE ==========
  public onRequest(hook: Hook) {
    this.middleware.use(hook);
  }
  public onError(handler: ErrorHook) {
    this.middleware.useError(handler);
  }
}

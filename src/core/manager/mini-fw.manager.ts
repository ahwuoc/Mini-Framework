import { serve, type BodyInit } from "bun";
import ResponseManager from "./response.manager";
import HomePage from "../../test.html";
import { POST } from "../decorator/method.decorator";
export type Context = {
  req: Request;
  res: ResponseManager;
  body: unknown;
  params: Record<string, string>;
};
type Hook = (ctx: Context) => void | Response | Promise<void | Response>;
type Handler = (ctx: Context) => Response | Promise<Response>;
type Method = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
interface RouteEntry {
  method: Method;
  path: string;
  pattern: RegExp;
  paramNames: string[];
  handler: Handler;
}

export default class MiniFw {
  private routes: RouteEntry[] = [];
  private hooks: Hook[] = [];
  private static response: ResponseManager = new ResponseManager();
  private async parseBody(req: Request): Promise<unknown> {
    const contentType = req.headers.get("Content-Type")?.toLowerCase();
    if (!contentType) return null;
    try {
      if (contentType.includes("application/json")) return await req.json();
      if (contentType.includes("text/plain")) return await req.text();
      return null;
    } catch (error) {
      return { error: "Invalid body format" };
    }
  }

  private async applyMiddleware(ctx: Context, handler: Handler) {
    for (const hook of this.hooks) {
      const result = await hook(ctx);
      if (result instanceof Response) return result;
    }
    const response = await handler(ctx);
    return response ?? MiniFw.response.error("No Response", 500);
  }

  private pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    const regex = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    return {
      pattern: new RegExp(`^${regex}$`),
      paramNames,
    };
  }
  private handlerFetch() {
    return {
      fetch: async (req: Request) => {
        const url = new URL(req.url);
        const method = req.method.toUpperCase() as Method;
        const found = this.routes.find(
          (r) => r.method === method && r.pattern.test(url.pathname),
        );

        if (!found) return MiniFw.response.error("Not Found", 404);
        const match = url.pathname.match(found.pattern);
        const params: Record<string, string> = {};
        if (match) {
          found.paramNames.forEach((name, i) => {
            const value = match[i + 1];
            if (value === undefined)
              return MiniFw.response.error("Missing param", 400);
            params[name] = value;
          });
        }
        const body = await this.parseBody(req);

        const ctx: Context = {
          req,
          res: MiniFw.response,
          body,
          params,
        };
        return await this.applyMiddleware(ctx, found.handler);
      },
    };
  }

  public listen(port: number, callback?: () => void): void {
    const server = serve({
      development: true,
      port,
      ...this.handlerFetch(),
    });
    if (!callback) {
      console.log(
        `🔥 Server chạy tại http://${server.hostname}:${server.port}`,
      );
    } else {
      callback();
    }
  }

  public onRequest(hook: Hook) {
    this.hooks.push(hook);
  }
  private addRoute(method: Method, path: string, handler: Handler) {
    const { pattern, paramNames } = this.pathToRegex(path);
    this.routes.push({ method, path, pattern, paramNames, handler });
  }
  public get(path: string, handler: Handler) {
    this.addRoute("GET", path, handler);
  }
  public post(path: string, handler: Handler) {
    this.addRoute("POST", path, handler);
  }
  public patch(path: string, handler: Handler) {
    this.addRoute("PATCH", path, handler);
  }
  public put(path: string, handler: Handler) {
    this.addRoute("PUT", path, handler);
  }
  public delete(path: string, handler: Handler) {
    this.addRoute("DELETE", path, handler);
  }
}

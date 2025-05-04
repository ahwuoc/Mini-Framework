import type { Handler, Method } from "../utils/type-definitions";
export interface RouteEntry {
  method: Method;
  path: string;
  pattern: RegExp;
  paramNames: string[];
  handler: Handler;
}
export class Router {
  private routes: RouteEntry[] = [];

  public addRoute(method: Method, path: string, handler: Handler) {
    const { pattern, paramNames } = this.pathToRegex(path);
    this.routes.push({ method, path, pattern, paramNames, handler });
  }

  public findRoute(method: Method, pathName: string): RouteEntry | undefined {
    return this.routes.find((r) => r.method && r.pattern.test(pathName));
  }
  public extractParams(
    route: RouteEntry,
    pathname: string,
  ): Record<string, string> {
    const match = pathname.match(route.pattern);
    if (!match) return {};
    const params: Record<string, string> = {};
    route.paramNames.forEach((name, i) => {
      const value = match[i + 1];
      params[name] = match[i + 1] ?? "";
    });
    return params;
  }
  public pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
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
}

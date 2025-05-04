export function combinePath(...args: string[]): string {
  return `/${args
    .filter((path) => path !== "" && path !== "/")
    .map((path) => path.replace(/^\/+|\/+$/g, ""))
    .join("/")}`;
}

export function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function colorize(method: string) {
  const colors: Record<string, string> = {
    GET: "\x1b[32m", // green
    POST: "\x1b[34m", // blue
    PUT: "\x1b[33m", // yellow
    PATCH: "\x1b[36m", // cyan
    DELETE: "\x1b[31m", // red
  };
  const color = colors[method.toUpperCase()] || "\x1b[0m";
  return `${color}${method.toUpperCase()}\x1b[0m`;
}

export function colorizePath(path: string) {
  return `\x1b[35m${path}\x1b[0m`;
}

export const defaultMethods = [
  "constructor",
  "toString",
  "toLocaleString",
  "valueOf",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__",
  "__proto__",
];

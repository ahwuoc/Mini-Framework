import { setMetadata } from "../managers/reflection";
import type { Method } from "../utils/type-definitions";

export const initMethod = (
  method: Method,
  path: string = "",
): MethodDecorator =>
  setMetadata("method_metadata", {
    method: method,
    router: path,
  });

export const GET = (path: string = "") => initMethod("GET", path);
export const POST = (path: string = "") => initMethod("POST", path);
export const DELETE = (path: string = "") => initMethod("DELETE", path);
export const PUT = (path: string = "") => initMethod("PUT", path);
export const PATCH = (path: string = "") => initMethod("PATCH", path);

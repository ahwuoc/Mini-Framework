import type ResponseManager from "../managers/http-response";

export type Constructor<T> = new (...args: any) => T;
export type Method = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
export type validPath = `/${string}`;
export type MetadataKey =
  | "method_metadata"
  | "param_metadata"
  | "class_metadata";
export type Context = {
  req: Request;
  res: ResponseManager;
  body: unknown;
  params: Record<string, string>;
};
export type Hook = (ctx: Context) => void | Response | Promise<void | Response>;
export type Handler = (ctx: Context) => Response | Promise<Response>;
export interface RouteEntry {
  method: Method;
  path: string;
  pattern: RegExp;
  paramNames: string[];
  handler: Handler;
}

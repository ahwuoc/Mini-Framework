import type { Context, Handler, Hook } from "../utils/type-definitions";
export type ErrorHook = (
  err: unknown,
  ctx: Context,
) => Response | Promise<Response>;
export default class MiddlewareManager {
  private hooks: Hook[] = [];
  private errorHooks: ErrorHook[] = [];

  public use(hook: Hook) {
    this.hooks.push(hook);
  }
  useError(handler: ErrorHook) {
    this.errorHooks.push(handler);
  }

  public async applyHooks(ctx: Context, handler: Handler): Promise<Response> {
    try {
      for (const hook of this.hooks) {
        const res = await hook(ctx);
        if (res instanceof Response) return res;
      }
      const result = await handler(ctx);
      return result ?? ctx.res.error("No Response returned", 500);
    } catch (err) {
      for (const eh of this.errorHooks) {
        const res = await eh(err, ctx);
        if (res instanceof Response) return res;
      }
    }
    return ctx.res.error("Internal Server Error", 500);
  }
}

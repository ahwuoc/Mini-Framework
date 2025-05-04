import { setMetadata } from "../managers/reflection";
import type { Context } from "../utils/type-definitions";

export const Inject = (value: any): ParameterDecorator =>
  setMetadata("param_metadata", value);

export const Body = (): ParameterDecorator =>
  setMetadata("param_metadata", (ctx: Context) => ctx.body);

export const Res = (): ParameterDecorator =>
  setMetadata("param_metadata", (ctx: Context) => ctx.res);

export const Params = (field?: any): ParameterDecorator =>
  setMetadata("param_metadata", (ctx: Context) =>
    field ? ctx.params[field] : ctx.params,
  );

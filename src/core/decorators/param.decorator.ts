import { setMetadata } from "../manager/metadata.manager";
import type { Context } from "../manager/mini-fw.manager";

export const Inject = (value: any): ParameterDecorator =>
  setMetadata("param_metadata", value);

export const Body = (): ParameterDecorator =>
  setMetadata("param_metadata", (ctx: Context) => ctx.body);

export const Res = (): ParameterDecorator =>
  setMetadata("param_metadata", (ctx: Context) => ctx.res);

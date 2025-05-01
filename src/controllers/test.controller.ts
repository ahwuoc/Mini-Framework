import { Controller } from "../core/decorator/class.decorator";
import { GET, POST } from "../core/decorator/method.decorator";
import { setMetadata } from "../core/manager/metadata.manager";
import type { Context } from "../core/manager/mini-fw.manager";

@Controller("/test")
export default class testController {
  constructor(@setMetadata("param_metadata", { type: "body" }) id: string) {}
  @GET("/abc")
  getUserId(ctx: Context) {
    return ctx.res.ok("okem");
  }
}

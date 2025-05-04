import { Controller } from "../core/decorators/class.decorator";
import { GET } from "../core/decorators/method.decorator";
import { Res } from "../core/decorators/param.decorator";
import type ResponseManager from "../core/managers/http-response";
import type { Context } from "../core/utils/type-definitions";

@Controller()
export default class userController {
  @GET()
  getuserId(ctx: Context) {
    return ctx.res.ok("chaoem");
  }
}

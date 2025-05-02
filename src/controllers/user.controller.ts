import { Controller } from "../core/decorators/class.decorator";
import { GET, POST } from "../core/decorators/method.decorator";
import { Body, Inject, Res } from "../core/decorators/param.decorator";
import type { Context } from "../core/manager/mini-fw.manager";
import userService from "../services/user.service";
@Controller("/users")
export default class UserController {
  @GET()
  getUser(ctx: Context) {
    return ctx.res.ok("okem");
  }

  @POST()
  addUser(ctx: Context, @Body() body: any) {
    return ctx.res.ok(body);
  }
}

import { Controller } from "../core/decorator/class.decorator";
import { GET } from "../core/decorator/method.decorator";
import type testService from "../core/services/test.service";
import type userService from "../core/services/user.service";

@Controller()
export default class userController {
  constructor(
    private userService: userService,
    private testService: testService,
  ) {}
  @GET()
  test() {
    this.userService.getUser();
  }
}

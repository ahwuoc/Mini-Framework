import { InjectTable } from "../core/decorators/class.decorator";
import { Inject } from "../core/decorators/param.decorator";
import type userRepositories from "../responsitory/user.repositories";
@InjectTable()
export default class userService {
  constructor(private readonly userRepositories: userRepositories) {}
  getRepo() {
    return new Response("them user");
  }
}

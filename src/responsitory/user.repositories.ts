import { InjectTable } from "../core/decorators/class.decorator";

@InjectTable()
export default class userRepositories {
  createUser() {
    return new Response("404");
  }
}

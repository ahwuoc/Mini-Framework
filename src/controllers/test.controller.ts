import { GET, POST } from "../core/decorator/method.decorator";
import { setMetadata } from "../core/manager/metadata.manager";

@setMetadata("class_metadata", { prefix: "/users" })
export default class testController {
  constructor(@setMetadata("param_metadata", { type: "body" }) id: string) {}
  @GET("/test")
  hello(
    @setMetadata("param_metadata", { name: "id", type: "query" }) id: string,
    @setMetadata("param_metadata", { name: "name", type: "query" })
    name: string,
    abc: number
  ) {}
}

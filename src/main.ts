import "reflect-metadata";
import App from "./core/manager/bun.manager";

const app = new App();

app.get("/", (ctx) => {
  return ctx.res.ok("data");
});
app.listen(3000);

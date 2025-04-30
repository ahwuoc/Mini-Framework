import "reflect-metadata";
import App from "./core/manager/bun.manager";
import PageApp from "./views/index";

const app = new App();

app.get("/", (ctx) => {
  return ctx.res.render(PageApp, { message: "Bun SSR siêu nhanh!" });
});
app.listen(3000);

import Zolid from "./core/framework";

const app = new Zolid();

app.get("/", () => {
  return new Response("Request thanh cong");
});
app.listen(3000);

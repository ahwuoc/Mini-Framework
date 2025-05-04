import Zolid from "./core/framework";

const app = new Zolid({
  RateConfig: {
    maxReq: 10,
    windowsMS: 10000,
    message: "Giới hạn request",
  },
});

app.get("/abc", () => {
  return new Response("404");
});
app.listen(3000);

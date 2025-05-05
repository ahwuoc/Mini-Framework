import Zolid from "./core/framework";

const app = new Zolid({
  RateConfig: {
    maxRequests: 1,
    windowMs: 10000,
    message: "Giới hạn request rồi bạn ơi",
    redisConfig: {
      host: "localhost",
      port: 6379,
    },
  },
});
app.get("/", () => {
  return new Response("test123123");
});
app.listen(3000);

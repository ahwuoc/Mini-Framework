import Redis from "ioredis";
import Zolid from "./core/framework";
const redis = new Redis({
  host: "localhost",
  port: 6379,
});
const app = new Zolid({
  RateConfig: {
    maxRequests: 1,
    windowMs: 10000,
    message: "Giới hạn request rồi bạn ơi",
  },
});
app.get("/", () => {
  return new Response("test123123");
});
app.listen(3000);

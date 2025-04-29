import "reflect-metadata"; // Import reflect-metadata để xài Metadata API
import App, { type Context } from "./core/manager/bun.manager";

import testController from "./controllers/test.controller";

import Route from "./core/manager/route.manager";
import userController from "./controllers/user.controller";
import { isJSDocClassTag } from "typescript";

// B1: Lấy ra tất cả method trong prototype, loại bỏ constructor
const getMethod = Object.getOwnPropertyNames(testController.prototype).filter(
  (method) => method != "constructor",
);

// B2: Loop qua từng method
for (const method of getMethod) {
  // B2.1: Lấy metadata gắn cho method
  const metadataMethod = Reflect.getMetadata(
    "method_metadata",
    testController.prototype,
    method,
  );
  console.log(`Method: ${method} metadata:`, metadataMethod);

  // B2.2: Lấy types của các parameter trong method (auto gắn bởi TypeScript khi bật emitDecoratorMetadata)
  const paramTypes = Reflect.getMetadata(
    "design:paramtypes",
    testController.prototype,
    method,
  );

  // B2.3: Loop qua từng param để lấy custom metadata nếu có
  const paramMetadatas = paramTypes.map((param: any, index: number) => {
    // Lấy custom metadata của param theo index
    const paramMetadata = Reflect.getMetadata(index, testController.prototype);
    console.log("metadata param", paramMetadata);
  });
}

// (Code cũ ghi chú lại để nhớ)

// Lấy method function instance
// const params = testController.prototype[method as keyof testController];

// Lấy custom metadata của param index 0
// console.log(
//   "Param metadata:",
//   Reflect.getMetadata(0, testController.prototype)
// );

// This is code get metadata decorator class
// console.log(
//   "Class metadata:",
//   Reflect.getMetadata("class_metadata", testController)
// );

const app = new App();
// app.onRequest((ctx) => {});
app.get("/", (ctx) => {
  return ctx.res.ok(ctx.body);
});
app.post("/", (ctx) => {
  const body: any = ctx.body;
  console.log(body);
  return ctx.res.ok(ctx.body);
});
app.listen(3000);

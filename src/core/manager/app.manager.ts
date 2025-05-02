import "reflect-metadata";
import type { Constructor } from "../utils/types";
import dynamicImport from "../dynamic/loadController";
import ContainerDI from "./di.manager";
import MiniFw from "./mini-fw.manager";
import type { Context } from "./mini-fw.manager";
import { colorize, colorizePath, combinePath } from "../utils/common";
export type TAppManager = {
  controllers?: Constructor<any>[];
};

export default class ManagerApp {
  private controllers: Constructor<any>[];
  private App: MiniFw;
  constructor() {
    this.App = new MiniFw();
    this.controllers = dynamicImport("controllers") ?? [];
  }
  listen(port: number) {
    this.registerInstance();
    this.RouteRegister();
    this.App.listen(port);
  }
  private registerInstance() {
    this.controllers.map((controller) => {
      const instance = this.RegisterDI(controller);
    });
  }

  private RegisterDI(constructor: Constructor<any>) {
    ContainerDI.registerService(constructor);
    return ContainerDI.getService(constructor);
  }
  private RouteRegister() {
    for (const controller of this.controllers) {
      const instance = ContainerDI.getService(controller);
      const controllerMeta = Reflect.getMetadata("class_metadata", controller);
      const prefix = controllerMeta?.prefix || "";
      const methods = Object.getOwnPropertyNames(controller.prototype).filter(
        (method) => method !== "constructor",
      );
      for (const methodName of methods) {
        const methodMeta = Reflect.getMetadata(
          "method_metadata",
          controller.prototype,
          methodName,
        );
        if (!methodMeta) continue;
        const routeHandler = (instance as any)[methodName].bind(instance);
        const fullPath = combinePath(prefix, methodMeta.router);
        (this.App as any)[methodMeta.method.toLowerCase()](
          fullPath,
          (ctx: Context) => routeHandler(ctx),
        );
        console.log(
          `🍞 ${colorize(methodMeta.method)} ${colorizePath(fullPath)} → ${controller.name}.${methodName}()`,
        );
      }
    }
  }
}

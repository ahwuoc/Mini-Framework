import "reflect-metadata";
import type { Constructor } from "../common/types";
import { GET } from "../decorator/method.decorator";
import dynamicImport from "../dynamic/loadController";
import ContainerDI from "./di.manager";
import MiniFw from "./mini-fw.manager";
import { getMetadata } from "reflect-metadata/no-conflict";
import type { Context } from "./mini-fw.manager";
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
      console.log(instance);
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
        const routeHandler = instance[methodName].bind(instance);
        const fullPath = this.combinePath(prefix, methodMeta.router);
        console.log(fullPath);
        (this.App as any)[methodMeta.method.toLowerCase()](
          fullPath,
          (ctx: Context) => routeHandler(ctx),
        );
      }
    }
  }

  private combinePath(...args: string[]): string {
    return `/${args
      .filter((path) => path !== "" && path !== "/")
      .map((path) => path.replace(/^\/+|\/+$/g, ""))
      .join("/")}`;
  }
}

import "reflect-metadata";
import ContainerDI from "./container";
import { colorize, colorizePath, combinePath } from "../utils/formatting";
import type { Constructor } from "../utils/type-definitions";
import module_loader from "../utils/module-loader";
import CoreApp from "./server";
export type TAppManager = {
  controllers?: Constructor<any>[];
};

export default class ManagerApp {
  private controllers: Constructor<any>[];
  private App: CoreApp;
  constructor(App: CoreApp) {
    this.App = App;
    this.controllers = module_loader("controllers") ?? [];
  }
  public listen(port: any, callback?: any) {
    this.registerInstance();
    this.RouteRegister();
    this.App.listen(port, callback);
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
          (ctx: unknown) => routeHandler(ctx),
        );
        console.log(
          `🍞 ${colorize(methodMeta.method)} ${colorizePath(fullPath)} → ${
            controller.name
          }.${methodName}()`,
        );
      }
    }
  }
}

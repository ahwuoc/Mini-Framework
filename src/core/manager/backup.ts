import { getMetadata } from "reflect-metadata/no-conflict";
import { defaultMethods } from "../utils/common";
import type { Constructor } from "../utils/types";
export default class ContainerDI {
  private static services = new Map<Constructor<any>, Constructor<any>>();
  private static instances = new Map<Constructor<any>, any>();

  static registerService(constructor: Constructor<any>) {
    this.services.set(constructor, constructor);
  }
  static getService<T>(constructor: Constructor<T>): T {
    let service = this.services.get(constructor);
    if (!service) throw new Error(`${constructor} not found`);
    if (this.instances.has(service)) {
      return this.instances.get(service);
    }
    const paramTypes = Reflect.getMetadata("design:paramtypes", service) ?? [];
    let dependencies = paramTypes.map((param: Constructor<any>) => {
      this.registerService(param);
      return this.getService(param);
    });
    dependencies = dependencies.map((dependency: any, index: number) => {
      const shouldReplace = Reflect.getMetadata(index, service);
      if (shouldReplace) {
        try {
          new shouldReplace();
          this.registerService(shouldReplace);
          return this.getService(shouldReplace);
        } catch (error) {
          return shouldReplace;
        }
      }
      return dependency;
    });

    const methods = Object.getOwnPropertyNames(service.prototype).filter(
      (method) => !defaultMethods.includes(method),
    );
    methods.forEach((method, index: number) => {
      if (typeof service.prototype[method] === "function") {
        const paramTypes =
          Reflect.getMetadata("design:paramtypes", service.prototype, method) ??
          [];
        const originalMethod: Function = service.prototype[method];
        service.prototype[method] = function (...args: unknown[]) {
          const [ctx] = args;
          const paramMeta = paramTypes
            .map((param: unknown, index: number) => {
              const metadata = Reflect.getMetadata(
                index,
                service.prototype,
                method,
              );
              if (metadata) return { value: metadata, index: index };
            })
            .filter((paramMeta: any) => paramMeta !== undefined);
          for (const param of paramMeta) {
            args[param.index] = param.value(ctx);
          }
          originalMethod.apply(this, args);
        };
        Object.defineProperty(service.prototype[method], "name", {
          value: originalMethod.name,
        });
        const keys = Reflect.getMetadataKeys(originalMethod);
        for (const key of keys) {
          const value = Reflect.getMetadata(key, originalMethod);
          Reflect.defineMetadata(key, value, service.prototype[method]);
        }
        Object.entries(originalMethod).forEach(([key, value]) => {
          service.prototype[method][key] = value;
        });
      }
    });
    const instance = new service(...dependencies);
    this.instances.set(service, instance);
    return instance;
  }
}

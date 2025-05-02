import { defaultMethods } from "../utils/common";
import type { Constructor } from "../utils/types";

export default class ContainerDI {
  private static services = new Map<Constructor<any>, Constructor<any>>();
  private static instances = new Map<Constructor<any>, any>();

  static registerService(constructor: Constructor<any>) {
    this.services.set(constructor, constructor);
  }

  static getService<T>(constructor: Constructor<T>): T {
    const service = this.resolveService(constructor);
    if (this.instances.has(service)) return this.instances.get(service);

    const dependencies = this.resolveDependencies(service);
    this.injectMethodParams(service);

    const instance = new service(...dependencies);
    this.instances.set(service, instance);
    return instance;
  }

  private static resolveService<T>(
    constructor: Constructor<T>,
  ): Constructor<T> {
    const service = this.services.get(constructor);
    if (!service) throw new Error(`${constructor} not found`);
    return service;
  }

  private static resolveDependencies(service: Constructor<any>) {
    const paramTypes = Reflect.getMetadata("design:paramtypes", service) ?? [];
    let dependencies = paramTypes.map((param: Constructor<any>) => {
      this.registerService(param);
      return this.getService(param);
    });

    dependencies = dependencies.map((dep: unknown, index: number) => {
      const shouldReplace = Reflect.getMetadata(index, service);
      if (shouldReplace) {
        try {
          new shouldReplace();
          this.registerService(shouldReplace);
          return this.getService(shouldReplace);
        } catch {
          return shouldReplace;
        }
      }
      return dep;
    });

    return dependencies;
  }

  private static injectMethodParams(service: Constructor<any>) {
    const methods = Object.getOwnPropertyNames(service.prototype).filter(
      (method) => !defaultMethods.includes(method),
    );
    for (const method of methods) {
      if (typeof service.prototype[method] !== "function") continue;
      const originalMethod = service.prototype[method];
      const paramTypes =
        Reflect.getMetadata("design:paramtypes", service.prototype, method) ??
        [];

      service.prototype[method] = function (...args: unknown[]) {
        const [ctx] = args;

        const paramMeta = paramTypes
          .map((_: unknown, index: number) => {
            const meta = Reflect.getMetadata(index, service.prototype, method);
            if (meta) return { value: meta, index };
          })
          .filter(Boolean);

        for (const param of paramMeta) {
          args[param!.index] = param!.value(ctx);
        }

        return originalMethod.apply(this, args);
      };

      this.copyMetadata(originalMethod, service.prototype[method]);
    }
  }

  private static copyMetadata(source: Function, target: Function) {
    Object.defineProperty(target, "name", {
      value: source.name,
    });

    const keys = Reflect.getMetadataKeys(source);
    for (const key of keys) {
      const value = Reflect.getMetadata(key, source);
      Reflect.defineMetadata(key, value, target);
    }

    Object.entries(source as Record<string, any>).forEach(([key, value]) => {
      (target as Record<string, any>)[key] = value;
    });
  }
}

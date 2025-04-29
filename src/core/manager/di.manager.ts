import type { Constructor } from "./common/types";

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
    const instance = new service(...dependencies);
    this.instances.set(service, instance);
    return instance;
  }
}

import "reflect-metadata";
import type { MetadataKey } from "../utils/type-definitions";

export const setMetadata = (
  key: MetadataKey,
  value: any,
): ClassDecorator & MethodDecorator & ParameterDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptorOrIndex?: PropertyDescriptor | number,
  ) => {
    if (typeof descriptorOrIndex === "number") {
      if (propertyKey) {
        //const metadata = Reflect.getMetadata(key, target, propertyKey);
        Reflect.defineMetadata(descriptorOrIndex, value, target, propertyKey);
      } else {
        //const metadata = Reflect.getMetadata(0, target);
        // constructor parameter
        Reflect.defineMetadata(descriptorOrIndex, value, target);
      }
    } else if (propertyKey && descriptorOrIndex !== undefined) {
      //Method decorator
      Reflect.defineMetadata(key, value, target, propertyKey);
    } else {
      // Class decorator
      Reflect.defineMetadata(key, value, target);
    }
  };
};

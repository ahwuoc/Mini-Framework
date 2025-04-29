import "reflect-metadata";
// Import thư viện reflect-metadata để có thể dùng Reflect.defineMetadata và Reflect.getMetadata
// Bắt buộc phải có nếu muốn xài Decorators chuẩn chỉnh trong TypeScript

// Các key metadata hợp lệ mình quy định trước để tránh sai sót
type MetadataKey = "method_metadata" | "param_metadata" | "class_metadata";

/**
 * Hàm setMetadata: Gắn metadata vào Class, Method, hoặc Parameter
 * @param key Metadata key (method_metadata, param_metadata, class_metadata)
 * @param value Giá trị metadata muốn lưu
 * @returns Decorator function phù hợp với loại target
 */
export const setMetadata = (
  key: MetadataKey,
  value: any
): ClassDecorator & MethodDecorator & ParameterDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptorOrIndex?: PropertyDescriptor | number
  ) => {
    if (typeof descriptorOrIndex === "number") {
      // --- Đây là PARAMETER DECORATOR ---
      // Nếu descriptorOrIndex là số -> đang decorate 1 parameter
      // => Lưu metadata theo index của parameter (0, 1, 2, ...)

      // target ở đây: class prototype (VD: TestController.prototype)
      Reflect.defineMetadata(descriptorOrIndex, value, target);
      // Metadata sẽ được lưu TRÊN prototype class, key = số index (VD: 0, 1, 2)
    } else if (propertyKey && descriptorOrIndex !== undefined) {
      // --- Đây là METHOD DECORATOR ---
      // Nếu có propertyKey (tên method) + descriptor -> đang decorate 1 method
      // => Lưu metadata cho method đó

      // target ở đây: class prototype (VD: TestController.prototype)
      Reflect.defineMetadata(key, value, target, propertyKey);
      // Metadata sẽ được lưu TRÊN prototype method, theo key là 'method_metadata'
    } else {
      // --- Đây là CLASS DECORATOR ---
      // Nếu không có propertyKey + descriptor -> đang decorate 1 class
      // => Lưu metadata cho cả class

      // target ở đây: chính là constructor function của class (VD: TestController)
      Reflect.defineMetadata(key, value, target);
      // Metadata sẽ được lưu TRÊN constructor function, theo key là 'class_metadata'
    }
  };
};

export type Constructor<T> = new (...args: any) => T;
export type Method = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
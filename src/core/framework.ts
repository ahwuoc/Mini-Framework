import type { Handler, validPath } from "./utils/type-definitions";
import ManagerApp from "./managers/application";
import CoreApp, { type ExtendedRateLimitConfig } from "./managers/server";

type TConfig = { RateConfig?: ExtendedRateLimitConfig };

export default class Zolid {
  private appManager: ManagerApp;
  private app: CoreApp;

  constructor(config?: TConfig) {
    this.app = new CoreApp(config);
    this.appManager = new ManagerApp(this.app);
  }

  public listen(port: number, callback?: () => void) {
    this.appManager.listen(port, callback);
  }

  public get(path: validPath, handler: Handler) {
    this.app.get(path, handler);
  }

  public post(path: validPath, handler: Handler) {
    this.app.post(path, handler);
  }

  public put(path: validPath, handler: Handler) {
    this.app.put(path, handler);
  }

  public delete(path: validPath, handler: Handler) {
    this.app.delete(path, handler);
  }
}

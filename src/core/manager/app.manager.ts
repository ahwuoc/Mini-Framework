import type { Application } from "express-serve-static-core";
import type { Constructor } from "../common/types";
import express from "express";
import dynamicImport from "../dynamic/loadController";
export type TAppManager = {
  controllers?: Constructor<any>[];
  middlewares?: Constructor<any>[];
};

export default class ManagerApp {
  private controllers: Constructor<any>[];
  private App: Application;
  constructor({ controllers }: TAppManager) {
    this.App = express();
    this.controllers = dynamicImport("controllers") ?? [];
  }
  listen(port: number, callback: () => void) {
    this.App.listen(port, callback);
  }

  handlerMiddleer() {}
}

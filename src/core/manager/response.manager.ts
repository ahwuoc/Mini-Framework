import type { BodyInit, HeadersInit } from "bun";
import {
  createElement,
  type Component,
  type ComponentType,
  type ReactElement,
} from "react";
import { renderToReadableStream } from "react-dom/server";
export default class ResponseManager {
  private defaultHeaders = { "Content-Type": "application/json" };

  constructor(private init?: ResponseInit) {}

  public text(text: string, status = 200, extraHeaders: HeadersInit = {}) {
    return this.createResponse(text, status, {
      "Content-Type": "text/plain",
      ...extraHeaders,
    });
  }

  public json(data: unknown, status = 200, extraHeaders: HeadersInit = {}) {
    return this.createResponse(JSON.stringify(data), status, {
      ...extraHeaders,
    });
  }

  public ok(data: unknown, extraHeaders: HeadersInit = {}) {
    return this.json(data, 200, extraHeaders);
  }

  public error(msg = "Something went wrong", status = 500) {
    return this.json({ error: msg }, status);
  }

  public async render(
    Component: ComponentType<any>,
    props: Record<string, any> = {},
  ) {
    const element = createElement(Component, props);
    const stream = await renderToReadableStream(element);
    return new Response(stream, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  public redirect(url: string, status = 302) {
    return new Response(null, {
      status,
      headers: { Location: url },
    });
  }

  public noContent() {
    return new Response(null, { status: 204 });
  }

  private createResponse(
    body: BodyInit,
    status: number,
    headers: HeadersInit = {},
  ) {
    return new Response(body, {
      status,
      headers: { ...this.defaultHeaders, ...headers },
    });
  }
}

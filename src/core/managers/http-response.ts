import type { BodyInit, HeadersInit } from "bun";
import { createElement, type ComponentType } from "react";
import { renderToReadableStream } from "react-dom/server";
export default class ResponseManager {
  public text(text: string, status = 200) {
    return new Response(text, {
      status: status,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
  public json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
      status: status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  public ok(data: unknown) {
    return this.json(data, 200);
  }

  public error(msg = "Something went wrong", status = 500) {
    return this.json({ error: msg }, status);
  }

  public async render(
    Component: ComponentType<any>,
    props: Record<string, any> = {}
  ) {
    try {
      if (!Component || typeof Component !== "function") {
        throw new Error("Invalid Component provided to render");
      }
      const element = createElement(Component, props);
      const stream = await renderToReadableStream(element);
      return new Response(stream, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Error rendering component:", error);
      return new Response("An error occurred during rendering.", {
        status: 500,
      });
    }
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
}

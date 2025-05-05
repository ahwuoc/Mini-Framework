import type { BodyInit, HeadersInit } from "bun";
import { createElement, type ComponentType } from "react";
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

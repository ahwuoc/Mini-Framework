import type { BodyInit } from "bun";

export default class ResponseManager {
  private headers = { "Content-Type": "application/json" };
  constructor(private init?: ResponseInit) {}
  public text(text: string, status = 200) {
    return new Response(text, { status, headers: this.headers });
  }
  public json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: this.headers,
    });
  }
  public error(msg: string = "Something went wrong", status = 500) {
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: this.headers,
    });
  }
  public ok(data: unknown) {
    return this.json(data, 200);
  }
}

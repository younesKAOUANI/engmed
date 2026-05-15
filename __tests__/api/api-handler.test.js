import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock next-auth before importing the module under test
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("../../lib/auth.js", () => ({ authOptions: {} }));

import { getServerSession } from "next-auth/next";
import { apiHandler } from "../../lib/api-handler.js";

/** Creates a minimal mock Next.js req/res pair. */
function createMocks(overrides = {}) {
  const json = jest.fn();
  const status = jest.fn(() => ({ json, end: jest.fn() }));
  const setHeader = jest.fn();

  const req = {
    method: "GET",
    url: "/api/test",
    headers: {},
    socket: {},
    body: {},
    query: {},
    ...overrides,
  };

  const res = { status, setHeader, json, end: jest.fn() };

  return { req, res, json, status };
}

describe("apiHandler", () => {
  beforeEach(() => {
    getServerSession.mockReset();
  });

  it("calls the handler for allowed methods", async () => {
    const handler = apiHandler({ methods: ["GET"] }, async (_req, res) => {
      return res.status(200).json({ ok: true });
    });

    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 405 for disallowed methods", async () => {
    const handler = apiHandler({ methods: ["GET"] }, async (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const { req, res } = createMocks({ method: "POST" });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("returns 401 when auth required and no session", async () => {
    getServerSession.mockResolvedValue(null);

    const handler = apiHandler({ auth: true }, async (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("calls the handler when auth is satisfied", async () => {
    getServerSession.mockResolvedValue({ user: { id: "abc123", role: "STUDENT" } });

    const handler = apiHandler({ auth: true }, async (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 403 when role check fails", async () => {
    getServerSession.mockResolvedValue({ user: { id: "abc123", role: "STUDENT" } });

    const handler = apiHandler({ auth: true, role: "ADMIN" }, async (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 403 for wrong role from a role array", async () => {
    getServerSession.mockResolvedValue({ user: { id: "abc123", role: "STUDENT" } });

    const handler = apiHandler({ auth: true, role: ["ADMIN", "INSTRUCTOR"] }, async (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("allows INSTRUCTOR when role array includes INSTRUCTOR", async () => {
    getServerSession.mockResolvedValue({ user: { id: "abc123", role: "INSTRUCTOR" } });

    const handler = apiHandler({ auth: true, role: ["ADMIN", "INSTRUCTOR"] }, async (_req, res) => {
      res.status(200).json({ ok: true });
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 422 for Zod validation errors", async () => {
    const { ZodError, z } = await import("zod");
    const handler = apiHandler({}, async (_req, res) => {
      // Simulate a zod parse failure inside the handler
      z.string().parse(123);
      res.status(200).json({ ok: true });
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  it("maps Prisma P2002 to 409", async () => {
    const handler = apiHandler({}, async (_req, res) => {
      const err = new Error("Unique constraint");
      err.code = "P2002";
      throw err;
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("maps Prisma P2025 to 404", async () => {
    const handler = apiHandler({}, async (_req, res) => {
      const err = new Error("Not found");
      err.code = "P2025";
      throw err;
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 500 for unknown errors", async () => {
    const handler = apiHandler({}, async () => {
      throw new Error("Unexpected failure");
    });

    const { req, res } = createMocks();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

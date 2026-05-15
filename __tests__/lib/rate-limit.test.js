import { describe, it, expect, beforeEach } from "@jest/globals";
import { rateLimit } from "../../lib/rate-limit.js";

function mockReq(ip = "1.2.3.4") {
  return {
    headers: { "x-forwarded-for": ip },
    socket: { remoteAddress: ip },
  };
}

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    const limiter = rateLimit({ limit: 3, windowMs: 60_000 });
    const req = mockReq();
    expect(limiter.check(req).success).toBe(true);
    expect(limiter.check(req).success).toBe(true);
    expect(limiter.check(req).success).toBe(true);
  });

  it("blocks requests beyond the limit", () => {
    const limiter = rateLimit({ limit: 2, windowMs: 60_000 });
    const req = mockReq("5.6.7.8");
    limiter.check(req);
    limiter.check(req);
    const result = limiter.check(req);
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/too many/i);
  });

  it("counts different IPs independently", () => {
    const limiter = rateLimit({ limit: 1, windowMs: 60_000 });
    expect(limiter.check(mockReq("10.0.0.1")).success).toBe(true);
    expect(limiter.check(mockReq("10.0.0.2")).success).toBe(true);
    // same IP again — should be blocked
    expect(limiter.check(mockReq("10.0.0.1")).success).toBe(false);
  });

  it("resets after the time window", async () => {
    const limiter = rateLimit({ limit: 1, windowMs: 50 }); // 50 ms window
    const req = mockReq("9.9.9.9");
    limiter.check(req); // use up the limit
    expect(limiter.check(req).success).toBe(false);

    await new Promise((r) => setTimeout(r, 60)); // wait for window to expire

    expect(limiter.check(req).success).toBe(true);
  });

  it("returns the remaining count", () => {
    const limiter = rateLimit({ limit: 5, windowMs: 60_000 });
    const req = mockReq("2.2.2.2");
    const r1 = limiter.check(req);
    const r2 = limiter.check(req);
    expect(r1.remaining).toBe(4);
    expect(r2.remaining).toBe(3);
  });
});

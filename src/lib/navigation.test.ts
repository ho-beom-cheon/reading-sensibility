import { describe, expect, it } from "vitest";
import { primaryRoutes } from "./navigation";

describe("primaryRoutes", () => {
  it("defines the scaffold routes required by the handoff package", () => {
    expect(primaryRoutes.map((route) => route.href)).toEqual([
      "/",
      "/create",
      "/library"
    ]);
  });

  it("keeps every scaffold route visible in navigation", () => {
    expect(primaryRoutes.every((route) => route.label.length > 0)).toBe(true);
  });
});

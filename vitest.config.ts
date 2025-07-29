import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["json", "lcov", "text", "clover"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/fixtures/**"],
    },
  },
});

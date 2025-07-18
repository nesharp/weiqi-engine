import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    exclude: [...configDefaults.exclude, "node_modules/"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});

/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const processEnvValues = {
    "process.env": Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      };
    }, {}),
  };

  return {
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    define: processEnvValues,
    server: {
      port: 3000,
      open: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/MsalReactTester/setupTests.ts",
      coverage: {
        reporter: ["text", "html"],
        exclude: ["node_modules/", "src/MsalReactTester/"],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
  };
});

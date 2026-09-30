import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * O harness cresceu na spec 21.
 *
 * Ate ela, o Vitest rodava em `environment: "node"` e so enxergava `.test.ts`:
 * nenhum criterio de comportamento de tela — digitar, sugerir, navegar por
 * teclado — tinha como ser provado. Especificar comportamento sem meio de
 * observa-lo e escrever criterio que ninguem consegue reprovar.
 *
 * Sem @vitejs/plugin-react de proposito: a versao que casa com este Vite
 * conflita no peer, e o esbuild do proprio Vite ja transforma o JSX. O plugin
 * existe para Fast Refresh, que teste nao usa.
 */
export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["app/**/__tests__/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname) },
  },
});

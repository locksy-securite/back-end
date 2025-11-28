import ts from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([

  { ignores: ["dist/*/"] },


  {
    files: [".ts"],
    parser: "@typescript-eslint/parser",
    parserOptions: { project: "./tsconfig.json" },
    plugins: { "@typescript-eslint": ts },
    extends: ["plugin:@typescript-eslint/recommended"],
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.spec.ts"], // exclut les tests
    rules: {
    // tes règles ici
  },
  },

  


  {
    files: [".spec.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off", 
    },
  },
]); 
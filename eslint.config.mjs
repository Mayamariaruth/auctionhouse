// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],

    plugins: { js },
    extends: ["js/recommended"],

    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "no-unused-vars": ["warn"],
      semi: ["error", "always"],
      indent: ["error", 2],
      "no-undef": "error",
    },
  },
]);

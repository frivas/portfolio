import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/", "protos/"] },
  js.configs.recommended,
  {
    files: ["sites/**/*.js"],
    languageOptions: { sourceType: "script", globals: { ...globals.browser, PROJECTS: "readonly" } },
  },
  { files: ["*.js"], languageOptions: { globals: globals.node } },
];

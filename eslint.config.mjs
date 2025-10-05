import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Unexpected any. Specify a different type 문구 제거
      "@typescript-eslint/no-explicit-any": "off",
      // React, { ReactElement } from "react" 설정 안함
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];

export default eslintConfig;

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js", "*.js"],
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "comma-dangle": ["error", "never"],
        "jsx-quotes": ["error", "prefer-single"],
        "@typescript-eslint/no-shadow": ["error"],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-shadow": "off",
        "no-undef": "off",
        "prettier/prettier": [
          "error",
          {
            "no-inline-styles": true,
            printWidth: 90,
            tabWidth: 2,
            tabs: false,
            semi: true,
            singleQuote: false,
            quoteProps: "as-needed",
            trailingComma: "none",
            bracketSpacing: true,
            jsxBracketSameLine: false,
            arrowParens: "always",
          },
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "interface",
            format: ["PascalCase"],
            custom: {
              regex: "^I[A-Z]",
              match: true,
            },
          },
          {
            selector: ["class"],
            format: ["PascalCase"],
            leadingUnderscore: "forbid",
          },
          {
            selector: ["function"],
            format: ["strictCamelCase"],
            leadingUnderscore: "allow",
          },
          {
            selector: "variable",
            format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
          },
        ],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
      },
    },
  ],
};

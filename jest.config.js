const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // ✅ Add this block to ignore compiled tests in dist/
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ]
};

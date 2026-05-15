/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  // babel-jest transforms ESM to CJS for Node/Jest
  transform: { "^.+\\.jsx?$": "babel-jest" },
  testMatch: ["**/__tests__/**/*.test.js", "**/*.test.js"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
  transformIgnorePatterns: ["/node_modules/"],
  collectCoverageFrom: [
    "lib/**/*.js",
    "pages/api/**/*.js",
    "!pages/api/auth/[...nextauth]/**",
  ],
  coverageReporters: ["text", "lcov"],
};

module.exports = config;

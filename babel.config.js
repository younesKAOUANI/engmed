/**
 * Babel config scoped to the test environment only.
 * Next.js uses its own SWC compiler for builds; this file only affects Jest.
 */
module.exports = {
  env: {
    test: {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" }, modules: "commonjs" }],
      ],
    },
  },
};

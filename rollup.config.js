import fs from "fs";
import path from "path";
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const extensions = [".ts"];
const noDeclarationFiles = { compilerOptions: { declaration: false } };

const babelRuntimeVersion = pkg.dependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);

function makeExternalPredicate(externalArr) {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return (id) => pattern.test(id);
}

function removeDir(name) {
  try {
    if (fs.statSync(name).isFile()) {
      fs.unlinkSync(name);
    } else {
      fs.readdirSync(name).forEach((dir) => removeDir(path.join(name, dir)));
      fs.rmdirSync(name);
    }
  } catch (err) {}
}

export default function () {
  removeDir("package");
  removeDir("types");

  return [
    // CommonJS
    {
      input: "src/index.ts",
      output: {
        file: "lib/index.js",
        format: "cjs",
        indent: false,
      },
      external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
      plugins: [
        nodeResolve({
          extensions,
        }),
        typescript({ useTsconfigDeclarationDir: true }),
        babel({
          extensions,
          plugins: [
            [
              "@babel/plugin-transform-runtime",
              { version: babelRuntimeVersion },
            ],
          ],
          runtimeHelpers: true,
        }),
      ],
    },

    // ES
    {
      input: "src/index.ts",
      output: {
        file: "es/index.js",
        format: "es",
        indent: false,
      },
      external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
      plugins: [
        nodeResolve({
          extensions,
        }),
        typescript({ tsconfigOverride: noDeclarationFiles }),
        babel({
          extensions,
          plugins: [
            [
              "@babel/plugin-transform-runtime",
              { version: babelRuntimeVersion, useESModules: true },
            ],
          ],
          runtimeHelpers: true,
        }),
      ],
    },

    // ES for Browsers
    {
      input: "src/index.ts",
      output: {
        file: "es/index.mjs",
        format: "es",
        indent: false,
      },
      plugins: [
        nodeResolve({
          extensions,
        }),
        replace({
          "process.env.NODE_ENV": JSON.stringify("production"),
        }),
        typescript({ tsconfigOverride: noDeclarationFiles }),
        babel({
          extensions,
          exclude: "node_modules/**",
        }),
        terser({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        }),
      ],
    },
  ];
}

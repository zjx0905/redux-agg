const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve;
const babel = require('@rollup/plugin-babel').babel;
const typescript = require('rollup-plugin-typescript2');

const pkg = require('../package.json');
const packagesDir = path.resolve(__dirname, '..', 'packages');
const pagckages = fs.readdirSync(packagesDir).filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  const pkg = require(`${packagesDir}/${f}/package.json`);
  if (pkg.private && !pkg.buildOptions) {
    return false;
  }
  return true;
});
const extensions = ['.ts'];
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];
const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  ''
);
const plugins = [
  typescript({
    useTsconfigDeclarationDir: true,
  }),
  nodeResolve({
    extensions,
  }),
  babel({
    extensions,
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          version: babelRuntimeVersion,
          useESModules: true,
        },
      ],
    ],
    babelHelpers: 'runtime',
  }),
];

run();

function run() {
  pagckages.forEach(build);
}

async function build(packageName) {
  const inputOption = createInputOption(packageName);
  const outputOptions = createOutputOptions(packageName);
  const bundle = await rollup.rollup(inputOption);
  outputOptions.forEach(bundle.write);
}

function createInputOption(packageName) {
  return {
    input: `${packagesDir}/${packageName}/src/index.ts`,
    external,
    plugins,
  };
}

function createOutputOptions(packageName) {
  return [
    {
      file: `${packagesDir}/${packageName}/es/index.js`,
      format: 'es',
      indent: false,
    },
    {
      file: `${packagesDir}/${packageName}/lib/index.js`,
      format: 'cjs',
      indent: false,
    },
  ];
}

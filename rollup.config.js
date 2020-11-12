import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const extensions = ['.ts'];
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];
const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  ''
);

export default () => {
  console.log('version ' + pkg.version);

  return [
    // ES
    {
      input: 'src/index.ts',
      output: {
        file: 'es/redux-agg.js',
        format: 'es',
        indent: false,
      },
      external,
      plugins: [
        typescript({ useTsconfigDeclarationDir: true }),
        resolve({ extensions }),
        babel({
          extensions,
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              { version: babelRuntimeVersion, useESModules: true },
            ],
          ],
          babelHelpers: 'runtime',
        }),
      ],
    },
    {
      input: 'src/index.ts',
      output: {
        file: 'lib/redux-agg.js',
        format: 'cjs',
        indent: false,
      },
      external,
      plugins: [
        typescript({ useTsconfigDeclarationDir: true }),
        resolve({ extensions }),
        babel({
          extensions,
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              { version: babelRuntimeVersion, useESModules: true },
            ],
          ],
          babelHelpers: 'runtime',
        }),
      ],
    },
  ];
};

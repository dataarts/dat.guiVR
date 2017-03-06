import builtins from 'rollup-plugin-node-builtins';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'modules/datguivr/index.js',
  format: 'umd',
  exports: 'default',
  moduleName: 'datGUIVR',
  sourceMap: 'inline',

  targets: [
    { dest: 'build/datguivr.js', format: 'umd' },
    { dest: 'build/datguivr.module.js', format: 'es' }
  ],

  plugins: [
    builtins(),
    babel({
      presets: ['es2015-rollup'],
      exclude: 'node_modules/**'
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: ['node_modules/**'],
      exclude: ['node_modules/three']
    })
  ]
};
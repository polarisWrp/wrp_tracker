import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: './src/core/index.ts',
    output: [
      {
        file: path.resolve(
          __dirname,
          './dist/index.esm.js'
        ),
        format: 'es', // es (import export)
      },
      {
        file: path.resolve(
          __dirname,
          './dist/index.cjs.js'
        ),
        format: 'cjs', // cjs (require exports)
      },
      {
        file: path.resolve(
          __dirname,
          './dist/index.js'
        ),
        format: 'umd',
        name: 'tracker', // umd (AMD CMD global)
      },
    ],
    plugins: [
      ts(), //默认读取tsconfig配置
    ],
  },
  {
    input: './src/core/index.ts',
    output: {
      file: path.resolve(
        __dirname,
        './dist/index.d.ts'
      ),
      format: 'es',
    },
    plugins: [dts()],
  },
]
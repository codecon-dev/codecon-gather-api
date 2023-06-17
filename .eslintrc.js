module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  env: {
    node: true,
    jest: true
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: ['standard'],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-new': 0,
    '@typescript-eslint/no-var-requires': 0
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ],
  settings: {
    jsdoc: { mode: 'typescript' }
  }
}

module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['react-hooks'],
  rules: {
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  ignorePatterns: [
    'node_modules',
    'lib/prisma-client/**',  // Ignore all Prisma client generated files
    '.next',
    'out',
    'coverage',
    'public'
  ]
}

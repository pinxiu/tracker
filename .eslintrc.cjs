module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: { jsx: true },
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      },
    },
  ],
};

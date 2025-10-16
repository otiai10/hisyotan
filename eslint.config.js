import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

const importOrderRule = [
  'warn',
  {
    alphabetize: { order: 'asc', caseInsensitive: true },
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
    'newlines-between': 'always'
  }
];

export default tseslint.config(
  {
    ignores: ['desktop/dist/**', 'node_modules/**']
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'import/order': importOrderRule
    },
    plugins: {
      import: importPlugin
    }
  },
  {
    files: ['desktop/main/**/*.ts', 'desktop/preload/**/*.ts', 'electron.vite.config.ts'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly'
      }
    }
  },
  {
    files: ['desktop/renderer/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/no-autofocus': 'warn'
    }
  }
);

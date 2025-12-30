import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import nextPlugin from '@next/eslint-plugin-next'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default [
  js.configs.recommended,
  ...compat.extends('next'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      // Disable specific problematic rules
      '@next/next/no-html-link-for-pages': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      // Add any other rules causing issues
    },
  },
]
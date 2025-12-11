import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/devtools',
  ],

  // Force transpilation of the local module so imports work correctly
  build: {
    transpile: ['../src/module']
  },

  devtools: { enabled: true }
})
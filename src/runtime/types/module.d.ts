declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    graphs: {
      defaultHeight: number
    }
  }
}
// Ensure this file is treated as a module
export { }
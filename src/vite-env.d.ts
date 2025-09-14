/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GALLERY_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

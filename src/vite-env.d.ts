/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "hash" switches wouter to hash routing (single-file previews) */
  readonly VITE_ROUTER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

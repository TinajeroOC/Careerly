declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

export {}

// ... mantenha tudo igual até o <body>
import { createBrowserSupabaseClient } from '@/lib/supabase'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#f8fafc] text-slate-950`}>
        {children}
      </body>
    </html>
  )
}
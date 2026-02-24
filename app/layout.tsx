import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { createClient } from '@/lib/supabase';
import Navbar from '@/components/Navbar'; // vamos criar agora

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LicitaNorte | Alertas Inteligentes de Licitações do Norte",
  description: "Receba só as licitações do Amazonas e Norte com resumo por IA. Dados 100% oficiais do PNCP.",
  keywords: ["licitações Amazonas", "alertas licitação Manaus", "PNCP AM"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#f8fafc] text-slate-950`}>
        <Navbar session={session} />
        {children}
      </body>
    </html>
  );
}
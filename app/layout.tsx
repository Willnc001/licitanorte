import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LicitaNorte | Alertas Inteligentes de Licitações do Norte",
  description: "Receba só as licitações do Amazonas e Norte com resumo por IA. Dados 100% oficiais do PNCP. Grátis para começar.",
  keywords: ["licitações Amazonas", "alertas licitação Manaus", "PNCP AM", "licitações Norte", "pregão Manaus"],
  authors: [{ name: "LicitaNorte" }],
  openGraph: {
    title: "LicitaNorte - Licitações do Norte com Inteligência",
    description: "A plataforma mais inteligente para não perder nenhuma oportunidade no Norte.",
    images: [{ url: "https://licitanorte-willnc001.vercel.app/og-image.jpg" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#f8fafc] text-slate-950`}>
        {children}
      </body>
    </html>
  );
}
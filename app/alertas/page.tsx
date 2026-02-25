// app/page.tsx
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createBrowserClientSupabase } from '@/lib/supabase-client';
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { createClient } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'LicitaNorte | A Vantagem Competitiva no Norte',
  description: 'Inteligência e alertas automatizados para licitações no Amazonas e Região Norte.',
  keywords: ['licitações amazonas', 'pregão manaus', 'alertas licitação norte', 'b2b governo'],
};

async function getRecentLicitacoes() {
  try {
    const res = await fetch(
      "https://pncp.gov.br/api/consulta/v1/contratacoes?uf=AM&pagina=1&tamanhoPagina=6&ordenarPor=dataPublicacao&ordenacao=desc",
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error('Falha na API');
    const data = await res.json();
    return data.itens || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const licitacoes = await getRecentLicitacoes();
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-[#15803d] selection:text-white flex flex-col">
      <Navbar session={session} />

      <main className="flex-1">
        {/* Hero Section Premium (Estilo Linear/Vercel) */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          {/* Efeito de luz de fundo sutil */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#15803d] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-[#15803d]/20 bg-[#15803d]/5 text-[#15803d] font-medium backdrop-blur-sm text-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#15803d] mr-2 animate-pulse"></span>
              Sincronizado com PNCP em Tempo Real
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-8 leading-[1.1]">
              Vença licitações. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#15803d] to-[#22c55e]">
                Sem o trabalho manual.
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              O radar corporativo definitivo para empresas do Amazonas. Filtros de alta precisão, inteligência de dados e alertas diretos no seu WhatsApp.
            </p>

            {/* Barra de Busca Glassmorphism */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#15803d]/20 to-[#22c55e]/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col sm:flex-row gap-2 p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                  <Input 
                    placeholder="Busque por 'Medicamentos', 'Asfalto' ou 'Manaus'..." 
                    className="h-14 pl-12 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                  />
                </div>
                <Button size="lg" className="h-14 px-8 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-base font-semibold shadow-md transition-all hover:scale-[1.02]">
                  Explorar Editais
                </Button>
              </div>
            </div>
            
            <div className="mt-14 flex items-center justify-center gap-8 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 100% Legal</span>
              <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Alertas Rápidos</span>
              <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Foco no Norte</span>
            </div>
          </div>
        </section>

        {/* Live Opportunities Section */}
        <section className="py-24 bg-white border-t border-slate-100 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Radar em Tempo Real</h2>
                <p className="text-slate-500 mt-2 text-lg">Últimas oportunidades mapeadas no Amazonas.</p>
              </div>
              <Button variant="ghost" className="text-[#15803d] hover:text-[#166534] hover:bg-[#15803d]/5 group" asChild>
                <Link href="/buscar">
                  Ver todas as oportunidades 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {licitacoes.length > 0 ? (
                licitacoes.map((lic: any) => (
                  <Card key={lic.id} className="group bg-white border border-slate-200 hover:border-[#15803d]/40 shadow-sm hover:shadow-xl hover:shadow-[#15803d]/5 transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 rounded-md px-2.5 py-0.5 text-xs font-semibold">
                          {lic.modalidade || "Pregão"}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium font-mono">
                          {new Date(lic.dataPublicacao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2 mb-2 group-hover:text-[#15803d] transition-colors">
                        {lic.objeto}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-1 mb-6 flex-grow" title={lic.orgaoNome}>
                        {lic.orgaoNome}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Valor Estimado</span>
                          <span className="font-bold text-[#15803d] text-xl">
                            R$ {Number(lic.valorEstimado || 0).toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="h-10 w-10 rounded-full border-2 border-[#15803d] border-t-transparent animate-spin mb-4" />
                  <p className="text-slate-600 font-medium">Buscando editais oficiais...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
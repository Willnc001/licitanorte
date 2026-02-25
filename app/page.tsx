import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, ShieldCheck, Target, Zap, TrendingUp, Briefcase } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { createClient } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'LicitaNorte | Inteligência em Licitações',
  description: 'A vantagem competitiva para empresas que vendem para o Governo no Norte do Brasil.',
};

async function getRecentLicitacoes() {
  try {
    const res = await fetch(
      "https://pncp.gov.br/api/consulta/v1/contratacoes?uf=AM&pagina=1&tamanhoPagina=6&ordenarPor=dataPublicacao&ordenacao=desc",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.itens || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const licitacoes = await getRecentLicitacoes();
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#15803d] selection:text-white relative">
      <Navbar session={session} />

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-28 overflow-hidden">
          {/* Luz de fundo (Glow Effect) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#15803d] opacity-[0.04] blur-[100px] rounded-full pointer-events-none -z-10" />
          
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center rounded-full border border-[#15803d]/20 bg-[#15803d]/5 px-3 py-1 text-sm font-medium text-[#15803d] mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#15803d] mr-2 animate-pulse"></span>
              Sincronização PNCP Ativa
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-8 leading-[1.05]">
              Venda para o Governo. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#15803d] to-[#22c55e]">
                Sem o trabalho manual.
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              O radar corporativo de editais focado no Amazonas. Filtros de precisão, resumos inteligentes e alertas direto no seu WhatsApp.
            </p>

            {/* Barra de Busca Flutuante (Glassmorphism) */}
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#15803d]/30 to-[#22c55e]/30 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative flex flex-col md:flex-row gap-2 p-2 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl shadow-slate-200/50">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                  <Input 
                    placeholder="Busque por 'Medicamentos', 'Asfalto' ou 'Manaus'..." 
                    className="h-14 pl-12 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 font-medium text-slate-900"
                  />
                </div>
                <div className="h-14 w-[1px] bg-slate-200 hidden md:block my-auto" />
                <Button size="lg" className="h-14 md:px-10 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-base font-bold shadow-lg transition-transform hover:scale-[1.02] w-full md:w-auto">
                  Rastrear Oportunidades
                </Button>
              </div>
            </div>

            {/* Trust Bar Minimalista */}
            <div className="mt-20 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto">
              <p className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">A vantagem competitiva baseada em dados oficiais</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-slate-500">
                <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-5 w-5 text-[#15803d]" /> 100% Homologado</div>
                <div className="flex items-center gap-2 font-medium"><Zap className="h-5 w-5 text-[#15803d]" /> Alertas em Tempo Real</div>
                <div className="flex items-center gap-2 font-medium"><Target className="h-5 w-5 text-[#15803d]" /> Filtros por CNAE</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- OPORTUNIDADES SECTION (Estilo Dashboard) --- */}
        <section className="py-24 bg-white border-t border-slate-200/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-[#15803d]" />
                  Radar Aberto
                </h2>
                <p className="text-slate-500 mt-2 text-lg">Últimas licitações publicadas no portal do Amazonas hoje.</p>
              </div>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:text-[#15803d] hover:bg-slate-50 font-semibold group h-12 px-6 rounded-xl" asChild>
                <Link href="/buscar">
                  Acessar Banco Completo 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {licitacoes.length > 0 ? (
                licitacoes.map((lic: any) => (
                  <Card key={lic.id} className="group bg-white border border-slate-200 hover:border-[#15803d]/40 shadow-sm hover:shadow-xl hover:shadow-[#15803d]/5 transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full hover-float">
                    <CardContent className="p-6 flex flex-col h-full relative">
                      {/* Canto verde sutil no hover */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#15803d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-2xl" />
                      
                      <div className="flex justify-between items-start mb-5 relative z-10">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-0 rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wide">
                          {lic.modalidade || "Pregão"}
                        </Badge>
                        <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          {new Date(lic.dataPublicacao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      
                      <h3 className="font-extrabold text-lg text-slate-900 leading-snug line-clamp-2 mb-3 group-hover:text-[#15803d] transition-colors relative z-10">
                        {lic.objeto}
                      </h3>
                      
                      <p className="text-sm text-slate-500 line-clamp-1 mb-8 flex-grow font-medium" title={lic.orgaoNome}>
                        {lic.orgaoNome}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 relative z-10">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Valor Estimado</span>
                          <span className="font-black text-[#15803d] text-xl tracking-tight">
                            R$ {Number(lic.valorEstimado || 0).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#15803d] transition-colors">
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <div className="h-10 w-10 rounded-full border-2 border-[#15803d] border-t-transparent animate-spin mb-4" />
                  <p className="text-slate-600 font-medium">Sincronizando editais na nuvem...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="bg-slate-900 py-24 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">O mercado não espera.</h3>
            <p className="text-xl text-slate-400 mb-10 font-medium">Configurar seu radar leva menos de 2 minutos. Receba as primeiras licitações da sua área amanhã de manhã.</p>
            <Button size="lg" className="h-16 px-12 bg-[#15803d] hover:bg-[#166534] text-lg font-bold rounded-xl shadow-[0_0_40px_-10px_rgba(21,128,61,0.5)] transition-all hover:scale-105">
              Configurar Radar Gratuito
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
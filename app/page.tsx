import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Users, Award } from "lucide-react";
import Link from "next/link";

async function getRecentLicitacoes() {
  try {
    const res = await fetch(
      "https://pncp.gov.br/api/consulta/v1/contratacoes?uf=AM&pagina=1&tamanhoPagina=6&ordenarPor=dataPublicacao&ordenacao=desc",
      { next: { revalidate: 3600 } } // atualiza a cada hora
    );
    const data = await res.json();
    return data.itens || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const licitacoes = await getRecentLicitacoes();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#15803d] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">LN</span>
            </div>
            <span className="font-semibold text-2xl tracking-tight">LicitaNorte</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/buscar" className="hover:text-[#15803d]">Buscar</Link>
            <Link href="/alertas" className="hover:text-[#15803d]">Meus Alertas</Link>
            <Link href="/precos" className="hover:text-[#15803d]">Preços</Link>
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#15803d] via-[#166534] to-[#052e16] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Dados 100% oficiais • PNCP</Badge>
          <h1 className="text-6xl font-bold tracking-tighter mb-6">
            Licitações do Norte.<br />
            Com a inteligência que você merece.
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Alertas por WhatsApp + resumo por IA + histórico de preços.  
            Só as oportunidades que combinam com sua empresa.
          </p>

          <div className="max-w-xl mx-auto">
            <div className="flex gap-3">
              <Input 
                placeholder="Ex: computador, ambulância, asfalto..." 
                className="h-14 text-lg bg-white text-slate-950 placeholder:text-slate-500"
              />
              <Button size="lg" className="h-14 px-10 bg-white text-[#15803d] hover:bg-white/90">
                <Search className="mr-2 h-5 w-5" /> Buscar agora
              </Button>
            </div>
            <p className="text-xs text-white/70 mt-3">Ex: Manaus • Prefeitura • até R$ 500 mil</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-b py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#15803d]">R$ 187M</div>
            <p className="text-sm text-slate-500">em licitações no Norte este mês</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#15803d]">+4.200</div>
            <p className="text-sm text-slate-500">empresas cadastradas</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#15803d]">98%</div>
            <p className="text-sm text-slate-500">de retenção dos usuários Pro</p>
          </div>
        </div>
      </div>

      {/* Oportunidades de hoje */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Oportunidades de hoje no Amazonas</h2>
            <p className="text-slate-600">Atualizado automaticamente • Dados PNCP</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/buscar">Ver todas →</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licitacoes.length > 0 ? (
            licitacoes.map((lic: any) => (
              <Card key={lic.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary">{lic.modalidade || "Pregão"}</Badge>
                    <span className="text-xs text-slate-500">
                      {new Date(lic.dataPublicacao).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg group-hover:text-[#15803d]">
                    {lic.objeto}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{lic.orgaoNome}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#15803d]">
                      R$ {Number(lic.valorEstimado || 0).toLocaleString("pt-BR")}
                    </span>
                    <Button variant="ghost" size="sm">Ver edital →</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-3 text-center py-12 text-slate-500">Carregando oportunidades...</p>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-slate-950 py-20 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="text-4xl font-bold mb-6">Comece grátis hoje</h3>
          <p className="text-xl text-slate-400 mb-10">Cadastre-se em 30 segundos. Receba suas primeiras licitações amanhã.</p>
          <Button size="lg" className="bg-[#15803d] hover:bg-[#166534] text-lg px-12 py-7 rounded-full">
            Criar conta gratuita
          </Button>
        </div>
      </section>
    </div>
  );
}
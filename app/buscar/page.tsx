'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Filter } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';

export default function BuscarPage() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const realizarBusca = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    try {
      // Endpoint direto da API governamental filtrado por AM e palavra-chave
      const url = `https://pncp.gov.br/api/consulta/v1/contratacoes?uf=AM&tamanhoPagina=15&pagina=1&palavraChave=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      setResultados(data.itens || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar session={null} /> {/* Numa versão final, passe a sessão gerida por um Provider */}
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Mecanismo de Pesquisa</h1>
          <p className="text-slate-500 mt-2 text-lg">Vasculhe os editais públicos do Amazonas em tempo real.</p>
        </div>

        <form onSubmit={realizarBusca} className="relative max-w-3xl mx-auto mb-12 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o objeto (ex: notebook, ambulância, limpeza)..." 
              className="h-14 pl-12 text-lg border-slate-200 shadow-sm focus:border-[#15803d] focus:ring-[#15803d]"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-14 px-8 bg-[#15803d] hover:bg-[#166534] text-white">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Pesquisar'}
          </Button>
        </form>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultados.map((lic) => (
            <Card key={lic.id} className="bg-white border-slate-200 hover:shadow-lg transition-shadow rounded-xl flex flex-col">
              <CardContent className="p-6 flex flex-col h-full">
                <Badge className="w-fit mb-3 bg-slate-100 text-slate-700 hover:bg-slate-200">{lic.modalidade || "Pregão"}</Badge>
                <h3 className="font-bold text-slate-900 leading-tight mb-2">{lic.objeto}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">{lic.orgaoNome}</p>
                <div className="flex justify-between items-end border-t pt-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Valor Estimado</span>
                    <span className="font-bold text-[#15803d] text-lg">R$ {Number(lic.valorEstimado || 0).toLocaleString("pt-BR")}</span>
                  </div>
                  <a href={`https://pncp.gov.br/app/editais/${lic.id}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#15803d] hover:underline">
                    Ver Edital
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
          {resultados.length === 0 && !loading && query && (
             <p className="col-span-full text-center text-slate-500 py-10">Nenhum edital encontrado para estes termos no Amazonas.</p>
          )}
        </div>
      </main>
    </div>
  );
}
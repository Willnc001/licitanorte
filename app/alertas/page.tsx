'use client';

import { useEffect, useState } from 'react';
import { createBrowserClientSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function AlertasPage() {
  const supabase = createBrowserClientSupabase();
  const [alertas, setAlertas] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [keywords, setKeywords] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return redirect('/login');

    const { data } = await supabase
      .from('alertas')
      .select('*')
      .order('created_at', { ascending: false });

    setAlertas(data || []);
  };

  const criarAlerta = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from('alertas').insert({
      user_id: session.user.id,
      nome,
      keywords,
      valor_min: valorMin ? Number(valorMin) : 0,
    });

    setNome('');
    setKeywords('');
    setValorMin('');
    fetchAlertas();
    setLoading(false);
  };

  const deletarAlerta = async (id: string) => {
    await supabase.from('alertas').delete().eq('id', id);
    fetchAlertas();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Meus Alertas</h1>
          <p className="text-slate-600">Crie filtros inteligentes e receba no WhatsApp/email</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Formulário */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Novo Alerta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={criarAlerta} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Nome do alerta</label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Computadores Manaus" required />
              </div>
              <div>
                <label className="text-sm font-medium">Palavras-chave</label>
                <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="computador, notebook, desktop" required />
              </div>
              <div>
                <label className="text-sm font-medium">Valor mínimo (R$)</label>
                <Input type="number" value={valorMin} onChange={(e) => setValorMin(e.target.value)} placeholder="50000" />
              </div>

              <Button type="submit" className="w-full h-12 bg-[#15803d]" disabled={loading}>
                <Plus className="mr-2 h-5 w-5" /> Criar alerta
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de alertas */}
        <div className="lg:col-span-3 space-y-6">
          {alertas.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-slate-500">Nenhum alerta criado ainda.</CardContent></Card>
          ) : (
            alertas.map((alerta) => (
              <Card key={alerta.id}>
                <CardHeader className="flex-row items-start justify-between">
                  <div>
                    <CardTitle>{alerta.nome}</CardTitle>
                    <Badge variant="secondary" className="mt-2">{alerta.uf}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deletarAlerta(alerta.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Palavras: <span className="font-medium">{alerta.keywords}</span></p>
                  {alerta.valor_min > 0 && (
                    <p className="text-sm text-slate-600">Acima de R$ {alerta.valor_min.toLocaleString('pt-BR')}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
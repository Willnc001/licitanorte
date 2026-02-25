import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BellRing, Target } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Buscar contagem de alertas
  const { count } = await supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar session={session} />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
          <p className="text-slate-500">Bem-vindo de volta, {session.user.email}</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Rastreadores Ativos</CardTitle>
              <BellRing className="h-4 w-4 text-[#15803d]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{count || 0}</div>
              <p className="text-xs text-slate-400 mt-1">Filtros configurados no radar</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Oportunidades do Mês</CardTitle>
              <Target className="h-4 w-4 text-[#15803d]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">--</div>
              <p className="text-xs text-slate-400 mt-1">Enviadas para o seu e-mail</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Status da Inteligência</CardTitle>
              <Activity className="h-4 w-4 text-[#15803d]" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-[#15803d]">Monitorização Ativa</div>
              <p className="text-xs text-slate-400 mt-1">Sincronizado há 10 min</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
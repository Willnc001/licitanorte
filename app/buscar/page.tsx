import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function BuscarPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold">Buscar Licitações</h1>
      <p className="text-xl text-slate-600 mt-4">Em breve com filtros avançados e IA.</p>
    </div>
  );
}
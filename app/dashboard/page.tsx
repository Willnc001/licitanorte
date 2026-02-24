import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo, {session.user.email}!</h1>
      <p className="text-xl text-slate-600">Aqui você vai criar alertas inteligentes em breve.</p>
      <div className="mt-12 p-8 border rounded-3xl bg-white">
        <p className="text-sm text-slate-500">Próximo passo: página de Meus Alertas (já vamos fazer).</p>
      </div>
    </div>
  );
}
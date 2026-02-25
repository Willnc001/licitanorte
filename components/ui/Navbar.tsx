'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createBrowserClientSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';

export default function Navbar({ session }: { session: any }) {
  const supabase = createBrowserClientSupabase();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">LN</span>
          </div>
          <span className="font-bold text-3xl tracking-tighter">Licita<span className="text-emerald-600">Norte</span></span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link href="/buscar" className="hover:text-emerald-600 transition-colors">Buscar Editais</Link>
          <Link href="/alertas" className="hover:text-emerald-600 transition-colors">Meus Alertas</Link>
          <Link href="/precos" className="hover:text-emerald-600 transition-colors">Planos</Link>

          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-emerald-600">
                <User className="h-4 w-4" /> Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            </div>
          ) : (
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createBrowserClientSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, LogOut, Radar } from 'lucide-react';

export default function Navbar({ session }: { session: any }) {
  const supabase = createBrowserClientSupabase();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-[#15803d] to-[#166534] rounded-xl flex items-center justify-center shadow-md shadow-[#15803d]/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl leading-none">LN</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">Licita<span className="text-[#15803d]">Norte</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/buscar" className="hover:text-[#15803d] transition-colors">Pesquisa de Editais</Link>
          <Link href="/precos" className="hover:text-[#15803d] transition-colors">Planos</Link>

          {session ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-[#15803d] transition-colors">
                <Radar className="h-4 w-4" /> Painel
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <Button variant="ghost" asChild className="font-semibold">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-[#15803d] hover:bg-[#166534] text-white shadow-md">
                <Link href="/login">Começar Grátis</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createBrowserClientSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';

export default function Navbar({ session }: { session: any }) {
  const supabase = createBrowserClientSupabase();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
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

          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-[#15803d]">
                <User className="h-4 w-4" /> Dashboard
              </Link>
              <Button variant="outline" onClick={handleSignOut}>Sair</Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
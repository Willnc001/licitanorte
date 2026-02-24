'use client';

import { useState } from 'react';
import { createBrowserClientSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createBrowserClientSupabase();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Link mágico enviado! Verifique seu e-mail (e spam).' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
      <Card className="w-full max-w-md glass shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#15803d] rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-3xl">LN</span>
          </div>
          <CardTitle className="text-3xl">Bem-vindo ao LicitaNorte</CardTitle>
          <CardDescription>Receba alertas de licitações do Norte por e-mail/WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMagicLink} className="space-y-6">
            <div>
              <label className="text-sm font-medium">Seu e-mail</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-[#15803d] hover:bg-[#166534]" disabled={loading}>
              {loading ? 'Enviando link mágico...' : 'Entrar com e-mail (sem senha)'}
            </Button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <p className="text-center text-xs text-slate-500 mt-8">
            Ao entrar você concorda com nossos <Link href="/termos" className="underline">Termos</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
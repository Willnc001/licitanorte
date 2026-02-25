// app/api/cron/route.ts
import { createClient } from '@/lib/supabase';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const supabase = createClient();

    // 1. Busca todos os alertas ativos
    const { data: alertas, error: alertasError } = await supabase
      .from('alertas')
      .select('*')
      .eq('ativo', true);

    if (alertasError || !alertas || alertas.length === 0) {
      return NextResponse.json({ message: 'Nenhum alerta ativo encontrado' });
    }

    const hoje = new Date().toISOString().split('T')[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // 2. Busca PNCP com timeout para evitar travamento da Vercel
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const url = `https://pncp.gov.br/api/consulta/v1/contratacoes?uf=AM&tamanhoPagina=100&dataInicio=${ontem}&dataFim=${hoje}`;
    const pncpRes = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeoutId);
    
    const pncpData = await pncpRes.json();
    const novasLicitacoes = pncpData.itens || [];

    if (novasLicitacoes.length === 0) return NextResponse.json({ message: 'Sem licitações novas' });

    // 3. Agrupa alertas por usuário para evitar envio de múltiplos emails para a mesma pessoa
    const alertasPorUsuario = alertas.reduce((acc: any, alerta: any) => {
      if (!acc[alerta.user_id]) acc[alerta.user_id] = [];
      acc[alerta.user_id].push(alerta);
      return acc;
    }, {});

    const enviosPromise = Object.keys(alertasPorUsuario).map(async (userId) => {
      const userAlertas = alertasPorUsuario[userId];
      let matchesDoUsuario: any[] = [];

      userAlertas.forEach((alerta: any) => {
        const matches = novasLicitacoes.filter((lic: any) => {
          const objeto = (lic.objeto || '').toLowerCase();
          const keywords = alerta.keywords.toLowerCase().split(',').map((k: string) => k.trim());
          return keywords.some((kw: string) => objeto.includes(kw)) &&
                 (!alerta.valor_min || Number(lic.valorEstimado || 0) >= alerta.valor_min);
        });
        matchesDoUsuario = [...matchesDoUsuario, ...matches];
      });

      // Remove duplicatas caso 2 alertas encontrem a mesma licitação
      matchesDoUsuario = Array.from(new Set(matchesDoUsuario.map(m => m.id)))
        .map(id => matchesDoUsuario.find(m => m.id === id));

      if (matchesDoUsuario.length > 0) {
        // Busca o email apenas se houver match
        const { data: userData } = await supabase.auth.admin.getUserById(userId);
        const emailUser = userData.user?.email;

        if (emailUser) {
          return resend.emails.send({
            from: 'LicitaNorte <alertas@resend.dev>', // Atualize quando tiver o domínio próprio
            to: emailUser,
            subject: `🚨 ${matchesDoUsuario.length} nova(s) licitação(ões) encontrada(s)`,
            html: `
              <h2>Encontramos oportunidades no Norte para você:</h2>
              ${matchesDoUsuario.map((m: any) => `
                <div style="margin: 15px 0; padding: 15px; border-left: 4px solid #15803d; background:#f8fafc;">
                  <strong>${m.objeto}</strong><br>
                  <small>${m.orgaoNome} • R$ ${Number(m.valorEstimado || 0).toLocaleString('pt-BR')}</small><br>
                  <a href="https://pncp.gov.br/app/editais/${m.id}" target="_blank" style="color:#15803d">Ver Edital Oficial →</a>
                </div>
              `).join('')}
            `
          });
        }
      }
      return null;
    });

    // 4. Executa todos os disparos em paralelo
    const resultados = await Promise.all(enviosPromise);
    const emailsEnviados = resultados.filter(r => r !== null).length;

    return NextResponse.json({ 
      success: true, 
      usuarios_processados: Object.keys(alertasPorUsuario).length, 
      emails_enviados: emailsEnviados 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
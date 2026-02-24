import { createClient } from '@/lib/supabase';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const supabase = createClient();

    // Busca todos os alertas ativos
    const { data: alertas } = await supabase
      .from('alertas')
      .select('*')
      .eq('ativo', true);

    if (!alertas || alertas.length === 0) {
      return NextResponse.json({ message: 'Nenhum alerta ativo' });
    }

    // Datas dinâmicas (ontem e hoje)
    const hoje = new Date().toISOString().split('T')[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Busca novas licitações do Amazonas (últimas 48h)
    const url = `https://pncp.gov.br/api/consulta/v1/contratacoes?uf=AM&tamanhoPagina=100&dataInicio=${ontem}&dataFim=${hoje}`;
    
    const pncpRes = await fetch(url, { cache: 'no-store' });
    const pncpData = await pncpRes.json();
    const novasLicitacoes = pncpData.itens || [];

    let enviados = 0;

    for (const alerta of alertas) {
      const matches = novasLicitacoes.filter((lic: any) => {
        const objeto = (lic.objeto || '').toLowerCase();
        const keywords = alerta.keywords.toLowerCase().split(',').map((k: string) => k.trim());
        return keywords.some((kw: string) => objeto.includes(kw)) &&
               (!alerta.valor_min || Number(lic.valorEstimado || 0) >= alerta.valor_min);
      });

      if (matches.length > 0) {
        const { data: userData } = await supabase.auth.admin.getUserById(alerta.user_id);
        const emailUser = userData.user?.email;

        if (emailUser) {
          await resend.emails.send({
            from: 'LicitaNorte <alertas@resend.dev>',
            to: emailUser,
            subject: `🚨 ${matches.length} nova(s) licitação(ões) - ${alerta.nome}`,
            html: `
              <h2>Olá! Encontramos oportunidades para você no Norte:</h2>
              ${matches.map((m: any) => `
                <div style="margin: 15px 0; padding: 15px; border-left: 4px solid #15803d; background:#f8fafc;">
                  <strong>${m.objeto}</strong><br>
                  <small>${m.orgaoNome} • R$ ${Number(m.valorEstimado || 0).toLocaleString('pt-BR')}</small><br>
                  <a href="https://pncp.gov.br/app/editais/${m.id}" target="_blank" style="color:#15803d">Ver Edital Oficial →</a>
                </div>
              `).join('')}
              <p style="margin-top:20px">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/alertas">Gerenciar meus alertas</a>
              </p>
            `
          });
          enviados++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      alertas_processados: alertas.length, 
      emails_enviados: enviados 
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
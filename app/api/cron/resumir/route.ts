import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { editalTexto } = await req.json();

    if (!editalTexto) {
      return NextResponse.json({ error: 'Texto do edital não fornecido' }, { status: 400 });
    }

    // AQUI ENTRA A SUA CHAVE DE API DA OPENAI OU GROQ (Exemplo com Groq)
    const apiKey = process.env.GROQ_API_KEY; 
    
    if(!apiKey) {
      // Mock para desenvolvimento até adicionar a chave
      return NextResponse.json({ 
        resumo: "Resumo gerado por IA (Modo Demo): Este edital visa a aquisição de bens. O prazo de entrega é de 30 dias e a documentação requerida inclui atestados de capacidade técnica e balanço patrimonial. O grau de adequação para a sua empresa aparenta ser elevado." 
      });
    }

    // Integração real futura:
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "És um consultor de licitações especialista em legislação do Brasil. Resume o edital focando apenas no objeto, prazos, exigências críticas (atestados) e valor." },
          { role: "user", content: `Resume este edital: ${editalTexto.substring(0, 5000)}` }
        ]
      })
    });

    const data = await response.json();
    return NextResponse.json({ resumo: data.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar IA' }, { status: 500 });
  }
}
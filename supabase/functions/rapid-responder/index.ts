import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface RequestBody {
  theme: string;
  ageGroup: 'geral' | 'adultos';
  style: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { theme, ageGroup, style } = await req.json() as RequestBody;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY não configurada");
      throw new Error("Configuração do servidor incompleta");
    }

    console.log(`Gerando conto: tema=${theme}, faixa=${ageGroup}, estilo=${style}`);

    // Build the prompt based on theme and age group
    const isAdult = ageGroup === 'adultos';
    const themeLabels: Record<string, string> = {
      romance: 'Romance',
      suspense: 'Suspense',
      fantasia: 'Fantasia',
      drama: 'Drama',
      aventura: 'Aventura',
      misterio: 'Mistério',
      'ficcao-cientifica': 'Ficção Científica',
      historico: 'Histórico',
      erotico: 'Erótico',
      'romance-adulto': 'Romance Adulto',
    };
    
    const themeLabel = themeLabels[theme] || theme;
    
    const systemPrompt = `És um escritor talentoso de contos em Português de Portugal (PT-PT). 
Escreves histórias envolventes, bem estruturadas e emocionalmente cativantes.
Usa vocabulário e expressões próprias de Portugal, evitando totalmente brasileirismos.
Os teus contos têm sempre um início intrigante, desenvolvimento envolvente e um final satisfatório.`;

    const userPrompt = isAdult 
      ? `Escreve um conto curto de ${themeLabel} para adultos, com cerca de 500 palavras.
O conto deve ser sensual e sofisticado, adequado para leitores maduros.
Inclui descrições ricas e emoções intensas. Não uses linguagem vulgar.
Começa diretamente com a história, sem título.`
      : `Escreve um conto curto de ${themeLabel} com cerca de 500 palavras.
O conto deve ser cativante e adequado para todos os públicos.
Inclui descrições vívidas, personagens interessantes e uma narrativa fluida.
Começa diretamente com a história, sem título.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da AI Gateway:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Limite de pedidos atingido. Tente novamente em alguns minutos." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Créditos esgotados. Por favor, adicione créditos à sua conta." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("Erro ao gerar o conto");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Resposta sem conteúdo:", data);
      throw new Error("Resposta inválida da API");
    }

    // Count words in the generated content
    const wordCount = content.trim().split(/\s+/).length;
    const storyId = crypto.randomUUID();

    console.log(`Conto gerado com sucesso: ${wordCount} palavras`);

    return new Response(JSON.stringify({
      success: true,
      story: {
        id: storyId,
        content: content.trim(),
        word_count: wordCount,
        created_at: new Date().toISOString(),
      },
      usage: {
        remaining: 99, // Placeholder - could be tracked in database
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro na Edge Function rapid-responder:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao gerar o conto",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

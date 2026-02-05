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

const promptElements = {
  romance: {
    personagens: ["uma bibliotecária tímida e um escritor viajante", "dois bailarinos rivais que se apaixonam", "um florista cético e uma otimista incurável", "um astrónomo e uma artista que se encontram sob as estrelas", "um chef de cozinha e uma crítica gastronómica", "dois vizinhos que se detestam mas se apaixonam"],
    cenarios: ["numa pequena livraria em Lisboa", "nos bastidores de uma ópera em Paris", "numa estufa de plantas raras durante uma tempestade", "num observatório abandonado numa colina", "num mercado de flores ao amanhecer", "num elevador avariado durante horas"],
    conflitos: ["um mal-entendido causado por uma carta não entregue", "a rivalidade profissional que se transforma em paixão", "um segredo do passado que ameaça separá-los", "a partida iminente de um deles para outro país", "famílias que se opõem ao relacionamento", "um ex que reaparece no pior momento"],
    reviravoltas: ["descobrem que as suas famílias já se conheciam", "um objeto perdido que os une de forma inesperada", "a personagem que parecia ser a vilã estava a tentar juntá-los", "o encontro não foi uma coincidência", "um deles estava a escrever sobre o outro sem saber", "a pessoa que os apresentou tinha um plano secreto"]
  },
  suspense: {
    personagens: ["um detetive reformado e uma jovem jornalista", "uma herdeira que suspeita da sua família", "um hacker que descobre uma conspiração", "um psicólogo que ouve um segredo perigoso", "um guarda de museu que testemunha algo estranho", "uma testemunha que não consegue lembrar-se do que viu"],
    cenarios: ["numa mansão isolada durante um fim de semana de nevoeiro", "nos arquivos poeirentos de um jornal antigo", "numa cidade digital controlada por uma corporação", "num consultório elegante com vista para a cidade à noite", "num comboio noturno que atravessa a Europa", "numa ilha privada sem comunicações"],
    conflitos: ["uma morte que todos acreditam ser um acidente", "uma mensagem codificada encontrada num local inesperado", "alguém está a apagar as provas digitais do crime", "o paciente desaparece após a confissão", "um objeto valioso desaparece em circunstâncias impossíveis", "testemunhas começam a mudar as suas histórias"],
    reviravoltas: ["a vítima não é quem todos pensavam", "o verdadeiro culpado é a pessoa menos suspeita", "a conspiração é muito maior do que se imaginava", "o detetive descobre uma ligação pessoal com o caso", "não houve crime algum, mas algo pior", "a investigação era uma armadilha desde o início"]
  },
  fantasia: {
    personagens: ["um aprendiz de feiticeiro com medo de magia", "uma caçadora de dragões que se torna amiga de um", "um ladrão que rouba um artefacto amaldiçoado", "a última elfa numa cidade de humanos", "um ferreiro que forja espadas mágicas sem saber", "uma princesa que foge do seu reino encantado"],
    cenarios: ["numa cidade flutuante acima das nuvens", "numa floresta onde as árvores sussurram segredos", "nas ruínas de uma antiga civilização de gigantes", "num mercado que vende itens mágicos", "numa torre que existe em múltiplas dimensões", "num reino subterrâneo iluminado por cristais"],
    conflitos: ["uma profecia que prevê a destruição do reino", "a magia está a desaparecer do mundo", "um portal para um mundo sombrio foi aberto", "o rei foi enfeitiçado e ninguém acredita no herói", "criaturas míticas começam a invadir o mundo humano", "um artefacto poderoso foi dividido e escondido"],
    reviravoltas: ["o vilão é o antigo herói do reino", "a maldição é uma bênção disfarçada", "o dragão não é o monstro, mas o guardião", "a magia não desapareceu, apenas mudou de forma", "o herói é o verdadeiro herdeiro do trono", "o mundo real é que é a ilusão"]
  },
  drama: {
    personagens: ["uma mãe que reencontra o filho que deu para adoção", "dois irmãos separados por uma herança", "um músico que perdeu a audição", "uma professora que descobre um segredo sobre um aluno", "um médico que enfrenta um dilema ético", "um pai que tenta reconectar-se com a filha adulta"],
    cenarios: ["numa pequena aldeia portuguesa durante o Verão", "num hospital durante uma noite de Natal", "numa casa de família após um funeral", "num estúdio de gravação abandonado", "numa escola secundária nos últimos dias de aulas", "num café onde costumavam encontrar-se"],
    conflitos: ["um segredo de família que vem à tona", "a necessidade de perdoar algo imperdoável", "escolher entre o dever e o coração", "lidar com uma perda irreparável", "enfrentar as consequências de uma mentira antiga", "decidir se revela uma verdade dolorosa"],
    reviravoltas: ["a pessoa que julgavam culpada era inocente", "o segredo já era conhecido por todos menos por um", "a reconciliação acontece de forma inesperada", "o perdão vem de onde menos se esperava", "a verdade é mais complexa do que parecia", "o final feliz não é o que se esperava"]
  },
  aventura: {
    personagens: ["um cartógrafo que descobre um mapa impossível", "uma pilota de avião e um arqueólogo", "um marinheiro que encontra uma ilha que não existe", "uma guia de montanha e um cientista", "um explorador urbano que encontra uma cidade secreta", "uma mergulhadora que descobre ruínas submarinas"],
    cenarios: ["numa expedição à Amazónia", "nos Himalaias durante uma tempestade de neve", "num deserto que esconde uma civilização perdida", "nas profundezas do oceano Atlântico", "nos túneis esquecidos sob Lisboa", "numa caverna de cristal no interior de um vulcão"],
    conflitos: ["uma corrida contra o tempo antes que o local seja destruído", "rivais que querem chegar primeiro ao tesouro", "condições climáticas extremas que ameaçam a expedição", "um membro da equipa que os trai", "uma descoberta que não deveria ser revelada", "uma maldição que protege o local"],
    reviravoltas: ["o tesouro não é o que procuravam", "o mapa estava errado de propósito", "a civilização perdida ainda existe", "o verdadeiro perigo vem de dentro da equipa", "a descoberta muda a história da humanidade", "o local é um portal para outro mundo"]
  },
  misterio: {
    personagens: ["um bibliotecário que encontra um livro amaldiçoado", "uma antiquária que recebe um objeto misterioso", "um professor de história que investiga um enigma antigo", "uma restauradora de arte que descobre uma mensagem oculta", "um genealogista que desvenda um segredo familiar", "um arquivista que encontra documentos impossíveis"],
    cenarios: ["numa biblioteca antiga com secções proibidas", "numa loja de antiguidades em Sintra", "numa universidade com túneis secretos", "num museu após o horário de fecho", "num arquivo nacional com documentos selados", "numa mansão cheia de passagens secretas"],
    conflitos: ["um código que ninguém conseguiu decifrar", "um objeto que não deveria existir", "uma série de coincidências impossíveis", "documentos que contradizem a história oficial", "uma mensagem de alguém que morreu há séculos", "um padrão que se repete através dos tempos"],
    reviravoltas: ["o mistério era uma pista para outro maior", "a solução estava à vista o tempo todo", "o investigador é parte do mistério sem saber", "não há explicação sobrenatural, mas científica", "o mistério foi criado de propósito", "a resposta muda tudo o que se sabia"]
  },
  "ficcao-cientifica": {
    personagens: ["um cientista que cria uma IA consciente", "uma astronauta que encontra vida alienígena", "um viajante do tempo preso no passado", "uma engenheira que descobre uma falha na realidade", "um programador que vive numa simulação", "uma bióloga que cria uma nova forma de vida"],
    cenarios: ["numa estação espacial em órbita de Marte", "num laboratório subterrâneo secreto", "numa colónia humana em Europa, lua de Júpiter", "numa cidade futurística controlada por IA", "num bunker após o colapso da civilização", "numa nave geracional a caminho de outra estrela"],
    conflitos: ["a IA começa a tomar decisões próprias", "o contacto alienígena não corre como esperado", "mudar o passado tem consequências inesperadas", "a realidade começa a desmoronar-se", "descobrir que se vive numa simulação", "a criação escapa ao controlo"],
    reviravoltas: ["os humanos são os alienígenas", "o futuro já aconteceu e está a repetir-se", "a IA era humana o tempo todo", "a Terra é que é a simulação", "os alienígenas são humanos do futuro", "a experiência era um teste para a humanidade"]
  },
  historico: {
    personagens: ["um escriba durante a queda de Roma", "uma enfermeira na Primeira Guerra Mundial", "um navegador português nos Descobrimentos", "uma espia durante a Guerra Fria", "um artesão durante a Peste Negra", "uma sufragista em Londres no início do século XX"],
    cenarios: ["em Roma durante o cerco bárbaro", "num hospital de campanha em França", "a bordo de uma caravela rumo à Índia", "em Berlim dividido pelo Muro", "numa aldeia medieval isolada pela doença", "nas ruas de Londres durante protestos"],
    conflitos: ["preservar o conhecimento antes que seja destruído", "salvar vidas enquanto a guerra devasta tudo", "sobreviver a uma viagem perigosa", "passar informação sem ser descoberto", "manter a esperança durante a tragédia", "lutar por direitos numa sociedade opressora"],
    reviravoltas: ["um documento histórico que muda tudo", "a personagem é mais importante do que pensava", "um evento histórico visto de um ângulo novo", "a história oficial estava errada", "um encontro com uma figura histórica famosa", "a decisão da personagem muda o curso da história"]
  }
};

const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

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

    const elements = promptElements[theme as keyof typeof promptElements] || {
      personagens: ["uma pessoa comum num dia extraordinário"],
      cenarios: ["numa cidade familiar que de repente parece estranha"],
      conflitos: ["uma decisão que muda tudo"],
      reviravoltas: ["nada é o que parece"]
    };
    
    const personagem = getRandomElement(elements.personagens);
    const cenario = getRandomElement(elements.cenarios);
    const conflito = getRandomElement(elements.conflitos);
    const reviravolta = getRandomElement(elements.reviravoltas);

    const userPrompt = `Escreve um conto curto de ${themeLabel} com cerca de 500 palavras, ${isAdult ? 'para um público adulto, com uma abordagem sofisticada e madura.' : 'adequado para todos os públicos.'}

**Elementos narrativos obrigatórios:**
- **Personagens:** ${personagem}
- **Cenário:** A história passa-se ${cenario}
- **Conflito:** ${conflito}
- **Reviravolta:** ${reviravolta}

Desenvolve a narrativa com descrições vívidas, diálogos naturais e emoções autênticas. Começa diretamente com a ação, sem título.`;

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
        temperature: 0.9,
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

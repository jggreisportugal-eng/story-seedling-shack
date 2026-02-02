
# Plano: Integrar Edge Function para Geração de Contos com OpenAI

## Resumo

Este plano substitui o conteúdo placeholder por histórias únicas geradas pela API OpenAI, através de uma nova Edge Function Supabase chamada `rapid-responder`.

## Arquitetura

```text
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│  useStoryGeneration │────▶│  rapid-responder    │────▶│   OpenAI API    │
│       (React)       │     │  (Edge Function)    │     │   (GPT-4/3.5)   │
└─────────────────────┘     └─────────────────────┘     └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐
│   localStorage      │     │   Logs de geração   │
│   (armazenamento)   │     │   (debugging)       │
└─────────────────────┘     └─────────────────────┘
```

---

## Passo 1: Adicionar Chave API OpenAI

**Ação:** Configurar o segredo `OPENAI_API_KEY` para a Edge Function

Antes de criar a função, será necessário adicionar a chave da API OpenAI como segredo no projeto Supabase.

---

## Passo 2: Criar Estrutura Supabase

**Ficheiros a criar:**

### 2.1 - `supabase/config.toml`
Configuração base do Supabase com a definição da Edge Function.

```toml
project_id = "kvavayuwvmyrhtlgqnko"

[functions.rapid-responder]
verify_jwt = false
```

### 2.2 - `supabase/functions/rapid-responder/index.ts`
Edge Function que:
- Recebe o tema, faixa etária e estilo
- Chama a API OpenAI com um prompt otimizado para contos em PT-PT
- Retorna a história gerada com ~500 palavras
- Inclui CORS headers para chamadas do browser
- Inclui tratamento de erros robusto

**Estrutura do request:**
```json
{
  "theme": "romance",
  "ageGroup": "geral",
  "style": "neutro"
}
```

**Estrutura do response:**
```json
{
  "success": true,
  "story": {
    "id": "uuid",
    "content": "Texto do conto...",
    "word_count": 512,
    "created_at": "2026-02-02T10:00:00Z"
  },
  "usage": {
    "remaining": 4
  }
}
```

---

## Passo 3: Atualizar useStoryGeneration.ts

**Ficheiro:** `src/hooks/useStoryGeneration.ts`

**Alterações:**

1. **Adicionar import do Supabase** (linha 1)
   ```typescript
   import { supabase } from "@/integrations/supabase/client";
   ```

2. **Substituir bloco try/catch na função generateStory** (linhas 129-161)
   - Remover `setTimeout` de simulação
   - Chamar `supabase.functions.invoke('rapid-responder', {...})`
   - Tratar erros específicos (limite mensal, API indisponível)
   - Mostrar contagem de palavras e histórias restantes no toast

3. **Renomear função** `generatePlaceholderTitle` para `generateTitleFromTheme`
   - Mantém a mesma lógica (títulos aleatórios por tema)
   - Usada como fallback caso a API não retorne título

4. **Remover função** `generatePlaceholderContent` (linhas 242-256)
   - Já não é necessária pois o conteúdo vem da API

---

## Passo 4: Tratamento de Erros

A integração incluirá tratamento para:
- **Limite mensal atingido:** Toast com mensagem específica
- **API OpenAI indisponível:** Toast genérico com retry
- **Resposta inválida:** Fallback gracioso
- **Timeout:** Feedback visual ao utilizador

---

## Resultado Esperado

| Antes | Depois |
|-------|--------|
| Todas as histórias iguais | Histórias únicas geradas por IA |
| Conteúdo fixo sobre "Maria" | Conteúdo adaptado ao tema escolhido |
| Simulação com setTimeout | Chamada real à API OpenAI |
| ~100 palavras | ~500 palavras por história |

---

## Secção Técnica

### Dependências
- Não são necessárias novas dependências npm
- A Edge Function usa `fetch` nativo do Deno

### Segurança
- A chave OpenAI fica apenas no servidor (Edge Function)
- Nunca exposta no frontend
- CORS configurado para permitir chamadas do domínio da app

### Performance
- Timeout de 30 segundos para geração
- Feedback visual durante loading (já existente)
- Cache local via localStorage (já existente)

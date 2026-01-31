import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";
import AdultContentWarning from "@/components/modals/AdultContentWarning";

const StoryReader = () => {
  const { id } = useParams();
  const [showAdultWarning, setShowAdultWarning] = useState(false);
  const [hasConfirmedAge, setHasConfirmedAge] = useState(false);

  // Dados simulados do conto
  const story = {
    id: Number(id) || 1,
    title: "O Segredo do Farol",
    day: 12,
    isAdultContent: true,
    content: `
      A chuva batia com fúria contra as janelas do velho farol. Maria, a guardiã de setenta e dois anos, conhecia bem aquele som — era a melodia da sua solidão.

      Há quarenta anos que vivia ali, no alto daquele rochedo batido pelo mar. Quarenta anos a acender a luz que guiava os barcos perdidos. Quarenta anos a guardar um segredo que ninguém mais conhecia.

      Naquela noite, porém, algo era diferente. Enquanto verificava o mecanismo da lanterna, os seus dedos encontraram algo que não deveria estar ali: um envelope amarelado, escondido numa fresta do metal.

      O coração de Maria saltou. Reconheceu imediatamente a letra do remetente — aquela caligrafia elegante que tantas vezes tinha visto antes, há uma vida inteira.

      "Minha querida Maria," começava a carta, "se estás a ler isto, é porque finalmente encontraste coragem para olhar para o passado..."

      Maria sentou-se na velha cadeira junto à janela, o envelope a tremer nas suas mãos envelhecidas. Lá fora, a tempestade rugia. Dentro dela, uma tempestade ainda maior estava prestes a despertar.

      Aquela carta mudaria tudo o que ela pensava saber sobre a sua própria história.
    `,
    hasPrevious: true,
    hasNext: true,
  };

  const handleConfirmAge = () => {
    setHasConfirmedAge(true);
    setShowAdultWarning(false);
  };

  // Verificar se precisa de confirmação de idade
  if (story.isAdultContent && !hasConfirmedAge) {
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center p-4">
          <AdultContentWarning
            open={true}
            onConfirm={handleConfirmAge}
            onCancel={() => window.history.back()}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header - Fundo azul-noite */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link to="/dashboard">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          
          <Logo variant="light" size="sm" />
          
          <div className="w-20" /> {/* Spacer para centrar o logo */}
        </div>
      </header>

      {/* Story Content */}
      <main className="container max-w-2xl px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Meta info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Dia {story.day} de 30</span>
            {story.isAdultContent && (
              <Badge className="gap-1 bg-amber/10 text-amber border-amber/50 font-semibold">
                <AlertTriangle className="h-3 w-3" />
                +18
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {story.title}
          </h1>

          {/* Separator */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <div className="h-2 w-2 rounded-full bg-amber" />
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Story text */}
          <div className="prose-story text-foreground">
            {story.content.split('\n\n').map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="mb-6 leading-relaxed"
              >
                {paragraph.trim()}
              </motion.p>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t-2 border-border">
            {story.hasPrevious ? (
              <Link to={`/conto/${story.id - 1}`}>
                <Button 
                  variant="outline" 
                  className="gap-2 border-2 border-border hover:border-amber hover:text-amber font-semibold"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>
              </Link>
            ) : (
              <div />
            )}
            
            {story.hasNext ? (
              <Link to={`/conto/${story.id + 1}`}>
                <Button className="gap-2 bg-amber text-amber-foreground hover:bg-amber/90 font-semibold shadow-md shadow-amber/20">
                  Seguinte
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </motion.article>
      </main>
    </PageContainer>
  );
};

export default StoryReader;

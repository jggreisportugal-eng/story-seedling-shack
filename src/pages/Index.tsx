import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";

const Index = () => {
  return (
    <PageContainer>
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between px-4">
          <Logo variant="light" size="sm" />
          <Link to="/auth">
            <Button variant="secondary" size="sm">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-amber/10 p-4">
                <BookOpen className="h-12 w-12 text-amber" />
              </div>
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Um conto novo, todos os dias
            </h1>
            
            <p className="mt-6 font-body text-lg text-muted-foreground md:text-xl">
              Descubra histórias únicas geradas por inteligência artificial, 
              escritas em Português de Portugal, para ler em poucos minutos.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Começar gratuitamente
                </Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button variant="outline" size="lg">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container px-4">
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Contos únicos
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cada história é gerada especialmente para si, com temas à sua escolha.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10">
                  <Sparkles className="h-6 w-6 text-amber" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Inteligência artificial
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Histórias criadas por IA avançada, com qualidade literária.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Português de Portugal
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Conteúdo exclusivamente em PT-PT, com vocabulário e expressões autênticas.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Contos Diários. Todos os direitos reservados.</p>
        </div>
      </footer>
    </PageContainer>
  );
};

export default Index;

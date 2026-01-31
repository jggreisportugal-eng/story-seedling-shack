import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Um conto por dia",
      description: "Histórias cuidadosamente selecionadas para o seu momento de leitura diário.",
    },
    {
      icon: Sparkles,
      title: "Conteúdo exclusivo",
      description: "Contos originais, envolventes e escritos especialmente para si.",
    },
    {
      icon: Clock,
      title: "Leitura rápida",
      description: "Histórias curtas, perfeitas para qualquer momento do dia.",
    },
    {
      icon: Shield,
      title: "Privacidade garantida",
      description: "Os seus dados estão protegidos. Leia com tranquilidade.",
    },
  ];

  return (
    <PageContainer>
      <div className="min-h-screen">
        {/* Header - Fundo azul-noite */}
        <header className="bg-primary text-primary-foreground">
          <div className="container flex h-16 items-center justify-between px-4">
            <Logo variant="light" />
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber bg-transparent text-amber hover:bg-amber hover:text-amber-foreground"
              >
                Entrar
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section - Fundo azul-noite profundo */}
        <section className="bg-primary text-primary-foreground">
          <div className="container px-4 py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                  A sua dose diária de{" "}
                  <span className="text-amber">histórias</span>
                </h1>
                <p className="mt-6 font-body text-lg text-primary-foreground/80 md:text-xl">
                  Descubra um conto novo todos os dias. Histórias envolventes, emocionais e escritas para adultos que apreciam a arte de ler.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="w-full bg-amber text-amber-foreground font-semibold hover:bg-amber/90 shadow-lg shadow-amber/20 sm:w-auto"
                  >
                    Começar a ler
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
                >
                  Saber mais
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Fundo com contraste */}
        <section className="bg-muted py-16">
          <div className="container px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center font-display text-2xl font-bold text-foreground md:text-3xl"
            >
              Porque escolher os Contos Diários?
            </motion.h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg bg-card p-6 text-center shadow-sm"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber/10">
                    <feature.icon className="h-7 w-7 text-amber" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Fundo âmbar destacado */}
        <section className="bg-amber py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container px-4"
          >
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold text-amber-foreground md:text-3xl">
                Pronto para mergulhar nas histórias?
              </h2>
              <p className="mt-4 font-body text-amber-foreground/90">
                Junte-se a milhares de leitores que já descobriram o prazer de um conto por dia.
              </p>
              <Link to="/auth">
                <Button
                  size="lg"
                  className="mt-6 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg"
                >
                  Criar conta gratuita
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer - Fundo azul-noite */}
        <footer className="bg-primary py-8 text-primary-foreground">
          <div className="container px-4 text-center">
            <Logo variant="light" size="sm" />
            <p className="mt-4 text-sm text-primary-foreground/70">
              © 2024 Contos Diários. Todos os direitos reservados.
            </p>
            <p className="mt-2 text-xs text-primary-foreground/50">
              Conteúdo destinado a maiores de 18 anos.
            </p>
          </div>
        </footer>
      </div>
    </PageContainer>
  );
};

export default Index;

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
        {/* Header */}
        <header className="container flex h-16 items-center justify-between px-4">
          <Logo />
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
          </Link>
        </header>

        {/* Hero Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                A sua dose diária de{" "}
                <span className="text-amber">histórias</span>
              </h1>
              <p className="mt-6 font-body text-lg text-muted-foreground md:text-xl">
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
                  className="w-full bg-amber text-amber-foreground hover:bg-amber/90 sm:w-auto"
                >
                  Começar a ler
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Saber mais
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center font-display text-2xl font-semibold md:text-3xl"
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
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10">
                    <feature.icon className="h-6 w-6 text-amber" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold">
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

        {/* CTA Section */}
        <section className="container px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12"
          >
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Pronto para mergulhar nas histórias?
            </h2>
            <p className="mt-4 font-body opacity-90">
              Junte-se a milhares de leitores que já descobriram o prazer de um conto por dia.
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                className="mt-6 bg-amber text-amber-foreground hover:bg-amber/90"
              >
                Criar conta gratuita
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container px-4 text-center">
            <Logo size="sm" />
            <p className="mt-4 text-sm text-muted-foreground">
              © 2024 Contos Diários. Todos os direitos reservados.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Conteúdo destinado a maiores de 18 anos.
            </p>
          </div>
        </footer>
      </div>
    </PageContainer>
  );
};

export default Index;

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <PageContainer>
      <div className="flex min-h-screen flex-col bg-primary">
        {/* Secção superior com fundo azul-noite */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Logo variant="light" size="lg" />
          </motion.div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-primary-foreground/80">
              {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}
              {" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-amber hover:underline"
              >
                {isLogin ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link
              to="/"
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              ← Voltar à página inicial
            </Link>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Auth;

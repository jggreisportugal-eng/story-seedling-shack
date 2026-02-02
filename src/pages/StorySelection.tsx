import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Compass, Eye, Rocket, Flame, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";
import { useAuthContext } from "@/contexts/AuthContext";
import { STORY_GENRES, GenreId } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

const iconMap = {
  Heart,
  Compass,
  Eye,
  Rocket,
  Flame,
};

const StorySelection = () => {
  const navigate = useNavigate();
  const { user, savePreferences, isAdult, signOut } = useAuthContext();
  const { toast } = useToast();
  const [selectedGenres, setSelectedGenres] = useState<GenreId[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  const toggleGenre = (genreId: GenreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleContinue = async () => {
    if (selectedGenres.length === 0) {
      toast({
        title: "Selecione pelo menos um género",
        description: "Escolha os géneros que mais lhe interessam para continuar.",
        variant: "destructive",
      });
      return;
    }

    await savePreferences(selectedGenres);
    
    toast({
      title: "Preferências guardadas!",
      description: "As suas escolhas foram registadas com sucesso.",
    });

    navigate("/dashboard");
  };

  const handleReadNow = async (genreId: GenreId) => {
    if (isNavigating) return;
    setIsNavigating(true);

    // Save this genre as preference
    const updatedGenres = selectedGenres.includes(genreId) 
      ? selectedGenres 
      : [...selectedGenres, genreId];
    
    await savePreferences(updatedGenres);
    
    // Navigate to story with selected genre
    navigate(`/conto/${genreId}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Filter genres based on adult status
  const availableGenres = STORY_GENRES.filter(
    (genre) => !genre.adultOnly || isAdult
  );

  // Get user display name from email
  const userName = user?.email?.split("@")[0] || "Leitor";

  return (
    <PageContainer>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo size="sm" />
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground hidden sm:block">
                Olá, <span className="font-semibold text-foreground">{userName}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Bem-vindo, {userName}!
            </h1>
            <p className="text-muted-foreground font-body">
              Escolha os géneros de histórias que mais lhe interessam
            </p>
          </motion.div>

          {/* Genre Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {availableGenres.map((genre, index) => {
              const Icon = iconMap[genre.icon as keyof typeof iconMap];
              const isSelected = selectedGenres.includes(genre.id);

              return (
                <motion.div
                  key={genre.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected
                        ? "border-2 border-amber bg-amber/5 shadow-md"
                        : "border-2 border-border hover:border-amber/50"
                    }`}
                    onClick={() => toggleGenre(genre.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? "bg-amber text-amber-foreground" : "bg-muted"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {isSelected && (
                          <div className="bg-amber text-amber-foreground p-1 rounded-full">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="font-display text-lg text-foreground">
                        {genre.title}
                      </CardTitle>
                      <CardDescription className="font-body text-sm">
                        {genre.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={isNavigating}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadNow(genre.id);
                        }}
                      >
                        Ler agora
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Adult Content Notice */}
          {!isAdult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-6"
            >
              <p className="text-xs text-muted-foreground">
                Alguns géneros estão disponíveis apenas para utilizadores maiores de 18 anos.
              </p>
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              size="lg"
              className="bg-amber text-amber-foreground font-semibold hover:bg-amber/90 shadow-lg shadow-amber/20 px-8"
              onClick={handleContinue}
              disabled={selectedGenres.length === 0}
            >
              Continuar ({selectedGenres.length} {selectedGenres.length === 1 ? "género" : "géneros"})
            </Button>
            <p className="text-xs text-muted-foreground">
              Pode alterar as suas preferências mais tarde
            </p>
          </motion.div>
        </main>
      </div>
    </PageContainer>
  );
};

export default StorySelection;

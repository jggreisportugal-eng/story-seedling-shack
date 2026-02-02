import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Compass, Eye, Rocket, Flame, Check } from "lucide-react";
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
  const { user, savePreferences, isAuthenticated } = useAuthContext();
  const { toast } = useToast();
  const [selectedGenres, setSelectedGenres] = useState<GenreId[]>([]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const toggleGenre = (genreId: GenreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleContinue = () => {
    if (selectedGenres.length === 0) {
      toast({
        title: "Selecione pelo menos um género",
        description: "Escolha os géneros que mais lhe interessam para continuar.",
        variant: "destructive",
      });
      return;
    }

    savePreferences(selectedGenres);
    
    toast({
      title: "Preferências guardadas!",
      description: "As suas escolhas foram registadas com sucesso.",
    });

    navigate("/dashboard");
  };

  const handleReadNow = (genreId: GenreId) => {
    // Save this genre as preference if not already selected
    if (!selectedGenres.includes(genreId)) {
      savePreferences([...selectedGenres, genreId]);
    }
    
    // Navigate to story with selected genre
    navigate(`/conto/${genreId}`);
  };

  // Filter genres based on adult status
  const availableGenres = STORY_GENRES.filter(
    (genre) => !genre.adultOnly || (user?.isAdult ?? false)
  );

  return (
    <PageContainer>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              Olá, <span className="font-semibold text-foreground">{user?.email}</span>
            </p>
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
              Escolha os seus géneros favoritos
            </h1>
            <p className="text-muted-foreground font-body">
              Selecione os tipos de histórias que mais lhe interessam
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
          {!user?.isAdult && (
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

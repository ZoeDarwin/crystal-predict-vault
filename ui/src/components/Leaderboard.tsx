import { Trophy, Medal, Award, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useLeaderboardCount,
  useLeaderboardEntry,
  usePrediction,
  useRealtimeLeaderboard,
} from "@/hooks/useWeatherPrediction";
import { useQueryClient } from "@tanstack/react-query";

const Leaderboard = () => {
  const { data: leaderboardCount } = useLeaderboardCount();
  const queryClient = useQueryClient();

  // Enable real-time updates
  useRealtimeLeaderboard();

  // Get all leaderboard entries
  const leaderboardIds = Array.from({ length: Number(leaderboardCount || 0) }, (_, i) => i);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-accent" />;
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Award className="h-5 w-5 text-secondary" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <footer className="bg-gradient-to-t from-background to-card/20 border-t border-border py-16 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-3xl font-bold text-foreground mb-2">Weather Prediction Leaderboard</h2>
          <p className="text-muted-foreground">Top predictors ranked by accuracy after decryption</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {Number(leaderboardCount || 0) === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-in fade-in duration-500">
              No leaderboard entries yet. Predictions will appear here after they are revealed.
            </div>
          ) : (
            leaderboardIds
              .slice(0, 5)
              .map((id, index) => {
                const { data: entry } = useLeaderboardEntry(id);
                const { data: prediction } = usePrediction(id);

                if (!entry || !prediction) return null;

                const predictor = {
                  rank: index + 1,
                  address: entry.predictor,
                  accuracy: entry.accuracy,
                  location: prediction.location,
                  actualTemp: entry.actualTemperature,
                };

                return (
                  <div
                    key={predictor.rank}
                    className="backdrop-blur-md bg-card/40 rounded-lg p-4 border border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-glow-cyan hover:scale-102 hover:-translate-y-1 transform animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300">
                          {getRankIcon(predictor.rank)}
                        </div>

                        <div className="flex-1">
                          <div className="font-mono text-sm text-foreground group-hover:text-primary transition-colors duration-300">
                            {predictor.address.slice(0, 6)}...{predictor.address.slice(-4)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{predictor.location}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center hidden sm:block">
                          <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                          <Badge className="bg-accent/20 text-accent border-accent/30 group-hover:bg-accent/40 transition-colors duration-300">
                            {predictor.accuracy.toFixed(1)}%
                          </Badge>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Actual Temp</div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {predictor.actualTemp.toFixed(1)}°C
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              .filter(Boolean)
          )}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
          <p>Secured by smart contracts • Transparent • Immutable</p>
        </div>
      </div>
    </footer>
  );
};

export default Leaderboard;

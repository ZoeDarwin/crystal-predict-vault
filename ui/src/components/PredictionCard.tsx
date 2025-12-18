import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Clock, Thermometer } from "lucide-react";
import { usePrediction, useDecryptPrediction, useAccount } from "@/hooks/useWeatherPrediction";
import { useAccount as useWagmiAccount } from "wagmi";
import { format } from "date-fns";

interface PredictionCardProps {
  predictionId: number;
}

const PredictionCard = ({ predictionId }: PredictionCardProps) => {
  const { data: prediction, isLoading } = usePrediction(predictionId);
  const { address } = useWagmiAccount();
  const decryptPrediction = useDecryptPrediction();
  const [decryptedTemp, setDecryptedTemp] = useState<number | null>(null);
  const [decryptedConf, setDecryptedConf] = useState<number | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = async () => {
    if (!prediction || !address) return;

    // Only owner can decrypt before reveal
    if (!prediction.isRevealed && prediction.predictor.toLowerCase() !== address.toLowerCase()) {
      alert("Only the prediction owner can decrypt before reveal");
      return;
    }

    setIsDecrypting(true);
    try {
      const temp = await decryptPrediction.mutateAsync({
        predictionId,
        type: "temperature",
      });
      setDecryptedTemp(temp);

      const conf = await decryptPrediction.mutateAsync({
        predictionId,
        type: "confidence",
      });
      setDecryptedConf(conf);
    } catch (error) {
      console.error("Decryption failed:", error);
    } finally {
      setIsDecrypting(false);
    }
  };

  if (isLoading || !prediction) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const isOwner = prediction.predictor.toLowerCase() === address?.toLowerCase();
  const canDecrypt = prediction.isRevealed || isOwner;
  const isDecrypted = decryptedTemp !== null && decryptedConf !== null;

  return (
    <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 backdrop-blur-sm group hover:shadow-glow-cyan hover:scale-105 hover:-translate-y-2 transform">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-secondary/20 text-secondary border-secondary/30 animate-in fade-in slide-in-from-left-2 duration-500">
            {prediction.location}
          </Badge>
          {prediction.isRevealed ? (
            <Unlock className="h-5 w-5 text-accent animate-unlock" />
          ) : (
            <Lock className="h-5 w-5 text-primary animate-glow-pulse" />
          )}
        </div>
        <CardTitle className="text-foreground group-hover:text-primary transition-colors duration-300">
          Weather Prediction
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Prediction Content */}
          <div className={`transition-all duration-600 ${!isDecrypted ? "blur-md" : "blur-0"}`}>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2 border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Temperature:</span>
                <span className="text-accent font-mono font-bold">
                  {isDecrypted ? `${decryptedTemp?.toFixed(1)}°C` : "████"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="text-primary font-mono font-bold">
                  {isDecrypted ? `${decryptedConf?.toFixed(0)}%` : "██%"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors duration-300">
              <Clock className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">
                {format(new Date(prediction.targetDate * 1000), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors duration-300">
              <Thermometer className="h-4 w-4 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">{prediction.isRevealed ? "Revealed" : "Encrypted"}</span>
            </div>
          </div>

          {/* Action Button */}
          {canDecrypt && !isDecrypted && (
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-cyan hover:shadow-lg transition-all duration-300 hover:scale-105 group/btn"
              onClick={handleDecrypt}
              disabled={isDecrypting || decryptPrediction.isPending}
            >
              <Unlock className="mr-2 h-4 w-4 group-hover/btn:animate-unlock" />
              {isDecrypting || decryptPrediction.isPending ? "Decrypting..." : "Decrypt Prediction"}
            </Button>
          )}

          {isDecrypted && (
            <div className="text-center py-2 animate-in fade-in scale-in duration-500">
              <Badge className="bg-accent/20 text-accent border-accent/30 animate-pulse">
                ✓ Decrypted Successfully
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;

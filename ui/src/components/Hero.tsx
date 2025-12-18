import { Button } from "@/components/ui/button";
import { Lock, Cloud, CloudRain, Wind } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import WeatherLogo from "./WeatherLogo";
import heroBg from "@/assets/hero-bg.jpg";
import HowItWorksDialog from "./HowItWorksDialog";
import CreatePredictionDialog from "./CreatePredictionDialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Hero = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const [bgImageError, setBgImageError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle background image loading
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBgImageLoaded(true);
    img.onerror = () => {
      setBgImageError(true);
      toast({
        title: "Background Loading Error",
        description: "Failed to load background image. Using fallback.",
        variant: "destructive",
      });
    };
    img.src = heroBg;
  }, [toast]);

  // Monitor wallet connection status
  useEffect(() => {
    const checkWalletConnection = () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum
          .request({ method: "eth_accounts" })
          .then((accounts: string[]) => {
            setIsWalletConnected(accounts.length > 0);
          })
          .catch((error: any) => {
            console.error("Wallet connection check failed:", error);
            toast({
              title: "Wallet Connection Error",
              description: "Failed to check wallet connection status.",
              variant: "destructive",
            });
          });
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setIsWalletConnected(accounts.length > 0);
        if (accounts.length === 0) {
          toast({
            title: "Wallet Disconnected",
            description: "Please reconnect your wallet to continue.",
            variant: "destructive",
          });
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, [toast]);

  // Handle network errors
  useEffect(() => {
    const handleOnline = () => {
      setNetworkError(false);
      toast({
        title: "Connection Restored",
        description: "Network connection has been restored.",
      });
    };

    const handleOffline = () => {
      setNetworkError(true);
      toast({
        title: "Network Error",
        description: "Network connection lost. Please check your internet.",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Wallet Connection - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <ConnectButton />
      </div>

      {/* Background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          bgImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: bgImageError ? "none" : `url(${heroBg})`,
          backgroundColor: bgImageError ? "#1a1a2e" : "transparent",
        }}
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-80" />
        {bgImageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/50 text-center">
              <div className="text-6xl mb-4">🌤️</div>
              <div className="text-lg">Weather Prediction Background</div>
            </div>
          </div>
        )}
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Error Display */}
      {(networkError || componentError) && (
        <div className="absolute top-20 left-4 right-4 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {networkError && "Network connection issue detected. Some features may not work properly."}
              {componentError && `Component error: ${componentError}`}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex justify-center mb-8 animate-float">
          <div className="relative">
            <WeatherLogo className="w-32 h-32 drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]" />
            {/* Rotating ring around logo */}
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-accent animate-spin"
              style={{ animationDuration: "8s" }}
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700">
          Private Weather Guess
        </h1>

        <p className="text-2xl md:text-3xl mb-4 text-foreground font-light tracking-wide animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
          Predict Weather. Encrypted & Private.
        </p>

        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
          Submit encrypted temperature predictions. All predictions are stored encrypted and revealed after the target
          date for ranking.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <HowItWorksDialog>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-glow-cyan group"
            >
              <Lock className="mr-2 h-5 w-5 group-hover:animate-unlock" />
              How It Works
            </Button>
          </HowItWorksDialog>
          <CreatePredictionDialog>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <span className="relative">
                Start Predicting
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
              </span>
            </Button>
          </CreatePredictionDialog>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="backdrop-blur-md bg-card/30 rounded-lg p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-cyan group cursor-pointer transform hover:scale-105 hover:-translate-y-1">
            <div className="text-3xl font-bold text-primary mb-2 group-hover:animate-pulse">
              {isWalletConnected ? "2,547" : "Loading..."}
            </div>
            <div className="text-muted-foreground flex items-center justify-center gap-2">
              <Cloud className="h-4 w-4" />
              Active Predictions
            </div>
          </div>
          <div className="backdrop-blur-md bg-card/30 rounded-lg p-6 border border-secondary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-glow-purple group cursor-pointer transform hover:scale-105 hover:-translate-y-1">
            <div className="text-3xl font-bold text-secondary mb-2 group-hover:animate-pulse">
              {isWalletConnected ? "$1.2M" : "Loading..."}
            </div>
            <div className="text-muted-foreground flex items-center justify-center gap-2">
              <Wind className="h-4 w-4" />
              Total Staked
            </div>
          </div>
          <div className="backdrop-blur-md bg-card/30 rounded-lg p-6 border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-glow-cyan group cursor-pointer transform hover:scale-105 hover:-translate-y-1">
            <div className="text-3xl font-bold text-accent mb-2 group-hover:animate-pulse">
              {isWalletConnected ? "98.4%" : "Loading..."}
            </div>
            <div className="text-muted-foreground flex items-center justify-center gap-2">
              <CloudRain className="h-4 w-4" />
              Accuracy Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

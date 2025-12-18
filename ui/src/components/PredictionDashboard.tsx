import PredictionCard from "./PredictionCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreatePredictionDialog from "./CreatePredictionDialog";
import { usePredictionCount, usePrediction, useContractAddress } from "@/hooks/useWeatherPrediction";
import { useAccount, useChainId } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const PredictionDashboard = () => {
  const { data: predictionCount } = usePredictionCount();
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddress = useContractAddress();

  // Get all predictions
  const predictionIds = Array.from({ length: Number(predictionCount || 0) }, (_, i) => i);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">Weather Predictions</h2>
            <p className="text-muted-foreground">Encrypted temperature predictions secured by blockchain</p>
          </div>
          <CreatePredictionDialog>
            <Button
              size="lg"
              className="mt-4 md:mt-0 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow-purple hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Create Prediction
            </Button>
          </CreatePredictionDialog>
        </div>

        {!contractAddress && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Contract Not Deployed</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">The contract is not deployed on chain {chainId}.</p>
                <p className="mb-2">To deploy the contract:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>
                    Start Hardhat node: <code className="bg-muted px-1 rounded">npx hardhat node</code>
                  </li>
                  <li>
                    Deploy contract:{" "}
                    <code className="bg-muted px-1 rounded">npx hardhat deploy --network localhost</code>
                  </li>
                  <li>
                    Update <code className="bg-muted px-1 rounded">ui/src/config/contracts.ts</code> with the deployed
                    address
                  </li>
                  <li>Refresh this page</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!contractAddress ? (
            <div className="col-span-full text-center py-12 text-muted-foreground animate-in fade-in duration-500">
              Please deploy the contract first to view predictions.
            </div>
          ) : predictionIds.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground animate-in fade-in duration-500">
              No predictions yet. Create the first one!
            </div>
          ) : (
            predictionIds.map((id, index) => (
              <div
                key={id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PredictionCard predictionId={id} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PredictionDashboard;

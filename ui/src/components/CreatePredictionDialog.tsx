import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useSubmitPrediction, useContractAddress } from "@/hooks/useWeatherPrediction";
import { useAccount, useChainId } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Thermometer, MapPin, Calendar, Target } from "lucide-react";

interface CreatePredictionDialogProps {
  children: React.ReactNode;
}

const CreatePredictionDialog = ({ children }: CreatePredictionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    targetDate: "",
    temperature: "",
    confidence: 80,
    locationType: "city"
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = useContractAddress();
  const submitPrediction = useSubmitPrediction();
  const { toast } = useToast();

  // Predefined location suggestions
  const locationSuggestions = [
    "New York", "London", "Tokyo", "Paris", "Sydney",
    "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"
  ];

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    } else if (formData.location.length < 2) {
      errors.location = "Location must be at least 2 characters";
    } else if (formData.location.length > 100) {
      errors.location = "Location must be less than 100 characters";
    }

    if (!formData.targetDate) {
      errors.targetDate = "Target date is required";
    } else {
      const targetDate = new Date(formData.targetDate);
      const now = new Date();
      const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
      const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

      if (targetDate < minDate) {
        errors.targetDate = "Target date must be at least tomorrow";
      } else if (targetDate > maxDate) {
        errors.targetDate = "Target date cannot be more than 1 year from now";
      }
    }

    const temp = parseFloat(formData.temperature);
    if (!formData.temperature || isNaN(temp)) {
      errors.temperature = "Valid temperature is required";
    } else if (temp < -100 || temp > 100) {
      errors.temperature = "Temperature must be between -100°C and 100°C";
    }

    if (formData.confidence < 1 || formData.confidence > 100) {
      errors.confidence = "Confidence must be between 1% and 100%";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit a prediction.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const temperature = parseFloat(formData.temperature);
      const targetTimestamp = Math.floor(new Date(formData.targetDate).getTime() / 1000);

      await submitPrediction({
        location: formData.location.trim(),
        targetDate: targetTimestamp,
        temperature: temperature,
        confidence: formData.confidence
      });

      toast({
        title: "Prediction Submitted",
        description: `Your prediction for ${formData.location} has been submitted successfully!`,
      });

      // Reset form and close dialog
      setFormData({
        location: "",
        targetDate: "",
        temperature: "",
        confidence: 80,
        locationType: "city"
      });
      setValidationErrors({});
      setOpen(false);

    } catch (error) {
      console.error("Prediction submission failed:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Create Weather Prediction</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Submit an encrypted temperature prediction for a future date
          </DialogDescription>
        </DialogHeader>
        
        {!contractAddress && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Contract Not Deployed</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-2">The contract is not deployed on chain {chainId}.</p>
              <p className="mb-2">Please follow these steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Deploy the contract: <code className="bg-muted px-1 rounded">npx hardhat deploy --network localhost</code></li>
                <li>Update <code className="bg-muted px-1 rounded">ui/src/config/contracts.ts</code> with the deployed address</li>
                <li>Refresh this page</li>
              </ol>
              <p className="mt-2 text-xs text-muted-foreground">
                See README.md for detailed instructions.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Location Input with Suggestions */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <div className="space-y-2">
              <Select value={formData.locationType} onValueChange={(value) => handleInputChange("locationType", value)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., New York, London, Tokyo"
                className={`bg-background border-border text-foreground ${validationErrors.location ? 'border-destructive' : ''}`}
              />
              {validationErrors.location && (
                <p className="text-sm text-destructive">{validationErrors.location}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {locationSuggestions.slice(0, 5).map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleInputChange("location", suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Date Input */}
          <div className="space-y-2">
            <Label htmlFor="targetDate" className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4" />
              Target Date
            </Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => handleInputChange("targetDate", e.target.value)}
              min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className={`bg-background border-border text-foreground ${validationErrors.targetDate ? 'border-destructive' : ''}`}
            />
            {validationErrors.targetDate && (
              <p className="text-sm text-destructive">{validationErrors.targetDate}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Select a future date (tomorrow to 1 year from now)
            </p>
          </div>

          {/* Temperature Input */}
          <div className="space-y-2">
            <Label htmlFor="temperature" className="flex items-center gap-2 text-foreground">
              <Thermometer className="h-4 w-4" />
              Predicted Temperature (°C)
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => handleInputChange("temperature", e.target.value)}
              placeholder="25.5"
              min="-100"
              max="100"
              className={`bg-background border-border text-foreground ${validationErrors.temperature ? 'border-destructive' : ''}`}
            />
            {validationErrors.temperature && (
              <p className="text-sm text-destructive">{validationErrors.temperature}</p>
            )}
          </div>

          {/* Confidence Slider */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Target className="h-4 w-4" />
              Confidence Level: {formData.confidence}%
            </Label>
            <Slider
              value={[formData.confidence]}
              onValueChange={(value) => handleInputChange("confidence", value[0])}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            {validationErrors.confidence && (
              <p className="text-sm text-destructive">{validationErrors.confidence}</p>
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !isConnected}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-cyan"
              disabled={submitPrediction.isPending || !contractAddress || !isConnected}
            >
              {submitPrediction.isPending ? "Submitting..." : "Create Encrypted Prediction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePredictionDialog;

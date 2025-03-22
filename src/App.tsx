import { useState } from 'react';
import FoodImageUpload from './components/FoodImageUpload';
import FeedbackDisplay from './components/FeedbackDisplay';
import { recognizeFood } from './services/foodRecognitionService';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    foodName: string;
    healthScore: number;
    feedback: string;
    advice: string;
  } | null>(null);

  const handleImageSelected = async (imageFile: File) => {
    setSelectedImage(imageFile);
    setIsAnalyzing(true);
    
    try {
      const result = await recognizeFood(imageFile);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing food image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">Harsh Coach: Food Edition</h1>
        <p className="app-subtitle">
          Upload a photo of your food and prepare for brutal honesty.
        </p>
      </div>

      <div className="app-content">
        <FoodImageUpload onImageSelected={handleImageSelected} />
        
        {(isAnalyzing || analysisResult) && (
          <FeedbackDisplay 
            foodName={analysisResult?.foodName || ""}
            healthScore={analysisResult?.healthScore || 0}
            feedback={analysisResult?.feedback || ""}
            advice={analysisResult?.advice || ""}
            isLoading={isAnalyzing}
          />
        )}
      </div>
    </div>
  );
}

export default App;

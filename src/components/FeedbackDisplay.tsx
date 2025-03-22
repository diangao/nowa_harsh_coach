import React from 'react';

interface FeedbackDisplayProps {
  foodName: string;
  healthScore: number;
  feedback: string;
  advice: string;
  isLoading?: boolean;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ 
  foodName, 
  healthScore, 
  feedback, 
  advice,
  isLoading = false 
}) => {
  
  // Calculate color based on health score
  const getHealthColor = () => {
    if (healthScore < 30) return '#E53E3E'; // red
    if (healthScore < 60) return '#ECC94B'; // yellow
    return '#38A169'; // green
  };

  if (isLoading) {
    return (
      <div className="feedback-container loading">
        <p>Analyzing your food... Preparing brutal honesty...</p>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h2 className="food-name">{foodName}</h2>
        <div className="health-score" style={{ backgroundColor: getHealthColor() }}>
          {healthScore}/100
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="feedback-section">
        <p className="section-title">The harsh truth:</p>
        <p className="feedback-text">"{feedback}"</p>
      </div>
      
      <div className="advice-section">
        <p className="section-title">What you should do:</p>
        <p className="advice-text">{advice}</p>
      </div>

      <style>
        {`
        .feedback-container {
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 100%;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
        }
        
        .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .food-name {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
        }
        
        .health-score {
          padding: 8px 12px;
          border-radius: 6px;
          color: white;
          font-weight: bold;
        }
        
        .divider {
          height: 1px;
          background-color: #edf2f7;
          margin: 16px 0;
        }
        
        .section-title {
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .feedback-text {
          font-size: 18px;
          font-style: italic;
          color: #E53E3E;
          margin-bottom: 16px;
        }
        
        .advice-text {
          font-size: 18px;
          background-color: #f7fafc;
          padding: 12px;
          border-radius: 6px;
        }
        `}
      </style>
    </div>
  );
};

export default FeedbackDisplay; 
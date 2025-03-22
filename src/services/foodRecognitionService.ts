// Mock food recognition service
// In a real app, this would call an AI API

interface FoodAnalysisResult {
  foodName: string;
  healthScore: number;
  feedback: string;
  advice: string;
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock database of food responses
const foodResponses: Record<string, FoodAnalysisResult> = {
  // Unhealthy foods
  'pizza': {
    foodName: 'Pizza',
    healthScore: 25,
    feedback: 'Really? Pizza again? Do you think those love handles are going to shrink themselves?',
    advice: 'If you absolutely must eat this, limit yourself to ONE slice and add a big salad.'
  },
  'burger': {
    foodName: 'Burger',
    healthScore: 20,
    feedback: 'A burger? Might as well tape it directly to your thighs and save time.',
    advice: 'Ditch the bun, skip the fries, and maybe consider a salad next time.'
  },
  'ice cream': {
    foodName: 'Ice Cream',
    healthScore: 15,
    feedback: 'Ice cream at this hour? Your poor pancreas is screaming for mercy.',
    advice: 'Put that down immediately. Have a piece of fruit if you need something sweet.'
  },
  'fries': {
    foodName: 'French Fries',
    healthScore: 10,
    feedback: 'Ah yes, deep-fried potatoes - the cornerstone of any "fitness journey".',
    advice: 'Hard pass. These are literally sticks of fat. Try roasted vegetables instead.'
  },
  
  // Moderately healthy
  'sandwich': {
    foodName: 'Sandwich',
    healthScore: 50,
    feedback: "A sandwich? Could be worse, could be better. Depends what's hiding between those slices.",
    advice: 'Use whole grain bread, skip the mayo, and load it with veggies.'
  },
  'pasta': {
    foodName: 'Pasta',
    healthScore: 45,
    feedback: 'Pasta, the comfort food of procrastinating dieters everywhere.',
    advice: 'Measure your portion - that means ONE cup, not the entire pot. Add vegetables and lean protein.'
  },
  
  // Healthy options
  'salad': {
    foodName: 'Salad',
    healthScore: 85,
    feedback: "A salad? I'm impressed. Though let's be honest, it's probably drowning in dressing.",
    advice: "Keep the dressing on the side, and make sure there's enough protein to keep you full."
  },
  'chicken breast': {
    foodName: 'Grilled Chicken Breast',
    healthScore: 80,
    feedback: 'Grilled chicken breast - boring but effective. Like your personality.',
    advice: "Good choice. Pair it with vegetables instead of those carbs you're eyeing."
  },
  'fish': {
    foodName: 'Fish',
    healthScore: 90,
    feedback: "Fish? Well aren't you the picture of health today. Let's see how long this lasts.",
    advice: "Excellent choice. Just make sure it's not deep fried or covered in butter."
  }
};

// Default response for unrecognized foods
const defaultResponse: FoodAnalysisResult = {
  foodName: 'Unidentified Food',
  healthScore: 50,
  feedback: "I can't tell what that is, but if you're asking me, you probably already know it's a bad idea.",
  advice: 'When in doubt, put it down. Try something green and recognizable instead.'
};

// Function to simulate food recognition
export const recognizeFood = async (imageFile: File): Promise<FoodAnalysisResult> => {
  // Simulate API processing time
  await delay(2000);
  
  // In a real app, we would send the image to an AI API
  // For mock purposes, we'll randomly select from our database
  
  const foods = Object.keys(foodResponses);
  const randomFood = foods[Math.floor(Math.random() * foods.length)];
  
  return foodResponses[randomFood];
}; 
import { DetectionResult, DiseaseType } from '../types';

const DISEASES: DiseaseType[] = [
  'Healthy',
  'Infected_Bacterial_Erysipelas',
  'Infected_Bacterial_Greasy_Pig_Disease',
  'Infected_Environmental_Dermatitis',
  'Infected_Environmental_Sunburn',
  'Infected_Fungal_Pityriasis_Rosea',
  'Infected_Fungal_Ringworm',
  'Infected_Parasitic_Mange',
  'Infected_Viral_Foot_and_Mouth_Disease',
  'Infected_Viral_Swinepox',
];

export async function mockDetectDisease(image: File): Promise<DetectionResult[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate random probabilities that sum to 1
  const rawProbabilities = DISEASES.map(() => Math.random());
  const sum = rawProbabilities.reduce((a, b) => a + b, 0);
  const normalizedProbabilities = rawProbabilities.map((p) => p / sum);

  return DISEASES.map((disease, index) => ({
    disease,
    probability: normalizedProbabilities[index],
  })).sort((a, b) => b.probability - a.probability);
}
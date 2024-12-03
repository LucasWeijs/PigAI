export interface DetectionResult {
  disease: string;
  probability: number;
}

export type DiseaseType =
  | 'Healthy'
  | 'Infected_Bacterial_Erysipelas'
  | 'Infected_Bacterial_Greasy_Pig_Disease'
  | 'Infected_Environmental_Dermatitis'
  | 'Infected_Environmental_Sunburn'
  | 'Infected_Fungal_Pityriasis_Rosea'
  | 'Infected_Fungal_Ringworm'
  | 'Infected_Parasitic_Mange'
  | 'Infected_Viral_Foot_and_Mouth_Disease'
  | 'Infected_Viral_Swinepox';
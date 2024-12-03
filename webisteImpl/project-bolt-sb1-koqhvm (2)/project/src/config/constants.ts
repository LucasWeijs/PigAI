export const IMAGE_SIZE = {
  width: 224,
  height: 224,
};

export const DISEASES = [
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
] as const;

export const VGG16_LAYERS = [
  // Block 1
  { type: 'conv', filters: 64, kernelSize: [3, 3] },
  { type: 'conv', filters: 64, kernelSize: [3, 3] },
  { type: 'maxpool' },
  
  // Block 2
  { type: 'conv', filters: 128, kernelSize: [3, 3] },
  { type: 'conv', filters: 128, kernelSize: [3, 3] },
  { type: 'maxpool' },
  
  // Block 3
  { type: 'conv', filters: 256, kernelSize: [3, 3] },
  { type: 'conv', filters: 256, kernelSize: [3, 3] },
  { type: 'conv', filters: 256, kernelSize: [3, 3] },
  { type: 'maxpool' },
  
  // Block 4
  { type: 'conv', filters: 512, kernelSize: [3, 3] },
  { type: 'conv', filters: 512, kernelSize: [3, 3] },
  { type: 'conv', filters: 512, kernelSize: [3, 3] },
  { type: 'maxpool' },
  
  // Block 5
  { type: 'conv', filters: 512, kernelSize: [3, 3] },
  { type: 'conv', filters: 512, kernelSize: [3, 3] },
  { type: 'conv', filters: 512, kernelSize: [3, 3] },
  { type: 'maxpool' },
  
  // Classification layers
  { type: 'flatten' },
  { type: 'dense', units: 4096, activation: 'relu' },
  { type: 'dropout', rate: 0.5 },
  { type: 'dense', units: 4096, activation: 'relu' },
  { type: 'dropout', rate: 0.5 },
] as const;
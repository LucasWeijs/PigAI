import * as tf from '@tensorflow/tfjs';
import { DetectionResult, DiseaseType } from '../types';
import { preprocessImage } from '../utils/imageProcessing';
import { DISEASES, VGG16_LAYERS } from '../config/constants';

let model: tf.LayersModel | null = null;

export async function loadModel() {
  try {
    // Create VGG16 model architecture
    model = await createVGG16Model();
    console.log('VGG16 model created successfully');
    
    // Load your trained weights here
    // await model.loadWeights('path/to/your/weights');
    
    // Keep the model warm
    const warmupInput = tf.zeros([1, 224, 224, 3]);
    model.predict(warmupInput);
    warmupInput.dispose();
    
    return true;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load VGG16 model');
  }
}

export async function predictDisease(imageFile: File): Promise<DetectionResult[]> {
  if (!model) {
    throw new Error('Model not loaded');
  }

  try {
    // Get preprocessed image tensor
    const imageTensor = await preprocessImage(imageFile);
    
    // Make prediction
    const predictions = await tf.tidy(() => {
      const expanded = imageTensor.expandDims(0);
      const results = model!.predict(expanded) as tf.Tensor;
      return results.dataSync();
    });
    
    // Clean up tensors
    imageTensor.dispose();
    
    // Convert to results format
    const results = Array.from(predictions).map((probability, index) => ({
      disease: DISEASES[index],
      probability: probability,
    }));
    
    // Sort by probability
    return results.sort((a, b) => b.probability - a.probability);
  } catch (error) {
    console.error('Prediction error:', error);
    throw new Error('Failed to process image');
  }
}

async function createVGG16Model(): Promise<tf.LayersModel> {
  const model = tf.sequential();

  // Input layer
  model.add(tf.layers.inputLayer({ inputShape: [224, 224, 3] }));

  // Add VGG16 layers
  VGG16_LAYERS.forEach(layer => {
    if (layer.type === 'conv') {
      model.add(tf.layers.conv2d({
        filters: layer.filters,
        kernelSize: layer.kernelSize,
        padding: 'same',
        activation: 'relu'
      }));
    } else if (layer.type === 'maxpool') {
      model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
      }));
    } else if (layer.type === 'dense') {
      model.add(tf.layers.dense({
        units: layer.units,
        activation: layer.activation
      }));
    } else if (layer.type === 'flatten') {
      model.add(tf.layers.flatten());
    } else if (layer.type === 'dropout') {
      model.add(tf.layers.dropout({ rate: layer.rate }));
    }
  });

  // Output layer
  model.add(tf.layers.dense({
    units: DISEASES.length,
    activation: 'softmax'
  }));

  // Compile model
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}
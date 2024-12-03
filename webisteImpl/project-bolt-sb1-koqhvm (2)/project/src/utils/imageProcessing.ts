import * as tf from '@tensorflow/tfjs';
import { IMAGE_SIZE } from '../config/constants';

export async function preprocessImage(file: File): Promise<tf.Tensor3D> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        try {
          // Convert image to tensor and preprocess
          const tensor = tf.tidy(() => {
            // Read image into tensor
            const imageTensor = tf.browser.fromPixels(img);
            
            // Resize to VGG16 input size
            const resized = tf.image.resizeBilinear(imageTensor, [
              IMAGE_SIZE.height,
              IMAGE_SIZE.width,
            ]);
            
            // Normalize pixel values to [0, 1]
            const normalized = resized.toFloat().div(tf.scalar(255));
            
            // Convert RGB to BGR (VGG16 expects BGR)
            const [r, g, b] = tf.split(normalized, 3, 2);
            const bgr = tf.concat([b, g, r], 2);
            
            // Subtract ImageNet mean
            return tf.sub(bgr, tf.tensor3d([0.485, 0.456, 0.406], [1, 1, 3])).div(
              tf.tensor3d([0.229, 0.224, 0.225], [1, 1, 3])
            );
          });
          
          resolve(tensor as tf.Tensor3D);
        } catch (error) {
          reject(new Error('Failed to process image'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
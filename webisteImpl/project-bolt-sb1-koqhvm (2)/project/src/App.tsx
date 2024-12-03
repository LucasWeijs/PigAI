import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ResultCard } from './components/ResultCard';
import { DetectionResult } from './types';
import { loadModel, predictDisease } from './services/modelService';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const initModel = async () => {
      try {
        await loadModel();
        setIsModelLoaded(true);
      } catch (err) {
        setError('Failed to load AI model. Please refresh the page.');
      }
    };
    initModel();
  }, []);

  const handleImageSelect = async (file: File) => {
    if (!isModelLoaded) {
      setError('Model is not ready yet. Please wait.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedImage(URL.createObjectURL(file));

    try {
      const predictions = await predictDisease(file);
      setResults(predictions);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pig Disease Detection
          </h1>
          <p className="text-lg text-gray-600">
            Upload an image to detect potential pig skin diseases
          </p>
          {!isModelLoaded && (
            <p className="text-sm text-yellow-600 mt-2">
              Loading AI model, please wait...
            </p>
          )}
        </div>

        <div className="mb-8">
          <ImageUpload 
            onImageSelect={handleImageSelect} 
            isLoading={isLoading} 
            disabled={!isModelLoaded}
          />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 rounded-lg flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {selectedImage && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Uploaded Image</h2>
              <img
                src={selectedImage}
                alt="Uploaded pig"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {results.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <ResultCard key={index} result={result} />
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-700">Analyzing image...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
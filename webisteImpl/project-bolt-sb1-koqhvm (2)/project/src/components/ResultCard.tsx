import React from 'react';
import { DetectionResult } from '../types';

interface ResultCardProps {
  result: DetectionResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const percentage = (result.probability * 100).toFixed(2);
  const isHighProbability = result.probability > 0.7;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">
          {result.disease.replace(/_/g, ' ')}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isHighProbability
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {percentage}%
        </span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            isHighProbability ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
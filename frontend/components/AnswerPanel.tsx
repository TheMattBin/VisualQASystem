import React from 'react';

interface AnswerPanelProps {
  response: any;
}

export default function AnswerPanel({ response }: AnswerPanelProps) {
  // Debug: log the response to the console
  console.log('AnswerPanel response:', response);

  if (!response) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow w-full">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Answer</h2>
        <p className="text-gray-500 dark:text-gray-400">No answer yet. Submit a question to see the answer here.</p>
      </div>
    );
  }

  // Try to extract a main answer from the response
  let mainAnswer = '';
  if (typeof response === 'string') {
    mainAnswer = response;
  } else if (response.answer) {
    mainAnswer = response.answer;
  } else if (response.result) {
    mainAnswer = response.result;
  } else {
    mainAnswer = JSON.stringify(response, null, 2);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow w-full">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Answer</h2>
      <div className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words mb-2">
        {mainAnswer}
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        <strong>Raw response:</strong>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    </div>
  );
}

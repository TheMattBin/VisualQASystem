"use client";
import UploadForm from '../components/UploadForm';
import AnswerPanel from '../components/AnswerPanel';
import { useState } from 'react';

export default function Home() {
  const [response, setResponse] = useState<any>(null);
  return (
    <>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-12 max-w-6xl w-full flex flex-col md:flex-row gap-12 min-h-[600px]">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-10 text-center">
              Simple VQA System
            </h1>
            <UploadForm onResponse={setResponse} />
          </div>
          <div className="flex-1 flex items-center">
            <AnswerPanel response={response} />
          </div>
        </div>
      </div>

    </>
  );
}

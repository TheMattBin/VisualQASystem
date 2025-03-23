"use client";

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // State for image preview
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Generate a preview URL for the selected image
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !question) {
      setError('Please select a file and enter a question.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('question', question);

    try {
      const response = await fetch('http://localhost:8000/vqa', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploaded(true);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred during upload.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Image
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-2">Image Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg border border-gray-300"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Your Question
        </label>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your question"
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Upload and Ask
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {uploaded && <p className="text-green-500 text-sm mt-2">Question submitted successfully!</p>}
    </form>
  );
}

"use client";

import { useState } from 'react';
import styles from './UploadForm.module.css'; // Correctly import the CSS module

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // State for image preview
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [response, setResponse] = useState(null); // State for storing the response from the backend

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
        setResponse(data); // Store the response from the backend
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred during upload.');
        setResponse(null);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setResponse(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label className={styles.label}>Upload Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className={styles.input}
        />
      </div>
      {preview && (
        <div className={styles.previewContainer}>
          <p className={styles.label}>Image Preview:</p>
          <img src={preview} alt="Preview" className={styles.previewImage} />
        </div>
      )}
      <div>
        <label className={styles.label}>Your Question</label>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your question"
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.button}>
        Upload and Ask
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {uploaded && <p className={styles.success}>Question submitted successfully!</p>}
      {response && (
        <div className={styles.responseContainer}>
          <h2 className={styles.responseTitle}>Response:</h2>
          <pre className={styles.responseText}>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}

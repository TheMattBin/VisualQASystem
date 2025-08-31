"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './UploadForm.module.css';

interface BackendResponse {
  [key: string]: any;
}

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [response, setResponse] = useState<BackendResponse | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  };

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        setResponse(data);
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

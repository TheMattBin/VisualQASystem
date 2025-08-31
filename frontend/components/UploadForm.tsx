"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './UploadForm.module.css';

interface BackendResponse {
  [key: string]: any;
}

interface UploadFormProps {
  onResponse: (response: BackendResponse | null) => void;
}

export default function UploadForm({ onResponse }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [userId, setUserId] = useState<string>('testuser');
  const [error, setError] = useState<string>('');
  const [uploaded, setUploaded] = useState<boolean>(false);

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

  const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploaded(false); // Reset uploaded state on new submission
    if (!question) {
      setError('Please enter a question.');
      return;
    }
    if (!userId) {
      setError('Please enter a user ID.');
      return;
    }
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('question', question);
    formData.append('user_id', userId);
    try {
      const response = await fetch('http://localhost:8000/vqa', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setUploaded(true);
        setError('');
        onResponse(data);
        // Optionally clear form after successful upload
        setFile(null);
        setPreview(null);
        setQuestion('');
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred during upload.');
        onResponse(null);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      onResponse(null);
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
        <label className={styles.label}>User ID</label>
        <input
          type="text"
          value={userId}
          onChange={handleUserIdChange}
          placeholder="Enter your user ID"
          className={styles.input}
        />
      </div>
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
    </form>
  );
}

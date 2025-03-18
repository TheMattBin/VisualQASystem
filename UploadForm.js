import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <input type="text" value={question} onChange={handleQuestionChange} placeholder="Enter your question" />
      <button type="submit">Upload and Ask</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploaded && <p>Question submitted successfully!</p>}
    </form>
  );
}

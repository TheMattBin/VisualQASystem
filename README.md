yarn dev

# Smart Visual Q&A System

>A Visual Language Model (VLM) powered Question Answering system for Home Inventory Management.

## Features
- Upload an image and ask a question about it, or just ask a question (image optional)
- Receives answers from a multimodal AI backend (Gemma-3)
- Dark/light/system theme toggle
- Query history stored in SQLite

## Project Structure
- **frontend/**: Next.js 14 app (React, Tailwind CSS, next-themes)
- **backend/**: FastAPI app with HuggingFace Gemma-3 model, SQLite, and image handling

## Getting Started

### 1. Backend Setup
1. Install Python dependencies:
	```bash
	pip install -r requirements.txt
	```
2. Create a `.env` file in `backend/` with your HuggingFace token:
	```
	HUGGINGFACE_TOKEN=your_token_here
	```
3. Start the backend:
	```bash
	uvicorn vqa_gemma:app --host 0.0.0.0 --port 8000 --reload
	```

### 2. Frontend Setup
1. Install Node dependencies:
	```bash
	npm install
	```
2. Start the frontend:
	```bash
	npm run dev
	```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Upload an image (optional), enter your user ID and question, and submit.
- The answer will appear in the Answer panel.

## Tech Stack
- Next.js, React, Tailwind CSS, next-themes
- FastAPI, HuggingFace Transformers, SQLite, SQLAlchemy
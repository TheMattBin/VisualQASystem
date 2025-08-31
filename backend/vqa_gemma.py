# Standard library imports
import os
import uuid
from datetime import datetime

from PIL import Image
from dotenv import load_dotenv

from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base

import torch
from transformers import AutoProcessor, Gemma3ForConditionalGeneration

# Database Configuration
DATABASE_URL = "sqlite:///./vqa.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class QueryHistory(Base):
    __tablename__ = "query_history"
    __table_args__ = {'extend_existing': True}  # Add this line
    id = Column(String(36), primary_key=True)
    image_path = Column(String(512))
    question = Column(Text)
    answer = Column(Text)
    timestamp = Column(DateTime)
    user_id = Column(String(64))  # Add your user auth system here

Base.metadata.create_all(bind=engine)

# Image Storage Configuration
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

load_dotenv()
HF_TOKEN = os.environ.get("HUGGINGFACE_TOKEN")

# Model Initialization
model_id = "google/gemma-3-4b-it"
model = Gemma3ForConditionalGeneration.from_pretrained(model_id, device_map="auto", token=HF_TOKEN).eval()
processor = AutoProcessor.from_pretrained(model_id)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QARequest(BaseModel):
    question: str
    user_id: str

@app.post("/vqa")
async def process_vqa(
    image: UploadFile = File(None),
    question: str = Form(...),
    user_id: str = Form(...)
):
    file_id = str(uuid.uuid4())
    save_path = None

    # If image is provided, handle and save it
    if image is not None:
        if not image.content_type.startswith('image/'):
            raise HTTPException(400, "Invalid image format")
        file_ext = os.path.splitext(image.filename)[1]
        save_path = f"{UPLOAD_DIR}/{file_id}{file_ext}"
        try:
            with Image.open(image.file) as img:
                img.convert("RGB").save(save_path)
        except IOError:
            raise HTTPException(400, "Invalid image file")

    # Build messages for model
    user_content = []
    if save_path:
        user_content.append({"type": "image", "image": save_path})
    user_content.append({"type": "text", "text": question})

    messages = [
        {
            "role": "system",
            "content": [{"type": "text", "text": "You are a helpful assistant."}]
        },
        {
            "role": "user",
            "content": user_content
        }
    ]

    inputs = processor.apply_chat_template(
        messages, add_generation_prompt=True, tokenize=True,
        return_dict=True, return_tensors="pt"
    ).to(model.device, dtype=torch.bfloat16)

    input_len = inputs["input_ids"].shape[-1]

    with torch.inference_mode():
        generation = model.generate(**inputs, max_new_tokens=100, do_sample=False)
        generation = generation[0][input_len:]

    decoded = processor.decode(generation, skip_special_tokens=True)

    # Database Storage
    db_record = QueryHistory(
        id=file_id,
        image_path=save_path if save_path else "",
        question=question,
        answer=decoded,
        timestamp=datetime.now(),
        user_id=user_id
    )

    with SessionLocal() as session:
        session.add(db_record)
        session.commit()

    return {"answer": decoded, "query_id": file_id}


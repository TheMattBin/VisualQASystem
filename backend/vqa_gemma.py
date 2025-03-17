from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from datetime import datetime
import os
import uuid
from PIL import Image
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from transformers import AutoProcessor, Gemma3ForConditionalGeneration
import requests
import torch

# Database Configuration
DATABASE_URL = "sqlite:///./vqa.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class QueryHistory(Base):
    __tablename__ = "query_history"
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

# Model Initialization
model_id = "google/gemma-3-4b-it"
model = Gemma3ForConditionalGeneration.from_pretrained(model_id, device_map="auto").eval()
processor = AutoProcessor.from_pretrained(model_id)

app = FastAPI()

class QARequest(BaseModel):
    question: str
    user_id: str

@app.post("/vqa")
async def process_vqa(
    image: UploadFile = File(...),
    question: str = Form(...),
    user_id: str = Form(...)
):
    # Image Handling
    if not image.content_type.startswith('image/'):
        raise HTTPException(400, "Invalid image format")
    
    file_ext = os.path.splitext(image.filename)[1]
    file_id = str(uuid.uuid4())
    save_path = f"{UPLOAD_DIR}/{file_id}{file_ext}"
    
    try:
        with Image.open(image.file) as img:
            img.convert("RGB").save(save_path)
    except IOError:
        raise HTTPException(400, "Invalid image file")

    # Generate Answer with Gemma-3
    messages = [
        {
            "role": "system",
            "content": [{"type": "text", "text": "You are a helpful assistant."}]
        },
        {
            "role": "user",
            "content": [
                {"type": "image", "image": save_path},
                {"type": "text", "text": question}
            ]
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
        image_path=save_path,
        question=question,
        answer=decoded,
        timestamp=datetime.now(),
        user_id=user_id
    )

    with SessionLocal() as session:
        session.add(db_record)
        session.commit()

    return {"answer": decoded, "query_id": file_id}

# main.py
import os
import uuid
from datetime import datetime
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from db import SessionLocal, QueryHistory
from vqa_model import get_vqa_answer

app = FastAPI()

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

UPLOAD_DIR = "uploads"

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

    decoded = get_vqa_answer(messages)

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

# vqa_model.py
import os
from dotenv import load_dotenv
import torch
from transformers import AutoProcessor, Gemma3ForConditionalGeneration

load_dotenv()
HF_TOKEN = os.environ.get("HUGGINGFACE_TOKEN")

model_id = "google/gemma-3-4b-it"
model = Gemma3ForConditionalGeneration.from_pretrained(model_id, device_map="auto", token=HF_TOKEN).eval()
processor = AutoProcessor.from_pretrained(model_id)

def get_vqa_answer(messages):
    inputs = processor.apply_chat_template(
        messages, add_generation_prompt=True, tokenize=True,
        return_dict=True, return_tensors="pt"
    ).to(model.device, dtype=torch.bfloat16)
    input_len = inputs["input_ids"].shape[-1]
    with torch.inference_mode():
        generation = model.generate(**inputs, max_new_tokens=100, do_sample=False)
        generation = generation[0][input_len:]
    decoded = processor.decode(generation, skip_special_tokens=True)
    return decoded

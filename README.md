# SmartVisualQASystem
Smart Visual Q&amp;A System for Home Inventory Management

```
graph TD
  A[User Uploads Image] --> B[Image Encoder]
  C[User Asks Question] --> D[Text Tokenizer]
  B --> E[Multimodal Fusion]
  D --> E
  E --> F[VLM Inference]
  F --> G[JSON Response Parser]
  G --> H[Answer Display]
```

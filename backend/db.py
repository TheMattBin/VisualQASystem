# db.py
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./vqa.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class QueryHistory(Base):
    __tablename__ = "query_history"
    __table_args__ = {'extend_existing': True}
    id = Column(String(36), primary_key=True)
    image_path = Column(String(512))
    question = Column(Text)
    answer = Column(Text)
    timestamp = Column(DateTime)
    user_id = Column(String(64))

Base.metadata.create_all(bind=engine)

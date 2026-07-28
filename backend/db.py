# db.py
from sqlalchemy import Column, DateTime, String, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./vqa.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class QueryHistory(Base):
    __tablename__ = "query_history"
    __table_args__ = {"extend_existing": True}
    id = Column(String(36), primary_key=True)
    image_path = Column(String(512))
    question = Column(Text)
    answer = Column(Text)
    timestamp = Column(DateTime)
    user_id = Column(String(64))


Base.metadata.create_all(bind=engine)

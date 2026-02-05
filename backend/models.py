from sqlalchemy import Column, Integer, String, DateTime, Float
from database import Base
from datetime import datetime


class User(Base):
    

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="user")  # admin, doctor, user


class InhalerLog(Base):
    __tablename__ = "inhaler_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    inhaler_used = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    symptom = Column(String, nullable=False)
    severity = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

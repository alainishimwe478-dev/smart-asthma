from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db, engine
from models import User
from sqlalchemy.exc import IntegrityError
from typing import Any
import hashlib


router = APIRouter()


class SignupRequest(BaseModel):
	full_name: str
	email: EmailStr
	password: str


@router.post("/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> Any:
	"""Create a new user with full_name, email and password."""
	# simple password hashing with sha256 (replace with bcrypt in production)
	hashed = hashlib.sha256(payload.password.encode()).hexdigest()
	user = User(full_name=payload.full_name, email=payload.email, password=hashed)
	try:
		db.add(user)
		db.commit()
		db.refresh(user)
	except IntegrityError:
		db.rollback()
		raise HTTPException(status_code=400, detail="Email already registered")
	return {"id": user.id, "email": user.email, "full_name": user.full_name}



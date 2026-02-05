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
    
	email: EmailStr
	password: str

class LoginRequest(BaseModel):
    
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


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.email == payload.email).first()
	if not user or hashlib.sha256(payload.password.encode()).hexdigest() != user.password:
		raise HTTPException(status_code=400, detail="Invalid credentials")
	access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
	access_token = create_access_token(
		data={"sub": user.email}, expires_delta=access_token_expires
	)
	return {"access_token": access_token, "token_type": "bearer", "role": user.role}


@router.get("/doctor/dashboard/")
def doctor_dashboard(doctor: User = Depends(get_current_doctor), db: Session = Depends(get_db)):
	patients = db.query(User).filter(User.role == "user").all()
	return [{"patient_id": p.id, "full_name": p.full_name, "email": p.email} for p in patients]


@router.get("/doctor/daily-summary/{user_id}")
def doctor_daily_summary(
	user_id: int,
	doctor: User = Depends(get_current_doctor),
	db: Session = Depends(get_db)
):
	results = (
		db.query(
			func.date(InhalerLog.created_at).label("date"),
			func.sum(InhalerLog.inhaler_used).label("total_inhaler_used")
		)
		.filter(InhalerLog.user_id == user_id)
		.group_by(func.date(InhalerLog.created_at))
		.order_by(func.date(InhalerLog.created_at))
		.all()
	)

	return [
		{
			"date": r.date,
			"total_inhaler_used": r.total_inhaler_used
		}
		for r in results
	]


@router.get("/daily-summary/")
def daily_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	results = (
		db.query(
			func.date(InhalerLog.created_at).label("date"),
			func.sum(InhalerLog.inhaler_used).label("total_inhaler_used")
		)
		.filter(InhalerLog.user_id == current_user.id)
		.group_by(func.date(InhalerLog.created_at))
		.order_by(func.date(InhalerLog.created_at))
		.all()
	)

	return [
		{
			"date": r.date,
			"total_inhaler_used": r.total_inhaler_used
		}
		for r in results
	]

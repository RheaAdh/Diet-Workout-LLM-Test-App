from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from transformers import pipeline
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:" + os.getenv("DB_PASSWORD") + "@127.0.0.1:3306/health"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Load Hugging Face pipeline for text generation
diet_plan_generator = pipeline("text-generation", model="gpt2")  
workout_plan_generator = pipeline("text-generation", model="gpt2") 

class UserInput(BaseModel):
    age: int
    gender: str
    height_feet: int
    height_inches: Optional[int] = 0
    weight: float
    workout_days: int
    diet_type: str  # Veg/Non-Veg
    dietary_restrictions: Optional[str] = None

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer)
    gender = Column(String(10))
    height = Column(Float)
    weight = Column(Float)
    workout_days = Column(Integer)
    diet_type = Column(String(10))
    dietary_restrictions = Column(String(255), nullable=True)

def feet_inches_to_cm(feet: int, inches: int = 0) -> float:
    return (feet * 30.48) + (inches * 2.54)

def calculate_bmi(height_cm: float, weight: float) -> float:
    return weight / (height_cm / 100) ** 2

def generate_diet_plan(user_input: UserInput) -> str:
    height_cm = feet_inches_to_cm(user_input.height_feet, user_input.height_inches)
    prompt = (
        f"Create a diet plan for a {user_input.age}-year-old {user_input.gender}, "
        f"{height_cm} cm tall, weighing {user_input.weight} kg, who works out {user_input.workout_days} days a week. "
        f"Prefer a {user_input.diet_type} diet with restrictions: {user_input.dietary_restrictions or 'none'}. "
        f"Include meals for breakfast, lunch, dinner, and snacks with portion sizes."
    )
    
    response = diet_plan_generator(prompt, max_length=250)
    return response[0]['generated_text'].strip()

def generate_workout_plan(user_input: UserInput) -> str:
    prompt = (
        f"Create a workout plan for a {user_input.age}-year-old {user_input.gender} "
        f"who weighs {user_input.weight} kg and works out {user_input.workout_days} days a week. "
        f"Include specific exercises, sets, and reps."
    )
    response = workout_plan_generator(prompt, max_length=250)
    return response[0]['generated_text'].strip()

@app.post("/generate_plan/")
async def create_plan(user_input: UserInput):
    try:
        height_cm = feet_inches_to_cm(user_input.height_feet, user_input.height_inches)
        bmi = calculate_bmi(height_cm, user_input.weight)

        diet_plan = generate_diet_plan(user_input)
        workout_plan = generate_workout_plan(user_input)

        return {
            "BMI": round(bmi, 2),
            "Diet Plan": diet_plan,
            "Workout Plan": workout_plan
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

Base.metadata.create_all(bind=engine)
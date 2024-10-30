# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import openai
import os

from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:"+os.getenv("DB_PASSWORD")+"@127.0.0.1:3306/health"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

openai.api_key = os.getenv("OPEN_API_KEY")

class UserInput(BaseModel):
    age: int
    gender: str
    height_feet: int  # Height in feet
    height_inches: Optional[int] = 0  # Additional inches (optional)
    weight: float  # Weight in kg
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

def generate_plan(user_input: UserInput) -> Dict:
    height_cm = feet_inches_to_cm(user_input.height_feet, user_input.height_inches)
    prompt = (
        f"Create a diet and workout plan for a {user_input.age}-year-old {user_input.gender} "
        f"who is {height_cm} cm tall and weighs {user_input.weight} kg. They work out "
        f"{user_input.workout_days} days a week, prefer a {user_input.diet_type} diet, "
        f"and have the following dietary restrictions: {user_input.dietary_restrictions or 'none'}."
    )
    
    # Updated method for API call
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Consider using "gpt-4" if applicable
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )
    
    plan = response.choices[0].message['content'].strip()
    return {"plan": plan}

@app.post("/generate_plan/")
async def create_plan(user_input: UserInput):
    try:
        height_cm = feet_inches_to_cm(user_input.height_feet, user_input.height_inches)
        bmi = calculate_bmi(height_cm, user_input.weight)
        
        plan = generate_plan(user_input)
        
        return {
            "BMI": round(bmi, 2),
            "Diet and Workout Plan": plan["plan"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

Base.metadata.create_all(bind=engine)

# Run with: uvicorn main:app --reload

"""
DSA Tracker Backend - FastAPI + SQLModel + SQLite

Run with: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Optional, List
from datetime import datetime, date
from enum import Enum
from pydantic import BaseModel

# Database setup
DATABASE_URL = "sqlite:///./dsa_tracker.db"
engine = create_engine(DATABASE_URL, echo=True)

# Enums
class Difficulty(str, Enum):
    Easy = "Easy"
    Medium = "Medium"
    Hard = "Hard"

# XP Rewards
XP_REWARDS = {
    Difficulty.Easy: 10,
    Difficulty.Medium: 20,
    Difficulty.Hard: 40,
}
XP_PER_LEVEL = 200

# Models
class QuestionBase(SQLModel):
    title: str
    link: str
    topic: str
    difficulty: Difficulty
    notes: str = ""

class Question(QuestionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    solved: bool = False
    solved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(SQLModel):
    title: Optional[str] = None
    link: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    notes: Optional[str] = None
    solved: Optional[bool] = None

class User(SQLModel, table=True):
    id: int = Field(default=1, primary_key=True)
    xp: int = 0
    level: int = 0
    streak: int = 0
    last_solved_date: Optional[date] = None
    total_solved: int = 0

class Achievement(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    description: str
    icon: str
    requirement: str
    unlocked_at: Optional[datetime] = None

# Response models
class SolveResponse(BaseModel):
    xp_gained: int
    new_level: int
    leveled_up: bool
    new_streak: int
    streak_updated: bool
    new_achievements: List[Achievement]

class UserStats(BaseModel):
    xp: int
    level: int
    streak: int
    total_solved: int
    last_solved_date: Optional[str]

# Initialize database
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
    # Create default user if not exists
    with Session(engine) as session:
        user = session.get(User, 1)
        if not user:
            user = User(id=1)
            session.add(user)
            session.commit()
        
        # Create default achievements
        default_achievements = [
            Achievement(id="first_solve", name="First Blood", description="Solve your first question", icon="🎯", requirement="1 solve"),
            Achievement(id="ten_solved", name="Getting Started", description="Solve 10 questions", icon="🔟", requirement="10 solves"),
            Achievement(id="fifty_solved", name="Grinder", description="Solve 50 questions", icon="💪", requirement="50 solves"),
            Achievement(id="topic_mastery", name="Topic Master", description="Solve 5 questions in one topic", icon="🏆", requirement="5 in one topic"),
            Achievement(id="streak_beast", name="Streak Beast", description="Maintain a 7-day solving streak", icon="🔥", requirement="7-day streak"),
            Achievement(id="hard_solver", name="Hard Mode", description="Solve your first hard question", icon="💀", requirement="1 hard solve"),
            Achievement(id="level_up", name="Level Up!", description="Reach level 1", icon="⬆️", requirement="200 XP"),
        ]
        
        for ach in default_achievements:
            existing = session.get(Achievement, ach.id)
            if not existing:
                session.add(ach)
        session.commit()

# Dependency
def get_session():
    with Session(engine) as session:
        yield session

# FastAPI app
app = FastAPI(title="DSA Tracker API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Question endpoints
@app.get("/questions", response_model=List[Question])
def get_questions(session: Session = Depends(get_session)):
    return session.exec(select(Question)).all()

@app.post("/questions", response_model=Question)
def create_question(question: QuestionCreate, session: Session = Depends(get_session)):
    db_question = Question.from_orm(question)
    session.add(db_question)
    session.commit()
    session.refresh(db_question)
    return db_question

@app.get("/questions/{question_id}", response_model=Question)
def get_question(question_id: int, session: Session = Depends(get_session)):
    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@app.put("/questions/{question_id}", response_model=Question)
def update_question(question_id: int, question_update: QuestionUpdate, session: Session = Depends(get_session)):
    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    update_data = question_update.dict(exclude_unset=True)
    
    # Handle solving
    was_solved = question.solved
    if "solved" in update_data and update_data["solved"] and not was_solved:
        update_data["solved_at"] = datetime.utcnow()
    
    for key, value in update_data.items():
        setattr(question, key, value)
    
    session.add(question)
    session.commit()
    session.refresh(question)
    return question

@app.post("/questions/{question_id}/solve", response_model=SolveResponse)
def solve_question(question_id: int, session: Session = Depends(get_session)):
    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    if question.solved:
        raise HTTPException(status_code=400, detail="Question already solved")
    
    # Mark as solved
    question.solved = True
    question.solved_at = datetime.utcnow()
    session.add(question)
    
    # Get user
    user = session.get(User, 1)
    
    # Calculate XP
    xp_gained = XP_REWARDS[question.difficulty]
    new_xp = user.xp + xp_gained
    new_level = new_xp // XP_PER_LEVEL
    leveled_up = new_level > user.level
    
    # Update streak
    today = date.today()
    new_streak = user.streak
    streak_updated = False
    
    if user.last_solved_date != today:
        yesterday = date.today().replace(day=date.today().day - 1) if date.today().day > 1 else None
        if user.last_solved_date == yesterday:
            new_streak = user.streak + 1
            streak_updated = True
        else:
            new_streak = 1
            streak_updated = user.streak != 1
    
    # Update user
    user.xp = new_xp
    user.level = new_level
    user.streak = new_streak
    user.last_solved_date = today
    user.total_solved += 1
    session.add(user)
    
    # Check achievements
    new_achievements = []
    
    # First Solve
    if user.total_solved == 1:
        ach = session.get(Achievement, "first_solve")
        if ach and not ach.unlocked_at:
            ach.unlocked_at = datetime.utcnow()
            session.add(ach)
            new_achievements.append(ach)
    
    # 10 Solved
    if user.total_solved >= 10:
        ach = session.get(Achievement, "ten_solved")
        if ach and not ach.unlocked_at:
            ach.unlocked_at = datetime.utcnow()
            session.add(ach)
            new_achievements.append(ach)
    
    # 50 Solved
    if user.total_solved >= 50:
        ach = session.get(Achievement, "fifty_solved")
        if ach and not ach.unlocked_at:
            ach.unlocked_at = datetime.utcnow()
            session.add(ach)
            new_achievements.append(ach)
    
    # Topic Mastery
    questions = session.exec(select(Question).where(Question.solved == True)).all()
    topic_counts = {}
    for q in questions:
        topic_counts[q.topic] = topic_counts.get(q.topic, 0) + 1
    if any(count >= 5 for count in topic_counts.values()):
        ach = session.get(Achievement, "topic_mastery")
        if ach and not ach.unlocked_at:
            ach.unlocked_at = datetime.utcnow()
            session.add(ach)
            new_achievements.append(ach)
    
    # Streak Beast
    if new_streak >= 7:
        ach = session.get(Achievement, "streak_beast")
        if ach and not ach.unlocked_at:
            ach.unlocked_at = datetime.utcnow()
            session.add(ach)
            new_achievements.append(ach)
    
    # Hard Solver
    if question.difficulty == Difficulty.Hard:
        ach = session.get(Achievement, "hard_solver")
        if ach and not ach.unlocked_at:
            ach.unlocked_at = datetime.utcnow()
            session.add(ach)
            new_achievements.append(ach)
    
    # Level Up
    if leveled_up and new_level >= 1:
        ach = session.get(Achievement, "level_up")
        if ach and not ach.unlocked_at:
            ach.unlocked_at = datetime.utcnow()
            session.add(ach)
            new_achievements.append(ach)
    
    session.commit()
    
    return SolveResponse(
        xp_gained=xp_gained,
        new_level=new_level,
        leveled_up=leveled_up,
        new_streak=new_streak,
        streak_updated=streak_updated,
        new_achievements=new_achievements
    )

@app.delete("/questions/{question_id}")
def delete_question(question_id: int, session: Session = Depends(get_session)):
    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    session.delete(question)
    session.commit()
    return {"ok": True}

# Topics
@app.get("/topics", response_model=List[str])
def get_topics(session: Session = Depends(get_session)):
    questions = session.exec(select(Question)).all()
    topics = set(q.topic for q in questions)
    return sorted(list(topics))

# User
@app.get("/user", response_model=UserStats)
def get_user(session: Session = Depends(get_session)):
    user = session.get(User, 1)
    return UserStats(
        xp=user.xp,
        level=user.level,
        streak=user.streak,
        total_solved=user.total_solved,
        last_solved_date=str(user.last_solved_date) if user.last_solved_date else None
    )

# Achievements
@app.get("/achievements", response_model=List[Achievement])
def get_achievements(session: Session = Depends(get_session)):
    return session.exec(select(Achievement)).all()

@app.get("/user/achievements", response_model=List[Achievement])
def get_user_achievements(session: Session = Depends(get_session)):
    return session.exec(select(Achievement).where(Achievement.unlocked_at != None)).all()

# Reset
@app.post("/user/reset")
def reset_data(session: Session = Depends(get_session)):
    # Delete all questions
    questions = session.exec(select(Question)).all()
    for q in questions:
        session.delete(q)
    
    # Reset user
    user = session.get(User, 1)
    user.xp = 0
    user.level = 0
    user.streak = 0
    user.last_solved_date = None
    user.total_solved = 0
    session.add(user)
    
    # Reset achievements
    achievements = session.exec(select(Achievement)).all()
    for ach in achievements:
        ach.unlocked_at = None
        session.add(ach)
    
    session.commit()
    return {"ok": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

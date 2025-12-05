# DSA Tracker Backend (FastAPI)

This is the FastAPI backend for the DSA Progress Tracker. Since Lovable runs frontend-only, this backend code is provided as a reference that you can run locally.

## Setup

1. Install Python 3.9+
2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn sqlmodel pydantic
```

4. Run the server:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

## API Endpoints

### Questions
- `GET /questions` - List all questions
- `POST /questions` - Create a question
- `GET /questions/{id}` - Get a question
- `PUT /questions/{id}` - Update a question
- `DELETE /questions/{id}` - Delete a question

### Topics
- `GET /topics` - List all unique topics

### User & Gamification
- `GET /user` - Get user stats (XP, level, streak)
- `GET /achievements` - List all achievements
- `GET /user/achievements` - Get user's unlocked achievements
- `POST /user/reset` - Reset all data

## Database

Uses SQLite with SQLModel. Database file: `dsa_tracker.db`

"""
FastAPI main application for Online Exam System
Generated routes for all models
"""

from typing import List
from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import Base, engine, get_db, SessionLocal
from backend import crud, schemas
from backend.wait_for_db import wait_for_db

from backend import models, schemas, crud

# --- App init ---
app = FastAPI(title="Online Exam System API", version="1.0.0")

# --- Security headers middleware (basic hardening) ---
@app.middleware("http")
async def set_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("X-XSS-Protection", "0")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    response.headers.setdefault("Permissions-Policy", "geolocation=(), microphone=()")
    return response

# --- Optional CORS ---
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

# --- Startup: wait for DB & create tables ---
@app.on_event("startup")
def on_startup():
    wait_for_db(engine, timeout=60)
    # Import models so Base is populated
    import backend.models 
    Base.metadata.create_all(bind=engine)

# --- Health check ---
@app.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok"}


# User routes
@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: UUID, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, obj_in=user)

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: UUID, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db=db, db_obj=db_user, obj_in=user)

@app.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    db_user = crud.delete_user(db, id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# UserSession routes
@app.get("/user-sessions/", response_model=List[schemas.UserSession])
def read_user_sessions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user_sessions = crud.get_user_sessions(db, skip=skip, limit=limit)
    return user_sessions

@app.get("/user-sessions/{session_id}", response_model=schemas.UserSession)
def read_user_session(session_id: UUID, db: Session = Depends(get_db)):
    db_session = crud.get_user_session(db, id=session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="User session not found")
    return db_session

@app.post("/user-sessions/", response_model=schemas.UserSession)
def create_user_session(session: schemas.UserSessionCreate, db: Session = Depends(get_db)):
    return crud.create_user_session(db=db, obj_in=session)

@app.put("/user-sessions/{session_id}", response_model=schemas.UserSession)
def update_user_session(session_id: UUID, session: schemas.UserSessionUpdate, db: Session = Depends(get_db)):
    db_session = crud.get_user_session(db, id=session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="User session not found")
    return crud.update_user_session(db=db, db_obj=db_session, obj_in=session)

@app.delete("/user-sessions/{session_id}", response_model=schemas.UserSession)
def delete_user_session(session_id: UUID, db: Session = Depends(get_db)):
    db_session = crud.delete_user_session(db, id=session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="User session not found")
    return db_session

# UserToken routes
@app.get("/user-tokens/", response_model=List[schemas.UserToken])
def read_user_tokens(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user_tokens = crud.get_user_tokens(db, skip=skip, limit=limit)
    return user_tokens

@app.get("/user-tokens/{token_id}", response_model=schemas.UserToken)
def read_user_token(token_id: UUID, db: Session = Depends(get_db)):
    db_token = crud.get_user_token(db, id=token_id)
    if db_token is None:
        raise HTTPException(status_code=404, detail="User token not found")
    return db_token

@app.post("/user-tokens/", response_model=schemas.UserToken)
def create_user_token(token: schemas.UserTokenCreate, db: Session = Depends(get_db)):
    return crud.create_user_token(db=db, obj_in=token)

@app.put("/user-tokens/{token_id}", response_model=schemas.UserToken)
def update_user_token(token_id: UUID, token: schemas.UserTokenUpdate, db: Session = Depends(get_db)):
    db_token = crud.get_user_token(db, id=token_id)
    if db_token is None:
        raise HTTPException(status_code=404, detail="User token not found")
    return crud.update_user_token(db=db, db_obj=db_token, obj_in=token)

@app.delete("/user-tokens/{token_id}", response_model=schemas.UserToken)
def delete_user_token(token_id: UUID, db: Session = Depends(get_db)):
    db_token = crud.delete_user_token(db, id=token_id)
    if db_token is None:
        raise HTTPException(status_code=404, detail="User token not found")
    return db_token

# StudentProfile routes
@app.get("/student-profiles/", response_model=List[schemas.StudentProfile])
def read_student_profiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    student_profiles = crud.get_student_profiles(db, skip=skip, limit=limit)
    return student_profiles

@app.get("/student-profiles/{profile_id}", response_model=schemas.StudentProfile)
def read_student_profile(profile_id: UUID, db: Session = Depends(get_db)):
    db_profile = crud.get_student_profile(db, id=profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return db_profile

@app.post("/student-profiles/", response_model=schemas.StudentProfile)
def create_student_profile(profile: schemas.StudentProfileCreate, db: Session = Depends(get_db)):
    return crud.create_student_profile(db=db, obj_in=profile)

@app.put("/student-profiles/{profile_id}", response_model=schemas.StudentProfile)
def update_student_profile(profile_id: UUID, profile: schemas.StudentProfileUpdate, db: Session = Depends(get_db)):
    db_profile = crud.get_student_profile(db, id=profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return crud.update_student_profile(db=db, db_obj=db_profile, obj_in=profile)

@app.delete("/student-profiles/{profile_id}", response_model=schemas.StudentProfile)
def delete_student_profile(profile_id: UUID, db: Session = Depends(get_db)):
    db_profile = crud.delete_student_profile(db, id=profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return db_profile

# StudentExamQuestion routes
@app.get("/student-exam-questions/", response_model=List[schemas.StudentExamQuestion])
def read_student_exam_questions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    student_exam_questions = crud.get_student_exam_questions(db, skip=skip, limit=limit)
    return student_exam_questions

@app.get("/student-exam-questions/{question_id}", response_model=schemas.StudentExamQuestion)
def read_student_exam_question(question_id: UUID, db: Session = Depends(get_db)):
    db_question = crud.get_student_exam_question(db, id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Student exam question not found")
    return db_question

@app.post("/student-exam-questions/", response_model=schemas.StudentExamQuestion)
def create_student_exam_question(question: schemas.StudentExamQuestionCreate, db: Session = Depends(get_db)):
    return crud.create_student_exam_question(db=db, obj_in=question)

@app.put("/student-exam-questions/{question_id}", response_model=schemas.StudentExamQuestion)
def update_student_exam_question(question_id: UUID, question: schemas.StudentExamQuestionUpdate, db: Session = Depends(get_db)):
    db_question = crud.get_student_exam_question(db, id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Student exam question not found")
    return crud.update_student_exam_question(db=db, db_obj=db_question, obj_in=question)

@app.delete("/student-exam-questions/{question_id}", response_model=schemas.StudentExamQuestion)
def delete_student_exam_question(question_id: UUID, db: Session = Depends(get_db)):
    db_question = crud.delete_student_exam_question(db, id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Student exam question not found")
    return db_question

# TeacherProfile routes
@app.get("/teacher-profiles/", response_model=List[schemas.TeacherProfile])
def read_teacher_profiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    teacher_profiles = crud.get_teacher_profiles(db, skip=skip, limit=limit)
    return teacher_profiles

@app.get("/teacher-profiles/{profile_id}", response_model=schemas.TeacherProfile)
def read_teacher_profile(profile_id: UUID, db: Session = Depends(get_db)):
    db_profile = crud.get_teacher_profile(db, id=profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    return db_profile

@app.post("/teacher-profiles/", response_model=schemas.TeacherProfile)
def create_teacher_profile(profile: schemas.TeacherProfileCreate, db: Session = Depends(get_db)):
    return crud.create_teacher_profile(db=db, obj_in=profile)

@app.put("/teacher-profiles/{profile_id}", response_model=schemas.TeacherProfile)
def update_teacher_profile(profile_id: UUID, profile: schemas.TeacherProfileUpdate, db: Session = Depends(get_db)):
    db_profile = crud.get_teacher_profile(db, id=profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    return crud.update_teacher_profile(db=db, db_obj=db_profile, obj_in=profile)

@app.delete("/teacher-profiles/{profile_id}", response_model=schemas.TeacherProfile)
def delete_teacher_profile(profile_id: UUID, db: Session = Depends(get_db)):
    db_profile = crud.delete_teacher_profile(db, id=profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    return db_profile

# QuestionCategory routes
@app.get("/question-categories/", response_model=List[schemas.QuestionCategory])
def read_question_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    question_categories = crud.get_question_categories(db, skip=skip, limit=limit)
    return question_categories

@app.get("/question-categories/{category_id}", response_model=schemas.QuestionCategory)
def read_question_category(category_id: UUID, db: Session = Depends(get_db)):
    db_category = crud.get_question_category(db, id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Question category not found")
    return db_category

@app.post("/question-categories/", response_model=schemas.QuestionCategory)
def create_question_category(category: schemas.QuestionCategoryCreate, db: Session = Depends(get_db)):
    return crud.create_question_category(db=db, obj_in=category)

@app.put("/question-categories/{category_id}", response_model=schemas.QuestionCategory)
def update_question_category(category_id: UUID, category: schemas.QuestionCategoryUpdate, db: Session = Depends(get_db)):
    db_category = crud.get_question_category(db, id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Question category not found")
    return crud.update_question_category(db=db, db_obj=db_category, obj_in=category)

@app.delete("/question-categories/{category_id}", response_model=schemas.QuestionCategory)
def delete_question_category(category_id: UUID, db: Session = Depends(get_db)):
    db_category = crud.delete_question_category(db, id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Question category not found")
    return db_category

# Question routes
@app.get("/questions/", response_model=List[schemas.Question])
def read_questions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    questions = crud.get_questions(db, skip=skip, limit=limit)
    return questions

@app.get("/questions/{question_id}", response_model=schemas.Question)
def read_question(question_id: UUID, db: Session = Depends(get_db)):
    db_question = crud.get_question(db, id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@app.post("/questions/", response_model=schemas.Question)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db=db, obj_in=question)

@app.put("/questions/{question_id}", response_model=schemas.Question)
def update_question(question_id: UUID, question: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    db_question = crud.get_question(db, id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return crud.update_question(db=db, db_obj=db_question, obj_in=question)

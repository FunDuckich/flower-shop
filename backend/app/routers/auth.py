from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.user import User as UserModel
from ..schemas.user import UserCreate, User
from ..utils import get_password_hash, create_access_token, authenticate_user
from datetime import timedelta, date

router = APIRouter()


@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.client_name}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=User)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    stmt = select(UserModel).where(UserModel.client_name == user.client_name)
    result = await db.execute(stmt)
    db_user = result.scalars().first()

    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = get_password_hash(user.password)
    new_user = UserModel(
        client_name=user.client_name,
        hashed_password=hashed_password,
        registration_date=date.today()
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

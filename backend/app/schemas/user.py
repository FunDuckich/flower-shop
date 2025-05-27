from pydantic import BaseModel
from datetime import date


class UserBase(BaseModel):
    client_name: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    registration_date: date
    is_admin: bool
    is_active: bool

    class Config:
        from_attributes = True

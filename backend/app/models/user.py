from sqlalchemy import Column, Integer, String, Boolean, Date
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "client"
    id = Column(Integer, primary_key=True)
    client_name = Column(String(20), nullable=False)
    registration_date = Column(Date, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

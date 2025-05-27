from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class ProductCategory(Base):
    __tablename__ = "product_category"
    id = Column(Integer, primary_key=True)
    category_name = Column(String(30), unique=True)

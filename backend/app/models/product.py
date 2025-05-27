from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True)
    producer_id = Column(Integer, ForeignKey("producer.id"))
    category_id = Column(Integer, ForeignKey("product_category.id"))
    product_name = Column(String(30), nullable=False)
    description = Column(String)
    available_amount = Column(Integer, nullable=False)

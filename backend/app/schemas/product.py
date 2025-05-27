from pydantic import BaseModel


class ProductBase(BaseModel):
    product_name: str
    description: str | None = None
    available_amount: int


class ProductCreate(ProductBase):
    producer_id: int
    category_id: int


class Product(ProductBase):
    id: int
    producer_id: int
    category_id: int

    class Config:
        from_attributes = True

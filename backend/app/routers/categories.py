from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import ProductCategory
from ..schemas import Category, CategoryCreate
from ..utils import get_current_admin_user

router = APIRouter()


@router.post("/", response_model=Category)
async def create_category(
        category: CategoryCreate,
        db: AsyncSession = Depends(get_db),
        _: None = Depends(get_current_admin_user)
):
    db_category = ProductCategory(**category.model_dump())
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category


@router.get("/", response_model=list[Category])
async def read_categories(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    stmt = select(ProductCategory).offset(skip).limit(limit)
    result = await db.execute(stmt)
    categories = result.scalars().all()
    return categories


@router.get("/{category_id}", response_model=Category)
async def read_category(category_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(ProductCategory).where(ProductCategory.id == category_id)
    result = await db.execute(stmt)
    category = result.scalars().first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=Category)
async def update_category(
        category_id: int,
        category: CategoryCreate,
        db: AsyncSession = Depends(get_db),
        _: None = Depends(get_current_admin_user)
):
    stmt = select(ProductCategory).where(ProductCategory.id == category_id)
    result = await db.execute(stmt)
    db_category = result.scalars().first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, value in category.model_dump().items():
        setattr(db_category, key, value)

    await db.commit()
    await db.refresh(db_category)
    return db_category


@router.delete("/{category_id}")
async def delete_category(
        category_id: int,
        db: AsyncSession = Depends(get_db),
        _: None = Depends(get_current_admin_user)
):
    stmt = select(ProductCategory).where(ProductCategory.id == category_id)
    result = await db.execute(stmt)
    db_category = result.scalars().first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.delete(db_category)
    await db.commit()
    return {"message": "Category deleted"}

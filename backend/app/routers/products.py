from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Product as ProductModel
from ..schemas import Product as ProductSchema
from ..utils import get_current_active_user, get_current_admin_user

router = APIRouter()


@router.get("/", response_model=list[ProductSchema])
async def read_products(
        category_id: int | None = Query(None),
        producer_id: int | None = Query(None),
        db: AsyncSession = Depends(get_db)
):
    stmt = select(ProductModel)
    if category_id is not None:
        stmt = stmt.where(ProductModel.category_id == category_id)
    if producer_id is not None:
        stmt = stmt.where(ProductModel.producer_id == producer_id)
    result = await db.execute(stmt)
    products = result.scalars().all()
    return products


@router.post("/orders/")
async def create_order(
        address_id: int,
        payment_method_id: int,
        db: AsyncSession = Depends(get_db),
        current_user=Depends(get_current_active_user)
):
    query = text(
        "CALL process_new_order_from_cart("
        ":client_id, :address_id, :payment_method_id, :out_order_id, :out_status_message)"
    )
    await db.execute(query, {
        "client_id": current_user.id,
        "address_id": address_id,
        "payment_method_id": payment_method_id,
        "out_order_id": 0,
        "out_status_message": ""
    })
    await db.commit()
    return {"message": "Order placed successfully"}


@router.get("/reports/total_sales_by_producer")
async def get_total_sales_by_producer(
        db: AsyncSession = Depends(get_db),
        _: None = Depends(get_current_admin_user)
):
    query = text("SELECT * FROM total_sales_by_producer_report")
    result = await db.execute(query)
    rows = result.fetchall()
    return rows

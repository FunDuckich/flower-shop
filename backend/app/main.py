from fastapi import FastAPI
from .routers import auth_router as auth, products_router as products, categories_router as categories
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth, prefix="/auth", tags=["auth"])
app.include_router(products, prefix="/products", tags=["products"])
app.include_router(categories, prefix="/categories", tags=["categories"])


@app.get("/")
async def root():
    return {"message": "Flower Shop API"}

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.sweets import QuantityUpdate, SweetCreate, SweetUpdate, SweetResponse
from app.core.deps import get_current_user
from app.models.sweets import Sweet

router = APIRouter(prefix="/sweets", tags=["sweets"])


@router.post("", response_model=SweetResponse, status_code=status.HTTP_201_CREATED)
def create_sweet(
    sweet: SweetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_sweet = Sweet(**sweet.model_dump())
    db.add(db_sweet)
    db.commit()
    db.refresh(db_sweet)
    return db_sweet


@router.get("", response_model=List[SweetResponse])
def get_sweets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sweets = db.query(Sweet).all()
    return sweets


@router.get("/search", response_model=List[SweetResponse])
def search_sweets(
    name: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Sweet)
    
    if name:
        query = query.filter(Sweet.name.ilike(f"%{name}%"))
    
    if category:
        query = query.filter(Sweet.category.ilike(f"%{category}%"))
    
    if min_price is not None:
        query = query.filter(Sweet.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Sweet.price <= max_price)
    
    sweets = query.all()
    return sweets


@router.put("/{sweet_id}", response_model=SweetResponse)
def update_sweet(
    sweet_id: int,
    sweet_update: SweetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    
    update_data = sweet_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sweet, field, value)
    
    db.commit()
    db.refresh(db_sweet)
    return db_sweet


@router.post("/{sweet_id}/purchase", response_model=SweetResponse)
def purchase_sweet(
    sweet_id: int,
    quantity: QuantityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    
    if db_sweet.quantity < quantity.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient quantity in stock"
        )
    
    db_sweet.quantity -= quantity.quantity
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

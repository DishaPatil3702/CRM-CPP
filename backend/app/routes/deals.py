#crm-sys/backend/app/routes/deals.py
#from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi import APIRouter, HTTPException, Depends
from app.routes.auth import get_current_user 
from app.models.deals import Deal, DealCreate, DealUpdate
from app.services.supabase_client import supabase
from datetime import datetime

router = APIRouter(prefix="/deals", tags=["Deals"])

# Get all deals
# Get all deals, most recent first
@router.get("/", response_model=list[Deal])
async def get_deals():
    response = (
        supabase.table("deals")
        .select("*")
        .order("created_at", desc=True)  # ← order by created_at descending
        .execute()
    )
    if not response.data:
        return []  # return empty list if no deals
    return response.data


# Get a single deal
@router.get("/{deal_id}", response_model=Deal)
async def get_deal(deal_id: int):
    response = supabase.table("deals").select("*").eq("id", deal_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Deal not found")
    return response.data

# Create deal

@router.post("/", response_model=Deal)
async def create_deal(
    deal: DealCreate,
    current_user=Depends(get_current_user)
):
    deal_dict = deal.dict()

    # Get logged-in user id
    email = current_user["email"]

    user = supabase.table("users") \
        .select("id") \
        .eq("email", email) \
        .single() \
        .execute()

    user_id = user.data["id"]

    # Assign owner automatically
    deal_dict["owner_id"] = user_id

    if "close_date" in deal_dict and deal_dict["close_date"]:
        deal_dict["close_date"] = str(deal_dict["close_date"])

    response = supabase.table("deals").insert(deal_dict).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create deal")

    new_deal = response.data[0]

# 🔥 Log Activity
    supabase.table("activities").insert({
        "user_email": current_user["email"],
        "type": "deal_created",
        "message": f"New deal created worth ₹{new_deal.get('value')}",
        "amount": new_deal.get("value"),
        "created_at": datetime.utcnow().isoformat()
    }).execute()

    return new_deal
    
    

# Update deal
@router.put("/{deal_id}", response_model=Deal)
async def update_deal(
    deal_id: int,
    deal: DealUpdate,
    current_user=Depends(get_current_user)
):
    update_data = deal.dict(exclude_unset=True)

    if "close_date" in update_data and update_data["close_date"]:
        update_data["close_date"] = str(update_data["close_date"])

    response = supabase.table("deals").update(update_data).eq("id", deal_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Deal not found or update failed")

    updated_deal = response.data[0]

    # 🔥 Log WON separately
    if updated_deal.get("stage", "").lower() == "won":
        supabase.table("activities").insert({
            "user_email": current_user["email"],
            "type": "deal_won",
            "message": f"Deal closed WON worth ₹{updated_deal.get('value')}",
            "amount": updated_deal.get("value"),
            "created_at": datetime.utcnow().isoformat()
        }).execute()
    else:
        supabase.table("activities").insert({
            "user_email": current_user["email"],
            "type": "deal_updated",
            "message": f"Deal updated worth ₹{updated_deal.get('value')}",
            "created_at": datetime.utcnow().isoformat()
        }).execute()

    return updated_deal

# Delete deal
@router.delete("/{deal_id}")
async def delete_deal(deal_id: int):
    response = supabase.table("deals").delete().eq("id", deal_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Deal not found or already deleted")
    return {"message": "Deal deleted successfully"}

from fastapi import APIRouter, Depends, HTTPException
from .auth import get_current_user
from app.services.supabase_client import supabase
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
#router = APIRouter()


@router.get("/stats")
def get_dashboard_stats(current_user=Depends(get_current_user)):

    email = current_user.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Invalid user")

    # Get user id safely
    user_res = supabase.table("users") \
        .select("id") \
        .eq("email", email) \
        .single() \
        .execute()

    if not user_res.data:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user_res.data["id"]

    # Fetch leads
    leads_res = supabase.table("leads") \
        .select("*") \
        .eq("owner_email", email) \
        .execute()

    leads = leads_res.data or []
    total_leads = len(leads)

    active_leads = len([
        l for l in leads
        if l.get("status") and l["status"].lower() != "lost"
    ])

    # Fetch deals
    deals_res = supabase.table("deals") \
        .select("*") \
        .eq("owner_id", user_id) \
        .execute()

    deals = deals_res.data or []

    # Only won deals
    won_deals = [
        d for d in deals
        if d.get("stage") and d["stage"].lower() == "won"
    ]

    closed_deals = len(won_deals)

    total_revenue = sum(
        float(d.get("value", 0))
        for d in won_deals
        if d.get("value")
    )

    conversion_rate = (
        (closed_deals / total_leads) * 100
        if total_leads else 0
    )

    return {
        "total_revenue": total_revenue,
        "active_leads": active_leads,
        "conversion_rate": round(conversion_rate, 2),
        "closed_deals": closed_deals
    }
@router.get("/activities")
def get_recent_activities(current_user: dict = Depends(get_current_user)):

    activities = (
        supabase.table("activities")
        .select("*")
        .eq("user_email", current_user["email"])
        .order("created_at", desc=True)
        .limit(5)
        .execute()
    )

    return activities.data or []
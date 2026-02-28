from fastapi import APIRouter, Depends, HTTPException
from fastapi import APIRouter, Depends, HTTPException, Body
from .auth import get_current_user
from app.services.supabase_client import supabase
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.platypus import TableStyle
from reportlab.lib.units import inch

import matplotlib.pyplot as plt
import os
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])



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
from fastapi.responses import StreamingResponse
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
@router.get("/generate-report")
def generate_report(current_user=Depends(get_current_user)):

    email = current_user["email"]

    # Get user id
    user_res = supabase.table("users") \
        .select("id") \
        .eq("email", email) \
        .single() \
        .execute()

    if not user_res.data:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user_res.data["id"]

    # Fetch leads
    leads = supabase.table("leads") \
        .select("*") \
        .eq("owner_email", email) \
        .execute().data or []

    # Fetch deals
    deals = supabase.table("deals") \
        .select("*") \
        .eq("owner_id", user_id) \
        .execute().data or []

    # ===== CALCULATIONS =====
    total_leads = len(leads)
    total_deals = len(deals)

    won_deals = [
        d for d in deals
        if d.get("stage") and d["stage"].lower() == "won"
    ]

    lost_deals = [
        d for d in deals
        if d.get("stage") and d["stage"].lower() == "lost"
    ]

    closed_deals = len(won_deals)

    total_revenue = sum(
        float(d.get("value", 0))
        for d in won_deals
    )

    conversion_rate = (
        (closed_deals / total_leads) * 100
        if total_leads else 0
    )

    # ===== CREATE PDF =====
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)

    elements = []
    styles = getSampleStyleSheet()

    # Title
    elements.append(Paragraph("CRM Dashboard Report", styles["Title"]))
    elements.append(Spacer(1, 20))

    # Summary
    elements.append(Paragraph(f"Total Leads: {total_leads}", styles["Normal"]))
    elements.append(Paragraph(f"Total Deals: {total_deals}", styles["Normal"]))
    elements.append(Paragraph(f"Closed Deals: {closed_deals}", styles["Normal"]))
    elements.append(Paragraph(f"Total Revenue: ₹{total_revenue}", styles["Normal"]))
    elements.append(Paragraph(f"Conversion Rate: {round(conversion_rate, 2)}%", styles["Normal"]))

    elements.append(Spacer(1, 20))

    # KPI Table
    data = [
        ["Metric", "Value"],
        ["Total Leads", total_leads],
        ["Total Deals", total_deals],
        ["Won Deals", closed_deals],
        ["Lost Deals", len(lost_deals)],
        ["Revenue", f"₹{total_revenue}"],
        ["Conversion Rate", f"{round(conversion_rate, 2)}%"],
    ]

    table = Table(data, colWidths=[250, 150])

    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
    ]))

    elements.append(table)

    doc.build(elements)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=dashboard_report.pdf"}
    )
  # ===============================
# SEND CAMPAIGN
# ===============================

    # Step 1: Check role (optional but recommended)
@router.post("/send-campaign")
def send_campaign(
    data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if not data.get("title"):
        raise HTTPException(status_code=400, detail="Campaign title required")

    result = supabase.table("campaigns").insert({
        "title": data["title"],
        "description": data.get("description", ""),
        "created_by": current_user["email"],
        "status": "sent"
    }).execute()

    if not result.data:
        raise HTTPException(status_code=400, detail="Campaign failed")

    return {
        "message": "Campaign sent successfully",
        "campaign": result.data
    }
# ===============================
# SYNC DATA
# ===============================
@router.post("/sync-data")
def sync_data(current_user=Depends(get_current_user)):

    # 1️⃣ Fetch external leads
    external_res = supabase.table("external_leads").select("*").execute()
    external_leads = external_res.data or []

    if not external_leads:
        return {"message": "No external data found"}

    # 2️⃣ Fetch existing leads (avoid duplicates)
    existing_res = supabase.table("leads").select("first_name,last_name,company").execute()
    existing_leads = existing_res.data or []

    existing_set = {
        (lead["first_name"], lead["last_name"], lead["company"])
        for lead in existing_leads
    }

    # 3️⃣ Insert only new leads
    new_leads = []

    for lead in external_leads:
        key = (lead["first_name"], lead["last_name"], lead["company"])

        if key not in existing_set:
            new_leads.append({
                "first_name": lead["first_name"],
                "last_name": lead["last_name"],
                "company": lead["company"]
            })

    if new_leads:
        supabase.table("leads").insert(new_leads).execute()

    return {"message": f"{len(new_leads)} leads synced successfully"}
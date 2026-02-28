# app/api/reports.py
from fastapi import APIRouter, HTTPException
from app.services.supabase_client import supabase

router = APIRouter(prefix="/reports", tags=["Reports"])

# Deals by stage
@router.get("/deals-by-stage")
async def deals_by_stage():
    response = supabase.table("deals").select("stage").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No deals found")

    stages = {}
    for row in response.data:
        stage = row["stage"]
        stages[stage] = stages.get(stage, 0) + 1
    return stages


# Revenue by month
@router.get("/revenue-by-month")
async def revenue_by_month():
    response = supabase.rpc("revenue_by_month").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No revenue data found")
    return response.data


# Top performing sales reps
@router.get("/top-sales")
async def top_sales():
    response = supabase.rpc("top_sales_reps").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No sales data found")
    return response.data


# Conversion rate (leads → deals → won)
@router.get("/conversion-rate")
async def conversion_rate():
    leads_resp = supabase.table("leads").select("id", count="exact").execute()
    deals_resp = supabase.table("deals").select("id", count="exact").execute()
    won_resp = supabase.table("deals").select("id", count="exact").eq("stage", "won").execute()

    leads_count = leads_resp.count or 0
    deals_count = deals_resp.count or 0
    won_deals_count = won_resp.count or 0

    return {
        "leads": leads_count,
        "deals": deals_count,
        "won_deals": won_deals_count,
        "conversion_rate": (won_deals_count / leads_count * 100) if leads_count else 0
    }
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import os


@router.get("/generate-report")
async def generate_report():

    file_path = "crm_report.pdf"

    doc = SimpleDocTemplate(file_path)
    elements = []
    styles = getSampleStyleSheet()

    # ✅ LOGO (Correct Path)
    logo_path = os.path.join(os.getcwd(), "app", "static", "logo.png")

    print("Logo path:", logo_path)
    print("Logo exists:", os.path.exists(logo_path))

    if os.path.exists(logo_path):
        logo = Image(logo_path, width=150, height=80)
        logo.hAlign = "CENTER"
        elements.append(logo)
        elements.append(Spacer(1, 20))

    # ✅ TITLE
    elements.append(Paragraph("CRM Dashboard Report", styles["Title"]))
    elements.append(Spacer(1, 20))

    # ✅ SAMPLE DATA (Replace with your real data if needed)
    elements.append(Paragraph("Total Leads: 60", styles["Normal"]))
    elements.append(Paragraph("Total Deals: 19", styles["Normal"]))
    elements.append(Paragraph("Closed Deals: 14", styles["Normal"]))
    elements.append(Paragraph("Total Revenue: Rs 11,029,250.00", styles["Normal"]))
    elements.append(Paragraph("Conversion Rate: 23.33%", styles["Normal"]))

    # ✅ PAGE BORDER FUNCTION
    def add_border(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.black)
        canvas.rect(20, 20, 550, 800)
        canvas.restoreState()

    doc.build(elements, onFirstPage=add_border, onLaterPages=add_border)

    return FileResponse(file_path, media_type="application/pdf", filename="crm_report.pdf")
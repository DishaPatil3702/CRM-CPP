# app/routes/lead.py
from fastapi import APIRouter, Depends, HTTPException, Query, Body, status
from fastapi.responses import StreamingResponse

from fastapi import UploadFile, File
import csv
import io

from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel

from app.services.supabase_client import supabase
from app.routes.auth import get_current_user
from app.models.lead import Lead, LeadCreate  # ✅ Using models

router = APIRouter(
    prefix="/leads",
    tags=["Leads"]
)

# ----------------------------
# Response Schema (for Create)
# ----------------------------
class LeadResponse(BaseModel):
    message: str
    lead: Lead
# ----------------------------
# Get Leads
# ----------------------------
@router.get("/", response_model=List[Lead])
def get_leads(
    status: Optional[str] = Query(None, description="Filter by lead status"),
    search: Optional[str] = Query(None, description="Search first/last/company/email"),
    limit: int = Query(100, description="Max number of results"),
    offset: int = Query(0, description="Offset for pagination"),
    current_user: dict = Depends(get_current_user)
):
    try:
        q = supabase.table("leads").select("*").eq("owner_email", current_user["email"])

        if status:
            q = q.eq("status", status)

        if search:
            like = f"%{search}%"
            # first_name OR last_name OR company OR email (case-insensitive)
            q = q.or_(
                f"first_name.ilike.{like},last_name.ilike.{like},company.ilike.{like},email.ilike.{like}"
            )

        result = (
    q.order("created", desc=True)  # 🔹 sort by created timestamp descending
     .range(offset, offset + limit - 1)
     .execute()
)

        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching leads: {str(e)}")

# ----------------------------
# Create Lead
# ----------------------------
@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(lead: LeadCreate, current_user: dict = Depends(get_current_user)):
    lead_data = lead.dict(exclude_unset=True)
    lead_data["owner_email"] = current_user["email"]

    if isinstance(lead_data.get("created"), (date, datetime)):
        lead_data["created"] = lead_data["created"].isoformat()
    
    try:
        result = supabase.table("leads").insert(lead_data).execute()
        new_lead = result.data[0]
    

    # 🔹 Log Activity
        supabase.table("activities").insert({
          "user_email": current_user["email"],
          "type": "lead_created",
          "message": f"New lead created: {new_lead.get('first_name')} {new_lead.get('last_name')}",
          "created_at": datetime.utcnow().isoformat()
        }).execute()

        return {"message": "Lead created successfully", "lead": new_lead}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create lead: {str(e)}")
        
# ----------------------------
# Export Report (CSV)
# ----------------------------
@router.get("/export")
def export_leads(current_user: dict = Depends(get_current_user)):
    try:
        result = (
            supabase
            .table("leads")
            .select("*")
            .eq("owner_email", current_user["email"])
            .execute()
        )

        leads = result.data or []

        output = io.StringIO()
        writer = csv.writer(output)

        # CSV header
        writer.writerow([
            "first_name",
            "last_name",
            "email",
            "company",
            "phone",
            "source",
            "status",
            "notes",
            "owner_email",
            "created"
        ])

        for lead in leads:
            writer.writerow([
                lead.get("first_name"),
                lead.get("last_name"),
                lead.get("email"),
                lead.get("company"),
                lead.get("phone"),
                lead.get("source"),
                lead.get("status"),
                lead.get("notes"),
                lead.get("owner_email"),
                lead.get("created"),
            ])

        output.seek(0)

        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=leads.csv"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ----------------------------
# Update Lead
# ----------------------------
# ----------------------------
# Update Lead
# ----------------------------
# ----------------------------
# Update Lead
# ----------------------------
@router.put("/{lead_id}", response_model=Lead)
def update_lead(
    lead_id: int,
    lead: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        lead_data = {k: v for k, v in lead.items() if v is not None}
        if not lead_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        if "created" in lead_data and isinstance(lead_data["created"], (date, datetime)):
            lead_data["created"] = lead_data["created"].isoformat()

        result = (
            supabase.table("leads")
            .update(lead_data)
            .eq("id", lead_id)
            .eq("owner_email", current_user["email"])
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Lead not found or not owned by current user")

        updated_lead = result.data[0]

        # Log activity
        supabase.table("activities").insert({
            "user_email": current_user["email"],
            "type": "lead_updated",
            "message": f"Lead updated: {updated_lead.get('first_name')} {updated_lead.get('last_name')}",
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        return updated_lead

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating lead: {str(e)}") 
    # ----------------------------
# Import Leads (CSV)
# ----------------------------
@router.post("/import")
async def import_leads(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    import csv, io

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

    content = await file.read()
    reader = csv.DictReader(io.StringIO(content.decode("utf-8")))

    rows = []
    for row in reader:
        row["owner_email"] = current_user["email"]
        rows.append(row)

    if not rows:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    supabase.table("leads").insert(rows).execute()

    return {
        "message": "Leads imported successfully",
        "count": len(rows)
    }

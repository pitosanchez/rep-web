"""
Pydantic models for REP story signal extraction API.
"""
from typing import Optional, Literal
from pydantic import BaseModel, Field


# ── Inbound request from Node ────────────────────────────────────────────────

class AnalyzeStoryRequest(BaseModel):
    story_id: str = Field(..., description="UUID of the story in the stories table")
    text: str = Field(..., description="Full anonymized story text")
    zip_code: str = Field(..., description="ZIP code where the story originates")


# ── Signal structure (one per category) ──────────────────────────────────────

SignalStatus = Literal["present", "possible", "not_present", "unclear"]

class SignalDetail(BaseModel):
    status: SignalStatus
    confidence: float = Field(..., ge=0.0, le=1.0)
    evidence: Optional[str] = None


class SignalSet(BaseModel):
    economic_instability: SignalDetail
    healthcare_access_barriers: SignalDetail
    insurance_instability: SignalDetail
    food_environment: SignalDetail
    environmental_exposure: SignalDetail
    neighborhood_safety: SignalDetail
    education_and_health_literacy: SignalDetail
    justice_system_exposure: SignalDetail
    mental_health_signals: SignalDetail
    substance_use_context: SignalDetail
    social_support: SignalDetail
    structural_barriers: SignalDetail


# ── Outbound response to Node ─────────────────────────────────────────────────

class AnalyzeStoryResponse(BaseModel):
    summary: str
    signals: SignalSet
    overall_confidence: float = Field(..., ge=0.0, le=1.0)

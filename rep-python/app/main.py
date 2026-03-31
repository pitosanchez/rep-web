"""
REP Story Signal Extraction — FastAPI microservice
Receives story text from Node, returns structured social/structural signals via Claude.
"""
import logging
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .models import AnalyzeStoryRequest, AnalyzeStoryResponse
from .analyzer import analyze_story

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="REP Story Signal Service",
    description="Extracts structured social/structural signals from anonymized patient stories for the Rare Renal Equity Project.",
    version="1.0.0",
)

# Only allow requests from the Node backend
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "rep-story-signal"}


@app.post("/analyze-story", response_model=AnalyzeStoryResponse)
async def analyze_story_endpoint(payload: AnalyzeStoryRequest):
    """
    Receive a story submission, extract structured social signals via Claude.

    Request body:
      story_id  — UUID of the story in the stories table
      text      — full anonymized story text
      zip_code  — ZIP code where the story originates

    Response:
      summary            — plain-language signal summary
      signals            — 12 structured signal categories with status/confidence/evidence
      overall_confidence — 0–1 float
    """
    if not payload.text or len(payload.text.strip()) < 20:
        raise HTTPException(status_code=422, detail="Story text is too short to analyze.")

    logger.info("Analyzing story %s from ZIP %s", payload.story_id, payload.zip_code)

    try:
        result = await analyze_story(text=payload.text, zip_code=payload.zip_code)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"Analysis service error: {e}")
    except Exception as e:
        logger.exception("Unexpected error analyzing story %s", payload.story_id)
        raise HTTPException(status_code=500, detail="Internal analysis error.")

    logger.info(
        "Story %s analyzed — overall_confidence=%.2f",
        payload.story_id,
        result.overall_confidence,
    )
    return result

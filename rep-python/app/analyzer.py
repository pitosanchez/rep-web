"""
Core story analysis logic — calls Claude and validates the response.
"""
import json
import logging
from anthropic import AsyncAnthropic
from .models import AnalyzeStoryResponse
from .prompts import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

# claude-opus-4-6 for best structured JSON + instruction following
MODEL = "claude-opus-4-6"
MAX_TOKENS = 2048


async def analyze_story(text: str, zip_code: str) -> AnalyzeStoryResponse:
    """
    Send story text to Claude and extract structured signals.
    Returns a validated AnalyzeStoryResponse.
    """
    client = AsyncAnthropic()

    user_message = f"ZIP Code: {zip_code}\n\nStory:\n{text}"

    response = await client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw_text = response.content[0].text if response.content else ""

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as e:
        logger.error("Claude returned non-JSON response: %s", raw_text[:200])
        raise ValueError(f"Claude response was not valid JSON: {e}") from e

    # Pydantic validates all fields and types
    return AnalyzeStoryResponse(**data)

# REP Python Signal Service

FastAPI microservice that extracts structured social/structural signals from anonymized patient stories using Claude (Anthropic).

## Setup

```bash
cd rep-python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

## Run locally

```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoint

```
POST /analyze-story
{
  "story_id": "uuid",
  "text":     "full story text",
  "zip_code": "10456"
}
```

## Database migrations

Run in order against your Postgres/PostGIS database:

```bash
psql $DATABASE_URL -f migrations/001_create_stories.sql
psql $DATABASE_URL -f migrations/002_create_story_signals.sql
psql $DATABASE_URL -f migrations/003_create_geographies_and_aggregated.sql
```

## Environment variables (Next.js side)

Add to `where-we-live-site/.env.local`:

```
DATABASE_URL=postgresql://user:password@host:5432/rep_db
PYTHON_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

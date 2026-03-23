# Story-to-ZIP Code Connection

Stories are now connected to ZIP codes through a multi-layer system.

## Files Added/Modified

### New Files
1. **lib/storyZipMapping.ts** - Neighborhood to ZIP mapping
   - `neighborhoodToZips` - Maps neighborhoods to their ZIP codes
   - `zipToNeighborhood` - Maps ZIP codes to neighborhoods
   - Utility functions for lookups

2. **app/api/stories/by-zip/route.ts** - API endpoint
   - GET `/api/stories/by-zip?zip=10456`
   - Returns all patient stories for a given ZIP code

3. **components/pages/NeighborhoodPage.tsx** - Updated
   - Now imports and displays detailed patient stories (from `lib/stories.ts`)
   - Includes new `PatientStoryCard` component for displaying detailed stories
   - Falls back to mock stories when no patient stories exist

### Data Structure

#### Story Mapping
```
Mott Haven
  ├── ZIP: 10451, 10452
  └── Story: Marcus (APOL1-Mediated Kidney Disease)

Fordham
  ├── ZIP: 10458, 10468
  └── Story: Marisol (FSGS)

Morrisania
  ├── ZIP: 10456, 10457
  └── Story: Jordan (FSGS)
```

## How It Works

### 1. User Clicks ZIP Code on Map
- User selects a ZIP code (e.g., 10456)

### 2. NeighborhoodPage Loads
- Fetches neighborhood profile via API
- Uses `getNeighborhoodForZip(zip)` to get neighborhood name
- Filters patient stories by matching neighborhood

### 3. Stories Display
- Detailed patient stories shown in `PatientStoryCard` components
- Includes profile, narrative excerpt, geography context
- Falls back to simple mock stories if no patient stories found

## API Usage

### Get Stories by ZIP Code
```bash
curl "http://localhost:3000/api/stories/by-zip?zip=10456"
```

Response:
```json
{
  "success": true,
  "zip": "10456",
  "neighborhood": "Morrisania",
  "count": 1,
  "stories": [...]
}
```

## Testing

✅ ZIP 10451 → Mott Haven → Marcus
✅ ZIP 10456 → Morrisania → Jordan
✅ ZIP 10458 → Fordham → Marisol

## Next Steps

- Add more stories to expand coverage
- Create admin interface for managing story-to-ZIP mapping
- Add story submission form for patient contributions
- Implement story recommendation algorithm based on conditions/themes

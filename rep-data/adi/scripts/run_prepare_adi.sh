#!/usr/bin/env bash
# Run prepare_adi.py with NY 2023 ADI + 2024 NY block group shapefile.
# Usage: from rep-data/adi/scripts/ run: ./run_prepare_adi.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ADI_CSV="/Users/Pitolove/Desktop/RREP/adi-download/NY_2023_ADI_Census_Block_Group_v4_0_1.csv"
BLOCKGROUP_SHP="/Users/Pitolove/Desktop/RREP/cb_2024_36_bg_500k/cb_2024_36_bg_500k.shp"
OUT_GEOJSON="../processed/adi_blockgroups.geojson"

python3 prepare_adi.py \
  --adi-input "$ADI_CSV" \
  --adi-format csv \
  --blockgroup-geometry "$BLOCKGROUP_SHP" \
  --out-geojson "$OUT_GEOJSON"

echo "Done. Output: $OUT_GEOJSON"

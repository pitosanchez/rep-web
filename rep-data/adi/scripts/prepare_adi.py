#!/usr/bin/env python3
"""
Prepare ADI (Area Deprivation Index) data for the REP pipeline.

Joins ADI CSV (or shapefile) to block group geometry and outputs GeoJSON
and/or PostGIS. Uses rep-data/adi/raw/ and rep-data/adi/processed/ when
paths are relative.
"""

import argparse
import sys
from pathlib import Path

# Repo-relative paths when not overridden by CLI
SCRIPT_DIR = Path(__file__).resolve().parent
ADI_DIR = SCRIPT_DIR.parent
RAW_DIR = ADI_DIR / "raw"
PROCESSED_DIR = ADI_DIR / "processed"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Join ADI data to block group geometry and output GeoJSON or PostGIS."
    )
    parser.add_argument(
        "--adi-input",
        required=True,
        help="Path to ADI file (CSV or shapefile).",
    )
    parser.add_argument(
        "--adi-format",
        choices=["csv", "shapefile"],
        default="csv",
        help="Format of --adi-input (default: csv).",
    )
    parser.add_argument(
        "--blockgroup-geometry",
        required=True,
        help="Path to block group boundaries (GeoJSON or .shp).",
    )
    parser.add_argument(
        "--blockgroup-geoid-column",
        default="GEOID",
        help="Column name for block group GEOID in geometry file (default: GEOID).",
    )
    parser.add_argument(
        "--adi-geoid-column",
        default=None,
        help="Column name for GEOID in ADI file (default: auto-detect FIPS/GEOID/geoid).",
    )
    parser.add_argument(
        "--out-geojson",
        default=None,
        help="Output GeoJSON path (default: rep-data/adi/processed/adi_blockgroups.geojson).",
    )
    parser.add_argument(
        "--to-postgis",
        action="store_true",
        help="Load result into PostGIS.",
    )
    parser.add_argument("--pg-url", default=None, help="PostgreSQL connection URL.")
    parser.add_argument("--pg-table", default="adi_blockgroups", help="PostGIS table name.")
    parser.add_argument("--pg-geom-column", default="geom", help="Geometry column name.")
    parser.add_argument(
        "--simplify-tolerance",
        type=float,
        default=0,
        help="Douglas-Peucker tolerance for simplifying geometries (0 = no simplify).",
    )
    args = parser.parse_args()

    try:
        import geopandas as gpd
        import pandas as pd
    except ImportError:
        print("prepare_adi.py requires: pip install geopandas pandas", file=sys.stderr)
        return 1

    adi_path = Path(args.adi_input)
    geom_path = Path(args.blockgroup_geometry)
    if not adi_path.exists():
        print(f"ADI input not found: {adi_path}", file=sys.stderr)
        return 1
    if not geom_path.exists():
        print(f"Block group geometry not found: {geom_path}", file=sys.stderr)
        return 1

    # Load ADI
    if args.adi_format == "csv":
        adi_df = pd.read_csv(args.adi_input, dtype=str)
        adi_df["GEOID"] = adi_df["FIPS"].astype(str).str.zfill(12)
    else:
        adi_df = gpd.read_file(adi_path).drop(columns="geometry", errors="ignore")
        if "FIPS" in adi_df.columns:
            adi_df["GEOID"] = adi_df["FIPS"].astype(str).str.zfill(12)

    print(f"Loaded ADI rows: {len(adi_df)}")

    # Bronx County FIPS = 36005 (first 5 digits of 12-digit block group GEOID)
    adi_df = adi_df[adi_df["GEOID"].str.startswith("36005")]
    print(f"Filtered Bronx rows: {len(adi_df)}")

    # Detect ADI GEOID column
    geoid_candidates = ["GEOID", "geoid", "FIPS", "fips", "FIPS_Code", "GEOID20", "GEOID10"]
    adi_geoid_col = args.adi_geoid_column
    if adi_geoid_col is None:
        for c in geoid_candidates:
            if c in adi_df.columns:
                adi_geoid_col = c
                break
        if adi_geoid_col is None:
            # Try first column that looks like 12-digit FIPS
            for c in adi_df.columns:
                if adi_df[c].astype(str).str.match(r"^\d{12}$").all():
                    adi_geoid_col = c
                    break
        if adi_geoid_col is None:
            print(
                "Could not detect ADI GEOID column. Use --adi-geoid-column.",
                file=sys.stderr,
            )
            return 1

    # Load block group geometry
    gdf = gpd.read_file(geom_path)
    if args.blockgroup_geoid_column not in gdf.columns:
        print(
            f"Block group geometry missing column '{args.blockgroup_geoid_column}'. "
            f"Available: {list(gdf.columns)}",
            file=sys.stderr,
        )
        return 1

    # Normalize GEOIDs to string, same length (strip leading zeros for join if needed)
    gdf["_join_id"] = gdf[args.blockgroup_geoid_column].astype(str).str.zfill(12)
    adi_df["_join_id"] = adi_df[adi_geoid_col].astype(str).str.zfill(12)

    # Restrict geometry to Bronx (36005) for merge
    gdf = gdf[gdf["_join_id"].str.startswith("36005")]

    # Keep one row per GEOID from ADI (in case of duplicates)
    adi_one = adi_df.drop_duplicates(subset=["_join_id"], keep="first")
    merged = gdf.merge(adi_one, on="_join_id", how="inner")
    merged = merged.drop(columns=["_join_id"], errors="ignore")

    print(f"Merged rows: {len(merged)}")

    if merged.empty:
        print("No matching GEOIDs between ADI and block group geometry.", file=sys.stderr)
        return 1

    if args.simplify_tolerance and args.simplify_tolerance > 0:
        merged["geometry"] = merged.geometry.simplify(
            tolerance=args.simplify_tolerance, preserve_topology=True
        )

    # Output GeoJSON
    out_geojson = args.out_geojson
    if out_geojson is None:
        PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
        out_geojson = PROCESSED_DIR / "adi_blockgroups.geojson"
    out_geojson = Path(out_geojson)
    out_geojson.parent.mkdir(parents=True, exist_ok=True)
    merged.to_file(out_geojson, driver="GeoJSON")
    print(f"Saved to {out_geojson}")

    if args.to_postgis and args.pg_url:
        merged.to_postgis(
            args.pg_table,
            args.pg_url,
            if_exists="replace",
            index=False,
            schema=None,
        )
        print(f"Loaded into PostGIS table: {args.pg_table}")

    return 0


if __name__ == "__main__":
    sys.exit(main())

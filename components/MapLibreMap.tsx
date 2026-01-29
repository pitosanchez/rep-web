'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

interface MapLibreMapProps {
  selectedZip: string | null;
  onZipClick: (zip: string) => void;
  visibleLayers: {
    diseaseBurden: boolean;
    careAccess: boolean;
    environmentalExposure: boolean;
    transit: boolean;
  };
}

export default function MapLibreMap({
  selectedZip,
  onZipClick,
  visibleLayers
}: MapLibreMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [hoveredZip, setHoveredZip] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on South Bronx
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-73.918, 40.828],
      zoom: 12,
      pitch: 0,
      bearing: 0
    });

    // Handle map load
    map.current.on('load', () => {
      if (!map.current) return;

      // Add GeoJSON source
      map.current.addSource('bronx-zips', {
        type: 'geojson',
        data: '/data/bronx-zips.geojson'
      });

      // Add fill layer with choropleth styling
      map.current.addLayer({
        id: 'bronx-zips-fill',
        type: 'fill',
        source: 'bronx-zips',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'burdenIndex'],
            70, '#a8d5ba',  // Low burden (light green)
            75, '#d4a574',  // Medium burden (tan)
            80, '#c45a3b'   // High burden (terracotta)
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.7
          ]
        }
      });

      // Add border layer
      map.current.addLayer({
        id: 'bronx-zips-border',
        type: 'line',
        source: 'bronx-zips',
        paint: {
          'line-color': '#1a1a1a',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            ['boolean', ['feature-state', 'selected'], false],
            3,
            1.5
          ],
          'line-opacity': 0.8
        }
      });

      // Handle clicks on polygons
      map.current.on('click', 'bronx-zips-fill', (e) => {
        const features = e.features;
        if (!features || features.length === 0) return;

        const zip = features[0].properties?.zip;
        if (zip) {
          onZipClick(zip);
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'bronx-zips-fill', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'bronx-zips-fill', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });

      // Hover state tracking
      map.current.on('mousemove', 'bronx-zips-fill', (e) => {
        if (!map.current || !e.features || e.features.length === 0) return;

        // Reset previous hover state
        if (hoveredZip) {
          map.current.setFeatureState(
            { source: 'bronx-zips', id: hoveredZip },
            { hover: false }
          );
        }

        // Set new hover state
        const zip = e.features[0].properties?.zip;
        if (zip) {
          setHoveredZip(zip);
          map.current.setFeatureState(
            { source: 'bronx-zips', id: zip },
            { hover: true }
          );
        }
      });

      setMapReady(true);
    });

    return () => {
      // Cleanup on unmount
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onZipClick]);

  // Update selected state
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Reset all selected states
    const source = map.current.getSource('bronx-zips') as maplibregl.GeoJSONSource | undefined;
    if (source && (source.getClusterExpansionZoom === undefined)) {
      // Get all features from the source
      const data = (source as any)._data;
      if (data && data.features) {
        data.features.forEach((feature: any) => {
          map.current?.setFeatureState(
            { source: 'bronx-zips', id: feature.properties.zip },
            { selected: false }
          );
        });
      }
    }

    // Set selected state for current zip
    if (selectedZip) {
      map.current.setFeatureState(
        { source: 'bronx-zips', id: selectedZip },
        { selected: true }
      );
    }
  }, [selectedZip, mapReady]);

  // Toggle layer visibility
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Disease Burden layer (already showing, just toggle)
    const burdenLayerId = 'bronx-zips-fill';
    if (map.current.getLayer(burdenLayerId)) {
      map.current.setLayoutProperty(
        burdenLayerId,
        'visibility',
        visibleLayers.diseaseBurden ? 'visible' : 'none'
      );
    }

    // Note: Care Access, Environmental Exposure, and Transit layers
    // would be added as additional choropleth layers with different
    // data-driven styling. For now, we show Disease Burden as default.
    // These can be added in Phase 4.
  }, [visibleLayers, mapReady]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {!mapReady && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10
          }}
        >
          <p style={{ color: '#666', fontSize: '14px', fontFamily: 'system-ui' }}>
            Loading map...
          </p>
        </div>
      )}
    </div>
  );
}

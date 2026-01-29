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
  const popup = useRef<maplibregl.Popup | null>(null);
  const [hoveredZip, setHoveredZip] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<any>(null);
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

      // Disease Burden layer - choropleth
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

      // Care Access layer - based on travel time (lower is better)
      map.current.addLayer({
        id: 'bronx-care-access',
        type: 'fill',
        source: 'bronx-zips',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'avgTravel'],
            55, '#4a90e2',   // Good access (blue) - lower travel time
            65, '#7ab3f5',   // Moderate access (light blue)
            75, '#d96666'    // Poor access (red) - higher travel time
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.7
          ]
        },
        layout: {
          visibility: 'none'
        }
      });

      // Environmental Exposure layer - based on exposure index
      map.current.addLayer({
        id: 'bronx-exposure',
        type: 'fill',
        source: 'bronx-zips',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'exposureIndex'],
            65, '#6b8f71',   // Low exposure (green)
            75, '#d4a574',   // Moderate exposure (tan)
            85, '#8b3a3a'    // High exposure (dark red)
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.7
          ]
        },
        layout: {
          visibility: 'none'
        }
      });

      // Transit layer - visualization based on travel time (proxy for transit access)
      map.current.addLayer({
        id: 'bronx-transit',
        type: 'fill',
        source: 'bronx-zips',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'avgTravel'],
            55, '#ffd700',   // Good transit (yellow-gold)
            65, '#ffa500',   // Moderate transit (orange)
            75, '#ff6b6b'    // Poor transit (red)
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.7
          ]
        },
        layout: {
          visibility: 'none'
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

      // Layer IDs for interaction
      const interactiveLayers = ['bronx-zips-fill', 'bronx-care-access', 'bronx-exposure', 'bronx-transit'];

      // Handle clicks on all polygon layers
      interactiveLayers.forEach(layerId => {
        map.current?.on('click', layerId, (e) => {
          const features = e.features;
          if (!features || features.length === 0) return;

          const zip = features[0].properties?.zip;
          if (zip) {
            onZipClick(zip);
          }
        });

        // Change cursor on hover
        map.current?.on('mouseenter', layerId, () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer';
          }
        });

        map.current?.on('mouseleave', layerId, () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = '';
          }
        });

        // Hover state tracking and popup
        map.current?.on('mousemove', layerId, (e) => {
          if (!map.current || !e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const properties = feature.properties;

          // Reset previous hover state
          if (hoveredZip && hoveredZip !== properties?.zip) {
            map.current.setFeatureState(
              { source: 'bronx-zips', id: hoveredZip },
              { hover: false }
            );
          }

          // Set new hover state
          const zip = properties?.zip;
          if (zip) {
            setHoveredZip(zip);
            setHoveredFeature(properties);
            map.current.setFeatureState(
              { source: 'bronx-zips', id: zip },
              { hover: true }
            );

            // Create popup if not exists
            if (!popup.current) {
              popup.current = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false
              });
            }

            // Update popup content and position
            const popupContent = `
              <div style="font-family: system-ui; font-size: 12px; padding: 8px;">
                <div style="font-weight: 600; margin-bottom: 4px;">${properties.zip}</div>
                <div style="font-size: 11px; color: #666; margin-bottom: 2px;">${properties.name || ''}</div>
                <div style="border-top: 1px solid #e8e4df; padding-top: 6px; margin-top: 6px; font-size: 11px;">
                  <div>Burden: <strong>${properties.burdenIndex || '—'}</strong></div>
                  <div>Travel: <strong>${properties.avgTravel || '—'}m</strong></div>
                  <div>Exposure: <strong>${properties.exposureIndex || '—'}</strong></div>
                </div>
              </div>
            `;

            popup.current
              .setLngLat(e.lngLat)
              .setHTML(popupContent)
              .addTo(map.current);
          }
        });

        // Close popup on leave
        map.current?.on('mouseleave', layerId, () => {
          if (popup.current) {
            popup.current.remove();
            popup.current = null;
          }
        });
      });

      // Add zoom controls
      const nav = new maplibregl.NavigationControl({
        showCompass: false,
        showZoom: true
      });
      map.current.addControl(nav, 'top-right');

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

    // Disease Burden layer
    const burdenLayerId = 'bronx-zips-fill';
    if (map.current.getLayer(burdenLayerId)) {
      map.current.setLayoutProperty(
        burdenLayerId,
        'visibility',
        visibleLayers.diseaseBurden ? 'visible' : 'none'
      );
    }

    // Care Access layer
    const careAccessLayerId = 'bronx-care-access';
    if (map.current.getLayer(careAccessLayerId)) {
      map.current.setLayoutProperty(
        careAccessLayerId,
        'visibility',
        visibleLayers.careAccess ? 'visible' : 'none'
      );
    }

    // Environmental Exposure layer
    const exposureLayerId = 'bronx-exposure';
    if (map.current.getLayer(exposureLayerId)) {
      map.current.setLayoutProperty(
        exposureLayerId,
        'visibility',
        visibleLayers.environmentalExposure ? 'visible' : 'none'
      );
    }

    // Transit layer
    const transitLayerId = 'bronx-transit';
    if (map.current.getLayer(transitLayerId)) {
      map.current.setLayoutProperty(
        transitLayerId,
        'visibility',
        visibleLayers.transit ? 'visible' : 'none'
      );
    }
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

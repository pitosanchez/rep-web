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
    /** Area Deprivation Index — block-group polygons from /api/adi/blockgroups */
    areaDeprivationIndex: boolean;
  };
}

function addAdiBlockgroupLayers(
  mapInstance: maplibregl.Map,
  data: any,
  visible: boolean,
  beforeLayerId?: string
) {
  if (mapInstance.getSource('adi-blockgroups')) return;

  mapInstance.addSource('adi-blockgroups', {
    type: 'geojson',
    data,
  });

  mapInstance.addLayer(
    {
      id: 'adi-blockgroups-fill',
      type: 'fill',
      source: 'adi-blockgroups',
      paint: {
        // ADI_NATRANK: national percentile rank (~1–100); higher = greater deprivation
        'fill-color': [
          'interpolate',
          ['linear'],
          ['to-number', ['get', 'ADI_NATRANK'], 50],
          1, '#e8f5e9',
          25, '#fff9c4',
          50, '#ffcc80',
          75, '#ef5350',
          100, '#7b1fa2',
        ],
        'fill-opacity': 0.55,
        'fill-outline-color': 'rgba(26, 26, 26, 0.35)',
      },
      layout: {
        visibility: visible ? 'visible' : 'none',
      },
    },
    beforeLayerId
  );
}

export default function MapLibreMap({
  selectedZip,
  onZipClick,
  visibleLayers
}: MapLibreMapProps) {
  /** ADI may resolve after `geoData`; ref is read in map `load` to avoid a race. */
  const adiGeojsonRef = useRef<any | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popup = useRef<maplibregl.Popup | null>(null);
  const hoveredZipRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [geoData, setGeoData] = useState<any | null>(null);
  const [adiData, setAdiData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Bronx ZIP points (required) + ADI block groups (optional overlay)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        adiGeojsonRef.current = null;

        const geoRes = await fetch('/api/geo/bronx-zips');
        if (!geoRes.ok) {
          throw new Error(`Failed to fetch geographic data: ${geoRes.statusText}`);
        }
        const geoJson = await geoRes.json();
        if (!geoJson.success || !geoJson.data) {
          throw new Error('Invalid Bronx ZIP response');
        }
        if (!cancelled) {
          setGeoData(geoJson.data);
        }

        const adiRes = await fetch('/api/adi/blockgroups');
        if (adiRes.ok) {
          const adiJson = await adiRes.json();
          if (adiJson.success && adiJson.data && !cancelled) {
            adiGeojsonRef.current = adiJson.data;
            setAdiData(adiJson.data);
          }
        } else {
          console.warn('ADI block groups unavailable:', adiRes.statusText);
        }
      } catch (err) {
        console.error('Error fetching geographic data:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !geoData) return;

    // Initialize map centered on South Bronx
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-73.918, 40.828],
      zoom: 12,
      pitch: 0,
      bearing: 0
    });

    // Handle map load
    const onMapLoad = () => {
      if (!map.current || !geoData) return;

      // Add GeoJSON source with real data
      map.current.addSource('bronx-zips', {
        type: 'geojson',
        data: geoData
      });

      const adi = adiGeojsonRef.current;
      if (adi) {
        addAdiBlockgroupLayers(
          map.current,
          adi,
          visibleLayers.areaDeprivationIndex,
        );
      }

      // Disease Burden layer - based on weight_tot (proxy for burden)
      map.current.addLayer({
        id: 'bronx-zips-fill',
        type: 'circle',
        source: 'bronx-zips',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'weight_tot'],
            0, 8,
            1, 24
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'weight_tot'],
            0, '#a8d5ba',  // Light green (low)
            0.5, '#d4a574',  // Tan (medium)
            1, '#c45a3b'   // Terracotta (high)
          ],
          'circle-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.7
          ],
          'circle-stroke-color': '#1a1a1a',
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            3,
            1
          ],
          'circle-stroke-opacity': 0.8
        }
      });

      // Care Access layer - based on weight_res
      map.current.addLayer({
        id: 'bronx-care-access',
        type: 'circle',
        source: 'bronx-zips',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'weight_res'],
            0, 8,
            1, 24
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'weight_res'],
            0, '#4a90e2',   // Blue (low)
            0.5, '#7ab3f5',   // Light blue (medium)
            1, '#d96666'    // Red (high)
          ],
          'circle-opacity': 0.7,
          'circle-stroke-color': '#1a1a1a',
          'circle-stroke-width': 1,
          'circle-stroke-opacity': 0.8
        },
        layout: {
          visibility: 'none'
        }
      });

      // Environmental Exposure layer - placeholder color scheme
      map.current.addLayer({
        id: 'bronx-exposure',
        type: 'circle',
        source: 'bronx-zips',
        paint: {
          'circle-radius': 8,
          'circle-color': '#6b8f71',   // Green
          'circle-opacity': 0.7,
          'circle-stroke-color': '#1a1a1a',
          'circle-stroke-width': 1,
          'circle-stroke-opacity': 0.8
        },
        layout: {
          visibility: 'none'
        }
      });

      // Transit layer - based on weight_tot
      map.current.addLayer({
        id: 'bronx-transit',
        type: 'circle',
        source: 'bronx-zips',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'weight_tot'],
            0, 8,
            1, 24
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'weight_tot'],
            0, '#ffd700',   // Gold (low)
            0.5, '#ffa500',   // Orange (medium)
            1, '#ff6b6b'    // Red (high)
          ],
          'circle-opacity': 0.7,
          'circle-stroke-color': '#1a1a1a',
          'circle-stroke-width': 1,
          'circle-stroke-opacity': 0.8
        },
        layout: {
          visibility: 'none'
        }
      });

      // Layer IDs for interaction
      const interactiveLayers = ['bronx-zips-fill', 'bronx-care-access', 'bronx-exposure', 'bronx-transit'];

      // Handle clicks on all layers
      interactiveLayers.forEach(layerId => {
        map.current?.on('click', layerId, (e) => {
          const features = e.features;
          if (!features || features.length === 0) return;

          const zip = features[0].properties?.zip;
          if (zip) {
            // Set selected state
            if (map.current) {
              map.current.setFeatureState(
                { source: 'bronx-zips', id: zip },
                { selected: true }
              );
            }
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
          if (hoveredZipRef.current && hoveredZipRef.current !== properties?.zip) {
            map.current.setFeatureState(
              { source: 'bronx-zips', id: hoveredZipRef.current },
              { hover: false }
            );
          }

          // Set new hover state
          const zip = properties?.zip;
          if (zip) {
            hoveredZipRef.current = zip;
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
              <div style="font-family: system-ui; font-size: 12px; padding: 8px; max-width: 200px;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">${properties.zip}</div>
                <div style="font-size: 11px; color: #666; margin-bottom: 6px;">${properties.nta_name || 'Unassigned'}</div>
                <div style="border-top: 1px solid #e8e4df; padding-top: 6px; margin-top: 6px; font-size: 11px;">
                  <div>NTA Code: <strong>${properties.nta_code || '—'}</strong></div>
                  <div>Residential Weight: <strong>${(properties.weight_res * 100).toFixed(1)}%</strong></div>
                  <div>Total Weight: <strong>${(properties.weight_tot * 100).toFixed(1)}%</strong></div>
                  <div>Exposure Index: <strong>${(properties.exposure_index * 100).toFixed(0)}%</strong></div>
                  <div>Transit Burden: <strong>${(properties.transit_burden * 100).toFixed(0)}%</strong></div>
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
    };

    map.current.on('load', onMapLoad);

    return () => {
      // Cleanup on unmount
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onZipClick, geoData]);

  // ADI fetched after map exists — insert fill below ZIP circles
  useEffect(() => {
    if (!map.current || !mapReady || !adiData) return;
    if (map.current.getSource('adi-blockgroups')) return;

    // Wait for style to be fully loaded before adding ADI source
    const addAdiWhenReady = () => {
      if (!map.current || !map.current.isStyleLoaded()) {
        // Style not ready yet, wait and retry
        map.current?.once('style.load', addAdiWhenReady);
        return;
      }

      addAdiBlockgroupLayers(
        map.current,
        adiData,
        visibleLayers.areaDeprivationIndex,
        map.current.getLayer('bronx-zips-fill') ? 'bronx-zips-fill' : undefined,
      );
    };

    addAdiWhenReady();
  }, [adiData, mapReady, visibleLayers.areaDeprivationIndex]);

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

    const adiFillId = 'adi-blockgroups-fill';
    if (map.current.getLayer(adiFillId)) {
      map.current.setLayoutProperty(
        adiFillId,
        'visibility',
        visibleLayers.areaDeprivationIndex ? 'visible' : 'none'
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
        overflow: 'hidden',
        background: '#f5f5f5'
      }}
    >
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <p style={{ color: '#c45a3b', fontSize: '14px', fontFamily: 'system-ui', margin: 0 }}>
            Error loading map data
          </p>
          <p style={{ color: '#999', fontSize: '12px', fontFamily: 'system-ui', margin: '8px 0 0' }}>
            {error}
          </p>
        </div>
      )}
      {(loading || !mapReady) && !error && (
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
            {loading ? 'Loading geographic data...' : 'Loading map...'}
          </p>
        </div>
      )}
    </div>
  );
}

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
          1, '#d0e8d0',
          25, '#fce8a1',
          50, '#f5a623',
          75, '#e84c3d',
          100, '#5c1fa2',
        ],
        'fill-opacity': 0.65,
        'fill-outline-color': 'rgba(26, 26, 26, 0.5)',
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

      // ADI layers are added by separate useEffect when ready and style is loaded

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
            0, 10,
            1, 28
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'weight_tot'],
            0, '#6ab576',  // Darker green (low)
            0.5, '#c89a54',  // Darker tan (medium)
            1, '#a83d25'   // Darker terracotta (high)
          ],
          'circle-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.95,
            0.85
          ],
          'circle-stroke-color': '#1a1a1a',
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            3,
            2
          ],
          'circle-stroke-opacity': 0.9
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
            0, 10,
            1, 28
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'weight_res'],
            0, '#1a5aa0',   // Dark blue (low access = good)
            0.5, '#4a7ec8',   // Medium blue
            1, '#b8334d'    // Dark red (high access barrier = bad)
          ],
          'circle-opacity': 0.85,
          'circle-stroke-color': '#1a1a1a',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.9
        },
        layout: {
          visibility: 'none'
        }
      });

      // Environmental Exposure layer - based on exposure_index
      map.current.addLayer({
        id: 'bronx-exposure',
        type: 'circle',
        source: 'bronx-zips',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'exposure_index'],
            0, 10,
            1, 28
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'exposure_index'],
            0, '#3d6b41',   // Dark green (low exposure)
            0.5, '#a08050',   // Dark tan (medium exposure)
            1, '#5c2e1f'    // Dark brown (high exposure)
          ],
          'circle-opacity': 0.85,
          'circle-stroke-color': '#1a1a1a',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.9
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
            0, 10,
            1, 28
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'weight_tot'],
            0, '#b39f00',   // Dark gold (low)
            0.5, '#d97706',   // Dark orange (medium)
            1, '#c41e3a'    // Dark red (high)
          ],
          'circle-opacity': 0.85,
          'circle-stroke-color': '#1a1a1a',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.9
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

    // Wait for style to be fully loaded before adding ADI source
    const addAdiWhenReady = () => {
      if (!map.current || !map.current.isStyleLoaded()) {
        // Style not ready yet, wait and retry
        map.current?.once('style.load', addAdiWhenReady);
        return;
      }

      // Only add layer if source doesn't exist yet
      if (!map.current.getSource('adi-blockgroups')) {
        const beforeLayer = map.current.getLayer('bronx-zips-fill') ? 'bronx-zips-fill' : undefined;
        addAdiBlockgroupLayers(
          map.current,
          adiData,
          visibleLayers.areaDeprivationIndex,
          beforeLayer,
        );
      }
    };

    addAdiWhenReady();
  }, [adiData, mapReady]);

  // Handle ADI visibility separately
  useEffect(() => {
    if (!map.current || !mapReady) return;

    const adiFillId = 'adi-blockgroups-fill';
    if (map.current.getLayer(adiFillId)) {
      map.current.setLayoutProperty(
        adiFillId,
        'visibility',
        visibleLayers.areaDeprivationIndex ? 'visible' : 'none'
      );
    }
  }, [visibleLayers.areaDeprivationIndex, mapReady]);

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

  // Toggle layer visibility and adjust opacity for contrast
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Count how many ZIP-level layers are visible for opacity adjustment
    const visibleZipLayers = [
      visibleLayers.diseaseBurden,
      visibleLayers.careAccess,
      visibleLayers.environmentalExposure,
      visibleLayers.transit
    ].filter(Boolean).length;

    // Determine opacity based on number of visible layers
    let layerOpacity: number;
    let strokeWidth: number;
    if (visibleZipLayers === 0) {
      layerOpacity = 0;
      strokeWidth = 0;
    } else if (visibleZipLayers === 1) {
      layerOpacity = 0.85;
      strokeWidth = 2;
    } else if (visibleZipLayers === 2) {
      layerOpacity = 0.65;
      strokeWidth = 1.5;
    } else {
      layerOpacity = 0.45;
      strokeWidth = 1;
    }

    // Disease Burden layer
    const burdenLayerId = 'bronx-zips-fill';
    if (map.current.getLayer(burdenLayerId)) {
      map.current.setLayoutProperty(
        burdenLayerId,
        'visibility',
        visibleLayers.diseaseBurden ? 'visible' : 'none'
      );
      map.current.setPaintProperty(
        burdenLayerId,
        'circle-opacity',
        ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, layerOpacity]
      );
      map.current.setPaintProperty(
        burdenLayerId,
        'circle-stroke-width',
        strokeWidth
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
      map.current.setPaintProperty(
        careAccessLayerId,
        'circle-opacity',
        ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, layerOpacity]
      );
      map.current.setPaintProperty(
        careAccessLayerId,
        'circle-stroke-width',
        strokeWidth
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
      map.current.setPaintProperty(
        exposureLayerId,
        'circle-opacity',
        ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, layerOpacity]
      );
      map.current.setPaintProperty(
        exposureLayerId,
        'circle-stroke-width',
        strokeWidth
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
      map.current.setPaintProperty(
        transitLayerId,
        'circle-opacity',
        ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, layerOpacity]
      );
      map.current.setPaintProperty(
        transitLayerId,
        'circle-stroke-width',
        strokeWidth
      );
    }

    // ADI layer
    const adiFillId = 'adi-blockgroups-fill';
    if (map.current.getLayer(adiFillId)) {
      map.current.setLayoutProperty(
        adiFillId,
        'visibility',
        visibleLayers.areaDeprivationIndex ? 'visible' : 'none'
      );
      // Adjust ADI opacity when other layers are visible
      const adiOpacity = (visibleLayers.diseaseBurden || visibleLayers.careAccess || visibleLayers.environmentalExposure || visibleLayers.transit) ? 0.35 : 0.55;
      map.current.setPaintProperty(
        adiFillId,
        'fill-opacity',
        adiOpacity
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

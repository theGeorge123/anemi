"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { Map, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createClient } from "@supabase/supabase-js";
import { ANEMI } from "@/theme/anemi";
import { MapPin, Coffee, AlertTriangle, Loader2 } from "lucide-react";

type Cafe = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string | null;
  verified: boolean | null;
  badges: string[] | null;
  photo_url: string | null;
  owner_quote: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Minimal brand container styles
const containerStyle: React.CSSProperties = {
  height: "72vh",
  width: "100%",
  borderRadius: ANEMI.radius as unknown as number,
  boxShadow: ANEMI.shadow as unknown as string,
  overflow: "hidden",
  background: ANEMI.cream,
};

export default function AnemiMap() {
  const mapRef = useRef<Map | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("All");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  const styleUrl = useMemo(() => {
    // Try MapTiler first, fallback to OpenStreetMap if no key
    const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    if (maptilerKey) {
      return `https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerKey}`;
    }
    // Fallback to OpenStreetMap (free, no API key needed)
    return "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  }, []);

  const centerNL: [number, number] = useMemo(() => [5.2913, 52.1326], []);

  useEffect(() => {
    supabase
      .from("cafes")
      .select("id,name,lat,lng,city,verified,badges,photo_url,owner_quote")
      .then(({ data, error }) => {
        if (!error && data) setCafes(data as Cafe[]);
        setLoading(false);
      });
  }, []);

  // Build filtered GeoJSON
  const geo = useMemo(() => {
    const filtered = cafes.filter(
      (c) => (city === "All" || c.city === city) && (!onlyVerified || !!c.verified)
    );
    return {
      type: "FeatureCollection" as const,
      features: filtered.map((c) => ({
        type: "Feature" as const,
        properties: {
          id: c.id,
          name: c.name,
          city: c.city ?? "",
          verified: !!c.verified,
          badges: c.badges ?? [],
          photo_url: c.photo_url ?? "",
          owner_quote: c.owner_quote ?? "",
        },
        geometry: { type: "Point" as const, coordinates: [c.lng, c.lat] },
      })),
    };
  }, [cafes, city, onlyVerified]);

  // Unique city list for chip filter
  const cities = useMemo(() => {
    const set = new Set<string>(["All"]);
    cafes.forEach((c) => c.city && set.add(c.city));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cafes]);

  // Init / update map
  useEffect(() => {
    if (!nodeRef.current || mapRef.current) return;
    
    try {
      const map = new maplibregl.Map({
        container: nodeRef.current,
        style: styleUrl,
        center: centerNL,
        zoom: 6.8,
        attributionControl: false,
        pitchWithRotate: false,
        dragRotate: false,
      });
      
      mapRef.current = map;

      // Minimal brand UI
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

      map.on("load", () => {
        map.addSource("cafes", {
          type: "geojson",
          data: geo,
          cluster: true,
          clusterRadius: 50,
          clusterMaxZoom: 13,
        });

        // Cluster circles
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "cafes",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              ANEMI.tealSoft,
              25,
              "#A9DBD6",
              75,
              ANEMI.teal,
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              14,
              25,
              18,
              75,
              24,
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Cluster counts
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "cafes",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["Noto Sans Regular"],
            "text-size": 12,
          },
          paint: { "text-color": ANEMI.ink },
        });

        // Unclustered points (verified vs not)
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "cafes",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": 7,
            "circle-color": [
              "case",
              ["get", "verified"],
              ANEMI.verified, // green for verified
              ANEMI.teal, // teal for normal
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Popups
        map.on("click", "unclustered-point", (e) => {
          if (!e.features?.[0]) return;
          const coordinates = (e.features[0].geometry as any).coordinates.slice();
          const properties = e.features[0].properties;

          const popup = new Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div class="p-3 max-w-xs">
                <h3 class="font-semibold text-lg text-gray-900 mb-2">${properties.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${properties.city}</p>
                ${properties.verified ? '<span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">✓ Geverifieerd</span>' : ''}
                ${properties.badges && properties.badges.length > 0 ? `
                  <div class="flex flex-wrap gap-1 mb-2">
                    ${properties.badges.map((badge: string) => `<span class="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">${badge}</span>`).join('')}
                  </div>
                ` : ''}
                ${properties.owner_quote ? `<p class="text-sm text-gray-700 italic">"${properties.owner_quote}"</p>` : ''}
              </div>
            `);

          map.getCanvas().style.cursor = "";
          popup.addTo(map);
        });

        map.on("mouseenter", "unclustered-point", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "unclustered-point", () => {
          map.getCanvas().style.cursor = "";
        });

        // Cluster click
        map.on("click", "clusters", (e) => {
          if (!e.features?.[0]) return;
          const clusterId = e.features[0].properties?.cluster_id;
          const mapboxSource = map.getSource("cafes") as any;
          mapboxSource.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
            if (err) return;
            if (e.features?.[0]) {
              map.easeTo({
                center: (e.features[0].geometry as any).coordinates,
                zoom: zoom,
              });
            }
          });
        });
      });

      map.on("error", (e) => {
        console.error("Map error:", e);
        setMapError("Er ging iets mis bij het laden van de kaart");
      });

    } catch (error) {
      console.error("Failed to initialize map:", error);
      setMapError("Kon de kaart niet laden");
    }
  }, [styleUrl, centerNL, geo]);

  // Update map data when geo changes
  useEffect(() => {
    if (!mapRef.current) return;
    
    const source = mapRef.current.getSource("cafes") as any;
    if (source) {
      source.setData(geo);
    }
  }, [geo]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-amber-800">Kaart laden...</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-72 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-800 mb-2">Kaart kon niet laden</p>
          <p className="text-sm text-red-600 mb-4">{mapError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200 shadow-sm">
          <MapPin className="w-6 h-6 text-amber-600" />
          <div>
            <div className="font-semibold text-amber-800">Interactieve Kaart</div>
            <div className="text-sm text-amber-600">{cafes.length} cafés gevonden</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        {/* City Filter */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 border border-amber-300 rounded-lg bg-white text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "Alle Steden" : c}
            </option>
          ))}
        </select>

        {/* Verified Filter */}
        <label className="flex items-center gap-2 px-4 py-2 border border-amber-300 rounded-lg bg-white text-amber-800 cursor-pointer hover:bg-amber-50">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
            className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
          />
          Alleen geverifieerde cafés
        </label>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div ref={nodeRef} style={containerStyle} />
        
        {/* Map Legend */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-amber-200">
          <div className="text-sm font-medium text-gray-800 mb-2">Legenda</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Geverifieerde cafés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500"></div>
              <span>Normale cafés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Clusters (meerdere cafés)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-amber-200 text-center">
          <Coffee className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-800">{cafes.length}</div>
          <div className="text-sm text-amber-600">Totaal cafés</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-200 text-center">
          <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-800">{cities.length - 1}</div>
          <div className="text-sm text-amber-600">Steden</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-200 text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
          <div className="text-2xl font-bold text-amber-800">
            {cafes.filter(c => c.verified).length}
          </div>
          <div className="text-sm text-amber-600">Geverifieerd</div>
        </div>
      </div>
    </div>
  );
}

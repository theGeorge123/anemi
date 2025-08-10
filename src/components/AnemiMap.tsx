"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { Map, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createClient } from "@supabase/supabase-js";
import { ANEMI } from "@/theme/anemi";

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
  const [city, setCity] = useState<string>("All");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  const styleUrl = useMemo(() => {
    // MapTiler Dataviz Light (clean, neutral). Create a free key and set NEXT_PUBLIC_MAPTILER_KEY
    return `https://api.maptiler.com/maps/dataviz/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
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
      const popup = new Popup({ closeButton: true, closeOnClick: true, maxWidth: "320px" });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0].properties?.cluster_id;
        const source: any = map.getSource("cafes");
        source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (err) return;
          map.easeTo({ center: (features[0].geometry as any).coordinates, zoom });
        });
      });

      map.on("click", "unclustered-point", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties as any;
        const coords = (f.geometry as any).coordinates.slice();

        const badges = JSON.parse(p.badges || "[]") as string[];
        const badgeHtml = badges
          .map(
            (b: string) =>
              `<span style="font-size:11px;padding:2px 8px;border:1px solid #E6ECF2;border-radius:999px;margin-right:6px;">${b}</span>`
          )
          .join("");

        const check = p.verified === true || p.verified === "true";
        const photo = p.photo_url
          ? `<img src="${p.photo_url}" style="width:100%;border-radius:12px;margin-top:8px;">`
          : "";

        const card = `
          <div style="font-family: system-ui,-apple-system,Segoe UI,Roboto,Inter; color:${ANEMI.ink};">
            <div style="background:${ANEMI.sand};border-radius:14px;padding:12px;box-shadow:${ANEMI.shadow}">
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:10px;height:10px;border-radius:50%;background:${check ? ANEMI.verified : ANEMI.teal};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2)"></div>
                <div style="font-weight:600">${p.name}${check ? " ✔︎" : ""}</div>
              </div>
              <div style="font-size:12px;color:${ANEMI.muted};margin-top:4px;">${p.city || ""}</div>
              ${photo}
              ${p.owner_quote ? `<div style="font-size:12px;fontStyle:italic;margin-top:8px;">“${p.owner_quote}”</div>` : ""}
              ${badges.length ? `<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;">${badgeHtml}</div>` : ""}
              <a href="/cafe/${p.id}" style="display:inline-block;margin-top:10px;font-size:12px;padding:8px 12px;border-radius:12px;background:${ANEMI.teal};color:white;text-decoration:none;">Bekijk café</a>
            </div>
          </div>
        `;

        popup.setLngLat(coords).setHTML(card).addTo(map);
      });

      map.on("mouseenter", "unclustered-point", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "unclustered-point", () => (map.getCanvas().style.cursor = ""));
    });

    return () => map.remove();
  }, [styleUrl, centerNL]);

  // Update source on filter change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const src = map.getSource("cafes") as any;
    if (src) src.setData(geo);
  }, [geo]);

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: ANEMI.muted }}>Filters:</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              style={{
                fontSize: 13,
                padding: "8px 12px",
                borderRadius: 999,
                border: `1px solid ${c === city ? ANEMI.teal : "#E6ECF2"}`,
                background: c === city ? ANEMI.tealSoft : "#fff",
              }}
            >
              {c}
            </button>
          ))}
          <label
            style={{
              fontSize: 13,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid #E6ECF2",
              background: onlyVerified ? ANEMI.tealSoft : "#fff",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
            />
            Verified
          </label>
        </div>
      </div>

      {/* Map */}
      <div ref={nodeRef} style={containerStyle} />

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: ANEMI.muted }}>Legenda:</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: ANEMI.muted,
          }}
        >
          <i
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: ANEMI.verified,
              display: "inline-block",
              border: "2px solid #fff",
              boxShadow: "0 1px 2px rgba(0,0,0,.2)",
            }}
          />
          Verified café
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: ANEMI.muted,
          }}
        >
          <i
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: ANEMI.teal,
              display: "inline-block",
              border: "2px solid #fff",
              boxShadow: "0 1px 2px rgba(0,0,0,.2)",
            }}
          />
          Alle cafés
        </span>
      </div>
    </div>
  );
}

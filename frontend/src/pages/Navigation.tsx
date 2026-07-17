import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FiNavigation,
  FiCompass,
  FiMapPin,
  FiCheckCircle,
  FiFilter,
  FiSearch,
  FiLayers,
} from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useLanguage } from "../store/LanguageContext";
import { useTheme } from "../store/ThemeContext";
import { navigationService, POI, StadiumRoute } from "../services/navigationService";
import { crowdService, CrowdHeatpoint } from "../services/crowdService";

export const Navigation: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const { theme } = useTheme();

  const [pois, setPois] = useState<POI[]>([]);
  const [filteredPois, setFilteredPois] = useState<POI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Autocomplete state for main search bar
  const [showMainAutocomplete, setShowMainAutocomplete] = useState(false);
  const [mainSuggestions, setMainSuggestions] = useState<POI[]>([]);

  // Autocomplete state for Route Planner Source
  const [sourceSearch, setSourceSearch] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [showSourceAutocomplete, setShowSourceAutocomplete] = useState(false);
  const [sourceSuggestions, setSourceSuggestions] = useState<POI[]>([]);

  // Autocomplete state for Route Planner Destination
  const [destSearch, setDestSearch] = useState("");
  const [destId, setDestId] = useState("");
  const [showDestAutocomplete, setShowDestAutocomplete] = useState(false);
  const [destSuggestions, setDestSuggestions] = useState<POI[]>([]);

  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [route, setRoute] = useState<StadiumRoute | null>(null);
  const [loading, setLoading] = useState(false);

  // Live crowd density states
  const [showCrowdOverlay, setShowCrowdOverlay] = useState(false);
  const [crowdPoints, setCrowdPoints] = useState<CrowdHeatpoint[]>([]);
  const crowdCirclesRef = useRef<L.Circle[]>([]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Refs for outside click handlers
  const mainSearchRef = useRef<HTMLDivElement>(null);
  const sourceSearchRef = useRef<HTMLDivElement>(null);
  const destSearchRef = useRef<HTMLDivElement>(null);

  // 1. Fetch POIs
  useEffect(() => {
    const fetchPOIs = async () => {
      try {
        const res = await navigationService.getPOIs();
        if (res.data) {
          setPois(res.data);
          setFilteredPois(res.data);
        }
      } catch (err) {
        console.error("Failed to load map POIs", err);
      }
    };
    fetchPOIs();
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [34.0522, -118.2437],
        zoom: 17,
        zoomControl: true,
      });
      mapRef.current = map;

      const style = document.createElement("style");
      style.innerHTML = `
        @keyframes routeDashAnimation {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animated-route-line {
          animation: routeDashAnimation 1s linear infinite;
        }
        .animated-accessible-route-line {
          animation: routeDashAnimation 0.85s linear infinite;
          filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.75));
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 3. Dynamic Tile Layer Theme management
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const tileUrl =
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const attribution =
      theme === "dark"
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

    tileLayerRef.current = L.tileLayer(tileUrl, { attribution }).addTo(mapRef.current);
  }, [theme]);

  // 3b. Fetch crowd statistics when active
  useEffect(() => {
    if (showCrowdOverlay) {
      const fetchCrowd = async () => {
        try {
          const res = await crowdService.getCrowdStats();
          if (res.data && res.data.heatpoints) {
            setCrowdPoints(res.data.heatpoints);
          }
        } catch (err) {
          console.error("Failed to fetch crowd stats", err);
        }
      };

      fetchCrowd();
      const interval = setInterval(fetchCrowd, 10000);
      return () => clearInterval(interval);
    }
  }, [showCrowdOverlay]);

  // 3c. Render or Clear Crowd Overlays
  useEffect(() => {
    if (!mapRef.current) return;

    crowdCirclesRef.current.forEach((c) => c.remove());
    crowdCirclesRef.current = [];

    if (!showCrowdOverlay) return;

    const getColorForIntensity = (intensity: number) => {
      if (intensity > 0.75) return "#ef4444"; // high
      if (intensity > 0.45) return "#f97316"; // medium
      return "#eab308"; // low
    };

    crowdPoints.forEach((point) => {
      const circle = L.circle([point.lat, point.lng], {
        color: getColorForIntensity(point.intensity),
        fillColor: getColorForIntensity(point.intensity),
        fillOpacity: 0.35,
        radius: 30,
        stroke: false,
      })
        .bindPopup(`<strong>${point.section} Density</strong><br/>Intensity: ${Math.round(point.intensity * 100)}%`)
        .addTo(mapRef.current!);

      crowdCirclesRef.current.push(circle);
    });
  }, [showCrowdOverlay, crowdPoints]);

  // 4. Autocomplete filter effects
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMainSuggestions([]);
      return;
    }
    const matches = pois.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
    setMainSuggestions(matches);
  }, [searchQuery, pois]);

  useEffect(() => {
    if (!sourceSearch.trim()) {
      setSourceSuggestions([]);
      return;
    }
    const matches = pois.filter((p) =>
      p.name.toLowerCase().includes(sourceSearch.toLowerCase())
    ).slice(0, 5);
    setSourceSuggestions(matches);
  }, [sourceSearch, pois]);

  useEffect(() => {
    if (!destSearch.trim()) {
      setDestSuggestions([]);
      return;
    }
    const matches = pois.filter((p) =>
      p.name.toLowerCase().includes(destSearch.toLowerCase())
    ).slice(0, 5);
    setDestSuggestions(matches);
  }, [destSearch, pois]);

  // 5. Handle clicks outside autocomplete widgets
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (mainSearchRef.current && !mainSearchRef.current.contains(target)) {
        setShowMainAutocomplete(false);
      }
      if (sourceSearchRef.current && !sourceSearchRef.current.contains(target)) {
        setShowSourceAutocomplete(false);
      }
      if (destSearchRef.current && !destSearchRef.current.contains(target)) {
        setShowDestAutocomplete(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 6. Update Map Markers when filter, search or pois list changes
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = pois.filter((poi) => {
      const matchesSearch = poi.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || poi.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredPois(filtered);

    const markerConfig: Record<string, { color: string; emoji: string }> = {
      gate: { color: "#1e3a8a", emoji: "🚪" },
      concession: { color: "#f97316", emoji: "🍔" },
      "first-aid": { color: "#ef4444", emoji: "🏥" },
      restroom: { color: "#06b6d4", emoji: "🚻" },
      parking: { color: "#3b82f6", emoji: "🅿️" },
      entrance: { color: "#10b981", emoji: "📥" },
      exit: { color: "#059669", emoji: "📤" },
      shop: { color: "#8b5cf6", emoji: "🛍️" },
      elevator: { color: "#14b8a6", emoji: "🛗" },
    };

    filtered.forEach((poi) => {
      const config = markerConfig[poi.type] || { color: "#64748b", emoji: "📍" };

      const customIcon = L.divIcon({
        className: "custom-stadium-marker",
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-xl text-white border-2 border-white transition-all transform hover:scale-110" 
               style="background-color: ${config.color}; font-size: 15px;">
            ${config.emoji}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const popupHtml = `
        <div class="p-2 font-sans text-xs text-slate-800" dir="${isRtl ? "rtl" : "ltr"}">
          <strong class="block text-sm border-b pb-1 mb-1 text-fifa-navy">${poi.name}</strong>
          <span class="block mb-0.5"><strong>Level:</strong> Floor ${poi.level}</span>
          <span class="block mb-1"><strong>Status:</strong> <span class="capitalize font-bold text-fifa-blue">${poi.status}</span></span>
          <span class="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-black uppercase text-slate-500">
            ${poi.isAccessible ? "♿ Step-Free" : "⚠️ Stairs Only"}
          </span>
          <div class="mt-2.5 flex gap-1">
            <button onclick="window.setStartLocation('${poi.id}', '${poi.name}')" class="px-2 py-1 rounded bg-fifa-blue text-white text-[10px] font-extrabold hover:bg-fifa-blue/90">
              Start
            </button>
            <button onclick="window.setEndLocation('${poi.id}', '${poi.name}')" class="px-2 py-1 rounded bg-fifa-pitch text-white text-[10px] font-extrabold hover:bg-fifa-pitch/90">
              End
            </button>
          </div>
        </div>
      `;

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon })
        .bindPopup(popupHtml)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

    (window as any).setStartLocation = (id: string, name: string) => {
      setSourceId(id);
      setSourceSearch(name);
    };
    (window as any).setEndLocation = (id: string, name: string) => {
      setDestId(id);
      setDestSearch(name);
    };
  }, [pois, searchQuery, selectedCategory, isRtl]);

  // 7. Draw Route paths
  useEffect(() => {
    if (!mapRef.current) return;

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (route && route.points.length > 0) {
      const coords = route.points.map((p) => [p.lat, p.lng] as L.LatLngTuple);
      
      const isAccessible = route.isAccessibleRoute;
      const polylineColor = isAccessible ? "#3b82f6" : "#10b981";
      const lineClass = isAccessible ? "animated-accessible-route-line" : "animated-route-line";
      
      const polyline = L.polyline(coords, {
        color: polylineColor,
        weight: 6,
        opacity: 0.9,
        dashArray: isAccessible ? "12, 8" : "10, 10",
        className: lineClass,
      }).addTo(mapRef.current);

      routeLineRef.current = polyline;

      const bounds = L.latLngBounds(coords);
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [route]);

  const handleRouteCalculation = async () => {
    if (!sourceId || !destId) return;
    setLoading(true);
    try {
      const res = await navigationService.calculateRoute(sourceId, destId, accessibleOnly);
      if (res.data) setRoute(res.data);
    } catch (err) {
      console.error("Failed to calculate routing path", err);
    } finally {
      setLoading(false);
    }
  };

  const flyToPoi = (poi: POI) => {
    if (mapRef.current) {
      mapRef.current.flyTo([poi.lat, poi.lng], 19, {
        animate: true,
        duration: 1.5,
      });

      const marker = markersRef.current.find(
        (m) =>
          m.getLatLng().lat === poi.lat && m.getLatLng().lng === poi.lng
      );
      if (marker) {
        setTimeout(() => marker.openPopup(), 1600);
      }
    }
  };

  const resetMapRoute = () => {
    setRoute(null);
    setSourceId("");
    setSourceSearch("");
    setDestId("");
    setDestSearch("");
    if (mapRef.current) {
      mapRef.current.setView([34.0522, -118.2437], 17);
    }
  };

  const categories = [
    { value: "all", label: "All Items" },
    { value: "gate", label: "Gates" },
    { value: "concession", label: "Food & Drinks" },
    { value: "first-aid", label: "Medical Center" },
    { value: "restroom", label: "Washrooms" },
    { value: "parking", label: "Parking Space" },
    { value: "entrance", label: "Entrances" },
    { value: "exit", label: "Exits" },
    { value: "shop", label: "Merchandise Shops" },
    { value: "elevator", label: "Elevators" },
  ];

  return (
    <div className="container mx-auto px-6 py-6 text-light-text dark:text-dark-text transition-colors duration-200" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Title Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <FiCompass className="text-fifa-blue dark:text-fifa-sky animate-spin-slow" /> {t("nav_map")}
          </h1>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            Locate entrance gates, restrooms, food courts, and safety zones using active spatial grids.
          </p>
        </div>

        {route && (
          <Button variant="secondary" size="sm" onClick={resetMapRoute}>
            Reset Route
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Map Filters & POIs List */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Controls Card */}
          <Card>
            <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border bg-slate-50/50 dark:bg-fifa-navy/20">
              <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                <FiNavigation className="text-fifa-blue dark:text-fifa-sky" /> Route Planner
              </h3>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              
              {/* Starting Point Autocomplete */}
              <div className="relative" ref={sourceSearchRef}>
                <label className="block text-[10px] font-black uppercase text-light-muted dark:text-dark-muted mb-1">
                  Starting Point
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type starting location..."
                    className="w-full rounded-xl px-3 py-2 bg-slate-50 dark:bg-fifa-navy border border-light-border dark:border-fifa-border text-xs focus:outline-none focus:border-fifa-blue"
                    value={sourceSearch}
                    onChange={(e) => {
                      setSourceSearch(e.target.value);
                      setShowSourceAutocomplete(true);
                      if (!e.target.value) setSourceId("");
                    }}
                    onFocus={() => setShowSourceAutocomplete(true)}
                  />
                  {sourceId && (
                    <span className="absolute right-3 top-2.5 text-[9px] font-extrabold text-fifa-pitch uppercase">
                      Selected
                    </span>
                  )}
                </div>
                {showSourceAutocomplete && sourceSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-1 bg-white dark:bg-fifa-navy border border-light-border dark:border-fifa-border rounded-xl shadow-xl max-h-40 overflow-y-auto">
                    {sourceSuggestions.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSourceId(p.id);
                          setSourceSearch(p.name);
                          setShowSourceAutocomplete(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-fifa-darkNavy/50 text-xs font-bold border-b border-light-border/40 dark:border-fifa-border/40 last:border-b-0 cursor-pointer"
                      >
                        {p.name} (L{p.level})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Autocomplete */}
              <div className="relative" ref={destSearchRef}>
                <label className="block text-[10px] font-black uppercase text-light-muted dark:text-dark-muted mb-1">
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type destination location..."
                    className="w-full rounded-xl px-3 py-2 bg-slate-50 dark:bg-fifa-navy border border-light-border dark:border-fifa-border text-xs focus:outline-none focus:border-fifa-blue"
                    value={destSearch}
                    onChange={(e) => {
                      setDestSearch(e.target.value);
                      setShowDestAutocomplete(true);
                      if (!e.target.value) setDestId("");
                    }}
                    onFocus={() => setShowDestAutocomplete(true)}
                  />
                  {destId && (
                    <span className="absolute right-3 top-2.5 text-[9px] font-extrabold text-fifa-pitch uppercase">
                      Selected
                    </span>
                  )}
                </div>
                {showDestAutocomplete && destSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-1 bg-white dark:bg-fifa-navy border border-light-border dark:border-fifa-border rounded-xl shadow-xl max-h-40 overflow-y-auto">
                    {destSuggestions.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setDestId(p.id);
                          setDestSearch(p.name);
                          setShowDestAutocomplete(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-fifa-darkNavy/50 text-xs font-bold border-b border-light-border/40 dark:border-fifa-border/40 last:border-b-0 cursor-pointer"
                      >
                        {p.name} (L{p.level})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 py-1 border-b border-light-border dark:border-fifa-border/40 pb-2.5 mb-1">
                <input
                  id="accessible_route_toggle"
                  type="checkbox"
                  checked={accessibleOnly}
                  onChange={(e) => setAccessibleOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-light-border text-fifa-blue focus:ring-fifa-blue/20"
                />
                <label htmlFor="accessible_route_toggle" className="text-xs font-bold cursor-pointer">
                  Prioritize Step-Free Access (♿)
                </label>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <label htmlFor="crowd_overlay_toggle" className="text-xs font-bold cursor-pointer flex items-center gap-1.5">
                  <FiLayers className="text-fifa-pitch" /> Show Live Crowd Density
                </label>
                <button
                  id="crowd_overlay_toggle"
                  onClick={() => setShowCrowdOverlay(!showCrowdOverlay)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                    showCrowdOverlay ? "bg-fifa-pitch" : "bg-slate-300 dark:bg-fifa-navy"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      showCrowdOverlay ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleRouteCalculation}
                disabled={loading || !sourceId || !destId}
                className="shadow-fifa-glow"
              >
                {loading ? "Calculating Path..." : "Calculate Route"}
              </Button>
            </CardContent>
          </Card>

          {/* Filtering & POI list card */}
          <Card className="flex-1 flex flex-col min-h-[300px] max-h-[400px]">
            <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <FiFilter className="text-fifa-blue dark:text-fifa-sky" /> Location Explorer
                </h3>
                <Badge variant="blue" size="sm">
                  {filteredPois.length} POIs
                </Badge>
              </div>

              {/* Main Search Bar with Autocomplete Dropdown */}
              <div className="relative" ref={mainSearchRef}>
                <FiSearch className="absolute left-3 top-3 text-light-muted dark:text-dark-muted" size={14} />
                <input
                  type="text"
                  placeholder="Search location names..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-light-border rounded-xl text-xs focus:outline-none focus:border-fifa-blue dark:bg-fifa-navy dark:border-fifa-border"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowMainAutocomplete(true);
                  }}
                  onFocus={() => setShowMainAutocomplete(true)}
                />
                {showMainAutocomplete && mainSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-50 mt-1.5 bg-white dark:bg-fifa-navy border border-light-border dark:border-fifa-border rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {mainSuggestions.map((poi) => (
                      <div
                        key={poi.id}
                        onClick={() => {
                          setSearchQuery(poi.name);
                          setShowMainAutocomplete(false);
                          flyToPoi(poi);
                        }}
                        className="px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-fifa-darkNavy/50 text-xs font-bold border-b border-light-border/40 dark:border-fifa-border/40 last:border-b-0 cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate">{poi.name}</span>
                        <span className="text-[10px] text-light-muted dark:text-dark-muted uppercase font-black">
                          L{poi.level} &bull; {poi.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Tabs Selector */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase whitespace-nowrap border transition-all ${
                      selectedCategory === cat.value
                        ? "bg-fifa-blue border-fifa-blue text-white"
                        : "bg-slate-50 dark:bg-fifa-navy border-light-border dark:border-fifa-border text-light-muted dark:text-dark-muted hover:border-fifa-blue"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {filteredPois.map((poi) => (
                <div
                  key={poi.id}
                  onClick={() => flyToPoi(poi)}
                  className="p-3 bg-slate-50/50 hover:bg-slate-100 dark:bg-fifa-navy/10 dark:hover:bg-fifa-navy/30 border border-light-border dark:border-fifa-border rounded-xl flex items-center justify-between cursor-pointer transition-all hover:translate-x-1"
                >
                  <div className="truncate pr-2">
                    <span className="block text-xs font-black truncate">{poi.name}</span>
                    <span className="text-[10px] text-light-muted dark:text-dark-muted block">
                      Level {poi.level} &bull; Type: <span className="capitalize">{poi.type}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {poi.isAccessible && <span title="Accessible path" className="text-xs">♿</span>}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        poi.status === "open"
                          ? "bg-fifa-pitch"
                          : poi.status === "busy"
                          ? "bg-orange-400"
                          : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              ))}

              {filteredPois.length === 0 && (
                <div className="text-center py-8 text-xs text-light-muted dark:text-dark-muted">
                  No matching points of interest found.
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: Leaflet Map Render & Turn-by-Turn Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          
          {/* Interactive Leaflet Map Container */}
          <div className="relative border border-light-border dark:border-fifa-border rounded-2xl overflow-hidden shadow-md h-[450px]">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
            
            {/* Absolute overlay legend */}
            <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-fifa-navy/95 border border-light-border dark:border-fifa-border rounded-xl p-3 shadow-lg z-20 pointer-events-none text-[10px] space-y-1">
              <span className="font-extrabold uppercase text-light-muted dark:text-dark-muted block mb-1">
                Map Legend
              </span>
              <div className="flex items-center gap-2"><span className="text-xs">🚪</span> <span>Gate Entry</span></div>
              <div className="flex items-center gap-2"><span className="text-xs">🍔</span> <span>Concession</span></div>
              <div className="flex items-center gap-2"><span className="text-xs">🏥</span> <span>First Aid</span></div>
              <div className="flex items-center gap-2"><span className="text-xs">🚻</span> <span>Washrooms</span></div>
              <div className="flex items-center gap-2"><span className="text-xs">🅿️</span> <span>Parking</span></div>
              <div className="flex items-center gap-2"><span className="text-xs">🛍️</span> <span>Shop</span></div>
            </div>
          </div>

          {/* Turn-by-Turn Directions */}
          {route && (
            <Card>
              <CardHeader className="p-4 border-b border-light-border dark:border-fifa-border flex justify-between items-center">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Routing Details</h3>
                <div className="flex gap-4 items-center text-xs font-bold text-light-muted dark:text-dark-muted">
                  <span>Distance: <strong className="text-fifa-blue dark:text-fifa-sky">{route.distanceMeters}m</strong></span>
                  <span>Est. Time: <strong className="text-fifa-pitch">{Math.ceil(route.estimatedSeconds / 60)} min</strong></span>
                  {route.isAccessibleRoute && (
                    <Badge variant="blue" className="bg-fifa-blue hover:bg-fifa-blue/90 text-white animate-pulse gap-1 text-[9px] uppercase font-black">
                      ♿ Wheelchair Route
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  {route.instructions.map((inst, index) => (
                    <li key={index} className="flex gap-3 text-xs items-start">
                      <FiCheckCircle size={16} className="text-fifa-pitch flex-shrink-0 mt-0.5 animate-pulse" />
                      <span className="leading-relaxed">{inst}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
};

export default Navigation;

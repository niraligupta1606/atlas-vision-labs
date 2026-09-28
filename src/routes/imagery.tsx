import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ComponentType } from "react";
import {
  CalendarDays, Check, CheckCircle2, ChevronDown, CircleDot, Cloud, Crosshair,
  Database, EllipsisVertical, FileArchive, Focus, Image as ImageIcon, Layers3,
  LocateFixed, Map, MapPin, Minus, Orbit, Plus, RefreshCw, Satellite, Search,
  Sparkles, Upload, X,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { toast, Toaster } from "sonner";

import satelliteImage from "@/assets/kanpur-satellite.jpg";
import changeImage from "@/assets/change-satellite.jpg";
import classificationImage from "@/assets/land-classification.jpg";
import { GeoPanel, GeoSRLayout } from "@/components/geosr-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/imagery")({
  head: () => ({
    meta: [
      { title: "Imagery Library | GeoSR Intelligence" },
      { name: "description", content: "Browse, manage, and process satellite imagery for AI-powered super-resolution mapping." },
      { property: "og:title", content: "Imagery Library | GeoSR Intelligence" },
      { property: "og:description", content: "Explore satellite scenes, metadata, spectral bands, and imagery quality." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImageryPage,
});

type Icon = ComponentType<{ className?: string }>;
type SceneStatus = "Ready" | "Processing" | "Queued" | "Enhanced";
type Scene = {
  id: string; location: string; date: string; cloud: string; resolution: string;
  status: SceneStatus; satellite: "Sentinel-2" | "Landsat-9"; image: string;
  position: string; coordinates: string; area: string;
};

const scenes: [Scene, ...Scene[]] = [
  { id: "S2A_MSIL2A_20250415T053621", location: "Kanpur, Uttar Pradesh, India", date: "2025-04-15 05:36", cloud: "8.2%", resolution: "10 m", status: "Ready", satellite: "Sentinel-2", image: satelliteImage, position: "50% 52%", coordinates: "26.4498° N, 80.3319° E", area: "24.6 km²" },
  { id: "S2B_MSIL2A_20250412T054631", location: "Lucknow, Uttar Pradesh, India", date: "2025-04-12 05:46", cloud: "12.4%", resolution: "10 m", status: "Processing", satellite: "Sentinel-2", image: changeImage, position: "24% 45%", coordinates: "26.8467° N, 80.9462° E", area: "18.2 km²" },
  { id: "S2A_MSIL2A_20250408T052621", location: "Ahmedabad, Gujarat, India", date: "2025-04-08 05:26", cloud: "4.7%", resolution: "10 m", status: "Ready", satellite: "Sentinel-2", image: classificationImage, position: "76% 50%", coordinates: "23.0225° N, 72.5714° E", area: "31.4 km²" },
  { id: "S2B_MSIL2A_20250405T054612", location: "Varanasi, Uttar Pradesh, India", date: "2025-04-05 05:46", cloud: "18.9%", resolution: "10 m", status: "Queued", satellite: "Sentinel-2", image: satelliteImage, position: "18% 58%", coordinates: "25.3176° N, 82.9739° E", area: "16.8 km²" },
  { id: "S2A_MSIL2A_20250328T052631", location: "Jaipur, Rajasthan, India", date: "2025-03-28 05:26", cloud: "6.3%", resolution: "10 m", status: "Ready", satellite: "Sentinel-2", image: changeImage, position: "82% 68%", coordinates: "26.9124° N, 75.7873° E", area: "22.7 km²" },
  { id: "S2A_MSIL2A_20250321T054621", location: "Patna, Bihar, India", date: "2025-03-21 05:46", cloud: "21.7%", resolution: "10 m", status: "Ready", satellite: "Sentinel-2", image: satelliteImage, position: "70% 36%", coordinates: "25.5941° N, 85.1376° E", area: "27.9 km²" },
  { id: "S2A_MSIL2A_20250318T053611", location: "Indore, Madhya Pradesh, India", date: "2025-03-18 05:36", cloud: "10.2%", resolution: "10 m", status: "Enhanced", satellite: "Sentinel-2", image: classificationImage, position: "30% 72%", coordinates: "22.7196° N, 75.8577° E", area: "19.5 km²" },
  { id: "S2B_MSIL2A_20250312T054631", location: "Chennai, Tamil Nadu, India", date: "2025-03-12 05:46", cloud: "7.5%", resolution: "10 m", status: "Ready", satellite: "Sentinel-2", image: changeImage, position: "12% 34%", coordinates: "13.0827° N, 80.2707° E", area: "34.1 km²" },
  { id: "LC09_L2SP_144044_20250308", location: "Bhopal, Madhya Pradesh, India", date: "2025-03-08 05:21", cloud: "9.8%", resolution: "30 m", status: "Ready", satellite: "Landsat-9", image: satelliteImage, position: "88% 40%", coordinates: "23.2599° N, 77.4126° E", area: "42.3 km²" },
  { id: "S2A_MSIL2A_20250224T053619", location: "Nagpur, Maharashtra, India", date: "2025-02-24 05:36", cloud: "14.1%", resolution: "10 m", status: "Processing", satellite: "Sentinel-2", image: classificationImage, position: "45% 24%", coordinates: "21.1458° N, 79.0882° E", area: "29.2 km²" },
  { id: "LC09_L2SP_145043_20250218", location: "Ranchi, Jharkhand, India", date: "2025-02-18 05:18", cloud: "5.9%", resolution: "30 m", status: "Queued", satellite: "Landsat-9", image: changeImage, position: "55% 80%", coordinates: "23.3441° N, 85.3096° E", area: "38.6 km²" },
  { id: "S2B_MSIL2A_20250211T054629", location: "Surat, Gujarat, India", date: "2025-02-11 05:46", cloud: "11.6%", resolution: "10 m", status: "Enhanced", satellite: "Sentinel-2", image: satelliteImage, position: "33% 48%", coordinates: "21.1702° N, 72.8311° E", area: "25.8 km²" },
];

function ImageryPage() {
  const [selected, setSelected] = useState(scenes[0]);
  const [search, setSearch] = useState("");
  const [satellite, setSatellite] = useState("Sentinel-2");
  const [dateRange, setDateRange] = useState("Last 3 Months");
  const [sort, setSort] = useState("Newest");
  const [zoom, setZoom] = useState(1);
  const [mapLayer, setMapLayer] = useState<"map" | "satellite">("satellite");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [superResolving, setSuperResolving] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = scenes.filter((scene) => (satellite === "All Satellites" || scene.satellite === satellite) && (!query || `${scene.id} ${scene.location} ${scene.status}`.toLowerCase().includes(query)));
    return sort === "Oldest" ? [...list].reverse() : list;
  }, [satellite, search, sort]);

  const chooseScene = (scene: Scene) => { setSelected(scene); setZoom(1); };
  const preProcess = () => {
    if (preparing) return;
    setPreparing(true);
    window.setTimeout(() => { setPreparing(false); toast.success("Pre-processing complete.", { description: `${selected.id} is ready for enhancement.` }); }, 1100);
  };
  const runSuperResolution = () => {
    if (superResolving) return;
    setSuperResolving(true);
    toast.loading("Preparing imagery...", { id: "super-resolution" });
    window.setTimeout(() => { setSuperResolving(false); toast.success("Super resolution processing started.", { id: "super-resolution" }); }, 1400);
  };

  return <GeoSRLayout active="Imagery">
    <Toaster theme="dark" position="bottom-right" richColors />
    <div className="mx-auto max-w-[1800px] p-2.5 lg:p-3">
      <ImageryHeader />
      <div className="mt-2 grid grid-cols-1 gap-2.5 xl:grid-cols-[minmax(0,3fr)_minmax(290px,1fr)]">
        <div className="min-w-0 space-y-2.5">
          <ImageryFilters search={search} setSearch={setSearch} dateRange={dateRange} setDateRange={setDateRange} satellite={satellite} setSatellite={setSatellite} onUpload={() => setUploadOpen(true)} />
          <SatelliteMap scene={selected} zoom={zoom} setZoom={setZoom} layer={mapLayer} setLayer={setMapLayer} />
          <ImageryGrid scenes={filtered} total={scenes.length} selected={selected} onSelect={chooseScene} sort={sort} setSort={setSort} />
        </div>
        <SceneDetails scene={selected} onMap={() => { setZoom(1.16); toast.success("Map focused on selected scene."); }} onPreProcess={preProcess} preparing={preparing} onSuperResolution={runSuperResolution} superResolving={superResolving} />
      </div>
    </div>
    {uploadOpen && <UploadImageryModal close={() => setUploadOpen(false)} />}
  </GeoSRLayout>;
}

function ImageryHeader() {
  return <header className="flex items-center gap-3 px-0.5 py-1">
    <div className="grid size-9 shrink-0 place-items-center rounded-md border border-primary/70 bg-primary/10 text-primary shadow-glow"><ImageIcon className="size-5" /></div>
    <div><h1 className="text-lg font-semibold leading-tight">Imagery Library</h1><p className="text-[10px] text-muted-foreground sm:text-[11px]">Browse, manage and process satellite imagery for super resolution mapping.</p></div>
  </header>;
}

function ImageryFilters({ search, setSearch, dateRange, setDateRange, satellite, setSatellite, onUpload }: {
  search: string; setSearch: (value: string) => void; dateRange: string; setDateRange: (value: string) => void;
  satellite: string; setSatellite: (value: string) => void; onUpload: () => void;
}) {
  return <section className="glass-panel grid grid-cols-1 gap-2 rounded-md p-2 sm:grid-cols-2 xl:grid-cols-[minmax(250px,1.7fr)_142px_118px_auto]">
    <label className="flex h-9 items-center gap-2 rounded-md border border-border bg-background/30 px-3 focus-within:border-primary"><Search className="size-3.5 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[9px] outline-none placeholder:text-muted-foreground" placeholder="Search by location, scene ID, or satellite..." /></label>
    <FilterSelect icon={CalendarDays} label="Date Range" value={dateRange} onChange={setDateRange} options={["Last 3 Months", "Last 6 Months", "Last Year"]} />
    <FilterSelect icon={Satellite} label="Satellite" value={satellite} onChange={setSatellite} options={["Sentinel-2", "Landsat-9", "All Satellites"]} />
    <Button className="h-9" onClick={onUpload}><Upload className="size-3.5" />Upload Imagery</Button>
  </section>;
}

function FilterSelect({ icon: SelectIcon, label, value, onChange, options }: { icon: Icon; label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="grid h-9 grid-cols-[22px_1fr] items-center rounded-md border border-border bg-background/30 px-2 focus-within:border-primary"><SelectIcon className="size-3.5 text-muted-foreground" /><span className="min-w-0"><span className="block text-[7px] leading-none text-muted-foreground">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-0.5 w-full bg-transparent text-[9px] leading-none outline-none"><>{options.map((option) => <option className="bg-popover" key={option}>{option}</option>)}</></select></span></label>;
}

function SatelliteMap({ scene, zoom, setZoom, layer, setLayer }: { scene: Scene; zoom: number; setZoom: (value: number) => void; layer: "map" | "satellite"; setLayer: (value: "map" | "satellite") => void }) {
  return <section className="glass-panel relative h-[220px] overflow-hidden rounded-md sm:h-[245px] xl:h-[258px]">
    <img src={layer === "satellite" ? scene.image : classificationImage} alt={`Satellite map centered on ${scene.location}`} className={`absolute inset-0 size-full object-cover transition-all duration-500 ${layer === "map" ? "saturate-50 contrast-125" : ""}`} style={{ transform: `scale(${zoom})`, objectPosition: scene.position }} />
    <div className="map-scan pointer-events-none absolute inset-0 opacity-25" />
    <div className="absolute left-2 top-2 rounded-md border border-border bg-panel/90 p-2 text-[8px] leading-relaxed backdrop-blur-md"><b className="block text-[9px] text-foreground">Selected AOI</b><span className="text-muted-foreground">Area: </span>{scene.area}<br /><span className="text-muted-foreground">Coordinates:</span><br />{scene.coordinates}</div>
    <div className="absolute right-2 top-2 flex rounded-md border border-border bg-panel/90 p-0.5 text-[8px]"><Button size="sm" variant={layer === "map" ? "default" : "ghost"} className="h-6 px-2" onClick={() => setLayer("map")}>Map</Button><Button size="sm" variant={layer === "satellite" ? "default" : "ghost"} className="h-6 px-2" onClick={() => setLayer("satellite")}>Satellite</Button></div>
    <div className="absolute left-2 top-[92px] flex flex-col gap-1"><MapControl icon={Plus} label="Zoom in" onClick={() => setZoom(Math.min(1.6, zoom + .1))} /><MapControl icon={Minus} label="Zoom out" onClick={() => setZoom(Math.max(1, zoom - .1))} /><MapControl icon={LocateFixed} label="Reset location" onClick={() => setZoom(1)} /></div>
    <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 900 270" preserveAspectRatio="none"><polygon points="405,72 535,58 598,188 455,232 365,126" fill="color-mix(in oklab, var(--primary) 24%, transparent)" stroke="var(--primary)" strokeWidth="2" />{[[405,72],[535,58],[598,188],[455,232],[365,126]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="var(--primary)" stroke="var(--foreground)" />)}</svg>
    <span className="absolute left-[51%] top-[50%] rounded bg-panel/80 px-2 py-0.5 text-[8px] text-primary">AOI-1</span>
    <div className="absolute bottom-2 right-2 rounded bg-panel/85 px-2 py-1 text-[7px]"><div className="flex w-32 justify-between"><span>0</span><span>2.5</span><span>5</span><span>10 km</span></div><div className="mt-1 h-0.5 bg-foreground" /></div>
  </section>;
}

function MapControl({ icon: ControlIcon, label, onClick }: { icon: Icon; label: string; onClick: () => void }) { return <Button variant="icon" size="icon" className="size-7" aria-label={label} title={label} onClick={onClick}><ControlIcon className="size-3.5" /></Button>; }

function ImageryGrid({ scenes: displayedScenes, total, selected, onSelect, sort, setSort }: { scenes: Scene[]; total: number; selected: Scene; onSelect: (scene: Scene) => void; sort: string; setSort: (value: string) => void }) {
  return <GeoPanel title={`Available Imagery (${total})`} action={<label className="flex items-center gap-1 text-[8px] text-muted-foreground">Sort by:<select aria-label="Sort imagery" value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent text-foreground outline-none"><option className="bg-popover">Newest</option><option className="bg-popover">Oldest</option></select><ChevronDown className="size-3" /></label>}>
    {displayedScenes.length ? <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 xl:grid-cols-4">{displayedScenes.slice(0, 8).map((scene) => <ImageryCard key={scene.id} scene={scene} selected={scene.id === selected.id} onSelect={() => onSelect(scene)} />)}</div> : <div className="grid h-44 place-items-center text-xs text-muted-foreground">No imagery matches these filters.</div>}
  </GeoPanel>;
}

function ImageryCard({ scene, selected, onSelect }: { scene: Scene; selected: boolean; onSelect: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAction = (action: string) => { setMenuOpen(false); onSelect(); toast.success(`${action}: ${scene.location}`); };
  return <article role="button" tabIndex={0} onClick={onSelect} onKeyDown={(event) => { if (event.key === "Enter") onSelect(); }} className={`group relative min-w-0 overflow-hidden rounded-md border bg-background/20 p-1.5 transition-all ${selected ? "border-primary shadow-glow" : "border-border hover:border-primary/70"}`}>
    <div className="relative h-[88px] overflow-hidden rounded-sm"><img src={scene.image} alt={`${scene.location} satellite scene`} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" style={{ objectPosition: scene.position }} />{selected && <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-success text-primary-foreground"><Check className="size-3" /></span>}</div>
    <h3 className="mt-1.5 truncate text-[8px] font-medium" title={scene.id}>{scene.id}</h3>
    <div className="mt-1 space-y-0.5 text-[7px] leading-relaxed text-muted-foreground"><p className="flex items-center gap-1 truncate"><MapPin className="size-2.5 shrink-0" />{scene.location}</p><p className="flex items-center gap-1"><CalendarDays className="size-2.5" />{scene.date}</p><p className="flex items-center gap-1"><Cloud className="size-2.5" />Cloud Cover: {scene.cloud}</p><p className="flex items-center gap-1"><ScanIcon />Resolution: {scene.resolution}</p><p className="flex items-center gap-1 truncate"><Layers3 className="size-2.5 shrink-0" />Bands: B2, B3, B4, B8 (10m)</p></div>
    <div className="mt-1.5 flex items-center justify-between"><StatusBadge status={scene.status} /><Button variant="ghost" size="icon" className="size-5" aria-label={`Actions for ${scene.id}`} onClick={(event) => { event.stopPropagation(); setMenuOpen(!menuOpen); }}><EllipsisVertical className="size-3" /></Button></div>
    {menuOpen && <div className="absolute bottom-7 right-2 z-20 w-32 rounded-md border border-border bg-popover p-1 shadow-glow">{["View Details", "View on Map", "Pre-process", "Run Super Resolution"].map((action) => <Button key={action} variant="ghost" size="sm" className="w-full justify-start text-[8px]" onClick={(event) => { event.stopPropagation(); menuAction(action); }}>{action}</Button>)}</div>}
  </article>;
}

function ScanIcon() { return <CircleDot className="size-2.5" />; }
function StatusBadge({ status }: { status: SceneStatus }) {
  const styles: Record<SceneStatus, string> = { Ready: "bg-success/15 text-success", Processing: "bg-map-water/20 text-map-water", Queued: "bg-muted text-muted-foreground", Enhanced: "bg-chart-4/20 text-chart-4" };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[7px] ${styles[status]}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}

function SceneDetails({ scene, onMap, onPreProcess, preparing, onSuperResolution, superResolving }: { scene: Scene; onMap: () => void; onPreProcess: () => void; preparing: boolean; onSuperResolution: () => void; superResolving: boolean }) {
  return <aside className="glass-panel min-w-0 rounded-md p-3 xl:sticky xl:top-[70px] xl:max-h-[calc(100vh-82px)] xl:overflow-auto">
    <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Scene Details</h2><Button variant="ghost" size="icon" className="size-7" aria-label="Scene options"><EllipsisVertical className="size-4" /></Button></div>
    <div className="mt-2 grid grid-cols-[102px_minmax(0,1fr)] gap-3"><img src={scene.image} alt={`Selected scene ${scene.location}`} className="h-[92px] w-full rounded-md border border-border object-cover" style={{ objectPosition: scene.position }} /><div className="min-w-0"><p className="break-all text-[8px] font-medium leading-relaxed">{scene.id}</p><div className="mt-1"><StatusBadge status={scene.status} /></div><p className="mt-2 flex items-start gap-1 text-[8px] text-muted-foreground"><MapPin className="mt-0.5 size-3 shrink-0" />{scene.location}</p><p className="mt-1 flex items-center gap-1 text-[8px] text-muted-foreground"><CalendarDays className="size-3" />{scene.date}</p></div></div>
    <div className="my-3 h-px bg-border" />
    <MetadataList scene={scene} />
    <div className="mt-4 space-y-2"><Button variant="outline" className="w-full" onClick={onMap}><Map className="size-4 text-primary" />View on Map</Button><Button variant="outline" className="w-full" onClick={onPreProcess} disabled={preparing}>{preparing ? <RefreshCw className="size-4 animate-spin" /> : <Focus className="size-4" />}{preparing ? "Pre-processing..." : "Pre-process"}</Button><Button className="w-full" onClick={onSuperResolution} disabled={superResolving}>{superResolving ? <RefreshCw className="size-4 animate-spin" /> : <Sparkles className="size-4" />}{superResolving ? "Preparing imagery..." : "Run Super Resolution"}</Button></div>
    <div className="my-3 h-px bg-border" />
    <SpectralBands scene={scene} />
    <div className="my-3 h-px bg-border" />
    <ImageQuality />
  </aside>;
}

const metadata: Array<[string, string, Icon]> = [["Satellite", "Sentinel-2", Satellite], ["Resolution", "10 m", Orbit], ["Product Type", "Multispectral", Layers3], ["Cloud Cover", "8.2%", Cloud], ["File Format", "GeoTIFF", FileArchive], ["Bands", "B2, B3, B4, B8 (10m)", Database], ["Coordinates", "26.4498° N, 80.3319° E", Crosshair]];
function MetadataList({ scene }: { scene: Scene }) { return <section><h3 className="mb-2 text-[10px] font-semibold">Metadata</h3><div className="space-y-2">{metadata.map(([label, fallback, MetaIcon]) => { const value = label === "Satellite" ? scene.satellite : label === "Resolution" ? scene.resolution : label === "Cloud Cover" ? scene.cloud : label === "Coordinates" ? scene.coordinates : fallback; return <div key={label} className="grid grid-cols-[88px_14px_minmax(0,1fr)] items-start gap-2 text-[8px]"><span className="text-muted-foreground">{label}</span><MetaIcon className="size-3 text-muted-foreground" /><span className="break-words">{value}</span></div>; })}</div></section>; }

const bandData = [["B2", "Blue", "grayscale contrast-125 brightness-75"], ["B3", "Green", "grayscale contrast-150 brightness-90"], ["B4", "Red", "grayscale contrast-200 brightness-75"], ["B8", "NIR", "grayscale invert contrast-125"]];
function SpectralBands({ scene }: { scene: Scene }) { return <section><h3 className="mb-2 text-[10px] font-semibold">Spectral Bands Preview</h3><div className="grid grid-cols-4 gap-2">{bandData.map(([band, name, filter]) => <div key={band} className="min-w-0 text-center"><img src={scene.image} alt={`${band} ${name} spectral band`} className={`aspect-square w-full rounded-md border border-border object-cover ${filter}`} style={{ objectPosition: scene.position }} /><span className="mt-1 block text-[7px] text-muted-foreground">{band} ({name})</span></div>)}</div></section>; }

function ImageQuality() { const data = [{ value: 91 }, { value: 9 }]; return <section><h3 className="text-[10px] font-semibold">Image Quality</h3><div className="mt-2 grid grid-cols-[80px_1fr] items-center gap-3"><div className="relative h-20"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={27} outerRadius={34} startAngle={90} endAngle={-270} stroke="transparent" isAnimationActive={false}><Cell fill="var(--primary)" /><Cell fill="var(--muted)" /></Pie></PieChart></ResponsiveContainer><b className="pointer-events-none absolute inset-0 grid place-items-center text-sm">91%</b></div><div><b className="text-[10px] text-success">Good Quality</b><div className="mt-2 space-y-1">{["Low Cloud Cover", "Clear Visibility", "Suitable for Processing"].map((item) => <p key={item} className="flex items-center gap-1 text-[8px] text-muted-foreground"><CheckCircle2 className="size-3 text-success" />{item}</p>)}</div></div></div></section>; }

function UploadImageryModal({ close }: { close: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const simulateUpload = () => { if (!fileName) { fileRef.current?.click(); return; } toast.success("Imagery uploaded successfully.", { description: `${fileName} was added to the processing queue.` }); close(); };
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-background/85 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="upload-title" className="glass-panel w-full max-w-md rounded-md p-4 shadow-glow"><div className="flex items-center justify-between"><div><h2 id="upload-title" className="text-sm font-semibold">Upload Imagery</h2><p className="mt-1 text-[9px] text-muted-foreground">Add GeoTIFF or multispectral scene files for processing.</p></div><Button variant="ghost" size="icon" onClick={close} aria-label="Close upload"><X className="size-4" /></Button></div><button type="button" onClick={() => fileRef.current?.click()} className="mt-4 grid h-36 w-full place-items-center rounded-md border border-dashed border-primary/60 bg-primary/5 text-center transition-colors hover:bg-primary/10"><span><Upload className="mx-auto size-7 text-primary" /><b className="mt-2 block text-xs">{fileName || "Choose satellite imagery"}</b><span className="mt-1 block text-[9px] text-muted-foreground">GeoTIFF, TIFF or ZIP up to 20 MB</span></span></button><input ref={fileRef} type="file" accept=".tif,.tiff,.zip,image/tiff" className="hidden" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /><div className="mt-4 flex justify-end gap-2"><Button variant="ghost" onClick={close}>Cancel</Button><Button onClick={simulateUpload}><Upload className="size-4" />{fileName ? "Upload Imagery" : "Select File"}</Button></div></div></div>;
}
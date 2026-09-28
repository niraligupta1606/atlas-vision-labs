import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import {
  Building2, ChartNoAxesCombined, Download, Droplets, Fullscreen, Layers3, Leaf, LocateFixed,
  Map, MapPin, Minus, Orbit, Play, Plus, RefreshCw, Route as Road, ShieldCheck, Sparkles,
  Thermometer, TrendingUp, Upload, Waves, X,
} from "lucide-react";
import {
  CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { GeoPanel as Panel, GeoSRLayout, SelectControl } from "@/components/geosr-shell";
import satelliteImage from "@/assets/kanpur-satellite.jpg";
import classificationImage from "@/assets/land-classification.jpg";
import changeImage from "@/assets/change-satellite.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Analysis | GeoSR Intelligence" },
      { name: "description", content: "Explore AI-enhanced satellite imagery, land cover, spectral signatures, and change detection." },
      { property: "og:title", content: "Analysis | GeoSR Intelligence" },
      { property: "og:description", content: "Explore AI-enhanced satellite imagery and remote-sensing insights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeoSRDashboard,
});

type Icon = ComponentType<{ className?: string }>;
type ModalState = "change" | "map" | null;

const classes = [
  ["Built-up", "38.7%", "bg-map-built"], ["Vegetation", "42.3%", "bg-map-vegetation"],
  ["Water", "8.9%", "bg-map-water"], ["Agriculture", "7.4%", "bg-map-agriculture"],
  ["Others", "2.7%", "bg-map-other"],
];

function GeoSRDashboard() {
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [layer, setLayer] = useState<"enhanced" | "classification">("enhanced");
  const [zoom, setZoom] = useState(1);
  const [modal, setModal] = useState<ModalState>(null);
  const [comparison, setComparison] = useState(50);
  const runAnalysis = () => {
    setRunning(true); setComplete(false);
    window.setTimeout(() => { setRunning(false); setComplete(true); toast.success("Analysis complete", { description: "Land-cover insights have been refreshed." }); }, 1200);
  };

  return (
    <GeoSRLayout active="Analysis">
      <Toaster theme="dark" position="bottom-right" richColors />
        <div className="mx-auto max-w-[1700px] p-3 lg:p-4">
          <header className="mb-3 flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-md border border-primary/70 bg-primary/10 text-primary shadow-glow">
              <ChartNoAxesCombined className="size-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold leading-tight">Analysis</h1>
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">Explore insights, perform analytical operations and extract valuable information from enhanced satellite imagery.</p>
            </div>
          </header>

          <FilterBar running={running} complete={complete} runAnalysis={runAnalysis} />

          <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">
            <MapPanel layer={layer} setLayer={setLayer} zoom={zoom} setZoom={setZoom} />
            <Insights />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.05fr_.78fr_1.03fr]">
            <ClassificationCard />
            <ChangeDetection comparison={comparison} setComparison={setComparison} onOpen={() => setModal("change")} />
            <SpectralAnalysis />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.05fr_.78fr_1.03fr]">
            <StatisticalSummary />
            <FeatureExtraction />
            <UncertaintyAnalysis />
          </div>

          <ActionButtons onMap={() => setModal("map")} />
        </div>
      {modal && <MapModal mode={modal} close={() => setModal(null)} />}
    </GeoSRLayout>
  );
}

function FilterBar({ running, complete, runAnalysis }: { running: boolean; complete: boolean; runAnalysis: () => void }) {
  return <section className="glass-panel grid grid-cols-1 gap-2 rounded-md p-2 sm:grid-cols-2 xl:grid-cols-[1.08fr_1.05fr_.88fr_1.08fr_auto]">
    <SelectControl icon={Orbit} label="Scene ID" value="S2A_MSIL2A_20250415T053621" options={["S2A_MSIL2A_20250415T053621", "S2B_MSIL2A_20250328T053619"]} />
    <SelectControl icon={MapPin} label="Location" value="Kanpur, Uttar Pradesh, India" options={["Kanpur, Uttar Pradesh, India", "Lucknow, Uttar Pradesh, India"]} />
    <SelectControl icon={Layers3} label="Resolution" value="10 m → 2.5 m (4x)" options={["10 m → 2.5 m (4x)", "10 m → 5 m (2x)"]} />
    <SelectControl icon={Sparkles} label="Analysis Type" value="Land Cover Classification" options={["Land Cover Classification", "Change Detection", "Spectral Analysis"]} />
    <Button className="h-11 min-w-36" onClick={runAnalysis} disabled={running}>{running ? <RefreshCw className="size-4 animate-spin" /> : complete ? <ShieldCheck className="size-4" /> : <Play className="size-4 fill-current" />}{running ? "Processing..." : complete ? "Analysis Complete" : "Run Analysis"}</Button>
  </section>;
}


function MapPanel({ layer, setLayer, zoom, setZoom }: { layer: "enhanced" | "classification"; setLayer: (v: "enhanced" | "classification") => void; zoom: number; setZoom: (v: number) => void }) {
  return <div className="glass-panel relative min-h-[305px] overflow-hidden rounded-md xl:min-h-[260px]">
    <img src={layer === "enhanced" ? satelliteImage : classificationImage} alt={layer === "enhanced" ? "Enhanced satellite imagery of Kanpur" : "Land cover classification map"} width={1536} height={768} className="absolute inset-0 size-full object-cover transition-transform duration-300" style={{ transform: `scale(${zoom})` }} />
    <div className="map-scan pointer-events-none absolute inset-0 opacity-30" />
    <div className="absolute left-2 top-2 flex rounded-md bg-panel/90 p-1 text-[9px]"><button onClick={() => setLayer("enhanced")} className={`rounded px-2.5 py-1 ${layer === "enhanced" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}>Enhanced Imagery</button><button onClick={() => setLayer("classification")} className={`rounded px-2.5 py-1 ${layer === "classification" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}>Classification Map</button></div>
    <div className="absolute left-2 top-12 flex flex-col gap-1"><MapControl icon={Plus} label="Zoom in" onClick={() => setZoom(Math.min(1.5, zoom + .1))} /><MapControl icon={Minus} label="Zoom out" onClick={() => setZoom(Math.max(1, zoom - .1))} /><MapControl icon={LocateFixed} label="Reset view" onClick={() => setZoom(1)} /></div>
    <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 800 310" preserveAspectRatio="none"><polygon points="350,79 497,65 555,198 410,248 316,135" fill="color-mix(in oklab, var(--primary) 18%, transparent)" stroke="var(--primary)" strokeWidth="2" />{[[350,79],[497,65],[555,198],[410,248],[316,135]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="var(--primary)" stroke="var(--foreground)" />)}</svg>
    <span className="absolute left-[48%] top-[50%] rounded bg-panel/75 px-2 py-1 text-[9px] text-primary">AOI-1</span>
    <div className="absolute bottom-3 left-3 rounded bg-panel/75 px-2 py-1 text-[8px] text-foreground"><div className="flex w-40 justify-between"><span>0</span><span>2.5</span><span>5</span><span>10 km</span></div><div className="mt-1 h-1 bg-foreground/80" /></div>
    <div className="absolute right-2 top-2 w-40 rounded-md border border-border bg-panel/92 p-3 text-[9px] backdrop-blur-md"><p className="mb-2 font-semibold">Land Cover Classes</p><LegendRows /></div>
  </div>;
}

function MapControl({ icon: ControlIcon, label, onClick }: { icon: Icon; label: string; onClick: () => void }) { return <Button variant="icon" size="icon" className="size-7" onClick={onClick} aria-label={label}><ControlIcon className="size-3.5" /></Button>; }
function LegendRows() { return <div className="space-y-2">{classes.map(([label, value, color]) => <div key={label} className="grid grid-cols-[10px_1fr_auto] items-center gap-2"><span className={`size-2.5 rounded-sm ${color}`} /><span>{label}</span><span>{value}</span></div>)}</div>; }

function Insights() {
  const insights: Array<[string, string, string, Icon]> = [["Dominant Land Cover", "Vegetation", "42.3%", Leaf], ["Urban Area", "", "38.7%", Building2], ["Water Bodies", "", "8.9%", Waves], ["Agricultural Land", "", "7.4%", Leaf]];
  const trends: Array<[string, Icon]> = [["Urban expansion observed in eastern region", Building2], ["Vegetation increase in northern area (+6.2%)", TrendingUp], ["Water body stable (<1% change)", Waves], ["No significant change in agricultural zones", Leaf]];
  return <Panel title="Key Insights"><div className="grid min-h-[265px] gap-2 p-2 sm:grid-cols-[1.05fr_.95fr] xl:min-h-[220px]">
    <div className="space-y-1.5">{insights.map(([label, secondary, value, InsightIcon]) => <div key={label} className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-border/70 bg-background/20 p-2"><span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary"><InsightIcon className="size-4" /></span><span className="min-w-0 text-[9px] text-muted-foreground">{label}{secondary && <b className="mt-1 block text-[11px] font-medium text-primary">{secondary}</b>}</span><b className="text-xs font-medium text-primary">{value}</b></div>)}</div>
    <div className="rounded-md border border-border/70 bg-background/20 p-2"><h3 className="mb-1 text-[11px] font-semibold">Trends & Patterns</h3>{trends.map(([text, TrendIcon]) => <div key={text} className="flex gap-2 border-b border-border/50 py-2 last:border-0"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><TrendIcon className="size-3.5" /></span><p className="text-[9px] leading-snug text-muted-foreground">{text}</p></div>)}</div>
  </div></Panel>;
}

function ClassificationCard() {
  return <Panel title="Land Cover Classification" action={<MiniSelect value="Classified Map" options={["Classified Map", "Enhanced Map"]} />}><div className="grid min-h-[190px] grid-cols-[1.45fr_.8fr] gap-3 p-3 xl:min-h-[150px]"><img src={classificationImage} loading="lazy" width={1024} height={640} alt="Classified satellite map" className="h-32 w-full rounded-md object-cover sm:h-full" /><div className="self-center text-[9px]"><LegendRows /></div></div><div className="flex flex-wrap gap-4 border-t border-border px-3 py-2 text-[8px]">{classes.map(([label,,color]) => <span key={label} className="flex items-center gap-1"><i className={`size-2 rounded-full ${color}`} />{label}</span>)}</div></Panel>;
}

function ChangeDetection({ comparison, setComparison, onOpen }: { comparison: number; setComparison: (v: number) => void; onOpen: () => void }) {
  return <Panel title="Change Detection"><div className="p-3">
    <div className="relative h-[105px] overflow-hidden rounded-md border border-border xl:h-[80px]"><img src={changeImage} loading="lazy" width={1024} height={640} alt="2024 satellite comparison" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-y-0 right-0 overflow-hidden" style={{ width: `${100-comparison}%` }}><img src={satelliteImage} loading="lazy" width={1536} height={768} alt="2025 satellite comparison" className="absolute right-0 h-full max-w-none object-cover grayscale-[15%]" style={{ width: `${10000/(100-comparison || 1)}%` }} /></div><div className="absolute inset-y-0 w-px bg-primary" style={{ left: `${comparison}%` }}><span className="absolute left-1/2 top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary bg-panel text-[9px]">↔</span></div><input aria-label="Compare 2024 and 2025 imagery" className="absolute inset-0 size-full cursor-ew-resize opacity-0" type="range" min="15" max="85" value={comparison} onChange={(e) => setComparison(Number(e.target.value))} /><span className="absolute bottom-1 left-1 bg-panel/80 px-1 text-[8px]">2024-04-15</span><span className="absolute bottom-1 right-1 bg-panel/80 px-1 text-[8px]">2025-04-15</span></div>
    <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-primary/40 bg-primary/5 p-2"><span className="grid size-8 place-items-center rounded-full border border-success text-success"><TrendingUp className="size-4" /></span><div className="min-w-0 text-[9px]"><b className="text-xs text-primary">+6.2%</b> &nbsp; <b className="text-success">Vegetation Increase</b><span className="block text-muted-foreground">in Northern Region</span></div></div>
    <div className="mt-2 text-right"><Button variant="outline" size="sm" onClick={onOpen}>View Change Map</Button></div>
  </div></Panel>;
}

const spectralData = [{ band: "B2", original: .18, resolved: .12, reference: .15 }, { band: "B3", original: .38, resolved: .3, reference: .34 }, { band: "B4", original: .45, resolved: .32, reference: .34 }, { band: "B8", original: .78, resolved: .74, reference: .81 }];
function SpectralAnalysis() { return <Panel title="Spectral Analysis" action={<MiniSelect value="AOI-1" options={["AOI-1", "AOI-2"]} />}><div className="h-[214px] p-2 xl:h-[170px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={spectralData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="var(--border)" vertical={true} /><XAxis dataKey="band" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} /><YAxis domain={[0,1]} ticks={[0,.2,.4,.6,.8,1]} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} /><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 10 }} /><Legend wrapperStyle={{ fontSize: 9 }} /><Line isAnimationActive={false} type="monotone" dataKey="original" name="Original (10m)" stroke="var(--map-water)" strokeDasharray="5 4" strokeWidth={2} dot={false} /><Line isAnimationActive={false} type="monotone" dataKey="resolved" name="Super Resolved (2.5m)" stroke="var(--success)" strokeWidth={2} dot={false} /><Line isAnimationActive={false} type="monotone" dataKey="reference" name="Reference (HR)" stroke="var(--primary)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></Panel>; }

function MiniSelect({ value, options }: { value: string; options: string[] }) { const [v, setV] = useState(value); return <select value={v} onChange={(e) => setV(e.target.value)} className="rounded border border-border bg-background/30 px-2 py-1 text-[9px] text-primary outline-none">{options.map((x) => <option className="bg-popover" key={x}>{x}</option>)}</select>; }

function StatisticalSummary() {
  const data: Array<[string,string,string,Icon]> = [["NDVI","0.687","↑ 6.4%",Leaf],["NDBI","0.231","↑ 2.1%",Building2],["MNDWI","0.142","↑ 3.7%",Waves],["Land Surface Temp.","32.6 °C","↓ 1.8%",Thermometer]];
  return <Panel title="Statistical Summary"><div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">{data.map(([name,value,delta,MetricIcon]) => <div key={name} className="rounded-md border border-border bg-background/20 p-2"><p className="truncate text-[9px] text-muted-foreground">{name}</p><p className="mt-2 text-base font-medium">{value}</p><div className="mt-1 flex items-center justify-between text-[9px]"><span>{delta}</span><MetricIcon className="size-3 text-primary" /></div></div>)}</div></Panel>;
}

function FeatureExtraction() {
  const items: Array<[string,Icon]> = [["Road Network Extraction",Road],["Building Detection",Building2],["Water Body Mapping",Droplets],["Vegetation Health (NDVI)",Leaf]];
  return <Panel title="Feature Extraction"><div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 md:grid-cols-2 xl:grid-cols-4">{items.map(([name, FeatureIcon]) => <button key={name} onClick={() => toast("Preparing analysis", { description: name })} className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-md border border-border bg-background/20 p-2 text-[9px] transition-all hover:border-primary hover:bg-accent/70 hover:shadow-glow"><FeatureIcon className="size-4 text-primary transition-transform group-hover:scale-110" /><span>{name}</span></button>)}</div></Panel>;
}

const uncertaintyData = [{ name: "Low", value: 62, fill: "var(--success)" }, { name: "Medium", value: 28, fill: "var(--primary)" }, { name: "High", value: 8, fill: "var(--map-agriculture)" }, { name: "Very High", value: 2, fill: "var(--map-built)" }];
function UncertaintyAnalysis() { return <Panel title="Uncertainty Analysis"><div className="grid h-[124px] grid-cols-[1fr_92px_1fr] items-center gap-2 p-3 xl:h-[110px]"><img src={classificationImage} loading="lazy" width={1024} height={640} alt="Uncertainty classification preview" className="h-full w-full rounded-md object-cover" /><div className="relative h-20"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie isAnimationActive={false} data={uncertaintyData} dataKey="value" innerRadius={28} outerRadius={38} stroke="transparent" /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center text-[8px] text-muted-foreground">Mean<br />Uncertainty<br /><b className="text-sm text-foreground">8.2%</b></div></div><div className="space-y-2 text-[8px]">{[["Low (0–5%)","62%","bg-success"],["Medium (5–15%)","28%","bg-primary"],["High (15–30%)","8%","bg-map-agriculture"],["Very High (>30%)","2%","bg-map-built"]].map(([label,value,color]) => <div key={label} className="grid grid-cols-[8px_1fr_auto] items-center gap-1"><span className={`size-2 rounded-full ${color}`} /><span>{label}</span><span>{value}</span></div>)}</div></div></Panel>; }

function ActionButtons({ onMap }: { onMap: () => void }) { return <div className="mt-3 flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => toast.success("Report generation started", { description: "Your PDF will be ready shortly." })}><Download className="size-4" />Download Analysis Report</Button><Button variant="outline" onClick={() => toast.loading("Exporting GeoTIFF…", { duration: 1800 })}><Upload className="size-4" />Export GeoTIFF</Button><Button variant="outline" onClick={onMap}><Map className="size-4" />View on Map</Button></div>; }

function MapModal({ mode, close }: { mode: Exclude<ModalState, null>; close: () => void }) {
  useEffect(() => { const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(); window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [close]);
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-background/85 p-3 backdrop-blur-md" onMouseDown={close}><div role="dialog" aria-modal="true" aria-label={mode === "change" ? "Change detection map" : "Map view"} onMouseDown={(e) => e.stopPropagation()} className="glass-panel w-full max-w-5xl overflow-hidden rounded-lg"><div className="flex items-center justify-between border-b border-border p-3"><div><h2 className="font-semibold">{mode === "change" ? "Change Detection — 2024 to 2025" : "AOI-1 Map View"}</h2><p className="text-[10px] text-muted-foreground">Kanpur, Uttar Pradesh, India · Super Resolved 2.5m</p></div><Button variant="ghost" size="icon" onClick={close} aria-label="Close map"><X className="size-5" /></Button></div><div className="relative aspect-[16/8] max-h-[72vh]"><img src={mode === "change" ? classificationImage : satelliteImage} width={1536} height={768} alt="Expanded geospatial analysis map" className="size-full object-cover" /><div className="absolute bottom-3 right-3 flex gap-2"><Button variant="icon" size="icon"><LocateFixed className="size-4" /></Button><Button variant="icon" size="icon"><Fullscreen className="size-4" /></Button></div></div></div></div>;
}
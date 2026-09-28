import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Activity, CalendarDays, ChartNoAxesCombined, Columns2, Download, Expand,
  FileDown, Images, Info, Layers2, MapPin, Maximize, Minus, Orbit, Plus,
  ScanLine, SlidersHorizontal, TrendingDown, TrendingUp, Upload,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { toast, Toaster } from "sonner";

import { GeoPanel, GeoSRLayout, SelectControl } from "@/components/geosr-shell";
import { Button } from "@/components/ui/button";
import satelliteImage from "@/assets/kanpur-satellite.jpg";
import changeImage from "@/assets/change-satellite.jpg";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Imagery | GeoSR Intelligence" },
      { name: "description", content: "Compare original, enhanced, and reference satellite imagery to evaluate super-resolution performance." },
      { property: "og:title", content: "Compare Imagery | GeoSR Intelligence" },
      { property: "og:description", content: "Evaluate satellite super-resolution performance with quantitative and spectral comparisons." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComparePage,
});

type Icon = ComponentType<{ className?: string }>;
type ViewMode = "split" | "swipe" | "overlay";
type ImageChoice = "Original (10 m)" | "Super Resolved (2.5 m)" | "Reference (1 m)";

function ComparePage() {
  const [position, setPosition] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [metricsTab, setMetricsTab] = useState<"quantitative" | "spectral">("quantitative");
  const [selected, setSelected] = useState<ImageChoice>("Super Resolved (2.5 m)");
  const [mode, setMode] = useState<ViewMode>("split");
  const [opacity, setOpacity] = useState(55);
  const comparisonRef = useRef<HTMLDivElement>(null);

  const fullscreen = async () => {
    const node = comparisonRef.current;
    if (!node) return;
    try { await node.requestFullscreen(); } catch { toast.error("Fullscreen is unavailable in this browser."); }
  };

  return <GeoSRLayout active="Compare">
    <Toaster theme="dark" position="bottom-right" richColors />
    <div className="mx-auto max-w-[1700px] p-3 lg:p-4">
      <CompareHeader />
      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2.7fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-3">
          <ComparisonFilters />
          <ImageComparisonSlider comparisonRef={comparisonRef} position={position} setPosition={setPosition} zoom={zoom} setZoom={setZoom} onFullscreen={fullscreen} mode={mode} opacity={opacity} />
          <PreviewGrid />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.55fr_.95fr]">
            <SideBySideComparison selected={selected} setSelected={setSelected} />
            <ViewModeSelector mode={mode} setMode={setMode} opacity={opacity} setOpacity={setOpacity} />
          </div>
        </div>
        <aside className="min-w-0 space-y-3">
          <ComparisonMetrics tab={metricsTab} setTab={setMetricsTab} />
          <ExportShare />
        </aside>
      </div>
    </div>
  </GeoSRLayout>;
}

function CompareHeader() {
  return <header className="glass-panel flex items-center gap-3 rounded-md p-2.5">
    <div className="grid size-10 shrink-0 place-items-center rounded-md border border-primary/70 bg-primary/10 text-primary shadow-glow"><Images className="size-6" /></div>
    <div className="min-w-0"><h1 className="text-xl font-semibold leading-tight">Compare Imagery</h1><p className="text-[11px] text-muted-foreground sm:text-xs">Compare original, enhanced and reference imagery to evaluate the super resolution performance.</p></div>
  </header>;
}

function ComparisonFilters() {
  return <section className="glass-panel grid grid-cols-1 gap-2 rounded-md p-2 sm:grid-cols-2 xl:grid-cols-[1.25fr_1.25fr_1fr_.9fr]">
    <SelectControl icon={Orbit} label="Scene ID" value="S2A_MSIL2A_20250415T053621" options={["S2A_MSIL2A_20250415T053621", "S2B_MSIL2A_20250328T053619"]} />
    <SelectControl icon={MapPin} label="Location" value="Kanpur, Uttar Pradesh, India" options={["Kanpur, Uttar Pradesh, India", "Lucknow, Uttar Pradesh, India"]} />
    <SelectControl icon={ScanLine} label="Resolution" value="10 m → 2.5 m (4x)" options={["10 m → 2.5 m (4x)", "10 m → 5 m (2x)"]} />
    <SelectControl icon={CalendarDays} label="Acquisition Date" value="2025-04-15 05:36" options={["2025-04-15 05:36", "2025-03-28 05:36"]} />
  </section>;
}

function ImageComparisonSlider({ comparisonRef, position, setPosition, zoom, setZoom, onFullscreen, mode, opacity }: {
  comparisonRef: React.RefObject<HTMLDivElement | null>;
  position: number; setPosition: (v: number) => void; zoom: number; setZoom: (v: number) => void;
  onFullscreen: () => void; mode: ViewMode; opacity: number;
}) {
  return <div ref={comparisonRef} className="glass-panel relative h-[310px] overflow-hidden rounded-md bg-panel sm:h-[360px] xl:h-[342px]">
    <ComparisonCanvas position={position} zoom={zoom} mode={mode} opacity={opacity} />
    {mode !== "overlay" && <input aria-label="Image comparison position" type="range" min="10" max="90" value={position} onChange={(event) => setPosition(Number(event.target.value))} className="absolute inset-0 z-20 size-full cursor-ew-resize opacity-0" />}
    <span className="absolute left-3 top-3 z-30 rounded-md bg-panel/90 px-2 py-1 text-[9px] shadow-md">Original (10 m)</span>
    <span className="absolute right-3 top-3 z-30 rounded-md bg-panel/90 px-2 py-1 text-[9px] shadow-md">Super Resolved (2.5 m)</span>
    <span className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-md bg-panel/90 px-2 py-1 text-[9px]"><MapPin className="size-3 text-primary" />Kanpur, Uttar Pradesh, India</span>
    <div className="absolute bottom-3 right-3 z-30 flex gap-1">
      <MapButton icon={Plus} label="Zoom in" onClick={() => setZoom(Math.min(1.6, zoom + .1))} />
      <MapButton icon={Minus} label="Zoom out" onClick={() => setZoom(Math.max(1, zoom - .1))} />
      <MapButton icon={Maximize} label="Open fullscreen" onClick={onFullscreen} />
    </div>
  </div>;
}

function ComparisonCanvas({ position, zoom, mode, opacity }: { position: number; zoom: number; mode: ViewMode; opacity: number }) {
  const baseClass = "absolute inset-0 size-full object-cover transition-transform duration-300";
  if (mode === "overlay") return <><img src={changeImage} alt="Original lower-resolution Kanpur satellite imagery" className={baseClass} style={{ transform: `scale(${zoom})`, filter: "blur(1.4px) saturate(.78)" }} /><img src={satelliteImage} alt="Super resolved Kanpur satellite imagery overlay" className={`${baseClass} transition-opacity`} style={{ transform: `scale(${zoom})`, opacity: opacity / 100 }} /></>;
  if (mode === "split") return <><img src={satelliteImage} alt="Super resolved Kanpur satellite imagery" className={baseClass} style={{ transform: `scale(${zoom})` }} /><div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}><img src={changeImage} alt="Original lower-resolution Kanpur satellite imagery" className="absolute inset-y-0 left-0 h-full max-w-none object-cover" style={{ width: `${10000 / position}%`, transform: `scale(${zoom})`, transformOrigin: "left center", filter: "blur(1.4px) saturate(.78)" }} /></div><Divider position={position} /></>;
  return <><img src={satelliteImage} alt="Super resolved Kanpur satellite imagery" className={baseClass} style={{ transform: `scale(${zoom})` }} /><div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}><img src={changeImage} alt="Original lower-resolution Kanpur satellite imagery" className="absolute inset-y-0 left-0 h-full max-w-none object-cover" style={{ width: `${10000 / position}%`, transform: `scale(${zoom})`, transformOrigin: "left center", filter: "blur(1.4px) saturate(.78)" }} /></div><Divider position={position} /></>;
}

function Divider({ position }: { position: number }) { return <div className="pointer-events-none absolute inset-y-0 z-10 w-px bg-foreground/90" style={{ left: `${position}%` }}><span className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary bg-panel text-primary shadow-glow">↔</span></div>; }
function MapButton({ icon: ControlIcon, label, onClick }: { icon: Icon; label: string; onClick: () => void }) { return <Button variant="icon" size="icon" className="size-7" aria-label={label} title={label} onClick={onClick}><ControlIcon className="size-3.5" /></Button>; }

const previews: Array<{ title: string; resolution?: string; bands?: string; image: string; zoom?: boolean }> = [
  { title: "Original (10 m)", resolution: "10 m", bands: "B2, B3, B4, B8 (10m)", image: changeImage },
  { title: "Super Resolved (2.5 m)", resolution: "2.5 m (4x)", bands: "B2, B3, B4, B8 (2.5m)", image: satelliteImage },
  { title: "Reference (High Res)", resolution: "1 m", bands: "B2, B3, B4, B8 (1m)", image: satelliteImage },
  { title: "Zoomed View", image: satelliteImage, zoom: true },
];

function PreviewGrid() { return <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">{previews.map((item) => <ImagePreviewCard key={item.title} {...item} />)}</div>; }
function ImagePreviewCard({ title, resolution, bands, image, zoom }: { title: string; resolution?: string; bands?: string; image: string; zoom?: boolean }) {
  return <article className="group glass-panel overflow-hidden rounded-md p-2 transition-all hover:border-primary hover:shadow-glow"><h3 className="mb-2 text-[10px] font-medium">{title}</h3><div className="relative h-24 overflow-hidden rounded-sm"><img src={image} alt={`${title} satellite preview`} className={`size-full object-cover transition-transform duration-300 group-hover:scale-105 ${title.startsWith("Original") ? "blur-[1px] saturate-75" : ""} ${zoom ? "scale-150" : ""}`} />{zoom && <span className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-panel/90 px-1.5 py-1 text-[8px]"><Expand className="size-3 text-primary" />200%</span>}</div>{resolution && <div className="mt-2 space-y-1 text-[8px] text-muted-foreground"><p>Resolution: <span className="text-foreground">{resolution}</span></p><p>Bands: <span className="text-foreground">{bands}</span></p></div>}</article>;
}

const choices: Array<{ label: ImageChoice; image: string; soft?: boolean }> = [
  { label: "Original (10 m)", image: changeImage, soft: true }, { label: "Super Resolved (2.5 m)", image: satelliteImage }, { label: "Reference (1 m)", image: satelliteImage },
];
function SideBySideComparison({ selected, setSelected }: { selected: ImageChoice; setSelected: (v: ImageChoice) => void }) {
  return <GeoPanel title="Side-by-Side Comparison" icon={Images}><div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-3">{choices.map((choice) => <Button key={choice.label} variant="ghost" onClick={() => setSelected(choice.label)} className={`h-auto min-w-0 flex-col items-stretch gap-1 rounded-md border p-1 text-left ${selected === choice.label ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-background/20"}`}><img src={choice.image} alt={`${choice.label} selectable preview`} className={`h-16 w-full rounded-sm object-cover ${choice.soft ? "blur-[1px]" : ""}`} /><span className="flex items-center gap-1.5 px-1 text-[8px] font-normal"><i className={`size-2.5 rounded-full border ${selected === choice.label ? "border-primary bg-primary" : "border-muted-foreground"}`} />{choice.label}</span></Button>)}</div></GeoPanel>;
}

const modes: Array<[ViewMode, string, Icon]> = [["split", "Split View", Columns2], ["swipe", "Swipe Slider", SlidersHorizontal], ["overlay", "Overlay", Layers2]];
function ViewModeSelector({ mode, setMode, opacity, setOpacity }: { mode: ViewMode; setMode: (v: ViewMode) => void; opacity: number; setOpacity: (v: number) => void }) {
  return <GeoPanel title="View Mode"><div className="grid grid-cols-3 gap-2 p-2">{modes.map(([value, label, ModeIcon]) => <Button key={value} variant={mode === value ? "default" : "outline"} onClick={() => setMode(value)} className="h-20 min-w-0 flex-col px-1 text-[9px]"><ModeIcon className="size-5" />{label}</Button>)}</div>{mode === "overlay" && <label className="flex items-center gap-2 px-3 pb-3 text-[9px] text-muted-foreground">Overlay opacity<input aria-label="Overlay opacity" type="range" min="0" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="min-w-0 flex-1 accent-primary" /><span className="w-7 text-right text-foreground">{opacity}%</span></label>}</GeoPanel>;
}

const metrics: Array<[string, string, string, Icon]> = [["PSNR ↑", "34.28 dB", "(vs. 1m ref)", TrendingUp], ["SSIM ↑", "0.912", "(vs. 1m ref)", TrendingUp], ["RMSE ↓", "0.873", "(vs. 1m ref)", TrendingDown], ["SAM ↓", "1.24", "(vs. 1m ref)", TrendingDown]];
const bands: Array<[string, string, string]> = [["B2 (Blue)", ".96", "bg-map-water"], ["B3 (Green)", ".94", "bg-success"], ["B4 (Red)", ".93", "bg-map-built"], ["B8 (NIR)", ".91", "bg-chart-4"]];
function ComparisonMetrics({ tab, setTab }: { tab: "quantitative" | "spectral"; setTab: (v: "quantitative" | "spectral") => void }) {
  return <GeoPanel title="Comparison Metrics" icon={ChartNoAxesCombined}>
    <div className="p-2">
      <div className="grid grid-cols-2 rounded-md border border-border p-0.5"><Button size="sm" variant={tab === "quantitative" ? "default" : "ghost"} onClick={() => setTab("quantitative")}>Quantitative</Button><Button size="sm" variant={tab === "spectral" ? "default" : "ghost"} onClick={() => setTab("spectral")}>Spectral</Button></div>
      {tab === "quantitative" ? <><h3 className="mb-2 mt-3 text-[10px] font-medium">Image Quality Metrics</h3><div className="grid grid-cols-2 gap-2">{metrics.map(([name, value, caption, MetricIcon]) => <div key={name} className="rounded-md border border-border bg-background/20 p-2"><div className="flex items-center justify-between text-[9px] text-muted-foreground"><span>{name}</span><MetricIcon className="size-3 text-success" /></div><b className="mt-1 block text-base font-medium">{value}</b><span className="text-[8px] text-muted-foreground">{caption}</span></div>)}</div></> : <SpectralDetail />}
      <SpectralConsistency />
      <ConfidenceCard />
      <div className="mt-2 flex gap-2 rounded-md border border-map-agriculture/60 bg-map-agriculture/5 p-3 text-[9px] leading-relaxed text-map-agriculture"><Info className="mt-0.5 size-4 shrink-0" /><p>Reconstructed details are model-inferred and may not be actual ground truth.<br />Please validate with high-resolution reference data and use uncertainty information for analysis.</p></div>
    </div>
  </GeoPanel>;
}

function SpectralDetail() { return <div className="mt-3 rounded-md border border-border bg-background/20 p-3"><div className="flex items-center gap-2 text-primary"><Activity className="size-4" /><span className="text-[10px] font-medium">Spectral response alignment</span></div><p className="mt-2 text-[9px] leading-relaxed text-muted-foreground">Super-resolved reflectance closely follows the high-resolution reference across visible and near-infrared bands.</p></div>; }
function SpectralConsistency() { const [loaded, setLoaded] = useState(false); useEffect(() => { const id = requestAnimationFrame(() => setLoaded(true)); return () => cancelAnimationFrame(id); }, []); return <div className="mt-3 rounded-md border border-border bg-background/20 p-3"><h3 className="mb-3 text-[10px] font-medium">Spectral Consistency</h3><div className="space-y-2">{bands.map(([label, value, color]) => <div key={label} className="grid grid-cols-[52px_minmax(0,1fr)_24px] items-center gap-2 text-[8px]"><span>{label}</span><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: loaded ? `${Number(value) * 100}%` : "0%" }} /></div><span className="text-right">{value.replace(".", "0.")}</span></div>)}</div></div>; }

function ConfidenceCard() { const data = [{ value: 92 }, { value: 8 }]; return <div className="mt-3 rounded-md border border-border bg-background/20 p-3"><h3 className="text-[10px] font-medium">Confidence &amp; Uncertainty</h3><div className="grid grid-cols-[92px_1fr] items-center gap-3"><div className="relative h-24"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={31} outerRadius={39} startAngle={90} endAngle={-270} stroke="transparent"><Cell fill="var(--primary)" /><Cell fill="var(--muted)" /></Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><span className="text-[8px] text-muted-foreground">Confidence<br /><b className="text-base text-foreground">92%</b></span></div></div><div className="space-y-3 text-[9px]"><div className="flex justify-between"><span className="text-muted-foreground">Confidence Score</span><b>92%</b></div><div><div className="mb-1 flex justify-between"><span className="text-muted-foreground">Uncertainty</span><b>8%</b></div><div className="h-2 rounded-full bg-muted"><div className="h-full w-[92%] rounded-full bg-success" /></div></div></div></div></div>; }

function ExportShare() { return <GeoPanel title="Export / Share" icon={Upload}><div className="space-y-2 p-3"><Button className="w-full" onClick={() => toast.success("Comparison report generated.", { description: "Your report is ready to download." })}><FileDown className="size-4" />Download Comparison Report</Button><Button variant="outline" className="w-full" onClick={() => toast.loading("GeoTIFF export started.", { duration: 1800 })}><Download className="size-4" />Export Images (GeoTIFF)</Button></div></GeoPanel>; }

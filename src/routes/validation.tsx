import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ComponentType } from "react";
import {
  Activity, AlertTriangle, BarChart3, Check, CheckCircle2, ChevronRight, Crosshair,
  Database, Download, Expand, FileCheck2, FileText, Focus, Gauge, Grid2X2,
  Info, Layers3, MapPinned, Maximize, Minus, Orbit, Plus, ScanLine, ShieldCheck,
  SlidersHorizontal, Sparkles, Waves, X,
} from "lucide-react";
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast, Toaster } from "sonner";

import satelliteImage from "@/assets/kanpur-satellite.jpg";
import referenceImage from "@/assets/change-satellite.jpg";
import errorImage from "@/assets/land-classification.jpg";
import { GeoPanel, GeoSRLayout, type GeoIcon } from "@/components/geosr-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/validation")({
  head: () => ({
    meta: [
      { title: "Validation & Scientific Fidelity | GeoSR Intelligence" },
      { name: "description", content: "Validate geospatial alignment, spectral fidelity, spatial detail, and uncertainty for super-resolved satellite imagery." },
      { property: "og:title", content: "Validation & Scientific Fidelity | GeoSR Intelligence" },
      { property: "og:description", content: "Scientific validation of AI-enhanced satellite imagery against a co-registered high-resolution reference." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ValidationPage,
});

type Icon = ComponentType<{ className?: string }>;

function ValidationPage() {
  const [zoom, setZoom] = useState(4.2);
  const [opacity, setOpacity] = useState(70);
  const [swipe, setSwipe] = useState(false);
  const [swipePosition, setSwipePosition] = useState(52);
  const [reportOpen, setReportOpen] = useState(false);
  const comparisonRef = useRef<HTMLDivElement>(null);

  const fullscreen = async () => {
    const node = comparisonRef.current;
    if (!node) return;
    try { await node.requestFullscreen(); } catch { toast.error("Fullscreen is unavailable in this browser."); }
  };

  return <GeoSRLayout active="Validation" context="Validation & Scientific Fidelity">
    <Toaster theme="dark" position="bottom-right" richColors />
    <div className="mx-auto max-w-[1800px] p-2.5 lg:p-3">
      <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-[minmax(0,3.15fr)_minmax(300px,1fr)]">
        <main className="min-w-0 space-y-2.5">
          <ThreeWayComparison comparisonRef={comparisonRef} zoom={zoom} setZoom={setZoom} opacity={opacity} setOpacity={setOpacity} swipe={swipe} setSwipe={setSwipe} swipePosition={swipePosition} setSwipePosition={setSwipePosition} fullscreen={fullscreen} />
          <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-[1.1fr_1fr]">
            <SpatialFidelityChecks />
            <UncertaintyError opacity={opacity} />
          </div>
          <Traceability />
        </main>
        <aside className="min-w-0 space-y-2.5">
          <ValidationSummary />
          <SpectralComparison />
          <PerBandMetrics />
          <ScientificNotice />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <Button variant="outline" onClick={() => setReportOpen(true)}><FileText className="size-4" />View Full Validation Report</Button>
            <Button onClick={() => toast.success("Validation report generated successfully.")}><Download className="size-4" />Export Validation Report</Button>
          </div>
        </aside>
      </div>
    </div>
    {reportOpen && <ValidationReportModal close={() => setReportOpen(false)} />}
  </GeoSRLayout>;
}

function ThreeWayComparison({ comparisonRef, zoom, setZoom, opacity, setOpacity, swipe, setSwipe, swipePosition, setSwipePosition, fullscreen }: {
  comparisonRef: React.RefObject<HTMLDivElement | null>; zoom: number; setZoom: (value: number) => void;
  opacity: number; setOpacity: (value: number) => void; swipe: boolean; setSwipe: (value: boolean) => void;
  swipePosition: number; setSwipePosition: (value: number) => void; fullscreen: () => void;
}) {
  return <GeoPanel title="Three-Way Comparison (Synchronized View)" icon={Grid2X2} action={<div className="flex items-center gap-1.5">
    <span className="hidden items-center gap-1 rounded-full border border-success/60 bg-success/10 px-2 py-1 text-[8px] text-success sm:flex"><CheckCircle2 className="size-3" />Geospatial Alignment: PASS</span>
    <Button size="sm" variant={swipe ? "default" : "outline"} className="h-7 px-2 text-[8px]" onClick={() => setSwipe(!swipe)}><SlidersHorizontal className="size-3" />Swipe</Button>
    <label className="hidden items-center gap-1 text-[8px] text-muted-foreground md:flex">Opacity<input aria-label="Comparison opacity" type="range" min="20" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="w-16 accent-primary" /><span className="w-7 text-foreground">{opacity}%</span></label>
    <span className="hidden rounded-md border border-border px-2 py-1 text-[8px] sm:block">Zoom {zoom.toFixed(1)}x</span>
    <Button variant="icon" size="icon" className="size-7" onClick={fullscreen} aria-label="Fullscreen comparison"><Maximize className="size-3.5" /></Button>
  </div>}>
    <div ref={comparisonRef} className="relative grid grid-cols-1 gap-1.5 bg-background/20 p-2 md:grid-cols-3">
      <ValidationMap title="Super-Resolved Output (<4m)" image={satelliteImage} zoom={zoom} setZoom={setZoom} />
      <ValidationMap title="High-Resolution Reference" image={referenceImage} zoom={zoom} setZoom={setZoom} />
      <ValidationMap title="Difference / Error Map" image={errorImage} zoom={zoom} setZoom={setZoom} error opacity={opacity} />
      {swipe && <><input aria-label="Synchronized swipe position" type="range" min="10" max="90" value={swipePosition} onChange={(event) => setSwipePosition(Number(event.target.value))} className="absolute inset-0 z-10 size-full cursor-ew-resize opacity-0" /><div className="pointer-events-none absolute inset-y-2 z-20 w-px bg-primary shadow-glow" style={{ left: `${swipePosition}%` }}><span className="absolute left-1/2 top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary bg-panel text-primary">↔</span></div></>}
    </div>
  </GeoPanel>;
}

function ValidationMap({ title, image, zoom, setZoom, error, opacity = 100 }: { title: string; image: string; zoom: number; setZoom: (value: number) => void; error?: boolean; opacity?: number }) {
  return <section className="min-w-0 overflow-hidden rounded-md border border-primary/50 bg-panel">
    <div className="flex h-7 items-center justify-between border-b border-border px-2 text-[9px] font-medium"><span>{title}</span><span className="rounded border border-primary/40 px-1.5 py-0.5 text-[7px] text-primary">Zoom {zoom.toFixed(1)}x</span></div>
    <div className="relative h-[225px] overflow-hidden sm:h-[260px] xl:h-[276px]">
      <img src={image} alt={`${title} of Kanpur`} className={`size-full object-cover transition-all duration-300 ${error ? "contrast-150 saturate-200 hue-rotate-[165deg]" : ""}`} style={{ transform: `scale(${1 + (zoom - 4) * .08})`, opacity: error ? opacity / 100 : 1 }} />
      <div className="map-scan pointer-events-none absolute inset-0 opacity-20" />
      <span className="absolute left-2 top-2 grid size-6 place-items-center rounded-full border border-border bg-panel/90 text-[8px]">N</span>
      <Button variant="icon" size="icon" className="absolute right-2 top-2 z-30 size-7" aria-label={`Layers for ${title}`}><Layers3 className="size-3.5" /></Button>
      <div className="absolute right-2 top-10 z-30 flex flex-col gap-1"><MapButton icon={Plus} label="Synchronized zoom in" onClick={() => setZoom(Math.min(5.5, zoom + .2))} /><MapButton icon={Minus} label="Synchronized zoom out" onClick={() => setZoom(Math.max(2, zoom - .2))} /></div>
      <strong className="absolute inset-0 grid place-items-center text-xs drop-shadow-md">Kanpur</strong>
      <div className="absolute bottom-2 left-2 rounded bg-panel/90 px-2 py-1 text-[7px]"><div className="flex w-24 justify-between"><span>0</span><span>1</span><span>2</span><span>4 km</span></div><div className="mt-1 h-0.5 bg-foreground" /></div>
      <span className="absolute bottom-2 right-2 rounded bg-panel/90 px-2 py-1 text-[7px]">26.4498°N, 80.3319°E</span>
    </div>
  </section>;
}

function MapButton({ icon: ControlIcon, label, onClick }: { icon: Icon; label: string; onClick: () => void }) { return <Button variant="icon" size="icon" className="size-7" aria-label={label} title={label} onClick={onClick}><ControlIcon className="size-3.5" /></Button>; }

const summaryMetrics: Array<[string, string, string, Icon, string]> = [
  ["PSNR ↑", "34.21 dB", "Higher is better", Activity, "text-success"], ["SSIM ↑", "0.945", "Higher is better", Gauge, "text-success"],
  ["RMSE ↓", "0.032", "Lower is better", ScanLine, "text-chart-4"], ["SAM ↓", "2.8°", "Lower is better", Orbit, "text-map-water"],
  ["Spectral Consistency ↑", "0.967", "Higher is better", Waves, "text-success"], ["Spatial Resolution ↑", "3.8 m", "Higher is better", Focus, "text-success"],
];

function ValidationSummary() { return <GeoPanel title="Validation Summary" icon={ShieldCheck}><div className="grid grid-cols-2 gap-1.5 p-2 sm:grid-cols-3 xl:grid-cols-3">{summaryMetrics.map(([label, value, note, MetricIcon, tone]) => <div key={label} className="rounded-md border border-border bg-background/25 p-2"><div className={`flex items-center justify-between text-[8px] ${tone}`}><span>{label}</span><MetricIcon className="size-3" /></div><b className="mt-1 block text-base font-semibold">{value}</b><span className="text-[7px] text-muted-foreground">{note}</span></div>)}</div></GeoPanel>; }

const spectralData = [
  { band: "B02", sr: .24, reference: .29, input: .16 }, { band: "B03", sr: .41, reference: .46, input: .29 },
  { band: "B04", sr: .32, reference: .38, input: .20 }, { band: "B08", sr: .81, reference: .73, input: .61 },
];

function SpectralComparison() { return <GeoPanel title="Spectral Comparison (Representative Pixel)" icon={Activity}><div className="h-[170px] p-2"><ResponsiveContainer width="100%" height="100%"><LineChart data={spectralData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="band" tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} /><YAxis domain={[0,1]} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} /><Tooltip contentStyle={{ background: "var(--popover)", borderColor: "var(--border)", fontSize: 9 }} /><Legend wrapperStyle={{ fontSize: 8 }} /><Line type="monotone" dataKey="sr" name="Super-Resolved" stroke="var(--primary)" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} /><Line type="monotone" dataKey="reference" name="Reference (HR)" stroke="var(--map-agriculture)" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} /><Line type="monotone" dataKey="input" name="Input (10m)" stroke="var(--chart-4)" strokeDasharray="4 3" dot={{ r: 2 }} isAnimationActive={false} /></LineChart></ResponsiveContainer></div><p className="pb-2 text-center text-[8px] text-muted-foreground">Sentinel-2 Bands · Reflectance</p></GeoPanel>; }

const bandMetrics = [["B02 (Blue)", "33.76", "0.932", "3.1", "bg-map-water"], ["B03 (Green)", "34.12", "0.941", "2.8", "bg-success"], ["B04 (Red)", "34.87", "0.952", "2.5", "bg-map-built"], ["B08 (NIR)", "35.03", "0.957", "2.2", "bg-chart-4"]];
function PerBandMetrics() { return <GeoPanel title="Per-Band Metrics" icon={BarChart3}><div className="overflow-x-auto p-2"><table className="w-full min-w-[300px] text-left text-[8px]"><thead className="text-muted-foreground"><tr className="border-b border-border"><th className="p-2 font-medium">Band</th><th>PSNR (dB) ↑</th><th>SSIM ↑</th><th>SAM (°) ↓</th></tr></thead><tbody>{bandMetrics.map(([band, psnr, ssim, sam, color]) => <tr key={band} className="border-b border-border/60"><td className="p-2"><span className={`mr-1.5 inline-block size-2 rounded-full ${color}`} />{band}</td><td>{psnr}</td><td>{ssim}</td><td>{sam}</td></tr>)}</tbody></table></div></GeoPanel>; }

const fidelityItems: Array<{ title: string; image: string; checks: string[]; attention?: boolean; position: string }> = [
  { title: "Roads & Transport Network", image: satelliteImage, position: "35% 50%", checks: ["Road continuity", "Edge sharpness", "Alignment accuracy"] },
  { title: "Field Boundaries & Agriculture", image: referenceImage, position: "74% 34%", checks: ["Boundary delineation", "Pattern consistency", "No spatial distortion"] },
  { title: "River / Water Edges", image: satelliteImage, position: "52% 70%", checks: ["Water boundary", "Shape consistency", "No spectral bleeding"] },
  { title: "Buildings & Urban Structures", image: referenceImage, position: "20% 42%", attention: true, checks: ["Minor edge fuzziness", "Some small buildings missed", "Overall structure preserved"] },
];

function SpatialFidelityChecks() { return <GeoPanel title="Spatial Fidelity Checks" icon={Crosshair}><div className="grid grid-cols-1 gap-1.5 p-2 sm:grid-cols-2">{fidelityItems.map((item) => <article key={item.title} className="rounded-md border border-border bg-background/20 p-1.5"><h3 className="truncate text-[9px] font-medium">{item.title}</h3><div className="mt-1.5 grid grid-cols-[88px_minmax(0,1fr)] gap-2"><img src={item.image} alt={`${item.title} validation crop`} className="h-[76px] w-full rounded-sm border border-border object-cover" style={{ objectPosition: item.position }} /><div><span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[7px] ${item.attention ? "bg-map-agriculture/15 text-map-agriculture" : "bg-success/15 text-success"}`}>{item.attention ? <AlertTriangle className="size-2.5" /> : <CheckCircle2 className="size-2.5" />}{item.attention ? "ATTENTION" : "PASS"}</span><div className="mt-2 space-y-1">{item.checks.map((check, index) => <p key={check} className={`flex items-start gap-1 text-[7px] ${item.attention && index < 2 ? "text-map-agriculture" : "text-muted-foreground"}`}>{item.attention && index < 2 ? <AlertTriangle className="mt-0.5 size-2.5 shrink-0" /> : <Check className="mt-0.5 size-2.5 shrink-0 text-success" />}{check}</p>)}</div></div></div></article>)}</div><div className="mx-2 mb-2 flex gap-2 rounded-md border border-border bg-primary/5 p-2 text-[8px] text-muted-foreground"><Info className="size-3.5 shrink-0 text-primary" /><p>Validation compares the super-resolved product with a co-registered high-resolution reference; metrics are scene- and reference-dependent.</p></div></GeoPanel>; }

function UncertaintyError({ opacity }: { opacity: number }) { const [point, setPoint] = useState<string | null>(null); return <GeoPanel title="Uncertainty & Error" icon={Orbit}><div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-[minmax(0,1fr)_130px]"><div className="relative h-[170px] overflow-hidden rounded-md border border-border" onMouseMove={(event) => setPoint(`${Math.round(event.nativeEvent.offsetX / 5)}%, ${Math.round(event.nativeEvent.offsetY / 4)}%`)} onMouseLeave={() => setPoint(null)}><img src={errorImage} alt="False-color uncertainty and error map" className="size-full object-cover contrast-150 saturate-200 hue-rotate-[165deg]" style={{ opacity: opacity / 100 }} /><span className="absolute left-2 top-2 grid size-6 place-items-center rounded-full bg-panel/90 text-[8px]">N</span>{point && <span className="absolute bottom-2 right-2 rounded bg-panel/90 px-2 py-1 text-[7px]">Error sample: {point}</span>}<div className="absolute bottom-2 left-2 rounded bg-panel/90 px-2 py-1 text-[7px]">0 ┃ 1 ┃ 2 ┃ 4 km</div></div><div className="rounded-md border border-border bg-background/20 p-3"><h3 className="text-[9px] font-medium">Uncertainty Level</h3><div className="mt-4 space-y-4 text-[8px]"><LegendItem color="bg-map-water" label="Low (0–5%)" /><LegendItem color="bg-map-agriculture" label="Medium (5–15%)" /><LegendItem color="bg-map-built" label="High (15–30%)" /></div></div></div></GeoPanel>; }
function LegendItem({ color, label }: { color: string; label: string }) { return <p className="flex items-center gap-2"><span className={`size-4 rounded-sm ${color}`} />{label}</p>; }

const traceSteps: Array<[string, string, string[], GeoIcon]> = [
  ["Input GeoTIFF", "Sentinel-2 (10m)", ["10 m resolution", "4 bands"], FileCheck2],
  ["Preprocessing", "Cloud masking", ["Radiometric correction", "Geometric alignment"], Focus],
  ["SR Model", "Deep Learning (SRM)", ["10m → <4m", "Spectral consistency"], Sparkles],
  ["Output GeoTIFF", "<4m", ["4 bands", "Georeferenced"], Database],
  ["Metrics & Validation", "PSNR / SSIM / RMSE", ["SAM / Spectral Consistency", "Spatial Fidelity Checks"], BarChart3],
];

function Traceability() { return <GeoPanel title="Validation Traceability" icon={FileCheck2}><div className="overflow-x-auto p-2"><div className="flex min-w-[760px] items-stretch gap-1">{traceSteps.map(([title, subtitle, details, StepIcon], index) => <div className="contents" key={title}><article className="min-w-0 flex-1 rounded-md border border-border bg-background/20 p-2"><div className="flex gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"><StepIcon className="size-4" /></span><div><h3 className="text-[8px] font-medium">{title}</h3><p className="text-[7px] text-primary">{subtitle}</p></div></div><div className="mt-2 space-y-0.5 text-[7px] text-muted-foreground">{details.map((detail) => <p key={detail}>• {detail}</p>)}</div></article>{index < traceSteps.length - 1 && <ChevronRight className="mt-8 size-4 shrink-0 text-primary" />}</div>)}</div></div><div className="mx-2 mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-[7px]"><span className="flex items-center gap-1 text-success"><CheckCircle2 className="size-3" />CRS / Geospatial Metadata Preserved</span><span>EPSG:4326 (WGS 84)</span><span className="text-muted-foreground">Pixel size, extent and projection maintained</span></div></GeoPanel>; }

function ScientificNotice() { return <div className="flex gap-2 rounded-md border border-primary/40 bg-primary/5 p-3 text-[8px] leading-relaxed text-muted-foreground"><Info className="size-4 shrink-0 text-primary" /><p>Reconstructed details are inferred by the model and not directly observed in the input imagery.</p></div>; }

function ValidationReportModal({ close }: { close: () => void }) { return <div className="fixed inset-0 z-[70] grid place-items-center bg-background/85 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="validation-report-title" className="glass-panel w-full max-w-xl rounded-md p-4 shadow-glow"><div className="flex items-start justify-between"><div><h2 id="validation-report-title" className="text-base font-semibold">Validation Report Summary</h2><p className="mt-1 text-[9px] text-muted-foreground">S2A_MSIL2A_20250415T053621 · Kanpur, Uttar Pradesh, India</p></div><Button variant="ghost" size="icon" onClick={close} aria-label="Close validation report"><X className="size-4" /></Button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{summaryMetrics.map(([label, value]) => <div key={label} className="rounded-md border border-border bg-background/25 p-3"><span className="text-[8px] text-muted-foreground">{label}</span><b className="mt-1 block text-lg">{value}</b></div>)}</div><div className="mt-3 rounded-md border border-success/40 bg-success/5 p-3 text-[9px]"><p className="flex items-center gap-2 font-medium text-success"><CheckCircle2 className="size-4" />Overall validation status: PASS</p><p className="mt-2 leading-relaxed text-muted-foreground">Geospatial alignment, spectral consistency, and major spatial structures meet the configured scientific-fidelity thresholds. Minor attention is recommended for small urban structures.</p></div><div className="mt-4 flex justify-end gap-2"><Button variant="ghost" onClick={close}>Close</Button><Button onClick={() => toast.success("Validation report generated successfully.")}><Download className="size-4" />Export Report</Button></div></div></div>; }
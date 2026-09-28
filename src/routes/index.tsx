import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import {
  Activity, Bell, Building2, ChartNoAxesCombined, ChevronDown, CircleHelp, Download,
  Droplets, FileDown, Fullscreen, Globe2, House, Image, Layers3, Leaf, LocateFixed,
  Map, MapPin, Menu, Minus, Orbit, PanelLeftClose, Play, Plus, RadioTower, RefreshCw,
  Route as Road, Satellite, Search, Settings, ShieldCheck, Sparkles, Thermometer, TrendingUp,
  Upload, Waves, X, Zap,
} from "lucide-react";
import {
  CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
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

const navItems: Array<[string, Icon]> = [
  ["Dashboard", House], ["Imagery", Image], ["Super Resolution", Sparkles], ["Compare", Layers3],
  ["Analysis", ChartNoAxesCombined], ["Validation", ShieldCheck], ["Exports", Download], ["Settings", Settings],
];
const classes = [
  ["Built-up", "38.7%", "bg-map-built"], ["Vegetation", "42.3%", "bg-map-vegetation"],
  ["Water", "8.9%", "bg-map-water"], ["Agriculture", "7.4%", "bg-map-agriculture"],
  ["Others", "2.7%", "bg-map-other"],
];

function GeoSRDashboard() {
  const [activeNav, setActiveNav] = useState("Analysis");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [layer, setLayer] = useState<"enhanced" | "classification">("enhanced");
  const [zoom, setZoom] = useState(1);
  const [modal, setModal] = useState<ModalState>(null);
  const [comparison, setComparison] = useState(50);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const runAnalysis = () => {
    setRunning(true); setComplete(false);
    window.setTimeout(() => { setRunning(false); setComplete(true); toast.success("Analysis complete", { description: "Land-cover insights have been refreshed." }); }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="bottom-right" richColors />
      <Navbar
        onMenu={() => setSidebarOpen(true)} noticeOpen={noticeOpen} setNoticeOpen={setNoticeOpen}
        profileOpen={profileOpen} setProfileOpen={setProfileOpen}
      />
      <Sidebar
        active={activeNav} setActive={setActiveNav} open={sidebarOpen} setOpen={setSidebarOpen}
        collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}
      />
      <main className={`pt-[58px] transition-all ${sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-[214px]"}`}>
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
      </main>
      {modal && <MapModal mode={modal} close={() => setModal(null)} />}
    </div>
  );
}

function Navbar({ onMenu, noticeOpen, setNoticeOpen, profileOpen, setProfileOpen }: {
  onMenu: () => void; noticeOpen: boolean; setNoticeOpen: (v: boolean) => void;
  profileOpen: boolean; setProfileOpen: (v: boolean) => void;
}) {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 grid h-[58px] grid-cols-[auto_minmax(0,1fr)_auto] items-center border-b border-border bg-panel/95 px-3 backdrop-blur-xl lg:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open navigation"><Menu className="size-5" /></Button>
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary shadow-glow"><Globe2 className="size-6" /></div>
        <span className="hidden text-lg font-semibold sm:block">GeoSR Intelligence</span>
        <div className="hidden h-6 w-px bg-border xl:block" />
        <span className="hidden text-[10px] text-muted-foreground xl:block">AI-Powered Super Resolution Mapping for a Sharper Tomorrow</span>
      </div>
      <div className="mx-auto hidden w-full max-w-[300px] lg:block">
        <div className="flex h-8 items-center gap-2 rounded-md border border-border bg-background/40 px-3 text-muted-foreground focus-within:border-primary/70">
          <Search className="size-4 shrink-0" />
          <input className="min-w-0 flex-1 bg-transparent text-[10px] text-foreground outline-none placeholder:text-muted-foreground" placeholder="Search location / AOI / Scene ID..." />
        </div>
      </div>
      <div className="relative flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => setNoticeOpen(!noticeOpen)} aria-label="Notifications"><Bell className="size-4" /></Button>
        {noticeOpen && <Popup className="right-28 top-10"><p className="font-semibold text-foreground">Processing complete</p><p className="mt-1">Scene S2A…53621 is ready.</p></Popup>}
        <div className="hidden items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-[9px] text-success sm:flex"><span className="size-2 rounded-full bg-success shadow-glow" /> Processing Complete</div>
        <button className="flex items-center gap-2 rounded-md p-1 hover:bg-accent" onClick={() => setProfileOpen(!profileOpen)}>
          <span className="grid size-7 place-items-center rounded-full bg-accent text-[9px] font-semibold text-primary">SD</span>
          <span className="hidden text-[10px] md:block">Student</span><ChevronDown className="hidden size-3 md:block" />
        </button>
        {profileOpen && <Popup className="right-0 top-10"><p className="font-semibold text-foreground">Student account</p><button className="mt-2 text-primary">View profile</button></Popup>}
      </div>
    </nav>
  );
}

function Popup({ children, className }: { children: React.ReactNode; className: string }) {
  return <div className={`glass-panel absolute z-50 w-48 rounded-md p-3 text-[11px] text-muted-foreground shadow-glow ${className}`}>{children}</div>;
}

function Sidebar({ active, setActive, open, setOpen, collapsed, setCollapsed }: {
  active: string; setActive: (v: string) => void; open: boolean; setOpen: (v: boolean) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-background/80 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
      <aside className={`fixed bottom-0 left-0 top-[58px] z-50 flex flex-col border-r border-sidebar-border bg-sidebar/95 p-2.5 backdrop-blur-xl transition-all ${open ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "lg:w-[70px]" : "lg:w-[214px]"} w-[214px] lg:translate-x-0`}>
        <Button variant="ghost" size="icon" className="absolute right-2 top-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X className="size-4" /></Button>
        <div className="space-y-1 pt-2">
          {navItems.map(([label, NavIcon]) => (
            <button key={label} onClick={() => { setActive(label); setOpen(false); }} title={label}
              className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-xs transition-all ${active === label ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-glow" : "text-sidebar-foreground hover:bg-accent/60 hover:text-foreground"}`}>
              <NavIcon className={`size-4 shrink-0 ${active === label ? "text-primary" : ""}`} />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </div>
        {!collapsed && <div className="glass-panel mt-auto rounded-md p-3 text-[10px] leading-snug text-muted-foreground">
          <div className="mb-3 flex items-center gap-2 font-semibold text-foreground"><span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary"><RadioTower className="size-4" /></span><span>SIH 2026<br />PS No. 26142</span></div>
          <p className="text-[11px] text-foreground">Deep Learning Based<br />Super Resolution Mapping<br />from Medium Resolution<br />Satellite Imagery</p>
          <div className="my-3 h-px bg-border" />
          <p>Enhancing satellite imagery from ~10m to ~2m using AI for better geospatial insights.</p>
          <Satellite className="mx-auto mt-5 size-8 text-primary" />
        </div>}
        <div className={`mt-3 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && <span className="text-[9px] text-muted-foreground">Help &nbsp; | &nbsp; Documentation</span>}
          <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar"><PanelLeftClose className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} /></Button>
        </div>
      </aside>
    </>
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

function SelectControl({ icon: SelectIcon, label, value, options }: { icon: Icon; label: string; value: string; options: string[] }) {
  const [selected, setSelected] = useState(value);
  return <label className="grid h-11 grid-cols-[28px_minmax(0,1fr)] items-center rounded-md border border-border bg-background/30 px-2 focus-within:border-primary">
    <SelectIcon className="size-4 text-muted-foreground" /><span className="min-w-0"><span className="block text-[8px] leading-none text-muted-foreground">{label}</span><select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-1 w-full truncate bg-transparent text-[10px] text-foreground outline-none">{options.map((item) => <option className="bg-popover" key={item}>{item}</option>)}</select></span>
  </label>;
}

function Panel({ title, action, children, className = "" }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`glass-panel min-w-0 overflow-hidden rounded-md ${className}`}><div className="flex h-9 items-center justify-between border-b border-border px-3"><h2 className="text-xs font-semibold">{title}</h2>{action}</div>{children}</section>;
}

function MapPanel({ layer, setLayer, zoom, setZoom }: { layer: "enhanced" | "classification"; setLayer: (v: "enhanced" | "classification") => void; zoom: number; setZoom: (v: number) => void }) {
  return <div className="glass-panel relative min-h-[305px] overflow-hidden rounded-md">
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
  return <Panel title="Key Insights"><div className="grid min-h-[265px] gap-2 p-2 sm:grid-cols-[1.05fr_.95fr]">
    <div className="space-y-1.5">{insights.map(([label, secondary, value, InsightIcon]) => <div key={label} className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-border/70 bg-background/20 p-2"><span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary"><InsightIcon className="size-4" /></span><span className="min-w-0 text-[9px] text-muted-foreground">{label}{secondary && <b className="mt-1 block text-[11px] font-medium text-primary">{secondary}</b>}</span><b className="text-xs font-medium text-primary">{value}</b></div>)}</div>
    <div className="rounded-md border border-border/70 bg-background/20 p-2"><h3 className="mb-1 text-[11px] font-semibold">Trends & Patterns</h3>{trends.map(([text, TrendIcon]) => <div key={text} className="flex gap-2 border-b border-border/50 py-2 last:border-0"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><TrendIcon className="size-3.5" /></span><p className="text-[9px] leading-snug text-muted-foreground">{text}</p></div>)}</div>
  </div></Panel>;
}

function ClassificationCard() {
  return <Panel title="Land Cover Classification" action={<MiniSelect value="Classified Map" options={["Classified Map", "Enhanced Map"]} />}><div className="grid min-h-[190px] grid-cols-[1.45fr_.8fr] gap-3 p-3"><img src={classificationImage} loading="lazy" width={1024} height={640} alt="Classified satellite map" className="h-32 w-full rounded-md object-cover sm:h-full" /><div className="self-center text-[9px]"><LegendRows /></div></div><div className="flex flex-wrap gap-4 border-t border-border px-3 py-2 text-[8px]">{classes.map(([label,,color]) => <span key={label} className="flex items-center gap-1"><i className={`size-2 rounded-full ${color}`} />{label}</span>)}</div></Panel>;
}

function ChangeDetection({ comparison, setComparison, onOpen }: { comparison: number; setComparison: (v: number) => void; onOpen: () => void }) {
  return <Panel title="Change Detection"><div className="p-3">
    <div className="relative h-[105px] overflow-hidden rounded-md border border-border"><img src={changeImage} loading="lazy" width={1024} height={640} alt="2024 satellite comparison" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-y-0 right-0 overflow-hidden" style={{ width: `${100-comparison}%` }}><img src={satelliteImage} loading="lazy" width={1536} height={768} alt="2025 satellite comparison" className="absolute right-0 h-full max-w-none object-cover grayscale-[15%]" style={{ width: `${10000/(100-comparison || 1)}%` }} /></div><div className="absolute inset-y-0 w-px bg-primary" style={{ left: `${comparison}%` }}><span className="absolute left-1/2 top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary bg-panel text-[9px]">↔</span></div><input aria-label="Compare 2024 and 2025 imagery" className="absolute inset-0 size-full cursor-ew-resize opacity-0" type="range" min="15" max="85" value={comparison} onChange={(e) => setComparison(Number(e.target.value))} /><span className="absolute bottom-1 left-1 bg-panel/80 px-1 text-[8px]">2024-04-15</span><span className="absolute bottom-1 right-1 bg-panel/80 px-1 text-[8px]">2025-04-15</span></div>
    <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-primary/40 bg-primary/5 p-2"><span className="grid size-8 place-items-center rounded-full border border-success text-success"><TrendingUp className="size-4" /></span><div className="min-w-0 text-[9px]"><b className="text-xs text-primary">+6.2%</b> &nbsp; <b className="text-success">Vegetation Increase</b><span className="block text-muted-foreground">in Northern Region</span></div></div>
    <div className="mt-2 text-right"><Button variant="outline" size="sm" onClick={onOpen}>View Change Map</Button></div>
  </div></Panel>;
}

const spectralData = [{ band: "B2", original: .18, resolved: .12, reference: .15 }, { band: "B3", original: .38, resolved: .3, reference: .34 }, { band: "B4", original: .45, resolved: .32, reference: .34 }, { band: "B8", original: .78, resolved: .74, reference: .81 }];
function SpectralAnalysis() { return <Panel title="Spectral Analysis" action={<MiniSelect value="AOI-1" options={["AOI-1", "AOI-2"]} />}><div className="h-[214px] p-2"><ResponsiveContainer width="100%" height="100%"><LineChart data={spectralData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="var(--border)" vertical={true} /><XAxis dataKey="band" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} /><YAxis domain={[0,1]} ticks={[0,.2,.4,.6,.8,1]} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} /><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 10 }} /><Legend wrapperStyle={{ fontSize: 9 }} /><Line type="monotone" dataKey="original" name="Original (10m)" stroke="var(--map-water)" strokeDasharray="5 4" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="resolved" name="Super Resolved (2.5m)" stroke="var(--success)" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="reference" name="Reference (HR)" stroke="var(--primary)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></Panel>; }

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
function UncertaintyAnalysis() { return <Panel title="Uncertainty Analysis"><div className="grid h-[124px] grid-cols-[1fr_92px_1fr] items-center gap-2 p-3"><img src={classificationImage} loading="lazy" width={1024} height={640} alt="Uncertainty classification preview" className="h-full w-full rounded-md object-cover" /><div className="relative h-20"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={uncertaintyData} dataKey="value" innerRadius={28} outerRadius={38} stroke="transparent" /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center text-[8px] text-muted-foreground">Mean<br />Uncertainty<br /><b className="text-sm text-foreground">8.2%</b></div></div><div className="space-y-2 text-[8px]">{[["Low (0–5%)","62%","bg-success"],["Medium (5–15%)","28%","bg-primary"],["High (15–30%)","8%","bg-map-agriculture"],["Very High (>30%)","2%","bg-map-built"]].map(([label,value,color]) => <div key={label} className="grid grid-cols-[8px_1fr_auto] items-center gap-1"><span className={`size-2 rounded-full ${color}`} /><span>{label}</span><span>{value}</span></div>)}</div></div></Panel>; }

function ActionButtons({ onMap }: { onMap: () => void }) { return <div className="mt-3 flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => toast.success("Report generation started", { description: "Your PDF will be ready shortly." })}><Download className="size-4" />Download Analysis Report</Button><Button variant="outline" onClick={() => toast.loading("Exporting GeoTIFF…", { duration: 1800 })}><Upload className="size-4" />Export GeoTIFF</Button><Button variant="outline" onClick={onMap}><Map className="size-4" />View on Map</Button></div>; }

function MapModal({ mode, close }: { mode: Exclude<ModalState, null>; close: () => void }) {
  useEffect(() => { const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(); window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [close]);
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-background/85 p-3 backdrop-blur-md" onMouseDown={close}><div role="dialog" aria-modal="true" aria-label={mode === "change" ? "Change detection map" : "Map view"} onMouseDown={(e) => e.stopPropagation()} className="glass-panel w-full max-w-5xl overflow-hidden rounded-lg"><div className="flex items-center justify-between border-b border-border p-3"><div><h2 className="font-semibold">{mode === "change" ? "Change Detection — 2024 to 2025" : "AOI-1 Map View"}</h2><p className="text-[10px] text-muted-foreground">Kanpur, Uttar Pradesh, India · Super Resolved 2.5m</p></div><Button variant="ghost" size="icon" onClick={close} aria-label="Close map"><X className="size-5" /></Button></div><div className="relative aspect-[16/8] max-h-[72vh]"><img src={mode === "change" ? classificationImage : satelliteImage} width={1536} height={768} alt="Expanded geospatial analysis map" className="size-full object-cover" /><div className="absolute bottom-3 right-3 flex gap-2"><Button variant="icon" size="icon"><LocateFixed className="size-4" /></Button><Button variant="icon" size="icon"><Fullscreen className="size-4" /></Button></div></div></div></div>;
}
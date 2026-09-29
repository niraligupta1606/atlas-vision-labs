import { Link } from "@tanstack/react-router";
import { useState, type ComponentType, type ReactNode } from "react";
import {
  Bell, ChartNoAxesCombined, ChevronDown, Download, Globe2, House, Image,
  Layers3, Menu, PanelLeftClose, RadioTower, Satellite, Search, Settings,
  ShieldCheck, Sparkles, X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export type GeoIcon = ComponentType<{ className?: string }>;

const navItems: Array<[string, GeoIcon]> = [
  ["Dashboard", House], ["Imagery", Image], ["Super Resolution", Sparkles], ["Compare", Layers3],
  ["Analysis", ChartNoAxesCombined], ["Validation", ShieldCheck], ["Exports", Download], ["Settings", Settings],
];

export function GeoSRNavbar({ onMenu, context }: { onMenu: () => void; context?: string | undefined }) {
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 grid h-[58px] grid-cols-[auto_minmax(0,1fr)_auto] items-center border-b border-border bg-panel/95 px-3 backdrop-blur-xl lg:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open navigation"><Menu className="size-5" /></Button>
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary shadow-glow"><Globe2 className="size-6" /></div>
        <span className="hidden text-lg font-semibold sm:block">GeoSR Intelligence</span>
        <div className="hidden h-6 w-px bg-border xl:block" />
        <span className="hidden text-[10px] text-muted-foreground xl:block">{context ?? "AI-Powered Super Resolution Mapping for a Sharper Tomorrow"}</span>
      </div>
      <div className="mx-auto hidden w-full max-w-[500px] items-center gap-2 lg:flex">
        {context && <label className="flex h-8 shrink-0 items-center gap-2 rounded-md border border-border bg-background/40 px-2 text-[9px] text-foreground"><Layers3 className="size-3 text-primary" /><select aria-label="Satellite source" className="bg-transparent outline-none"><option className="bg-popover">Sentinel-2 (10m)</option></select></label>}
        <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background/40 px-3 text-muted-foreground focus-within:border-primary/70">
          <Search className="size-4 shrink-0" />
          <input className="min-w-0 flex-1 bg-transparent text-[10px] text-foreground outline-none placeholder:text-muted-foreground" placeholder="Search location / AOI / Scene ID..." />
        </div>
      </div>
      <div className="relative flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => setNoticeOpen(!noticeOpen)} aria-label="Notifications"><Bell className="size-4" /></Button>
        {noticeOpen && <Popup className="right-28 top-10"><p className="font-semibold text-foreground">Processing complete</p><p className="mt-1">Scene S2A…53621 is ready.</p></Popup>}
        <div className="hidden items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-[9px] text-success sm:flex"><span className="size-2 rounded-full bg-success shadow-glow" /> Processing Complete</div>
        <Button variant="ghost" className="h-auto gap-2 p-1" onClick={() => setProfileOpen(!profileOpen)}>
          <span className="grid size-7 place-items-center rounded-full bg-accent text-[9px] font-semibold text-primary">SD</span>
          <span className="hidden text-[10px] md:block">Student</span><ChevronDown className="hidden size-3 md:block" />
        </Button>
        {profileOpen && <Popup className="right-0 top-10"><p className="font-semibold text-foreground">Student account</p><Button variant="ghost" size="sm" className="mt-1 px-0 text-primary">View profile</Button></Popup>}
      </div>
    </nav>
  );
}

function Popup({ children, className }: { children: ReactNode; className: string }) {
  return <div className={`glass-panel absolute z-50 w-48 rounded-md p-3 text-[11px] text-muted-foreground shadow-glow ${className}`}>{children}</div>;
}

export function GeoSRSidebar({ active, open, setOpen, collapsed, setCollapsed }: {
  active: "Analysis" | "Compare" | "Imagery" | "Validation"; open: boolean; setOpen: (v: boolean) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  return (
    <>
      {open && <Button variant="ghost" className="fixed inset-0 z-40 h-auto w-auto rounded-none bg-background/80 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
      <aside className={`fixed bottom-0 left-0 top-[58px] z-50 flex flex-col border-r border-sidebar-border bg-sidebar/95 p-2.5 backdrop-blur-xl transition-all ${open ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "lg:w-[70px]" : "lg:w-[214px]"} w-[214px] lg:translate-x-0`}>
        <Button variant="ghost" size="icon" className="absolute right-2 top-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X className="size-4" /></Button>
        <div className="space-y-1 pt-2">
          {navItems.map(([label, NavIcon]) => {
            const isActive = active === label;
            const content = <><NavIcon className={`size-4 shrink-0 ${isActive ? "text-primary" : ""}`} />{!collapsed && <span>{label}</span>}</>;
            const className = `flex h-10 w-full items-center gap-3 rounded-md px-3 text-xs transition-all ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-glow" : "text-sidebar-foreground hover:bg-accent/60 hover:text-foreground"}`;
            if (label === "Imagery") return <Link key={label} to="/imagery" onClick={() => setOpen(false)} title={label} className={className}>{content}</Link>;
            if (label === "Compare") return <Link key={label} to="/compare" onClick={() => setOpen(false)} title={label} className={className}>{content}</Link>;
            if (label === "Analysis") return <Link key={label} to="/" onClick={() => setOpen(false)} title={label} className={className}>{content}</Link>;
            if (label === "Validation") return <Link key={label} to="/validation" onClick={() => setOpen(false)} title={label} className={className}>{content}</Link>;
            return <Button key={label} variant="ghost" onClick={() => setOpen(false)} title={label} className={className}>{content}</Button>;
          })}
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

export function GeoSRLayout({ active, children, context }: { active: "Analysis" | "Compare" | "Imagery" | "Validation"; children: ReactNode; context?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return <div className="min-h-screen bg-background text-foreground">
    <GeoSRNavbar onMenu={() => setSidebarOpen(true)} context={context} />
    <GeoSRSidebar active={active} open={sidebarOpen} setOpen={setSidebarOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
    <main className={`pt-[58px] transition-all ${sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-[214px]"}`}>{children}</main>
  </div>;
}

export function SelectControl({ icon: SelectIcon, label, value, options }: { icon: GeoIcon; label: string; value: string; options: string[] }) {
  const [selected, setSelected] = useState(value);
  return <label className="grid h-11 grid-cols-[28px_minmax(0,1fr)] items-center rounded-md border border-border bg-background/30 px-2 focus-within:border-primary">
    <SelectIcon className="size-4 text-muted-foreground" /><span className="min-w-0"><span className="block text-[8px] leading-none text-muted-foreground">{label}</span><select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-1 w-full truncate bg-transparent text-[10px] text-foreground outline-none">{options.map((item) => <option className="bg-popover" key={item}>{item}</option>)}</select></span>
  </label>;
}

export function GeoPanel({ title, icon: PanelIcon, action, children, className = "" }: { title: string; icon?: GeoIcon; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`glass-panel min-w-0 overflow-hidden rounded-md ${className}`}><div className="flex h-9 items-center justify-between border-b border-border px-3"><h2 className="flex items-center gap-2 text-xs font-semibold">{PanelIcon && <PanelIcon className="size-4 text-primary" />}{title}</h2>{action}</div>{children}</section>;
}
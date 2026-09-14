import type { Vehicle } from "@/lib/content";

type Spec = { label: string; value: string };

const UNIT_RE = /(\d+(?:[.,]\d+)?)\s*(kWh|kW|kg|Nm|PS|cm|cL|mm|V)\b/i;
const RATIO_RE = /^\s*\d+(?:[.,]\d+)?\s*:\s*\d+(?:[.,]\d+)?\s*$/;

function parseNumericSpec(value: string) {
  const m = value.match(UNIT_RE);
  if (!m || m.index === undefined) return null;
  const [full, num, unit] = m;
  const prefix = value.slice(0, m.index).trim().replace(/[,\s]+$/, "");
  const suffix = value.slice(m.index + full.length).trim().replace(/^[,\s/]+/, "");
  const subtext = [prefix, suffix].filter(Boolean).join(" · ") || undefined;
  return { num, unit, subtext };
}

function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface-2 p-4 ${className}`}>{children}</div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">{children}</p>;
}

function StatCard({
  label,
  value,
  unit,
  subtext,
  tone = "accent-text",
}: {
  label: string;
  value: string;
  unit?: string;
  subtext?: string;
  tone?: "accent-text" | "accent-2-text";
}) {
  return (
    <CardShell>
      <CardLabel>{label}</CardLabel>
      <p className="mt-1.5 text-2xl font-extrabold sm:text-3xl" style={{ color: `var(--${tone})` }}>
        {value}
        {unit && <span className="ml-1 text-sm font-semibold text-muted sm:text-base">{unit}</span>}
      </p>
      {subtext && <p className="mt-1 text-xs text-muted">{subtext}</p>}
    </CardShell>
  );
}

function InfoCard({ label, value }: Spec) {
  return (
    <CardShell>
      <CardLabel>{label}</CardLabel>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-foreground">{value}</p>
    </CardShell>
  );
}

function PowerGauge({ label, num, unit, subtext, max = 200 }: { label: string; num: string; unit: string; subtext?: string; max?: number }) {
  const value = parseFloat(num.replace(",", "."));
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 54;
  const c = 2 * Math.PI * r;

  return (
    <CardShell>
      <CardLabel>{label}</CardLabel>
      <div className="relative mx-auto mt-3 h-28 w-28 sm:h-32 sm:w-32">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="var(--accent-text)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-accent-text sm:text-2xl">
            {num}
            <span className="ml-0.5 text-xs font-semibold text-muted">{unit}</span>
          </span>
          {subtext && (
            <span className="mt-0.5 max-w-[5.5rem] text-[9px] leading-tight text-muted">{subtext}</span>
          )}
        </div>
      </div>
    </CardShell>
  );
}

function BatteryCard({ label, num, unit, subtext }: { label: string; num: string; unit: string; subtext?: string }) {
  return (
    <CardShell>
      <CardLabel>{subtext ? `${label} · ${subtext}` : label}</CardLabel>
      <p className="mt-1.5 text-2xl font-extrabold text-accent-2-text sm:text-3xl">
        {num}
        <span className="ml-1 text-sm font-semibold text-muted sm:text-base">{unit}</span>
      </p>
      <div className="mt-3 grid grid-cols-10 gap-1" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="h-5 rounded-sm bg-accent-2-text/70" />
        ))}
      </div>
    </CardShell>
  );
}

function renderSpec(spec: Spec, i: number) {
  const label = spec.label.toLowerCase();

  if (label === "leistung") {
    const parsed = parseNumericSpec(spec.value);
    if (parsed) {
      return <PowerGauge key={i} label={spec.label} num={parsed.num} unit={parsed.unit} subtext={parsed.subtext} />;
    }
  }

  if (label.includes("batterie") || label.includes("akku")) {
    const parsed = parseNumericSpec(spec.value);
    if (parsed) {
      return <BatteryCard key={i} label={spec.label} num={parsed.num} unit={parsed.unit} subtext={parsed.subtext} />;
    }
  }

  if (label.startsWith("gewicht")) {
    const parenMatch = spec.label.match(/\(([^)]+)\)/);
    const cleanLabel = spec.label.replace(/\s*\([^)]+\)/, "").trim();
    const parsed = parseNumericSpec(spec.value);
    if (parsed) {
      return (
        <StatCard
          key={i}
          label={cleanLabel}
          value={parsed.num}
          unit={parsed.unit}
          subtext={parenMatch?.[1] ?? parsed.subtext}
          tone="accent-2-text"
        />
      );
    }
  }

  if (label === "antrieb") {
    const m = spec.value.match(/\d+/);
    if (m) {
      return <StatCard key={i} label={spec.label} value={`${m[0]}×`} subtext={spec.value} />;
    }
  }

  if (label === "getriebe" && RATIO_RE.test(spec.value)) {
    return <StatCard key={i} label={spec.label} value={spec.value.trim()} subtext="Übersetzung" />;
  }

  const parsed = parseNumericSpec(spec.value);
  if (parsed) {
    return <StatCard key={i} label={spec.label} value={parsed.num} unit={parsed.unit} subtext={parsed.subtext} />;
  }

  return <InfoCard key={i} label={spec.label} value={spec.value} />;
}

export default function VehicleSpecs({
  specs,
  achievements,
}: {
  specs: NonNullable<Vehicle["specs"]>;
  achievements?: Vehicle["achievements"];
}) {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3">{specs.map(renderSpec)}</div>

      {achievements && achievements.length > 0 && (
        <CardShell className="mt-3">
          <ul className="space-y-2">
            {achievements.map((achievement) => (
              <li key={achievement} className="flex gap-2 text-sm text-foreground">
                <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-accent-text/15 text-[10px] font-bold text-accent-text">
                  ✓
                </span>
                {achievement}
              </li>
            ))}
          </ul>
        </CardShell>
      )}
    </div>
  );
}

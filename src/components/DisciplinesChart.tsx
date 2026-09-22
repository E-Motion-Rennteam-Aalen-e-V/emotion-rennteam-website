"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Discipline = {
  name: string;
  nameDE: string;
  points: number;
  category: "Statisch" | "Dynamisch";
  icon: string;
  description: string;
};

const DISCIPLINES: Discipline[] = [
  {
    name: "Endurance",
    nameDE: "Ausdauer",
    points: 250,
    category: "Dynamisch",
    icon: "🏁",
    description: "22 km ohne Unterbrechung – mit Fahrerwechsel nach 11 km. Die wichtigste Disziplin.",
  },
  {
    name: "Engineering Design",
    nameDE: "Konstruktion",
    points: 150,
    category: "Statisch",
    icon: "📐",
    description: "Jury aus Industrieexperten bewertet Konzept, Werkstoff, FEA/CFD & Validierung.",
  },
  {
    name: "Autocross",
    nameDE: "Parcours",
    points: 100,
    category: "Dynamisch",
    icon: "🔄",
    description: "~1 km kurvenreiche Strecke im Einzelzeitfahren. Bestimmt die Startreihenfolge für Endurance.",
  },
  {
    name: "Cost & Manufacturing",
    nameDE: "Kostenanalyse",
    points: 100,
    category: "Statisch",
    icon: "💰",
    description: "Vollständige BOM + Nachweis der Serienfertigbarkeit für 1.000 Fahrzeuge/Jahr.",
  },
  {
    name: "Acceleration",
    nameDE: "Beschleunigung",
    points: 75,
    category: "Dynamisch",
    icon: "⚡",
    description: "0–75 m Sprint aus dem Stand. 4 Versuche (2 pro Fahrer), Punkte relativ zur Bestzeit.",
  },
  {
    name: "Skidpad",
    nameDE: "Querdynamik",
    points: 75,
    category: "Dynamisch",
    icon: "🔁",
    description: "Liegende Acht (2× rechts, 2× links). Gemessen wird die 2. Runde – maximale Querbeschleunigung.",
  },
  {
    name: "Efficiency",
    nameDE: "Energieeffizienz",
    points: 75,
    category: "Dynamisch",
    icon: "🔋",
    description: "Parallel zu Endurance: Energieverbrauch per Datenlogger. Schnell + effizient = Maximalpunkte.",
  },
  {
    name: "Business Plan",
    nameDE: "Geschäftsmodell",
    points: 75,
    category: "Statisch",
    icon: "📊",
    description: "Pitch vor Investoren: Marktanalyse, Finanzplanung, Marketingstrategie, Risikoanalyse.",
  },
];

const STATIC_TOTAL = 325;
const DYNAMIC_TOTAL = 675;
const TOTAL = 1000;

const STATIC_COLOR = "#3b90c9";
const DYNAMIC_COLOR = "#0071b5";

const SCRUTINEERING = [
  { icon: "🔧", label: "Mechanical", desc: "Fahrwerk, Gurte, Überrollbügel, Cockpit-Maße" },
  { icon: "↗️", label: "Tilt Test", desc: "60° Neigung – keine Flüssigkeiten, kein Umkippen" },
  { icon: "🌧️", label: "Rain Test (EV)", desc: "Beregnung bei aktivem HV-System – IMD darf nicht auslösen" },
  { icon: "🛑", label: "Brake Test", desc: "Alle 4 Räder müssen gleichzeitig blockieren" },
];

const CLASSES = [
  {
    id: "CV",
    icon: "⛽",
    label: "Combustion",
    color: "#e67e22",
    points: [
      "Turbo-Einzylinder Motorradmotoren",
      "Luftmengenbegrenzer (Restriktor) Pflicht",
      "Kraftstoffverbrauch wird gewogen",
    ],
  },
  {
    id: "EV",
    icon: "⚡",
    label: "Electric",
    color: "#0071b5",
    points: [
      "Max. 80 kW Batterieleistung",
      "Systemspannung bis 600 V DC",
      "Allradantrieb über Radnabenmotoren möglich",
    ],
  },
  {
    id: "DV",
    icon: "🤖",
    label: "Driverless",
    color: "#8e44ad",
    points: [
      "Vollautonome Fahrzeugsteuerung",
      "LiDAR + Kamera + SLAM-Algorithmen",
      "Trackdrive statt Endurance",
    ],
  },
];

export default function DisciplinesChart() {
  const [active, setActive] = useState<string | null>(null);

  const staticDisciplines = DISCIPLINES.filter((d) => d.category === "Statisch");
  const dynamicDisciplines = DISCIPLINES.filter((d) => d.category === "Dynamisch");

  return (
    <div className="space-y-10">
      {/* Split bar */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span>Statisch · {STATIC_TOTAL} Pkt.</span>
          <span className="text-sm font-bold text-foreground">{TOTAL} Punkte gesamt</span>
          <span>Dynamisch · {DYNAMIC_TOTAL} Pkt.</span>
        </div>
        <div className="flex h-4 w-full overflow-hidden rounded-full">
          <motion.div
            className="h-full"
            style={{ backgroundColor: STATIC_COLOR }}
            initial={{ width: 0 }}
            whileInView={{ width: `${(STATIC_TOTAL / TOTAL) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="h-full"
            style={{ backgroundColor: DYNAMIC_COLOR }}
            initial={{ width: 0 }}
            whileInView={{ width: `${(DYNAMIC_TOTAL / TOTAL) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Bar chart */}
      <ul className="space-y-3">
        {DISCIPLINES.map((d, i) => {
          const widthPct = (d.points / 250) * 100;
          const isActive = active === d.name;
          const color = d.category === "Statisch" ? STATIC_COLOR : DYNAMIC_COLOR;
          return (
            <li key={d.name}>
              <div className="mb-1 flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium text-foreground">
                  <span className="mr-1.5">{d.icon}</span>
                  {d.name}
                  <span className="ml-2 text-xs font-normal text-muted">{d.category}</span>
                </span>
                <span className="shrink-0 tabular-nums text-muted">{d.points} Pkt.</span>
              </div>
              <div
                className="h-5 w-full overflow-hidden rounded-full bg-surface-2"
                onMouseEnter={() => setActive(d.name)}
                onMouseLeave={() => setActive(null)}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color, opacity: isActive ? 1 : 0.85 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${widthPct}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Discipline detail cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Statische */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATIC_COLOR }}
            />
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted">
              Statisch · {STATIC_TOTAL} Pkt.
            </h3>
          </div>
          {staticDisciplines.map((d) => (
            <div
              key={d.name}
              className="rounded-xl border border-border bg-surface/60 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-foreground">{d.name}</span>
                    <span
                      className="rounded-full border px-2 py-0.5 text-xs font-bold text-foreground"
                      style={{ borderColor: STATIC_COLOR }}
                    >
                      {d.points} Pkt.
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{d.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamische */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: DYNAMIC_COLOR }}
            />
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted">
              Dynamisch · {DYNAMIC_TOTAL} Pkt.
            </h3>
          </div>
          {dynamicDisciplines.map((d) => (
            <div
              key={d.name}
              className="rounded-xl border border-border bg-surface/60 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-foreground">{d.name}</span>
                    <span
                      className="rounded-full border px-2 py-0.5 text-xs font-bold text-foreground"
                      style={{ borderColor: DYNAMIC_COLOR }}
                    >
                      {d.points} Pkt.
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{d.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrutineering */}
      <div>
        <h3 className="mb-4 text-lg font-bold">🔍 Technische Abnahme (Scrutineering)</h3>
        <p className="mb-4 text-xs text-muted">
          Ohne alle Sticker: keine Zulassung zu dynamischen Disziplinen.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SCRUTINEERING.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-surface/60 p-4 text-center"
            >
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-2 font-semibold text-foreground text-sm">{s.label}</div>
              <div className="mt-1 text-xs text-muted">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fahrzeugklassen */}
      <div>
        <h3 className="mb-4 text-lg font-bold">🏎️ Fahrzeugklassen</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {CLASSES.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border bg-surface/60 p-5"
              style={{ borderColor: c.color + "55" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-foreground">
                    {c.id}
                  </div>
                  <div className="font-semibold text-foreground text-sm">{c.label}</div>
                </div>
              </div>
              <ul className="space-y-1.5">
                {c.points.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-xs text-muted">
                    <span style={{ color: c.color }} className="mt-0.5 shrink-0">▸</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

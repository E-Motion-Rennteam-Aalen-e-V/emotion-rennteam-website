// Single source of truth for the editable content collections. Both the
// admin UI (list/edit forms) and the content-loading helpers key off this.

import { TEAM_DEPARTMENTS, TEAM_SEASONS } from "@/lib/team-departments";
import { SPONSOR_TIERS_BASE as SPONSOR_CONTENT_TIERS } from "@/lib/sponsor-tiers";

export type FieldType =
  | "string"
  | "text"
  | "number"
  | "boolean"
  | "datetime"
  | "select"
  | "image"
  | "richText"
  | "objectList";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  isTitle?: boolean;
  isBody?: boolean;
  options?: string[];
  /** Field defs for the repeatable rows, only used when type === "objectList" */
  fields?: FieldDef[];
}

export interface CollectionDef {
  name: string;
  label: string;
  path: string;
  fields: FieldDef[];
}

export const collections: CollectionDef[] = [
  {
    name: "team",
    label: "Team-Mitglieder",
    path: "content/team",
    fields: [
      { name: "name", label: "Name", type: "string", isTitle: true, required: true },
      { name: "role", label: "Position/Rolle", type: "string", required: true },
      {
        name: "department",
        label: "Abteilung",
        type: "select",
        required: true,
        // Muss exakt den Werten aus TEAM_DEPARTMENTS entsprechen - die
        // Team-Seite filtert Mitglieder strikt nach diesen Strings
        // (team.filter(member => member.department === department)). Ein
        // hier abweichender Wert fuehrt dazu, dass ein gespeichertes
        // Mitglied auf /team in keiner Abteilungs-Sektion auftaucht, ohne
        // dass ein Fehler angezeigt wird.
        options: [...TEAM_DEPARTMENTS],
      },
      {
        name: "season",
        label: "Saison",
        type: "select",
        options: [...TEAM_SEASONS],
      },
      { name: "photo", label: "Foto", type: "image" },
      { name: "linkedin", label: "LinkedIn-URL", type: "string" },
      { name: "body", label: "Kurzbeschreibung", type: "richText" },
      { name: "order", label: "Reihenfolge", type: "number" },
    ],
  },
  {
    name: "vehicle",
    label: "Fahrzeuge",
    path: "content/vehicles",
    fields: [
      { name: "name", label: "Fahrzeugname", type: "string", isTitle: true, required: true },
      { name: "year", label: "Baujahr", type: "number", required: true },
      { name: "tagline", label: "Kurzslogan", type: "string" },
      { name: "coverImage", label: "Titelbild", type: "image" },
      {
        name: "specs",
        label: "Technische Daten",
        type: "objectList",
        fields: [
          { name: "label", label: "Bezeichnung", type: "string" },
          { name: "value", label: "Wert", type: "string" },
        ],
      },
      { name: "current", label: "Aktuelles Fahrzeug", type: "boolean" },
      { name: "body", label: "Beschreibung", type: "richText" },
    ],
  },
  {
    name: "sponsor",
    label: "Sponsoren",
    path: "content/sponsors",
    fields: [
      { name: "name", label: "Name", type: "string", isTitle: true, required: true },
      {
        name: "tier",
        label: "Sponsoring-Stufe",
        type: "select",
        options: [...SPONSOR_CONTENT_TIERS],
        required: true,
      },
      { name: "logo", label: "Logo", type: "image" },
      { name: "website", label: "Website-URL", type: "string" },
      { name: "body", label: "Beschreibung", type: "richText" },
    ],
  },
  {
    name: "news",
    label: "News & Blog",
    path: "content/news",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "date", label: "Datum", type: "datetime", required: true },
      { name: "excerpt", label: "Kurzbeschreibung", type: "text" },
      { name: "coverImage", label: "Titelbild", type: "image" },
      { name: "body", label: "Inhalt", type: "richText", isBody: true },
    ],
  },
  {
    name: "page",
    label: "Seiteninhalte",
    path: "content/pages",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "heroTitle", label: "Hero-Titel", type: "string" },
      { name: "heroSubtitle", label: "Hero-Untertitel", type: "text" },
      {
        name: "stats",
        label: "Kennzahlen (nur Startseite)",
        type: "objectList",
        fields: [
          { name: "label", label: "Bezeichnung", type: "string" },
          { name: "value", label: "Wert", type: "string" },
        ],
      },
      {
        name: "departmentDescriptions",
        label: "Abteilungsbeschreibungen (nur Team)",
        type: "objectList",
        fields: [
          { name: "label", label: "Abteilung", type: "string" },
          { name: "value", label: "Beschreibung", type: "string" },
        ],
      },
      { name: "address", label: "Adresse (nur Kontakt)", type: "text" },
      { name: "email", label: "E-Mail (nur Kontakt)", type: "string" },
      { name: "phone", label: "Telefon (nur Kontakt)", type: "string" },
      { name: "socialMedia", label: "Social Media (nur Kontakt)", type: "string" },
      { name: "body", label: "Inhalt", type: "richText" },
    ],
  },
  {
    name: "blog",
    label: "Blog",
    path: "content/blog",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "date", label: "Datum", type: "datetime", required: true },
      { name: "author", label: "Autor:in", type: "string" },
      { name: "excerpt", label: "Kurzbeschreibung", type: "text" },
      { name: "coverImage", label: "Titelbild", type: "image" },
      { name: "body", label: "Inhalt", type: "richText", isBody: true },
    ],
  },
  {
    name: "galleryImage",
    label: "Galerie",
    path: "content/gallery",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "image", label: "Bild", type: "image", required: true },
      {
        name: "album",
        label: "Album",
        type: "string",
        required: true,
      },
      { name: "order", label: "Reihenfolge", type: "number" },
    ],
  },
  {
    name: "result",
    label: "Erfolge",
    path: "content/results",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "year", label: "Jahr", type: "number", required: true },
      { name: "event", label: "Wettbewerb", type: "string", required: true },
      { name: "placement", label: "Platzierung", type: "string" },
      { name: "description", label: "Beschreibung", type: "richText" },
    ],
  },
  {
    name: "position",
    label: "Offene Positionen",
    path: "content/positions",
    fields: [
      { name: "title", label: "Titel", type: "string", isTitle: true, required: true },
      { name: "department", label: "Abteilung", type: "string" },
      { name: "commitment", label: "Umfang", type: "string" },
      { name: "description", label: "Beschreibung", type: "richText", isBody: true },
    ],
  },
];

export function getCollection(name: string): CollectionDef | undefined {
  return collections.find((c) => c.name === name);
}

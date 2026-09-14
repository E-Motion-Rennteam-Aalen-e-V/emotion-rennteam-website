# 13 – Wettkampf-Ergebnisse eintragen

## Aufbau

Ergebnisse liegen in `content/results/` als `.md`-Dateien.

---

## Neues Ergebnis eintragen

1. Navigiere zu `content/results/`
2. **"+ Add file" → "Create new file"**
3. Dateiname: `YYYY-wettbewerbsname.md`
   ```
   2026-formula-student-germany.md
   2025-formula-student-east.md
   ```

```markdown
---
title: "Formula Student Germany 2026"
year: 2026
event: "Formula Student Germany – Hockenheimring"
placement: "3. Platz (Electric Class)"
---

## Zusammenfassung

Beim Formula Student Germany 2026 in Hockenheim erreichte unser Team mit dem EM-26 einen hervorragenden **3. Platz** in der Electric Class.

## Ergebnisse nach Disziplin

| Disziplin | Punkte | Platzierung |
|-----------|--------|-------------|
| Technische Abnahme | Bestanden | – |
| Business Plan | 78/100 | 12. Platz |
| Engineering Design | 95/150 | 5. Platz |
| Skid Pad | 21/75 | 8. Platz |
| Autocross | 89/150 | 4. Platz |
| Endurance | 265/325 | 3. Platz |
| **Gesamt** | **548/1000** | **3. Platz** |

## Fazit

Ein großer Erfolg für das gesamte Team! Besonderer Dank gilt...
```

---

## Pflichtfelder

| Feld | Pflicht | Hinweis |
|------|---------|---------|
| `title` | ✅ | Offizieller Wettbewerbsname |
| `year` | ✅ | Jahr als Zahl, kein Text |
| `event` | ✅ | Vollständige Bezeichnung + Ort |
| `placement` | Empfohlen | Platzierung als Text |

---

## Sortierung

Ergebnisse werden automatisch nach Jahr sortiert (neuestes zuerst).

---

## Beispiel: Alle Wettbewerbe eintragen

```
content/results/
├── 2026-formula-student-germany.md
├── 2025-formula-student-czech.md
├── 2025-formula-student-east.md
├── 2024-formula-student-germany.md
└── 2024-formula-student-hungary.md
```

# CMS als macOS-App

`E-Motion CMS.app` (im Repo-Root, wird mit dem Quellcode zusammen im
GitHub-ZIP ausgeliefert) ist das macOS-Gegenstück zum Windows-Weg über
`CMS-Start.bat`: Doppelklick statt Terminal-Befehle.

## Für Redakteure: Erste Einrichtung

1. Diesen Branch als ZIP laden (GitHub → "Code" → "Download ZIP") und
   entpacken.
2. **Wichtig:** den entpackten Ordner (den ganzen Ordner, nicht nur die
   App) im Finder einmal an seinen endgültigen Ort ziehen, z. B. auf den
   Schreibtisch oder nach "Dokumente" — nicht direkt aus dem
   Downloads-Ordner starten. Sonst kann macOS die App aus Sicherheitsgründen
   ("App Translocation") aus einem isolierten Ort ausführen, in dem sie den
   Rest des Projektordners nicht findet. Passiert das doch, zeigt die App
   einen Dialog mit genau dieser Lösung an, statt einfach nicht zu
   funktionieren.
3. `E-Motion CMS.app` doppelklicken.
4. **Erster Start:** macOS zeigt "kann nicht geöffnet werden, da der
   Entwickler nicht verifiziert werden kann" — das ist normal für Apps
   ohne Apple-Entwicklerzertifikat (99 $/Jahr, hier nicht vorhanden) und
   passiert bei sehr vielen kleinen/Open-Source-Mac-Programmen. Einmalig
   im Finder **rechtsklicken → Öffnen** (nicht einfach doppelklicken) und
   im Dialog nochmal **Öffnen** bestätigen. Ab dann merkt sich macOS das
   und die App startet danach ganz normal per Doppelklick.
5. Beim allerersten echten Start öffnet sich automatisch ein
   Terminal-Fenster für den Einrichtungsassistenten (Admin-Zugangsdaten
   festlegen, Node.js-Abhängigkeiten installieren). Das ist einmalig.
6. Ab dem zweiten Start läuft alles im Hintergrund, kein Terminal mehr
   sichtbar — die App öffnet direkt ein eigenes Fenster mit der
   Login-Seite.

Zum Beenden: den "Herunterfahren"-Button im CMS selbst nutzen (siehe
Admin-Oberfläche, oben neben "Abmelden").

## Für Maintainer: App nach Änderungen neu signieren

`E-Motion CMS.app` besteht nur aus einem Shell-Skript als
`CFBundleExecutable` (`Contents/MacOS/cms-launcher`) + `Info.plist` + Icon,
kein kompiliertes Programm. Nach jeder Änderung an der App selbst (Icon,
Launcher-Skript, Bundle-ID) muss sie auf einem echten Mac neu ad-hoc
signiert werden, sonst zeigt macOS statt der normalen
"unbekannter Entwickler"-Warnung die härtere Meldung "... ist beschädigt":

```bash
./scripts/mac-sign-app.sh
```

Braucht nur die Xcode Command Line Tools (`xcode-select --install`), **kein**
Apple-Developer-Account. Danach die aktualisierte `E-Motion CMS.app`
committen.

**Wichtige Einschränkung:** Diese App wurde in einer Linux-Sandbox gebaut
und konnte nicht auf einem echten Mac getestet werden (Finder-Doppelklick,
Icon-Darstellung, Gatekeeper-Verhalten, `osascript`-Dialoge). Vor dem
ersten Rollout an die Redaktion bitte einmal auf einem echten Mac
durchklicken und diese Anleitung bei Bedarf korrigieren.

## Was macht `cms-launcher` konkret?

- Ist `.env.local` noch nicht da, oder fehlen Node.js/npm/`node_modules`,
  wird ein sichtbares Terminal-Fenster geöffnet, das ganz normal
  `CMS-Start.command` ausführt (identische, bereits erprobte Logik wie
  unter Windows/Linux) — für Ersteinrichtung und lesbare Fehlermeldungen.
- Ist bereits alles eingerichtet, läuft `CMS-Start.command` im
  Hintergrund (Log unter `.cms-launcher.log` im Projektordner). Stürzt der
  Start innerhalb der ersten 3 Sekunden ab, erscheint eine native
  Fehlermeldung (`osascript display dialog`) statt einer App, die
  scheinbar nichts tut.
- Ab da übernimmt exakt dieselbe Logik wie bei Windows: `scripts/cms-open-app.sh`
  öffnet das Browser-App-Fenster, `scripts/cms-supervisor.mjs` startet und
  überwacht den eigentlichen Next.js-Server.
- Läuft bereits eine Instanz (App versehentlich ein zweites Mal gestartet),
  wird kein zweiter Server versucht (das würde nur mit einer kryptischen
  Fehlermeldung scheitern) — stattdessen öffnet sich einfach ein weiteres
  Fenster zur bereits laufenden Instanz.
- Wird die App über das Dock beendet (Rechtsklick → "Beenden", Cmd+Q,
  Aktivitätsanzeige), beendet ein Cleanup-Trap den kompletten
  CMS-Prozessbaum mit — der Server läuft dann nicht unsichtbar im
  Hintergrund weiter. Der reguläre Weg bleibt trotzdem der
  "Herunterfahren"-Button im CMS selbst.
- Startet macOS die App aus einem durch "App Translocation" isolierten,
  schreibgeschützten Ort (siehe Schritt 2 oben), erkennt `cms-launcher`
  das (fehlende `package.json`/`CMS-Start.command` neben der App oder ein
  Pfad mit `AppTranslocation`) und zeigt einen erklärenden Dialog statt
  einem kryptischen Terminal-Fehler oder stillem Fehlschlagen.

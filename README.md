# Physik Repo - Lernpfade und Arbeitsblätter

Diese Fassung ist als GitHub-Pages-Struktur vorbereitet.

Grundsatz der Ordnerstruktur:

- Jeder Lernpfad liegt in einem eigenen Unterordner.
- Im Lernpfadordner liegt die HTML-Datei des Lernpfads.
- Lokal benötigte Bilder, Skripte oder Styles liegen im Unterordner `assets/` des jeweiligen Lernpfads.
- Das passende Arbeitsblatt liegt im selben Lernpfadordner als PDF, in der Regel als `arbeitsblatt.pdf`.
- LaTeX-Projektdateien, `.tex`-Quellen und Build-Artefakte sind in dieser Downloadfassung nicht enthalten.

Die zentrale `data.json` verweist pro Eintrag auf:

- `lernpfad_html`
- `arbeitsblatt_pdf`

Einträge ohne separates Arbeitsblatt enthalten `arbeitsblatt_pdf: null`.

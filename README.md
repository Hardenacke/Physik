# Physik-Lernpfade mit dreistufiger Themen-Navigation

Diese Fassung ist für GitHub Pages vorbereitet und nutzt eine klare Navigationslogik:

1. `index.html`: Auswahl der Klasse oder des Kurses
2. `<klasse-oder-kurs>/index.html`: Übersicht über Themenbereiche nach Lehrplan und Ordnerstruktur
3. `<klasse-oder-kurs>/<themenbereich>/index.html`: Lernpfade und die zugehörigen PDF-Arbeitsblätter

## Strukturprinzip

- Jeder Lernpfad bleibt in seinem Materialordner.
- Lokale Assets wie Bilder bleiben im jeweiligen `assets/`-Ordner des Lernpfads.
- Arbeitsblätter liegen nur als PDF im Materialordner.
- LaTeX-Projektdateien sind nicht enthalten.
- Die zentrale `data.json` enthält alle Klassen/Kurse, Themenbereiche und Materialpfade.

## Umfang

- Klassen/Kurse: 7
- Themenbereiche: 26
- Lernpfade/Materialien: 168
- PDF-Arbeitsblätter: 163

## Kompatibilität

Alte Links wie `klasse.html?klasse=klasse-8` werden auf die neue Ordnernavigation weitergeleitet.

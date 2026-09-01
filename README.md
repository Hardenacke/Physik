# Physik – GitHub-Pages-Struktur

Diese Fassung orientiert sich an der dynamischen Navigation der Mathematik-Sammlung.

## Benötigte Dateien im Hauptordner

```text
Physik/
├── index.html
├── data.json
├── README.md
├── klasse-5/
├── klasse-8/
├── klasse-9/
├── klasse-10/
├── ef/
├── q1-q2-grundkurs/
└── q1-q2-leistungskurs/
```

Die eigentlichen Lernpfade, PDFs und Assets bleiben in ihren bestehenden Materialordnern.

## Funktionsweise

- `index.html` ist die einzige Navigationsanwendung.
- `data.json` enthält Klassen/Kurse, Themenbereiche, Unterordner und Materialien.
- Die Navigation läuft über Hash-Routen wie `#/ef/bewegungen-kraefte-und-energie/...`.
- Materialdateien werden direkt über ihren tatsächlichen Repository-Pfad geöffnet.
- HTML-Dateien und PDFs werden als getrennte Materialien geführt.
- Eine separate `style.css` wird nicht benötigt; alle Styles stehen in `index.html`.

## Dateien, die im Root nicht mehr benötigt werden

Nach dem Ersetzen der Hauptdateien können diese alten Root-Dateien entfernt werden:

- `style.css`
- `klasse.html`
- `struktur_pruefbericht.json`

Die bisherigen automatisch erzeugten Klassen-Übersichtsseiten wie `ef/index.html`,
`klasse-5/index.html` usw. werden von der neuen Navigation ebenfalls nicht mehr benötigt.
Sie können zunächst liegen bleiben; die neue Root-Navigation verlinkt sie nicht.

**Wichtig:** Nicht pauschal alle tiefer liegenden `index.html`-Dateien löschen.
In einzelnen Materialordnern sind `index.html`-Dateien selbst Lernpfade und werden
über `data.json` direkt geöffnet.

## EF – SI-Einheiten

Der vorhandene Lernpfad ist eingetragen unter:

`ef/bewegungen-kraefte-und-energie/Eintsieg Einheiten/SI_Lernpfad.html`

Der früher eingetragene Ordner

`ef/bewegungen-kraefte-und-energie/einstieg/`

wurde aus der neuen `data.json` entfernt, da die zugehörigen Dateien im Repository gelöscht wurden.

## Aktualisieren der Sammlung

Neue Materialien werden künftig ausschließlich in `data.json` ergänzt.
Die Root-`index.html` muss dafür nicht mehr verändert werden.

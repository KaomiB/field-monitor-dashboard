# Export SVG diagrams to PNG (for Google Docs)

Google Docs doesn’t support SVG. Online SVG→PNG converters often drop text because the diagrams use system fonts (e.g. Segoe UI, Courier New) that aren’t available on the converter’s server.

**Option 1 — Script (recommended, preserves text)**  
From the repo root (`blynk`):

```bash
npm install
npm run export-diagrams
```

This uses headless Chrome to render the SVGs (from `diagrams/`) with your system fonts and writes PNGs into `diagrams/`:

- `diagrams/component_diagram_light.png`
- `diagrams/component_diagram.png`
- `diagrams/schematic_diagram.png`

Insert these PNGs into Google Docs as usual (Insert → Image → Upload from computer).

**Option 2 — Inkscape (no Node)**  
1. Install [Inkscape](https://inkscape.org/).
2. Open the `.svg` file in `diagrams/`.
3. **File → Export PNG Image** (or Export → Export PNG). Set resolution (e.g. 2x) and export.
4. If text is missing, convert text to paths first: **Select All** (Ctrl+A) → **Object → Object to Path**, then export again.

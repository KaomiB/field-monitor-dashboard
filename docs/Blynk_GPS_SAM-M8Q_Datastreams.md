# Blynk GPS (SAM-M8Q) — Datastreams and Representation

> **Note (2026-03-15):** GPS section (V30–V34) is still current. However, V35 is now used for **BMP180 pressure** (not a GPS map location pin). See `field_logger_inventory.md` for the full virtual pin map.

This document specifies the **Blynk template datastreams** required for the SAM-M8Q GPS so the device and Blynk app have full representation (values + map).

## Virtual pins used by firmware

The Final Project sketch (`Arduino/FinalProject/FinalProject.ino`) writes GPS data to these virtual pins:

| Virtual Pin | Blynk datastream type | Label (suggested) | Description |
|-------------|------------------------|-------------------|-------------|
| **V30**     | `double`               | GPS Latitude      | Latitude (degrees) |
| **V31**     | `double`               | GPS Longitude     | Longitude (degrees) |
| **V32**     | `double`               | GPS Altitude      | Altitude (m); units: Meter |
| **V33**     | `double`               | GPS Speed         | Ground speed (m/s); units: MeterPerSecond |
| **V34**     | `integer`              | GPS SIV           | Satellites in view (count) |

## Checklist: ensure all representation/datastreams exist

In the Blynk template used by your device (e.g. "Blynk Board"):

1. **V30 — Latitude**  
   - Type: **double**  
   - Label: e.g. "GPS Latitude"  
   - Min/Max: e.g. -90 / 90 (optional).  
   - Used for: numeric display; can be used as source for a Map widget.

2. **V31 — Longitude**  
   - Type: **double**  
   - Label: e.g. "GPS Longitude"  
   - Min/Max: e.g. -180 / 180 (optional).  
   - Used for: numeric display; Map widget.

3. **V32 — Altitude**  
   - Type: **double**  
   - Label: e.g. "GPS Altitude"  
   - Units: **Meter**.  
   - Used for: numeric display.

4. **V33 — Speed**  
   - Type: **double**  
   - Label: e.g. "GPS Speed"  
   - Units: **MeterPerSecond** (or None).  
   - Used for: numeric display.

5. **V34 — Satellites (SIV)**  
   - Type: **integer**  
   - Label: e.g. "GPS SIV" or "Satellites"  
   - Used for: numeric display (satellites in view).

## Optional: Map widget

For a **map** in the Blynk app:

- Blynk Map widget can use a **location** datastream (single pin with `longitude,latitude` format) **or** separate lat/lon pins depending on template support.
- If your template supports a **location**-type datastream, you can add one (e.g. V35) and send from the device as `longitude,latitude` (e.g. `Blynk.virtualWrite(V35, lon, lat);` if the API accepts that format).
- With **V30 + V31** as double datastreams, many Blynk setups allow the Map widget to use Lat (V30) and Lon (V31) as data sources—configure the Map widget to use these two pins if available.

## Summary

- **Minimum:** Create five datastreams in your Blynk template: **V30** (lat), **V31** (lon), **V32** (alt), **V33** (speed), **V34** (SIV) with types and labels above.
- **Map:** Use V30 + V31 in the Map widget, or add a separate location datastream if your template supports it and you extend the sketch to write it.

Current wiring and pin map are documented in `Final_Project_Overview.md` and `Wiring_Table_And_Stability.md`.

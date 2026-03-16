# GPS SAM-M8Q — Blynk representation and datastreams

> **Note (2026-03-15):** GPS datastreams (V30–V34) unchanged. This is a **duplicate** of `Blynk_GPS_SAM-M8Q_Datastreams.md`. Full virtual pin map now in `field_logger_inventory.md`.

This document defines the **required Blynk template datastreams** for the SAM-M8Q GPS so the device, Blynk app, and local dashboard stay in sync. The firmware writes to virtual pins **V30–V34** every 2 s when the GPS has a fix.

---

## Required datastreams (template checklist)

Ensure your Blynk template has **exactly these five datastreams** for the Environmental Field Logger device. Create or edit them in the Blynk console so pin number, label, type, and units match.

| Pin | Label            | Type    | Units | Min   | Max   | Description |
|-----|------------------|---------|-------|-------|-------|--------------|
| **V30** | GPS Latitude     | double  | Degrees | -90  | 90    | Latitude (decimal degrees). No fix: device may send -999. |
| **V31** | GPS Longitude    | double  | Degrees | -180 | 180   | Longitude (decimal degrees). No fix: device may send -999. |
| **V32** | GPS Altitude     | double  | Meter  | —     | —     | Altitude in meters. No fix: device may send -999. |
| **V33** | GPS Speed        | double  | MeterPerSecond | 0 | — | Ground speed in m/s. No fix: 0. |
| **V34** | GPS Satellites (SIV) | integer | None | 0 | 20+ | Satellites in view (SIV). No fix: 0. |

- **Firmware:** `Arduino/FinalProject/FinalProject.ino` (and `Sparkfun_Blynk_Board0.ino`) use `Blynk.virtualWrite(V30, lat)` through `V34` for lon, alt, speed, SIV.
- **Dashboard:** The sensor-dashboard accepts `gps_latitude`, `gps_longitude`, `gps_altitude`, `gps_speed`, `gps_satellites` in POST `/api/data` (see `sensor-dashboard/README.md`). The device sends the same values in the HTTP body; Blynk receives them via V30–V34.

---

## Optional: Blynk Map widget

If you use a **Map** widget in the Blynk app, you can bind it to a **location** datastream (lat, lon in one). Our firmware uses **separate** V30 (lat) and V31 (lon), so either:

- Use **two Value** or **Label** widgets bound to V30 and V31 (and optionally V32–V34), or  
- Add a separate **location** datastream (e.g. a sixth pin) and have the device write `longitude,latitude` to it in addition to V30/V31, then bind the Map to that pin.

For MVP, the five datastreams above are sufficient; the local dashboard and Blynk value widgets can use V30–V34 as-is.

---

## Summary

| Pin  | Meaning   | Unit / format |
|------|-----------|----------------|
| V30  | Latitude  | decimal degrees |
| V31  | Longitude | decimal degrees |
| V32  | Altitude  | meters |
| V33  | Speed     | m/s |
| V34  | SIV       | count (integer) |

**Reference:** Virtual pin map in [Final_Project_Overview.md](Final_Project_Overview.md); wiring in [Wiring_Table_And_Stability.md](Wiring_Table_And_Stability.md) (SAM-M8Q → V30–V34).

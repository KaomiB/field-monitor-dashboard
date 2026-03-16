# INF 148 — Final Project Overview (Environmental Field Logger)

> **Last updated:** 2026-03-15. Reflects the multi-sensor config with two ADS1115s, PIR, BMP180 (pending), MQ2, flame, water level sensors, real-time SSE dashboard, GPS with double-precision coordinates, and file-based persistence.

**Purpose:** Single reference for the Final Project and where key artifacts live. Intended for humans and for **other agents** working on this project.

**Current wiring state:** Documented in `field_logger_inventory.md` (primary reference) and `Documents/2025/Breadboard.md` (diagram is outdated; summary is current).

---

## What the project is

- **Course:** INF 148 — Designing for the Internet of Things (Option 3 — Programming Guru)
- **Deliverable:** Environmental field logger: ESP8266 (SparkFun Blynk Board) with multiple sensors, sending data to **Blynk** and to a **local web dashboard**.
- **Sensors (current):** Si7021 (onboard temp/humidity), ADS1115 #1 (soil, water, flame, photocell), ADS1115 #2 (MQ2 gas), BMP180 (pressure — wired but not yet detected on I2C), HC-SR501 PIR (motion), Sound Detector (board ADC), SAM-M8Q GPS.
- **Disabled:** Door switch (code exists, `DOOR_ENABLED 0`), DHT11 (not used; Si7021 covers temp/humidity).
- **Outputs:** RGB LED (WS2812), servo (GPIO 15), button/LED (GPIO 0).
- **Data paths:** Blynk app (when V50 ON) and HTTP POST to a Node.js dashboard (always, every 5 s).

---

## Submission / deliverables

The final project requires **only**:

1. **Written report** (5–10 pages, PDF): purpose, need, competitors, sketches, interface, security/data, and (if group) who did what.
2. **Video**: a recording of the **functioning device** (sensors, Blynk app, and/or local dashboard in action). No PPT or formal slide presentation is required — the video shows the system working.

Full source code (Arduino sketch + dashboard) is also submitted per Option 3. Check Canvas for exact file-upload requirements.

---

## Key artifacts and paths

| What | Path | Notes |
|------|------|--------|
| **Final Project Arduino sketch** | `Arduino/FinalProject/FinalProject.ino` | Standalone; do not use `Sparkfun_Blynk_Board0` for the final project. |
| **Final Project README** | `Arduino/FinalProject/README.md` | Hardware, libraries, virtual pins, dual output. |
| **Sensor dashboard (website)** | `code/blynk/sensor-dashboard/` | Node.js app: receives POSTs, pushes SSE to browser, serves dashboard UI. |
| **Website guide** | `code/blynk/sensor-dashboard/WEBSITE_GUIDE.md` | How to run the dashboard, connect the device, troubleshoot. |
| **Dashboard API reference** | `code/blynk/sensor-dashboard/README.md` | Endpoints, JSON body format, optional API key. |
| **Field logger inventory** | `Downloads/LectureSlides&otherIOT Files/field_logger_inventory.md` | Primary hardware reference: every component, pin, status, source. |
| **Wiring guide** | `code/blynk/Step_by_Step_Wiring_Guide.md` | Step-by-step wiring for board + sensors. |
| **Wiring table + stability** | `code/blynk/Wiring_Table_And_Stability.md` | Pin table, mutability, what to solder. *(Partially outdated — reflects earlier config.)* |
| **ADS1115 troubleshooting** | `code/blynk/ADS1115_Troubleshooting.md` | I2C scan, wiring checklist, minimal test sketch. *(Partially outdated — dual ADS1115 setup now.)* |
| **GPS SAM-M8Q Blynk datastreams** | `code/blynk/GPS_SAM-M8Q_Blynk_Datastreams.md` | Required Blynk template datastreams (V30–V34) for GPS. Note: V35 is now BMP180 pressure, not GPS map. |
| **Final report outline** | `code/blynk/Final-Project-Paper-Outline.md` | Report structure with placeholders for 5–10 pp submission. |
| **Prompt: write paper** | `code/blynk/Claude-Prompt-Write-Paper.md` | Prompt for Claude (or other AI) to draft the 5–10 pp report from the outline. |
| **Labs virtual pins (Labs 5 & 6)** | `Arduino/Sparkfun_Blynk_Board0/LABS_5_6_VIRTUAL_PINS.md` | Labs-only; V20=door in labs, V25 in Final Project. |

Paths are relative to the user's home or workspace; `code/blynk` is under the blynk repo/workspace.

---

## Website (sensor dashboard)

- **Run:** `cd code/blynk/sensor-dashboard && npm install && npm start` → open http://localhost:3000
- **Real-time:** Uses Server-Sent Events (SSE) — the browser receives instant push updates when the ESP8266 POSTs data. Falls back to 3 s polling if SSE disconnects. A green pulsing dot appears in the header when live.
- **Persistence:** `current.json` and `history.json` are saved to `sensor-dashboard/data/` every 10 s and on shutdown. Data survives server restarts. Up to 2000 history points are retained.
- **Device config:** Set `DASHBOARD_HOST` in `FinalProject.ino` to the PC's LAN IP (currently `"192.168.0.56"`). The device POSTs to `http://<host>:3000/api/data` every 5 s.
- **Firewall:** On Arch/systemd, `firewalld` must allow port 3000 for the ESP8266 to reach the server: `sudo firewall-cmd --add-port=3000/tcp --permanent && sudo firewall-cmd --reload`.
- **API:** POST JSON to `/api/data` or `/ingest`; GET `/api/data` for current values; GET `/api/history?limit=100` for chart data; GET `/api/events` for SSE stream. All fields optional; snake_case or camelCase. See dashboard README for field list.

---

## Virtual pin map (FinalProject.ino — updated 2026-03-15)

| Pin | Data | Source |
|-----|------|--------|
| V0 | Sound ADC raw (0–1023) | Board A0 |
| V1 | Button LED | GPIO 0 |
| V2,V3,V4,V15 | RGB LED | NeoPixel (WS2812) |
| V5 | Temperature °F | Si7021 |
| V6 | Temperature °C | Si7021 |
| V7 | Humidity % | Si7021 |
| V8 | Sound ADC voltage | Board A0 |
| V17 | Servo (synced) | Slider |
| V20 | Soil voltage | ADS1 A0 |
| V21 | Water voltage | ADS1 A1 |
| V22 | Light voltage | ADS1 A3 |
| V23 | Gas voltage (MQ2) | ADS2 A0 |
| V24 | Servo angle | Slider / GPIO 15 |
| V25 | Door (disabled) | GPIO 16 |
| V26 | Soil moisture % | Derived from V20 |
| V30 | GPS latitude | SAM-M8Q |
| V31 | GPS longitude | SAM-M8Q |
| V32 | GPS altitude (m) | SAM-M8Q |
| V33 | GPS speed (m/s) | SAM-M8Q |
| V34 | GPS satellites (SIV) | SAM-M8Q |
| V35 | Barometric pressure (hPa) | BMP180 |
| V36 | Motion (PIR 0/1) | GPIO 12 |
| V50 | Push enable | App switch |

---

## I2C address map (confirmed via scan)

| Address | Device | Status |
|---------|--------|--------|
| 0x40 | Si7021 (temp/humidity) | Detected |
| 0x42 | SAM-M8Q GPS | Detected |
| 0x48 | ADS1115 #1 (soil, water, flame, light) | Detected |
| 0x49 | ADS1115 #2 (MQ2 gas) | Detected |
| 0x77 | BMP180 (pressure) | **Not detected** — wired but not on bus |

---

## For other agents

- **Editing the Final Project:** Change only `Arduino/FinalProject/` (and this overview / website guide if you add or move artifacts). Do not rely on or edit `Sparkfun_Blynk_Board0` for the final project.
- **Website changes:** Logic in `sensor-dashboard/server.js`; UI in `sensor-dashboard/public/index.html` and `app.js`. The server uses SSE (`/api/events`) to push data in real time — if you add new sensor fields, add them to `freshCurrent()`, `KEY_MAP`, and `historyKeys` in server.js, and to `FIELDS` in app.js. Update `WEBSITE_GUIDE.md` or `README.md` if endpoints or flow change.
- **Persistence:** `data/current.json` and `data/history.json` are auto-saved. The `data/` directory is in `.gitignore`.
- **GPS precision:** `dashboard_gps_latitude` and `dashboard_gps_longitude` are `double` (not `float`) in the sketch, serialized with 7 decimal places. The `ADD_D` macro in `pushDashboardToWebsite()` handles this.
- **Wiring / hardware:** Prefer `field_logger_inventory.md` for the current sensor list and pin assignments. `Wiring_Table_And_Stability.md` and `Step_by_Step_Wiring_Guide.md` have general guidance but reflect an earlier config.

---

## Current sensor status (2026-03-15)

| Sensor | Status | Notes |
|--------|--------|-------|
| Si7021 (temp/humidity) | **Working** | Onboard; no wiring needed |
| SAM-M8Q GPS | **Working** | I2C Qwiic; 9–14 sats typical. Double-precision lat/lon. |
| ADS1115 #1 (0x48) | **Working** | A0=soil, A1=water, A2=flame, A3=photocell |
| ADS1115 #2 (0x49) | **Working** | A0=MQ2 gas |
| Sound Detector | **Working** | Board ADC A0; raw ~920, voltage ~2.97V |
| PIR Motion (HC-SR501) | **Working** | GPIO 12; triggers frequently when nearby |
| BMP180 | **Not detected** | Wired but 0x77 not in I2C scan. Physical connection issue. |
| MQ2 Gas | **Low readings** | Needs 5V for heater; signal → ADS2 A0. Reads ~0V without gas present. |
| Water Level | **Working** | Reads 0V when dry (expected). ADS1 A1 → V21. |
| Flame Detection | **Working** | ~3V idle, drops near flame. ADS1 A2. |
| Door Switch | **Disabled** | `DOOR_ENABLED 0` in sketch. GPIO 16. |
| Servo | Available | GPIO 15; controllable via V24/V17. |

**Dashboard host:** Currently `DASHBOARD_HOST "192.168.0.56"` in sketch. Must match PC's LAN IP on the same WiFi network as the ESP8266. Firewall port 3000 must be open.

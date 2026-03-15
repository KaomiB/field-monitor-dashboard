# Sensor Dashboard — Website Guide

> **Last updated:** 2026-03-15. Reflects the current multi-sensor config with soil, water, flame, light, gas, PIR, pressure, and GPS.

This guide describes how to run, use, and connect the **sensor-dashboard** web app to the INF 148 Final Project (Environmental Field Logger). For API and technical details, see [README.md](README.md). The current wiring/pin map is documented in **`Downloads/LectureSlides&otherIOT Files/field_logger_inventory.md`**.

---

## What the website does

The sensor dashboard is a **standalone web application** that:

- **Receives** sensor data from the ESP8266 (SparkFun Blynk Board) via HTTP POST.
- **Displays** live values on a single-page dashboard (temperature, humidity, light, sound, door, soil, GPS, etc.).
- **Optionally** shows a simple time-series chart (temperature and light over the last ~100 points).

It runs **outside of Blynk**, so you can view data even when Blynk is off (V50) or when you want to avoid hitting Blynk’s message limits. The device sends to **both** Blynk and this dashboard when configured for dual output.

---

## Quick start

1. **Install Node.js** (v14 or later) if you don’t have it: `node -v`
2. **From a terminal:**
   ```bash
   cd /home/om/code/blynk/sensor-dashboard
   npm install
   npm start
   ```
3. **Open in a browser:** [http://localhost:3000](http://localhost:3000)

You should see the dashboard with cards for all sensor types; values will show "—" until the device sends data.

---

## Connecting the device (ESP8266)

The Final Project sketch (`Arduino/FinalProject/FinalProject.ino`) is already set up to POST to this dashboard.

1. **Find your PC’s IP** on the same Wi‑Fi as the ESP8266:
   - Linux: `ip addr` or `hostname -I`
   - Windows: `ipconfig`
   - Example: `192.168.1.100`
2. **In the Arduino sketch**, set at the top of `FinalProject.ino`:
   ```cpp
   #define DASHBOARD_HOST   "192.168.1.100"   // your PC’s IP
   ```
3. **Run the dashboard** on that PC (`npm start` in `sensor-dashboard`).
4. **Upload the sketch** and power the board. The device will POST every 5 seconds to `http://<DASHBOARD_HOST>:3000/api/data`.

The dashboard auto-refreshes every 3 seconds. You should see numbers replace "—" as POSTs arrive.

**Alternative: Blynk webhooks**  
You can also push data into the dashboard from **Blynk** when the device updates virtual pins. In Blynk.Console create a webhook (trigger: Device Datastream Update), set the URL to `https://<your-server>/api/webhook/blynk`, and send `device_pin` and `device_pinValue`. The dashboard maps pins (e.g. V30–V34 for GPS) to the same live values. Useful if the device only talks to Blynk and you want the dashboard to reflect Blynk updates. Full setup: see [README.md](README.md#blynk-webhooks). The dashboard must be reachable by Blynk (e.g. public URL or ngrok).

---

## What you see on the dashboard

- **Header:** Title and last-updated time.
- **Cards:** One card per sensor quantity:
  - Temperature °C / °F, Humidity (Si7021)
  - Soil Voltage, Water Level, Flame, Light (ADS1115 #1)
  - Gas — MQ2 (ADS1115 #2)
  - Barometric Pressure (BMP180, when connected)
  - Motion — PIR (GPIO 12)
  - Sound ADC raw / voltage (Board A0)
  - GPS lat / lon / altitude / speed / satellites (SAM-M8Q)
  - Servo angle
  - Missing data appears as "—".
- **Chart:** If history is being stored, a small chart shows Temperature (°C) and Light (V) over recent points.

No login is required. The page uses a dark theme and is responsive.

---

## Running on a different port

```bash
PORT=8080 npm start
```

Then open http://localhost:8080 and set the device to POST to `<your-IP>:8080` (change `DASHBOARD_PORT` in the sketch to `8080`).

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Dashboard shows only "—" | Device and PC on same Wi‑Fi? `DASHBOARD_HOST` set to PC IP? Dashboard server running? Serial Monitor: any `[Dashboard] POST ... -> -11` (connection failed)? |
| "Cannot GET /" or 404 | You opened the correct URL (e.g. http://localhost:3000), not a path like /api/data in the browser. Open the root URL for the dashboard UI. |
| Chart stays empty | Chart needs history: send several POSTs (wait ~30 s). History is in-memory; server restart clears it. |
| Device can’t connect | Firewall on PC: allow inbound TCP port 3000 (or your PORT). ESP8266 uses the same LAN; no port forwarding needed for local use. |

---

## Optional: API key (e.g. for internet exposure)

If you expose the server to the internet and want to protect the ingest endpoint:

```bash
SENSOR_API_KEY=your-secret-key npm start
```

Then in the Arduino sketch you would add a header (or query param) with that key. The dashboard’s GET requests stay unauthenticated so the page still works. See [README.md](README.md) for header/query format.

---

## File layout (for agents / developers)

```
sensor-dashboard/
├── WEBSITE_GUIDE.md   ← This file (user-facing guide)
├── README.md          ← API reference, endpoints, JSON format, tech stack
├── package.json
├── server.js          ← Express: /api/data, /api/webhook/blynk, /api/history, static files
└── public/
    ├── index.html     ← Dashboard UI
    └── app.js         ← Fetches data, renders cards and chart
```

Data is stored **in memory** only. Restarting the server clears current values and history.

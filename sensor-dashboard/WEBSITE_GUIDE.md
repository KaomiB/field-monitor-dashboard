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
- **Sensor Status:** Chips showing which sensors are active, stale, or inactive.
- **Conditions:** Weather-style widgets (Temperature, Humidity, Water Level, Light) with icons and labels (e.g. Cold/Mild/Warm, Dry/Comfortable/Humid).
- **Alerts:** Fire, Gas, and Water Level event widgets. When a threshold is exceeded, the widget shows "Detected" and is highlighted (red for fire, yellow for gas, blue for water). Thresholds: flame voltage &lt; 2.0 V = fire; gas voltage ≥ 0.8 V = gas; water voltage ≥ 1.0 V = water.
- **Alert LEDs toggle:** When enabled, the server includes an `led` object in the **response body** of every POST to `/api/data`. The device can read this and set the board NeoPixel (V2=red, V3=green, V4=blue, V15=brightness): **red** for fire, **yellow** for gas, **blue** at increasing intensity for water level. If the device firmware parses the response (see below), the physical LED will reflect these alerts. Toggle off to stop sending LED commands (device can then use Blynk or default behaviour).
- **Cards:** One card per sensor quantity (temperature, humidity, soil, water, flame, light, gas, pressure, motion, sound, GPS, servo). Missing data appears as "—".
- **Map:** GPS position and trail when valid latitude/longitude are present.
- **Charts:** Time-series for temperature, humidity, light, soil, water, flame, gas, pressure, sound.

No login is required. The page uses a dark theme and is responsive.

### Making the board LED respond to alerts

The dashboard **does not** push to the device directly. When "Alert LEDs" is on, the server **adds** an `led` object to the JSON **response** of each POST to `/api/data`. The device must **read the response body** and apply the values to the NeoPixel (same as Blynk V2, V3, V4, V15).

In your Arduino sketch, after `HTTPClient::POST()` to the dashboard:

1. Read the response with `getString()` or `getStream()`.
2. Parse the JSON (e.g. ArduinoJson). If the root object has a key `"led"` with `v2`, `v3`, `v4`, `v15`, set your NeoPixel from those values (same as in `BLYNK_WRITE(V2)` etc.) and skip the normal env-LED logic until the next POST.
3. If there is no `"led"` key or "Alert LEDs" is off, the server omits `led`; the device can keep the previous LED state or revert to Blynk/default.

Example response when fire is detected and Alert LEDs is on:

```json
{ "ok": true, "updated_at": "2026-03-15T12:00:00.000Z", "led": { "v2": 255, "v3": 0, "v4": 0, "v15": 255 } }
```

When no alert is active but the toggle is on, the response includes `"led": { "v2": 0, "v3": 0, "v4": 0, "v15": 0 }` to turn the LED off.

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

Data is stored **in memory** (and persisted to `data/` every 10 s). The **Alert LEDs** preference is in-memory only and resets to off on server restart.

---

**Reminder:** If you maintain a Google Doc or report that describes the dashboard (e.g. Final Project report), update it to mention the new **Conditions** widgets, **Alerts** (fire/gas/water), and **Alert LEDs** toggle with response-body LED commands for the board NeoPixel.

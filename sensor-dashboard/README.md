# Sensor Dashboard

> **Last updated:** 2026-03-15. Reflects current multi-sensor config: soil, water, flame, light, gas (MQ2), pressure (BMP180), PIR motion, GPS, sound, temp/humidity.

Standalone web app that receives and displays environmental sensor data from an ESP8266 (e.g. SparkFun Blynk Board) **outside of Blynk**. It provides an HTTP ingest API and a single-page dashboard with live values and optional time-series charts.

**User guide:** See [WEBSITE_GUIDE.md](WEBSITE_GUIDE.md) for how to run the dashboard, connect the device, and troubleshoot. This file focuses on the API and technical details.

## Run the server

```bash
cd /home/om/code/blynk/sensor-dashboard
npm install
npm start
```

- **Dashboard:** open [http://localhost:3000](http://localhost:3000) in a browser (port **3000** by default).
- Override port: `PORT=8080 npm start`.

## Ingest API (for Arduino/ESP8266)

Send sensor readings via HTTP POST. The device can send the same logical data you currently push to Blynk virtual pins.

### Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `http://<host>:3000/api/data` | Ingest sensor JSON (preferred) |
| POST | `http://<host>:3000/ingest` | Alias for `/api/data` |
| POST / GET | `http://<host>:3000/api/webhook/blynk` | Blynk webhook: receive datastream updates from Blynk (see [Blynk webhooks](#blynk-webhooks)) |
| GET | `http://<host>:3000/api/data` | Current values (used by dashboard) |
| GET | `http://<host>:3000/api/history?limit=100` | Recent history for charts |

### POST body format (JSON)

Use **snake_case** or **camelCase**. All fields are optional; send only what your hardware provides.

| Field | Type | Description |
|-------|------|-------------|
| `temperature_c` / `temperatureC` | number | Temperature °C (e.g. Si7021) |
| `temperature_f` / `temperatureF` | number | Temperature °F |
| `humidity` | number | Humidity % |
| `temperature_c_2` / `temperatureC2` | number | Second sensor temp °C |
| `temperature_f_2` / `temperatureF2` | number | Second sensor temp °F |
| `humidity_2` / `humidity2` | number | Second sensor humidity % |
| `sound_adc_raw` / `soundAdcRaw` | number | Sound ADC raw 0–1023 |
| `sound_adc_voltage` / `soundAdcVoltage` | number | Sound ADC voltage 0–3.3 V |
| `sound_ads1115_voltage` / `soundAds1115Voltage` | number | Sound (ADS1115 channel) voltage V |
| `light_voltage` / `lightVoltage` | number | Light voltage 0–3.3 V (photocell via ADS1115) |
| `door_state` / `doorState` | number | 0 = Open, 1 = Closed |
| `soil_moisture` / `soilMoisture` | number | Soil moisture 0–100 % |
| `soil_voltage` / `soilVoltage` | number | Soil raw voltage (ADS1115 #1 A0) |
| `water_voltage` / `waterVoltage` | number | Water level voltage (ADS1115 #1 A1) |
| `flame_voltage` / `flameVoltage` | number | Flame sensor voltage (ADS1115 #1 A2) |
| `gas_voltage` / `gasVoltage` | number | MQ2 gas voltage (ADS1115 #2 A0) |
| `pressure_hpa` / `pressureHpa` | number | Barometric pressure (hPa, BMP180) |
| `motion_detected` / `motionDetected` | number | PIR motion (0/1) |
| `gps_latitude` / `gpsLatitude` | number | Latitude |
| `gps_longitude` / `gpsLongitude` | number | Longitude |
| `gps_altitude` / `gpsAltitude` | number | Altitude (m) |
| `gps_speed` / `gpsSpeed` | number | Speed (m/s) |
| `gps_satellites` / `gpsSatellites` | number | Satellites (SIV) |
| `servo_angle` / `servoAngle` | number | Servo angle (optional) |
| `rgb_state` / `rgbState` | string/number | RGB state (optional) |

### Example POST (curl)

```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature_c": 22.5,
    "temperature_f": 72.5,
    "humidity": 45.2,
    "light_voltage": 1.8,
    "sound_adc_raw": 512,
    "sound_adc_voltage": 1.65,
    "soil_voltage": 2.1,
    "soil_moisture": 60,
    "water_voltage": 0.5,
    "flame_voltage": 3.1,
    "gas_voltage": 0.3,
    "pressure_hpa": 1013.25,
    "motion_detected": 0,
    "gps_latitude": 33.6405,
    "gps_longitude": -117.8443,
    "gps_satellites": 12
  }'
```

### Example POST (Arduino/ESP8266)

Use `HTTPClient` (ESP8266/ESP32) or `WiFiClient` + manual HTTP to POST JSON:

```cpp
// Example: POST one reading (expand with your actual sensor reads)
String json = "{\"temperature_c\":" + String(tempC) + ",\"humidity\":" + String(humidity) + "}";
http.begin("http://YOUR_SERVER_IP:3000/api/data");
http.addHeader("Content-Type", "application/json");
int code = http.POST(json);
http.end();
```

Replace `YOUR_SERVER_IP` with the machine running this server (same LAN or public IP if exposed).

**Dual output (Blynk + this dashboard):** The Arduino sketch can send to both Blynk and this server. In the sketch, set `DASHBOARD_HOST` to your PC's LAN IP (e.g. `192.168.1.100`). The device POSTs every 5 s regardless of Blynk's V50 switch, so you can test both and fall back if one hits a limit or fails.

### Blynk webhooks

You can also feed the dashboard **from Blynk** when the device updates virtual pins. Blynk fires a webhook on "Device Datastream Update" (or "Template Datastream Update"); the dashboard accepts that webhook and updates the same in-memory state as `/api/data`.

1. **Expose the webhook URL**  
   The dashboard must be reachable by Blynk’s servers. Use a public URL (e.g. ngrok: `ngrok http 3000`) or a server with a public IP. Example URL: `https://your-host.example.com/api/webhook/blynk`

2. **In Blynk.Console**  
   - **Settings → Developers → Create New Webhook**  
   - **Trigger:** Device Datastream Update (or Template Datastream Update)  
   - **Template / Device:** your Environmental Field Logger template (or device)  
   - **Datastream:** choose one (e.g. GPS Latitude, pin V30). Create one webhook per datastream, or use one webhook and Custom JSON to send multiple fields.  
   - **Request type:** POST (or GET)  
   - **Webhook URL:** `https://your-host.example.com/api/webhook/blynk`  
   - **Content type:** Web Form (or Custom JSON).  
   - **Form fields (Web Form):**  
     - Key: `device_pin` → Value: `{device_pin}`  
     - Key: `device_pinValue` → Value: `{device_pinValue}`  
   - If you use an API key, add an HTTP header: `X-API-Key` = your key (or send `api_key` in the body/query).

3. **Pin mapping**  
   The server maps Blynk virtual pins to dashboard keys:
   - V5→temperature_f, V6→temperature_c, V7→humidity
   - V20→soil_voltage, V21→water_voltage, V22→light_voltage, V23→gas_voltage
   - V26→soil_moisture
   - V30→gps_latitude, V31→gps_longitude, V32→gps_altitude, V33→gps_speed, V34→gps_satellites
   - V35→pressure_hpa, V36→motion_detected
   - V25→door_state (disabled in sketch)
   
   See `server.js` `BLYNK_PIN_MAP` for the full list.

4. **Test**  
   Use **Test Webhook** in Blynk. Or from a terminal:  
   `curl -X POST http://localhost:3000/api/webhook/blynk -H "Content-Type: application/x-www-form-urlencoded" -d "device_pin=30&device_pinValue=37.7749"`

If the body contains `device_pin` and `device_pinValue`, the server updates that one field. If the body contains normal sensor fields (e.g. `gps_latitude`, `temperature_c`), it is merged like a normal `/api/data` POST.

### Optional API key

To require an API key on POST (e.g. when the server is reachable from the internet):

```bash
SENSOR_API_KEY=your-secret-key npm start
```

Then send the key in the request:

- Header: `X-API-Key: your-secret-key`
- Or query: `POST /api/data?api_key=your-secret-key`

The same key is checked on `/api/webhook/blynk` (header, query, or body `api_key`). GET `/api/data` and `/api/history` remain public so the dashboard can poll without auth.

## Dashboard

- **Live values:** cards for all supported sensors (temp, humidity, soil, water, flame, light, gas, pressure, motion, sound, GPS, servo); missing data shown as "—".
- **GPS map:** when valid `gps_latitude` and `gps_longitude` are present, a map shows current position and a trail of recent positions from history.
- **History chart:** temperature (°C), light (V), and other numeric fields over the last ~100 ingested points (if any).
- **Polling:** dashboard refreshes every 3 seconds.

No login is required to view the dashboard unless you add your own auth in front of the app.

## Tech stack

- **Backend:** Node.js + Express (single port for API + static files).
- **Frontend:** plain HTML, CSS, and JavaScript (no build step).
- **Storage:** in-memory; last value plus a rolling window of 100 points for the chart. Restart clears data.

## Project layout

```
sensor-dashboard/
├── package.json
├── server.js          # Express server: /api/data, /api/webhook/blynk, /api/history, static files
├── public/
│   ├── index.html     # Dashboard page
│   └── app.js         # Fetches /api/data and /api/history, renders cards and chart
└── README.md          # This file
```

The Arduino/ESP8266 sketch is not in this repo; only the expected JSON format for POST is documented above.

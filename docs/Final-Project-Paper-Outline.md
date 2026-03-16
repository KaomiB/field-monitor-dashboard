# Environmental Field Logger  -  Final Report Outline (INF 148, Option 3)

Use this outline for the 5–10 page written report. Content below is drawn from **Final_Presentation_Field_Logger1.pdf** and **video_script_and_slide_updates.md** (script + slide text). Replace any remaining `[PLACEHOLDER: ...]` as you finalize.

---

## 1. Title and abstract

- **Title:** Portable Environmental Field Logger: Dual-Output IoT Sensing with Blynk and a Local Dashboard (Option 3: Programming Guru).
- **Abstract (3–5 sentences):** Commercial environmental loggers measure two to five variables and cost $150 to $400. I built a portable one for about $80 with 10 input channels and GPS, using a SparkFun Blynk Board (ESP8266). It sends data to a web dashboard I deployed and, optionally, to Blynk Cloud. Because the dashboard stores readings as JSON on your own server, your field data stays under your control instead of living on a vendor's cloud. Sensors connect over I²C, so you can add or swap them without redesigning anything.

---

## 2. Introduction / need

- **Why environmental monitoring matters:** Characterizing a habitat or a field site well means measuring several things at once - air temperature, humidity, soil conditions, light, sound, gas levels - but the instruments that can do this typically cost $150–400 and still only cover two or three variables (Kumar et al., 2020; Chowdhury et al., 2024). That puts multi-variable monitoring out of reach for smaller research groups, community organizations, and schools. IoT sensor networks have started to close this gap by offering the spatial and temporal resolution needed to supplement traditional survey methods (Sathyamoorthy et al., 2024), but most off-the-shelf options remain either too expensive or too limited.
- **Who benefits (from PDF + script):**
  - **Field researchers, Surveyors**  -  Deploy at study sites for GPS-tagged, multi-variable data without expensive equipment.
  - **Conservationists**  -  Monitor habitat conditions along creeks, wetlands, forests; track changes over time across locations.
  - **Citizen scientists**  -  Community members contribute environmental data from gardens, parks, neighborhoods; participatory monitoring is constrained by instrument cost and technical complexity (Hameed et al., 2022).
  - **Students & educators**  -  Open-source platform for hands-on learning in ecology, environmental science, and engineering; EPA Air Sensor Toolbox supports citizen-science air quality projects (Hameed et al., 2022; EPA Air Sensor Toolbox).
- **What this project addresses:** Low-cost, local + cloud dual output; open-source, extensible via I2C; educational and research-ready.

---

## 3. Competitors and related work

- **Existing solutions (from PDF slide):**
  - **HOBO MX2301A**  -  $200+; 2 variables (temp, humidity); no GPS, no cloud.
  - **Kestrel DROP D3**  -  $150+; 3 variables (adds barometric pressure); no GPS, no soil, no dashboard.
  - **Davis Vantage Vue**  -  $400+; 5 variables; stationary home weather station, not portable.
- **How ours differs:** Our field logger: ~$80; 10 data streams/input channels; GPS tagging, cloud dashboard (Blynk), real-time alerts, soil moisture, motion detection, open source, portable, expandable (I2C + ESP32). We also built a **custom local website** as a **free alternative to Blynk infrastructure** - no message caps, data stays on your machine - so users can choose cloud (Blynk) or self-hosted. Higher sensor multiplicity, geospatial tagging, and real-time telemetry at a fraction of the cost; fully open-source and extensible (Kumar et al., 2020; Roostaei et al., 2023). I2C bus architecture allows adding sensors without redesigning the system.

---

## 4. System design

- **4.1 Hardware overview:** SparkFun Blynk Board (ESP8266 WiFi MCU); sensors: DHT11 (temp + humidity, GPIO4), BMP180 (barometric pressure, I2C 0x77), ADS1115 (4-ch I2C ADC), Qwiic Soil Moisture (I2C 0x28), SAM-M8Q GPS (I2C Qwiic 0x42), Photocell (ADS1115 Ch.0), Sound Detector (ADS1115 Ch.1), HC-SR501 PIR (motion, GPIO12); outputs: RGB LEDs, servo, buzzer, button. Pin budget: I2C shared bus (BMP180 + Soil + GPS + ADS1115); ADS1115 channels (Photocell + Sound); 4 GPIO (DHT11, PIR, Servo, LEDs).
- **4.2 Sketches/diagrams:** [PLACEHOLDER: insert labeled device sketches - multiple views, components labeled; narrative for each. Use PDF “SYSTEM ARCHITECTURE” and “COMPONENTS & INTEGRATION” slides as source.]
- **4.3 Data flow:** Blynk (when V50 ON) + HTTP POST to local dashboard every 5 s; virtual pin map per Final_Project_Overview.
- **4.4 Modular design (from script Slide 5B):** I2C shared bus is the backbone - two-wire protocol, daisy-chain sensors (SDA/SCL), each with unique address. Qwiic connectors allow plug-and-play. Core platform: ESP8266, I2C bus, ADS1115, Blynk Cloud, power. Optional modules: swap DHT11→DHT22, BMP180→BME280, photocell→TSL2561, etc. Every sensor is an independent module; add, remove, or swap without redesigning.
- **4.5 Sensor module menu (from script Slide 5C):** Core modules (DHT11, BMP180, SAM-M8Q, ADS1115) define baseline; optional modules (photocell, sound, soil moisture, PIR) let users tailor to research question - ecology, agriculture, urban monitoring, education. Table: Module | Measures | Connection | Swap alternative (e.g. DHT22, BME280, TSL2561, RCWL-0516 radar).

---

## 5. Access and interface

- **How the device is accessed:** Blynk app (mobile/web) - gauges (temp °C/°F, humidity %, pressure), SuperChart (light & sound over time), soil moisture %, motion LED, GPS map, threshold notifications; **local dashboard** at http://&lt;host&gt;:3000 - a custom website we built as a **free alternative to Blynk infrastructure** (no cloud message limits, data stays on your machine, same sensor data via HTTP POST). Physical outputs: servo gauge (0°–180° composite site health), LEDs (green/yellow/red), passive buzzer for threshold alerts.
- **Field deployment (from PDF):** Carry station to field site → power on, tether to phone hotspot → station acquires GPS fix and begins sensing → data streams to Blynk live → move to next site, compare; alerts fire when thresholds crossed.
- **Interface sketch/screenshot:** [PLACEHOLDER: add dashboard screenshot and/or Blynk app view; label components and uses.]

---

## 6. Security and data

- **Unauthorized access:** All data in transit to Blynk encrypted (TLS/SSL). Blynk auth tokens - unique per device; only authenticated devices connect. WPA2 WiFi. LAN-only local dashboard, no open port to internet; optional API key. No PII collected.
- **Data collected, why, and how (from PDF + script):** Temperature & humidity (site conditions, DHT11→GPIO); barometric pressure (weather, altitude, BMP180→I2C); light intensity (daylight, canopy, Photocell→ADS1115); noise levels (ambient sound, Sound Det.→ADS1115); soil moisture (ground conditions, Qwiic→I2C); motion events (PIR→GPIO); GPS (tag readings, SAM-M8Q→I2C). Operational: WiFi credentials and Blynk auth token stored in flash (local), never transmitted beyond initial handshake.
- **How collected/transmitted:** Sensors → ESP8266 (wired) → Blynk Cloud (WiFi + TLS) → app (HTTPS). Optional: POST to local Node server.
- **Where stored:** Blynk servers with server-side access control, storage encryption, monitoring. Local dashboard: in-memory/history; [PLACEHOLDER: whether persisted to disk.]
- **Shared or not:** Data stored on Blynk, accessible only to authenticated user. No data sold or shared. Per-device access control; data sharing opt-in for collaborative research (Hameed et al., 2022).

---

## 7. Implementation notes (Option 3)

- **Firmware (from script Slide 8 / 8B):** Custom Arduino code, Blynk library on ESP8266. **setup():** Blynk.begin() (WiFi + TLS), Wire.begin(), I2C scan (e.g. 0x40, 0x42, 0x48, 0x77), init sensors (Si7021, ADS1115, DHT, GPS), register BlynkTimer callbacks (pushTempHumidity, pushAdc, pushAds1115, pushDht11, pushGps, updateEnvLed) at 2–3 s intervals. **loop():** Blynk.run(), timer.run(), button poll; no delay() - fully non-blocking, event-driven. Each callback: read sensor → validate (NaN, range) → Blynk.virtualWrite() → Serial log; sentinel -999 for DHT NaN so app shows error state.
- **Service flow (from PDF):** (1) Sensors read → (2) Board processes (ESP8266 + Blynk) → (3) Blynk.virtualWrite() to cloud via WiFi + TLS → (4) App receives, live widgets + push alerts. Edge computing on ESP8266 reduces cloud dependency (Roostaei et al., 2023; Arya et al., 2024).
- **Virtual pin map (from script):** V5–V7 Si7021; V0/V8 ADC; V20/V21 ADS1115 light/sound; V22/V23 DHT11; V30–V34 GPS; V2–V4/V15 RGB; V24/V17 servo.
- **Dashboard:** Node.js, Express, static front-end; /api/data, /api/history.
- **Data export (from script Slide 8C):** Blynk SuperChart CSV export; email widget + push for thresholds; IFTTT webhook (e.g. Twitter); Zapier/IFTTT → Google Sheets; ESP32 bridge → HTTP POST to custom API; optional SD card for offline logging.
- [PLACEHOLDER: any difficulties and how you solved them, e.g. ADS1115 I2C, GPS fix.]

---

## 8. Group contribution (if applicable)

- [PLACEHOLDER: who did hardware/wiring, firmware, dashboard, report, video. Video: Kaomi Booker, final project for INF 148, ~8–10 min presentation.]

---

## 9. Conclusion and future work

- **Summary (from script closing):** Modular sensors, GPS-tagged, cloud-connected, exportable to email or Twitter, under $80, fully open source.
- [PLACEHOLDER: 1–2 sentences; optional: more sensors, persistence, alerts, opt-in shared dashboards for collaborative research.]

---

## 10. References (from presentation + script)

1. Kumar et al. (2020). "Advances in Smart Environment Monitoring Systems Using IoT and Sensors." *Sensors*, 20(11), 3113.
2. Chowdhury et al. (2024). "Advancement of Environmental Monitoring System Using IoT and Sensor." *AIMS Environmental Science*, 9(6), 771-800.
3. Sathyamoorthy et al. (2024). "Advances and Challenges in IoT Sensors Data Handling and Processing in Environmental Monitoring Networks." *HAFED POLY Journal*, 5(2), 40-60.
4. Arya et al. (2024). "Artificial Intelligence and IoT Driven Technologies for Environmental Pollution Monitoring and Management." *Frontiers in Environmental Science*, 12, 1336088.
5. Hameed et al. (2022). "Design and Development of an Open-Source Framework for Citizen-Centric Environmental Monitoring and Data Analysis." *Scientific Reports*, 12, 14416.
6. Roostaei et al. (2023). "IoT-based Edge Computing for Improved Environmental Monitoring." *Sustainable Computing*, 38, 100870.
7. EPA Air Sensor Toolbox  -  https://www.epa.gov/air-sensor-toolbox  

[PLACEHOLDER: add course readings, Blynk/Instructure docs if required.]

---

## Figures / tables (optional list)

- **Wiring/circuit diagrams:** See `code/blynk/Paper_Wiring_Diagrams.md` (Mermaid + ASCII). Figures 1–5: system architecture, I2C topology, photocell divider, pin assignment, data flow. Render Mermaid at mermaid.live for PNG/SVG.
- **Figure 1:** System architecture  -  Paper_Wiring_Diagrams.md. **Figure 2:** I2C bus. **Figure 3:** Photocell circuit. **Figure 4:** Pin/signal table. **Figure 5:** Data flow.
- **Figure 6:** [PLACEHOLDER: Breadboard layout  -  Documents/2025/Breadboard.md]
- **Figure 7:** [PLACEHOLDER: Dashboard screenshot]
- **Figure 8:** [PLACEHOLDER: Blynk app view or device photo]
- **Table 1:** Competitors comparison (HOBO, Kestrel, Davis vs Our Field Logger)  -  from PDF “COMPETITORS” slide.
- **Table 2:** Sensor module menu / customization schematic  -  from script Slide 5C.
- **Table 3:** Virtual pin map  -  from script Slide 8B.

---

## Appendix: Presentation script (key narrative points for report)

Condensed from **video_script_and_slide_updates.md** for alignment with written report:

- **Social need:** Multi-variable sensing is essential; professional instrumentation is expensive and measures one or two variables; gaps in ecological monitoring, citizen science (cost/complexity), and education (affordable hackable platforms).
- **Competitors:** HOBO/Kestrel/Davis comparison; our logger tracks seven variables + GPS, streams to cloud, under $80; differentiator is sensor multiplicity and I2C extensibility (Kumar et al., Roostaei et al.).
- **System architecture:** Sensors → Blynk Board (ESP8266); digital: DHT11 (GPIO4), PIR (GPIO12); I2C: BMP180, soil moisture, SAM-M8Q, ADS1115; photocell and sound via ADS1115 Ch.0/Ch.1; data over WiFi/TLS to Blynk Cloud.
- **Modular design:** I2C backbone, Qwiic plug-and-play; core vs optional modules; swap sensors without redesign (e.g. DHT22, BME280, TSL2561, RCWL-0516).
- **How it works:** Four steps - sensors read → board processes → Blynk.virtualWrite() → app receives; custom firmware, BlynkTimer callbacks, non-blocking loop.
- **Security:** Nine data types (seven environmental, two operational); TLS, auth tokens, WPA2, no PII; Blynk cloud access control; opt-in sharing for research (Hameed et al.).

Replace remaining placeholders in place as you fill them in.

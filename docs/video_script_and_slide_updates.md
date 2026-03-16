# Final Video Presentation — Script & Slide Updates

## Sources Used

1. Chowdhury et al. (2024). "Advancement of Environmental Monitoring System Using IoT and Sensor." *AIMS Environmental Science*, 9(6), 771-800.
2. Sathyamoorthy et al. (2024). "Advances and Challenges in IoT Sensors Data Handling and Processing in Environmental Monitoring Networks." *HAFED POLY Journal*, 5(2), 40-60.
3. Arya et al. (2024). "Artificial Intelligence and IoT Driven Technologies for Environmental Pollution Monitoring and Management." *Frontiers in Environmental Science*, 12, 1336088.
4. Hameed et al. (2022). "Design and Development of an Open-Source Framework for Citizen-Centric Environmental Monitoring and Data Analysis." *Scientific Reports*, 12, 14416.
5. Roostaei et al. (2023). "IoT-based Edge Computing for Improved Environmental Monitoring." *Sustainable Computing*, 38, 100870.
6. Kumar et al. (2020). "Advances in Smart Environment Monitoring Systems Using IoT and Sensors." *Sensors*, 20(11), 3113.
7. EPA Air Sensor Toolbox — https://www.epa.gov/air-sensor-toolbox

---

## Slide Text Updates (swap into existing deck)

### Slide 2 — SOCIAL NEED

**Title:** SOCIAL NEED

**Subtitle text (updated):**
"Multi-variable environmental sensing is foundational to ecological assessment, habitat conservation, and public health — yet field instrumentation remains cost-prohibitive and functionally limited (Kumar et al., 2020; Chowdhury et al., 2024)."

**Card 1 — Ecological Monitoring:**
"Habitat assessment requires concurrent measurement of atmospheric, terrestrial, and biotic variables. IoT sensor networks provide high spatial and temporal resolution data that fill gaps in traditional survey methods (Sathyamoorthy et al., 2024)."

**Card 2 — Citizen Science:**
"Participatory monitoring is constrained by instrument cost and technical complexity, limiting community-driven data collection in underserved ecosystems (Hameed et al., 2022)."

**Card 3 — Research & Education:**
"Open-source, low-cost sensor platforms lower the barrier to reproducible field research and applied environmental informatics education (Hameed et al., 2022; EPA Air Sensor Toolbox)."

**Sources line:**
"Kumar et al., Sensors 2020; Chowdhury et al., AIMS Env. Sci. 2024; Sathyamoorthy et al., HAFED POLY J. 2024; Hameed et al., Scientific Reports 2022; EPA Air Sensor Toolbox"

### Slide 4 — COMPETITORS

**Bottom text (updated):**
"Higher sensor multiplicity, geospatial tagging, and real-time cloud telemetry — at a fifth of the cost, fully open-source and extensible."

### Slide 8 — HOW IT WORKS

**Top text (updated):**
"Custom firmware interfaces with the Blynk Cloud API over authenticated WiFi, enabling bidirectional device-to-cloud communication (Option 3: Programming Guru)."

### Slide 9 — SECURITY

**Data sharing note (updated):**
"Per-device access control via Blynk auth tokens. No PII collected or transmitted. Data sharing is opt-in, supporting collaborative research configurations."

---

## Video Script (~9 minutes, with new slides)

### [Slide 1 — Title] ~15 sec

"Hi, I'm Kaomi Booker. This is my final project for INF 148 — a Portable Environmental Field Logger, built under Option 3, Programming Guru."

---

### [Slide 2 — Social Need] ~1 min 45 sec

"Environmental monitoring depends on collecting multiple variables concurrently — temperature, humidity, pressure, light, sound, soil moisture. You can't characterize a habitat from a single data point. As Kumar et al. describe in their 2020 review in *Sensors*, smart environment monitoring has evolved rapidly with IoT, but the field still faces a core problem: professional instrumentation is expensive, proprietary, and typically measures only one or two variables per device.

This creates three gaps.

First, ecological monitoring. Assessing habitat health requires simultaneous atmospheric and terrestrial measurements. Sathyamoorthy et al., writing in 2024, found that IoT sensor networks can provide the spatial and temporal resolution needed to supplement traditional survey methods — but most deployed systems are custom-built by funded research labs, not accessible to smaller organizations.

Second, citizen science. Hameed et al. published a framework in *Scientific Reports* in 2022 showing that technological complexity and cost are the primary barriers preventing communities from participating in environmental data collection. Their open-source CoSense platform demonstrated that low-cost IoT devices can match the data quality of reference stations — but the tools need to be simpler and cheaper to reach broader adoption.

Third, education. The EPA's Air Sensor Toolbox now provides guidance for citizen science air quality projects, signaling institutional recognition that non-professionals can contribute meaningful environmental data. But students and educators still need affordable, hackable platforms to learn on."

---

### [Slide 3 — Who Benefits] ~30 sec

"The primary user groups are field researchers conducting longitudinal ecological studies across distributed sites, conservation practitioners monitoring riparian zones and wetlands, citizen science networks contributing geotagged observations to community databases, and STEM educators teaching applied IoT and environmental informatics."

---

### [Slide 4 — Competitors] ~60 sec

"Here's the competitive landscape. The HOBO MX2301A costs over $200 and measures only temperature and humidity — two variables, no GPS, no cloud. The Kestrel DROP D3 adds barometric pressure for $150, but still no GPS, no soil, no motion, no dashboard. The Davis Vantage Vue covers five variables for over $400, but it's a stationary home weather station, not designed for portable field deployment.

My field logger tracks seven variables plus GPS, streams to a cloud dashboard in real time, and costs under $80 total. The key differentiator isn't just price — it's sensor multiplicity and extensibility. The I2C bus architecture means you can add new sensors without redesigning the system, and the open-source firmware means any researcher can modify it for their specific use case. As Kumar et al. and Roostaei et al. both emphasize, this kind of open, modular design is what's needed to scale environmental IoT beyond funded labs."

---

### [Slide 5 — System Architecture] ~45 sec

"This diagram shows the full data flow. On the left, sensors feed into the SparkFun Blynk Board — an ESP8266 WiFi microcontroller. Two sensors connect via digital GPIO: the DHT11 on GPIO4 and the HC-SR501 PIR on GPIO12. Four devices share the I2C bus: BMP180, soil moisture, SAM-M8Q GPS, and the ADS1115 — a 4-channel ADC expander. The ADS1115 is a key design decision: the ESP8266 only has one native analog pin, so the ADS1115 gives us four analog channels over I2C. The photocell and sound detector connect through ADS1115 channels 0 and 1.
  

Data flows over WiFi with TLS encryption to Blynk Cloud, and the mobile app renders live widgets — gauges, charts, GPS map, and push notifications."

---

### [Slide 5B — Modular Design] ~40 sec

"Now, the key architectural decision behind all of this is modularity. The I2C shared bus is the backbone — it's a two-wire protocol that lets you daisy-chain sensors on the same SDA and SCL lines, each with a unique address. The Qwiic connectors on the SparkFun boards make this plug-and-play — no soldering, just snap a cable.

On the left you see the core platform: the ESP8266 controller, the I2C bus, the ADS1115, Blynk Cloud, and power. On the right, the optional modules. If you don't need soil moisture, unplug it. If you want higher-accuracy temperature, swap the DHT11 for a DHT22 — same code interface, just change one constant. Every sensor is an independent module. Add, remove, or swap without redesigning the system."

---

### [Slide 5C — Sensor Module Menu] ~30 sec

"This table is the customization schematic. Think of it as a menu. The core modules give you a functional station out of the box. The optional modules let you specialize — a soil scientist keeps the soil sensor and drops the sound detector, an urban noise researcher does the opposite, a wildlife biologist upgrades the PIR to a microwave radar that works through a weatherproof enclosure. You're not locked into a fixed configuration — the I2C bus and the firmware's modular init sequence support any combination."

---

### [Slide 6 — Components] ~30 sec

"Here's every component with its interface labeled. Seven sensors on the left, outputs and hardware on the right. The pin budget at the bottom shows how everything fits: I2C carries four devices on two shared wires, ADS1115 handles both analog sensors, and four GPIO pins cover the rest. The native ADC pin is freed up entirely — available as a battery monitor or spare input."

---

### [Slide 7 — User Interface] ~40 sec

"The primary interface is the Blynk mobile app — gauge widgets for temperature, humidity, and pressure, a SuperChart for light and sound over time, soil moisture percentage, motion detection LED, and a GPS map. Push notifications fire when configurable thresholds are crossed.

In the field without a phone, the servo gauge sweeps 0 to 180 degrees showing a composite site health score, LEDs show green, yellow, or red, and the buzzer sounds for alerts. Deployment is straightforward: carry the station, power on, tether to a phone hotspot, and data streams live. Move to the next site and compare."

---

### [Slide 8 — How It Works / Service] ~30 sec

"The firmware is custom Arduino code using the Blynk library on the ESP8266. The service flow is four steps: sensors read the environment, the board processes readings, the firmware calls Blynk.virtualWrite() to push data to the Blynk Cloud API over TLS-encrypted WiFi, and the app receives and displays it in real time. As Roostaei et al. describe in their 2023 paper on IoT edge computing, processing data locally on the microcontroller before transmitting reduces cloud dependency and supports offline-first design."

---

### [Slide 8B — Firmware Architecture / Code Diagram] ~45 sec

"Here's the firmware architecture. The setup function runs once at boot — it connects WiFi with Blynk authentication over TLS, initializes the I2C bus and scans for connected sensors, then registers a BlynkTimer callback for each sensor at 2 to 3 second intervals.

The loop function is intentionally minimal — Blynk.run() to maintain the cloud connection, timer.run() to fire the scheduled callbacks, and a button poll. There are zero delay() calls in the entire firmware — everything is non-blocking and event-driven.

Each push function reads the sensor, validates the data with NaN and range checks, writes to the assigned virtual pins, and logs to Serial for debugging. If the DHT11 returns NaN, the firmware pushes a sentinel value of negative 999 so the app can display an error state rather than stale data. The virtual pin map at the bottom shows exactly which data flows where — V5 through V7 are Si7021, V20 and V21 are ADS1115 light and sound, V30 through V34 carry all five GPS fields."

---

### [Slide 8C — Data Export & Sharing] ~30 sec

"Data export is where modularity extends beyond hardware into the software layer. Blynk SuperChart has built-in CSV export — download your entire dataset for Excel, R, or Python. The email widget sends automatic alerts when thresholds are crossed. For social sharing, IFTTT webhooks can auto-tweet live conditions from a field site, or Zapier can log every reading to a Google Sheet. For full control, the ESP32 bridge can HTTP POST to any custom API endpoint. And for remote sites with no WiFi, an optional SD card module logs everything locally."

---

### [Slide 9 — Security] ~50 sec

"Security is organized around two questions: what data do we collect, and how do we protect it.

We collect nine types of information. Seven are environmental sensor readings — temperature, humidity, pressure, light, noise, soil moisture, and motion — each necessary to characterize site conditions. The remaining two are operational: WiFi credentials and a Blynk authentication token, both stored locally in flash memory and never transmitted beyond the initial handshake.

All data in transit is encrypted with TLS/SSL. Each device authenticates with a unique Blynk auth token — unauthorized devices cannot connect. The local WiFi connection uses WPA2. No personally identifiable information is collected at any point.

Data is stored on Blynk's cloud infrastructure with per-device access control. No data is sold or shared. As Hameed et al. recommend in their 2022 framework, a future iteration could support opt-in shared dashboards for collaborative research teams comparing data across sites."

---

### [Slide 10 — Thank You] ~15 sec

"Modular sensors, GPS-tagged, cloud-connected, exportable to email or Twitter, under eighty dollars, fully open source. Thank you."

---

## Timing Summary (updated with new slides)

| Slide | Topic | Time |
|-------|-------|------|
| 1 | Title | 0:15 |
| 2 | Social Need (with citations) | 1:45 |
| 3 | Who Benefits | 0:30 |
| 4 | Competitors (with citations) | 1:00 |
| 5 | System Architecture | 0:45 |
| **5B** | **Modular Design — Customize Your Station** | **0:40** |
| **5C** | **Sensor Module Menu / Customization Schematic** | **0:30** |
| 6 | Components & Integration | 0:30 |
| 7 | UI & Interaction | 0:40 |
| 8 | How It Works (with citations) | 0:30 |
| **8B** | **Firmware Architecture / Code Diagram** | **0:45** |
| **8C** | **Data Export & Sharing** | **0:30** |
| 9 | Security (with citations) | 0:50 |
| 10 | Thank You | 0:15 |
| **Total** | | **~9:05** |

This is within the 8–10 minute window. If running over, the easiest cuts are:
- Slide 4 (Competitors): Point at the table instead of reading each competitor (~save 20 sec)
- Slide 5C (Module Menu): Say "as you can see in the table" and move on (~save 15 sec)
- Slide 8B (Code Diagram): Skip the sentinel value detail (~save 10 sec)

---

## NEW SLIDES — Modularity, Code Diagram, Data Export & Citations

### NEW Slide 5B — MODULAR DESIGN (insert after System Architecture)

**Title:** MODULAR DESIGN — Customize Your Station

**Subtitle:** Plug-and-play I2C bus architecture lets users build exactly the station they need

**Left Column — CORE PLATFORM (Required):**
- **SparkFun Blynk Board (ESP8266)** — WiFi controller, runs custom Arduino firmware
- **I2C Shared Bus** — 2-wire backbone (SDA/SCL) connecting all smart sensors
- **ADS1115 ADC Expander** — Converts ESP8266's single ADC into 4 analog channels
- **Blynk Cloud** — Real-time dashboard, alerts, data storage
- **Power** — USB or portable battery pack

**Right Column — OPTIONAL MODULES (Swap In/Out):**
- **DHT11** → Swap to DHT22 for ±0.5°C accuracy
- **BMP180** → Swap to BME280 for 3-in-1 (temp + humid + pressure)
- **Photocell** → Swap to TSL2561 digital lux sensor (I2C, no ADC needed)
- **Sound Detector** → Swap to MAX4466 amplified mic
- **Soil Moisture** → Swap to capacitive sensor (no corrosion over time)
- **PIR Motion** → Swap to RCWL-0516 microwave radar (works through enclosures)
- **ESP32 Bridge** → Add Bluetooth for offline field sync to phone

**Bottom text:**
"Every sensor is an independent module on the I2C bus or a GPIO pin. Add, remove, or swap sensors without redesigning the system — just update the firmware init block."

**Narrative (for video):**
"The key architectural decision is modularity. The I2C shared bus is the backbone — it's a two-wire protocol that lets you daisy-chain as many sensors as you want on the same SDA and SCL lines, each with a unique address. The Qwiic connectors on the SparkFun boards make this plug-and-play: no soldering, just snap a cable. If you don't need soil moisture, unplug it. If you want higher-accuracy temperature, swap the DHT11 for a DHT22 — same code interface, just change one constant. The ADS1115 is the other modularity enabler: the ESP8266 only has one analog pin, but the ADS1115 gives you four analog channels over I2C, so you can mix and match analog sensors freely."

---

### NEW Slide 5C — SENSOR MODULE MENU / CUSTOMIZATION SCHEMATIC

**Title:** Sensor Module Menu — Customization Schematic

**Table:**

| Module | Measures | Connection | Status | Swap Alternative |
|--------|----------|------------|--------|------------------|
| DHT11 | Temp + Humidity | GPIO4 (digital) | Core | DHT22 (±0.5°C) |
| BMP180 | Barometric Pressure | I2C (0x77) | Core | BME280 (3-in-1) |
| SAM-M8Q GPS | Lat/Lon/Alt/Speed | I2C Qwiic (0x42) | Core | Any u-blox GNSS |
| ADS1115 | 4-ch ADC Expander | I2C (0x48) | Core | ADS1015 (12-bit) |
| Photocell | Light Intensity | ADS1115 Ch.0 | Optional | TSL2561 digital lux |
| Sound Detector | Noise Levels | ADS1115 Ch.1 | Optional | MAX4466 amplified mic |
| Qwiic Soil Moisture | Ground Moisture | I2C Qwiic (0x28) | Optional | Capacitive soil sensor |
| HC-SR501 PIR | Motion Events | GPIO12 (digital) | Optional | RCWL-0516 radar |
| ESP32 Bridge | Bluetooth Export | UART/SPI | Expansion | ESP32-S3 |

**Bottom text:**
"Core modules define the baseline station. Optional modules let users tailor the build to their specific research question — ecology, agriculture, urban monitoring, or education."

**Narrative (for video):**
"This table is the customization schematic. Think of it as a menu: the core modules give you a functional station out of the box. The optional modules let you specialize. A soil scientist might keep the soil sensor and drop the sound detector. An urban noise researcher does the opposite. A wildlife biologist might upgrade the PIR to a microwave radar that works through a weatherproof enclosure. The point is, you're not locked into a fixed configuration — the I2C bus and the firmware's modular init sequence support any combination."

---

### NEW Slide 8B — FIRMWARE ARCHITECTURE / CODE DIAGRAM (insert after How It Works)

**Title:** Firmware Architecture — Code Diagram

**Subtitle:** Custom Arduino firmware: event-driven, non-blocking, timer-based sensor push

**Left Column — setup() (runs once at boot):**
```
1. Blynk.begin() — Connect WiFi + authenticate via TLS
2. Wire.begin() — Initialize I2C bus
3. I2C Scan — Detect connected sensors (0x40, 0x42, 0x48, 0x77)
4. Init Sensors:
   ├── si7021.begin()      → V5, V6, V7
   ├── ads.begin(0x48)     → V20, V21
   ├── dht.begin()         → V22, V23
   └── gps.begin()         → V30–V34
5. Register BlynkTimer callbacks:
   ├── pushTempHumidity    every 2000ms
   ├── pushAdc             every 2000ms
   ├── pushAds1115         every 2000ms
   ├── pushDht11           every 3000ms
   ├── pushGps             every 2000ms
   └── updateEnvLed        every  500ms
```

**Right Column — loop() (runs continuously):**
```
loop() {
  Blynk.run()           ← maintain cloud connection
  timer.run()           ← fire scheduled callbacks
  updateButtonToVirtualLed()  ← poll physical button
}

// No delay() — fully non-blocking
// Each timer callback:
//   1. Read sensor
//   2. Validate data (NaN check, range check)
//   3. Blynk.virtualWrite(Vx, value)
//   4. Serial debug log
```

**Bottom text:**
"The firmware uses BlynkTimer to schedule non-blocking sensor reads at 2–3 second intervals. Each sensor has its own push function with validation and error handling. No delay() calls anywhere — the loop runs continuously, and callbacks fire on schedule."

**Virtual Pin Map (sub-table or separate area):**

| Virtual Pin | Data | Source | Push Interval |
|-------------|------|--------|---------------|
| V5, V6, V7 | Temp °F, Temp °C, Humidity % | Si7021 (onboard) | 2 sec |
| V0, V8 | ADC Raw, Voltage | ESP8266 A0 | 2 sec |
| V20, V21 | Light (Ch0), Sound (Ch1) | ADS1115 | 2 sec |
| V22, V23 | Temp °C, Humidity % | DHT11 (GPIO12) | 3 sec |
| V30–V34 | Lat, Lon, Alt, Speed, SIV | SAM-M8Q GPS | 2 sec |
| V2, V3, V4, V15 | RGB R, G, B, Brightness | NeoPixel LED | On-demand (app → device) |
| V24, V17 | Servo angle In, Readback | Servo (GPIO15) | On-demand (app → device) |

**Narrative (for video):**
"Here's the firmware architecture. The setup function runs once at boot — it connects to WiFi with Blynk authentication over TLS, initializes the I2C bus and scans for connected sensors, then registers a BlynkTimer callback for each sensor at 2 to 3 second intervals.

The loop function is intentionally minimal — it runs Blynk.run() to maintain the cloud connection, timer.run() to fire the scheduled callbacks, and a button poll. There are zero delay() calls in the entire firmware — everything is non-blocking and event-driven.

Each push function — like pushDht11ToBlynk — reads the sensor, validates the data with NaN and range checks, writes to the assigned virtual pins, and logs to Serial for debugging. If the DHT11 returns NaN, the firmware pushes a sentinel value of -999 so the app still gets updates and can display an error state rather than stale data.

The virtual pin map shows exactly which data flows where. V5 through V7 are the onboard Si7021. V20 and V21 are the ADS1115 channels for light and sound. V30 through V34 carry all five GPS fields. The BLYNK_WRITE handlers for V2, V3, V4 handle incoming RGB color commands from the app — that's the bidirectional communication."

---

### NEW Slide 8C — DATA EXPORT & SHARING

**Title:** DATA EXPORT & SHARING

**Subtitle:** Beyond the Blynk dashboard — your data can go anywhere

**Table:**

| Channel | How It Works | Use Case |
|---------|-------------|----------|
| **Blynk SuperChart** | Built-in CSV export from app | Download raw data for Excel / R / Python analysis |
| **Email Alerts** | Blynk email widget + push notifications | Get notified when thresholds cross (e.g., temp > 35°C) |
| **Twitter / X** | IFTTT webhook triggered by Blynk event | Auto-tweet site conditions in real time |
| **Google Sheets** | Zapier or IFTTT integration via webhook | Build a live spreadsheet of field readings |
| **Custom API** | ESP32 bridge + HTTP POST to any endpoint | Send data to your own research server or database |
| **SD Card** | Optional SPI SD module for local logging | Offline backup for remote sites without WiFi |

**Data flow summary:**
```
Sensors → ESP8266 firmware → Blynk Cloud (TLS)
                                  ↓
                    ┌─────────────┼─────────────┐
                    ↓             ↓             ↓
              Blynk App    Webhook/API     Email Widget
              (gauges,     (IFTTT →        (threshold
               charts,      Twitter,        alerts to
               CSV export)  Zapier →        inbox)
                            Google Sheets)
```

**Narrative (for video):**
"Data export is where modularity extends beyond hardware into the software layer. The Blynk SuperChart widget has built-in CSV export — you can download your entire dataset directly from the app for analysis in Excel, R, or Python. Blynk's email widget sends automatic alerts when thresholds are crossed — say, soil moisture drops below 20% or temperature exceeds 35°C.

For social sharing, the station can trigger IFTTT webhooks on any Blynk event. You could auto-tweet live conditions from a field site, or use Zapier to log every reading to a Google Sheet in real time. For researchers who want full control, the ESP32 bridge module can HTTP POST to any custom API endpoint — your own Flask server, a PostgreSQL database, whatever your pipeline needs. And for remote deployments with no WiFi, an optional SPI SD card module logs everything locally as a backup."

---

### Updated Slide Text — With Integrated Citations

#### Slide 2 — SOCIAL NEED (updated with citations)

**Subtitle text:**
"Multi-variable environmental sensing is foundational to ecological assessment, habitat conservation, and public health — yet field instrumentation remains cost-prohibitive and functionally limited (Kumar et al., 2020; Chowdhury et al., 2024)."

**Card 1 — Ecological Monitoring:**
"Habitat assessment requires concurrent measurement of atmospheric, terrestrial, and biotic variables. IoT sensor networks provide the spatial and temporal resolution needed to supplement traditional survey methods (Sathyamoorthy et al., 2024)."

**Card 2 — Citizen Science:**
"Participatory monitoring is constrained by instrument cost and technical complexity, limiting community-driven data collection in underserved ecosystems (Hameed et al., 2022)."

**Card 3 — Research & Education:**
"Open-source, low-cost sensor platforms lower the barrier to reproducible field research and environmental informatics education (Hameed et al., 2022; EPA Air Sensor Toolbox)."

**Sources line (bottom of slide):**
Kumar et al., *Sensors* 2020 · Chowdhury et al., *AIMS Env. Sci.* 2024 · Sathyamoorthy et al., *HAFED POLY J.* 2024 · Hameed et al., *Scientific Reports* 2022 · EPA Air Sensor Toolbox

#### Slide 4 — COMPETITORS (updated bottom text)

"Higher sensor multiplicity, geospatial tagging, and real-time cloud telemetry — at a fifth of the cost. Fully open-source and extensible via I2C bus (Kumar et al., 2020; Roostaei et al., 2023)."

#### Slide 8 — HOW IT WORKS (updated top text)

"Custom firmware interfaces with the Blynk Cloud API over authenticated WiFi, enabling bidirectional device-to-cloud communication. Edge computing on the ESP8266 reduces cloud dependency and supports offline-first design (Roostaei et al., 2023; Arya et al., 2024)."

#### Slide 9 — SECURITY (updated data sharing note)

"Per-device access control via Blynk auth tokens. No PII collected or transmitted. Data sharing is opt-in, supporting collaborative research configurations (Hameed et al., 2022)."

---

### Full References (for citations slide or final slide)

1. Kumar et al. (2020). "Advances in Smart Environment Monitoring Systems Using IoT and Sensors." *Sensors*, 20(11), 3113.
2. Chowdhury et al. (2024). "Advancement of Environmental Monitoring System Using IoT and Sensor." *AIMS Environmental Science*, 9(6), 771-800.
3. Sathyamoorthy et al. (2024). "Advances and Challenges in IoT Sensors Data Handling and Processing in Environmental Monitoring Networks." *HAFED POLY Journal*, 5(2), 40-60.
4. Arya et al. (2024). "Artificial Intelligence and IoT Driven Technologies for Environmental Pollution Monitoring and Management." *Frontiers in Environmental Science*, 12, 1336088.
5. Hameed et al. (2022). "Design and Development of an Open-Source Framework for Citizen-Centric Environmental Monitoring and Data Analysis." *Scientific Reports*, 12, 14416.
6. Roostaei et al. (2023). "IoT-based Edge Computing for Improved Environmental Monitoring." *Sustainable Computing*, 38, 100870.
7. EPA Air Sensor Toolbox — https://www.epa.gov/air-sensor-toolbox

---

## Updated Timing Summary (with new slides)

| Slide | Topic | Time |
|-------|-------|------|
| 1 | Title | 0:15 |
| 2 | Social Need (with citations) | 2:00 |
| 3 | Who Benefits | 0:45 |
| 4 | Competitors (with citations) | 1:15 |
| 5 | System Architecture | 0:45 |
| **5B** | **Modular Design — Customize Your Station** | **0:45** |
| **5C** | **Sensor Module Menu / Customization Schematic** | **0:30** |
| 6 | Components & Integration | 0:30 |
| 7 | UI & Interaction | 0:45 |
| 8 | How It Works / Internet Service | 0:30 |
| **8B** | **Firmware Architecture / Code Diagram** | **0:45** |
| **8C** | **Data Export & Sharing** | **0:30** |
| 9 | Security (with citations) | 1:00 |
| 10 | Thank You | 0:15 |
| **Total** | | **~10:30** |

**Note:** This runs about 2 minutes over the 8-minute target. To trim back to ~8:30, consider:
- Combine 5B + 5C into one slide (just show the table with a one-line modularity intro)
- Shorten the competitors narration (point at the table, don't read every cell)
- Cut the data export narration to just listing the channels briefly (~15 sec instead of 30)
- The firmware code diagram can be walked through quickly if you point at the setup/loop flow visually

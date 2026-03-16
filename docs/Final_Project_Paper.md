# Portable Environmental Field Logger: Dual-Output IoT Sensing with Blynk and a Custom Web Dashboard

**INF 148 — Designing for the Internet of Things | Final Project, Option 3: Programming Guru**

**Author:** Kaomi Booker

**Date:** March 2026

---

## Abstract

Accurate environmental monitoring requires collecting data from multiple variables at once, such as temperature, humidity, pressure, light, sound, soil moisture, gas, and signs of life or ecological issues like fire or gas leaks. However, most field instruments that can do this are expensive and often limited in what they measure. This project presents a portable, open-source field logger built around the SparkFun Blynk Board (ESP8266), equipped with nine sensor channels plus GPS. The logger streams data both to the Blynk Cloud and to a custom-built web dashboard. By using two ADS1115 16-bit ADC expanders on a shared I²C bus, the system supports sensors for soil moisture, water level, flame detection, light intensity, and gas, as well as digital sensors for motion and onboard temperature/humidity (Si7021). 

---

## 1. Introduction

### 1.1 Why Environmental Monitoring Matters

Environmental monitoring is essential for conservation, ecological research, and public health, but the tools required to do it well are expensive and fragmented. As Katie observes, "environmental monitoring plays a crucial role in shaping policies and practices that foster sustainable development and environmental stewardship on a global scale" [1]. Multi-variable environmental sensing is foundational to ecological assessment, habitat conservation, and public health—yet field instrumentation remains cost-prohibitive and functionally limited [10,2]. As monitoring technology has advanced, environmental monitoring systems have "evolved from essential remote monitoring to an advanced environment monitoring (AEM) system, incorporating Internet of Things (IoT) technology and sophisticated sensor modules" [2]. Characterizing a habitat accurately requires concurrent measurement of atmospheric, terrestrial, and biotic variables; IoT sensor networks provide the spatial and temporal resolution needed to supplement traditional survey methods [11]. To confront threats like climate change and pollution, "intelligent, automated environmental systems are in great demand to ensure continuous and vigorous control of natural resources" [16]. The challenge is not a lack of technology but a lack of accessible, affordable technology that puts multi-variable field sensing within reach of smaller organizations, community groups, and individual researchers.

### 1.2 Who Benefits

The primary beneficiaries of an affordable, portable field logger fall into four groups.

**Field researchers** need to deploy instrumentation at study sites for GPS-tagged, multi-variable data collection without committing to equipment that costs hundreds of dollars per unit. A logger that streams to a cloud dashboard in real time allows researchers to monitor conditions remotely and retrieve data without physically visiting the site.

**Conservationists** monitor habitat conditions along creeks, wetlands, and forest edges, tracking changes over time and across locations. Portable, GPS-tagged logging allows them to compare data from multiple sites and detect trends that would be invisible from a fixed station.

**Citizen scientists** contribute environmental data from gardens, parks, and neighborhoods, but participatory monitoring is constrained by instrument cost and technical complexity [13]. The emergence of affordable, DIY sensor technologies has "democratized" data collection, "shifting environmental monitoring toward crowd-sourced citizen science" [4]. By lowering the financial barrier to entry, open-source platforms empower community groups and researchers to gather high-resolution environmental data in underserved ecosystems [4,13]. An open-source, sub-$100 platform lowers the barrier to community-driven data collection.

**Students and educators** benefit from an affordable, hackable platform for hands-on learning in ecology, environmental science, and engineering. Integrating citizen science projects into school communities has proven effective: Barros et al. demonstrate that such approaches "encourage the transfer of scientific knowledge from universities to society in a dynamic and active process of social responsibility…promoting scientific literacy of the younger generation" [3]. The EPA's Air Sensor Toolbox now provides institutional guidance for citizen-science air quality projects, signaling recognition that non-professionals can contribute meaningful environmental data [13,15].

### 1.3 What This Project Addresses

This project addresses the gap between expensive, single-purpose commercial loggers and the need for affordable, multi-variable, cloud-connected field instrumentation. The field logger provides: low-cost, portable sensing ($80 total); dual output to both Blynk Cloud and a custom-built, publicly deployed web dashboard; GPS-tagged readings; open-source firmware and hardware that anyone can inspect, modify, and extend; and an I²C bus architecture that allows adding new sensors without redesigning the system.

---

## 2. Competitors and Related Work

### 2.1 Existing Solutions

The commercial market for portable environmental data loggers is dominated by a few well-established products, each of which measures only a small subset of the variables needed for comprehensive field characterization.

**Table 1: Competitor Comparison**

| Feature | HOBO MX2301A | Kestrel DROP D3 | Davis Vantage Vue | **Our Field Logger** |
|---------|-------------|-----------------|-------------------|----------------------|
| Price | $200+ | $150+ | $400+ | **~$80** |
| Variables tracked | 2 (temp, humidity) | 3 (+ pressure) | 5 (+ wind, rain) | **10 + GPS** |
| GPS tagging | No | No | No | **Yes** |
| Cloud dashboard | No (app only) | No (app only) | Limited | **Yes (Blynk + custom web)** |
| Real-time alerts | No | No | No | **Yes (push notifications)** |
| Open source | No | No | No | **Yes** |
| Portable | Yes | Yes | No (stationary) | **Yes** |
| Soil moisture | No | No | No | **Yes** |
| Motion detection | No | No | No | **Yes** |
| Expandable | No | No | No | **Yes (I²C + ADS1115)** |

### 2.2 How Our Logger Differs

The HOBO MX2301A costs over $200 and measures only temperature and humidity—two variables, no GPS, no cloud integration. The Kestrel DROP D3 adds barometric pressure for $150, but still has no GPS, no soil sensor, no dashboard, and no open-source path. The Davis Vantage Vue covers five variables for over $400, but it is a stationary home weather station not designed for portable field deployment.

Our field logger tracks nine variables plus GPS—temperature, humidity, light intensity, sound level, soil moisture, water level, flame detection, gas concentration (MQ2), and motion—streams to a cloud dashboard in real time, and costs under $80. (A barometric pressure sensor was removed from the build; see Section 6.6.) Bresnahan et al. demonstrated that "for just over $100 and some basic coding, a user can assemble a high-quality environmental sensor that quantitatively matches the accuracy of expensive commercial units," validating that DIY field instruments can compete with proprietary hardware [4]. Proprietary systems can be "highly restrictive," and "this lack of flexibility can hinder the system's capacity for evolution and adaptation in dynamic and everchanging environments" [4]. The key differentiator is not just price but sensor multiplicity, geospatial tagging, and extensibility. Two ADS1115 ADC expanders on a shared I²C bus provide eight analog channels on just two wires, which is what enables the expanded sensor suite without consuming additional GPIO pins. We also built a custom web dashboard deployed on our own infrastructure as a free alternative to Blynk: no message caps, no subscription fees, and users can choose cloud (Blynk), self-hosted, or both—higher sensor multiplicity, geospatial tagging, and real-time cloud telemetry at a fraction of the cost; fully open-source and extensible [10,14].

---

## 3. System Design

### 3.1 Hardware Overview

The system is built around the **SparkFun Blynk Board**, which integrates an ESP8266 WiFi microcontroller with an onboard Si7021 temperature and humidity sensor, a NeoPixel RGB LED, and a physical button. The ESP8266 is widely utilized in IoT research because it is "a completely open development board, at the software and hardware level," with "integrated Wi-Fi connectivity" that allows it to act as "an intermediary between…sensors with our data platform" [5]. Previous studies have successfully paired the ESP8266 with the Blynk app for remote temperature monitoring [17] and intelligent greenhouse monitoring [18]. The ESP8266 handles all sensor polling, data validation, and wireless communication.

The sensor suite consists of:

- **Si7021** (temperature + humidity, onboard) — I²C at address 0x40; built into the SparkFun Blynk Board; no external wiring required. Reports °F (V5), °C (V6), and % RH (V7).
- **ADS1115 #1** (0x48, ADDR→GND) — 16-bit 4-channel ADC expander on I²C; carries four analog sensors:
  - Ch A0: analog soil moisture sensor → V20 (voltage), V26 (%)
  - Ch A1: water level sensor → V21
  - Ch A2: flame/fire detector (analog) → dashboard `flame_voltage` (no Blynk virtual pin assigned yet)
  - Ch A3: mini photocell (light intensity, voltage divider) → V22
- **ADS1115 #2** (0x49, ADDR→VDD/3.3V) — second 16-bit ADC expander on the same I²C bus; carries:
  - Ch A0: MQ2 gas sensor analog output → V23. *The MQ2 heater requires 5 V; VCC wired to the VIN/USB 5 V rail, AO to ADS2 A0.*
- **SparkFun Sound Detector** (SEN-12642) — envelope (AO) pin wired directly to the ESP8266 board ADC A0 (not ADS1115); reports raw ADC count (V0) and voltage (V8).
- **SAM-M8Q GPS module** — I²C Qwiic at address 0x42; provides latitude (V30), longitude (V31), altitude (V32), ground speed (V33), and satellites-in-view (V34). Confirmed working at 12 satellites.
- **HC-SR501 PIR motion sensor** — digital input on GPIO12 (D6) → V36. Confirmed working.

Output components include: onboard NeoPixel RGB LED (GPIO4), a passive buzzer for threshold alerts, and the onboard pushbutton (GPIO0).

**Pin budget summary:** The I²C shared bus carries four devices (Si7021, ADS1115 #1, ADS1115 #2, SAM-M8Q GPS) on two wires (SDA/SCL). The two ADS1115s together provide eight analog channels, covering all analog sensors. The ESP8266's native ADC A0 is dedicated to the sound detector. One GPIO pin covers the PIR motion sensor (GPIO12). The BMP180 barometric sensor was removed from the build (Section 6.6); the servo is reserved in firmware but not wired (Section 6.6).

### 3.2 Circuit Diagram

**Figure 1. Component diagram.** Block-level view of the field logger: ESP8266 (SparkFun Blynk Board) at center, shared I²C bus (Si7021, ADS1115 #1, ADS1115 #2, SAM-M8Q GPS), analog sensors, Sound Detector on ADC A0, PIR on GPIO12, and data paths to Blynk Cloud and the web dashboard. Insert image: `component_diagram_light.png` (export from `component_diagram_light.svg`).

**Figure 2. Schematic diagram.** Pin-level wiring: power rails (3.3 V, 5 V for MQ2), I²C (SDA/SCL), ADC and GPIO connections. Insert image: `schematic_diagram.png` (export from `schematic_diagram.svg`).

### 3.3 Data Flow

Sensor readings are collected by the ESP8266 firmware at 2–3 second intervals. When V50 is turned ON in the Blynk app, readings are pushed to Blynk Cloud via `Blynk.virtualWrite()` over TLS-encrypted WiFi. The firmware also sends an HTTP POST to the custom web dashboard every 5 seconds, regardless of the V50 state, so the dashboard always receives data. The two output paths are independent: the Blynk path is toggled by V50; the dashboard path runs continuously.

The overall service flow is:
1. Sensors read the physical environment (wired, local)
2. ESP8266 firmware processes readings (NaN validation, range checks, unit conversions)
3. `Blynk.virtualWrite()` pushes data to Blynk Cloud via WiFi + TLS
4. Blynk app receives and displays live widgets (gauges, charts, map, push alerts)
5. In parallel: HTTP POST to the deployed web dashboard (e.g. https://field-monitor-dashboard.onrender.com/api/data)

This dual-output architecture aligns with modern hybrid cloud-edge IoT frameworks, where "IoT devices perform optimally when integrated with an intermediary layer for data processing and workloads control, subsequently delegating more intensive tasks to the cloud" [7]. Processing data locally on the microcontroller before transmitting reduces cloud dependency and supports offline-capable design [14,12]. If internet connectivity drops, "edge nodes can ensure continuous data reception and synchronization, vastly improving data continuity over strictly cloud-reliant systems" [6].

### 3.4 Modular Design

The key architectural decision behind the system is modularity. The I²C shared bus is the backbone—a two-wire protocol (SDA and SCL) that allows daisy-chaining sensors on the same lines, each with a unique address. SparkFun's Qwiic connectors make this plug-and-play for compatible sensors (GPS, soil moisture). The ADS1115 is the primary modularity enabler: because the ESP8266 has only one native analog pin, each ADS1115 provides four additional analog channels over I²C. Two ADS1115 units (0x48 and 0x49, distinguished by the ADDR pin) give eight analog channels total on just two I²C wires—fire detection, gas sensing, soil moisture, water level, and light intensity all run through this pair with no additional GPIO consumption.

The design is organized into a core platform and optional modules. The **core platform** consists of the ESP8266 controller, the I²C bus, at least one ADS1115 ADC expander, Blynk Cloud connectivity, and power. The **optional modules** are sensor-specific and interchangeable: the analog soil sensor can be swapped for a Qwiic capacitive soil sensor; the photocell can be replaced with a TSL2561 digital lux sensor; a barometric sensor (e.g. BME280) can be added on I²C in a future build; the PIR can be replaced with an RCWL-0516 microwave radar module that detects motion through weatherproof enclosures; additional MQ-series gas sensors (MQ5 for natural gas, MQ7 for CO) can be added on ADS2 A1–A3.

Every sensor is an independent module: add, remove, or swap without redesigning the system—just update the firmware initialization block.

### 3.5 Sensor Module Menu

**Table 2: Sensor Module Menu — Current Build and Customization**

| Module | Measures | Connection | Build Status | Swap Alternative |
|--------|----------|------------|--------------|------------------|
| Si7021 (onboard) | Temp + Humidity | I²C (0x40) built-in | **Active** | — (onboard, no swap) |
| BMP180 | Barometric Pressure | I²C (0x77) | **Removed** (see 6.6) | BME280 (3-in-1) |
| SAM-M8Q GPS | Lat / Lon / Alt / Speed / SIV | I²C Qwiic (0x42) | **Active** | Any u-blox GNSS |
| ADS1115 #1 | 4-ch ADC (soil, water, flame, light) | I²C (0x48, ADDR→GND) | **Active** | ADS1015 (12-bit) |
| ADS1115 #2 | 4-ch ADC (gas + 3 free) | I²C (0x49, ADDR→VDD) | **Active** | ADS1015 (12-bit) |
| Analog Soil Sensor | Ground moisture % | ADS1115 #1 Ch A0 | **Active** | Qwiic capacitive soil (I²C) |
| Water Level Sensor | Water / liquid presence | ADS1115 #1 Ch A1 | **Active** | Capacitive water sensor |
| Flame Detector (4-pin) | IR flame / fire presence | ADS1115 #1 Ch A2 | **Active** (dashboard only) | Digital threshold module |
| Mini Photocell | Light intensity | ADS1115 #1 Ch A3 | **Active** | TSL2561 digital lux (I²C) |
| MQ2 Gas Sensor | Smoke / combustible gas | ADS1115 #2 Ch A0 (5V heater) | **Active** | MQ5 (natural gas), MQ7 (CO) |
| SparkFun Sound Detector | Noise level (envelope) | Board ADC A0 | **Active** | MAX4466 amplified mic |
| HC-SR501 PIR | Motion events | GPIO12 (digital) | **Active** | RCWL-0516 microwave radar |
| Servo (sub-micro) | PWM angle | GPIO15 | **Not connected** (reserved V24, V17) | ROB-09065 |
| ESP32 Bridge | Bluetooth / extended I/O | UART / SPI | Expansion (not connected) | ESP32-S3 |

Core I²C modules define the baseline station. The dual-ADS1115 arrangement provides eight analog channels on two I²C wires, supporting the full range of environmental sensors (soil, water, gas, fire, light) without consuming additional GPIO. The MQ2 heater requires 5 V; all other sensors run on 3.3 V.

---

## 4. Access and Interface

### 4.1 How the Device Is Accessed

The system is primarily accessed through a custom, deployed web dashboard accessible from any browser. It remains possible to set up views on Blynk's web console and mobile app—the firmware pushes data to Blynk when V50 is enabled—but this project focused on the custom dashboard to keep costs low and customization high for users. Blynk thus remains an optional secondary interface rather than the primary monitoring surface.

#### 4.1.1 Custom Web Dashboard (Primary Interface)

The centerpiece of the access layer is a custom **Node.js/Express web application** deployed to a publicly accessible server. The dashboard was built from scratch as a **free, open-source alternative to Blynk's cloud infrastructure**, eliminating the subscription fees, message caps, and feature gates that constrain the Blynk free tier. The dashboard code is open-source on GitHub (**field-monitor-dashboard**); it can be deployed with **one-click from the repo via Render** (see `render.yaml` in the project root, `sensor-dashboard` service) or self-hosted on any hosting environment. A live instance is running at **https://field-monitor-dashboard.onrender.com**.—a cheap VPS (e.g., $5/month DigitalOcean droplet), a university server, a Raspberry Pi with a tunnel, or a free-tier cloud instance—and requires no Blynk account and no recurring platform fees.

**Real-time data delivery via SSE.** The dashboard uses Server-Sent Events (SSE) for instant push updates from the server to the browser. When the ESP8266 POSTs a sensor reading, the server broadcasts it to all connected browser clients within milliseconds. A green pulsing dot in the header indicates a live SSE connection. If SSE disconnects (e.g., browser tab backgrounded), the client falls back to 3-second polling and automatically reconnects SSE when possible.

**Sensor cards and status chips.** The front end renders a card for every active sensor quantity: Temperature (°C), Humidity (%), Barometric Pressure (hPa; *no sensor in current build—field reserved*), Soil Moisture (%), Water Level (V), Ambient Light (V), Ambient Sound (V), Flame Detector (V), Gas/Smoke (V), and Motion (clear/detected). Each card shows the sensor source (e.g., "Si7021 onboard," "ADS1 A0 · V20"). A row of status chips at the top of the page reports each sensor as Active, Stale (>25 s since last update), or Inactive, giving an at-a-glance picture of system health. A toggle reveals hidden or disabled sensors for debugging.

**Nine time-series charts.** The dashboard renders dedicated charts for Temperature, Humidity, Ambient Light, Soil Moisture, Water Level, Flame Detector, Gas/Smoke, Barometric Pressure, and Ambient Sound—all drawn on HTML5 Canvas with no external charting library. Up to 500 data points are displayed per chart, and history is retained across server restarts via file-based persistence (up to 2,000 points saved to `data/history.json`).

**Free GPS map with trail via the OpenStreetMap Tile API.** The dashboard integrates a full interactive GPS map by calling the **OpenStreetMap Tile API** (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) through the **Leaflet.js** (v1.9.4) open-source mapping library—a third-party service integration that provides global map tiles at zero cost with no API key required. The map displays the station's current position, updates in real time as coordinates arrive from the SAM-M8Q GPS, and draws a polyline trail from the location history so users can visualize the path taken during a field session. A "Waiting for GPS fix…" overlay appears when no valid coordinates are available. This is a significant improvement over Blynk, where the Map widget and location-based features are restricted to paid plans. On Blynk's free tier, there is no map widget at all; users who need geospatial visualization must upgrade to a paid subscription that starts at $6.99/month (Plus plan) or higher. Our dashboard provides equivalent—and in some ways superior—mapping capability at zero cost, with the added benefit of OpenStreetMap's community-maintained global tile set rather than a proprietary map renderer.

**One-click data export.** The dashboard includes an **Export data** button in the header that downloads the current sensor snapshot plus the full retained history (up to 500 points) as a single JSON file. The file includes `exported_at` (timestamp), `current` (latest readings), and `history` (time-series array), so researchers can archive a session or import the data into Excel, R, or Python without any server-side configuration. This is a built-in, implemented feature of the custom dashboard—unlike capabilities that are merely technically possible (e.g., email alerts or IFTTT webhooks), which would require additional integration work and are not part of the current build.

**File-based persistence.** Sensor state (`current.json`) and time-series history (`history.json`) are written to disk every 10 seconds and on graceful shutdown. Data survives server restarts without any external database. A field researcher can restart the server and resume monitoring without losing accumulated readings—and because the files live on infrastructure the user controls, data retention is never subject to a third party's policies.

**API key authentication.** An optional `SENSOR_API_KEY` environment variable gates write access to the ingest endpoints, preventing unauthorized devices from injecting data. Read-only endpoints (current data, history, SSE stream) remain open, matching the typical use case of a publicly viewable monitoring dashboard with protected data submission.

**Blynk webhook bridge.** The dashboard also accepts data from Blynk webhooks: a Blynk "Device Datastream Update" webhook can POST to `/api/webhook/blynk`, which the server maps to the same in-memory store via a virtual-pin-to-key mapping. This allows the dashboard to reflect Blynk events even when the device is not posting directly, enabling a hybrid deployment where data arrives from both the device and the Blynk Cloud simultaneously.

[Insert Figure 3: Dashboard screenshot showing live sensor cards, GPS map with trail, time-series charts, and status chips. Include the Blynk app view for comparison.]

#### 4.1.2 Why a Self-Hosted Dashboard Improves on Blynk

Blynk is a powerful prototyping platform, but its subscription model introduces constraints that are misaligned with the goals of open-source, low-cost field instrumentation. While "the cost based model that Cloud computing offers will enable end-to-end service provisioning for businesses and users to access applications on demand from anywhere" [9], that convenience comes at a recurring financial and autonomy cost.

**Subscription tiers and feature gates.** Blynk's free tier is limited to 2 devices, 5 datastreams per template, basic widgets, and restricted message throughput. The Map widget, SuperChart with multiple datastreams, device sharing, and OTA firmware updates are all locked behind paid plans (Plus at $6.99/month, Pro at $19.99/month, or enterprise pricing). For a project that tracks 9+ sensor channels across multiple field sites, the free tier is functionally insufficient, and the paid tiers represent a recurring cost that compounds over time—especially for community groups or educational deployments where per-seat licensing is untenable [10,13].

**Message caps.** Blynk imposes per-device message limits on the free tier. High-frequency sensor polling (e.g., 15 virtual pin updates every 2 seconds) can exhaust the daily allowance, causing dropped readings or throttled updates. Our custom dashboard has no message cap whatsoever; data flows as fast as the ESP8266 can POST it.

**Vendor lock-in.** Blynk controls the cloud infrastructure, the widget library, and the mobile app. If Blynk changes its pricing, deprecates a feature, or sunsets the service, users lose access to their dashboards and stored data. By deploying your own server, developers can "store sensor data securely and create custom, dynamic charts without being locked into a proprietary vendor's ecosystem" [5]. The custom dashboard is fully self-managed: the code is open-source, the data lives on infrastructure the user controls, and no external service can revoke access.

Our dashboard replicates the core Blynk experience—live sensor cards, time-series charts, GPS mapping, real-time push updates—without any of these constraints. The tradeoff is that the user must run a server, but a $5/month VPS or a free-tier cloud instance is sufficient, and the total cost is still a fraction of a Blynk paid plan.

#### 4.1.3 Blynk App (Optional Secondary Interface)

Users can still configure views on Blynk's web console and mobile app; the device sends data to Blynk Cloud whenever V50 is toggled ON. For this project, the primary focus was the custom dashboard to avoid subscription limits and to maximize customization—so the Blynk app is documented here as an optional alternative rather than the main interface. When used, the Blynk mobile app is useful for quick monitoring in the field when a laptop is inconvenient. The app displays:
- Gauge widgets for temperature (°C and °F), humidity (%), and barometric pressure
- SuperChart for light intensity and sound level over time
- Value display for soil moisture percentage
- LED indicator for motion detection events
- Push notifications when configurable thresholds are crossed (e.g., temperature > 35 °C, soil moisture < 20%)

The GPS map widget and multi-device dashboards require a paid Blynk subscription and are not part of the current free-tier configuration.

#### 4.1.4 Physical Outputs

RGB LEDs show green/yellow/red status based on environmental thresholds. The passive buzzer sounds for threshold alerts. These allow monitoring the device in the field without any screen.

### 4.2 Field Deployment

Field use is straightforward. The user carries the station to a field site, powers it on, and tethers it to a phone hotspot. The station acquires a GPS fix (typically within 30–60 seconds with clear sky view) and begins streaming sensor readings to the deployed web dashboard—accessible from any browser, anywhere. A collaborator at a desk can watch the same live data that the field user sees on their phone. Optionally, V50 enables parallel streaming to the Blynk app. The user can move to the next site and compare readings across locations using the GPS trail on the dashboard map. If a threshold is crossed—unusual temperature, motion detection, soil moisture drop—a push notification fires automatically via Blynk, and the RGB LED and buzzer provide on-device alerts.

---

## 5. Security and Data

### 5.1 Preventing Unauthorized Access

All data in transit to Blynk Cloud is encrypted using TLS/SSL. Each device authenticates with a unique Blynk auth token; only a device possessing the correct token can connect and push data to the associated Blynk project. The WiFi connection uses WPA2 encryption. As Witczak and Szymoniak emphasize, "standard encryption and authentication protocols must be implemented to ensure data confidentiality and integrity against outsider attacks" [20]. The deployed web dashboard is secured with an API key for write endpoints and can be placed behind HTTPS via a reverse proxy (e.g., Caddy or nginx with Let's Encrypt). No personally identifiable information (PII) is collected at any point.

### 5.2 Data Collected, Why, and How

**Table 3 (partial): Data Types, Collection, and Purpose**

| Data Type | Sensor | Why Needed | How Collected |
|-----------|--------|------------|---------------|
| Temperature | Si7021 (onboard) | Track thermal conditions at the site | I²C, sampled every 2–3 s |
| Humidity | Si7021 (onboard) | Moisture in air; affects ecology and comfort | Same |
| Barometric pressure | — (BMP180 removed from build) | Weather patterns, altitude context | Not collected in current build |
| Light intensity | Photocell via ADS1115 #1 Ch A3 | Daylight cycles, canopy cover | Analog via I²C ADC |
| Noise levels | Sound Detector, board ADC A0 | Ambient sound, wildlife activity proxy | Analog ADC direct |
| Soil moisture | Analog sensor via ADS1115 #1 Ch A0 | Ground conditions, plant health | Analog via I²C ADC |
| Water level | Water sensor via ADS1115 #1 Ch A1 | Flooding, standing water, irrigation | Analog via I²C ADC |
| Flame / fire | Flame detector via ADS1115 #1 Ch A2 | Fire or IR heat source detection | Analog via I²C ADC |
| Gas (smoke/combustible) | MQ2 via ADS1115 #2 Ch A0 | Air quality, smoke, gas leak detection | Analog via I²C ADC (5V heater) |
| Motion events | PIR HC-SR501, GPIO12 | Wildlife/human activity detection | Digital GPIO, event-triggered |
| GPS coordinates | SAM-M8Q GPS (0x42) | Tag readings with location | I²C Qwiic, sampled every 2 s |
| WiFi credentials | User-configured | Connect to network for cloud upload | Stored in ESP8266 flash; never transmitted |
| Blynk auth token | Blynk platform | Authenticate device to cloud | Stored in ESP8266 flash; not transmitted beyond initial handshake |

### 5.3 How Data Is Transmitted and Stored

The data flow for transmission is: sensors → ESP8266 (wired, local) → Blynk Cloud (WiFi + TLS) → Blynk app (HTTPS). In parallel, the device POSTs JSON to the deployed web dashboard over WiFi. Both paths traverse the internet; the difference is who controls the destination server.

Data sent to Blynk is stored on Blynk's cloud infrastructure with server-side access control and storage encryption. Data sent to the custom dashboard is stored on the user's own server as JSON files (`data/current.json` and `data/history.json`), saved every 10 seconds and on graceful shutdown. Up to 2,000 history points are retained on disk. Data survives server restarts without any external database, and the user can back up, export, or delete the files at any time—an option that Blynk's managed storage does not provide.

### 5.4 Data Sharing

Data stored on Blynk is accessible only to the authenticated user. No data is sold or shared with third parties. Per-device access control means that even users on the same Blynk account can only access their own device's data. Data on the custom dashboard lives on infrastructure the user controls, with no third-party access unless explicitly configured. As Ullah et al. note, "when different parties share their data, having the capability to imply IoT data ownership can be helpful for monetization" [8]—and equally helpful for preventing unintended data exposure. Data sharing is opt-in: a future configuration could support shared dashboards for collaborative research teams comparing readings across sites, as Hameed et al. recommend in their 2022 open-source citizen-science framework [13].

### 5.5 Data Leakage and the Cloud Trust Problem

A fundamental tension in IoT architecture is the tradeoff between convenience and data sovereignty [8,7]. When sensor data flows through a third-party cloud service like Blynk, the user necessarily cedes control over where that data resides, how long it is retained, and who can access it—even if the provider's policies are reasonable today.

**Blynk's cloud exposure.** Every sensor reading pushed to Blynk Cloud traverses the public internet (albeit encrypted via TLS) and is stored on Blynk's servers. Blynk's terms of service grant the company access to device metadata, telemetry data, and usage analytics. While Blynk states that user data is not sold to third parties, the data is processed and stored on infrastructure the user does not control. IoT devices integrated with cloud services introduce multiple attack surfaces—"the cloud, meanwhile, remains a vital aspect in storing and analyzing large volumes of data" [7], but that centralization also means a single breach can expose data from many users simultaneously [20]. For environmental monitoring in sensitive locations—conservation sites, indigenous lands, private property—GPS coordinates and ecological data transiting through and persisting on a commercial cloud service represent a data leakage vector that may be unacceptable to some users or institutions.

**Custom dashboard data sovereignty.** The deployed custom dashboard mitigates this vector significantly. Although data now traverses the internet (like Blynk), the critical difference is *who controls the server*. JSON files are stored on the user's own infrastructure—a VPS, a university server, or a personal machine. No telemetry, usage data, or device metadata is sent to any third party. The server code is open-source and fully auditable. Deploying your own server "protects users from vendor lock-in and ensures superior data privacy" [5,7]. The user has complete visibility into what data exists (readable JSON files), complete control over retention (delete or archive at will), and complete assurance that no platform provider can access, subpoena, or monetize the data. For field researchers operating under IRB protocols or data governance agreements, this level of control may be a requirement rather than a preference [8,13].

**The tradeoff.** Unlike a LAN-only deployment, a publicly deployed dashboard introduces an attack surface (the server itself) that requires basic hardening—HTTPS via Let's Encrypt, firewall rules, and the API key for write endpoints. Blynk handles this for the user but at the cost of data control [9]. The hybrid architecture of this project lets users choose: use Blynk for convenient mobile monitoring where data sensitivity is low, and the custom dashboard for full data sovereignty and unrestricted features. This design follows the hybrid cloud-edge pattern where "edge computing layer incorporation enhances the power efficiency of IoT tools and fortifies overall infrastructure safety by delegating only the most intensive tasks to the cloud" [7].

### 5.6 Security Comparison: Custom Dashboard vs. Blynk

**Table 4: Security Comparison**

| Aspect | Blynk Cloud | Custom Deployed Dashboard |
|--------|------------|--------------------------|
| **Data in transit** | TLS/SSL encrypted over public internet | HTTPS via Let's Encrypt (user-configured) over public internet |
| **Data at rest** | Blynk servers (provider-controlled encryption) | JSON files on user-controlled server |
| **Authentication** | Blynk auth token per device; user account login | API key for write endpoints; no platform account required |
| **Remote access** | Built-in (cloud-native) | Built-in (publicly deployed) |
| **Attack surface** | Blynk Cloud servers, TLS cert chain, account credentials | User's server; hardened with firewall + HTTPS |
| **Data retention control** | Blynk controls retention policies | User controls all files; delete at will |
| **Third-party data access** | Subject to Blynk ToS, legal jurisdiction, potential subpoena | No third-party access; user owns the server |
| **Audit trail** | Blynk logs (not user-accessible) | Full visibility into server logs and stored files |
| **Service continuity** | Depends on Blynk remaining operational and affordable | Runs as long as the user maintains the server |
| **GPS/location privacy** | Coordinates stored on Blynk Cloud | Coordinates stored on user-controlled infrastructure |

**Blynk's strengths** are in convenience and hardened infrastructure: TLS everywhere, managed servers with professional security teams, and turnkey mobile access. For users who trust the provider and do not have strict data governance requirements, Blynk is a reasonable choice.

**The custom dashboard's strengths** are in data sovereignty, transparency, and elimination of third-party risk. The tradeoff is that the user assumes responsibility for securing the server—but with modern tooling (Let's Encrypt for free HTTPS, `ufw` or `firewalld` for access control, and the built-in API key), this is straightforward. The result is a dashboard with the same remote accessibility as Blynk but without the subscription fees, message caps, or data governance concerns.

---

## 6. Implementation Notes (Option 3: Programming Guru)

### 6.1 Firmware Architecture

The firmware is custom Arduino code using the Blynk library on the ESP8266. The design is fully non-blocking and event-driven: there are zero `delay()` calls anywhere in the sketch.

**`setup()` (runs once at boot):**
1. `Blynk.begin()` — connects to WiFi and authenticates with Blynk Cloud over TLS
2. `Wire.begin()` — initializes the I²C bus
3. I²C scan — detects connected sensors (expected: 0x40 Si7021, 0x42 SAM-M8Q GPS, 0x48 ADS1115 #1, 0x49 ADS1115 #2; no DHT11 or BMP180 in current build)
4. Sensor initialization: `si7021.begin()`, `ads.begin(0x48)`, `ads2.begin(0x49)`, `gps.begin()`
5. BlynkTimer callback registration:
   - `pushTempHumidity` — every 2000 ms (Si7021 → V5, V6, V7)
   - `pushAdc` — every 2000 ms (board ADC A0 sound → V0, V8)
   - `pushAds1115` — every 2000 ms (ADS1115 #1 soil A0→V20, water A1→V21, light A3→V22; ADS1115 #2 gas A0→V23; soil %→V26; flame A2 to dashboard only)
   - `pushGps` — every 2000 ms (SAM-M8Q → V30–V34)
   - `updateEnvLed` — every 500 ms (RGB LED, buzzer logic)

**`loop()` (runs continuously):**
```
loop() {
  Blynk.run()                    // maintain cloud connection
  timer.run()                    // fire scheduled callbacks
  updateButtonToVirtualLed()     // poll physical button
}
```

Each callback reads its sensor, validates the result with a NaN check and range check, writes to the assigned virtual pins via `Blynk.virtualWrite()`, and logs to Serial at 115200 baud for debugging. Invalid or out-of-range readings are replaced with a sentinel value (−999) so the app receives an update and can display an error state rather than stale data.

The firmware also sends an HTTP POST to the deployed web dashboard every 5 seconds with a JSON body containing all current sensor readings. The two outputs—Blynk and the custom dashboard—are fully independent.

### 6.2 Virtual Pin Map

**Table 3: Virtual Pin Map (current build)**

| Virtual Pin | Data | Source | Push Interval |
|-------------|------|--------|---------------|
| V50 | Push enable (Blynk only) | App toggle | On-demand |
| V0 | Sound ADC raw count | Board ADC A0 | 2 s |
| V8 | Sound ADC voltage | Board ADC A0 | 2 s |
| V5 | Temperature °F | Si7021 (onboard, 0x40) | 2 s |
| V6 | Temperature °C | Si7021 (onboard, 0x40) | 2 s |
| V7 | Humidity % | Si7021 (onboard, 0x40) | 2 s |
| V20 | Soil voltage | ADS1115 #1 Ch A0 | 2 s |
| V21 | Water level voltage | ADS1115 #1 Ch A1 | 2 s |
| V22 | Light (photocell) voltage | ADS1115 #1 Ch A3 | 2 s |
| V23 | Gas (MQ2) voltage | ADS1115 #2 Ch A0 | 2 s |
| V26 | Soil moisture % (calculated) | ADS1115 #1 Ch A0 | 2 s |
| V30 | GPS latitude | SAM-M8Q (0x42) | 2 s |
| V31 | GPS longitude | SAM-M8Q (0x42) | 2 s |
| V32 | GPS altitude (m) | SAM-M8Q (0x42) | 2 s |
| V33 | GPS ground speed (m/s) | SAM-M8Q (0x42) | 2 s |
| V34 | GPS satellites in view | SAM-M8Q (0x42) | 2 s |
| V35 | Barometric pressure (hPa) | — (BMP180 removed from build) | — |
| V36 | Motion detected (0/1) | PIR HC-SR501, GPIO12 | 500 ms |
| V2, V3, V4, V15 | RGB R, G, B, Brightness | NeoPixel LED (GPIO4) | On-demand (app → device) |
| V24, V17 | Servo angle in, Readback | Servo (GPIO15) — *reserved, not active in current build* | On-demand (app → device) |
| V1 | Button LED indicator | Onboard button (GPIO0) | 100 ms poll |
| *(dashboard only)* | Flame detector voltage | ADS1115 #1 Ch A2 | 2 s (no Blynk pin) |

### 6.3 Custom Web Dashboard

The web dashboard is a Node.js/Express application with a static single-page front end. The server exposes two main API endpoints: `POST /api/data` (or `/ingest`) to receive sensor readings from the ESP8266, and `GET /api/history?limit=100` to retrieve the recent time-series. The front end (HTML + vanilla JavaScript) connects via SSE for real-time push updates and renders sensor cards, nine time-series charts, and an interactive GPS map. No database is required; state is persisted to JSON files on disk.

The dashboard also accepts data from Blynk webhooks: a webhook in the Blynk console can trigger a POST to `/api/webhook/blynk` on any datastream update, which the server maps to the same store. This enables a hybrid deployment where data arrives from both the device and the Blynk Cloud.

### 6.4 Third-Party Service Integrations

The system integrates several third-party services and libraries, satisfying the MERIT criterion for external service integration:

**Table 5: Third-Party Integrations**

| Service / Library | Role | How Used |
|-------------------|------|----------|
| **Blynk IoT Cloud** | Device management, push notifications, mobile widgets | ESP8266 authenticates via Blynk auth token; `Blynk.virtualWrite()` pushes sensor data over TLS; Blynk app renders gauges, charts, and alerts |
| **Blynk HTTP API** | Webhook bridge between Blynk Cloud and custom dashboard | Blynk "Device Datastream Update" webhooks POST to `/api/webhook/blynk` on the dashboard server |
| **OpenStreetMap Tile API** | Free global map tiles for the GPS map | Dashboard front end requests tiles from `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`; no API key required; community-maintained global coverage |
| **Leaflet.js** (v1.9.4) | Open-source JavaScript mapping library | Renders the interactive GPS map, marker, and polyline trail in the browser; loaded from CDN |
| **Node.js / Express** | Web server framework for the custom dashboard | Serves the dashboard UI, REST API endpoints, and SSE stream |
| **Adafruit ADS1115 Library** | I²C ADC communication | Firmware reads four analog channels per ADS1115 via `ads.readADC_SingleEnded()` |
| **SparkFun u-blox GNSS Library** | GPS communication | Firmware reads lat/lon/alt/speed/SIV from the SAM-M8Q over I²C |

The OpenStreetMap Tile API is particularly notable: it provides the same geospatial visualization capability that Blynk locks behind a paid subscription, at zero cost and with no vendor dependency. The Blynk webhook bridge enables a hybrid architecture where the custom dashboard can receive data from both the device directly and from Blynk Cloud events.

### 6.5 Data Export and Sharing: Implemented vs. Technically Possible

It is important to distinguish between features **implemented in this project** and those that are **technically possible** (or available on the Blynk platform) but not part of the current build.

**Implemented in this project.** The custom web dashboard provides a one-click **Export data** button that downloads a JSON file containing the current sensor snapshot and the full retained history (up to 500 points). The payload includes `exported_at` (ISO timestamp), `current` (all latest readings), and `history` (array of time-stamped points). No server configuration or third-party service is required—the user clicks the button and receives a file suitable for archiving or analysis in Excel, R, or Python. File-based persistence on the dashboard (Section 4.1.1) also allows direct access to `data/current.json` and `data/history.json` on the server for backup or scripting. Blynk push notifications for threshold alerts are implemented in the firmware and Blynk app configuration (e.g., temperature or soil moisture thresholds).

**Technically possible but not implemented.** Many useful data workflows are feasible with the same hardware and APIs but were not built for this project. For example: **email alerts** could be added by configuring Blynk's email widget or by adding a server-side script that sends mail when a threshold is crossed—both are technically straightforward but require additional setup and are not part of the delivered system. **IFTTT or Zapier** could forward Blynk events to Google Sheets, Twitter, or other services via webhooks, but that integration is left to the user. **CSV export** from the Blynk SuperChart is a built-in Blynk feature, not part of our dashboard; our dashboard exports JSON, which can be converted to CSV offline if needed. An **ESP32 bridge** could POST to arbitrary custom APIs, and an **SPI SD card** could provide offline logging—both are expansion options, not current deliverables. Describing these as "technically possible" clarifies that the project delivers a working export path (dashboard JSON export and file persistence) while leaving room for future or user-added integrations such as email, IFTTT, or CSV pipelines.

### 6.6 Implementation Challenges

**Breadboard center gap:** A fundamental wiring error early in the build was placing components so that their pins bridged the center gap of the breadboard. Standard solderless breadboards have two independent half-rows (columns a–e and f–j) separated by a center gap; the two halves are not electrically connected. Sensors or IC modules placed across the center created the appearance of a connection where none existed, producing open circuits and intermittent I²C failures. The fix was to move all components to one side of each board (columns a–e or f–j), ensuring all pins in a row are on the same connected half. This single correction resolved multiple mysterious connection problems at once.

**Dual ADS1115 setup:** Running two ADS1115 modules on the same I²C bus requires that each has a distinct address. The ADS1115 ADDR pin selects among four addresses: GND = 0x48, VDD = 0x49, SDA = 0x4A, SCL = 0x4B. The first module (0x48) has ADDR tied to GND; the second (0x49) has ADDR tied to the 3.3 V rail. The firmware initializes them in sequence:

```cpp
adsOk  = ads.begin(0x48);
ads2Ok = ads2.begin(0x49);
```

Both 0x48 and 0x49 were confirmed in the I²C boot scan after the breadboard layout was corrected.

**ADS1115 floating analog inputs:** Channels with no sensor wired read noise or a constant value. This made it temporarily appear that sensor readings were wrong even after the device was detected. The resolution was to confirm each sensor connection individually: photocell voltage divider (photocell + 10 kΩ to GND) to A3; analog soil sensor to A0; water level sensor to A1; flame detector to A2. Once sensors were wired, readings responded correctly to physical input.

**MQ2 gas sensor power requirement:** The MQ2 sensor requires 5 V for its internal heater coil. Powering it from the 3.3 V rail produces a cold heater and unreliable readings. The fix was to connect the MQ2 VCC pin to the board's VIN pin (which carries USB bus voltage, ~5 V), while keeping the analog output (AO) at levels compatible with ADS1115 input (output does not exceed 5 V; ADS1115 is powered at 3.3 V and tolerates input up to VDD + 0.3 V, so a small series resistor or voltage divider is advisable for full protection, though the sensor typically outputs below 3.3 V in clean air).

**GPS Satellite Fix:** The SAM-M8Q requires a clear sky view to acquire an initial fix. Testing indoors produced SIV = 0 and the −999 sentinel lat/lon values, which initially resembled a firmware or I²C issue. Moving to a window or outdoors resolved it; the GPS acquired a fix within 30–60 seconds. GPS was confirmed working at 12 satellites with live coordinates visible in the Blynk app.

**BMP180 barometric pressure sensor (abandoned):** The BMP180 was the one sensor that could not be brought online despite multiple rewiring attempts. Its I²C address (0x77) never appeared in the boot-time I²C scan, even though four other I²C devices on the same bus—Si7021 (0x40), SAM-M8Q GPS (0x42), ADS1115 #1 (0x48), and ADS1115 #2 (0x49)—were all detected reliably. This confirmed that the I²C bus itself was functional; the problem was isolated to the BMP180 module. Troubleshooting steps included: verifying VCC, GND, SDA, and SCL connections row-by-row on the breadboard; swapping Qwiic cables; checking for cold solder joints on the breakout board headers; and trying both the 3.3 V rail and alternative power taps. None resolved the issue. The most likely explanation is a defective module or damaged I²C pull-up on the breakout board itself—a known failure mode for inexpensive sensor breakouts where the onboard pull-up resistors or level shifters can be damaged by static discharge or reversed polarity during prototyping. After several hours of debugging, the decision was made to remove the BMP180 from the system rather than continue troubleshooting a single $4 module. The firmware still contains the initialization code (guarded by a detection flag), so adding a replacement barometric sensor in the future would require only reconnecting the hardware. This experience underscored an important lesson in embedded prototyping: when one component on a shared bus refuses to initialize while all others work, the most time-efficient path is often to swap the module rather than continue probing the same wiring.

**Servo motor (not connected):** The sub-micro servo (SparkFun ROB-09065) was available in the kit and the firmware reserves virtual pins V24 and V17 for servo position and sweep control. However, the servo was ultimately not connected because the project's "field monitor" use case did not present a compelling real-time output for the servo to display—no meaningful composite index or threshold gauge was defined that would justify the additional wiring and power draw. The servo remains a candidate for future work (Section 8.2) if a site-health scoring algorithm is implemented.


## 7. Group Contribution

This project was completed as a solo project.

## 8. Conclusion and Future Work

### 8.1 Summary

The Portable Environmental Field Logger demonstrates that high-channel-count, GPS-tagged, cloud-connected field instrumentation is achievable at low cost with open-source hardware and software. The dual-output architecture—streaming to both Blynk Cloud and a custom deployed web dashboard—gives users the choice between a proprietary platform and a fully self-managed alternative. The custom dashboard eliminates subscription fees, message caps, and vendor lock-in while providing free GPS mapping via the OpenStreetMap Tile API and Leaflet.js, nine time-series charts, real-time SSE push updates, file-based persistence, and a one-click **Export data** button that downloads current readings and history as JSON—all accessible from any browser, anywhere. Other data workflows (e.g., email alerts, IFTTT webhooks, or CSV pipelines) are technically possible with the same stack but are not part of the delivered implementation; the project distinguishes clearly between these and the built-in export and persistence features.

### 8.2 Future Work

Future iterations could expand the system in several directions:

**Expanded sensor suite.** A barometric pressure sensor (e.g. BME280) could be added on the I²C bus to restore the pressure channel removed when the BMP180 was abandoned (Section 6.6). A UV index sensor, CO₂ module (e.g., SCD30/SCD40), or particulate matter sensor (e.g., PMS5003) could be added via the same I²C bus or the three unused analog channels on ADS1115 #2 (A1–A3). The modular architecture means new sensors require only a firmware initialization block and a new virtual pin assignment—no redesign of the bus or dashboard.

**Servo-driven site health gauge.** A sub-micro servo on GPIO15 could provide a physical analog display of a composite site health score, sweeping 0°–180° based on a weighted combination of sensor readings (e.g., temperature in range, soil moisture adequate, no gas detected). The firmware already reserves virtual pins V24 and V17 for servo control. This would give field users an at-a-glance physical readout without needing a screen, useful for rapid site assessment during transect walks.

**Dashboard enhancements.** Threshold-triggered push notifications and IFTTT integrations could be extended with configurable alert rules set from a web form rather than hard-coded in firmware. The dashboard already offers one-click JSON export; an optional CSV format (or "Export as CSV" alongside JSON) would give users a direct path into Excel without conversion. A Telegram or Discord bot integration could push threshold alerts to a chat channel, adding another third-party service integration alongside the existing Blynk and OpenStreetMap APIs.

**Collaborative monitoring.** The most impactful long-term addition would be opt-in shared dashboards for collaborative research teams, allowing multiple field stations to push GPS-tagged readings to a common interface, supporting the kind of distributed participatory monitoring that Hameed et al. identify as the future of citizen-science environmental data collection [13].

**ESP32 Bluetooth bridge for offline field use.** The most transformative hardware addition would be an ESP32 module bridged to the ESP8266 via UART or SPI. The ESP32's built-in Bluetooth Low Energy (BLE) radio would allow the field logger to stream sensor data directly to a phone app—even in locations with no WiFi or cellular data. A user could walk a remote trail or wetland with the logger in a backpack and view live readings on a BLE-connected phone, completely independent of internet infrastructure. When the user returns to a WiFi-connected area, the ESP32 could sync buffered readings to the deployed dashboard. This would make the field logger truly portable and network-independent, addressing the primary limitation of the current WiFi-only architecture. The Sensor Module Menu (Table 2) already lists the ESP32 Bridge as an expansion module, and the firmware's modular callback architecture would accommodate the additional communication path with minimal refactoring.

**Offline logging.** For remote deployments with no WiFi, an optional SPI SD card module could provide local offline logging, with data synced to the dashboard when connectivity is restored.

---

## References

1. Katie B. Internet of Things (IoT) for Environmental Monitoring. *Int J Comput Eng.* 2024;6(3):29-42.
2. Laha SR, Pattanayak BK, Pattnaik S. Advancement of Environmental Monitoring System Using IoT and Sensor: A Comprehensive Analysis. *AIMS Environ Sci.* 2022;9(6):771-800.
3. Barros N, Sobral P, Moreira RS, Vargas J, Fonseca A, Abreu I, Guerreiro MS. SchoolAIR: A Citizen Science IoT Framework Using Low-Cost Sensing for Indoor Air Quality Management. *Sensors.* 2024;24(1):148.
4. Bresnahan P, Briggs E, Davis B, Rodriguez AR, Edwards L, Peach C, Renner N, Helling H, Merrifield M. A Low-Cost, DIY Ultrasonic Water Level Sensor for Education, Citizen Science, and Research. *Oceanography.* 2023;36(1).
5. Lezcano Sirre A. IoT Environmental Monitoring System Using Arduino and NodeMCU ESP8266 [bachelor's thesis]. Barcelona: Universitat Politècnica de Catalunya; 2024.
6. Dumitru C, Pietraru RN, Moisescu MA. Enhancing Smart Building Reliability and Data Continuity Using Edge Computing. *Rev Roum Sci Tech Ser Electrotech Energ.* 2026;71(1):133-138.
7. Mills JA, Natarajan K. Integrating Edge and Cloud Computing in IoT: A Systematic Review on Architectures, Security, and Resource Management. *J Comput Commun Netw.* 2025;1:236-246.
8. Ullah I, Adhikari D, Su X, Palmieri F, Wu C, Choi C. Integration of data science with the intelligent IoT (IIoT): Current challenges and future perspectives. *Digit Commun Netw.* 2025;11:280-298.
9. Gubbi J, Buyya R, Marusic S, Palaniswami M. Internet of Things (IoT): A vision, architectural elements, and future directions. *Future Gener Comput Syst.* 2013;29(7):1645-1660.
10. Kumar A, Sharma K, Singh H, Prajapat SG, Pathak H. Advances in Smart Environment Monitoring Systems Using IoT and Sensors. *Sensors.* 2020;20(11):3113.
11. Sathyamoorthy A, Rajagopalan V, Murugesan M. Advances and Challenges in IoT Sensors Data Handling and Processing in Environmental Monitoring Networks. *HAFED POLY J.* 2024;5(2):40-60.
12. Arya R, Sharma N, Singh A. Artificial Intelligence and IoT Driven Technologies for Environmental Pollution Monitoring and Management. *Front Environ Sci.* 2024;12:1336088.
13. Hameed S, Khan FU, Hameed B. Design and Development of an Open-Source Framework for Citizen-Centric Environmental Monitoring and Data Analysis. *Sci Rep.* 2022;12:14416.
14. Roostaei F, Zhan X, Mo Y. IoT-based Edge Computing for Improved Environmental Monitoring. *Sustain Comput Inform Syst.* 2023;38:100870.
15. U.S. Environmental Protection Agency. Air Sensor Toolbox [Internet]. [cited 2026 Mar 15]. Available from: https://www.epa.gov/air-sensor-toolbox
16. Gurbanova L, Abdullayev V. Application of IoT and Sensor Technologies in Environmental Monitoring. *Environ Res Ecotoxicity.* 2025;4:170.
17. Kumar JB, Charan B, Kumar GV, Sunil C, Sumithabhashini P. IoT Based Temperature Monitoring System Using ESP8266 & Blynk App. *Int J Multidiscip Res.* 2023.
18. Nizami MKH. Design and Performance Evaluation of an IoT-Based Intelligent Greenhouse Monitoring and Control System. *Spectr Eng Sci.* 2025;3(10):718-730.
19. Dubey S. Cloud-Edge Architecture for IoT in Smart Building Automation. *Comput Eng Technol Innov.* 2024;1(3):178-186.
20. Witczak D, Szymoniak S. Review of Monitoring and Control Systems Based on Internet of Things. *Appl Sci.* 2024;14(19):8943.


---

## Figures and Tables — Insertion List

*For Google Docs (which does not support SVG): export the project SVGs to PNG with `node scripts/export-svg-to-png.js` (see `scripts/README.md`). This preserves all text; many online SVG→PNG converters drop text because the diagrams use system fonts.*

**Figure 1 — Component Diagram**
Caption: "Figure 1. Component diagram of the Environmental Field Logger. The SparkFun Blynk Board (ESP8266) connects to sensors via a shared I²C bus (Si7021 at 0x40, ADS1115 #1 at 0x48, ADS1115 #2 at 0x49, SAM-M8Q GPS at 0x42) and GPIO (PIR on GPIO12, Sound Detector on ADC A0). Data flows over WiFi to Blynk Cloud (TLS) and to the deployed web dashboard (HTTP POST)."
[Insert: component_diagram_light.png.]

**Figure 2 — Schematic Diagram**
Caption: "Figure 2. Schematic (pin-level) wiring: 3.3 V and 5 V rails, GND, I²C (SDA/SCL), board ADC A0, GPIO12 (PIR). The MQ2 gas sensor heater runs on 5 V (VIN rail); all other sensors on 3.3 V."
[Insert: schematic_diagram.png.]

**Figure 3 — Dashboard Screenshot / Blynk App View**
Caption: "Figure 3. Left: Custom web dashboard showing live sensor cards, GPS map with trail (via OpenStreetMap/Leaflet.js), time-series charts, and sensor status chips. Right: Blynk mobile app with gauge widgets and SuperChart."
[Insert screenshot from Screenshots saved in Downloads, e.g., Screenshot_20260314-154824.Blynk IoT.png and Screenshot_20260314-154959.Blynk IoT.png, plus a browser screenshot of the deployed dashboard.]

**Table 1 — Competitor Comparison** (included in Section 2.1)

**Table 2 — Sensor Module Menu** (included in Section 3.5)

**Table 3 — Virtual Pin Map** (included in Section 6.2)

**Table 4 — Security Comparison** (included in Section 5.6)

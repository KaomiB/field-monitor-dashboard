# Portable Environmental Field Logger: Dual-Output IoT Sensing with Blynk and a Custom Web Dashboard

**INF 148  -  Designing for the Internet of Things | Final Project, Option 3: Programming Guru**

**Author:** Kaomi Booker | **Date:** March 2026

---

## Abstract

Environmental monitoring works best when several variables are measured at once - temperature, humidity, light, sound, soil moisture, gas, and indicators of fire or other hazards. Equipment that can do this is usually expensive and limited. This project is a portable, open-source field logger based on the SparkFun Blynk Board (ESP8266) with 10 data streams/input channels. Data streams to a custom deployed web dashboard and, optionally, to Blynk Cloud. Two ADS1115 16-bit ADC expanders on a shared I²C bus drive the analog sensors; the board has an onboard Si7021 for temperature and humidity and a PIR for motion. Total cost stays around $80. The paper describes the design, the dual-output setup, and the main implementation challenges.

---

## 1. Introduction

### 1.1 Why It Matters

Environmental monitoring is essential for conservation, research, and public health, but the tools are expensive and fragmented. Multi-variable sensing supports ecological assessment and citizen science, yet field instrumentation remains cost-prohibitive and limited [1,2]. IoT sensor networks can supplement traditional surveys [3]. The gap is not technology itself but access: affordable, capable field sensing for researchers, community groups, and educators.

### 1.2 Who Benefits

**Field researchers** need GPS-tagged, multi-variable data at study sites without spending hundreds per unit. **Conservationists** monitor habitat along creeks, wetlands, and forests and compare sites over time. **Citizen scientists** contribute data from gardens and parks, but cost and complexity are barriers [4]; open-source, sub-$100 platforms lower that barrier [4,5]. **Students and educators** get an affordable, hackable platform for ecology and engineering; the EPA Air Sensor Toolbox supports citizen-science air quality projects [5,6].

### 1.3 What This Project Does

I wanted to close the gap between expensive, single-purpose loggers and the need for something affordable that measures many variables and connects to the cloud. The logger does three things: it keeps total cost under $100 (~$80), it sends data to both Blynk and a custom web dashboard that is publicly deployed, and it tags every reading with GPS. The firmware and hardware are open-source. I chose an I²C bus so that adding or swapping sensors does not require redesigning the system.

---

## 2. Competitors and Related Work

Commercial portable loggers are dominated by a few products, each measuring only a small subset of variables. The **HOBO MX2301A** costs over $200 and measures only temperature and humidity - no GPS, no cloud. The **Kestrel DROP D3** adds barometric pressure for about $150 but still has no GPS, no soil sensor, and no dashboard. The **Davis Vantage Vue** covers five variables for over $400 and is a fixed weather station, not portable.

I designed this logger to track 10 data streams (input channels) - temperature, humidity, light, sound, soil moisture, water level, flame, gas (MQ2), motion, and GPS - and to stream them to a cloud dashboard in real time for under $80. (I removed the barometric sensor from the final build; see Section 6.) Bresnahan et al. showed that for a bit over $100 and some basic coding, a user can build an environmental sensor that matches the accuracy of commercial units [7]; that supported the idea that a DIY logger could be viable. I also wanted to avoid lock-in: proprietary systems can be restrictive [7]. So I used two ADS1115 ADCs on one I²C bus to get eight analog channels on two wires, and I built a custom web dashboard as a free alternative to Blynk - no message caps or subscription, with the option to use Blynk, the custom dashboard, or both.

**Table 1** summarizes the comparison (HOBO, Kestrel, Davis vs. our logger: price, variables, GPS, dashboard, open source, portability, expandability).

---

## 3. System Design

### 3.1 Hardware

The system is built around the **SparkFun Blynk Board**: ESP8266, onboard **Si7021** (temp + humidity, I²C 0x40), NeoPixel LED, and pushbutton. For sensors I used the onboard Si7021; **two ADS1115** 16-bit ADC expanders at 0x48 and 0x49 (eight analog channels total); a **SparkFun Sound Detector** on the board ADC A0; a **SAM-M8Q GPS** on I²C at 0x42; and an **HC-SR501 PIR** on GPIO12 for motion. The first ADS1115 carries soil moisture (A0), water level (A1), flame detector (A2), and photocell (A3). The second has the MQ2 gas sensor on A0; its heater runs on 5 V from the board VIN. The I²C bus has four devices (Si7021, both ADS1115s, GPS) on two wires; the native ADC is dedicated to sound and one GPIO to the PIR. I dropped the BMP180 barometric sensor after it would not come online (Section 6), and I left the servo reserved in firmware but unconnected.

### 3.2 Data Flow

Sensors are read every 2–3 s. When V50 is ON in the Blynk app, data is pushed to Blynk Cloud via `Blynk.virtualWrite()` over TLS. In parallel, the firmware POSTs JSON to the custom dashboard every 5 s. The two outputs are independent: Blynk is toggled by V50; the dashboard always receives data.

### 3.3 Modular Design

The I²C bus is the backbone - two wires (SDA/SCL), unique addresses per device. Qwiic connectors make compatible sensors plug-and-play. The ADS1115 is the main enabler: the ESP8266 has only one native analog pin; each ADS1115 adds four channels over I²C. Two units (0x48 and 0x49) give eight analog channels on two wires. Core platform: ESP8266, I²C, at least one ADS1115, Blynk, power. Optional modules are interchangeable: swap soil sensor, photocell→TSL2561, add BME280 (pressure), PIR→RCWL-0516, more MQ sensors on ADS2 A1–A3. **Table 2** (sensor module menu: module, measures, connection, status, swap alternative) is in the full paper.

---

## 4. Access and Interface

The **primary** interface is the custom deployed web dashboard (e.g. https://field-monitor-dashboard.onrender.com) - Node.js/Express, open-source (**field-monitor-dashboard**), deployable via Render or self-hosted. It provides: real-time push via Server-Sent Events (SSE); sensor cards and status chips; nine time-series charts; a free GPS map with trail (OpenStreetMap + Leaflet.js - no API key, no paid Blynk plan); one-click JSON export; and file persistence (current.json, history.json) every 10 s and on shutdown. Optional API key gates write endpoints. **Blynk** is optional: when V50 is ON, gauges, SuperChart, soil %, motion LED, and threshold push notifications are available; the GPS map on Blynk requires a paid plan - our dashboard offers it free. Physical outputs: NeoPixel (green/yellow/red by thresholds), buzzer for alerts.

Field use: power on, tether to phone hotspot, wait for GPS fix (30–60 s with sky view), then stream to the dashboard (and optionally Blynk); move sites and compare via the GPS trail; thresholds trigger Blynk push plus LED and buzzer.

---

## 5. Security and Data

All data to Blynk is encrypted (TLS); each device uses a unique auth token; WiFi is WPA2. The dashboard can use an API key on write and HTTPS (e.g. Let’s Encrypt). No PII is collected.

Data collected: temperature and humidity (Si7021); light, soil, water, flame, gas (ADS1115s); sound (board ADC); motion (PIR); GPS (SAM-M8Q). Barometric pressure is not in the current build. WiFi credentials and Blynk token are stored in flash and are not transmitted after the initial handshake.

Transmission: sensors → ESP8266 → Blynk Cloud (TLS) and/or POST to dashboard. Storage: Blynk on provider servers; dashboard as JSON on the user’s server (persisted to disk every 10 s and on shutdown). Data on Blynk is only for the authenticated user; dashboard data is on user-controlled infrastructure. Sharing is opt-in; collaborative research dashboards are a possible future step [4].

---

## 6. Implementation Notes

**Firmware.** Custom Arduino + Blynk on ESP8266; fully non-blocking (no `delay()`). In `setup()`: Blynk.begin(), Wire.begin(), I²C scan (0x40, 0x42, 0x48, 0x49), init Si7021, both ADS1115s, GPS; BlynkTimer callbacks (pushTempHumidity, pushAdc, pushAds1115, pushGps, updateEnvLed) at 2 s (500 ms for LED). In `loop()`: Blynk.run(), timer.run(), button poll. Each callback reads, validates (NaN/range), then Blynk.virtualWrite() and Serial log; invalid → −999. HTTP POST to dashboard every 5 s with full JSON. Virtual pin map: see **Table 3** in the full paper (V5–V7 Si7021; V0/V8 sound; V20–V23, V26 ADS1115; V30–V34 GPS; V36 motion; V50 Blynk enable; etc.).

**Dashboard.** Node/Express, POST /api/data, GET /api/history, SSE; persistence to JSON; optional Blynk webhook at /api/webhook/blynk.

**Challenges I ran into:**

- **Breadboard center gap.** I had placed parts so pins crossed the center gap; the two halves of each row are not connected. Moving everything to one side of the gap fixed intermittent I²C failures.
- **Dual ADS1115.** Each needs a different address: ADDR→GND = 0x48, ADDR→VDD = 0x49. After fixing the breadboard, the scan showed both.
- **ADS1115 floating inputs.** Unused channels read noise. I wired each channel (photocell to A3, soil to A0, water to A1, flame to A2); then readings responded correctly.
- **MQ2 power.** The MQ2 heater needs 5 V. On 3.3 V readings were wrong. I connected VCC to the board’s VIN (USB 5 V) and kept the analog output to the ADS1115.
- **GPS.** The SAM-M8Q needs sky view for a fix. Indoors I got SIV = 0 and −999 coordinates; at a window or outside it locked in 30–60 s with 12 satellites.
- **BMP180 (abandoned).** It never appeared at 0x77 on the I²C scan while Si7021, both ADS1115s, and GPS did. I concluded the module was likely faulty. I removed it and left the firmware init behind a flag for a future barometric sensor (e.g. BME280).
- **Servo.** The kit included a servo and the firmware reserves V24/V17, but I did not connect it - no clear “site health” gauge was defined for this build; it remains an option for future work.

---

## 7. Group Contribution

I completed this project on my own. I chose the hardware, wrote the firmware and the custom web dashboard, deployed the dashboard (e.g. to Render), and worked through the implementation issues above.

---

## 8. Conclusion and Future Work

The Portable Environmental Field Logger shows that multi-channel, GPS-tagged, cloud-connected field sensing is achievable at low cost with open-source hardware and software. I wanted users to have a choice between a vendor platform (Blynk) and a self-hosted dashboard, so the device streams to both. The custom dashboard avoids subscription limits and message caps and adds free GPS mapping, time-series charts, real-time SSE, file-based persistence, and one-click JSON export.

**Future work:** Add a barometric sensor (e.g. BME280) on I²C; connect the servo as a site-health gauge; add dashboard alerts (email, Telegram); opt-in shared dashboards for teams; ESP32 BLE bridge for offline field use; optional SD card for offline logging.

---

## References

1. Katie B. Internet of Things (IoT) for Environmental Monitoring. *Int J Comput Eng.* 2024;6(3):29-42.
2. Laha SR, et al. Advancement of Environmental Monitoring System Using IoT and Sensor. *AIMS Environ Sci.* 2022;9(6):771-800.
3. Sathyamoorthy A, et al. Advances and Challenges in IoT Sensors Data Handling and Processing in Environmental Monitoring Networks. *HAFED POLY J.* 2024;5(2):40-60.
4. Hameed S, et al. Design and Development of an Open-Source Framework for Citizen-Centric Environmental Monitoring and Data Analysis. *Sci Rep.* 2022;12:14416.
5. Barros N, et al. SchoolAIR: A Citizen Science IoT Framework Using Low-Cost Sensing for Indoor Air Quality Management. *Sensors.* 2024;24(1):148.
6. U.S. EPA. Air Sensor Toolbox. https://www.epa.gov/air-sensor-toolbox
7. Bresnahan P, et al. A Low-Cost, DIY Ultrasonic Water Level Sensor for Education, Citizen Science, and Research. *Oceanography.* 2023;36(1).

*Full reference list and Tables 1–4 (competitor comparison, sensor module menu, virtual pin map, security comparison) are in the main report (Final_Project_Paper.md).*

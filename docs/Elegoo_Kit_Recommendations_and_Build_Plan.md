# Elegoo 37-in-1 Kit → Blynk Board: Recommendations & Build Plan

Based on the **Elegoo 37 Sensor Kit Tutorial (UNO/Mega)** and your **Portable Environmental Field Logger** inventory (Blynk Board + KOOKYE/SparkFun sensors), here’s how the kit lessons map to your hardware and what you can build **right now** for your final presentation.

---

## 1. Elegoo Tutorial vs Your Hardware

### Important difference: UNO vs Blynk Board

| | Elegoo tutorial | Your setup |
|---|----------------|------------|
| **Board** | Elegoo UNO R3 / Mega 2560 | SparkFun Blynk Board (ESP8266) |
| **Logic level** | 5 V | **3.3 V** — do not feed 5 V into GPIO |
| **Pins** | D2, D3, A0, etc. | GP0, GP4, GP5, GP12, GP13 (+ I2C) |
| **Analog** | Built-in ADC (A0–A5) | 1 native ADC; **ADS1115** for 4 channels |
| **Libraries** | Arduino only | Add **Blynk** + same sensor libs (DHT, etc.) |

**Rule:** When you follow an Elegoo lesson, **remap**:
- Arduino pin → your GPIO (see your pin budget).
- 5 V → use **3.3 V** for sensor VCC where possible (many Elegoo modules work at 3.3 V).
- Analog pin → ADS1115 channel (Ch0–Ch3) if you need analog.

---

## 2. Sensor Overlap: Elegoo Lessons ↔ Your Inventory

These Elegoo lessons apply directly to what you have or can add:

| Elegoo lesson | Sensor | Your hardware | Blynk pin / interface |
|---------------|--------|----------------|------------------------|
| **Lesson 2** | DHT11 temp/humidity | DHT11 (KOOKYE) | **GP4** (digital, 10K pull-up) |
| **Lesson 9** | Passive buzzer | Passive buzzer (KOOKYE) | **GP0** or GP13, use `tone()` |
| **Lesson 4** | Button switch | Toggle + pushbuttons (SparkFun) | **GP0** (or spare GPIO) |
| **Lesson 14** | Light dependent resistor (LDR) | Mini photocell (SparkFun) | **ADS1115 Ch0** (with 10K divider) |
| **Lesson 15** | Microphone module | SparkFun Sound Detector | **ADS1115 Ch1** (envelope) |
| **Lesson 19** | Flame sensor | Flame detection (KOOKYE) | Digital → spare GPIO, or **ADS1115 Ch2** for AO |
| **Lesson 20** | Touch sensor | Digital touch (KOOKYE) | Digital GPIO or ADS1115 if AO |
| **Lesson 3** | DS18B20 temperature | DS18B20 (KOOKYE) | OneWire on one digital pin (e.g. GP14) |
| **Lesson 27** | Relay module | Two-way relay (KOOKYE) | Digital GPIO if you add control later |

Your **core field logger** already uses: DHT11, BMP180 (I2C), Soil Moisture (I2C), Photocell (ADS1115), Sound Detector (ADS1115), PIR (GP12), GPS (I2C), Servo (GP5), LEDs (GP13), Buzzer (GP0). The Elegoo DHT11 and passive-buzzer lessons are the most directly useful for wiring/code patterns.

---

## 3. Recommendations for Your Final Presentation

Aligned with the **Final Project Rubric** (Social need 30, Competitors 20, Sketches 25, Security 25) and the **photo/video** requirements:

### 3.1 Sketches & photos (rubric: “Sketches”)

- **Sketch 1 – System architecture:** Data flow sensors → Blynk Board → WiFi → Blynk Cloud → app. You already have the diagram in your requirements; keep it and add a short “security” note (TLS, tokens, no PII).
- **Sketch 2 – Physical/wiring diagram:** Build the breadboard exactly per your **Pin Budget** (field_logger_inventory). Use the Elegoo-style approach: one function per lesson, but **wired for ESP8266** (3.3 V, your GPIO map). Then:
  - **Overhead photo** of full breadboard.
  - **Close-ups:** I2C devices (BMP180, ADS1115, Qwiic cables), analog inputs (photocell + sound on ADS1115), digital (DHT11, PIR), outputs (servo, LEDs, buzzer).
- **Sketch 3 – Blynk app:** Screenshot or mockup of gauges (temp, humidity, pressure), graph (light/sound), soil moisture, motion LED, GPS map.
- **Sketch 4 – Use case:** Short narrative: carry station to site → place → tether to phone hotspot → data to Blynk → compare sites / alerts.

**Elegoo-specific tip:** The tutorial’s “wiring diagram” + “schematic” pattern is good for the presentation: show one clear diagram per “block” (sensors / I2C / outputs) and label every component as in your requirements.

### 3.2 Demo “build” for the video

- **Minimum viable demo:** Blynk Board + WiFi + DHT11 (temp/humidity) + one I2C sensor (e.g. BMP180) + one output (LED or buzzer). Stream at least temp/humidity (and optionally pressure) to Blynk; show one alert or LED/buzzer reaction. That satisfies “how the technology will be accessed and used” and “functionalities.”
- **Full build (if time):** Add Soil Moisture + photocell + sound on ADS1115, PIR, servo/gauge, and GPS (outdoor). Use Elegoo Lesson 2 (DHT11) and Lesson 9 (buzzer) only as **reference**; your pinout and Blynk code are from your inventory.

### 3.3 Security (rubric)

- Briefly state: TLS for device–cloud and app–cloud, Blynk auth token, WPA2, no PII, data only for the authenticated user. One slide or one paragraph in the script is enough.

### 3.4 Competitors & social need

- Use the competitor table and “social need” bullets you already have (e.g. cost vs HOBO/Kestrel/Davis, GPS, open source, expandable). No change needed from your requirements doc.

---

## 4. What You Can Build *Right Now* (with Blynk + your sensors)

### 4.1 Phase 1 – “Proof of concept” (same day)

**Hardware:**

- Blynk Board (USB power).
- **DHT11** → GP4 (data), 3.3 V, GND, **10K pull-up** (data to 3.3 V).
- **BMP180** → I2C (SDA/SCL + 3.3 V + GND) — or onboard Si7021 if you prefer only temp/humidity.

**Software:**

- Arduino IDE: ESP8266 board support, Blynk library, DHT library.
- Sketch: connect WiFi (Blynk), read DHT11 every few seconds, send temp + humidity to Blynk (e.g. `Blynk.virtualWrite(V0, temp)` / `V1, humidity`). Optionally read BMP180 and send pressure to V2.

**Blynk app:**

- Two (or three) Value/Display widgets for temp, humidity, (pressure). No wiring diagram needed yet; this proves “sensors → board → cloud → app.”

**Elegoo reference:** Lesson 2 (DHT11 wiring and library use). Ignore UNO pin numbers; keep “one data pin + pull-up + same DHT library.”

---

### 4.2 Phase 2 – “Presentation-ready breadboard”

**Add to Phase 1:**

- **I2C bus:** BMP180, ADS1115, Qwiic Soil Moisture, Qwiic GPS (same SDA/SCL, 3.3 V, GND).
- **ADS1115:**  
  - Ch0: photocell (with 10K to GND).  
  - Ch1: Sound Detector envelope.
- **Digital:**  
  - PIR → GP12.  
  - DHT11 → GP4 (unchanged).
- **Outputs:**  
  - Servo → GP5.  
  - LEDs (with 220–330 Ω) → GP13.  
  - Passive buzzer → GP0 (use `tone()` as in Elegoo Lesson 9).

**Code:**

- One loop: read all sensors (DHT11, BMP180, ADS1115 Ch0/Ch1, PIR), read soil moisture and GPS if connected; `Blynk.virtualWrite` for each; drive servo/LEDs/buzzer from thresholds or Blynk buttons.
- Optional: Blynk Button → trigger buzzer or “ready for photo” LED so you can sync a live demo with the video.

**Photos:**

- Overhead + close-ups per your checklist. No extra “camera wiring” on the board; you take the photos with your phone.

---

### 4.3 Phase 3 – “Optional add-ons” (from Elegoo / KOOKYE)

If you have time and spare pins/ADC:

- **Flame sensor (Elegoo Lesson 19):** DO → spare digital GPIO, or AO → ADS1115 Ch2. Good for “expandable” and “more variables” in the narrative.
- **DS18B20 (Elegoo Lesson 3):** OneWire on one GPIO (e.g. GP14) for water/soil temp. Fits “field logger” story.
- **Relay (Elegoo Lesson 27):** One digital GPIO to drive relay for “future: pump/fan control.” Mention in slides only if you don’t wire it.

Use **3.3 V** for all these modules where the datasheet allows it; otherwise use a level shifter or a 5 V rail only for the module (not for Blynk GPIO).

---

## 5. Quick Reference: Elegoo Lessons to Use

- **Lesson 2** – DHT11: wiring, 10K pull-up, DHT library. → Your **GP4**.
- **Lesson 9** – Passive buzzer: `tone(pin, freq)` / `noTone()`. → Your **GP0** (or GP13).
- **Lesson 1** – Add libraries: same in Arduino IDE for ESP8266 (Blynk, DHT, Adafruit BMP085, Adafruit ADS1X15, etc.).
- **Lesson 4** – Button: digital read, pull-up. → Your toggle/pushbutton on **GP0** or spare GPIO.
- **Lesson 14** – LDR: analog read; your version is photocell on **ADS1115 Ch0** (already in your design).
- **Lesson 19** – Flame: DO or AO. → Spare GPIO or **ADS1115 Ch2** if you add it.
- **Lesson 3** – DS18B20: OneWire. → One digital pin if you add it.

---

## 6. Summary

- **Elegoo 37-in-1 tutorial:** Use it for **sensor behavior and wiring patterns** (DHT11, buzzer, LDR, flame, etc.). Always **remap** to Blynk Board pins and **3.3 V**, and use **ADS1115** for analog where you don’t use the native ADC.
- **Final presentation:** Stick to your existing rubric and photo checklist; use a **minimum demo** (DHT11 + one I2C + Blynk + one output) for the video, and a **full breadboard** for Sketch 2 and photos.
- **Build order:** Phase 1 (DHT11 + Blynk + optional BMP180) → Phase 2 (full pin budget + Blynk widgets + photos) → Phase 3 (flame/DS18B20/relay only if time).

If you want, next step can be a **single Arduino sketch skeleton** (Blynk + DHT11 + BMP180 + ADS1115 + PIR + servo/LED/buzzer) with your exact pin numbers and virtual pins so you can paste and fill in thresholds.

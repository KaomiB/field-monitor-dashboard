# Precise Wiring Table + Mutability + Soldering Guide

> **OUTDATED (2026-03-15):** This doc reflects an **earlier config** (single ADS1115, DHT11 on pin 12, photocell on A0, sound on ADS A1, Qwiic soil, door on pin 16). The current `FinalProject.ino` uses a very different setup: two ADS1115s, PIR on GPIO 12, BMP180, MQ2 gas, flame, water, no DHT11, door disabled. The **I2C bus wiring**, **power/GND conventions**, **soldering advice**, and **mutability tips** are still valid. For the current pin map and channel assignments see `field_logger_inventory.md`.

**Board:** SparkFun Blynk Board (ESP8266). **3.3V only.** No 5V on GPIO (exception: MQ2 heater needs 5V on its VCC, keep its AO signal under 3.3V via ADS1115).

**Convention:** Wire colors used below — **red** = 3.3V, **black** = GND, **blue** = SDA, **yellow** = SCL, **green** = signal/data, **white** = alternate signal. Use whatever you have; label with tape or markers.

---

## 1. Blynk Board pin reference (edge holes)

| Hole label | GPIO | Arduino name | Use in this project | Notes |
|------------|------|--------------|---------------------|--------|
| **GND**    | —    | —            | Common ground       | All black wires here or to GND rail |
| **3.3V**   | —    | —            | Power rail          | All red wires here or to + rail |
| **0**      | D0   | 0            | Button (built-in)   | 10k pull-up on board; don't use for sensors |
| **4**      | D4   | 4            | RGB LED (WS2812)    | Onboard; no wiring |
| **5**      | D5   | 5            | Blue LED            | Onboard; no wiring |
| **12**     | D12  | 12           | DHT11 data (OUT)    | Needs 10k pull-up to 3.3V on data line |
| **13**     | D13  | 13           | Free GPIO           | Optional: external LED, buzzer |
| **15**     | D15  | 15           | Servo signal        | 10k pull-down on board; PWM |
| **16**     | D16  | 16           | Door switch (Lab 6B)| Add 10k pull-down to GND if erratic |
| **ADC**    | A0   | A0           | Sound envelope (AO) | 0–3.3V; board ADC or ADS1115 A1 |
| **I2C** (4 holes) | D2=SDA, D14=SCL | — | GPS, ADS1115, Soil | GND, 3.3V, SDA, SCL — shared bus |

**Do not use for sensors:** RX (D8), TX (D7), RST — they are used for programming/serial.

---

## 2. Precise wiring table (sensor → board)

Each row: **sensor/module**, **pin/wire name**, **connects to**, **wire color**, **pull-up/down**, **Blynk V-pin**.

| # | Sensor / Module | Pin / Wire | Connects To | Color | Resistor | Virtual pin |
|---|------------------|------------|-------------|--------|----------|-------------|
| 1 | **Blynk Board** | 3.3V | Breadboard red (+) rail | Red | — | — |
| 2 | **Blynk Board** | GND | Breadboard blue (−) rail | Black | — | — |
| 3 | **Blynk Board** | I2C GND | Same as (2) | Black | — | — |
| 4 | **Blynk Board** | I2C 3.3V | Same as (1) | Red | — | — |
| 5 | **Blynk Board** | I2C SDA | Breadboard **SDA row** (e.g. row 10) | Blue | — | — |
| 6 | **Blynk Board** | I2C SCL | Breadboard **SCL row** (e.g. row 11) | Yellow | — | — |
| 7 | **SAM-M8Q GPS** | VCC, GND, SDA, SCL | 3.3V rail, GND rail, SDA row, SCL row | Red, Black, Blue, Yellow | — | V30–V34 |
| 8 | **ADS1115** | VDD, GND, SDA, SCL | 3.3V, GND, SDA row, SCL row | Red, Black, Blue, Yellow | — | V20, V21 |
| 9 | **ADS1115** | A0 | Photocell divider middle (see below) | Green | 10k divider (photocell + 10k to GND) | V20 |
| 10 | **ADS1115** | A1 | Sound detector **envelope (AO)** | Green | — | V21 |
| 11 | **Sound detector** | VCC, GND | 3.3V rail, GND rail | Red, Black | — | — |
| 12 | **Sound detector** | AO (envelope) | ADS1115 A1 **or** Blynk **ADC** (A0) | Green | — | V21 or V0/V8 |
| 13 | **Photocell** | Leg 1 | 3.3V rail | Red | — | — |
| 14 | **Photocell** | Leg 2 | One end of 10k resistor + wire to ADS1115 A0 | — | 10k to GND (voltage divider) | V20 |
| 15 | **DHT11** | + (VCC) | 3.3V rail | Red | — | — |
| 16 | **DHT11** | − (GND) | GND rail | Black | — | — |
| 17 | **DHT11** | OUT (data) | One breadboard row: OUT + **10k to 3.3V** + wire to Blynk **pin 12** | Green | **10k pull-up** to 3.3V | V22, V23 |
| 18 | **Door switch (reed)** | COM / NO | Blynk **pin 16**; other terminal → GND | Green, Black | Optional: **10k pull-down** to GND on pin 16 | V25 |
| 19 | **Servo** | Signal (orange) | Blynk **pin 15** | Orange/White | — | V24, V17 |
| 20 | **Servo** | VCC (red) | 3.3V rail | Red | — | — |
| 21 | **Servo** | GND (brown) | GND rail | Black | — | — |
| 22 | **Qwiic Soil Moisture** | Qwiic 4-pin | Same I2C bus (SDA/SCL + 3.3V/GND) — chain or adapter to SDA/SCL rows | Red, Blue, Yellow, Black | — | V26 |

**Si7021:** Onboard; no wiring. **Button:** Onboard on pin 0; no wiring.

---

## 3. Optional / alternate configurations

| Config | What’s connected | Skip |
|--------|-------------------|------|
| **Minimal** | Power, I2C (4 wires), GPS only + Si7021 (onboard) + Sound on **board ADC (A0)** | ADS1115, DHT11, photocell, door, servo, soil |
| **With ADS1115** | Above + ADS1115 on I2C; photocell → A0, sound → A1 | DHT11, door, servo, soil (optional) |
| **Full** | All: GPS, ADS1115 (light + sound), DHT11 (pin 12), door (16), servo (15), soil (I2C) | — |

To swap configs without rewiring everything: use **connectors** (see Mutability below) so you can unplug modules you don’t need for a given run.

---

## 4. Mutability: how to keep things swappable

### Use connectors (no solder on sensor side when possible)

- **I2C devices:** Use **Qwiic cables** for GPS, Soil Moisture. Use a **Qwiic-to-breadboard** or **Qwiic-to-Dupont** adapter so the I2C bus (SDA/SCL/3.3V/GND) is on the breadboard; plug/unplug devices without touching the board.
- **Single-wire digital (DHT11, door):** Use **female Dupont** on the sensor side and **male** from the breadboard row to the Blynk pin. One cable per signal so you can replace DHT11 with another sensor (e.g. DS18B20) by changing only that cable and the code.
- **Servo:** Use a **servo extension** or a short 3-pin Dupont cable (signal, 3.3V, GND) so you can unplug the servo without desoldering.

### Label cables and rows

- **Tape or tags** on jumpers: e.g. “D12”, “D16”, “SDA”, “A0”.
- **Breadboard:** Reserve fixed rows for SDA (e.g. 10) and SCL (e.g. 11); always plug I2C into those. Use another reserved row for “pin 12” and “pin 16” so you know where to plug DHT11 and door.

### Code-side config (swap without moving wires)

- In the `.ino`, group each sensor behind **#define ENABLE_XXX** (e.g. `ENABLE_DHT11`, `ENABLE_DOOR`, `ENABLE_SERVO`, `ENABLE_SOIL`). In `setup()`, only call `timer.setInterval(...)` and init for those that are defined. Then you can comment one line to disable a sensor (e.g. DHT11) and reflash instead of rewiring.

---

## 5. What to solder (for stability, less flimsy)

### High impact — solder these first

| What | Why |
|------|-----|
| **Male pin headers into the Blynk Board edge holes** | The board has **holes**, not pins. Solder **2.54 mm male pin headers** (strip of 8–10 pins) into GND, 3.3V, 12, 13, 15, 16, 0, ADC so jumpers plug in firmly instead of alligator clips or loose Dupont. |
| **I2C “tail” (4 wires)** | Solder a short 4-wire cable (GND, 3.3V, SDA, SCL) to the **I2C holes** on the Blynk Board, with the other end as **female Dupont** or a **4-pin connector**. Plug this once into the breadboard SDA/SCL rows and power; all I2C devices then share that one plug. No repeated poking into the board. |

### Medium impact

| What | Why |
|------|-----|
| **Qwiic-to-Dupont adapter (if you have a bare Qwiic footprint)** | Lets you plug Qwiic devices (GPS, Soil) into a breadboard SDA/SCL/power without stressing the board’s I2C holes. |
| **DHT11 pull-up as a small module** | Solder a **10 kΩ resistor** between two pins of a **small 2-pin or 3-pin header** (e.g. one pin = “data”, one = “3.3V”). Plug “data” into the same row as DHT11 OUT and Blynk 12, “3.3V” into the red rail. One unit, no loose resistor. |
| **Door switch pull-down** | If pin 16 is noisy: solder a **10 kΩ resistor** from a short wire that goes to **pin 16** to a wire that goes to **GND**. Plug in line with the door switch so pin 16 has a defined level when the reed is open. |

### Do **not** solder (keep swappable)

- **DHT11, door switch, photocell, sound module** — keep as plug-in (Dupont or breadboard) so you can swap or remove them.
- **Servo** — keep a cable/connector between servo and board.

### Summary

- **Solder:** Board pin headers (GND, 3.3V, 12, 13, 15, 16, 0, ADC), I2C 4-wire tail to one connector, optional DHT11 pull-up blob, optional door pull-down.
- **Don’t solder:** Sensor modules themselves; use cables and connectors so configurations stay mutable.

---

## 6. Breadboard row map (example)

Use one consistent mapping so you can rebuild quickly:

| Row (example) | Net | What plugs here |
|---------------|-----|------------------|
| Red (+) rail | 3.3V | Blynk 3.3V, all VCCs |
| Blue (−) rail | GND | Blynk GND, all GNDs |
| 10a–10j | SDA | Blynk I2C SDA, GPS SDA, ADS1115 SDA, Soil SDA |
| 11a–11j | SCL | Blynk I2C SCL, GPS SCL, ADS1115 SCL, Soil SCL |
| 15a–15j | Photocell divider mid | Photocell leg 2, 10k resistor leg, wire to ADS1115 A0 |
| 20a–20j | Pin 12 (DHT11) | DHT11 OUT, 10k to 3.3V, wire to Blynk 12 |
| 21a–21j | Pin 16 (door) | Door switch wire to Blynk 16, optional 10k to GND |

---

## 7. Quick checklist before power

- [ ] No 5V anywhere on Blynk GPIO or ADC.
- [ ] All VCCs at 3.3V.
- [ ] DHT11 data line: 10k from data to 3.3V.
- [ ] I2C: SDA and SCL each in one common row (no mix with 3.3V/GND).
- [ ] Servo: signal on 15, power on 3.3V (not 5V).
- [ ] Door: one side to pin 16, other to GND; optional 10k pull-down on 16.

After wiring, run I2C scan (sketch does this at boot): expect **0x40** (Si7021), **0x42** (GPS), **0x48** or **0x49** (ADS1115), **0x28** (Soil) if all connected.

---

## 8. ADS1115 checklist

If ADS1115 is not found or V20/V21 are wrong, see **`ADS1115_Troubleshooting.md`**. Quick checks:

| Check | Detail |
|-------|--------|
| VDD | ADS1115 VDD → 3.3 V (red rail). |
| GND | ADS1115 GND → common GND. |
| SDA / SCL | Same I2C bus as Blynk and GPS (blue = SDA, yellow = SCL). |
| ADDR | GND = 0x48, VDD = 0x49. Sketch tries both. |
| A0 / A3 | Soil (or resistive sensor) → A0 (Ch0); Photocell (divider) → A3 (Ch3). Sound uses board ADC in current build. |

If GPS works but ADS1115 does not, the bus is fine; focus on ADS1115 power and ADDR.

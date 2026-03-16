# Known Connections (Editable)

Last updated: 2026-03-15  
Primary source: `Sparkfun_Blynk_Board0.ino` (labs sketch in active use)

Use this as the working "source of truth" for your circuit diagram prompt.  
Anything marked `UNKNOWN` is intentionally left for you to fill in.

---

## 1) Controller / Platform

- Board family: NodeMCU 1.0 (ESP8266) / SparkFun Blynk Board
- Firmware file: `Sparkfun_Blynk_Board0.ino`
- Logic level: 3.3V
- Shared ground required: Yes

Editable notes:

- Exact board currently used (circle one): `SparkFun Blynk Board` / `NodeMCU` / `UNKNOWN`
- USB power source: `UNKNOWN`

---

## 2) Power Rails (Current Understanding)

- 3.3V rail powers: I2C devices, most sensors, NeoPixel logic path
- 5V (VIN/USB) rail used for: MQ2 heater (per project notes)
- GND: common ground for all modules

Editable checks:

- [ ] Confirm MQ2 VCC is on 5V VIN (not 3.3V)
- [ ] Confirm all module grounds are tied together
- [ ] Confirm servo power rail (`3.3V` or external `5V`): `UNKNOWN`
- [ ] Confirm any level shifting needed: `UNKNOWN`

---

## 3) I2C Bus Devices

I2C bus initialized with `Wire.begin()`.

| Device | Address | Status | Notes |
| --- | ---: | --- | --- |
| Si7021 (onboard) | 0x40 | Confirmed in code | Temp/Humidity |
| ADS1115 #1 | 0x48 (preferred) | Confirmed in code | Falls back to 0x49 if needed |
| ADS1115 #2 | 0x49 (preferred) | Confirmed in code | Falls back to 0x48 if needed |
| SAM-M8Q GPS | 0x42 | Confirmed in code | GNSS over I2C |
| BMP180/BMP085 | 0x77 (expected) | Partially uncertain | Code supports sensor; physical wiring confirmation needed |

Editable checks:

- [ ] Confirm SDA physical pin/wire path: `UNKNOWN`
- [ ] Confirm SCL physical pin/wire path: `UNKNOWN`
- [ ] Confirm pull-ups present (board/module): `UNKNOWN`
- [ ] Confirm BMP180 appears in scan: `UNKNOWN`

---

## 4) Analog Inputs

### Native ADC (ESP8266 A0 / ADC pin)

| Signal | Firmware use | Blynk virtual pins |
| --- | --- | --- |
| ADC raw | `analogRead(A0)` | `V0` |
| ADC voltage (scaled to 3.3V) | `(raw/1023)*3.3` | `V8` |

Known behavior:

- ADC is used for labs where pot/photocell/soil/sound may be swapped onto A0.
- Servo auto-mapping uses ADC raw input in current sketch.

Editable fields:

- Current sensor wired to A0 right now: `UNKNOWN`
- A0 wire color: `UNKNOWN`

### ADS1115 channels

| ADC | Channel | Connected Sensor | Cloud mapping |
| --- | --- | --- | --- |
| ADS1115 #1 | A0 | Soil moisture (voltage) | Not currently written to dedicated V-pin in active sketch |
| ADS1115 #1 | A1 | Water level | `V21` |
| ADS1115 #1 | A2 | Flame sensor | Dashboard only (no dedicated Blynk pin) |
| ADS1115 #1 | A3 | Photocell/light | Not currently written to dedicated V-pin in active sketch |
| ADS1115 #2 | A0 | MQ2 gas analog out | `V22` |
| ADS1115 #2 | A1 | `UNKNOWN` | `UNKNOWN` |
| ADS1115 #2 | A2 | `UNKNOWN` | `UNKNOWN` |
| ADS1115 #2 | A3 | `UNKNOWN` | `UNKNOWN` |

Note: Some docs mention different V-pin assignments (e.g., V23 for gas, V20 for soil).  
For diagram generation, prioritize active sketch mappings unless you intentionally switch to final-project mapping.

---

## 5) Digital / GPIO Connections

| Function | GPIO | Direction | Blynk virtual pins | Status |
| --- | ---: | --- | --- | --- |
| RGB NeoPixel data | GPIO4 | Output | `V2`,`V3`,`V4`,`V15` | In active use |
| Servo signal | GPIO15 | Output | `V24` input, `V17` feedback | In active use |
| Physical button | GPIO0 | Input (`INPUT_PULLUP`) | `V1` LED widget behavior | In active use |
| PIR motion | GPIO12 | Input | `UNKNOWN` in active sketch | Mentioned in docs, confirm wiring |

Editable fields:

- Servo model: `UNKNOWN`
- PIR module actually connected now (`yes/no`): `UNKNOWN`

---

## 6) Virtual Pin Map (Active Sketch)

| V-pin | Meaning |
| --- | --- |
| V50 | Push enable switch |
| V0 | ADC raw |
| V8 | ADC voltage |
| V5 | Si7021 temperature F |
| V6 | Si7021 temperature C |
| V7 | Si7021 humidity |
| V9 | Party mode LED control |
| V21 | Water level (ADS1115 #1 A1 voltage) |
| V22 | Gas voltage (ADS1115 #2 A0) |
| V30 | GPS latitude |
| V31 | GPS longitude |
| V32 | GPS altitude |
| V33 | GPS speed |
| V34 | GPS satellites |
| V35 | Pressure hPa (BMP180/BMP085) |
| V2,V3,V4,V15 | RGB controls |
| V24,V17 | Servo control/readback |
| V1 | Button LED widget |

---

## 7) Unknowns To Fill From Your Photo

When you inspect your wiring photo, fill these in:

- Breadboard power rails orientation (`top/bottom/left/right`): `UNKNOWN`
- Which modules are on board A vs board B (if two breadboards): `UNKNOWN`
- Exact jumper colors by net (3.3V, 5V, GND, SDA, SCL, A0, GPIO15): `UNKNOWN`
- Any modules currently disconnected: `UNKNOWN`
- Any temporary jumpers/clips not in final build: `UNKNOWN`

---

## 8) Diagram Prompt Notes (Quick Copy)

If using Claude, include this line:

> "Use the active mapping in `KNOWN_CONNECTIONS_EDITABLE.md` as the source of truth; treat `UNKNOWN` fields as unresolved and ask follow-up questions instead of guessing."

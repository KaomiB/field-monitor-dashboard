# Step-by-Step Wiring Guide — Blynk Board + Field Logger

**3.3V only** on Blynk Board. Ref: **BlynkBoardV1.pdf**. Colors: **red**=3.3V, **black**=GND, **blue**=SDA, **yellow**=SCL.

**See also:** [Wiring_Table_And_Stability.md](Wiring_Table_And_Stability.md) — precise pin-by-pin table, how to make configs swappable, and what to solder for stability (pin headers, I2C tail, pull-ups).

---

## Minimal setup: GPS + Temp + Sound only

If you're only getting **GPS**, **temp** (Si7021), and **sound** working:

- **Sketch:** Uses only Si7021 (onboard), SAM-M8Q GPS (I2C), and board ADC for sound. No ADS1115, DHT11, or servo.
- **I2C bus:** Only two devices — Si7021 (on the board) and GPS. Run 4 wires from Blynk I2C holes to breadboard (GND, 3.3V, SDA row, SCL row), then connect GPS with one Qwiic cable to the same SDA/SCL rows and power.
- **Sound:** Sound module **envelope (AO)** only → Blynk Board **ADC** hole (A0). VCC and GND to 3.3V and GND.
- **Blynk:** Turn **V50** ON. Use **V5, V6, V7** (temp), **V0, V8** (sound), **V30–V34** (GPS).

Sections 1–3 and 5 below cover power, I2C, GPS, and sound. Skip photocell (4), DHT11 (6), and optional LED (7) for this minimal setup.

---

## Your hardware (match this)

- **I2C on the board:** Four **holes** (no pins). Use **male-to-male (M–M)** jumpers — male end in each hole, other male end in breadboard. Pin order: **GND**, **3.3V**, **SDA**, **SCL**.
- **Edge (3.3V, GND, 12, 13, 15, 16, 0, ADC, etc.):** **Holes** for soldering or **alligator clips**. Don’t use RX, TX, RST for sensors.
- **Breadboards:** 2× small (30 rows), 2× large (60 rows). **Rails** = red (+) and blue (−) strips. **Middle:** rows **1–30** (or 1–60), columns **a–j**. Same row = connected.

---

## Breadboard map (where things go)

| Wire / net    | Where it goes |
|---------------|----------------|
| **GND**       | **Blue (−) rail**. Black from Blynk and all module GNDs here. |
| **3.3V**      | **Red (+) rail**. Red from Blynk and all module VCCs here. |
| **SDA (blue)**  | **Middle:** one row (e.g. **row 10**). Blynk SDA and GPS SDA (and any other I2C SDA) in this row. |
| **SCL (yellow)**| **Middle:** a different row (e.g. **row 11**). Blynk SCL and GPS SCL in this row. |

**Left vs right rails:** On most breadboards the left and right rails are **separate**. Put all modules on the same side as the Blynk Board, or jumper **left red → right red** and **left blue → right blue**.

---

## 1. Power (do this first)

1. Unplug USB.
2. One **red** wire: Blynk **3.3V** hole → breadboard **red (+)** rail.
3. One **black**: Blynk **GND** → breadboard **blue (−)** rail. Use alligator clips or M–M jumpers.

---

## 2. I2C bus to breadboard

Use **4× M–M** jumpers (black, red, blue, yellow). **Male** end into the Blynk Board’s **I2C holes** (order: GND, 3.3V, SDA, SCL). Other end to breadboard:

- **Black** → GND rail (blue −)
- **Red** → 3.3V rail (red +)
- **Blue** → **middle, row 10** (e.g. **10a**) = SDA row
- **Yellow** → **middle, row 11** (e.g. **11a**) = SCL row

All I2C devices (e.g. SAM-M8Q GPS) share row 10 for SDA and row 11 for SCL.

---

## 3. SAM-M8Q GPS (I2C)

- **One Qwiic cable** from the GPS to the breadboard (or a Qwiic-to-breadboard adapter).
- **Red** → 3.3V rail  
- **Black** → GND rail  
- **Blue (SDA)** → **same row as Blynk SDA** (e.g. row 10)  
- **Yellow (SCL)** → **same row as Blynk SCL** (e.g. row 11)

Either Qwiic port on the GPS is fine; both carry 3.3V, GND, SDA, SCL. I2C address is **0x42**.

---

## 4. Photocell → ADS1115 A0 (voltage divider)

The photocell is a **light-dependent resistor**: bright = lower resistance, dark = higher resistance. The ADS1115 measures **voltage** (0–3.3 V), so we use a **voltage divider**: photocell and a **10 kΩ** resistor in series between 3.3 V and GND; the **middle point** goes to ADS1115 **A0**.

**Wiring (pick one row, e.g. row 15):**

1. **One leg of the photocell** → 3.3 V **red rail** (any hole in the red strip).
2. **Other leg of the photocell** → one hole in **row 15** (e.g. **15a**).
3. **10 kΩ resistor** (brown–black–orange): one leg in **the same row 15** (e.g. **15b**). Other leg of the 10 kΩ → **GND rail** (blue −).
4. **Wire from that row** (e.g. **15c**) → **ADS1115 A0** (screw terminal or pin labeled A0).

So row 15 connects: photocell leg, one leg of the 10 kΩ, and the wire to A0 — all at the same voltage (the divider “middle”). The ADS1115 reads that voltage; the sketch sends it to **V20** (light: higher = brighter).

**Test:** Upload the sketch, open Serial Monitor (115200). With **V50** ON you should see `[ADS1115] light=X.XX V sound=...` every ~2 s. **Cover** the photocell → light voltage **drops**. **Uncover** it → light voltage **rises**. If it does that, the photocell and wiring are correct.

---

## 5. Sound sensor (envelope) → Board ADC (A0) or ADS1115 A1

- **VCC** → 3.3V rail  
- **GND** → GND rail  
- **Envelope (AO)** → **Blynk Board ADC hole** (labeled **ADC** on the board edge — this is A0)

Do **not** connect the sound module’s **Audio** or **Gate** outputs for this; only the **envelope (analog)** output goes to ADC. The sketch sends sound level to **V0** (raw 0–1023) and **V8** (voltage).

---

## 6. DHT11 → Pin 12

- **+** → 3.3V rail  
- **−** → GND rail  
- **OUT** (data): Use one breadboard row (e.g. **row 20**). Put **OUT** in **20a**, one leg of a **10K resistor** in **20b** (other leg → 3.3V rail), and a **wire to Blynk Board pin 12** from **20c**.

So row 20 ties together: DHT11 OUT, 10K to 3.3V, and the wire to **pin 12**.

---

## 7. LED — optional

The Blynk Board has a **blue LED** on **pin 5** and a **WS2812 RGB** on **pin 4**. The sketch can drive the RGB from **environmental** data (temp = color, sound = brightness) once you set `environmentalLedEnabled = true` in code.

For an **external LED** on the breadboard: **Pin 13** → **220Ω or 330Ω** → **LED anode**. **Cathode** → GND.

---

## Checklist (what goes where)

| Item              | Connection |
|-------------------|------------|
| Blynk 3.3V / GND  | Red / black to breadboard rails |
| Blynk I2C (4 holes) | 4× M–M: GND, 3.3V, SDA row, SCL row |
| **SAM-M8Q GPS**   | 3.3V, GND, SDA row, SCL row (one Qwiic cable to breadboard) |
| **Sound (envelope)** | 3.3V, GND, **AO → Blynk ADC** (A0) |
| **DHT11**         | **+** → 3.3V, **−** → GND, **OUT** → 10K to 3.3V + **pin 12** |
| Si7021            | Onboard (no wiring) |
| LED (optional)    | Pin 13 → resistor → LED → GND (or use onboard RGB) |

---

## After wiring

1. Check: no 5V on Blynk GPIO; all VCCs at 3.3V.
2. Install **SparkFun u-blox GNSS Arduino Library** (Library Manager).
3. Plug USB, upload sketch, Serial Monitor **115200**. You should see `[Setup] Si7021 OK`, `[Setup] DHT11 on pin 12`, and either `[Setup] SAM-M8Q GPS OK` or `not found`.
4. Blynk app: turn **V50** ON to push sensor data. Add widgets for the virtual pins below.

---

## Blynk widgets to add or change

Sensor data is pushed automatically. Add or confirm these widgets:

| Virtual pin | Data | Type | Min | Max | Default | Widget suggestion |
|-------------|------|------|-----|-----|---------|--------------------|
| **V5** | Si7021 temp (°F) | double | -40 | 120 | — | Value Display |
| **V6** | Si7021 temp (°C) | double | -40 | 50 | — | Value Display |
| **V7** | Si7021 humidity (%) | double | 0 | 100 | — | Value Display |
| **V0** | Sound raw (board ADC) | int | 0 | 1023 | — | Value Display or SuperChart |
| **V8** | Sound voltage (board ADC) | double | 0 | 3.3 | — | Value Display or SuperChart |
| **V20** | ADS1115 Ch0 — light (photocell, V) | double | 0 | 3.3 | — | Value Display or SuperChart |
| **V21** | ADS1115 Ch1 — sound envelope (V) | double | 0 | 3.3 | — | Value Display or SuperChart |
| **V22** | DHT11 temp (°C) | double | 0 | 50 | — | Value Display |
| **V23** | DHT11 humidity (%) | double | 20 | 90 | — | Value Display |
| **V30** | GPS latitude | double | -90 | 90 | — | Value Display |
| **V31** | GPS longitude | double | -180 | 180 | — | Value Display |
| **V32** | GPS altitude (m) | double | -500 | 5000 | — | Value Display |
| **V33** | GPS speed (m/s) | double | 0 | 100 | — | Value Display |
| **V34** | GPS satellites (SIV) | int | 0 | 20 | — | Value Display |
| **V2, V3, V4** | RGB LED (manual) | int (0–255) | 0 | 255 | 0 | Sliders |
| **V15** | RGB brightness | int (0–255) | 0 | 255 | 255 | Slider |

**Default:** — means sensor-driven; no fixed default (widget shows last value received).

**DHT11 (second temp) not showing?** In Blynk, add a **datastream** for **V22** (temp °C) and **V23** (humidity %), type **Double**. Then add a **Value Display** widget and set its **Data source** to that datastream. If the widget is not linked to V22/V23, or the datastream type is wrong, the value won’t show.

**Optional:** **Map** widget with **V30** (lat) and **V31** (lon) to show position. **SuperChart** on V0 or V8 for sound over time.

---

## Optional hardware (when you add them)

| What        | Where |
|------------|--------|
| **ADS1115** | I2C: 3.3V, GND, SDA row, SCL row; A0/A1 for photocell/sound if you want extra analog channels |
| **PIR**    | 3.3V, GND, OUT → **pin 16** |
| **Servo**  | Signal → **pin 15**, GND, Red → 3.3V |
| **Buzzer** | One pin → e.g. **13** or **16**; other → GND |

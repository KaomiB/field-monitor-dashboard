# Blynk Board — External Pins Setup

Use **3.3V** and **GND** for all external parts. Do not feed 5 V into GPIO.

**Current field logger:** Si7021 (onboard), DHT11 (pin 12), sound envelope (ADC), SAM-M8Q GPS (I2C).

---

## Breakout pins (from your board)

| Pin  | Use in sketch      | Available for external? |
|------|--------------------|--------------------------|
| **0**  | Physical button    | No (used)                |
| **4**  | RGB (WS2812)      | No (used)                |
| **5**  | On-board LED       | No (or share with care)  |
| **12** | DHT11 data        | No (used)                |
| **13** | —                  | **Yes**                  |
| **15** | Servo (Lab 4B)     | No (used)                |
| **16** | —                  | **Yes**                  |
| **ADC**| Sound envelope    | No (used)                |
| **I2C**| 4-pin header       | **Yes** (Si7021 onboard + SAM-M8Q GPS) |

Free for more sensors: **13**, **16**, and **I2C** (for more I2C devices).

---

## Current wiring (field logger)

### I2C (4-pin header → breadboard)

- **3.3V**, **GND**, **SDA**, **SCL** to breadboard rails and two middle rows (e.g. row 10 = SDA, row 11 = SCL).
- **SAM-M8Q GPS:** One Qwiic cable → 3.3V, GND, SDA row, SCL row (address **0x42**).
- Si7021 is on the Blynk Board; no external I2C wiring for it.

### Analog

- **ADC (A0):** Sound sensor **envelope (AO)** only. VCC → 3.3V, GND → GND. Sketch pushes to **V0** (raw), **V8** (voltage).

### Digital

- **Pin 12:** **DHT11** — VCC → 3.3V, GND → GND, **OUT** → pin 12, **10 kΩ** from OUT to 3.3V.

---

## Optional (when you add them)

| Sensor / part | Pin  | Wiring |
|---------------|------|--------|
| **PIR (HC-SR501)** | **16** (or 13) | VCC → 3.3V, GND → GND, Out → pin. |
| **LED** (external)  | **13** | 13 → 220–330 Ω → LED anode, cathode → GND. |
| **Buzzer**          | **16** or **13** | One pin → buzzer (+), (-) → GND. |
| **ADS1115**        | I2C | 3.3V, GND, SDA, SCL; Ch0/Ch1 for photocell/sound if you want extra analog. |
| **BMP180**         | I2C | Same bus, 0x77. |

---

## Quick reference

```
I2C (4 pins)    → SAM-M8Q GPS (0x42); same bus as onboard Si7021 (0x40)
ADC (A0)        → Sound sensor envelope → V0, V8
GPIO 12         → DHT11 data (10 kΩ pull-up to 3.3V)
GPIO 13 / 16    → Free (PIR, LED, Buzzer, etc.)
3.3V / GND      → All modules
```

---

## RGB environmental mode

In the sketch, **`environmentalLedEnabled`** is `false` by default. Once you confirm temp, sound, and GPS all work in Blynk:

1. Set **`environmentalLedEnabled = true`** (near the top of the sketch, with the other RGB variables).
2. Re-upload.

The onboard RGB (pin 4) will then follow **temperature** (color: cold = blue, mid = green, hot = red) and **sound** (brightness). Manual sliders V2, V3, V4 are ignored while environmental mode is on.

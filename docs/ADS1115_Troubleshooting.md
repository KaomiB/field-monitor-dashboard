# ADS1115 Troubleshooting

> **PARTIALLY OUTDATED (2026-03-15):** This doc was written for the single-ADS1115 setup. The current `FinalProject.ino` uses **two ADS1115s** (0x48 and 0x49). ADS1 channels: A0=soil, A1=water, A2=flame, A3=photocell. ADS2 A0=MQ2 gas. Sound is on the **board ADC A0** (not ADS1115). The I2C wiring checklist below is still valid; channel assignments have changed. See `field_logger_inventory.md` for the current pin map.

Use this when the Environmental Field Logger reports `[Setup] ADS1115 not found.` or when soil (V20, V26) or light (V22) readings are wrong or constant. **Current build:** ADS1 (0x48): A0=soil→V20,V26, A1=water→V21, A2=flame, A3=photocell→V22. ADS2 (0x49): A0=MQ2 gas→V23. Sound uses board ADC → V0, V8.

---

## 1. I2C scan

The main sketch can print all I2C addresses at boot. In `FinalProject.ino`:

- **Enable scan:** Uncomment `#define I2C_SCAN` near the top of the file (or add it if missing). Reflash and open Serial Monitor at 115200.
- **Look for:** `0x48` (ADS1115 with ADDR → GND) or `0x49` (ADDR → VDD). If neither appears, the ADS1115 is not on the bus → check wiring and power.

If the scan is disabled, you can temporarily enable it to confirm which devices are visible. Si7021 is often 0x40, GPS 0x42, Soil 0x28, ADS1115 0x48 or 0x49.

---

## 2. Wiring checklist

| Check | Detail |
|-------|--------|
| **VDD** | ADS1115 VDD → 3.3 V (red rail). Do not use 5 V. |
| **GND** | ADS1115 GND → common GND (black/blue rail). |
| **SDA** | ADS1115 SDA → same I2C SDA row as Blynk Board and GPS (blue wire convention). |
| **SCL** | ADS1115 SCL → same I2C SCL row (yellow wire convention). |
| **ADDR** | ADDR pin: **GND** = address **0x48** (default in sketch); **VDD** = **0x49**. Sketch tries both. |

If **GPS works** but ADS1115 does not, the I2C bus is fine → focus on ADS1115 power (VDD/GND) and ADDR. Current wiring is documented in `Documents/2025/Breadboard.md` (Board 2: ADS1115 VDD→red, GND→black, SDA/SCL to shared I2C).

---

## 3. Ch0 / Ch3 (or A0 / A3) floating or wrong

If the ADS1115 is **found** but soil (V20, V26) or light (V22) stay 0 or constant:

- **Floating inputs:** Ch0 (A0) and Ch3 (A3) may be unconnected. Unconnected channels can read noise or a constant value. For a quick test, leave them unconnected and confirm Serial shows `[ADS1115] soil=... light=...` (values may be small or noisy).
- **Soil (Ch0):** Wire soil moisture sensor (or resistive divider) to **ADS1115 A0**. Sketch reports voltage (V20) and derived % (V26).
- **Photocell (light, Ch3):** Wire a voltage divider: photocell from 3.3 V to a common row, 10 kΩ from that row to GND, wire from that row to **ADS1115 A3**. Bright light → lower photocell resistance → higher voltage at A3 → V22.
- **Sound:** In the current build, sound uses the **board ADC (A0)** hole, not the ADS1115; see FinalProject.ino and Wiring_Table_And_Stability.md.

---

## 4. Minimal test sketch (ADS1115 only)

To isolate the ADS1115 from Blynk, GPS, etc., use the minimal sketch:

- **Path:** `Arduino/ads1115_test/ads1115_test.ino`

It does: I2C scan, `ads.begin(0x48)` then `ads.begin(0x49)`, then loop reading Ch0 and Ch1 every 1 s and printing volts. No WiFi, no Blynk. Upload with the same board (Blynk Board / ESP8266) and wiring; open Serial Monitor to confirm the device is found and readings change (or are stable if A0/A1 are unconnected). In the main project, Ch0 = soil, Ch3 = photocell; you can edit the test sketch to read Ch3 instead of Ch1 to match.

---

## Quick reference

| Symptom | Action |
|---------|--------|
| `ADS1115 not found` | Enable I2C scan; confirm 0x48 or 0x49. Check VDD, GND, SDA, SCL, ADDR. |
| GPS works, ADS1115 doesn’t | Bus is OK; check ADS1115 power and ADDR pin. |
| Found but V20/V26 or V22 always 0 | Wire soil to A0 (Ch0), photocell divider to A3 (Ch3). |
| Found but values constant | Ch0/Ch3 may be floating; add sensors or accept test values. |

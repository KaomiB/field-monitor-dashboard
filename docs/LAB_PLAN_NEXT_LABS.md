# Lab plan: next few labs (from Week 5–7 slides)

**Sketch to edit:** `/home/om/Arduino/Sparkfun_Blynk_Board0/Sparkfun_Blynk_Board0.ino`  
**V50** = master switch for all sensor pushes (already in place).

---

## Done already
- **4A** – RGB sliders (V2, V3, V4, V15)
- **4B** – Servo (V24, V17, pin 15)
- **5A** – ADC / potentiometer (V0, V8, V50)

---

## Lab 5B – Humidity and temperature sensors (~40 min)
**Hardware:** On-board temp/humidity sensor only (no extra wiring).  
**Blynk:** 3 datastreams – **V5** (Temp °F), **V6** (Temp °C), **V7** (Humidity %).  
**Dashboard:** 3 Labeled Value widgets (V5, V6, V7).

**Code to add:**
- Read the board’s I2C temp/humidity sensor (e.g. HTU21D); push only when `sensorPushEnabled` (V50 on).
- **Pin conflict:** Your sketch currently uses **V6** for “app control of V1 LED”. For 5B, V6 is used for Temp °C. So either:
  - Move “app control V1 LED” to another pin (e.g. **V12**), and use V5/V6/V7 for temp/humidity; or
  - Use different virtual pins for temp/humidity if the lab allows.
- Add a timer (e.g. every 2 s when V50 on): read sensor, then `Blynk.virtualWrite(V5, tempF)`, `V6, tempC`, `V7, humidity`.
- You’ll need the sensor library (e.g. SparkFun HTU21D or the one used by the Blynk Board).

---

## Lab 5C – Light sensor (photocell)
**Hardware:** Photocell + two 10kΩ in parallel (→ 5kΩ) as voltage divider; yellow → ADC, red → 3.3V, black → GND.  
**Blynk:** Reuse **V0** (0–1023). Add **SuperChart** widget on V0.  
**Code:** No change. Your existing ADC push (V0 when V50 on) is enough. Turn V50 on and watch the chart.

---

## Lab 5 Karma – Graphite potentiometer
**Hardware:** Pencil band (e.g. 1 cm × 5 cm), red → 3.3V, black → GND, yellow → ADC.  
**Code:** No change. Same ADC/V0 as 5A.

---

## Lab 6A – Automation Part 1 (~40 min)
**Blynk:** Add datastream **V9** (integer or 0/1). Button on V9. Enable **Condition** and **Action** for V9 in Datastreams.  
**Behavior:** “Non-zero value triggers RGB LED party; 0 stops it.”

**Code to add:**
- **BLYNK_WRITE(V9):** If `param.asInt() != 0` → start an RGB “party” (e.g. rainbow or color cycle on the NeoPixel). If `0` → stop it (e.g. turn off or restore previous color).
- Implement “party” with a timer or flag: e.g. every 50–100 ms change NeoPixel color (rainbow or step through R→G→B), and stop when V9 is written 0.

---

## Lab 6B – Door sensor (magnetic switch) (~40 min, 800 Blynk energy)
**Hardware:** Magnetic door switch: red → 3.3V, green → **pin 16**. Pin 16 has internal pull-down (open = LOW, closed = HIGH).  
**Blynk:** Datastream **V20** – “Enumerable” type (e.g. 0 = "Open", 1 = "Closed"). Value widget for debugging. Enable automation (Condition/Action) for V20.  
**Behavior:** Firmware reads pin 16 and **pushes to V20 only when state changes** (so automations don’t fire every second).

**Code to add:**
- `#define DOOR_PIN 16`
- `pinMode(DOOR_PIN, INPUT);` (pull-down on board)
- Track `lastDoorState` (e.g. -1 or 0/1). In `loop()` or a timer: if `sensorPushEnabled` and `digitalRead(DOOR_PIN) != lastDoorState`, then `lastDoorState = newState`, `Blynk.virtualWrite(V20, lastDoorState)`.
- Automations in Blynk: e.g. “When V20 = Open → notify”, “When V20 = Closed → notify”. Limit period e.g. 1 s.

---

## Lab 6C – Automation Part 3 / Moisture (BotaniMail)
**Hardware:** Soil moisture sensor: VCC → 3.3V, GND → GND, SIG → **ADC**. (Same ADC as 5A/5C.)  
**Blynk:** Reuse **V0**. Automation: e.g. “When V0 &lt; 200” → send Email (with value).  
**Code:** No change. ADC already pushed to V0 when V50 on.  
**Note:** Free account limits (e.g. 20 notifications/emails per hour). Use wisely; screenshot automation config if you hit limits for submission.

**Troubleshooting (from slides):** V50 must be on for sensor data. V0 automation type should be **Sensor**. Expose V0 for conditions.

---

## Lab 7 – Wearable design
**Task:** Design only – draw an e-textile/wearable idea, name core components and where you found them. No Blynk or firmware. Due with 6C by Feb 27 (per slide).

---

## Summary: code changes by lab

| Lab | New datastreams (Blynk) | Firmware changes |
|-----|-------------------------|------------------|
| 5B  | V5, V6, V7 (temp F, temp C, humidity) | Add I2C temp/humidity read; push V5,V6,V7 when V50 on. Resolve V6 conflict with “app control V1 LED” (move to V12 or drop). |
| 5C  | Reuse V0; add SuperChart | None |
| 5 Karma | Reuse V0 | None |
| 6A  | V9 (party on/off) | BLYNK_WRITE(V9) → start/stop RGB “party” animation on NeoPixel. |
| 6B  | V20 (Enumerable: Open/Closed) | Read pin 16; push V20 only on change when V50 on. |
| 6C  | Reuse V0; automation | None |
| 7   | — | Design only |

---

## Suggested order tomorrow
1. **5B** – Add temp/humidity (and fix V6 conflict).
2. **6A** – Add V9 “RGB party” (quick and fun).
3. **6B** – Add door sensor on pin 16 → V20.
4. **5C / 6C** – Wiring + Blynk only (photocell or moisture on ADC, SuperChart/automation).
5. **7** – Draw wearable design when you have time.

Good night.

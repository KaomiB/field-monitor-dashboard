# Which Sensors Align With an Environmental Field Logger / Monitoring Kit?

This table matches **Elegoo 37-in-1 Kit** lessons and your **field logger inventory** to the idea of a **portable environmental field logger**: outdoor/indoor monitoring of weather, soil, light, sound, air, water, fire risk, and station health.

---

## What “environmental field logger” usually means

- **Weather / climate:** temperature, humidity, pressure, light level
- **Soil / water:** moisture, water level, (water) temperature
- **Air quality / hazards:** smoke, CO, flammable gas, fire
- **Sound / activity:** ambient noise (wildlife, traffic), motion (PIR), vibration
- **Location:** GPS for where the reading was taken
- **Station health:** battery voltage, tamper (enclosure open), orientation

---

## Elegoo 37-in-1 Kit — Alignment

| Lesson | Sensor / Module | Aligns with field logger? | Why |
|--------|------------------|---------------------------|-----|
| **2** | **Temperature and Humidity (DHT11)** | **Yes** | Core: air temp and humidity at the site. |
| **3** | **DS18B20 Temperature** | **Yes** | Waterproof; good for water or soil temperature. |
| **4** | Button Switch | Partial | User input (e.g. reset, mode) — utility, not “environment.” |
| **5** | **Shock / Vibration** | **Yes** | Vibration/tamper; wildlife or human disturbance. |
| **6** | **Tilt Switch** | **Yes** | Station orientation or tamper (e.g. box moved). |
| **7** | IR Receiver / Transmitter | No | Remote control; not environmental sensing. |
| **8** | Active Buzzer | Partial | Alerts; passive buzzer is usually better for tones. |
| **9** | **Passive Buzzer** | **Yes** | Audible alerts (thresholds, alarms). |
| **10** | Laser | No | Not environmental. |
| **11** | RGB LED | Partial | Status indicator (e.g. green/yellow/red). |
| **12** | Photo-Interrupter | Partial | Beam break (e.g. counting, simple presence). |
| **13** | Dual-Color LED | Partial | Status (e.g. OK / warning). |
| **14** | **Light Dependent Resistor (LDR)** | **Yes** | Ambient light; canopy cover, day/night. |
| **15** | **Microphone** | **Yes** | Ambient sound / noise level (you use Sound Detector). |
| **16** | **Reed Switch** | **Yes** | Enclosure open/tamper (like magnetic door switch). |
| **17** | **Digital / NTC Temperature** | **Yes** | Another temperature channel (air or surface). |
| **18** | Hall (magnetic) | No | Magnetic field; not typical for environmental logging. |
| **19** | **Flame Sensor** | **Yes** | Fire / flame detection (risk monitoring). |
| **20** | Touch Sensor | No | Touch input; not environmental. |
| **21** | Seven-Color Flash LED | No | Decorative. |
| **22** | Switch Light (mercury tilt) | Partial | Could indicate orientation. |
| **23** | Joystick | No | Control input; not sensing environment. |
| **24** | Line Tracking | No | Not environmental. |
| **25** | Obstacle Avoidance | Partial | Proximity; could detect “something nearby.” |
| **26** | Rotary Encoder | No | User input; not environmental. |
| **27** | **Relay** | **Yes** | Turn on pump, fan, or other actuator from thresholds. |
| **28** | Heartbeat Sensor | No | Human biometric; not field environment. |

**Summary — Elegoo kit, best fit for field logger:**  
2 (DHT11), 3 (DS18B20), 5 (Shock), 6 (Tilt), 9 (Passive Buzzer), 14 (LDR), 15 (Microphone), 16 (Reed), 17 (Digital Temp), 19 (Flame), 27 (Relay). Optional: 4 (Button), 8 (Buzzer), 11/13 (LEDs), 12 (Photo-Interrupter), 22 (Switch light), 25 (Obstacle).

---

## Your Inventory — Alignment

Your inventory is **already chosen** for a field logger. Here’s how each part fits.

### Strong fit (core environmental monitoring)

| Component | Role in field logger |
|-----------|----------------------|
| **DHT11** | Air temperature and humidity. |
| **BMP180** | Barometric pressure (weather, altitude). |
| **Onboard Si7021** | Redundant temp/humidity; cross-check with DHT11. |
| **Soil Moisture (Qwiic)** | Ground moisture for plants / habitat. |
| **Mini Photocell** | Ambient light (canopy, day/night). |
| **Sound Detector** | Ambient noise (wildlife, traffic, activity). |
| **PIR (HC-SR501)** | Motion (wildlife, human presence). |
| **GPS (SAM-M8Q)** | Where the reading was taken (tag location). |
| **ADS1115** | Expands analog inputs (photocell, sound, more later). |

### Good fit (environmental / station health)

| Component | Role in field logger |
|-----------|----------------------|
| **DS18B20** | Water or soil temperature (waterproof). |
| **MQ2 / MQ5 / MQ7** | Air quality (smoke, LPG, CO) — needs ADS1115 and warmup. |
| **Flame Detection** | Fire risk. |
| **Water Level Sensor** | Creek/pond level (via ADS1115). |
| **Vibration Sensor** | Tamper or disturbance. |
| **Voltage Sensor** | Battery level when on LiPo. |
| **Relay** | Actuate pump/fan from moisture or temp. |

### Support / user interface (not “environment” but part of the kit)

| Component | Role in field logger |
|-----------|----------------------|
| **Servo** | Physical “gauge” (e.g. site health). |
| **LEDs** | Status (good / warning / alert). |
| **Passive Buzzer** | Audible alerts. |
| **Toggle / Pushbuttons** | Mode, reset, user control. |

### Weak or no fit for “environmental” (you already set aside)

| Component | Why not used for field logger |
|-----------|-------------------------------|
| Magnetic Door Switch | Security; you noted “keep for future.” |
| Slide Pot | No clear environmental use; toggle used instead. |
| LCD | Replaced by Blynk app. |
| Digital Touch, Photosensitive/Sound modules | Redundant with your chosen sensors. |

---

## Elegoo ↔ Inventory Overlap

| Environmental use | Elegoo lesson | Your inventory |
|-------------------|----------------|-----------------|
| Air temp/humidity | 2 (DHT11) | DHT11, Si7021 |
| Water/soil temp | 3 (DS18B20) | DS18B20 |
| Light level | 14 (LDR) | Mini Photocell (ADS1115) |
| Sound | 15 (Microphone) | Sound Detector (ADS1115) |
| Fire | 19 (Flame) | Flame Detection |
| Vibration/tamper | 5 (Shock) | Vibration Sensor |
| Alerts | 9 (Passive Buzzer) | Passive Buzzer |
| Actuation | 27 (Relay) | Two-Way Relay |
| Enclosure tamper | 16 (Reed) | Magnetic Door Switch (optional) |
| Orientation/tamper | 6 (Tilt) | — (could add from Elegoo) |

---

## Suggested priority for “environmental field logger”

1. **Already in your core:** DHT11, BMP180, Soil Moisture, Photocell, Sound, PIR, GPS, ADS1115.  
2. **Add next from inventory or Elegoo:** DS18B20 (water/soil temp), Flame sensor, Water level (ADS1115 Ch3), Voltage (battery).  
3. **Then optional:** MQ2/MQ5/MQ7 (air quality), Relay (pump/fan), Reed or Tilt (tamper/orientation), Vibration.

The **Elegoo 37-in-1 kit** and your **inventory** align well: the kit gives you extra options (DS18B20, flame, tilt, reed, relay, LDR, microphone) that match the same “environmental field logger / monitoring kit” idea you already have in your inventory.

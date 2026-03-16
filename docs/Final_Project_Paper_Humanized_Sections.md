# Humanized sections for Google Doc (paste into your paper)

Use these paragraphs in place of the corresponding sections. They remove AI-style phrasing, add first-person where appropriate, and convert listy prose into continuous academic paragraphs.

---

## Abstract (revised)

Environmental monitoring works best when several variables are measured at once: temperature, humidity, light, sound, soil moisture, gas, and indicators of fire or other hazards. Equipment that can do this is usually expensive and limited in what it measures. This project is a portable, open-source field logger based on the SparkFun Blynk Board (ESP8266) with nine sensor channels and GPS. I chose to stream data to two places: Blynk Cloud and a custom web dashboard. Two ADS1115 16-bit ADC expanders on a shared I²C bus drive the analog sensors (soil moisture, water level, flame, light, gas); the board also has an onboard Si7021 for temperature and humidity and a PIR for motion. The paper describes the design, the dual-output setup, and the main implementation challenges.

---

## 1.3 What This Project Addresses (revised)

I wanted to close the gap between expensive, single-purpose loggers and the need for something affordable that could measure many variables and connect to the cloud. The logger I built does three things: it keeps total below $100, it sends data to both Blynk and a custom web dashboard that is publicly deployed, and it tags every reading with GPS. The firmware and hardware are open-source so anyone can inspect or change them. I chose an I²C bus so that adding or swapping sensors does not require redesigning the system.

---

## 2.2 How Our Logger Differs (revised)

The HOBO MX2301A costs over $200 and measures only temperature and humidity—no GPS and no cloud. The Kestrel DROP D3 adds barometric pressure for about $150 but still has no GPS, no soil sensor, and no dashboard. The Davis Vantage Vue covers five variables for over $400 and is a fixed weather station, not something you carry into the field.

I designed this logger to track nine variables plus GPS—temperature, humidity, light, sound, soil moisture, water level, flame, gas (MQ2), and motion—and to stream them to a cloud dashboard in real time for under $80. (I removed the barometric sensor from the final build; see Section 6.6.) Bresnahan et al. showed that for a bit over $100 and some basic coding, a user can build an environmental sensor that matches the accuracy of commercial units [4]; that finding supported the idea that a DIY logger could be viable. I also wanted to avoid lock-in: proprietary systems can be restrictive and slow to adapt [4]. So I used two ADS1115 ADCs on one I²C bus to get eight analog channels on two wires, and I built a custom web dashboard as a free alternative to Blynk—no message caps or subscription, with the option to use Blynk, the custom dashboard, or both.

---

## 3.1 Hardware Overview (paragraph version; keep bullets in paper if preferred)

The system is built around the SparkFun Blynk Board, which has an ESP8266, an onboard Si7021 temperature and humidity sensor, a NeoPixel RGB LED, and a pushbutton. The ESP8266 is well suited to IoT work because it is open at both software and hardware levels and has integrated Wi-Fi, so it can sit between sensors and a cloud platform [5]. I chose it in part because it has been used with Blynk for temperature monitoring [17] and greenhouse systems [18]; it handles all sensor polling, validation, and wireless communication.

For sensors I used the onboard Si7021 on I²C at 0x40; two ADS1115 16-bit ADC expanders at 0x48 and 0x49 to add eight analog channels; a SparkFun Sound Detector on the board ADC A0; a SAM-M8Q GPS on I²C at 0x42; and an HC-SR501 PIR on GPIO12 for motion. The first ADS1115 carries soil moisture (A0), water level (A1), flame detector (A2), and photocell (A3). The second has the MQ2 gas sensor on A0; its heater runs on 5 V from the board VIN pin. The I²C bus therefore has four devices (Si7021, both ADS1115s, and the GPS) on two wires; the native ADC is dedicated to sound and one GPIO to the PIR. I dropped the BMP180 barometric sensor after it would not come online (Section 6.6), and I left the servo reserved in firmware but unconnected.

---

## 6.6 Implementation Challenges (revised, with first person)

**Breadboard center gap.** Early in the build I made a basic wiring mistake: I placed parts so that their pins crossed the center gap of the breadboard. On a typical breadboard the two halves (columns a–e and f–j) are not connected across that gap. Some modules looked connected but were not, which led to open circuits and intermittent I²C failures. Once I moved everything to one side of the gap so that each row was on a single half, several puzzling connection issues disappeared.

**Dual ADS1115 setup.** I needed two ADS1115s on the same I²C bus, so each had to have a different address. The ADDR pin selects among 0x48 (GND), 0x49 (VDD), 0x4A (SDA), and 0x4B (SCL). I tied the first module’s ADDR to GND and the second’s to 3.3 V. After fixing the breadboard layout, the I²C scan showed both 0x48 and 0x49.

**ADS1115 floating inputs.** Unused ADC channels read noise or a constant value. For a while I thought the sensors were wrong even though the devices were detected. I went through each connection: photocell divider to A3, soil sensor to A0, water level to A1, flame detector to A2. Once each was wired correctly, the readings responded as expected.

**MQ2 power.** The MQ2 needs 5 V on its heater. On 3.3 V the heater stays cold and the readings are unreliable. I connected the MQ2 VCC to the board’s VIN (USB 5 V) and left the analog output going into the ADS1115.

**GPS.** The SAM-M8Q needs a clear view of the sky for a first fix. Indoors I got SIV = 0 and the −999 sentinel coordinates, which at first looked like a firmware or I²C bug. Moving to a window or outside fixed it; the GPS locked within 30–60 seconds and I confirmed 12 satellites in the Blynk app.

**BMP180 (abandoned).** The BMP180 never showed up on the I²C scan at 0x77, while the Si7021, both ADS1115s, and the GPS all did. So the bus was fine; the problem was the BMP180 module. I rechecked VCC, GND, SDA, and SCL, tried different cables and power rails, and still got nothing. I concluded the module was likely faulty or damaged (e.g. pull-ups or level shifters). After several hours I decided to remove it rather than keep debugging a $4 part. The firmware still has the init code behind a detection flag, so a replacement barometric sensor could be added later. I took from this that when one device on a shared bus refuses to appear and the rest work, swapping the module is often the most efficient next step.

**Servo.** The kit included a sub-micro servo and the firmware reserves V24 and V17 for it, but I did not connect it. I could not think of a clear use for it in this field-monitor design—no composite “site health” index or gauge that would justify the extra wiring and power. It remains an option for future work (Section 8.2) if such an index is defined.

---

## 7. Group Contribution (revised)

I completed this project on my own. I chose the hardware (SparkFun Blynk Board, ADS1115s, sensors, GPS), wrote the firmware and the custom web dashboard, and deployed the dashboard to Render. I also ran into and fixed the implementation issues described in Section 6.6.

---

## 8.1 Summary (revised)

The Portable Environmental Field Logger shows that you can get multi-channel, GPS-tagged, cloud-connected field sensing at low cost with open-source hardware and software. I wanted users to have a choice between a vendor platform (Blynk) and a self-hosted dashboard, so the device streams to both. The custom dashboard avoids subscription limits and message caps and adds free GPS mapping (OpenStreetMap and Leaflet.js), time-series charts, real-time updates over SSE, file-based persistence, and a one-click JSON export. Other options (e.g. email alerts or IFTTT) are possible with the same stack but were not implemented; the project focuses on what is actually built and delivered.

---

## Notes for pasting

- Replace the corresponding sections in your Google Doc with the paragraphs above.
- Keep all tables, figures, references, and citations unchanged.
- If your course allows first person only in certain sections (e.g. 6.6 and 7), use the humanized 6.6 and 7 above and keep the rest in third person; I can provide third-person-only versions of 1.3 and 2.2 if needed.
- After you complete the Google Docs OAuth (link in the chat above), I can read your Doc and apply these edits directly.
ak_xVMIp4_5AkOqenvNG32C
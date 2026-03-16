#!/usr/bin/env python3
"""
Generate Figure 1 block diagram for the Environmental Field Logger (Final Project).

Requires: pip install schemdraw   (or: pip install -r requirements-circuit.txt)
Run: python circuit_diagram.py
     Or: uv run --with schemdraw python circuit_diagram.py

Output: circuit_diagram.svg (suitable for the paper; scale in Word/LaTeX as needed).
"""

import schemdraw
import schemdraw.elements as elm
from schemdraw import flow

def main():
    # Larger unit so the diagram is readable; font size for labels
    with schemdraw.Drawing(unit=0.75, fontsize=9) as d:
        d.config(fontsize=9)

        # --- Center: ESP8266 (SparkFun Blynk Board) ---
        esp = flow.Box(w=3.2, h=1.4).label('ESP8266\nSparkFun Blynk Board').at((0, 0))

        # --- Left: I²C bus and devices ---
        i2c_box = flow.Box(w=2.8, h=2.2).label(
            'I²C bus (SDA/SCL)\n'
            'Si7021 (0x40)\n'
            'ADS1115 #1 (0x48)\n'
            'ADS1115 #2 (0x49)\n'
            'SAM-M8Q GPS (0x42)\n'
            'BMP180 (0x77)'
        ).at((-5, 0))
        elm.Line().at(esp.W).to(i2c_box.E).label('I²C', loc='top')

        # --- Right: GPIO / ADC ---
        sound_box = flow.Box(w=1.8, h=0.6).label('Sound Detector\nADC A0 (V0, V8)').at((4.5, 0.5))
        pir_box = flow.Box(w=1.8, h=0.6).label('PIR motion\nGPIO12 (V36)').at((4.5, -0.5))
        elm.Line().at(esp.E).to(sound_box.W).label('A0', loc='top')
        elm.Line().at(esp.E).to(pir_box.W).label('GPIO12', loc='bottom')

        # --- Top: Data outputs (WiFi) ---
        blynk_box = flow.Box(w=2, h=0.55).label('Blynk Cloud\n(WiFi + TLS)').at((2, 2))
        dash_box = flow.Box(w=2.2, h=0.55).label('Web Dashboard\n(HTTP POST)').at((2, -2))
        elm.Line(arrow='->').at(esp.N).to(blynk_box.S).label('V50 ON', loc='right')
        elm.Line(arrow='->').at(esp.S).to(dash_box.N).label('every 5 s', loc='left')

        # --- Power note (text) ---
        # Schemdraw doesn't have a simple "text only" element in flow; use a small box or label
        pwr = flow.Box(w=1.6, h=0.5).label('3.3 V (sensors)\n5 V (MQ2 heater)').at((-5, -2.2))
        elm.Line().at(i2c_box.S).to(pwr.N).label('power', loc='left')

    # Save SVG (default; good for paper and scaling)
    d.save('circuit_diagram.svg')
    print('Saved circuit_diagram.svg')

    # Optional: save PNG (requires matplotlib)
    try:
        d.save('circuit_diagram.png', dpi=150)
        print('Saved circuit_diagram.png')
    except Exception as e:
        print('PNG save skipped:', e)


if __name__ == '__main__':
    main()

/*************************************************************

This sketch shows how to write values to Virtual Pins

NOTE:
BlynkTimer provides SimpleTimer functionality:
  http://playground.arduino.cc/Code/SimpleTimer

App dashboard setup:
  Value Display widget attached to Virtual Pin V5
*************************************************************


/*************************************************************
Blynk is a platform with iOS and Android apps to control
ESP32, Arduino, Raspberry Pi and the likes over the Internet.
You can easily build mobile and web interfaces for any
projects by simply dragging and dropping widgets.

  Downloads, docs, tutorials: https://www.blynk.io
  Sketch generator:           https://examples.blynk.cc
  Blynk community:            https://community.blynk.cc
  Follow us:                  https://www.fb.com/blynkapp
                              https://twitter.com/blynk_app

Blynk library is licensed under MIT license
This example code is in public domain.

*************************************************************
This example runs on Sparkfun Blynk Board.

NOTE: This requires ESP8266 support package:
  https://github.com/esp8266/Arduino

You can select NodeMCU 1.0 (compatible board)
in the Tools -> Board menu

Change WiFi ssid, pass, and Blynk auth token to run :)
Feel free to apply it to any other example. It's simple!
*************************************************************/

/* Comment this out to disable prints and save space */
#define BLYNK_PRINT Serial

/* Fill in information from Blynk Device Info here */
//#define BLYNK_TEMPLATE_ID           "TMPxxxxxx"
//#define BLYNK_TEMPLATE_NAME         "Device"
//#define BLYNK_AUTH_TOKEN            "YourAuthToken"

#define BLYNK_TEMPLATE_ID           "TMPL2BA4JRof1"
#define BLYNK_TEMPLATE_NAME         "Blynk Board"
#define BLYNK_AUTH_TOKEN            "sgloEkcbGywtq5LKemNCy-_OsDv_1Nk3"

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <Adafruit_NeoPixel.h>
#include <Servo.h>

// Your WiFi credentials.
// Set password to "" for open networks.
char ssid[] = "Cyberia 2.4GHz";
char pass[] = "uV4Xm93D";

BlynkTimer timer;

// --- Lab 4A/4C: RGB LED (V2=Red, V3=Green, V4=Blue, V15=Brightness) ---
#define RGB_PIN 4
#define NUM_PIXELS 1
Adafruit_NeoPixel rgb = Adafruit_NeoPixel(NUM_PIXELS, RGB_PIN, NEO_GRB + NEO_KHZ800);
byte blynkRed = 0, blynkGreen = 0, blynkBlue = 0;
unsigned int rgbMaxBrightness = 255;

void updateRgbLed() {
  uint8_t r = map(blynkRed, 0, 255, 0, rgbMaxBrightness);
  uint8_t g = map(blynkGreen, 0, 255, 0, rgbMaxBrightness);
  uint8_t b = map(blynkBlue, 0, 255, 0, rgbMaxBrightness);
  rgb.setPixelColor(0, rgb.Color(r, g, b));
  rgb.show();
}

BLYNK_WRITE(V2) { blynkRed   = (byte)param.asInt(); updateRgbLed(); }
BLYNK_WRITE(V3) { blynkGreen = (byte)param.asInt(); updateRgbLed(); }
BLYNK_WRITE(V4) { blynkBlue  = (byte)param.asInt(); updateRgbLed(); }
BLYNK_WRITE(V15) {
  rgbMaxBrightness = (unsigned int)constrain(param.asInt(), 0, 255);
  updateRgbLed();
}

// --- Lab 4B: Servo on pin 15 (V24 = angle in, V17 = angle out) ---
#define SERVO_PIN 15
#define SERVO_MIN 0
#define SERVO_MAX 180
Servo myServo;
bool servoAttached = false;

BLYNK_WRITE(V24) {
  int angle = param.asInt();
  angle = constrain(angle, SERVO_MIN, SERVO_MAX);
  if (!servoAttached) {
    myServo.attach(SERVO_PIN);
    servoAttached = true;
  }
  myServo.write(angle);
  Blynk.virtualWrite(V17, angle);
}

// --- Physical button (V1) and Virtual LED ---
// On SparkFun Blynk Board, the physical button is on GPIO 0 (labeled "0" on the board).
#define BUTTON_PIN 0
#define BUTTON_UPDATE_RATE_MS 100  // Don't flood the app; rate-limit updates

WidgetLED buttonLed(V1);            // Virtual LED in Blynk app on V1
int lastButtonState = -1;           // -1 = unknown, so first read will always "change"
unsigned long lastButtonUpdate = 0;

void updateButtonToVirtualLed() {
if (millis() - lastButtonUpdate < BUTTON_UPDATE_RATE_MS)
  return;
lastButtonUpdate = millis();

int buttonState = digitalRead(BUTTON_PIN);  // LOW when pressed (pull-up)
if (buttonState != lastButtonState) {
  lastButtonState = buttonState;
  if (buttonState)  // HIGH = released
    buttonLed.off();
  else              // LOW = pressed
    buttonLed.on();
}
}

// This function sends Arduino's up time every second to Virtual Pin (5).
// In the app, Widget's reading frequency should be set to PUSH. This means
// that you define how often to send data to Blynk App.
void myTimerEvent()
{
// You can send any value at any time.
// Please don't send more that 10 values per second.
Blynk.virtualWrite(V5, millis() / 1000);
}

void setup()
{
// Debug console
Serial.begin(115200);

Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
// You can also specify server:
//Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass, "blynk.cloud", 80);
//Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass, IPAddress(192,168,1,100), 8080);

// Physical button on Blynk Board (GPIO 0) for V1 virtual LED
pinMode(BUTTON_PIN, INPUT_PULLUP);

// Lab 4A/4C: RGB LED
rgb.begin();
rgb.setPixelColor(0, rgb.Color(0, 0, 0));
rgb.show();

// Setup a function to be called every second
timer.setInterval(1000L, myTimerEvent);
}

void loop()
{
Blynk.run();
timer.run();           // Initiates BlynkTimer
updateButtonToVirtualLed();  // Physical button -> V1 LED in app
}

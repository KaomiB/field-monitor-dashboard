1. Successully set up Blynk Board ESP8266 via arduino IDE; 
    1.1 connected to Blynk Cloud, and works on the app, also connects to internet when unplugged.
2. Problem is, I cannot succesfully complete lab 3c because the physical pin v1 is not turning on the LED in the app;
i want to troubleshoot whether or not we're really not receiving a signal from the the physical pin, as the button currently does not reset the board when held down and show the LED cycle as it did when i first got it ; considering if i should redo the firmware but first i want to troubleshoot ;


![[image.jpg]]





Correctly ran VirtualPinWrite.ino sketch.

Output from running:


```c++
# Output:

[6414] Connecting to blynk.cloud:80
[7320] Ready (ping: 83ms).
[7405] Connected to WiFi
[7405] IP: 192.168.0.190
[7405] 
    ___  __          __
   / _ )/ /_ _____  / /__
  / _  / / // / _ \/  '_/
 /____/_/\_, /_//_/_/\_\
        /___/ v1.3.2 on ESP8266

 #StandWithUkraine    https://bit.ly/swua


[7415] Connecting to blynk.cloud:80
[8311] Ready (ping: 85ms).
```



other important info related to acoount/device:
```cpp
#define BLYNK_TEMPLATE_ID           "TMPL2BA4JRof1"
#define BLYNK_TEMPLATE_NAME         "Blynk Board"
#define BLYNK_AUTH_TOKEN            "sgloEkcbGywtq5LKemNCy-_OsDv_1Nk3"

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

// Your WiFi credentials.
// Set password to "" for open networks.
char ssid[] = "Cyberia 2.4GHz";
char pass[] = "uV4Xm93D";
```



Someone else troubleshooting:
https://community.blynk.cc/t/cant-turn-on-a-virtual-led/14914/3



further reading:
https://learn.sparkfun.com/tutorials/blynk-board-arduino-development-guide


Google AI Overview:

The SparkFun Blynk Board, based on the ESP8266, often uses virtual pin V1 in examples to control or represent an LED widget within the Blynk IoT app. This allows the user to create a virtual LED on their smartphone dashboard that mirrors the state of a physical LED or acts as an indicator. 
Key Details for V1 LED on SparkFun Blynk Board:
Virtual Pin: V1 is commonly mapped to a WidgetLED object in the Arduino code.
Functionality: A timer (BlynkTimer) is usually configured to call a function (e.g., blinkLedWidget) that updates the state of this V1 LED.
Implementation: In the Blynk App, a "Styled Button" or "LED" widget is added and set to Virtual Pin V1.
Code Example:
cpp
WidgetLED led1(V1); // Define LED on V1
BlynkTimer timer;

void blinkLedWidget() {
  // Toggle LED state
  if (led1.getValue()) {
    led1.off();
  } else {
    led1.on();
  }
}
 
This setup is frequently used to demonstrate IoT connectivity and app-to-hardware communication. 










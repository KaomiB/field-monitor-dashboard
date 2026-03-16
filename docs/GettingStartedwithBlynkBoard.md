Contributors: ![](https://cdn.sparkfun.com/avatar/3d3509851c3a5223dbe27da5fddd33df?d=retro&s=20&r=pg) jimblom

## Introduction

The [SparkFun Blynk Board – ESP8266](https://www.sparkfun.com/products/13794) is your hardware gateway to the app-controlled wonderland that is [Blynk](http://www.blynk.cc/). Combining the Blynk Board with the Blynk app (on your iOS or Android device), will allow you to control LEDs from your phone, send a tweet when it's time to water your plants, monitor local weather conditions, and much more!

[![Blynk Board and app action shot](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/13794-action.jpg)](https://www.sparkfun.com/products/13794)

<iframe src="https://www.youtube.com/embed/dSkWyDKjl_g/?autohide=1&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" allowfullscreen="" width="560" height="315"></iframe>

This tutorial will explain how to get your Blynk Board connected to a local Wi-Fi network -- in a process called **provisioning** -- _and_ connected to a **project within the Blynk app**. Once you've completed the tutorial, you'll have already created your first project: a zebra-controlled multicolored LED (it'll make sense when you see it).

### Gather the Gear

To follow along with this tutorial, you'll need the following physical and digital goods:

**[SparkFun Blynk Board -- ESP8266](https://www.sparkfun.com/products/13794)** -- The Blynk Board comes fully programmed -- ready to start Blynking. All you need to do is connect it to Wi-Fi and your Blynk account. You can obtain the Blynk board individually or from the IoT Starter Kit.

[![SparkFun Blynk Board - ESP8266](https://cdn.sparkfun.com/r/600-600/assets/parts/1/1/3/6/4/13794-01a.jpg)](https://www.sparkfun.com/sparkfun-blynk-board-esp8266.html)

**Retired**

[![SparkFun IoT Starter Kit with Blynk Board](https://cdn.sparkfun.com/r/600-600/assets/parts/1/2/8/8/4/13794_Action.jpg)](https://www.sparkfun.com/products/14682)

**Retired**

The Blynk Board also includes a **Blynk Subscription code card**, which you'll need to connect the Blynk Board to your Blynk account (and to charge it up!).

**[Micro-B USB Cable](https://www.sparkfun.com/products/10215)** -- The Blynk Board can be powered via a USB cable connected on the other end to either a computer, laptop, or [USB wall adapter](https://www.sparkfun.com/products/11456).

#### Powering the Blynk Board with Lithium-Polymer Batteries

The Blynk Board is equipped with LiPo battery support for truly wireless Blynking. The 2-pin, white JST connector adjacent to the USB port, mates with a variety of SparkFun LiPo batteries. The batteries are [available in a range of capacities](https://www.sparkfun.com/search/results?term=lithium+polymer), but we recommend either the [400mAh](https://www.sparkfun.com/products/10718), [850mAh](https://www.sparkfun.com/products/341), or [1000mAh](https://www.sparkfun.com/products/339) varieties.

A USB cable is still recommended – it's used to **charge the battery**. But once you find a Blynk project that requires your board not be tied down to a wall or computer, definitely consider equipping it with a battery.

**Blynk App** -- The Blynk smartphone app comes in two flavors: [iOS](https://itunes.apple.com/us/app/blynk-control-arduino-raspberry/id808760481?ls=1&mt=8) and [Android](https://play.google.com/store/apps/details?id=cc.blynk). Before going any further, download the app to your smart device:

[![AS_link](https://cdn.sparkfun.com/assets/learn_tutorials/4/9/4/AS_link.png)](https://itunes.apple.com/us/app/blynk-control-arduino-raspberry/id808760481?ls=1&mt=8)

[![GP_link](https://cdn.sparkfun.com/assets/learn_tutorials/4/9/4/GP_link.png)](https://play.google.com/store/apps/details?id=cc.blynk)

[![Blynk app in action](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/Blynk-app-example.png)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/Blynk-app-example.png)

The Blynk app is compatible with iDevices running iOS 7.0+, and Android's running any version above or equal to 4.0.

**Local Internet-Connected Wireless (Wi-Fi) Network** -- The Blynk Board is equipped with Wi-Fi support, and should be able to connect to most home wireless networks: **2.4GHz** Wi-Fi networks, that are either open (no password) or protected with WPA, WPA-2, or WEP authentication.

[![alt text](https://cdn.sparkfun.com/r/400-400/assets/learn_tutorials/4/8/6/Wireless-icon-1000.png)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/Wireless-icon-1000.png)

Note that the Blynk Board cannot connect the 5GHz band of a dual-band Wi-Fi router. If your Wi-Fi router has two visible options, like `HOME-AB12-2.4` and `HOME-AB12-5`, connect the Blynk Board to the "2.4" option.

## Powering Up the Blynk Board

Once you've gathered all of the materials from above, it's time to power up the Blynk Board! Grab your **USB Cable**, plug one end into a computer or USB wall adapter, and plug the other into the Blynk Board.

[![Blynk Board plugged in, powered, LEDs on](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/power-01-pluggedin.jpg)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/power-01-pluggedin.jpg)

_Blynk Board plugged in, PWR LED (in the upper-left of this image) is illuminated_

You should immediately see the small, **red "PWR" LED** illuminate, followed shortly thereafter by a random-looking blinking of the large, RGB LED.

## Identifying Your Blynk Board

While the Blynk Board's RGB blinking may look random at first, it will follow a repeating pattern -- a unique **sequence of four colors** including either red, green, blue, purple, or yellow, with a long stop in between. This color-code will help identify your board, just in case you're not the only one in town setting up a Blynk Board.

**Four characters matching that color code** will be added to the name of your Blynk Board. For example, if the RGB LED is blinking a pattern of blue, green, red, green..

[![Blynk Board blinking blue, green, red, green](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/identify-gif-bgrg.gif)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/identify-gif-bgrg.gif)

...the Blynk Board name will be **BlynkMe-BGRG**.

The table below documents which color matches which character.

| Color | Blynk Name Character |
| --- | --- |
| Red | R |
| Green | G |
| Blue | B |
| Purple | P |
| Yellow | Y |

That's not all the RGB LED does though!

## RGB Status Codes

During setup, the RGB LED on the Blynk Board will be your window into its soul. The board uses this multi-colored LED to indicate all sorts of status modes. If you're ever unclear of what the RGB color-code means, consult the table below:

| RGB Color | Blink Speed | Status | Notes |
| --- | --- | --- | --- |
| Purple | ● | Medium (2Hz) | Device connected to Blynk Board | Verifies that your phone (or possibly someone else's) is connected to the Blynk Board. |
| Blue | ● | Fast (4Hz) | Connecting to Wi-Fi network | After sending it the info, the Blynk Board will attempt to connect to your Wi-Fi network for up to 30 seconds. |
| Blynk Green | ● | Slow (1Hz) | Connecting to Blynk Cloud | After connecting to your Wi-Fi network, the Blynk Board will establish a connection with the Blynk server. |
| Blynk Green | ● | Smoothly fading in/out | Connected to Blynk | After successfully connecting to Wi-Fi and Blynk, this is the sign that everything is working! The LED will continue to "breathe" until you tell it to do something else. |
| Yellow | ● | Slow (1Hz) | Re-connecting to Blynk | Connection issues should resolve themselves, but the Blynk board will likely be unresponsive while blinking yellow. If it continues to Blynk yellow for over a minute, try cycling power to the Blynk Board. |
| White | ● | Medium (2Hz) | Blynk Board waiting for config | If your Blynk Board was unable to connect to either Wi-Fi or Blynk, it'll sit in this mode – waiting for you to press a button. More on this in the [Reconfiguring a Blynk Board section](https://learn.sparkfun.com/tutorials/getting-started-with-the-sparkfun-blynk-board#reconfiguring-a-blynk-board) |

## Provisioning the Blynk Board

In order to connect the Blynk Board to your local Wi-Fi network -- and the Blynk app -- you'll need to send it a few pieces of information, including the **name and password** of your Wi-Fi network. This is a process called provisioning.

#### Provisioning?

In the provisioning process, we'll use a smartphone, laptop, or computer to connect to directly (over Wi-Fi) to the Blynk Board. Once connected, your smart-device will send the necessary data and tell the Blynk Board to go connect to your Internet-connected wireless network and Blynk.

The Blynk Board is initially configured to operate as a **Wi-Fi access point** (abbreviated "AP", kind of like a router). A smartphone or Wi-Fi-enabled computer can briefly connect to the Blynk Board, and, using either the Blynk app or a browser, send all of the necessary information over to it. After the Blynk Board receives that info, it'll transition from AP to Wi-Fi device and connect to your Wi-Fi network.

### Blynk QR-Code Card

The Blynk Board has plenty of backup provisioning options, but the easiest method is through the Blynk app. Both iOS and Android versions of the Blynk app support Blynk Board provisioning. All you'll need is the **Blynk QR-Code Card**, included with your Blynk Board.

[![Blynk QR Code Card](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/13794-qrcard-02.jpg)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/13794-qrcard-02.jpg)

<iframe src="https://www.youtube.com/embed/21PA6_nbS8U/?autohide=1&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1" frameborder="0" allowfullscreen="" width="560" height="315"></iframe>

#### Don't Throw Away Your Blynk QR-Code Card!

Although you'll only be able to benefit from the 15,000 energy points once, the QR-Code card can be used to **re-provision** your Blynk Board, should the need ever arise. We recommend you keep it hand, for now, just in case!

### Provisioning on a Smartphone (or Tablet)

The setup process in each OS looks and feels a little different. **Select one of the sections below** to get directions for your phone (or tablet) OS.

[iOS Provisioning](https://learn.sparkfun.com/tutorials/getting-started-with-the-sparkfun-blynk-board#iosProvision) [Android Provisioning](https://learn.sparkfun.com/tutorials/getting-started-with-the-sparkfun-blynk-board#android-provision)

## Do the zeRGBa

Once you've connected the Blynk Board to a local Wi-Fi network -- and connected it to your Blynk account -- the Blynk app should present you with a nearly blank canvas of a Blynk project.

You should be greeted by a festively colored zebra -- the **zeRGBa** -- and an **LCD widget** with a rather helpful link.

[![Blynk Board default Blynk project - zeRGBa and LCD](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/zergba-01-default.PNG)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/zergba-01-default.PNG)

Your first Blynk project should be all set up to communicate with the Blynk Board. It should also already be running, meaning it's play time! **Poke and prod the zeRGBa** to select a new color -- you should quickly see a physical manifestation of that color on the Blynk Board.

[![zeRGBa setting the Blynk Board's LED to purple!](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/zergba-01purple.jpg)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/zergba-01purple.jpg)

If your zeRGBa isn't making LEDs blink, first **make sure the project is running**. The icon in the upper-right corner of the app should be a square "**stop**" button. If it's a triangular "**play**" button, tap that to run the project.

**Caution**: As tempting as it may be to perform a hypnotic light show, dragging your finger along the zeRGBa may cause the Blynk Board and Blynk App to occassionaly "lag out." If the Blynk Board is slow to update the RGB's color, wait a couple seconds for it to re-connect.

To avoid this occasional connection-drop, try "poking" at your zeRGBa color of choice.

**Congratulations! You're well on-your-way to being a professional Blynker. From here we recommend you visit the [Blynk Board Project Guide](https://learn.sparkfun.com/tutorials/blynk-board-project-guide) to explore over a dozen Blynk projects built into the Blynk Board.**

Or, you may want to check out some of these other Blynk-related tutorials:

___

## Troubleshooting

If, for any reason, you can't successfully provision the Blynk Board through the Blynk app, you have a few alternatives. But first, you'll need to **create a new Blynk project**.

### Creating a Blynk Project

Each of the alternative provisioning methods below will require a Blynk project to be previously created. The new Blynk project will be assigned a **Blynk auth token** -- a 32-character, unique string, which connects the Blynk Board to your Blynk project. That's what we're after in this process.

Follow these steps to create a new Blynk project and get a new auth token:

#### Step 1: Create a Blynk Project

Open the Blynk app, and log in if you haven't. Make sure your phone is connected to an Internet-connected Wi-Fi network. On the Blynk main page, select **Create new project**.

[![Create a Blynk Project](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/createProject-01.PNG)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/createProject-01.PNG)

_Create a new Blynk Project by tapping "Create New Project" on the Blynk main page._

#### Step 2: Configure the Blynk Project

On the next page, select **SparkFun Blynk Board** under the "Hardware Model" list. You can give the project any name you please -- the provisioning process sets it to "BlynkMe".

[![Configure the new project](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/createProject-02.PNG)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/createProject-02.PNG)

_Configure a new project: name it, and set the board type to "SparkFun Blynk Board."_

**Do not** hit Create Project yet!

#### Step 3: Email and Copy the Auth Token

Depending on which alternative provisioning option you choose, you'll either need the auth token copied to your phone's clipboard, or sitting in your email inbox. Might as well do both while we're here!

[![Email and copy the auth token](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/createProject-03.PNG)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/createProject-03.PNG)

Tap the **E-Mail button** to send the auth token to your Blynk-connected email account. Then **tap the Auth token itself** to copy the string to your phone's clipboard. The phone should pop up a notification confirming that the token was copied.

#### Step 4: Create Project

Finally, with the token emailed and copied, click **Create** or **Create Project**. You should be brought to a new, blank project -- perfect for now!

### Alternative Provisioning

There are a few options available for alternatively provisioning the Blynk board. In order of our recommendation, you can:

1.  Connect the Blynk Board to Wi-Fi/Blynk using a laptop or Wi-Fi-enabled computer.
2.  Configure the Blynk Board through a serial terminal on a computer connected over USB to the Blynk Board.
3.  Creatively use copy/paste, and app-switching on your smartphone to provision the Blynk Board.

Click one of the links below to see how.

### Manually Adding a zeRGBa Widget

Hopefully one of the three alternative provisioning processes has worked for you. If not, please don't hesitate to get in touch with our [technical support team](https://www.sparkfun.com/technical_assistance).

If your Blynk Board is breathing Blynk-green, **open the Blynk app on your phone**, and select the bare project you've created. Look at that blank canvas -- room for so many widgets!

[![Blank Blynk project](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/manual-zergba-01-blank.png)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/manual-zergba-01-blank.png)

_A new Blank Blynk project. (Android left, iOS right)_

To add a widget to the Blynk app, first make sure the project **isn't running** -- you should see a triangular-shaped "play" icon in the upper-right-hand corner. Now **tap anywhere in the grey project space** to bring up the Blynk widget box.

[![Adding a zergba](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/manual-zergba-02-widgetbox.png)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/manual-zergba-02-widgetbox.png)

_Add a zeRGBa widget from the Blynk widget box._

**Select the zeRGBa** widget to add it to your project. You can **tap-and-hold** the widget to drag it around the project space. We find the zeRGBa prefers to be the center-of-attention.

Now **tap the zeRGBa** to enter the widget settings -- you'll get very used to this. Slide the Split/Merge switch over to **Merge**. Then **tap "PIN"**, and set the box to **V0**. The widget settings should look like this:

[![zeRGBa settings](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/manual-zergba-03-zergbasettings.png)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/manual-zergba-03-zergbasettings.png)

To back out of the settings tab, hit **OK** on iOS or the **upper-left back arrow** on an Android.

Back at the project screen, **tap the play button** in the upper-right corner to start Blynking! Once you've got the project running, poke-and-prod that colorful zebra!

[![zeRGBa purple, LED purple!](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/zergba-01purple.jpg)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/zergba-01purple.jpg)

___

**Congratulations! You're well on-your-way to being a professional Blynker. From here we recommend you visit the [Blynk Board Project Guide](https://learn.sparkfun.com/tutorials/blynk-board-project-guide) to explore over a dozen Blynk projects built into the Blynk Board.**

Or, you may want to check out some of these other Blynk-related tutorials:

## Reconfiguring a Blynk Board

If you've taken your Blynk Board somwhere new, and need to **reconfigure its Wi-Fi** network -- or if you need to update the Blynk auth token -- there's a built-in method for re-entering configuration mode to reset both credentials.

While the Blynk Board is attempting to connect to a Wi-Fi network or Blynk -- blinking blue or green -- **press and hold the 0 button**.

[![Hold the 0 button for 3 seconds to reprovision](https://cdn.sparkfun.com/r/600-600/assets/learn_tutorials/4/8/6/reprovisioning-01-button-press.jpg)](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/reprovisioning-01-button-press.jpg)

You should see the RGB LED turn white and slowly increase in brightness. After about a second, the LED will begin to dim. Once you've held the button for about **4 seconds** and the LED begins to brighten again, **release the button**.

If the reset was successful, you should see the Blynk Board revert back to its R/G/B/Y/P color-combo sequence. It should also show up as a Wi-Fi access point, and you'll be able to configure it over either Wi-Fi or a serial terminal.

You can even re-scan your Blynk Board QR-Code Card. No, you won't get another 15k energy, but you will be able to step through the provisioning process again!

## Resources and Going Further

If your Blynk Board is successfully provisioned, **head over to the [Blynk Board Project tutorial](https://learn.sparkfun.com/tutorials/blynk-board-project-guide)** to explore the Blynk Board's pre-loaded projects.

If you need any technical assistance with your Blynk Board, don't hesitate to [contact our technical support team](https://www.sparkfun.com/technical_assistance) via either e-mail, chat, or phone.

If you need general Blynk Board or Blynk App resources, these may help:

-   **SparkFun Blynk Board Resources**
    -   [Blynk Board GitHub Repository](https://github.com/sparkfun/Blynk_Board_ESP8266)
    -   [Blynk Board Schematic](https://cdn.sparkfun.com/datasheets/IoT/SparkFun-Blynk-Board-ESP8266.pdf)
    -   [Blynk Board Eagle PCB Design Files](https://cdn.sparkfun.com/assets/learn_tutorials/4/8/6/SparkFun-Blynk-Board-ESP8266-EAGLE.zip)
    -   [Blynk Board Arduino Firmware](https://github.com/sparkfun/Blynk_Board_ESP8266/tree/master/Firmware/BlynkBoard_Core_Firmware)
-   **Blynk Resources**
    -   [Blynk Homepage](http://www.blynk.cc/)
    -   [Blynk Getting Started Guide](http://www.blynk.cc/getting-started/)
    -   [Blynk Documentation](http://docs.blynk.cc/)
    -   [Blynk Arduino Library](https://github.com/blynkkk/blynk-library/releases/download/v0.3.3/Blynk_v0.3.3.zip)

Need some inspiration for your next project? Check out some of these related tutorials:

[

### LED Cloud-Connected Cloud

](https://learn.sparkfun.com/tutorials/led-cloud-connected-cloud)

Make an RGB colored cloud light! You can also control it from your phone, or hook up to the weather!

Or check out some of these blog posts for ideas:
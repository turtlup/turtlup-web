#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_DRV2605.h"
#include <Wire.h>
#include <ArduinoJson.h>

#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHAR_WRITE_UUID     "ef015678-1234-1234-1234-abcdef123456"
#define CHAR_NOTIFY_UUID    "abcd1234-1234-1234-1234-abcdef123456"

// Sensor and BLE Objects
sensors_event_t accelEvent, gyroEvent, tempEvent;
BLECharacteristic* notifyCharacteristic;
Adafruit_DRV2605 hapticDriver;
Adafruit_MPU6050 mpuSensor;

class CommandCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* characteristic) override {
    String command = String(characteristic->getValue().c_str());

    // Serial.print("Received: ");
    // Serial.println(command);

    if (command == "CALIBRATE") {
      // Serial.println("Calibration triggered!");
    } else if (command.startsWith("MODE:")) {
      String mode = command.substring(5);
      // Serial.print("Set mode: ");
      // Serial.println(mode);
    }
  }
};


void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(10);
  }

  // Serial.println("Initializing MPU6050...");
  if (!mpuSensor.begin()) {
    // Serial.println("Failed to find MPU6050 chip");
    while (true) {
      delay(10);
    }
  }
  // Serial.println("MPU6050 Found!");

  BLEDevice::init("TurtlUp");
  BLEServer* server = BLEDevice::createServer();
  BLEService* service = server->createService(SERVICE_UUID);

  // Notify Characteristic
  notifyCharacteristic = service->createCharacteristic(
    CHAR_NOTIFY_UUID,
    BLECharacteristic::PROPERTY_NOTIFY
  );
  notifyCharacteristic->addDescriptor(new BLE2902());

  // Write Characteristic
  BLECharacteristic* writeCharacteristic = service->createCharacteristic(
    CHAR_WRITE_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );
  writeCharacteristic->setCallbacks(new CommandCallback());

  service->start();
  BLEAdvertising* advertising = BLEDevice::getAdvertising();
  advertising->addServiceUUID(SERVICE_UUID);
  advertising->start();

  // Serial.println("BLE advertising started");
}

void loop() {
  mpuSensor.getEvent(&accelEvent, &gyroEvent, &tempEvent);

  StaticJsonDocument<128> jsonDoc;
  jsonDoc["ax"] = accelEvent.acceleration.x;
  jsonDoc["ay"] = accelEvent.acceleration.y;
  jsonDoc["az"] = accelEvent.acceleration.z;

  String jsonString;
  serializeJson(jsonDoc, jsonString);
  // Serial.println(jsonString);

  notifyCharacteristic->setValue(jsonString);
  notifyCharacteristic->notify();

  delay(5000);
}

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHAR_WRITE_UUID     "ef015678-1234-1234-1234-abcdef123456"
#define CHAR_NOTIFY_UUID    "abcd1234-1234-1234-1234-abcdef123456"

BLECharacteristic* notifyChar;

class MyCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* characteristic) override {
    String strValue = String((const char*)characteristic->getValue().c_str());

    Serial.print("Received: ");
    Serial.println(strValue);

    if (strValue == "CALIBRATE") {
      Serial.println("Calibration triggered!");
    } else if (strValue.startsWith("MODE:")) {
      Serial.print("Set mode: ");
      Serial.println(strValue.substring(5));
    }
  }
};

void setup() {
  Serial.begin(115200);

  BLEDevice::init("TurtlUp");
  BLEServer* server = BLEDevice::createServer();
  BLEService* service = server->createService(SERVICE_UUID);

  notifyChar = service->createCharacteristic(
    CHAR_NOTIFY_UUID,
    BLECharacteristic::PROPERTY_NOTIFY
  );

  notifyChar->addDescriptor(new BLE2902());

  BLECharacteristic* writeChar = service->createCharacteristic(
    CHAR_WRITE_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );

  writeChar->setCallbacks(new MyCallbacks());

  service->start();
  BLEAdvertising* advertising = BLEDevice::getAdvertising();
  advertising->addServiceUUID(SERVICE_UUID);
  advertising->start();

  Serial.println("TurtlUp BLE advertising started");
}

void loop() {
  static unsigned long lastSend = 0;
  if (millis() - lastSend > 5000) {
    String status = random(0, 2) ? "GOOD" : "BAD";
    Serial.println("Sending posture: " + status);
    notifyChar->setValue(status.c_str());
    notifyChar->notify();
    lastSend = millis();
  }
}

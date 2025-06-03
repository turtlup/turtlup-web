import { EventEmitter } from 'events';


interface IMUData {
  ax: number;
  ay: number;
  az: number;
}

export interface IMUDataWithId {
  id: string; // Unique identifier for each IMU
  data: IMUData[]; // Array of IMU data
}
class BluetoothService extends EventEmitter {
  private device: BluetoothDevice | null = null;
  private service: BluetoothRemoteGATTService | null = null;
  private writeCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private notifyCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private isConnected: boolean = false;

  // Define your specific UUIDs (using lowercase from scan)
  private SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
  private WRITE_CHARACTERISTIC_UUID = 'ef015678-1234-1234-1234-abcdef123456';
  private NOTIFY_CHARACTERISTIC_UUID = 'abcd1234-1234-1234-1234-abcdef123456';

  constructor() {
    super();
  }

  async connect(): Promise<void> {
    console.log("BluetoothService: Attempting to connect...");
    try {
      // Request the device with the specific service UUID
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { name: 'TurtlUp' },
          { namePrefix: 'TurtlUp' }
        ],
        optionalServices: [this.SERVICE_UUID]
      });

      console.log("BluetoothService: Device selected:", this.device.name);

      const server = await this.device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');

      console.log("BluetoothService: Connected to GATT server.");

      // Get the primary service using the defined UUID
      console.log(`BluetoothService: Attempting to get Service: ${this.SERVICE_UUID}`);
      this.service = await server.getPrimaryService(this.SERVICE_UUID);
      console.log("BluetoothService: Service found.", this.service);

      // Get the specific characteristics using their UUIDs
      console.log(`BluetoothService: Attempting to get Write Characteristic: ${this.WRITE_CHARACTERISTIC_UUID}`);
      this.writeCharacteristic = await this.service.getCharacteristic(this.WRITE_CHARACTERISTIC_UUID);
      console.log("BluetoothService: Write Characteristic found.", this.writeCharacteristic);

      console.log(`BluetoothService: Attempting to get Notify Characteristic: ${this.NOTIFY_CHARACTERISTIC_UUID}`);
      this.notifyCharacteristic = await this.service.getCharacteristic(this.NOTIFY_CHARACTERISTIC_UUID);
      console.log("BluetoothService: Notify Characteristic found.", this.notifyCharacteristic);

      this.isConnected = true;
      this.emit('connected');
      console.log("BluetoothService: 'connected' event emitted.");

      // Start notifications on the notify characteristic
      console.log("BluetoothService: Attempting to start notifications.");
      await this.notifyCharacteristic.startNotifications();
      console.log("BluetoothService: Notifications started.");
      this.notifyCharacteristic.addEventListener('characteristicvaluechanged', this.handleData.bind(this));

    } catch (error) {
      console.error('BluetoothService: Connection error:', error);
      this.emit('error', error);
      this.disconnect(); // Ensure cleanup on error
    }
  }

  private handleData(event: Event): void {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    if (!target?.value) return;

    const value = target.value;
    const dataArray = new Uint8Array(value.buffer);
    const decoder = new TextDecoder('utf-8');
    const dataString = decoder.decode(dataArray);
    const imuData = JSON.parse(dataString)
    console.log("Raw IMU data:", imuData);

    const data: IMUDataWithId = {
      id: `imuData-${new Date().getTime()}`, // Generate a unique ID based on timestamp
      data: imuData.data || []
    }
  
    this.emit('imuData', data);
  }

  disconnect(): void {
    if (this.device?.gatt?.connected) {
      console.log("BluetoothService: Disconnecting from device.");
      this.device.gatt.disconnect();
    }
    this.isConnected = false;
    this.device = null;
    this.service = null;
    this.writeCharacteristic = null;
    this.notifyCharacteristic = null;
    this.emit('disconnected');
    console.log("BluetoothService: 'disconnected' event emitted.");
  }

  isDeviceConnected(): boolean {
    return this.isConnected;
  }

  // Method to send data via the write characteristic
  async sendData(data: Uint8Array): Promise<void> {
    if (!this.writeCharacteristic) {
      console.error("BluetoothService: Write characteristic not available.");
      return;
    }
    try {
      await this.writeCharacteristic.writeValue(data);
      console.log("BluetoothService: Data sent:", data);
    } catch (error) {
      console.error("BluetoothService: Failed to send data:", error);
    }
  }
}

export const bluetoothService = new BluetoothService();
export type { IMUData };
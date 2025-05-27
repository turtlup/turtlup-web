import { useState } from 'react';

function App() {
  const [deviceName, setDeviceName] = useState(null);
  const [writeChar, setWriteChar] = useState(null);
  const [notifyChar, setNotifyChar] = useState(null);
  const [log, setLog] = useState([]);

  const connectToDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'TurtlUp' }],
        optionalServices: ['battery_service'] // replace with your Arduino service UUID
      });

      const server = await device.gatt.connect();
      // const service = await server.getPrimaryService('battery_service');
      // const write = await service.getCharacteristic('battery_level'); // replace with your write UUID
      // const notify = await service.getCharacteristic('battery_level'); // replace with notify UUID
      const service = await server.getPrimaryService('12345678-1234-1234-1234-123456789abc');
      const write = await service.getCharacteristic('efgh5678-1234-1234-1234-abcdef123456'); // write characteristic
      const notify = await service.getCharacteristic('abcd1234-1234-1234-1234-abcdef123456'); // notify characteristic


      setDeviceName(device.name);
      setWriteChar(write);
      setNotifyChar(notify);

      console.log("✅ Write characteristic set:", write);

      // Listen for posture updates
      const decoder = new TextDecoder();
      await notify.startNotifications();
      notify.addEventListener('characteristicvaluechanged', (e) => {
        const value = decoder.decode(e.target.value);
        const time = new Date().toLocaleTimeString();
        setLog((prev) => [...prev, `${time} – ${value}`]);
      });

    } catch (err) {
      console.error("Bluetooth error:", err);
    }
  };

  const sendCommand = (cmd) => {
    if (!writeChar) return;
    const encoder = new TextEncoder();
    writeChar.writeValue(encoder.encode(cmd));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>TurtlUp Web App</h1>
      <button onClick={connectToDevice}>Connect to TurtlUp</button>
      {deviceName && <p>Connected to: {deviceName}</p>}

      {writeChar && (
        <>
          <h3>Calibration</h3>
          <button onClick={() => sendCommand('CALIBRATE')}>Calibrate Ideal Posture</button>

          <h3>Notification Settings</h3>
          <select onChange={(e) => sendCommand(`MODE:${e.target.value}`)}>
            <option value="vibration">Vibration Only</option>
            <option value="app">App Notification Only</option>
            <option value="both">Both</option>
          </select>
        </>
      )}

      {notifyChar && (
        <div style={{ marginTop: 20 }}>
          <h3>Posture History</h3>
          <ul>
            {log.map((entry, i) => <li key={i}>{entry}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

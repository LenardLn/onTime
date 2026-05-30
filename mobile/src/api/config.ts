import axios from 'axios';
import {Platform} from 'react-native';

/**
 * Physical Android phone over USB (recommended): we tunnel the phone's
 * localhost:8000 to the PC with `adb reverse tcp:8000 tcp:8000`, so the app
 * just talks to http://localhost:8000. Run the backend with:
 *   uvicorn main:app --host 0.0.0.0 --port 8000
 *
 * Alternatives:
 *   - Android EMULATOR: http://10.0.2.2:8000
 *   - iOS SIMULATOR:    http://127.0.0.1:8000
 *   - Wi-Fi (no USB):   set LAN_IP to the PC's IPv4 and use http://${LAN_IP}:8000
 */
const LAN_IP = '192.168.2.79'; // only used for the Wi-Fi fallback below

const MODE: 'usb' | 'wifi' | 'emulator' = 'usb';

const HOST =
  MODE === 'usb'
    ? 'http://localhost:8000'
    : MODE === 'wifi'
    ? `http://${LAN_IP}:8000`
    : Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://127.0.0.1:8000';

export const API_BASE_URL = HOST;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
});

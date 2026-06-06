import axios from 'axios';
import {Platform} from 'react-native';

/**
 * Where the driver app sends its data.
 *
 * 'render'  -> the deployed backend. Works anywhere over the internet (Wi-Fi or
 *              cellular), so the app is usable out of the box after installing.
 * 'usb'     -> local PC backend via `adb reverse tcp:8000 tcp:8000` (Android dev)
 * 'wifi'    -> local PC backend over LAN (set LAN_IP to the PC's IPv4)
 * 'emulator'-> Android emulator (10.0.2.2) / iOS simulator (127.0.0.1)
 */
const RENDER_URL = 'https://ontime-okry.onrender.com';
const LAN_IP = '192.168.2.79';

const BACKEND: 'render' | 'usb' | 'wifi' | 'emulator' = 'render';

const HOST =
  BACKEND === 'render'
    ? RENDER_URL
    : BACKEND === 'usb'
    ? 'http://localhost:8000'
    : BACKEND === 'wifi'
    ? `http://${LAN_IP}:8000`
    : Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://127.0.0.1:8000';

export const API_BASE_URL = HOST;

export const api = axios.create({
  baseURL: API_BASE_URL,
  // Render's free tier sleeps when idle; the first request can take ~30-60s to
  // wake it, so give requests a generous timeout.
  timeout: 60000,
  headers: {'Content-Type': 'application/json'},
});

/**
 * Set (or clear) the bearer token sent with every request. Called after login
 * so authenticated endpoints like POST /locations accept the request, and
 * called with null on logout.
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

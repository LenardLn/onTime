import axios from 'axios';
import {Platform} from 'react-native';

/** Android emulator reaches host machine at 10.0.2.2; iOS simulator uses localhost. */
const HOST =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

export const API_BASE_URL = HOST;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
});

# OnTime Mobile (Bus Driver)

React Native app for bus drivers to authenticate and stream GPS updates to the backend.

## Quick start (Windows)

From PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File mobile\scripts\start-dev.ps1
```

Or double-click `mobile\scripts\start-dev.bat`.

This will: `npm install`, create `android/` if missing, patch permissions, open backend + Metro in new windows, then `npm run android`.

**Before running:** install [Android Studio](https://developer.android.com/studio), create an AVD emulator, and start the emulator.

If `npm install` is slow or you see `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, read **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**.

---

## Setup (manual)

1. Install dependencies (required for running the app; also replaces stub types with real package types):

```bash
cd mobile
npm install
npm run typecheck
```

After install, you may remove the `paths` entries for `react` / `react-native` / `@react-native-community/geolocation` from `tsconfig.json` so TypeScript uses the installed packages.

2. If `android/` and `ios/` folders are missing, generate native projects from the repo root:

```bash
npx @react-native-community/cli@latest init OnTimeMobile --directory mobile --pm npm
```

Then restore `App.tsx` and the `src/` folder from this repo if the init step overwrote them.

3. **Android location permission** — add to `android/app/src/main/AndroidManifest.xml` inside `<manifest>`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

4. **iOS** — add to `ios/OnTimeMobile/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>OnTime needs your location to track the bus route.</string>
```

5. Start the backend (`be/`) on port `8000`.

6. Run the app:

```bash
terminal 1: npm start
termial 2:
. .\setup_env.ps1
npm run android
# or
npm run ios
```

## API

| Step | Endpoint | Body |
|------|----------|------|
| Login | `POST /login` | `{ "email": "<driver name>", "password": "..." }` |
| Track | `POST /locations` | `{ "lat", "lon", "tst", "vel", "topic": "owntracks/<driver>/<bus>" }` |

- **Bus Driver Name** maps to the user `email` in the admin database.
- **Bus Name** is sent in the `topic` as the device id (`user_id` / `device_id` in `locations` table).
- Updates are sent when the device moves **≥ 10 meters** (lat, lon, Unix `tst`, speed as `vel`).

### Physical device backend URL

Edit `src/api/config.ts` and set `API_BASE_URL` to your machine's LAN IP, e.g. `http://192.168.1.10:8000`.

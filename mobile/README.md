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

---

## Build a standalone APK (download & install on a phone)

This produces a self-contained `app-release.apk` (JS bundle embedded, no Metro/PC
needed). It targets the deployed Render backend by default (`BACKEND = 'render'`
in `src/api/config.ts`), so the installed app works over Wi-Fi/cellular on its own.

```bash
cd mobile/android
JAVA_HOME="/c/Program Files/Java/jdk-21" ./gradlew assembleRelease \
  -PreactNativeArchitectures=arm64-v8a,armeabi-v7a
```

Output: `mobile/android/app/build/outputs/apk/release/app-release.apk`.

**Signing.** The release build is signed with a dedicated key read from
`android/keystore.properties` (gitignored) + `android/app/ontime-release.jks`
(gitignored via `*.jks`). Keep a private backup of both — losing them means you
can't ship updates with the same app identity. If the file is absent the build
falls back to the debug key.

**Install on the phone.** Transfer the APK (USB / Google Drive / email to
yourself), then on the phone tap it and allow "install from unknown sources" for
the app you opened it with. Or over USB with debugging on:
`adb install -r app-release.apk`.

**Gotchas on this machine (already handled):**
- `JAVA_HOME` must be JDK 17/21 (an old JDK 11 is on PATH and breaks AGP 8.x).
- Avast HTTPS scanning intercepts TLS, so Gradle can't download deps. The Avast
  root CA was imported into `~/.gradle/cacerts.jks` and wired up via
  `~/.gradle/gradle.properties` (`systemProp.javax.net.ssl.trustStore=...`).
- Android `lintVital` is disabled for release in `app/build.gradle`.

> **iOS:** building an installable iOS app requires macOS + Xcode (and an Apple
> Developer account for anything beyond a 7-day free-provisioning sideload), so
> it can't be produced from this Windows machine.

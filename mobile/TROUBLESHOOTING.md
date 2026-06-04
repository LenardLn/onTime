# Mobile setup troubleshooting

## `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

npm cannot verify the HTTPS certificate (common with corporate VPN, Zscaler, antivirus HTTPS scanning).

**Fix (already in `mobile/.npmrc`):**
```
strict-ssl=false
```

If it still fails, set it globally once:
```bat
npm config set strict-ssl false
```

Then retry:
```bat
cd mobile
npm install
npm run init-android
```

Use `npm run init-android` instead of `npx @react-native-community/cli@latest init` — it uses the CLI from `node_modules` and avoids a separate registry download.

---

## `npm install` takes 10+ minutes / never finishes

### 1. OneDrive (very likely — your repo is under `OneDrive\Desktop`)

OneDrive syncs every file npm writes under `node_modules`, which can make installs extremely slow or appear stuck.

**Best fix:** copy the project outside OneDrive, then install there:
```bat
xcopy /E /I "c:\Users\nagyl\OneDrive\Desktop\onTime" "c:\dev\onTime"
cd c:\dev\onTime\mobile
npm install
```

Or pause OneDrive sync while installing.

### 2. See what npm is doing

```bat
cd mobile
npm install --loglevel verbose
```

### 3. Clean cache and retry

```bat
npm cache clean --force
del package-lock.json
npm install --no-audit --no-fund
```

---

## Recommended order (after fixes)

```bat
cd c:\Users\nagyl\OneDrive\Desktop\onTime\mobile
npm config set strict-ssl false
npm install --no-audit --no-fund
npm run init-android
```

If `init-android` overwrites `App.tsx` or `src\`, restore from git.

Then start backend + Metro + app (or run `scripts\start-dev.bat` again).

# frontend_electron_react

Electron + React (Vite) frontend container that fetches and displays the backend `GET /hello` response.

## Theme
Uses the **Ocean Professional** palette:
- Primary: `#2563EB`
- Secondary/Accent: `#F59E0B`
- Background: `#F9FAFB`
- Surface: `#FFFFFF`
- Text: `#111827`
- Error: `#EF4444`

## Configure backend URL

The renderer resolves the API base URL in this order:

1) `window.env.API_BASE_URL`  
2) `process.env.API_BASE_URL`  
3) Fallback: `http://localhost:3010`

To point at the preview backend, set `API_BASE_URL` to the backend URL (without `/docs`), for example:
- `https://<preview-host>:3010`

## Run (web preview)
This runs the React UI in a browser (useful for the preview system):

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Then open the Vite URL shown in the logs.

## Run (Electron)
This runs Vite and then launches Electron:

```bash
npm install
npm run electron:dev
```

## Build
```bash
npm install
npm run build
```

Optional (packaging / directory output via electron-builder):
```bash
npm run electron:build
```

## Notes on CORS
The renderer uses standard `fetch()` with `mode: "cors"`. The backend must allow CORS for the renderer origin. This project backend is configured with permissive CORS (`allow_origins=["*"]`), so it should work out of the box.

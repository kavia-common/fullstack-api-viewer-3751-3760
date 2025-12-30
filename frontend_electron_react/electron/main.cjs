/* eslint-disable no-console */
const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow = null;

/**
 * Create the Electron browser window and load the renderer.
 * In dev, loads Vite dev server URL. In production, loads built files.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 720,
    backgroundColor: "#0B1220",
    webPreferences: {
      // Keep renderer secure while still allowing fetch() to backend.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" }).catch(() => undefined);
  } else {
    // Vite outputs to dist by default
    const indexHtmlPath = path.join(__dirname, "..", "dist", "index.html");
    mainWindow.loadFile(indexHtmlPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  // On macOS it is common for apps to stay open until user quits explicitly.
  if (process.platform !== "darwin") app.quit();
});

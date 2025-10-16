import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { join } from 'node:path';

const isMac = process.platform === 'darwin';

function createMainWindow(): void {
  const window = new BrowserWindow({
    width: 1200,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      sandbox: false
    }
  });

  window.on('ready-to-show', () => {
    window.show();
    if (process.env.ELECTRON_START_IN_DEVTOOLS === 'true') {
      window.webContents.openDevTools();
    }
  });

  const devServerUrl =
    process.env.ELECTRON_RENDERER_URL ??
    process.env.MAIN_VITE_DEV_SERVER_URL ??
    process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    console.log('[main] load renderer from dev server:', devServerUrl);
    window.loadURL(devServerUrl);
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.whenReady().then(() => {
  createMainWindow();

  ipcMain.handle('desktop:open-external', async (_event, url: string) => {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(`Unsupported protocol: ${parsed.protocol}`);
    }
    await shell.openExternal(parsed.toString());
  });
});

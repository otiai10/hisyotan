import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktop', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  openExternal: async (url: string) => {
    await ipcRenderer.invoke('desktop:open-external', url);
  }
});

export {};

declare global {
  interface Window {
    desktop: {
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
      openExternal: (url: string) => Promise<void>;
    };
  }
}

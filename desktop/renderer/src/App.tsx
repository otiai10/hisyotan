import { useState } from 'react';
import './App.css';

function App(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <main className="container">
      <h1>hisyotan</h1>
      <p>やさしいTODO管理 (Electron + React)</p>

      <section className="card">
        <h2>カウンター</h2>
        <p className="counter-value">{count}</p>
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          1増やす
        </button>
      </section>

      <section className="card">
        <h2>実行環境</h2>
        <ul>
          <li>Node.js: {window.desktop.versions.node}</li>
          <li>Chromium: {window.desktop.versions.chrome}</li>
          <li>Electron: {window.desktop.versions.electron}</li>
        </ul>
        <button
          type="button"
          onClick={() =>
            window.desktop.openExternal('https://www.electronjs.org/')
          }
        >
          Electron 公式サイトを開く
        </button>
      </section>
    </main>
  );
}

export default App;

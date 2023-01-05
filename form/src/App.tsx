import { FC, useEffect, useState } from 'react';
import liff from '@line/liff';
import './App.css';

const App: FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
      .then(() => {
        setMessage('LIFF init succeeded.');
      })
      .catch((e: Error) => {
        setMessage('LIFF init failed.');
        setError(`${e.stack?.split('\n')[0] ?? ''}`);
      });
  });

  return (
    <div className="app">
      <h1>create-liff-app</h1>
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <a
        href="https://developers.line.biz/ja/docs/liff/"
        target="_blank"
        rel="noreferrer"
      >
        LIFF Documentation
      </a>
    </div>
  );
};

export default App;

import { useEffect } from 'react';
import type { FC } from 'react';
import liff from '@line/liff';
import { isLocal } from 'domains/lib';
import From from 'components/ecosystems/Form';

const App: FC = () => {
  useEffect(() => {
    if (!isLocal()) {
      void liff.init({
        liffId: import.meta.env.VITE_LIFF_ID,
        withLoginOnExternalBrowser: true,
      });
    }
  }, []);

  return <From />;
};

export default App;

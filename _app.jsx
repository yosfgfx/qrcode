import '../styles/globals.css';
import Layout from '../components/Layout';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
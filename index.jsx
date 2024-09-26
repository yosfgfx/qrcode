import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/QRCode_Generator_Yosfgfx.html');
  }, []);

  return null;
};

export default Home;
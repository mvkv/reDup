import '../styles/globals.css';
import type { AppProps } from 'next/app';
import BaseLayout from '../components/layouts/BaseLayout';
import { AuthProvider } from '../providers/auth-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </AuthProvider>
  );
}

export default MyApp;

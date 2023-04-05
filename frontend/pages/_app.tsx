import '../styles/globals.css';
import type { AppProps } from 'next/app';
import BaseLayout from '../components/layouts/BaseLayout';
import { AuthProvider } from '../providers/auth-context';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>ReDup - Remove photo duplicates from Google Drive</title>
        <meta name="description" content="ReDup" />
        <link rel="icon" href="/images/favicon.ico" type="image/svg+xml"></link>
      </Head>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </AuthProvider>
  );
}

export default MyApp;

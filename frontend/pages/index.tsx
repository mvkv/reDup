import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import LandingPageMain from '../public/images/landing_page_main.svg';
import GoogleButton from 'react-google-button';
import { redirectToGoogleAuth } from '../utils/GoogleAuthRedirect';
import { useAuth } from '../providers/auth-context';
import Link from 'next/link';

const Home: NextPage = () => {
  const { authState } = useAuth();
  const isLoggedIn = authState.isLoggedIn;

  return (
    <>
      <Head>
        <title>Remove duplicates from drive</title>
        <meta name="description" content="ReDup" />
      </Head>

      <main className="h-full min-w-full flex justify-center items-center flex-col gap-8 px-[200px]">
        <div className="grid grid-cols-8">
          <div className="col-span-5 flex flex-col gap-5">
            <h1 className="text-5xl font-bold text-main-text">
              Remove duplicates from
            </h1>
            <h1 className="text-5xl font-bold text-main">Google Drive</h1>
            <p className="text-xl text-main-text">
              With just one click, for <span className="font-bold">FREE</span>
            </p>
            {!isLoggedIn && (
              <GoogleButton onClick={() => redirectToGoogleAuth()} />
            )}
            {isLoggedIn && (
              <div>
                Go to the{' '}
                <Link href="/dashboard">
                  <span className="text-3xl text-main font-bold uppercase underline">
                    dashboard
                  </span>
                </Link>
              </div>
            )}
          </div>
          <div className="col-span-3">
            <Image src={LandingPageMain} alt="Landing page main image" />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

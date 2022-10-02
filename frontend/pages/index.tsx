import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import LandingPageMain from '../public/images/landing_page_main.svg';
import GoogleButton from 'react-google-button';
import { redirectToGoogleAuth } from '../utils/GoogleAuthRedirect';

const Home: NextPage = () => {
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
            <GoogleButton onClick={redirectToGoogleAuth} />
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

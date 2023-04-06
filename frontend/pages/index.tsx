import type { NextPage } from 'next';
import Image from 'next/image';
import LandingPageMain from '../public/images/landing_page_main.svg';
import { useAuth } from '../providers/auth-context';
import Link from 'next/link';
import ThemedButton from '../components/common/ThemedButton';
import { GitHub } from 'react-feather';
import SignInWithGoogle from '../components/common/SignInWithGoogle';

const Home: NextPage = () => {
  const { authState } = useAuth();
  const isLoggedIn = authState.isLoggedIn;

  return (
    <>
      <main className="h-full min-w-full flex flex-col">
        <div className="flex flex-1 justify-center items-center flex-col gap-8 px-[24px] lg:px-[120px]">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 items-center ">
            <div className="col-span-5 flex flex-col gap-5 max-w-[1080px] order-2 lg:order-1">
              <h1 className="text-2xl lg:text-5xl font-bold text-black font-montserrat">
                Review & remove similar images from your Google Drive{' '}
                <span className="text-spark-purple-500">
                  quickly and for free!
                </span>
              </h1>
              <h2 className="text-xl text-black">
                We use a ML algorithm to find images that are likely to be
                similar with each other, so you can declutter your drive and
                save space!
              </h2>
              <div className="flex flex-col gap-4">
                {!isLoggedIn && (
                  <>
                    <p className="text-2xl font-bold">Try it out now!</p>
                    <SignInWithGoogle />
                  </>
                )}
                {isLoggedIn && (
                  <div>
                    <Link href="/dashboard">
                      <ThemedButton onClick={null} label="Get started!" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-3 order-1 lg:order-2">
              <Image src={LandingPageMain} alt="Landing page main image" />
            </div>
          </div>
        </div>
        <footer className="px-8 py-4 flex justify-end font-mono text-xs">
          <div className="flex gap-x-2">
            <p>Made with ❤ & Next.js.</p>
            {/* TODO: Add proper link. */}
            <a href="" className="group">
              <GitHub
                size={14}
                className="group-hover:stroke-spark-purple-600"
              ></GitHub>
            </a>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;

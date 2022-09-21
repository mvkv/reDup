import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getHelloWorld } from '../apiCalls/HelloWorld';

const Home: NextPage = () => {
  const [response, setResponse] = useState<string>('');

  const getHelloWorldFromApi = async () => {
    setResponse(await getHelloWorld());
  };

  return (
    <div>
      <Head>
        <title>Remove duplicates from drive</title>
        <meta name="description" content="ReDup" />
      </Head>

      <main className="min-h-screen flex justify-center items-center flex-col gap-8">
        <h1 className="text-2xl">Welcome to ReDup</h1>

        <p> Click here to test connectivity</p>
        <button
          className="py-2 px-4 bg-blue-500 hover:bg-blue-400 color-white rounded-md"
          onClick={getHelloWorldFromApi}
        >
          Click
        </button>

        <p>{response}</p>
      </main>
    </div>
  );
};

export default Home;

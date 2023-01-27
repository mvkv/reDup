import type { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '../providers/auth-context';
import { useEffect } from 'react';
import Router from 'next/router';
import DashboardComponent from '../components/DashboardComponent';

const Dashboard: NextPage = () => {
  const { authState } = useAuth();
  const isLoggedIn = authState.isLoggedIn;

  // Bump the user back to the Homepage if they are not logged in / the log-out while visiting this page.
  useEffect(() => {
    if (!isLoggedIn) {
      Router.push('/');
    }
  }, [isLoggedIn]);

  return (
    <>
      <Head>
        <title>Remove duplicates from drive</title>
        <meta name="description" content="ReDup" />
      </Head>

      <main className="h-full min-w-full flex justify-center items-center flex-col gap-8 px-[150px] py-[100px] bg-slate-200">
        {isLoggedIn && <DashboardComponent />}
      </main>
    </>
  );
};

export default Dashboard;

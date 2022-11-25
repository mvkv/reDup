import type { NextPage } from 'next';
import { useAuth } from '../../providers/auth-context';
import { useEffect } from 'react';
import { ActionType, Service } from '../../types/auth';
import Router from 'next/router';

const GoogleLogin: NextPage = () => {
  const { setLastCommand } = useAuth();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);

    const [error, code] = [
      urlSearchParams.get('error'),
      urlSearchParams.get('code'),
    ];
    const isValidAuth = error == null && code != null && code != '';
    if (isValidAuth) {
      setLastCommand({
        type: ActionType.LOGIN,
        service: Service.GOOGLE,
        token: code,
      });
    } else {
      // TODO: Handle invalid auth.
    }
    Router.push('/');
  }, [setLastCommand]);

  return (
    <>
      <main className="h-full min-w-full flex justify-center items-center flex-col gap-8 px-[200px]">
        <div>Login in progress.</div>
      </main>
    </>
  );
};

export default GoogleLogin;

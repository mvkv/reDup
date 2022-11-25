import { LoginResponse, LogoutResponse } from '../types/api';
import config from '../config.json';

export const doCookieLogin = async (): Promise<LoginResponse> => {
  const res = await fetch(`${config.backendAddress}/api/auth/cookie`, {
    method: 'GET',
    credentials: 'include',
  });
  const body: LoginResponse = await res.json();
  return body;
};

export const doGoogleLogin = async (code: string): Promise<LoginResponse> => {
  const res = await fetch(
    `${config.backendAddress}/api/auth/google?${new URLSearchParams({
      code,
    })}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );
  const body: LoginResponse = await res.json();
  return body;
};

export const doLogout = async (): Promise<LogoutResponse> => {
  const res = await fetch(`${config.backendAddress}/api/auth/logout`, {
    method: 'GET',
    credentials: 'include',
  });
  const body: LogoutResponse = await res.json();
  return body;
};

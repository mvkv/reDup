import { LoginResponse } from '../types/api';
import config from '../config.json';

export const doLogin = async (code: string): Promise<LoginResponse> => {
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

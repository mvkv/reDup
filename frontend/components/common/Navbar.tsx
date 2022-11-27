import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import GoogleButton from 'react-google-button';
import Logo from '../../public/images/logo.svg';
import { useAuth } from '../../providers/auth-context';
import { redirectToGoogleAuth } from '../../utils/GoogleAuthRedirect';
import { ActionType, Service } from '../../types/auth';

const Navbar = () => {
  const linkClass =
    'cursor-pointer transition duration-150 border-b border-transparent hover:border-main';

  const { authState, setLastCommand } = useAuth();

  return (
    <div className="flex justify-between items-center px-[200px] py-1 shadow-md">
      <div className="flex gap-8">
        <Link href="/">
          <Image src={Logo} alt="Logo" className="cursor-pointer" />
        </Link>
        <div className="flex items-center gap-8 text-main-text">
          <Link href="/dashboard">
            <span className={linkClass}>Remove duplicates</span>
          </Link>
          {/* TODO: Add back once implemented. */}
          {/* <Link href="/about">
            <span className={linkClass}>About us</span>
          </Link>
          <Link href="/donate">
            <span className={linkClass}>Donate</span>
          </Link> */}
        </div>
      </div>
      {!authState.isLoggedIn && (
        <GoogleButton onClick={() => redirectToGoogleAuth()} />
      )}
      {authState.isLoggedIn && (
        <div>
          <span>Hello {authState.email}! </span>
          <button
            className="px-2 py-1 border-2 border-blue-700 bg-blue-100"
            onClick={() =>
              setLastCommand({
                type: ActionType.LOGOUT,
                service: Service.UNDEFINED,
                token: '',
              })
            }
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

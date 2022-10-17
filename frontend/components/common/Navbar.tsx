import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import GoogleButton from 'react-google-button';
import Logo from '../../public/images/logo.svg';

type NavbarProps = {
  googleLoginCallback: () => void;
};

const Navbar = ({ googleLoginCallback }: NavbarProps) => {
  const linkClass =
    'cursor-pointer transition duration-150 border-b border-transparent hover:border-main';

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
          <Link href="/about">
            <span className={linkClass}>About us</span>
          </Link>
          <Link href="/donate">
            <span className={linkClass}>Donate</span>
          </Link>
        </div>
      </div>
      <GoogleButton onClick={googleLoginCallback} />
    </div>
  );
};

export default Navbar;

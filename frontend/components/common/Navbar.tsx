import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import GoogleButton from 'react-google-button';
import Logo from '../../public/images/logo.svg';

type NavbarProps = {
  googleLoginCallback: () => void;
};

const Navbar = ({ googleLoginCallback }: NavbarProps) => {
  return (
    <div className="flex justify-between items-center px-[200px] py-1 shadow-md">
      <div className='flex gap-8'>
        <Image src={Logo} alt="Logo" />
       <div className="flex items-center gap-8 text-main-text">
       <Link href="/dashboard">Remove duplicates</Link>
        <Link href="/about">About us</Link>
        <Link href="/donate">Donate</Link>
       </div>
      </div>
      <GoogleButton onClick={googleLoginCallback} />
    </div>
  );
};

export default Navbar;

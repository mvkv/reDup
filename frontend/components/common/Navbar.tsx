import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import Logo from '../../public/images/logo.svg';
import UserProfile from './UserProfile';

const Navbar = () => {
  const linkClass =
    'cursor-pointer transition duration-150 border-b-2 border-transparent hover:border-spark-purple-500 text-xl xl:text-3xl font-semibold font-montserrat';

  return (
    <div className="flex justify-between items-center px-6 xl:px-12 py-3 xl:py-4 border-b-spark-purple-500 border-b-8 shadow-md ">
      <Link href="/">
        <div className="flex gap-4">
          <Image
            src={Logo}
            alt="Logo"
            className="cursor-pointer drop-shadow-md h-9 w-9 xl:h-[44px] xl:w-[44px]"
          />
          <div className="flex items-center gap-8 text-black">
            <span className={linkClass}>reDup</span>
          </div>
        </div>
      </Link>
      <UserProfile />
    </div>
  );
};

export default Navbar;

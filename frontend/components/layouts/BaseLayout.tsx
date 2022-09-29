import React, { ReactNode } from 'react';
import Navbar from '../common/Navbar';
import { RedirectToGoogleAuth } from '../../utils/GoogleAuthRedirect';

type BaseLayoutProps = {
  children: ReactNode;
};

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar googleLoginCallback={RedirectToGoogleAuth} />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default BaseLayout;

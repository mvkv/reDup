import React, { ReactNode } from 'react';
import Navbar from '../common/Navbar';
import { redirectToGoogleAuth } from '../../utils/GoogleAuthRedirect';

type BaseLayoutProps = {
  children: ReactNode;
};

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar googleLoginCallback={redirectToGoogleAuth} />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default BaseLayout;

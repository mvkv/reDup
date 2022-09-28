import React, { ReactNode } from 'react';
import Navbar from '../common/Navbar';
import {RedirectToGoogleAuth} from "../../utils/GoogleAuthRedirect";

type BaseLayoutProps = {
    children: ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <Navbar googleLoginCallback={RedirectToGoogleAuth} />
      {children}
    </>
  );
};

export default BaseLayout;

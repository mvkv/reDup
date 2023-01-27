import React, { ReactNode } from 'react';
import Navbar from '../common/Navbar';

type BaseLayoutProps = {
  children: ReactNode;
};

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow min-h-0">{children}</div>
    </div>
  );
};

export default BaseLayout;

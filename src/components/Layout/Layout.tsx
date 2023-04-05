import React, { FC } from 'react';
import Topbar from './Topbar/Topbar';
import './Layout.sass'

interface LayoutProps {
  children: React.ReactElement;
  isRequest?: boolean;
}

const Layout: FC<LayoutProps> = (props) => (
  <div className={'Layout'} data-testid="Layout">
    <Topbar isRequest={props.isRequest || false} />
    <div className="content">
      {props.children}
    </div>
  </div>
);

export default Layout;

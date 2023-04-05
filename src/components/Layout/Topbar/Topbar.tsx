import { AccountCircleOutlined, CloseOutlined, MenuOutlined } from '@mui/icons-material';
import React, { FC, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrgContext } from '../../../App';
import LogoutButton from '../../Login/LogoutButton';
import OrgSelectBox from '../../utils/OrgSelectBox/OrgSelectBox';
import './Topbar.sass';
const logo = require('./../../../images/logo-placeholder.png')

interface TopbarProps {
  isRequest: boolean;
}

const Topbar: FC<TopbarProps> = (props) => {
  let [showNav, setShowNav] = useState(false)
  let {activeOrg} = useContext(OrgContext)
  
  return (
    <div className="Topbar" data-testid="Topbar">
      <div className='left'>
        <div className="logo"><img src={logo} alt='Wartify Logo' /></div>
        {!props.isRequest && (
          <div className={`nav ${showNav ? 'active' : ''}`}>
            <CloseOutlined className='mobile-only nav-close' onClick={() => setShowNav(false)} />
            <div className="org-select"><OrgSelectBox /></div>
            <Link to={activeOrg?._id ? '/dashboard' : '/konto?err=setfirstproject'} className='nav-link'><strong>Dashboard</strong></Link>
          </div>
        )}
      </div>
      <div>
        <Link to='/konto' style={{marginRight: 10}}><AccountCircleOutlined /></Link>
        <LogoutButton />
        <MenuOutlined className='mobile-only' onClick={() => setShowNav(true)} sx={{marginLeft: '10px'}} />
      </div>
    </div>
  )
};

export default Topbar;

/* eslint-disable @typescript-eslint/no-array-constructor */
import { useState } from 'react';
import { FC } from 'react';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import './Sidebar.sass';
import OrgSelectBox from '../../utils/OrgSelectBox/OrgSelectBox';

interface SidebarProps {}


const Sidebar: FC<SidebarProps> = () => {
  let [redirect, setRedirect] = useState('')

  // useEffect(() => {
  //   if (activeOrg === 'create_new') return setRedirect('/konto?create_new=true')
  // }, [activeOrg])

  if (redirect) {
    let path = redirect

    setRedirect('')

    return <Navigate to={path} />
  }

  return (
    <div className="Sidebar" data-testid="Sidebar">
      <div className="logo">
        Logo
      </div>
      <OrgSelectBox />
      <div className='sidebar-nav'>
        <div className='link'><Link to={'/dashboard'}>Dashboard</Link></div>
        <div className='link'><Link to={'/objekte'}>Objekte</Link></div>
        <div className='link'><Link to={'/einstellungen'}>Einstellungen</Link></div>
        <div className='link'><Link to={'/konto'}>Konto</Link></div>
      </div>
    </div>
  )
}

export default Sidebar;

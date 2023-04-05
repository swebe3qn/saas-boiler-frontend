/* eslint-disable @typescript-eslint/no-array-constructor */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './App.sass';

import { Routes, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import LoadingIndicator from './components/utils/LoadingIndicator/LoadingIndicator';
import ProfileRoute from './routes/Profile';
import LoginRoute from './routes/Login';
import { emptyOrg, fetchOrgs, fetchOrgsRes, Organization } from './services/organizationsService';
import { ToastContainer } from 'react-toastify';
import {  getAuth  } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';
import { User } from './interfaces/user';
import { getUserSubscriptionData } from './services/userService';
import { err } from './utils/toast';
import DashboardRoute from './routes/Dashboard';

const unprotectedRoutes = [
  '/',
  '/registrieren',
  '/passwort-vergessen'
]

export let UserContext = React.createContext<User | undefined>(undefined);

export let OrgContext = React.createContext<{
  hasFetchedOrgs: boolean,
  setHasFetchedOrgs: Dispatch<SetStateAction<boolean>>,
  orgs: Organization[],
  setOrgs: Dispatch<SetStateAction<Organization[]>>,
  activeOrg: Organization,
  setActiveOrg: Dispatch<SetStateAction<Organization>>,
  fetchOrganizations: () => void
}>({
  hasFetchedOrgs: false,
  setHasFetchedOrgs: () => {return false},
  orgs: Array(),
  setOrgs: () => {return []},
  activeOrg: {...emptyOrg},
  setActiveOrg: () => {return {...emptyOrg}},
  fetchOrganizations: () => {}
});

function App() {
  const auth = getAuth()
  const [user, setUser] = useState<any>(auth.currentUser)

  useEffect(() => {
    auth.onAuthStateChanged(async (user: any) => {
      if (user && user.accessToken) {
        if (!user.emailVerified) return auth.signOut()

        await getUserSubscriptionData(user.accessToken)
        .then(res => {
          if (res.data?.data) user.subscriptions = res.data.data
          if (res.data?.user?._id) user._id = res.data.user._id
          if (res.data?.user?.name) user.name = res.data.user.name
          setUser(user)

          let redirect = window.sessionStorage.getItem('wartify_redirect')
          if (redirect) {
            window.sessionStorage.removeItem('wartify_redirect')
            window.location.href = redirect
          }
        })
        .catch((e) => {
          console.log(e)
        })
      } else if (!unprotectedRoutes.includes(window.location.pathname)) {
        if (window.location.href.includes('/konto?invite=')) window.sessionStorage.setItem('wartify_redirect', window.location.href)
        window.location.href = `/`
      }
    })
  }, [])

  const [orgs, setOrgs]: [Organization[], Dispatch<SetStateAction<Organization[]>>] = useState(Array());
  const [activeOrg, setActiveOrg]: [Organization, Dispatch<SetStateAction<Organization>>] = useState({...emptyOrg});
  const [hasFetchedOrgs, setHasFetchedOrgs] = useState(false);

  let fetchOrganizations = async () => {
    const accessToken = await auth.currentUser?.getIdToken() || '';

    fetchOrgs(accessToken)
    .then((res: fetchOrgsRes) => {
      if (res.data && res.data.length >= 1) {
        setOrgs(res.data)

        let sessionOrgId = window.sessionStorage.getItem('wartify_active_org')
        let sessionOrg = res.data.find(o => o._id === sessionOrgId && o.subscription?.status === 'active')
        setActiveOrg(sessionOrg ? sessionOrg : (typeof orgs[0] !== 'undefined' && orgs[0].subscription?.status === 'active' ? orgs[0] : {...emptyOrg}))
      } else {
        setOrgs([])
        setActiveOrg({...emptyOrg})
        if (window.location.pathname !== '/konto') window.location.href = ('/konto')
      }
    })
    .catch(error => {
      err(error.message || 'Fehler beim Abrufen der Daten.')
    })
    .finally(() => {
      setHasFetchedOrgs(true)
    })
  }

  const value = { orgs, setOrgs, activeOrg, setActiveOrg, fetchOrganizations, hasFetchedOrgs, setHasFetchedOrgs };

  useEffect(() => {
    if ((!orgs || orgs.length <= 1) && user && user.accessToken) fetchOrganizations()
  }, [user])

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <OrgContext.Provider value={value}>
          <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginRoute mode='login' />} />
                <Route path='/registrieren' element={<LoginRoute mode='register' />} />
                <Route path='/passwort-vergessen' element={<LoginRoute mode='forgot-pwd' />} />
                <Route path='/dashboard' element={<DashboardRoute />} />
                <Route path='/konto' element={<ProfileRoute />} />
                <Route path='*' element={<span>404 not found</span>}/>
            </Routes>
            
            <LoadingIndicator />

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </BrowserRouter>
        </OrgContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;

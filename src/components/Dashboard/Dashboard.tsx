/* eslint-disable @typescript-eslint/no-array-constructor */
import React, { FC, useContext, useEffect, useState } from 'react';
import { OrgContext } from '../../App';
import './Dashboard.sass';
import { Navigate } from 'react-router';

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  let {activeOrg, hasFetchedOrgs} = useContext(OrgContext)
  let [redirect, setRedirect] = useState('')

  useEffect(() => {
    if (hasFetchedOrgs && !activeOrg?._id) {
      setRedirect('/konto')
    }
  }, [hasFetchedOrgs])

  const loadData = () => {
    return
  }

  useEffect(() => {
    if (activeOrg && activeOrg._id) loadData()
  }, [activeOrg])

  if (redirect) return <Navigate to={redirect} />

  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard;

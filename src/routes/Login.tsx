import React from 'react';
import Login from '../components/Login/Login';

function LoginRoute(props: {mode: string}) {
  return (
    <Login mode={props.mode} />
  );
}

export default LoginRoute;
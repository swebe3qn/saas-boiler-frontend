import React, { FC } from 'react';
import LoginForm from './LoginForm/LoginForm';
import './Login.sass'
const logo = require('./../../images/logo-placeholder.png')

interface LoginProps {
  mode: string;
}

const Login: FC<LoginProps> = (props) => (
  <div className={'Login'} data-testid="Login">
    <div>
      <img className='logo' src={logo} alt='Wartify Logo' />
      <LoginForm mode={props.mode} />
    </div>
  </div>
);

export default Login;

import { Button, TextField } from '@mui/material';
import React, { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotiStore } from '../../../stores/notis';
import { err, suc } from '../../../utils/toast';
import {  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification  } from 'firebase/auth';
import { auth } from '../../../utils/firebase';
import './LoginForm.sass';
import { translateFirebaseCode } from '../../../utils/firebaseCodes';
import { createUserInDB } from '../../../services/userService';

interface LoginFormProps {
  mode: string;
}

const LoginForm: FC<LoginFormProps> = (props) => {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwdConf, setPwdConf] = useState('')
  const {mode} = props
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email) {
      err('Bitte gib eine Emailadresse an.')
      return
    } else if ((mode === 'login' || mode === 'register') && !pwd) {
      err('Bitte gib ein Passwort an.')
      return
    }

    if (mode === 'register') {
      if (pwd !== pwdConf) {
        err('Die Passwörter stimmen nicht überein.')
        return
      }

      NotiStore.setState({loading: true})
      
      await createUserWithEmailAndPassword(auth, email, pwd)
      .then(async (data: any) => {
        if (auth.currentUser) await sendEmailVerification(auth.currentUser)

        let {accessToken} = data.user

        if (!accessToken) {
          err('Fehler! Bitte wende dich an den Kundendienst.')
          return
        } else {
          await createUserInDB(accessToken)
          .then(async (res) => {
            suc('Konto erstellt. Bitte bestätige deine Emailadresse, indem du auf den Link klickst, den wir dir soeben gesendet haben.')
            navigate("/")
          })
          .catch(err => {
            err(err.message || 'Fehler! Bitte wende dich an den Kundendienst.')
          })
          .finally(() => {
            NotiStore.setState({loading: false})
          })
        }
      })
      .catch((error) => {
        err(translateFirebaseCode(error.code) || 'Fehler!')
      })
      .finally(() => {
        NotiStore.setState({loading: false})
      })
    } else if (mode === 'login') {
      NotiStore.setState({loading: true})
      
      await signInWithEmailAndPassword(auth, email, pwd)
      .then(async (userCredential) => {
        if (!userCredential?.user?.emailVerified) {
          await sendEmailVerification(userCredential.user)
          err('Bitte bestätige deine Emailadresse. Wir haben dir soeben noch einmal einen Link zugesendet.')
        } else {
          navigate("/dashboard")
        }
      })
      .catch((error) => {
        err(translateFirebaseCode(error.code) || 'Fehler!')
      })
      .finally(() => {
        NotiStore.setState({loading: false})
      })
    } else if (mode === 'forgot-pwd') {
      NotiStore.setState({loading: true})
      
      await sendPasswordResetEmail(auth, email)
      .then(() => {
        suc('Bitte überprüfe deine Emails.')
      })
      .catch((error: {code: string}) => {
        err(translateFirebaseCode(error.code) || 'Fehler!')
      })
      .finally(() => {
        NotiStore.setState({loading: false})
      })
    }
  }

  return (
    <div className="LoginForm">
      <TextField
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder='Email'
        fullWidth
        inputProps={{style: {textAlign: 'center'}}}
      />
      {(mode === 'login' || mode === 'register') && (
        <TextField
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          placeholder='Passwort'
          fullWidth
          type={'password'}
          inputProps={{style: {textAlign: 'center'}}}
        />
      )}
      {mode === 'register' && (
        <TextField
          value={pwdConf}
          onChange={e => setPwdConf(e.target.value)}
          placeholder='Passwort bestätigen'
          fullWidth
          type={'password'}
          inputProps={{style: {textAlign: 'center'}}}
        />
      )}
      <div>
        <Button variant='contained' fullWidth onClick={handleSubmit}>
          {mode === 'register' && 'Konto erstellen'}
          {mode === 'login' && 'Anmelden'}
          {mode === 'forgot-pwd' && 'Passwort zurücksetzen'}
        </Button>
      </div>
      <div>
        <Link to={(mode === 'register' || mode === 'forgot-pwd') ? '/' : '/registrieren'}><Button sx={{marginTop: '.6rem'}} color='secondary' variant='contained' fullWidth>{(mode === 'register' || mode === 'forgot-pwd') ? 'Zum Login' : 'Konto erstellen'}</Button></Link>
      </div>
      {mode === 'login' && <div style={{marginTop: '.6rem'}} className='text-center'><Link to={'/passwort-vergessen'}>Passwort vergessen?</Link></div>}
    </div>
  )
};

export default LoginForm;

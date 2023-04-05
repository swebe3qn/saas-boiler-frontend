import { Box, Button, Modal, TextField } from '@mui/material';
import React, { FC, useState } from 'react';
import { NotiStore } from '../../../stores/notis';
import './PasswordModal.sass';
import {auth} from '../../../utils/firebase';
import { suc, err } from '../../../utils/toast';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { translateFirebaseCode } from '../../../utils/firebaseCodes';

interface PasswordModalProps {
  onClose: () => void;
}

const PasswordModal: FC<PasswordModalProps> = (props) => {
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  const handleSubmit = async () => {
    if (!newPassword) return err('Bitte gib ein Passwort ein.')
    else if (newPassword.length < 6) return err('Das Passwort muss mindestens 6 Zeichen lang sein.')
    else if (newPassword !== newPasswordConfirm) return err('Die Passwörter stimmen nicht überein.')

    NotiStore.setState({loading: true})

    let user = auth.currentUser

    if (user) {
      reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email || '', password))
      .then(() => {
        if (user) updatePassword(user, newPassword)
        .then(() => {
          suc('Passwort geändert.')
          props.onClose()
        })
        .catch((e) => {
          err('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
        })
        .finally(() => {
          NotiStore.setState({loading: false})
        })
      })
      .catch((e) => {
        if (e.code) {
          err(translateFirebaseCode(e.code))
        } else {
          err('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
        }
        NotiStore.setState({loading: false})
      })
    }
  }

  return (
    <Modal
      open={true}
      onClose={props.onClose}
    >
      <Box className='Modal-box' boxShadow={3} sx={{width: '95%', maxWidth: '600px'}}>
        <h2>Kontodaten ändern</h2>
        <TextField
          value={password || ''}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          label={'Altes Passwort'}
          type='password'
        />
        <TextField
          value={newPassword || ''}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          label={'Neues Passwort'}
          type='password'
        />
        <TextField
          value={newPasswordConfirm || ''}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          fullWidth
          label={'Neues Passwort bestätigen'}
          type='password'
        />
        <Button onClick={handleSubmit} fullWidth variant='contained'>Daten speichern</Button>
      </Box>
    </Modal>
  )
}

export default PasswordModal;

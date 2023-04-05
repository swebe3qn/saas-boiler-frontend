import { Box, Button, Modal, TextField } from '@mui/material';
import React, { FC, useContext, useState } from 'react';
import { resetNotifications } from '../../../services/notiStoreService';
import { NotiStore } from '../../../stores/notis';
import './AccountInfoModal.sass';
import {auth} from '../../../utils/firebase';
import { updateAccountInfo } from '../../../services/userService';
import { UserContext } from '../../../App';
import { suc, err } from '../../../utils/toast';

interface AccountInfoModalProps {
  onClose: () => void;
  name: string;
}

const AccountInfoModal: FC<AccountInfoModalProps> = (props) => {
  const [name, setName] = useState(props.name)
  const user = useContext(UserContext)

  const handleSubmit = async () => {
    resetNotifications();
    NotiStore.setState({loading: true})

    const accessToken = await auth.currentUser?.getIdToken() || '';

    updateAccountInfo(name, accessToken)
    .then(res => {
      suc('Daten gespeichert.')
      if (user) user.name = name
      props.onClose()
    })
    .catch(error => {
      err(error.message || 'Beim Speichern der Daten ist ein Fehler aufgetreten.')
    })
    .finally(() => {
      NotiStore.setState({loading: false})
    })
  }

  return (
    <Modal
      open={true}
      onClose={props.onClose}
    >
      <Box className='Modal-box' boxShadow={3} sx={{width: '95%', maxWidth: '600px'}}>
        <h2>Kontodaten ändern</h2>
        <TextField
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          label={'Dein Name'}
        />
        <Button onClick={handleSubmit} fullWidth variant='contained'>Daten speichern</Button>
      </Box>
    </Modal>
  )
}

export default AccountInfoModal;

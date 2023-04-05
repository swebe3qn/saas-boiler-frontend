import { Box, Button, Modal, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { FC } from 'react';
import { useContext } from 'react';
import { OrgContext } from '../../../App';
import { resetNotifications } from '../../../services/notiStoreService';
import { NotiStore, NotiStoreState } from '../../../stores/notis';
import {createOrg, updateOrg} from '../../../services/organizationsService'
import './OrganisationModal.sass';
import { useEffect } from 'react';
import {auth} from '../../../utils/firebase';
import { err, suc } from '../../../utils/toast';

interface OrganisationModalProps {
  onClose: () => void,
  fetchOrgs: () => void,
  editId?: string,
}

const OrganisationModal: FC<OrganisationModalProps> = (props) => {
  let [name, setName] = useState('')
  const loading = NotiStore((state: NotiStoreState) => state.loading)
  let {editId} = props
  let {orgs} = useContext(OrgContext)

  useEffect(() => {
    if (editId) {
      let match = orgs.filter(org => org._id === editId)[0]
      if (typeof match !== 'undefined') {
        setName(match.name)
      }
    }
  }, [editId, orgs])

  // const getAvailableSeats = (): Number => {
  //   let availableSeats = 0
  
  //   if (user && user.subscriptions && user.subscriptions[0] && user.subscriptions[0].quantity) availableSeats = user.subscriptions[0].quantity
  
  //   if (orgs.length >= 1) orgs.forEach(org => {if (org.seats && org._id !== editId) availableSeats -= org.seats})
  
  //   return availableSeats < 0 ? 0 : availableSeats
  // }
  
  let onClose = (): void => {
    setName('')

    props.onClose()
  }

  // let updateSeats = (value: string):void => {
  //   if (value === '+' && seats <= 98) seats++
  //   else if (value === '-' && seats >= 2) seats--

  //   setSeats(seats)
  // }

  let handleCreateOrg = async (): Promise<void> => {
    resetNotifications();
    NotiStore.setState({loading: true})

    const accessToken = await auth.currentUser?.getIdToken() || '';

    createOrg({name, accessToken})
    .then(res => {
      suc('Erfolgreich.')
      onClose()

      props.fetchOrgs()
    })
    .catch(error => {
      err(error.message || 'Beim Erstellen des Projektes ist ein Fehler aufgetreten.')
    })
    .finally(() => {
      NotiStore.setState({loading: false})
    })
  }

  let handleUpdateOrg = async (): Promise<void> => {
    resetNotifications();
    NotiStore.setState({loading: true})

    const accessToken = await auth.currentUser?.getIdToken() || '';

    updateOrg({_id: editId || '', name, accessToken})
    .then(res => {
      suc('Erfolgreich.')
      onClose()

      props.fetchOrgs()
    })
    .catch(error => {
      err(error.message || 'Beim Aktualisieren des Projektes ist ein Fehler aufgetreten.')
    })
    .finally(() => {
      NotiStore.setState({loading: false})
    })
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
    >
      <Box className='Modal-box' boxShadow={3}>
        <h2>Projekt {editId ? 'bearbeiten' : 'erstellen'}</h2>
        <TextField
          value={name}
          label='Name'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          fullWidth
        />
        <Button disabled={loading} fullWidth variant='contained' onClick={editId ? handleUpdateOrg : handleCreateOrg} sx={{marginTop: '1rem'}}>Projekt {editId ? 'aktualisieren' : 'erstellen'}</Button>
      </Box>
    </Modal>
  )
}

export default OrganisationModal;

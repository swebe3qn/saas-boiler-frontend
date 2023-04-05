import { Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import React, { FC, useContext, useState } from 'react';
import { resetNotifications } from '../../../services/notiStoreService';
import { inviteMember, Member, removeMember } from '../../../services/organizationsService';
import { timestampToDate } from '../../../services/stringService';
import { NotiStore } from '../../../stores/notis';
import './Team.sass';
import {auth} from '../../../utils/firebase';
import { UserContext } from '../../../App';
import { HighlightOffOutlined } from '@mui/icons-material';
import { err, suc } from '../../../utils/toast';

interface TeamProps {
  members: Member[],
  requesters: Member[],
  org: string,
  subscription?: string,
  orgStatus: string,
  fetchOrganizations: () => void,
}

const Team: FC<TeamProps> = (props) => {
  let [email, setEmail] = useState('')
  let [type, setType] = useState('')
  let {members, org, requesters} = props
  const user = useContext(UserContext)

  let handleRemoveMember = async (org: string, member: string) => {
    if (window.confirm('Bist du sicher, dass du diesen Nutzer vom Projekt entfernen möchtest?')) {
      resetNotifications();
      NotiStore.setState({loading: true})

      const accessToken = await auth.currentUser?.getIdToken() || '';

      removeMember(org, member, accessToken)
      .then(res => {
        suc('Zugriff entfernt.')

        props.fetchOrganizations()
      })
      .catch(error => {
        err(error.message || 'Beim Löschen des Benutzers ist ein Fehler aufgetreten.')
      })
      .finally(() => {
        NotiStore.setState({loading: false})
      })
    }
  }

  const handleInviteMember = async() => {
    resetNotifications();
    NotiStore.setState({loading: true})

    const accessToken = await auth.currentUser?.getIdToken() || '';

    inviteMember(org, email, type, accessToken)
    .then(res => {
      suc('Einladung gesendet.')
      setEmail('')
      setType('')

      props.fetchOrganizations()
    })
    .catch(error => {
      err(error.message || 'Beim Senden der Einladung ist ein Fehler aufgetreten.')
    })
    .finally(() => {
      NotiStore.setState({loading: false})
    })
  }

  return (
    <div className="Team" data-testid="Team">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Art</strong></TableCell>
              <TableCell><strong>beigetreten</strong></TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members && members.length >= 1 && members.map(member => (
              <TableRow key={member.user.auth_id}>
                <TableCell>{member.user?.name || 'unbekannt'}{user?._id === member.user._id && ' (Du)'}</TableCell>
                <TableCell>{member.role === 'owner' ? 'Eigentümer' : 'Mitarbeiter'}</TableCell>
                <TableCell>{member.joinedAt ? timestampToDate(member.joinedAt) : 'unbekannt'}</TableCell>
                <TableCell align='right'>{member.role !== 'owner' ? <span onClick={() => handleRemoveMember(org, member._id)}><Tooltip title='Zugriff entfernen'><HighlightOffOutlined className='pointer error' /></Tooltip></span> : null}</TableCell>
              </TableRow>
            ))}
            {requesters && requesters.length >= 1 && requesters.map(member => (
              <TableRow key={member.user.auth_id}>
                <TableCell>{member.user?.name || 'unbekannt'}{user?._id === member.user._id && ' (Du)'}</TableCell>
                <TableCell>Antragsteller</TableCell>
                <TableCell>{member.joinedAt ? timestampToDate(member.joinedAt) : 'unbekannt'}</TableCell>
                <TableCell align='right'>{member.role !== 'owner' ? <span onClick={() => handleRemoveMember(org, member._id)}><Tooltip title='Zugriff entfernen'><HighlightOffOutlined className='pointer error' /></Tooltip></span> : null}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {props.orgStatus === 'active' && (
        <div>
          <div className="flex align-center invite-form" style={{margin: '1rem 0 .5rem'}}>
            <div style={{flex: 1, marginRight: '1rem'}}>
              <TextField
                value={email}
                onChange={e => setEmail(e.target.value)}
                type='email'
                size='small'
                sx={{marginRight: '10px', marginBottom: '0!important'}}
                label='Email'
                fullWidth
              />
            </div>
            <div style={{flex: 1, marginRight: '1rem'}}>
              <TextField
                value={type}
                onChange={e => setType(e.target.value)}
                size='small'
                sx={{marginRight: '10px', marginBottom: '0!important'}}
                label='Mitarbeiterart'
                fullWidth
                select
              >
                <MenuItem value='member'>Mitarbeiter</MenuItem>
                {props.subscription === 'prod_NP46HBIBXtJTHH' && <MenuItem value='requester'>Antragsteller</MenuItem>}
              </TextField>
            </div>
            <Button variant='contained' onClick={handleInviteMember}>Einladung senden</Button>
          </div>
          <div><small>Jede Einladung ist 24 Stunden gültig. Bitte überprüfe auch, ob du dem Projekt genügend Nutzer zugewiesen hast. Wenn nicht, kann der Empfänger die Einladung nicht annehmen.</small></div>
        </div>
      )}
    </div>
  )
}

export default Team;

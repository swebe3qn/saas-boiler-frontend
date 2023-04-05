import React, { FC } from 'react';
import './OrgSelectBox.sass';
import { MenuItem, TextField } from '@mui/material';
import { useContext } from 'react';
import { OrgContext, UserContext } from '../../../App';

interface OrgSelectBoxProps {}

const OrgSelectBox: FC<OrgSelectBoxProps> = () => {
  const { orgs, activeOrg, setActiveOrg } = useContext(OrgContext);
  const user = useContext(UserContext)

  let handleOrgChange = (val: string) => {
    let match = orgs.filter(o => o._id === val && o.subscription?.status === 'active' && o.members?.find(m => m.user._id === user?._id))
    if (typeof match[0] !== 'undefined') {
      setActiveOrg(match[0])
      window.sessionStorage.setItem('wartify_active_org', match[0]._id)
    }
  }

  return (
    <div className='OrgSelectBox'>
      <TextField
        fullWidth
        value={activeOrg?._id || ''}
        onChange={e => handleOrgChange(e.target.value)}
        size='small'
        sx={{ background: 'white'}}
        inputProps={{
          sx: {border: '2px solid #141F27', fontFamily: 'Proxima Bold'}
        }}
        select
      >
        {orgs.filter(o => o.subscription?.status === 'active' && o.members?.find(m => m.user._id === user?._id)).length >= 1 ? orgs.filter(o => o.subscription?.status === 'active' && o.members?.find(m => m.user._id === user?._id)).map(org => (
          <MenuItem key={org._id} value={org._id}>{org.name}</MenuItem>
        )) : <MenuItem value='' disabled>Keine Projekte vorhanden</MenuItem>}
      </TextField>
    </div>
  )
}

export default OrgSelectBox;

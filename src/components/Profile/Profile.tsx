import { Add, ContentCopy, DeleteOutlined, EditOutlined, LogoutOutlined, Remove } from "@mui/icons-material";
import { Button, InputAdornment, MenuItem, TextField, Tooltip } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { OrgContext, UserContext } from "../../App";
import { resetNotifications } from "../../services/notiStoreService";
import { acceptInvite, deleteOrg, leaveOrg, Organization } from "../../services/organizationsService";
import { NotiStore } from "../../stores/notis";
import OrganisationModal from "../modals/OrganisationModal/OrganisationModal";
import Team from "./Team/Team";
import {auth} from '../../utils/firebase';
import {err, inf, suc} from '../../utils/toast'
import AccountInfoModal from "../modals/AccountInfoModal/AccountInfoModal";
import './Profile.sass'
import { translateStripe, tsToDate } from "../../utils/string";
import PasswordModal from "../modals/PasswordModal/PasswordModal";

const Profile = () => {
  const user = useContext(UserContext)

  const [searchParams, setSearchParams] = useSearchParams();
  let createNewParam = searchParams.get("create_new")

  const [redirect, setRedirect] = useState('');
  const [plan, setPlan] = useState('');
  let [seats, setSeats] = useState(1);
  const [showModal, setShowModal] = useState('');
  const [openOrgModal, setOpenOrgModal] = useState(false);
  const [hasCheckedInvite, setHasCheckedInvite] = useState(false);
  const [editId, setEditId] = useState('');

  const { orgs, fetchOrganizations }: {
    orgs: Organization[],
    fetchOrganizations: () => void
  } = useContext(OrgContext);

  useEffect(() => {
    if (searchParams.get('err') && searchParams.get('err') === 'setfirstproject') {
      inf('Bitte wähle zuerst ein Projekt mit einem aktivem Abonomment aus.')
      setSearchParams(undefined)
    }
  }, [searchParams])

  const handleAcceptInvite = async (token: string) => {
    resetNotifications();
    NotiStore.setState({loading: true})

    const accessToken = await auth.currentUser?.getIdToken() || '';

    if (accessToken) acceptInvite(token, accessToken)
    .then(res => {
      suc('Projekt beigetreten.')

      fetchOrganizations()
    })
    .catch(error => {
      err(error.message || 'Beim Beitritt zum Projekt ist ein Fehler aufgetreten.')
    })
    .finally(() => {
      setHasCheckedInvite(true)
      NotiStore.setState({loading: false})
    })
  }

  useEffect(() => {
    setTimeout(() => {
      let inviteToken = (new URLSearchParams(window.location.search))?.get("invite") || ''
      if (inviteToken && !hasCheckedInvite) {
        handleAcceptInvite(inviteToken)
      }
    }, 500)
  }, [])

  useEffect(() => {
    if (createNewParam && createNewParam === 'true') setOpenOrgModal(true)
  }, [createNewParam])

  let handleSubscription = async (orgId: string) => {
    resetNotifications()
    NotiStore.setState({loading: true})

    if (!user || !user.uid) {
      err('Nicht authorisiert.')
      NotiStore.setState({loading: false})
      setRedirect('/')
    }
    if (!orgId) {
      err('Fehlerhafte Daten übermittelt.')
      NotiStore.setState({loading: false})
    }

    let data = {
      plan,
      seats,
      orgId,
    }

    const accessToken = await auth.currentUser?.getIdToken() || '';

    axios.post(process.env.REACT_APP_API_URL + '/first-subscription', data, {headers: {Authorization: `Bearer ${accessToken}`}})
    .then((res: AxiosResponse) => {
      if (res.data.session_url) window.location.href = res.data.session_url
    })
    .catch(error => {
      err(error.response?.data?.message || 'Es ist ein Fehler aufgetreten.')
    })
    .finally(() => {
      NotiStore.setState({loading: false})
    })
  }

  let createPortalSession = async (orgId: string, type: string) => {
    resetNotifications()
    NotiStore.setState({loading: true})

    if (!user || !user.uid) {
      err('Nicht authorisiert.')
      NotiStore.setState({loading: false})
      setRedirect('/')
    }
    if (!orgId || !type) {
      err('Fehlerhafte Daten übermittelt.')
      NotiStore.setState({loading: false})
    }

    const accessToken = await auth.currentUser?.getIdToken() || '';

    axios.get(process.env.REACT_APP_API_URL + '/create-portal-session/' + orgId + `/${type}`, {headers: {Authorization: `Bearer ${accessToken}`}})
    .then((res: AxiosResponse) => {
      if (res.data.session_url) window.location.href = res.data.session_url
    })
    .catch(error => {
      err(error.response?.data?.message || 'Es ist ein Fehler aufgetreten.')
    })
    .finally(() => {
      NotiStore.setState({loading: false})
    })
  }

  if (redirect) return <Navigate to={redirect} />

  const handleEditOrg = (id: string) => {
    if (id) {
      setEditId(id)
      setOpenOrgModal(true)
    }
  }

  const handleDeleteOrg = async (id: string) => {
    if (id && window.confirm('Bist du sicher, dass du das Projekt löschen möchtest? Dieser Schritt kann nicht mehr rückgängig gemacht werden.')) {
      resetNotifications();
      NotiStore.setState({loading: true})

      const accessToken = await auth.currentUser?.getIdToken() || '';

      deleteOrg({_id: id, accessToken})
      .then(res => {
        suc('Erfolgreich.')

        fetchOrganizations()
      })
      .catch(error => {
        err(error.message || 'Beim Löschen des Projektes ist ein Fehler aufgetreten.')
      })
      .finally(() => {
        NotiStore.setState({loading: false})
      })
    }
  }

  const handleLeaveOrg = async (id: string) => {
    if (id && window.confirm('Bist du sicher, dass du das Projekt verlassen möchtest? Dieser Schritt kann nicht mehr rückgängig gemacht werden.')) {
      resetNotifications();
      NotiStore.setState({loading: true})

      const accessToken = await auth.currentUser?.getIdToken() || '';

      leaveOrg({_id: id, accessToken})
      .then(res => {
        suc('Projekt verlassen.')

        fetchOrganizations()
      })
      .catch(error => {
        err(error.message || 'Beim Verlassen des Projektes ist ein Fehler aufgetreten.')
      })
      .finally(() => {
        NotiStore.setState({loading: false})
      })
    }
  }

  const isOwner = (org: Organization): boolean => {
    return org && org.owner && org.owner._id === user?._id ? true : false
  }

  const isMember = (org: Organization): boolean => {
    return !isOwner(org) && org.members.find(m => m.user._id === user?._id) ? true : false
  }

  const isRequester = (org: Organization): boolean => {
    return !isOwner(org) && org.requesters.find(m => m.user._id === user?._id) ? true : false
  }

  let updateSeats = (value: string):void => {
    if (value === '+' && seats <= 98) seats++
    else if (value === '-' && seats >= 2) seats--

    setSeats(seats)
  }

  console.log(orgs)

  return (
    user && user.uid ? (
      <div className="Account">
        <div className="flex">
          <div className="subscription-info">
            {/* TODO: update password */}
            <h1>Kontodaten</h1>
            <p>
              <span style={{width: '80px', fontWeight: 'bold', display: 'inline-block'}}>Email:</span> {user?.email}<br />
              <span style={{width: '80px', fontWeight: 'bold', display: 'inline-block'}}>Name:</span> {user.name}<br />
              <span style={{width: '80px', fontWeight: 'bold', display: 'inline-block'}}>Passwort:</span> ••••••••••
            </p>
            <div>
              <Button sx={{marginRight: '10px'}} variant="contained" onClick={() => setShowModal('info')}>Daten ändern</Button>
              <Button variant="contained" color="secondary" onClick={() => setShowModal('password')}>Passwort ändern</Button>
            </div>
          </div>

          <div className="org-data">
            <div className="with-button">
              <h1>Meine Projekte</h1>
              <Button variant="contained" onClick={() => setOpenOrgModal(true)}>Projekt erstellen</Button>
            </div>

            {orgs.length >= 1 ? orgs.map((org: Organization) => (
              <div key={org._id} className='organization'>
                <div className="flex align-center justify-space-between">
                  <div>
                    <h3 style={{margin: 0}}>{org.name}</h3>
                    {org.subscription?.status && (
                      <span>
                        <Tooltip title={org.subscription?.status !== "canceled" && (
                          <div>
                            Bis {tsToDate(Number(org.subscription.current_period_end)*1000)} -&nbsp;
                            {org.subscription?.cancel_at_period_end ? (
                              <span>Wird am Stichtag gekündigt</span>
                            ) : (
                              <span>Wird automatisch verlängert</span>
                            )}
                          </div>
                        )}>
                        <span>{translateStripe(org.subscription.status)}{org.subscription?.status !== "canceled" && org.subscription?.cancel_at_period_end && ` (wird gekündigt) `} - </span></Tooltip>
                      </span>
                    )}
                    {isOwner(org) && org.members && org.subscription?.quantity ? `Eigentümer - ${org.members.length} von ${org.subscription?.quantity || 0} Nutzer aktiv` : null}
                    {isMember(org) ? `Mitarbeiter` : null}
                    {isRequester(org) ? `Antragsteller` : null}
                  </div>
                  <div>
                    {/* TODO: implement collapse collaborators */}
                    {/* <Tooltip title='austreten'><GroupOutlined sx={{marginRight: '10px'}} className="pointer" /></Tooltip> */}
                    {isOwner(org) && <Tooltip title='Projekt bearbeiten'><EditOutlined sx={{marginRight: '10px'}} className="pointer" onClick={() => handleEditOrg(org._id)} /></Tooltip>}
                    {isOwner(org) && <Tooltip title='Projekt löschen'><DeleteOutlined className="pointer" onClick={() => handleDeleteOrg(org._id)} /></Tooltip>}
                    {!isOwner(org) && <Tooltip title='Aus Projekt austreten'><LogoutOutlined className="pointer" sx={{marginLeft: '10px'}} onClick={() => handleLeaveOrg(org._id)} /></Tooltip>}
                  </div>
                </div>

                {org?.subscription?.quantity && org.members && org.members.length > org?.subscription?.quantity && (
                  <div className="error" style={{marginTop: '1rem'}}>
                    <strong>Achtung!</strong> Das Projekt hat aktuell mehr Nutzer, als im Abonomment vorgesehen sind. Bitte aktualisiere die Anzahl der Nutzer (<span className="pointer" style={{textDecoration: 'underline'}} onClick={() => createPortalSession(org._id, 'update')}>hier</span>) oder entferne Mitglieder. Ansonsten werden die zuletzt hinzugefügten Nutzer automatisch entfernt.
                  </div>
                )}

                {isOwner(org) ? <Team orgStatus={org.subscription?.status || 'none'} subscription={org.subscription?.product || ''} members={org.members} requesters={org.requesters || []} org={org._id} fetchOrganizations={fetchOrganizations} /> : null}

                {isOwner(org) && (
                  <div className="subscription">
                    {org.subscription?.subId ? (
                      <>
                        {org.subscription.status === 'active' && !org.subscription.cancel_at_period_end && (
                          <div>
                            <Button variant="contained" onClick={() => createPortalSession(org._id, 'update')} sx={{marginRight: '1rem'}}>Abonomment verwalten</Button>
                            <Button variant="contained" color='error' onClick={() => createPortalSession(org._id, 'cancel')}>Abonomment kündigen</Button>
                          </div>
                        )}
                        {(org.subscription.status === 'canceled' || org.subscription.cancel_at_period_end) && (
                          <div>
                            <Button variant="contained" onClick={() => createPortalSession(org._id, 'reactivate')} sx={{marginRight: '1rem'}}>Abonomment reaktivieren</Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="">
                        <h3>Bitte wähle einen Plan:</h3>
                        <div className="flex first-sub">
                          <div style={{flex: 1, marginRight: '.5rem'}}>
                            <TextField
                              onChange={e => setPlan(e.target.value)}
                              value={plan} 
                              fullWidth
                              label='Plan wählen'
                              select
                            >
                              <MenuItem value='startup_monthly'>Startup mtl. - 9€ / Nutzer / Monat</MenuItem>
                              <MenuItem value='startup_yearly'>Startup jährl. - 90€ / Nutzer / Jahr</MenuItem>
                              <MenuItem value='business_monthly'>Business mtl. - 19€ / Nutzer / Monat</MenuItem>
                              <MenuItem value='business_yearly'>Business jährl. - 190€ / Nutzer / Jahr</MenuItem>
                              {/* 
                              <MenuItem value='enterprise_monthly'>Enterprise mtl.</MenuItem>
                              <MenuItem value='enterprise_yearly'>Enterprise jährl.</MenuItem> */}
                            </TextField>
                          </div>
                          <div style={{flex: 1, marginLeft: '.5rem'}}>
                            <TextField
                              type={'number'}
                              value={seats}
                              onChange={e => setSeats(Number(e.target.value))}
                              fullWidth
                              label='Anzahl der Nutzer'
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment className="pointer" position="start" onClick={() => updateSeats('-')}>
                                    <Remove />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment className="pointer" position="end" onClick={() => updateSeats('+')}>
                                    <Add />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        </div>
                        <div style={{marginBottom: '1rem'}}><small>Gutscheincodes können im nächsten Schritt eingegeben werden.</small></div>
                        <Button variant="contained" onClick={() => handleSubscription(org._id)}>Jetzt buchen</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )) : (
              <div className="set-first-org">
                Bitte erstelle dein erstes Projekt.
              </div>
            )}
          </div>
        </div>

        {openOrgModal && <OrganisationModal onClose={() => {setOpenOrgModal(false); setEditId('')}} fetchOrgs={() => fetchOrganizations()} editId={editId} />}
        {showModal === 'info' && <AccountInfoModal onClose={() => {setShowModal('')}} name={user.name || ''} />}
        {showModal === 'password' && <PasswordModal onClose={() => {setShowModal('')}} />}
      </div>
    ) : null
  );
};

export default Profile;
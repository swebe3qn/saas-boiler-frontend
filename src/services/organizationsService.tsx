import axios from "axios"
import { emptyUser, User } from "../interfaces/user"

interface createOrgRes {
  success: boolean,
  message: string,
}

export interface fetchOrgsRes {
  success: boolean,
  message: string,
  data: Organization[]
}

export interface fetchOrgRes {
  success: boolean,
  message: string,
  data: Organization
}

export interface Organization {
  name: string;
  _id: string;
  members: Member[];
  requesters: Member[];
  owner: User;
  subscription: Subscription | null | undefined;
}

export interface ChecklistItem {
  type: string,
  label: string,
  value: string,
}

interface Subscription {
  subId: string;
  status?: string;
  quantity: number;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  product?: string;
}

export let emptyOrg: Organization = {
  name: '',
  _id: '',
  members: [],
  requesters: [],
  owner: {...emptyUser},
  subscription: undefined,
}

export interface Category {
  _id: string,
  name: string,
}

export interface Location {
  _id: string,
  name: string,
}

export interface Member {
  _id: string,
  user: User,
  name: string,
  role: string,
  joinedAt: string
}

export interface fetchMembersRes {
  success: boolean,
  message: string,
  data: Member[]
}

export let createOrg = (data: {name: string, accessToken: string}): Promise<createOrgRes> => {
  return new Promise((resolve, reject) => {
    if (!data) return reject({
      success: false,
      message: 'Fehler',
    })

    let {name, accessToken} = data

    if (!accessToken) {
      return reject({
        success: false,
        message: 'Fehler',
      })
    } else if (!name) {
      return reject({
        success: false,
        message: 'Bitte gib den Namen des Projektes an und wie viele Nutzer du benötigst.',
      })
    } else {
      axios.post(process.env.REACT_APP_API_URL + '/organization/create', data, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Erstellen ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}

export let updateOrg = (data: {_id: string, name: string, accessToken: string}): Promise<createOrgRes> => {
  return new Promise((resolve, reject) => {
    if (!data) return reject({
      success: false,
      message: 'Fehler',
    })

    let {name, accessToken, _id} = data

    if (!accessToken || !_id) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else if (!name) {
      return reject({
        success: false,
        message: 'Bitte gib den Namen des Projektes an und wie viele Nutzer du benötigst.',
      })
    } else {
      axios.put(process.env.REACT_APP_API_URL + '/organization/' + _id, data, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Aktualisieren ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}

export let deleteOrg = (data: {_id: string, accessToken: string}): Promise<createOrgRes> => {
  return new Promise((resolve, reject) => {
    if (!data) return reject({
      success: false,
      message: 'Fehler',
    })

    let {accessToken, _id} = data

    if (!accessToken || !_id) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else {
      axios.delete(process.env.REACT_APP_API_URL + '/organization/' + _id, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Löschen ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}

export let leaveOrg = (data: {_id: string, accessToken: string}): Promise<createOrgRes> => {
  return new Promise((resolve, reject) => {
    if (!data) return reject({
      success: false,
      message: 'Fehler',
    })

    let {accessToken, _id} = data

    if (!accessToken || !_id) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else {
      axios.post(process.env.REACT_APP_API_URL + '/organization/' + _id + '/leave', {}, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Verlassen des Projektes ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}

export let fetchOrg = (id: string, accessToken: string): Promise<fetchOrgRes> => {
  return new Promise((resolve, reject) => {
    if (!accessToken || !id) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else {
      axios.get(process.env.REACT_APP_API_URL + '/organization/' + id, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Abrufen der Projektdaten ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}

export let fetchOrgs = (accessToken: string): Promise<fetchOrgsRes> => {
  return new Promise((resolve, reject) => {
    if (!accessToken) {
      return reject({
        success: false,
        message: 'Fehler',
        data: []
      })
    } else {
      axios.get(process.env.REACT_APP_API_URL + '/organization', {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Abrufen der Projektdaten ist ein Fehler aufgetreten.',
          data: []
        })
      })
    }
  })
}

export let fetchTeamMembers = (accessToken: string): Promise<fetchMembersRes> => {
  return new Promise((resolve, reject) => {
    if (!accessToken) {
      return reject({
        success: false,
        message: 'Fehler',
        data: []
      })
    } else {
      axios.get(process.env.REACT_APP_API_URL + '/organization', {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Abrufen der Projektdaten ist ein Fehler aufgetreten.',
          data: []
        })
      })
    }
  })
}

export let removeMember = (org: string, member: string, accessToken: string): Promise<{success: boolean, message: string}> => {
  return new Promise((resolve, reject) => {
    if (!accessToken || !org || !member) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else {
      axios.put(process.env.REACT_APP_API_URL + `/organization/${org}/remove-member`, {member}, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Aktualisieren ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}

export let inviteMember = (org: string, email: string, type: string, accessToken: string): Promise<{success: boolean, message: string}> => {
  return new Promise((resolve, reject) => {
    if (!accessToken || !org) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else if (!email) {
      return reject({
        success: false,
        message: 'Bitte gib eine gültige Emailadresse an.',
      })
    } else if (!type) {
      return reject({
        success: false,
        message: 'Bitte wähle eine Mitarbeiterart.',
      })
    } else {
      axios.put(process.env.REACT_APP_API_URL + `/organization/${org}/invite`, {email, type}, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Aktualisieren ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}

export let acceptInvite = (token: string, accessToken: string): Promise<{success: boolean, message: string}> => {
  return new Promise((resolve, reject) => {
    if (!accessToken || !token) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else {
      axios.post(process.env.REACT_APP_API_URL + `/organization/accept`, {token}, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Beitritt zum Projekt ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}
import axios from "axios"
import { User } from "../interfaces/user"

interface updateNameRes {
  success: boolean,
  message: string,
}

interface getUserSubscriptionDataRes {
  success: boolean,
  message: string,
  data: {data: Subscription[], user: User},
}

interface Subscription {
  id: string,
  quantity: string,
  plan: {
    id: string;
  };
}

export let createUserInDB = (accessToken: string): Promise<updateNameRes> => {
  return new Promise((resolve, reject) => {
    if (!accessToken) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else {
      axios.post(process.env.REACT_APP_API_URL + '/user/create', {}, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: 'Während dem Erstellen des Kontos ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}

export let getUserSubscriptionData = (accessToken: string): Promise<getUserSubscriptionDataRes> => {
  return new Promise((resolve, reject) => {
    if (!accessToken) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else {
      axios.get(process.env.REACT_APP_API_URL + '/user', {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
          data: res.data,
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Abrufen der Daten ist ein Fehler aufgetreten.',
          data: []
        })
      })
    }
  })
}

export let updateAccountInfo = (name: string, accessToken: string): Promise<{success: true, message: string}> => {
  return new Promise((resolve, reject) => {
    if (!accessToken) {
      return reject({
        success: false,
        message: 'Fehlerhafte Daten übermittelt.',
      })
    } else if (!name) {
      return reject({
        success: false,
        message: 'Bitte gib einen Namen an.',
      })
    } else {
      axios.put(process.env.REACT_APP_API_URL + '/user/me', {name}, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(res => {
        return resolve({
          success: true,
          message: '',
        })
      })
      .catch(err => {
        return reject({
          success: false,
          message: err.response?.data?.message || 'Während dem Speichern der Daten ist ein Fehler aufgetreten.',
        })
      })
    }
  })
}
import {NotiStore} from '../stores/notis';

export let resetNotifications = (): void => {
  NotiStore.setState({error: false, success: false, errorMessage: '', successMessage: '', info: ''});
}
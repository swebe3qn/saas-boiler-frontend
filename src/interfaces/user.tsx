export interface User {
  _id: string;
  uid: string;
  auth_id: string;
  stripe_id: string;
  name: string;
  email: string;
  subscriptions: any[];
}

export let emptyUser = {
  _id: '',
  uid: '',
  auth_id: '',
  stripe_id: '',
  name: '',
  email: '',
  subscriptions: [],
}
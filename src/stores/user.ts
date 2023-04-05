import create from 'zustand'

export const UserStore: any = create((set: any) => ({
  email: undefined,
  stripe_customer_id: undefined,
  subscriptions: undefined,
}))
import create from 'zustand'

export interface NotiStoreState {
  loading: boolean,
  success: string,
  error: string,
  info: string,
}

export const NotiStore: any = create((set: any) => ({
  loading: false,
  success: '',
  error: '',
  info: '',
}))
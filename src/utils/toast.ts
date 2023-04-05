import {toast} from 'react-toastify';

const toastConfig = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
}

export let suc = (message: string) => {
  // @ts-ignore
  toast.success(message, toastConfig);
}

export let err = (message: string) => {
  // @ts-ignore
  toast.error(message, toastConfig);
}

export let inf = (message: string) => {
  // @ts-ignore
  toast.info(message, toastConfig);
}
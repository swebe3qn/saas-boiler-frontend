import React, { FC } from 'react';
import './LoadingIndicator.sass';
import {NotiStore} from '../../../stores/notis';
import { Alert, Snackbar } from '@mui/material';

interface LoadingIndicatorProps {}

const LoadingIndicator: FC<LoadingIndicatorProps> = () => {
  const loading = NotiStore((state:any) => state.loading);

  if (loading) return (
    <Snackbar
      open={loading}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
        <Alert severity='info'>Lädt...</Alert>
    </Snackbar>
  );

  return null;
};

export default LoadingIndicator;

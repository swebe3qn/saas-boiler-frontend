import { Box, Modal } from '@mui/material';
import React, { FC } from 'react';
import DragDropFileUpload from '../../utils/DragDropFileUpload/DragDropFileUpload';
import './FileModal.sass';

interface FileModalProps {
  handleSubmit: (files: File[]) => void;
  onClose: () => void;
}

const FileModal: FC<FileModalProps> = (props) => {
  return (
    <Modal
      open={true}
      onClose={props.onClose}
    >
      <Box className='Modal-box' boxShadow={3} sx={{width: '95%', maxWidth: '600px'}}>
        <div><DragDropFileUpload handleSubmit={props.handleSubmit} /></div>
      </Box>
    </Modal>
  )
}

export default FileModal;

import React, { FC } from 'react';
import './DragDropFileUpload.sass';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone, {IFileWithMeta, IMeta} from 'react-dropzone-uploader'
import { NotiStore } from '../../../stores/notis';
import { err } from '../../../utils/toast';

interface DragDropFileUploadProps {
  handleSubmit: (files: File[]) => void,
}

const DragDropFileUpload: FC<DragDropFileUploadProps> = (props) => {
  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta }: {meta: IMeta}, status: string) => {
    if (status === 'rejected_file_type') err('Du kannst nur Dateien vom Typ PNG, JPG und PDF hochladen.')
    else if (status === 'error_file_size') err('Die maximale Dateigröße beträgt 10MB.')
  }

  const handleSubmit = (files: IFileWithMeta[], allFiles: IFileWithMeta[]) => {
    allFiles.forEach((f: IFileWithMeta) => f.remove())

    props.handleSubmit(files.map(f => f.file))
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      styles={{ dropzone: { minHeight: 200, maxHeight: 250 } }}
      accept="image/jpeg,image/jpg,image/png,application/pdf"
      inputContent={<div className='text-center'>Dateien hochladen<br /><small>JPG, PNG oder PDF (max. 10MB)</small></div>}
      maxFiles={10}
      maxSizeBytes={1024 * 1024 * 10} // 10MB
      inputWithFilesContent={'Dateien hinzufügen'}
      submitButtonContent={'Dateien senden'}
    />
  )
}

export default DragDropFileUpload;

import { DeleteForever, Download, VisibilityOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import React, { FC, useState } from 'react';
import FileViewer from '../../modals/FileViewer/FileViewer';
import './FilePreview.sass';

interface FilePreviewProps {
  file: {
    filename: string;
    title: string; 
    _id: string;
    createdAt: string;
  };
  styles: {[key: string]: string};
  handleDelete: (id: string) => void;
}

const FilePreview: FC<FilePreviewProps> = (props) => {
  let [viewFile, setViewFile] = useState<{
    filename: string;
    title: string; 
    _id: string;
    createdAt: string;
  } | undefined>()
  let {file, styles} = props

  return (
    <>
      <Tooltip title={file.title}>
        <div className="FilePreview" style={{...styles, backgroundImage: `url('${process.env.REACT_APP_S3_URL + file.filename}')`}}>
          <span>{file.filename.toLowerCase().includes('.pdf') && 'PDF'}</span>
          <div className='actions'>
            <VisibilityOutlined className='pointer' onClick={() => setViewFile(file)} />
            <a href={process.env.REACT_APP_S3_URL + file.filename} target='_blank' className='pointer' rel='noreferrer'><Download /></a>
            <DeleteForever className='pointer' onClick={() => props.handleDelete(file._id)} />
          </div>
        </div>
      </Tooltip>
      {viewFile && <FileViewer file={viewFile} onClose={() =>{ setViewFile(undefined) }} />}
    </>
  )
}

export default FilePreview;

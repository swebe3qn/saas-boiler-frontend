import { Modal } from '@mui/material';
import React, { FC, useState } from 'react';
import './FileViewer.sass';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeftOutlined, ChevronRightOutlined, ZoomIn, ZoomOut } from '@mui/icons-material';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface FileViewerProps {
  file: {
    filename: string;
    title: string; 
    _id: string;
    createdAt: string;
  };
  onClose: () => void;
}

const FileViewer: FC<FileViewerProps> = (props) => {
  let [numPages, setNumPages] = useState(null);
  let [pageNumber, setPageNumber] = useState(1);
  let [zoom, setZoom] = useState(1);
  let [showLegend, setShowLegend] = useState(true);
  let {file} = props

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  return (
    <Modal
      open={true}
      onClose={props.onClose}
      className='FileViewer'
    >
      {file.filename.toLowerCase().endsWith('.pdf') ? (
        <div onMouseLeave={() => setShowLegend(false)} onMouseEnter={() => setShowLegend(true)}>
          <div style={{zoom}}>
            <Document file={process.env.REACT_APP_S3_URL + file.filename} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
          <div className={`legend ${showLegend ? 'show' : ''}`}>
            <span className='btn zoom' onClick={() => setZoom(zoom >= .2 ? zoom-.1 : zoom)}><ZoomOut /></span>
            <div className="inner">
              <span className='btn' onClick={() => setPageNumber(pageNumber > 1 ? pageNumber-1 : pageNumber)}><ChevronLeftOutlined /></span>
              <span className='info'>Seite {pageNumber || (numPages ? 1 : '?')} von {numPages || '?'}</span>
              <span className='btn' onClick={() => setPageNumber(pageNumber < (numPages ? numPages : 0) ? pageNumber+1 : pageNumber)}><ChevronRightOutlined /></span>
            </div>
            <span className='btn zoom' onClick={() => setZoom(zoom + .1)}><ZoomIn /></span>
          </div>
        </div>
      ) : (
        <img className='image' src={process.env.REACT_APP_S3_URL + file.filename} alt={file.title} />
      )}
    </Modal>
  )
}

export default FileViewer;

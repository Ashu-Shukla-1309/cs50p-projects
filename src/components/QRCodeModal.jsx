import React, { useState, useEffect } from 'react';
import { generateQRCode } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

const QRCodeModal = ({ certificateHash, isOpen, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  useEffect(() => {
    if (isOpen && certificateHash) {
      generateQRCode(certificateHash)
        .then(setQrCodeUrl)
        .catch(error => {
          console.error('Error generating QR code:', error);
          toast.error('Failed to generate QR code');
        });
    }
  }, [isOpen, certificateHash]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `certificate-${certificateHash.substring(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Certificate QR Code</h3>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.content}>
          {qrCodeUrl ? (
            <>
              <img
                src={qrCodeUrl}
                alt="Certificate QR Code"
                style={styles.qrImage}
              />
              <p style={styles.hashText}>{certificateHash}</p>
            </>
          ) : (
            <div style={styles.loading}>
              <p>Generating QR code...</p>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.downloadButton} onClick={handleDownload}>
            Download QR Code
          </button>
          <button style={styles.cancelButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  content: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  qrImage: {
    width: '300px',
    height: '300px',
    border: '2px solid #eee',
    borderRadius: '8px'
  },
  hashText: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#666',
    wordBreak: 'break-all',
    textAlign: 'center',
    maxWidth: '100%'
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#666'
  },
  footer: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #eee',
    justifyContent: 'center'
  },
  downloadButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default QRCodeModal;

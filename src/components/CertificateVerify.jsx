import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getReadOnlyContract, verifyCertificate } from '../utils/blockchain';
import { validateCertificateHash } from '../utils/validation';
import { getIPFSUrl } from '../utils/ipfs';
import { API_URL, VERIFICATION_STATUS } from '../config/constants';
import QRCodeModal from './QRCodeModal';

const CertificateVerify = () => {
  const [certificateHash, setCertificateHash] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(VERIFICATION_STATUS.IDLE);
  const [showQRModal, setShowQRModal] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState(null);

  const handleVerify = async () => {
    // Validate hash format
    const validation = validateCertificateHash(certificateHash);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setVerificationStatus(VERIFICATION_STATUS.LOADING);
    setCertificateData(null);
    setIpfsUrl(null);

    try {
      // Get read-only contract instance
      const contract = getReadOnlyContract();

      // Verify certificate on blockchain
      const data = await verifyCertificate(contract, validation.cleanHash);

      // Check if certificate exists (studentName would be empty if not found)
      if (!data.studentName || data.studentName === '') {
        setVerificationStatus(VERIFICATION_STATUS.NOT_FOUND);
        return;
      }

      // Check if revoked
      if (!data.isValid) {
        setCertificateData(data);
        setVerificationStatus(VERIFICATION_STATUS.REVOKED);
        return;
      }

      // Certificate is valid
      setCertificateData(data);
      setVerificationStatus(VERIFICATION_STATUS.VALID);

      // Try to get IPFS hash from backend
      try {
        const response = await axios.get(`${API_URL}/certificates`);
        const cert = response.data.find(
          c => c.hash?.toLowerCase() === validation.cleanHash.toLowerCase()
        );
        if (cert && cert.ipfsHash) {
          setIpfsUrl(getIPFSUrl(cert.ipfsHash));
        }
      } catch (error) {
        console.warn('Could not fetch IPFS hash from backend:', error);
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationStatus(VERIFICATION_STATUS.ERROR);
      toast.error('Verification failed. Please try again.');
    }
  };

  const handleReset = () => {
    setCertificateHash('');
    setCertificateData(null);
    setVerificationStatus(VERIFICATION_STATUS.IDLE);
    setIpfsUrl(null);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(certificateHash);
    toast.success('Hash copied to clipboard!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Certificate</h2>
        <p style={styles.subtitle}>Enter the certificate hash to verify its authenticity</p>

        {verificationStatus === VERIFICATION_STATUS.IDLE && (
          <div style={styles.inputContainer}>
            <label style={styles.label}>Certificate Hash (0x...)</label>
            <input
              type="text"
              value={certificateHash}
              onChange={(e) => setCertificateHash(e.target.value)}
              style={styles.input}
              placeholder="0x1234567890abcdef..."
            />
            <button onClick={handleVerify} style={styles.button}>
              Verify Certificate
            </button>
          </div>
        )}

        {verificationStatus === VERIFICATION_STATUS.LOADING && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Verifying certificate...</p>
          </div>
        )}

        {verificationStatus === VERIFICATION_STATUS.VALID && certificateData && (
          <div style={styles.resultContainer}>
            <div style={styles.bannerSuccess}>
              <span style={styles.bannerIcon}>✓</span>
              <span style={styles.bannerText}>Valid Certificate</span>
            </div>

            <div style={styles.detailsCard}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Student Name:</span>
                <span style={styles.detailValue}>{certificateData.studentName}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Course:</span>
                <span style={styles.detailValue}>{certificateData.course}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Institution:</span>
                <span style={styles.detailValue}>{certificateData.institution}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Duration:</span>
                <span style={styles.detailValue}>{certificateData.duration}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Grade:</span>
                <span style={styles.detailValue}>{certificateData.grade}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Credential Type:</span>
                <span style={styles.detailValue}>{certificateData.credentialType}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Issue Date:</span>
                <span style={styles.detailValue}>{formatDate(certificateData.issueDate)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Certificate Hash:</span>
                <span style={{ ...styles.detailValue, ...styles.hashValue }}>
                  {certificateHash}
                  <button onClick={copyToClipboard} style={styles.copyButton}>Copy</button>
                </span>
              </div>
            </div>

            <div style={styles.actionButtons}>
              {ipfsUrl && (
                <a href={ipfsUrl} target="_blank" rel="noopener noreferrer" style={styles.downloadButton}>
                  Download PDF
                </a>
              )}
              <button onClick={() => setShowQRModal(true)} style={styles.qrButton}>
                View QR Code
              </button>
              <button onClick={handleReset} style={styles.resetButton}>
                Verify Another
              </button>
            </div>
          </div>
        )}

        {verificationStatus === VERIFICATION_STATUS.REVOKED && certificateData && (
          <div style={styles.resultContainer}>
            <div style={styles.bannerRevoked}>
              <span style={styles.bannerIcon}>✗</span>
              <span style={styles.bannerText}>Certificate Revoked</span>
            </div>

            <div style={styles.detailsCard}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Student Name:</span>
                <span style={styles.detailValueMuted}>{certificateData.studentName}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Course:</span>
                <span style={styles.detailValueMuted}>{certificateData.course}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Status:</span>
                <span style={styles.revokedText}>Revoked</span>
              </div>
            </div>

            <div style={styles.actionButtons}>
              <button onClick={handleReset} style={styles.resetButton}>
                Verify Another
              </button>
            </div>
          </div>
        )}

        {verificationStatus === VERIFICATION_STATUS.NOT_FOUND && (
          <div style={styles.resultContainer}>
            <div style={styles.bannerWarning}>
              <span style={styles.bannerIcon}>!</span>
              <span style={styles.bannerText}>Certificate Not Found</span>
            </div>
            <p style={styles.notFoundText}>
              Please check the hash and try again.
            </p>
            <button onClick={handleReset} style={styles.resetButton}>
              Try Again
            </button>
          </div>
        )}

        {verificationStatus === VERIFICATION_STATUS.ERROR && (
          <div style={styles.resultContainer}>
            <div style={styles.bannerError}>
              <span style={styles.bannerIcon}>✗</span>
              <span style={styles.bannerText}>Verification Error</span>
            </div>
            <p style={styles.errorText}>
              Unable to verify certificate. Please check your connection and try again.
            </p>
            <button onClick={handleReset} style={styles.resetButton}>
              Try Again
            </button>
          </div>
        )}
      </div>

      {showQRModal && (
        <QRCodeModal
          certificateHash={certificateHash}
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: '24px',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '40px',
    maxWidth: '700px',
    width: '100%'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '32px',
    textAlign: 'center'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    padding: '14px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    fontFamily: 'monospace'
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '40px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1976d2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  bannerSuccess: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#4caf50',
    borderRadius: '4px',
    color: '#ffffff'
  },
  bannerRevoked: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f44336',
    borderRadius: '4px',
    color: '#ffffff'
  },
  bannerWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#ff9800',
    borderRadius: '4px',
    color: '#ffffff'
  },
  bannerError: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f44336',
    borderRadius: '4px',
    color: '#ffffff'
  },
  bannerIcon: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  bannerText: {
    fontSize: '18px',
    fontWeight: '600'
  },
  detailsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px'
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase'
  },
  detailValue: {
    fontSize: '16px',
    color: '#333'
  },
  detailValueMuted: {
    fontSize: '16px',
    color: '#999'
  },
  hashValue: {
    fontFamily: 'monospace',
    fontSize: '12px',
    wordBreak: 'break-all',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  copyButton: {
    padding: '4px 12px',
    fontSize: '12px',
    backgroundColor: '#1976d2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  revokedText: {
    fontSize: '16px',
    color: '#f44336',
    fontWeight: '600'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  downloadButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '4px',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'inline-block'
  },
  qrButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  resetButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  notFoundText: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center'
  },
  errorText: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center'
  }
};

export default CertificateVerify;

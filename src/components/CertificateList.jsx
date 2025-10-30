import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getContract, revokeCertificate } from '../utils/blockchain';
import { API_URL } from '../config/constants';
import { ethers } from 'ethers';

const CertificateList = ({ walletAddress }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(null);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${API_URL}/certificates`);
      // Filter certificates by issuer wallet
      const filtered = response.data.filter(
        cert => cert.issuerWallet?.toLowerCase() === walletAddress?.toLowerCase()
      );
      setCertificates(filtered);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();

    // Listen for certificate issued event
    const handleCertificateIssued = () => {
      fetchCertificates();
    };

    window.addEventListener('certificateIssued', handleCertificateIssued);

    return () => {
      window.removeEventListener('certificateIssued', handleCertificateIssued);
    };
  }, [walletAddress]);

  const handleRevoke = async (certificate) => {
    if (!window.confirm('Are you sure you want to revoke this certificate? This action cannot be undone.')) {
      return;
    }

    setRevoking(certificate.hash);

    try {
      // Revoke on blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      await revokeCertificate(contract, certificate.hash);

      // Update backend
      await axios.put(`${API_URL}/certificates/revoke`, {
        hash: certificate.hash
      });

      toast.success('Certificate revoked successfully');

      // Refresh list
      fetchCertificates();
    } catch (error) {
      console.error('Error revoking certificate:', error);

      if (error.message.includes('user rejected')) {
        toast.error('Transaction cancelled');
      } else {
        toast.error('Failed to revoke certificate');
      }
    } finally {
      setRevoking(null);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p>Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No certificates issued yet.</p>
          <p style={styles.emptySubtext}>Issue your first certificate above!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Issued Certificates</h3>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Student Name</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Issue Date</th>
              <th style={styles.th}>Hash</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.hash} style={styles.row}>
                <td style={styles.td}>{cert.studentName}</td>
                <td style={styles.td}>{cert.course}</td>
                <td style={styles.td}>{formatDate(cert.issueDate)}</td>
                <td style={styles.td}>
                  <span style={styles.hash} title={cert.hash}>
                    {truncateHash(cert.hash)}
                  </span>
                </td>
                <td style={styles.td}>
                  <span
                    style={cert.status === 'active' ? styles.statusActive : styles.statusRevoked}
                  >
                    {cert.status === 'active' ? 'Active' : 'Revoked'}
                  </span>
                </td>
                <td style={styles.td}>
                  {cert.status === 'active' ? (
                    <button
                      style={revoking === cert.hash ? styles.buttonDisabled : styles.revokeButton}
                      onClick={() => handleRevoke(cert)}
                      disabled={revoking === cert.hash}
                    >
                      {revoking === cert.hash ? 'Revoking...' : 'Revoke'}
                    </button>
                  ) : (
                    <span style={styles.revokedText}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  emptyText: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '8px'
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#999'
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  headerRow: {
    backgroundColor: '#f5f5f5'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #ddd'
  },
  row: {
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#666'
  },
  hash: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#1976d2',
    cursor: 'help'
  },
  statusActive: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#4caf50',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusRevoked: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#f44336',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  revokeButton: {
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#f44336',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonDisabled: {
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed'
  },
  revokedText: {
    color: '#999'
  }
};

export default CertificateList;

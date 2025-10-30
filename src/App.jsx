import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import InstitutionSetup from './components/InstitutionSetup';
import CertificateIssueForm from './components/CertificateIssueForm';
import CertificateList from './components/CertificateList';
import CertificateVerify from './components/CertificateVerify';
import { connectWallet, getContract, isAdmin, onAccountsChanged, onChainChanged } from './utils/blockchain';
import { API_URL, CHAIN_ID } from './config/constants';
import { ethers } from 'ethers';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [institutionData, setInstitutionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();

    // Set up event listeners for account and network changes
    onAccountsChanged(() => {
      toast('Wallet changed. Refreshing...', { icon: '🔄' });
      setTimeout(() => window.location.reload(), 1000);
    });

    onChainChanged(() => {
      toast('Network changed. Refreshing...', { icon: '🔄' });
      setTimeout(() => window.location.reload(), 1000);
    });
  }, []);

  useEffect(() => {
    if (walletAddress && isAdminUser) {
      fetchInstitutionData();
    }
  }, [walletAddress, isAdminUser]);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          setWalletAddress(address);
          setIsWalletConnected(true);

          // Check if user is admin
          const contract = getContract(signer);
          const adminStatus = await isAdmin(address, contract);
          setIsAdminUser(adminStatus);

          // Verify correct network
          const network = await provider.getNetwork();
          if (Number(network.chainId) !== CHAIN_ID) {
            toast.error(`Wrong network. Please switch to chain ID ${CHAIN_ID}`);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
    setLoading(false);
  };

  const handleConnectWallet = async () => {
    try {
      const { address, signer } = await connectWallet();
      setWalletAddress(address);
      setIsWalletConnected(true);

      // Check if user is admin
      const contract = getContract(signer);
      const adminStatus = await isAdmin(address, contract);
      setIsAdminUser(adminStatus);

      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  const fetchInstitutionData = async () => {
    try {
      const response = await axios.get(`${API_URL}/institutions`);
      const institution = response.data.find(
        inst => inst.walletAddress?.toLowerCase() === walletAddress?.toLowerCase()
      );
      setInstitutionData(institution || null);
    } catch (error) {
      console.error('Error fetching institution data:', error);
    }
  };

  const handleInstitutionSetupComplete = () => {
    fetchInstitutionData();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Toaster position="top-right" />

      <Header
        walletAddress={walletAddress}
        isAdmin={isAdminUser}
        onConnect={handleConnectWallet}
      />

      <main style={styles.main}>
        {isAdminUser && isWalletConnected ? (
          // Admin Dashboard
          <>
            {!institutionData ? (
              // First-time setup
              <InstitutionSetup
                walletAddress={walletAddress}
                onComplete={handleInstitutionSetupComplete}
              />
            ) : (
              // Main dashboard
              <>
                <CertificateIssueForm
                  walletAddress={walletAddress}
                  institutionData={institutionData}
                />
                <CertificateList walletAddress={walletAddress} />
              </>
            )}
          </>
        ) : (
          // Public Verification
          <CertificateVerify />
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          BlockVerify © 2025 | Blockchain Certificate Verification System
        </p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5'
  },
  main: {
    flex: 1,
    paddingBottom: '60px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  },
  footer: {
    backgroundColor: '#333',
    padding: '20px',
    textAlign: 'center',
    marginTop: 'auto'
  },
  footerText: {
    color: '#ffffff',
    fontSize: '14px',
    margin: 0
  }
};

export default App;

import React from 'react';

const Header = ({ walletAddress, isAdmin, onConnect }) => {
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleConnectClick = () => {
    if (typeof window.ethereum === 'undefined') {
      window.open('https://metamask.io/download/', '_blank');
    } else {
      onConnect();
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Left: Logo/Title */}
        <div style={styles.logo}>
          <h1 style={styles.logoText}>ShikkhaChain</h1>
        </div>

        {/* Center: Role Indicator */}
        <div style={styles.center}>
          <span style={styles.roleText}>
            {isAdmin ? 'Institution Dashboard' : 'Public Verification'}
          </span>
        </div>

        {/* Right: Wallet Connection */}
        <div style={styles.right}>
          {walletAddress ? (
            <div style={styles.connectedWallet}>
              <div style={styles.walletIcon}>👤</div>
              <span style={styles.walletAddress}>{truncateAddress(walletAddress)}</span>
            </div>
          ) : (
            <button style={styles.connectButton} onClick={handleConnectClick}>
              {typeof window.ethereum === 'undefined' ? 'Install MetaMask' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#1976d2',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    flex: '0 0 auto'
  },
  logoText: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    cursor: 'default'
  },
  center: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center'
  },
  roleText: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500'
  },
  right: {
    flex: '0 0 auto'
  },
  connectButton: {
    backgroundColor: '#ffffff',
    color: '#1976d2',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  connectedWallet: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '8px 16px',
    borderRadius: '20px',
    gap: '8px'
  },
  walletIcon: {
    fontSize: '20px'
  },
  walletAddress: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500'
  }
};

export default Header;

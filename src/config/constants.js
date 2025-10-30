// Environment variables
export const NETWORK_URL = process.env.REACT_APP_NETWORK_URL || 'http://127.0.0.1:8545';
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || '31337');
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
export const IPFS_URL = process.env.REACT_APP_IPFS_URL || 'http://127.0.0.1:5001';
export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
export const IPFS_PROJECT_ID = process.env.REACT_APP_IPFS_PROJECT_ID || '';
export const IPFS_PROJECT_SECRET = process.env.REACT_APP_IPFS_PROJECT_SECRET || '';

// Contract configuration
export const HARDHAT_NETWORK = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: 'Hardhat Local',
  rpcUrls: [NETWORK_URL],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
};

// Form validation constants
export const VALIDATION = {
  studentName: {
    min: 2,
    max: 100,
    pattern: /^[a-zA-Z\s'-]+$/
  },
  course: {
    min: 2,
    max: 200
  },
  duration: {
    min: 1,
    max: 50
  },
  grade: {
    min: 1,
    max: 20
  },
  institutionName: {
    min: 3,
    max: 200,
    pattern: /^[a-zA-Z0-9\s-]+$/
  },
  url: {
    pattern: /^https?:\/\/.+/
  },
  logoUrl: {
    pattern: /^https?:\/\/.+\.(png|jpg|jpeg|svg)$/i
  },
  certificateHash: {
    pattern: /^0x[a-fA-F0-9]{64}$/
  }
};

// Credential types
export const CREDENTIAL_TYPES = [
  'Degree',
  'Diploma',
  'Certificate',
  'Transcript'
];

// Status types
export const CERTIFICATE_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked'
};

// Verification status
export const VERIFICATION_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  VALID: 'valid',
  REVOKED: 'revoked',
  NOT_FOUND: 'not_found',
  ERROR: 'error'
};

// Error messages
export const ERROR_MESSAGES = {
  METAMASK_NOT_INSTALLED: 'MetaMask is required to issue certificates. Please install MetaMask.',
  CONNECTION_REJECTED: 'Connection rejected. Please connect to continue.',
  WRONG_NETWORK: 'Wrong Network - Please switch to Hardhat Local Network',
  TRANSACTION_REJECTED: 'Transaction cancelled',
  INSUFFICIENT_GAS: 'Insufficient ETH for gas. Please fund your wallet.',
  CONTRACT_NOT_DEPLOYED: 'Smart contract not found. Please deploy the contract first.',
  NOT_ADMIN: 'Only institution admin can issue certificates.',
  SERVER_NOT_RUNNING: 'Backend server not running. Please start the server: node server.js',
  IPFS_NOT_ACCESSIBLE: 'IPFS node not accessible. Please start IPFS daemon or use Infura.',
  INVALID_HASH_FORMAT: 'Invalid certificate hash format. Must start with 0x and be 66 characters.',
  CERTIFICATE_NOT_FOUND: 'Certificate not found. Please check the hash and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  CERTIFICATE_ISSUED: 'Certificate issued successfully!',
  CERTIFICATE_REVOKED: 'Certificate revoked successfully',
  INSTITUTION_REGISTERED: 'Institution registered successfully!'
};

// Loading messages
export const LOADING_MESSAGES = {
  GENERATING_PDF: 'Generating PDF...',
  UPLOADING_TO_IPFS: 'Uploading to IPFS...',
  RECORDING_ON_BLOCKCHAIN: 'Recording on blockchain...',
  VERIFYING: 'Verifying certificate...'
};

import { ethers } from 'ethers';
import contractABI from '../config/contractABI.json';
import contractAddress from '../config/contractAddress.json';
import { NETWORK_URL, ERROR_MESSAGES } from '../config/constants';

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined';
};

/**
 * Connect to MetaMask wallet
 * @returns {Promise<{address: string, provider: object, signer: object}>}
 */
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error(ERROR_MESSAGES.METAMASK_NOT_INSTALLED);
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { address, provider, signer };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error(ERROR_MESSAGES.CONNECTION_REJECTED);
    }
    throw error;
  }
};

/**
 * Get contract instance with signer (for write operations)
 * @param {object} signer - Ethers signer
 * @returns {object} Contract instance
 */
export const getContract = (signer) => {
  const address = contractAddress.CertificateRegistry;
  if (!address) {
    throw new Error(ERROR_MESSAGES.CONTRACT_NOT_DEPLOYED);
  }

  return new ethers.Contract(address, contractABI, signer);
};

/**
 * Get read-only contract instance (for verification without wallet)
 * @returns {object} Read-only contract instance
 */
export const getReadOnlyContract = () => {
  const address = contractAddress.CertificateRegistry;
  if (!address) {
    throw new Error(ERROR_MESSAGES.CONTRACT_NOT_DEPLOYED);
  }

  const provider = new ethers.JsonRpcProvider(NETWORK_URL);
  return new ethers.Contract(address, contractABI, provider);
};

/**
 * Check if wallet address is the admin
 * @param {string} walletAddress - Wallet address to check
 * @param {object} contract - Contract instance
 * @returns {Promise<boolean>}
 */
export const isAdmin = async (walletAddress, contract) => {
  try {
    const adminAddress = await contract.admin();
    return adminAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Issue a certificate on the blockchain
 * @param {object} contract - Contract instance
 * @param {object} certificateData - Certificate data
 * @returns {Promise<string>} Certificate hash
 */
export const issueCertificate = async (contract, certificateData) => {
  try {
    const { studentName, course, institution, duration, grade, credentialType } = certificateData;

    // Call smart contract issueCertificate function
    const tx = await contract.issueCertificate(
      studentName,
      course,
      institution,
      duration,
      grade,
      credentialType
    );

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    // Extract certificate hash from CertificateIssued event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'CertificateIssued';
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog(event);
      return parsed.args.certificateHash;
    }

    // Fallback: extract from return value if event not found
    throw new Error('Could not extract certificate hash from transaction');
  } catch (error) {
    if (error.code === 4001) {
      throw new Error(ERROR_MESSAGES.TRANSACTION_REJECTED);
    }
    if (error.message.includes('insufficient funds')) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_GAS);
    }
    if (error.message.includes('Only admin')) {
      throw new Error(ERROR_MESSAGES.NOT_ADMIN);
    }
    throw error;
  }
};

/**
 * Verify a certificate by hash
 * @param {object} contract - Contract instance (can be read-only)
 * @param {string} hash - Certificate hash
 * @returns {Promise<object>} Certificate data
 */
export const verifyCertificate = async (contract, hash) => {
  try {
    const result = await contract.verifyCertificate(hash);

    // Result is a tuple: [studentName, course, institution, duration, grade, credentialType, issueDate, isValid]
    return {
      studentName: result[0],
      course: result[1],
      institution: result[2],
      duration: result[3],
      grade: result[4],
      credentialType: result[5],
      issueDate: Number(result[6]),
      isValid: result[7]
    };
  } catch (error) {
    console.error('Error verifying certificate:', error);
    throw error;
  }
};

/**
 * Revoke a certificate
 * @param {object} contract - Contract instance
 * @param {string} hash - Certificate hash
 * @returns {Promise<boolean>} Success status
 */
export const revokeCertificate = async (contract, hash) => {
  try {
    const tx = await contract.revokeCertificate(hash);
    await tx.wait();
    return true;
  } catch (error) {
    if (error.code === 4001) {
      throw new Error(ERROR_MESSAGES.TRANSACTION_REJECTED);
    }
    if (error.message.includes('Only admin')) {
      throw new Error(ERROR_MESSAGES.NOT_ADMIN);
    }
    throw error;
  }
};

/**
 * Get all certificates for the connected wallet
 * @param {object} contract - Contract instance
 * @returns {Promise<Array>} Array of certificate hashes
 */
export const getMyCertificates = async (contract) => {
  try {
    const certificates = await contract.getMyCertificates();
    return certificates;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
};

/**
 * Listen for account changes
 * @param {function} callback - Callback function
 */
export const onAccountsChanged = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback);
  }
};

/**
 * Listen for network changes
 * @param {function} callback - Callback function
 */
export const onChainChanged = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback);
  }
};

/**
 * Get current network chain ID
 * @returns {Promise<number>} Chain ID
 */
export const getChainId = async () => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  return Number(network.chainId);
};

/**
 * Request network switch to Hardhat
 * @param {number} targetChainId - Target chain ID
 */
export const switchNetwork = async (targetChainId) => {
  if (!isMetaMaskInstalled()) {
    throw new Error(ERROR_MESSAGES.METAMASK_NOT_INSTALLED);
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${targetChainId.toString(16)}` }],
    });
  } catch (error) {
    // If network doesn't exist, this error will be thrown
    if (error.code === 4902) {
      throw new Error(ERROR_MESSAGES.WRONG_NETWORK);
    }
    throw error;
  }
};

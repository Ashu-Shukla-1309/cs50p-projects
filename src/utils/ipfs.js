import { create } from 'ipfs-http-client';
import { IPFS_URL, IPFS_PROJECT_ID, IPFS_PROJECT_SECRET, IPFS_GATEWAY, ERROR_MESSAGES } from '../config/constants';

let ipfsClient = null;

/**
 * Initialize IPFS client
 */
const getIPFSClient = () => {
  if (ipfsClient) {
    return ipfsClient;
  }

  try {
    // Check if using Infura (with project ID and secret)
    if (IPFS_PROJECT_ID && IPFS_PROJECT_SECRET) {
      const auth = 'Basic ' + Buffer.from(IPFS_PROJECT_ID + ':' + IPFS_PROJECT_SECRET).toString('base64');
      ipfsClient = create({
        url: IPFS_URL,
        headers: {
          authorization: auth
        }
      });
    } else {
      // Use local IPFS node or public gateway
      ipfsClient = create({ url: IPFS_URL });
    }

    return ipfsClient;
  } catch (error) {
    console.error('Error initializing IPFS client:', error);
    throw new Error(ERROR_MESSAGES.IPFS_NOT_ACCESSIBLE);
  }
};

/**
 * Upload a file to IPFS
 * @param {Blob|File|Buffer} file - File to upload
 * @returns {Promise<string>} IPFS hash (CID)
 */
export const uploadToIPFS = async (file) => {
  try {
    const client = getIPFSClient();

    // Check file size (max 10MB)
    if (file.size && file.size > 10 * 1024 * 1024) {
      throw new Error('PDF too large. Maximum size: 10MB');
    }

    // Convert Blob to ArrayBuffer if needed
    let fileData = file;
    if (file instanceof Blob) {
      fileData = await file.arrayBuffer();
    }

    // Add file to IPFS
    const result = await client.add(fileData, {
      progress: (prog) => console.log(`Upload progress: ${prog}`)
    });

    console.log('File uploaded to IPFS:', result.path);
    return result.path; // This is the CID
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    if (error.message.includes('too large')) {
      throw error;
    }
    throw new Error('Failed to upload to IPFS. Please try again.');
  }
};

/**
 * Get IPFS gateway URL for a hash
 * @param {string} ipfsHash - IPFS hash (CID)
 * @returns {string} Gateway URL
 */
export const getIPFSUrl = (ipfsHash) => {
  if (!ipfsHash) {
    return null;
  }

  // Remove 'ipfs://' prefix if present
  const cleanHash = ipfsHash.replace('ipfs://', '');

  return `${IPFS_GATEWAY}${cleanHash}`;
};

/**
 * Download a file from IPFS
 * @param {string} ipfsHash - IPFS hash (CID)
 * @returns {Promise<Blob>} File blob
 */
export const downloadFromIPFS = async (ipfsHash) => {
  try {
    const url = getIPFSUrl(ipfsHash);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to download from IPFS');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading from IPFS:', error);
    throw new Error('Failed to download from IPFS. Please try again.');
  }
};

/**
 * Check if IPFS is accessible
 * @returns {Promise<boolean>} True if accessible
 */
export const isIPFSAccessible = async () => {
  try {
    const client = getIPFSClient();
    // Try to get IPFS node ID as a health check
    await client.id();
    return true;
  } catch (error) {
    console.error('IPFS not accessible:', error);
    return false;
  }
};

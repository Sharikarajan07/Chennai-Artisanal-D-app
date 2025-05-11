import axios from 'axios';
import { create } from 'ipfs-http-client';

// Pinata API configuration
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET || '';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

// Function to upload a file to IPFS via Pinata
export const uploadFileToIPFS = async (file) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload file to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data;`,
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_API_SECRET,
        },
      }
    );

    // Return IPFS hash (CID)
    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinataUrl: `${PINATA_GATEWAY}${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Function to upload metadata to IPFS via Pinata
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    // Upload metadata to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_API_SECRET,
        },
      }
    );

    // Return IPFS hash (CID)
    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinataUrl: `${PINATA_GATEWAY}${response.data.IpfsHash}`,
      tokenURI: `ipfs://${response.data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Function to fetch metadata from IPFS
export const fetchFromIPFS = async (ipfsHash) => {
  try {
    // If the hash is in ipfs:// format, extract just the hash
    if (ipfsHash.startsWith('ipfs://')) {
      ipfsHash = ipfsHash.replace('ipfs://', '');
    }

    // Fetch from Pinata gateway
    const response = await axios.get(`${PINATA_GATEWAY}${ipfsHash}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

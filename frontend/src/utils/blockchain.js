import { ethers } from 'ethers';
import ArtisanRegistryABI from '../contracts/ArtisanRegistry.json';
import ChennaiArtisanalNFTABI from '../contracts/ChennaiArtisanalNFT.json';
import { ARTISAN_REGISTRY_ADDRESS as REGISTRY_ADDRESS, CHENNAI_ARTISANAL_NFT_ADDRESS as NFT_ADDRESS } from './constants';

// Contract addresses from constants.js
let ARTISAN_REGISTRY_ADDRESS = REGISTRY_ADDRESS;
let CHENNAI_ARTISANAL_NFT_ADDRESS = NFT_ADDRESS;

// Initialize ethers provider and signer
let provider;
let signer;
let artisanRegistry;
let chennaiArtisanalNFT;

// Initialize the blockchain connection
export const initBlockchain = async () => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
    }

    // Connect to MetaMask
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get the signer
    signer = provider.getSigner();

    // Verify we have valid contract addresses
    if (!ARTISAN_REGISTRY_ADDRESS || ARTISAN_REGISTRY_ADDRESS === '0x0000000000000000000000000000000000000000') {
      console.error('Invalid Artisan Registry address');
      throw new Error('Contract address not configured correctly. Please check your configuration.');
    }

    if (!CHENNAI_ARTISANAL_NFT_ADDRESS || CHENNAI_ARTISANAL_NFT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      console.error('Invalid NFT contract address');
      throw new Error('Contract address not configured correctly. Please check your configuration.');
    }

    // Initialize contract instances
    artisanRegistry = new ethers.Contract(
      ARTISAN_REGISTRY_ADDRESS,
      ArtisanRegistryABI.abi,
      signer
    );

    chennaiArtisanalNFT = new ethers.Contract(
      CHENNAI_ARTISANAL_NFT_ADDRESS,
      ChennaiArtisanalNFTABI.abi,
      signer
    );

    return { provider, signer, artisanRegistry, chennaiArtisanalNFT };
  } catch (error) {
    console.error('Error initializing blockchain:', error);
    throw error;
  }
};

// Get the current account
export const getCurrentAccount = async () => {
  try {
    // Check if provider and signer are initialized
    if (!provider || !signer) {
      await initBlockchain();
    }

    // Double check that signer is available
    if (!signer) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    // Get the address
    const address = await signer.getAddress();

    // Validate the address
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Invalid wallet address. Please check your wallet connection.');
    }

    return address;
  } catch (error) {
    console.error('Error getting current account:', error);
    throw error;
  }
};

// Check if the current user is a verified artisan
export const isVerifiedArtisan = async (address) => {
  try {
    if (!artisanRegistry) {
      await initBlockchain();
    }
    return await artisanRegistry.isVerifiedArtisan(address);
  } catch (error) {
    console.error('Error checking if artisan is verified:', error);
    return false;
  }
};

// Register a new artisan
export const registerArtisan = async (name, location, specialization, contactInfo) => {
  try {
    if (!artisanRegistry) {
      await initBlockchain();
    }
    const tx = await artisanRegistry.registerArtisan(name, location, specialization, contactInfo);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error registering artisan:', error);
    throw error;
  }
};

// Update artisan information
export const updateArtisanInfo = async (name, location, specialization, contactInfo) => {
  try {
    if (!artisanRegistry) {
      await initBlockchain();
    }

    // Validate inputs
    if (!name || !location || !specialization || !contactInfo) {
      throw new Error('All fields are required');
    }

    const tx = await artisanRegistry.updateArtisanInfo(name, location, specialization, contactInfo);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error updating artisan information:', error);
    throw error;
  }
};

// Get artisan details
export const getArtisanDetails = async (address) => {
  try {
    if (!artisanRegistry) {
      await initBlockchain();
    }

    // Validate address
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Invalid address provided for artisan details');
    }

    // Call the contract method
    const details = await artisanRegistry.getArtisanDetails(address);

    // Check if the artisan exists (name should be non-empty)
    if (!details || !details.name) {
      throw new Error('Artisan not registered');
    }

    return details;
  } catch (error) {
    console.error('Error getting artisan details:', error);
    // If it's a contract call exception, it likely means the artisan is not registered
    if (error.code === 'CALL_EXCEPTION') {
      throw new Error('Artisan not registered');
    }
    throw error;
  }
};

// Mint a new NFT
export const mintNFT = async (tokenURI, name, description, materials) => {
  try {
    if (!chennaiArtisanalNFT) {
      await initBlockchain();
    }
    const address = await signer.getAddress();
    const tx = await chennaiArtisanalNFT.mintItem(address, tokenURI, name, description, materials);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

// Get all NFTs owned by the current user
export const getMyNFTs = async () => {
  try {
    if (!chennaiArtisanalNFT) {
      await initBlockchain();
    }

    // Make sure we have a valid signer
    if (!signer) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    const address = await signer.getAddress();

    // Validate address
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Invalid wallet address. Please check your wallet connection.');
    }

    // Get the balance of NFTs
    const balance = await chennaiArtisanalNFT.balanceOf(address);

    // If balance is 0, return empty array early
    if (balance.toNumber() === 0) {
      return [];
    }

    const nfts = [];
    // Fetch each NFT
    for (let i = 0; i < balance; i++) {
      try {
        const tokenId = await chennaiArtisanalNFT.tokenOfOwnerByIndex(address, i);
        const tokenURI = await chennaiArtisanalNFT.tokenURI(tokenId);
        const itemDetails = await chennaiArtisanalNFT.getItemDetails(tokenId);

        nfts.push({
          tokenId: tokenId.toString(),
          tokenURI,
          name: itemDetails.name || 'Unnamed Item',
          description: itemDetails.description || 'No description available',
          materials: itemDetails.materials || 'Not specified',
          artisan: itemDetails.artisan,
          creationDate: itemDetails.creationDate ?
            new Date(itemDetails.creationDate.toNumber() * 1000).toLocaleDateString() :
            'Unknown date'
        });
      } catch (itemError) {
        console.error(`Error fetching NFT at index ${i}:`, itemError);
        // Continue to the next NFT instead of failing the entire function
      }
    }

    return nfts;
  } catch (error) {
    console.error('Error getting NFTs:', error);
    // If it's a contract call exception, return an empty array instead of throwing
    if (error.code === 'CALL_EXCEPTION') {
      console.log('No NFTs found or contract not properly initialized');
      return [];
    }
    throw error;
  }
};

// Get all NFTs (with pagination)
export const getAllNFTs = async (offset = 0, limit = 10, includeHidden = false) => {
  try {
    if (!chennaiArtisanalNFT) {
      await initBlockchain();
    }

    const totalSupply = await chennaiArtisanalNFT.totalSupply();
    const hiddenNFTs = getHiddenNFTs();

    // Collect all NFTs first
    const allNfts = [];
    for (let i = 0; i < totalSupply; i++) {
      try {
        const tokenId = await chennaiArtisanalNFT.tokenByIndex(i);
        const tokenIdStr = tokenId.toString();

        // Skip hidden NFTs if includeHidden is false
        if (!includeHidden && hiddenNFTs.includes(tokenIdStr)) {
          continue;
        }

        const tokenURI = await chennaiArtisanalNFT.tokenURI(tokenId);
        const itemDetails = await chennaiArtisanalNFT.getItemDetails(tokenId);
        const owner = await chennaiArtisanalNFT.ownerOf(tokenId);

        allNfts.push({
          tokenId: tokenIdStr,
          tokenURI,
          name: itemDetails.name,
          description: itemDetails.description,
          materials: itemDetails.materials,
          artisan: itemDetails.artisan,
          owner,
          isHidden: hiddenNFTs.includes(tokenIdStr),
          creationDate: new Date(itemDetails.creationDate.toNumber() * 1000).toLocaleDateString()
        });
      } catch (error) {
        // Skip tokens that might have been burned or have other issues
        console.error(`Error fetching NFT at index ${i}:`, error);
      }
    }

    // Apply pagination after filtering
    const startIndex = Math.min(offset, allNfts.length);
    const endIndex = Math.min(offset + limit, allNfts.length);

    return allNfts.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error getting all NFTs:', error);
    throw error;
  }
};

// Get NFT details by token ID
export const getNFTDetails = async (tokenId) => {
  try {
    if (!chennaiArtisanalNFT) {
      await initBlockchain();
    }

    const tokenURI = await chennaiArtisanalNFT.tokenURI(tokenId);
    const itemDetails = await chennaiArtisanalNFT.getItemDetails(tokenId);
    const owner = await chennaiArtisanalNFT.ownerOf(tokenId);
    const provenanceHistory = await chennaiArtisanalNFT.getProvenanceHistory(tokenId);

    return {
      tokenId,
      tokenURI,
      name: itemDetails.name,
      description: itemDetails.description,
      materials: itemDetails.materials,
      artisan: itemDetails.artisan,
      owner,
      creationDate: new Date(itemDetails.creationDate.toNumber() * 1000).toLocaleDateString(),
      provenanceHistory
    };
  } catch (error) {
    console.error('Error getting NFT details:', error);
    throw error;
  }
};

// Add provenance record to an NFT
export const addProvenanceRecord = async (tokenId, record) => {
  try {
    if (!chennaiArtisanalNFT) {
      await initBlockchain();
    }

    const tx = await chennaiArtisanalNFT.addProvenanceRecord(tokenId, record);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error adding provenance record:', error);
    throw error;
  }
};

// Get all artisans
export const getAllArtisans = async () => {
  try {
    if (!artisanRegistry) {
      await initBlockchain();
    }

    // Get the total number of artisans
    const artisanCount = await artisanRegistry.getArtisanCount();

    // If no artisans, return empty array
    if (artisanCount.toNumber() === 0) {
      return [];
    }

    const artisanList = [];

    // Get details for each artisan
    for (let i = 0; i < artisanCount; i++) {
      try {
        const artisanAddress = await artisanRegistry.artisanAddresses(i);
        const artisanDetails = await artisanRegistry.getArtisanDetails(artisanAddress);

        // Only include verified artisans
        if (artisanDetails.isVerified) {
          artisanList.push({
            address: artisanAddress,
            name: artisanDetails.name || 'Unknown Artisan',
            location: artisanDetails.location || 'Unknown Location',
            specialization: artisanDetails.specialization || 'Various Crafts',
            isVerified: artisanDetails.isVerified,
            registrationDate: artisanDetails.registrationDate ?
              artisanDetails.registrationDate.toNumber() : 0
          });
        }
      } catch (error) {
        console.error(`Error fetching artisan at index ${i}:`, error);
        // Continue to the next artisan instead of failing the entire function
      }
    }

    return artisanList;
  } catch (error) {
    console.error('Error getting all artisans:', error);
    return [];
  }
};

// Get NFTs by artisan address
export const getNFTsByArtisan = async (artisanAddress) => {
  try {
    if (!chennaiArtisanalNFT) {
      await initBlockchain();
    }

    // Validate address
    if (!artisanAddress || artisanAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Invalid artisan address');
    }

    const totalSupply = await chennaiArtisanalNFT.totalSupply();

    const nfts = [];
    for (let i = 0; i < totalSupply; i++) {
      try {
        const tokenId = await chennaiArtisanalNFT.tokenByIndex(i);
        const itemDetails = await chennaiArtisanalNFT.getItemDetails(tokenId);

        // Check if this NFT was created by the specified artisan
        if (itemDetails.artisan.toLowerCase() === artisanAddress.toLowerCase()) {
          const tokenURI = await chennaiArtisanalNFT.tokenURI(tokenId);
          const owner = await chennaiArtisanalNFT.ownerOf(tokenId);

          nfts.push({
            tokenId: tokenId.toString(),
            tokenURI,
            name: itemDetails.name || 'Unnamed Item',
            description: itemDetails.description || 'No description available',
            materials: itemDetails.materials || 'Not specified',
            artisan: itemDetails.artisan,
            owner,
            creationDate: itemDetails.creationDate ?
              new Date(itemDetails.creationDate.toNumber() * 1000).toLocaleDateString() :
              'Unknown date'
          });
        }
      } catch (error) {
        console.error(`Error checking NFT at index ${i}:`, error);
        // Continue to the next NFT
      }
    }

    return nfts;
  } catch (error) {
    console.error('Error getting NFTs by artisan:', error);
    return [];
  }
};

// Update NFT metadata
export const updateNFTMetadata = async (tokenId, tokenURI, name, description, materials) => {
  try {
    if (!chennaiArtisanalNFT) {
      await initBlockchain();
    }

    // Validate inputs
    if (!tokenId || !tokenURI || !name || !description || !materials) {
      throw new Error('All fields are required');
    }

    const tx = await chennaiArtisanalNFT.updateMetadata(
      tokenId,
      tokenURI,
      name,
      description,
      materials
    );
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error updating NFT metadata:', error);
    throw error;
  }
};

// Burn an NFT
export const burnNFT = async (tokenId) => {
  try {
    if (!chennaiArtisanalNFT) {
      await initBlockchain();
    }

    // Validate tokenId
    if (!tokenId) {
      throw new Error('Token ID is required');
    }

    const tx = await chennaiArtisanalNFT.burnToken(tokenId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error burning NFT:', error);
    throw error;
  }
};

// Update contract addresses
export const updateContractAddresses = (artisanRegistryAddress, nftAddress) => {
  if (artisanRegistryAddress) {
    ARTISAN_REGISTRY_ADDRESS = artisanRegistryAddress;
  }

  if (nftAddress) {
    CHENNAI_ARTISANAL_NFT_ADDRESS = nftAddress;
  }
};

// Local storage functions for NFT visibility
const HIDDEN_NFTS_KEY = 'chennaiArtisanal_hiddenNFTs';

// Hide an NFT (store in local storage)
export const hideNFT = (tokenId) => {
  try {
    const hiddenNFTs = getHiddenNFTs();
    if (!hiddenNFTs.includes(tokenId.toString())) {
      hiddenNFTs.push(tokenId.toString());
      localStorage.setItem(HIDDEN_NFTS_KEY, JSON.stringify(hiddenNFTs));
    }
    return true;
  } catch (error) {
    console.error('Error hiding NFT:', error);
    return false;
  }
};

// Show a previously hidden NFT
export const showNFT = (tokenId) => {
  try {
    const hiddenNFTs = getHiddenNFTs();
    const updatedHiddenNFTs = hiddenNFTs.filter(id => id !== tokenId.toString());
    localStorage.setItem(HIDDEN_NFTS_KEY, JSON.stringify(updatedHiddenNFTs));
    return true;
  } catch (error) {
    console.error('Error showing NFT:', error);
    return false;
  }
};

// Get all hidden NFT IDs
export const getHiddenNFTs = () => {
  try {
    const hiddenNFTs = localStorage.getItem(HIDDEN_NFTS_KEY);
    return hiddenNFTs ? JSON.parse(hiddenNFTs) : [];
  } catch (error) {
    console.error('Error getting hidden NFTs:', error);
    return [];
  }
};

// Check if an NFT is hidden
export const isNFTHidden = (tokenId) => {
  try {
    const hiddenNFTs = getHiddenNFTs();
    return hiddenNFTs.includes(tokenId.toString());
  } catch (error) {
    console.error('Error checking if NFT is hidden:', error);
    return false;
  }
};

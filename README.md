# Chennai Artisanal Goods Provenance DApp

A decentralized application for bringing transparency to the local artisanal market in Chennai. This platform allows registered local artisans to certify their unique products (e.g., pottery, textiles) on the blockchain, providing buyers with verifiable proof of authenticity and origin.

## Features

- **Artisan Registration & Verification**: Artisans can register and be verified by the platform administrator.
- **NFT Minting**: Verified artisans can mint NFTs representing their unique artisanal items.
- **Provenance Tracking**: Each item's history is recorded on the blockchain, ensuring transparency.
- **Marketplace**: Browse and view all artisanal items with their complete provenance history.
- **IPFS Integration**: Item images and metadata are stored on IPFS via Pinata.

## Technology Stack

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity
- **Development Framework**: Hardhat
- **Frontend**: React with Vite
- **UI Library**: Chakra UI
- **Web3 Integration**: ethers.js
- **Decentralized Storage**: IPFS via Pinata
- **Contract Verification**: Etherscan

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MetaMask wallet
- Alchemy API key (for Sepolia testnet)
- Pinata API key and secret (for IPFS)
- Etherscan API key (for contract verification)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd chennai-artisanal-dapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   SEPOLIA_RPC_URL=<your-alchemy-sepolia-url>
   PRIVATE_KEY=<your-wallet-private-key>
   PINATA_API_KEY=<your-pinata-api-key>
   PINATA_API_SECRET=<your-pinata-api-secret>
   ETHERSCAN_API_KEY=<your-etherscan-api-key>
   ```

4. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

5. Create a `.env` file in the frontend directory:
   ```
   VITE_PINATA_API_KEY=<your-pinata-api-key>
   VITE_PINATA_API_SECRET=<your-pinata-api-secret>
   ```

## Smart Contract Deployment

1. Compile the smart contracts:
   ```
   npx hardhat compile
   ```

2. Deploy to local hardhat network for testing:
   ```
   npx hardhat run scripts/deploy.js
   ```

3. Deploy to Sepolia testnet:
   ```
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. Update frontend with contract addresses:
   ```
   npx hardhat run scripts/update-frontend.js
   ```

## Running the Application

1. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Connect your MetaMask wallet to the application

## Usage Guide

### For Artisans

1. **Register as an Artisan**:
   - Navigate to the Profile page
   - Fill in your details and submit
   - Wait for verification by the platform administrator

2. **Create an NFT**:
   - Once verified, go to the Create page
   - Upload an image of your artisanal item
   - Fill in the details (name, description, materials)
   - Submit to mint your NFT

3. **View Your Items**:
   - Go to the My Items tab in your Profile
   - View all your created items
   - Add provenance records to track item history

### For Buyers

1. **Browse the Marketplace**:
   - Explore all artisanal items
   - Filter and search for specific items

2. **View Item Details**:
   - Click on an item to see its full details
   - View the complete provenance history
   - Verify the artisan's information

3. **Purchase Items**:
   - Connect with artisans directly
   - Transfer ownership through the blockchain

## Admin Functions

The contract owner has the following administrative capabilities:

1. **Verify Artisans**:
   - Approve registered artisans to mint NFTs

2. **Update Registry**:
   - Update the ArtisanRegistry contract address if needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for secure contract libraries
- Hardhat for the development environment
- Chakra UI for the frontend components
- Pinata for IPFS hosting
- Alchemy for Sepolia testnet access
- Etherscan for contract verification

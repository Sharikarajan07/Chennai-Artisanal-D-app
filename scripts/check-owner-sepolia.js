const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Checking contract owner on Sepolia testnet...");
  
  // Get contract addresses from deployment
  const deploymentPath = path.join(__dirname, '..', 'deployment.json');
  
  if (!fs.existsSync(deploymentPath)) {
    console.error('Deployment file not found. Please deploy contracts first.');
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const artisanRegistryAddress = deployment.artisanRegistry;
  
  console.log(`Using ArtisanRegistry at: ${artisanRegistryAddress}`);
  
  // Get the contract
  const ArtisanRegistry = await hre.ethers.getContractFactory("ArtisanRegistry");
  const registry = await ArtisanRegistry.attach(artisanRegistryAddress);
  
  // Get the owner
  const owner = await registry.owner();
  console.log(`Contract owner address: ${owner}`);
  
  // Get the current signer
  const [signer] = await hre.ethers.getSigners();
  console.log(`Your current address: ${signer.address}`);
  
  if (owner.toLowerCase() === signer.address.toLowerCase()) {
    console.log("You ARE the contract owner!");
    console.log("You can verify artisans using the verify-artisan-sepolia.js script.");
  } else {
    console.log("You are NOT the contract owner.");
    console.log("To verify artisans, you need to use the account that deployed the contract.");
    console.log(`The private key in your .env file corresponds to address: ${signer.address}`);
    console.log(`But the contract owner is: ${owner}`);
    console.log("Please update your .env file with the private key of the contract owner.");
  }
  
  // Get the private key from .env
  const privateKey = process.env.PRIVATE_KEY;
  if (privateKey) {
    console.log(`Private key in .env: ${privateKey.substring(0, 6)}...${privateKey.substring(privateKey.length - 4)}`);
  } else {
    console.log("No private key found in .env file.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

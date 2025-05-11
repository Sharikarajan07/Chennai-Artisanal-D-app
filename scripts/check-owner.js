const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Checking contract owner for Chennai Artisanal Goods Provenance DApp...");
  
  // Get contract addresses from deployment
  const deploymentPath = path.join(__dirname, '..', 'deployment.json');
  
  let artisanRegistryAddress;
  
  if (fs.existsSync(deploymentPath)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    artisanRegistryAddress = deployment.artisanRegistry;
    console.log(`Using address from deployment.json: ${artisanRegistryAddress}`);
  } else {
    // Use default local hardhat address if deployment file doesn't exist
    artisanRegistryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log(`Deployment file not found. Using default local address: ${artisanRegistryAddress}`);
  }
  
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
  } else {
    console.log("You are NOT the contract owner.");
    console.log("To verify artisans, you need to use the account that deployed the contract.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Checking artisan details on Sepolia testnet...");

  // Get contract addresses from deployment
  const deploymentPath = path.join(__dirname, '..', 'deployment.json');

  if (!fs.existsSync(deploymentPath)) {
    console.error('Deployment file not found. Please deploy contracts first.');
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const artisanRegistryAddress = deployment.artisanRegistry;

  console.log(`Using ArtisanRegistry at: ${artisanRegistryAddress}`);

  // Get the artisan address from command line arguments or use a default
  let artisanAddress = process.env.ARTISAN_ADDRESS;

  if (!artisanAddress) {
    // If no address is provided, use the current signer's address
    const [signer] = await hre.ethers.getSigners();
    artisanAddress = signer.address;
  }

  console.log(`Checking artisan at address: ${artisanAddress}`);

  // Get the contract
  const ArtisanRegistry = await hre.ethers.getContractFactory("ArtisanRegistry");
  const registry = await ArtisanRegistry.attach(artisanRegistryAddress);

  try {
    const artisanDetails = await registry.getArtisanDetails(artisanAddress);

    if (artisanDetails.registrationDate.toString() === '0') {
      console.log('This address is not registered as an artisan.');
      process.exit(0);
    }

    console.log('Artisan Details:');
    console.log('----------------');
    console.log(`Name: ${artisanDetails.name}`);
    console.log(`Location: ${artisanDetails.location}`);
    console.log(`Specialization: ${artisanDetails.specialization}`);
    console.log(`Contact Info: ${artisanDetails.contactInfo}`);
    console.log(`Verified: ${artisanDetails.isVerified ? 'Yes' : 'No'}`);
    console.log(`Registration Date: ${new Date(artisanDetails.registrationDate.toNumber() * 1000).toLocaleString()}`);

  } catch (error) {
    console.error('Error checking artisan details:', error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

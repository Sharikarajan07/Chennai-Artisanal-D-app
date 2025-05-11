const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Listing all registered artisans on Sepolia testnet...");

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

  try {
    // Get the total number of artisans
    const artisanCount = await registry.getArtisanCount();
    console.log(`Total registered artisans: ${artisanCount}`);

    if (Number(artisanCount) === 0) {
      console.log('No artisans registered yet.');
      process.exit(0);
    }

    console.log('\nArtisan Details:');
    console.log('----------------');

    // Get details for each artisan
    for (let i = 0; i < Number(artisanCount); i++) {
      const artisanAddress = await registry.artisanAddresses(i);
      const artisanDetails = await registry.getArtisanDetails(artisanAddress);

      console.log(`\nArtisan #${i + 1}:`);
      console.log(`Address: ${artisanAddress}`);
      console.log(`Name: ${artisanDetails.name}`);
      console.log(`Location: ${artisanDetails.location}`);
      console.log(`Specialization: ${artisanDetails.specialization}`);
      console.log(`Contact Info: ${artisanDetails.contactInfo}`);
      console.log(`Verified: ${artisanDetails.isVerified ? 'Yes' : 'No'}`);

      const timestamp = Number(artisanDetails.registrationDate) * 1000;
      console.log(`Registration Date: ${new Date(timestamp).toLocaleString()}`);
    }

  } catch (error) {
    console.error('Error listing artisans:', error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

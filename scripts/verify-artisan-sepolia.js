const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Verifying artisan on Sepolia testnet...");

  // Get contract addresses from deployment
  const deploymentPath = path.join(__dirname, '..', 'deployment.json');

  if (!fs.existsSync(deploymentPath)) {
    console.error('Deployment file not found. Please deploy contracts first.');
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const artisanRegistryAddress = deployment.artisanRegistry;

  console.log(`Using ArtisanRegistry at: ${artisanRegistryAddress}`);

  // Get the artisan address from command line arguments or environment variable
  const artisanAddress = process.env.ARTISAN_ADDRESS;

  if (!artisanAddress) {
    console.error('Please provide an artisan address in the .env file as ARTISAN_ADDRESS.');
    console.log('Example: Add ARTISAN_ADDRESS=0x123... to your .env file');
    process.exit(1);
  }

  console.log(`Verifying artisan at address: ${artisanAddress}`);

  // Get the contract
  const ArtisanRegistry = await hre.ethers.getContractFactory("ArtisanRegistry");
  const registry = await ArtisanRegistry.attach(artisanRegistryAddress);

  // Check if the artisan is registered
  try {
    const artisanDetails = await registry.getArtisanDetails(artisanAddress);

    if (artisanDetails.registrationDate.toString() === '0') {
      console.error('Artisan is not registered.');
      process.exit(1);
    }

    if (artisanDetails.isVerified) {
      console.log('Artisan is already verified.');
      process.exit(0);
    }

    // Get the owner
    const owner = await registry.owner();
    const [signer] = await hre.ethers.getSigners();

    console.log(`Contract owner: ${owner}`);
    console.log(`Your address: ${signer.address}`);

    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      console.error('You are not the contract owner. Only the contract owner can verify artisans.');
      process.exit(1);
    }

    // Verify the artisan
    console.log('Verifying artisan...');
    const tx = await registry.verifyArtisan(artisanAddress);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log('Waiting for transaction confirmation...');
    await tx.wait();

    console.log(`Artisan verified successfully!`);
    console.log('The artisan can now mint NFTs for their artisanal goods.');

    // Check verification status
    const updatedDetails = await registry.getArtisanDetails(artisanAddress);
    console.log(`Verification status: ${updatedDetails.isVerified ? 'Verified' : 'Not Verified'}`);

  } catch (error) {
    console.error('Error verifying artisan:', error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

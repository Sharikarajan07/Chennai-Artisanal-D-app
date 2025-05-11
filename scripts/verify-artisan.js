const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Chennai Artisanal Goods Provenance DApp - Artisan Verification Tool");
  
  // Get contract addresses from deployment
  const deploymentPath = path.join(__dirname, '..', 'deployment.json');
  
  if (!fs.existsSync(deploymentPath)) {
    console.error('Deployment file not found. Please deploy contracts first.');
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  
  // Get the artisan address from command line arguments
  const artisanAddress = process.argv[2];
  
  if (!artisanAddress) {
    console.error('Please provide an artisan address as a command line argument.');
    console.log('Usage: npx hardhat run scripts/verify-artisan.js --network localhost YOUR_ARTISAN_ADDRESS');
    process.exit(1);
  }
  
  console.log(`Verifying artisan at address: ${artisanAddress}`);
  
  // Get the contract
  const ArtisanRegistry = await hre.ethers.getContractFactory("ArtisanRegistry");
  const registry = await ArtisanRegistry.attach(deployment.artisanRegistry);
  
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
    
    // Verify the artisan
    const tx = await registry.verifyArtisan(artisanAddress);
    await tx.wait();
    
    console.log(`Artisan verified successfully! Transaction hash: ${tx.hash}`);
    console.log('The artisan can now mint NFTs for their artisanal goods.');
    
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

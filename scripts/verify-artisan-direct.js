const hre = require("hardhat");

async function main() {
  console.log("Verifying artisan directly...");
  
  // Get the contract
  const ArtisanRegistry = await hre.ethers.getContractFactory("ArtisanRegistry");
  const registry = await ArtisanRegistry.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  
  // Get the artisan address from command line arguments
  const artisanAddress = process.argv[2];
  
  if (!artisanAddress) {
    console.error('Please provide an artisan address as a command line argument.');
    console.log('Usage: npx hardhat run scripts/verify-artisan-direct.js --network localhost YOUR_ARTISAN_ADDRESS');
    process.exit(1);
  }
  
  console.log(`Verifying artisan at address: ${artisanAddress}`);
  
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

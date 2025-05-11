const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Registering artisan on Sepolia testnet...");
  
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
  
  // Get the signer
  const [signer] = await hre.ethers.getSigners();
  const artisanAddress = signer.address;
  
  console.log(`Registering artisan with address: ${artisanAddress}`);
  
  // Artisan details
  const name = "Chennai Artisan";
  const location = "Chennai, Tamil Nadu";
  const specialization = "Traditional Handicrafts";
  const contactInfo = "artisan@example.com";
  
  try {
    // Check if already registered
    const artisanDetails = await registry.getArtisanDetails(artisanAddress);
    
    if (artisanDetails.registrationDate.toString() !== '0') {
      console.log('This address is already registered as an artisan.');
      console.log('Artisan Details:');
      console.log(`Name: ${artisanDetails.name}`);
      console.log(`Location: ${artisanDetails.location}`);
      console.log(`Specialization: ${artisanDetails.specialization}`);
      console.log(`Contact Info: ${artisanDetails.contactInfo}`);
      console.log(`Verified: ${artisanDetails.isVerified ? 'Yes' : 'No'}`);
      process.exit(0);
    }
    
    // Register the artisan
    console.log('Registering artisan with the following details:');
    console.log(`Name: ${name}`);
    console.log(`Location: ${location}`);
    console.log(`Specialization: ${specialization}`);
    console.log(`Contact Info: ${contactInfo}`);
    
    const tx = await registry.registerArtisan(name, location, specialization, contactInfo);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log('Waiting for transaction confirmation...');
    await tx.wait();
    
    console.log('Artisan registered successfully!');
    console.log('You now need to be verified by the contract owner before you can mint NFTs.');
    
    // Check registration status
    const updatedDetails = await registry.getArtisanDetails(artisanAddress);
    console.log(`Registration status: ${updatedDetails.registrationDate.toString() !== '0' ? 'Registered' : 'Not Registered'}`);
    console.log(`Verification status: ${updatedDetails.isVerified ? 'Verified' : 'Not Verified'}`);
    
  } catch (error) {
    console.error('Error registering artisan:', error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

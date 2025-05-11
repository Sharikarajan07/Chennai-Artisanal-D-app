const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Verifying Chennai Artisanal Goods Provenance DApp contracts on Etherscan...");
  
  // Get contract addresses from deployment
  const deploymentPath = path.join(__dirname, '..', 'deployment.json');
  
  if (!fs.existsSync(deploymentPath)) {
    console.error('Deployment file not found. Please deploy contracts first.');
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  
  // Verify ArtisanRegistry
  console.log(`Verifying ArtisanRegistry at ${deployment.artisanRegistry}...`);
  try {
    await hre.run("verify:verify", {
      address: deployment.artisanRegistry,
      constructorArguments: [],
    });
    console.log("ArtisanRegistry verified successfully!");
  } catch (error) {
    console.error("Error verifying ArtisanRegistry:", error.message);
  }
  
  // Verify ChennaiArtisanalNFT
  console.log(`Verifying ChennaiArtisanalNFT at ${deployment.chennaiArtisanalNFT}...`);
  try {
    await hre.run("verify:verify", {
      address: deployment.chennaiArtisanalNFT,
      constructorArguments: [deployment.artisanRegistry],
    });
    console.log("ChennaiArtisanalNFT verified successfully!");
  } catch (error) {
    console.error("Error verifying ChennaiArtisanalNFT:", error.message);
  }
  
  console.log("Verification process completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

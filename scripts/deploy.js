// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");
const { saveDeployment } = require("./save-deployment");

async function main() {
  console.log("Deploying Chennai Artisanal Goods Provenance DApp contracts...");

  // Deploy ArtisanRegistry first
  const ArtisanRegistry = await hre.ethers.getContractFactory("ArtisanRegistry");
  const artisanRegistry = await ArtisanRegistry.deploy();
  await artisanRegistry.waitForDeployment();

  const artisanRegistryAddress = await artisanRegistry.getAddress();
  console.log(`ArtisanRegistry deployed to: ${artisanRegistryAddress}`);

  // Deploy ChennaiArtisanalNFT with the ArtisanRegistry address
  const ChennaiArtisanalNFT = await hre.ethers.getContractFactory("ChennaiArtisanalNFT");
  const chennaiArtisanalNFT = await ChennaiArtisanalNFT.deploy(artisanRegistryAddress);
  await chennaiArtisanalNFT.waitForDeployment();

  const nftAddress = await chennaiArtisanalNFT.getAddress();
  console.log(`ChennaiArtisanalNFT deployed to: ${nftAddress}`);

  console.log("Deployment complete!");

  // Save deployment information
  await saveDeployment(artisanRegistryAddress, nftAddress);

  // Wait for block confirmations for verification
  console.log("Waiting for block confirmations...");
  await artisanRegistry.deploymentTransaction().wait(5);
  await chennaiArtisanalNFT.deploymentTransaction().wait(5);

  // Verify contracts on Etherscan
  console.log("Verifying contracts on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: artisanRegistryAddress,
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: nftAddress,
      constructorArguments: [artisanRegistryAddress],
    });

    console.log("Contracts verified successfully!");
  } catch (error) {
    console.error("Error verifying contracts:", error);
  }

  console.log("Run the following command to update the frontend:");
  console.log("npx hardhat run scripts/update-frontend.js");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

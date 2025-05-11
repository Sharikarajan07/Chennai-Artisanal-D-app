const fs = require('fs');
const path = require('path');

async function saveDeployment(artisanRegistryAddress, nftAddress) {
  console.log('Saving deployment information...');
  
  const deployment = {
    artisanRegistry: artisanRegistryAddress,
    chennaiArtisanalNFT: nftAddress,
    deploymentTimestamp: new Date().toISOString()
  };
  
  const deploymentPath = path.join(__dirname, '..', 'deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  
  console.log('Deployment information saved successfully!');
  console.log(`ArtisanRegistry: ${artisanRegistryAddress}`);
  console.log(`ChennaiArtisanalNFT: ${nftAddress}`);
}

module.exports = {
  saveDeployment
};

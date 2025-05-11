const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Updating frontend contract information...');

  // Get contract addresses from deployment
  const deploymentPath = path.join(__dirname, '..', 'deployment.json');
  
  if (!fs.existsSync(deploymentPath)) {
    console.error('Deployment file not found. Please deploy contracts first.');
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  
  // Get contract ABIs
  const artisanRegistryPath = path.join(
    __dirname,
    '..',
    'artifacts',
    'contracts',
    'ArtisanRegistry.sol',
    'ArtisanRegistry.json'
  );
  
  const nftPath = path.join(
    __dirname,
    '..',
    'artifacts',
    'contracts',
    'ChennaiArtisanalNFT.sol',
    'ChennaiArtisanalNFT.json'
  );
  
  if (!fs.existsSync(artisanRegistryPath) || !fs.existsSync(nftPath)) {
    console.error('Contract artifacts not found. Please compile contracts first.');
    process.exit(1);
  }
  
  const artisanRegistryArtifact = JSON.parse(fs.readFileSync(artisanRegistryPath, 'utf8'));
  const nftArtifact = JSON.parse(fs.readFileSync(nftPath, 'utf8'));
  
  // Create frontend contract files
  const frontendDir = path.join(__dirname, '..', 'frontend', 'src', 'contracts');
  
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  
  // Write ArtisanRegistry.json
  fs.writeFileSync(
    path.join(frontendDir, 'ArtisanRegistry.json'),
    JSON.stringify({ abi: artisanRegistryArtifact.abi }, null, 2)
  );
  
  // Write ChennaiArtisanalNFT.json
  fs.writeFileSync(
    path.join(frontendDir, 'ChennaiArtisanalNFT.json'),
    JSON.stringify({ abi: nftArtifact.abi }, null, 2)
  );
  
  // Update blockchain.js with contract addresses
  const blockchainJsPath = path.join(__dirname, '..', 'frontend', 'src', 'utils', 'blockchain.js');
  
  if (!fs.existsSync(blockchainJsPath)) {
    console.error('blockchain.js not found. Please check the frontend structure.');
    process.exit(1);
  }
  
  let blockchainJs = fs.readFileSync(blockchainJsPath, 'utf8');
  
  // Replace contract addresses
  blockchainJs = blockchainJs.replace(
    /const ARTISAN_REGISTRY_ADDRESS = '0x[0-9a-fA-F]{40}';/,
    `const ARTISAN_REGISTRY_ADDRESS = '${deployment.artisanRegistry}';`
  );
  
  blockchainJs = blockchainJs.replace(
    /const CHENNAI_ARTISANAL_NFT_ADDRESS = '0x[0-9a-fA-F]{40}';/,
    `const CHENNAI_ARTISANAL_NFT_ADDRESS = '${deployment.chennaiArtisanalNFT}';`
  );
  
  fs.writeFileSync(blockchainJsPath, blockchainJs);
  
  console.log('Frontend contract information updated successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

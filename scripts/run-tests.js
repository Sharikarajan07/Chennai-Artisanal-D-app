const { execSync } = require('child_process');

async function main() {
  console.log('Running tests for Chennai Artisanal Goods Provenance DApp...');
  
  try {
    // Run Hardhat tests
    console.log('\n=== Running Smart Contract Tests ===\n');
    execSync('npx hardhat test', { stdio: 'inherit' });
    
    console.log('\n=== All tests passed! ===\n');
  } catch (error) {
    console.error('Error running tests:', error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

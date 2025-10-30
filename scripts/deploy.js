const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying CertificateRegistry contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy the CertificateRegistry contract
  const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
  const registry = await CertificateRegistry.deploy();
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("CertificateRegistry deployed to:", contractAddress);
  console.log("Admin address:", await registry.admin());

  // Create config directory if it doesn't exist
  const configDir = path.join(__dirname, '../src/config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Save contract address to config file
  const addressData = {
    CertificateRegistry: contractAddress
  };

  const addressFilePath = path.join(configDir, 'contractAddress.json');
  fs.writeFileSync(addressFilePath, JSON.stringify(addressData, null, 2));
  console.log("Contract address saved to:", addressFilePath);

  // Copy contract ABI to config directory
  const artifactPath = path.join(__dirname, '../artifacts/contracts/ShikkhaChain.sol/CertificateRegistry.json');
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const abiFilePath = path.join(configDir, 'contractABI.json');
    fs.writeFileSync(abiFilePath, JSON.stringify(artifact.abi, null, 2));
    console.log("Contract ABI saved to:", abiFilePath);
  }

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", contractAddress);
  console.log("Admin Address:", deployer.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("========================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

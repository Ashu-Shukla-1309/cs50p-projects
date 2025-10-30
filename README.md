# BlockVerify

**A Blockchain-Powered Academic Credential Verification System**

BlockVerify is a decentralized platform for issuing, verifying, and revoking academic certificates using Ethereum smart contracts and IPFS. Designed with scalability and transparency in mind, it empowers educational institutions, regulators, employers, and graduates to engage in secure, trustless credential management.

---

## 📚 Academic Project

**Project Type:** 2nd Year Mini Project
**Author:** Ashutosh Shukla
**Year:** 2025

---

## 🔧 Features

- ✔️ Decentralized certificate issuance and revocation
- 🔐 IPFS-based off-chain metadata storage
- 🧠 Ethereum smart contracts for on-chain verification
- 🧩 Role-based access control (Institution Admin, Public)
- 📄 QR and hash-based public certificate verification
- 📤 Export verified credentials as signed PDFs (via jsPDF)
- 🌐 React-based frontend with MetaMask integration

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- IPFS daemon (optional, or use Infura)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   The `.env` file is already configured with default local development settings. Modify if needed.

3. **Start Hardhat local blockchain:**
   ```bash
   npx hardhat node
   ```
   Keep this terminal running. Note the first account address (this will be the admin).

4. **Deploy the smart contract:**
   Open a new terminal and run:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   This will deploy the contract and save the address and ABI to `src/config/`.

5. **Start the backend server:**
   ```bash
   node server.js
   ```
   Keep this terminal running (port 5001).

6. **Start IPFS (optional):**
   If using local IPFS:
   ```bash
   ipfs daemon
   ```
   Or configure Infura IPFS in `.env` file.

7. **Start the React frontend:**
   ```bash
   npm start
   ```
   The app will open at http://localhost:3000

### MetaMask Setup

1. Install MetaMask extension in your browser
2. Add Hardhat network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
3. Import the first Hardhat account (the deployer/admin account):
   - Copy the private key from the Hardhat node terminal
   - In MetaMask: Import Account → Private Key

---

## 📖 Usage

### For Institutions (Admin)

1. **Connect your wallet** (must be the admin account)
2. **Register your institution** (one-time setup)
3. **Issue certificates** by filling the form:
   - Student Name
   - Course
   - Duration
   - Grade
   - Credential Type
4. **View and manage** issued certificates
5. **Revoke certificates** if needed

### For Public Verification

1. **No wallet needed** for verification
2. **Enter certificate hash** (66-character hex string starting with 0x)
3. **View certificate details** if valid
4. **Download PDF** from IPFS
5. **View/download QR code** for easy sharing

---

## 🏗️ Architecture

### Smart Contract (Solidity)
- **Location:** `contracts/BlockVerify.sol`
- **Functions:**
  - `issueCertificate()` - Issue new certificate (admin only)
  - `verifyCertificate()` - Verify certificate by hash (public)
  - `revokeCertificate()` - Revoke certificate (admin only)
  - `getMyCertificates()` - Get user's certificates

### Backend (Node.js/Express)
- **Location:** `server.js`
- **Endpoints:**
  - `GET/POST /institutions` - Institution management
  - `GET/POST /certificates` - Certificate metadata
  - `PUT /certificates/revoke` - Certificate revocation
- **Storage:** JSON files in `src/data/`

### Frontend (React)
- **Main App:** `src/App.jsx` - Role-based routing
- **Components:**
  - `Header.jsx` - Navigation and wallet connection
  - `InstitutionSetup.jsx` - First-time registration
  - `CertificateIssueForm.jsx` - Certificate issuance
  - `CertificateList.jsx` - View/manage certificates
  - `CertificateVerify.jsx` - Public verification
  - `QRCodeModal.jsx` - QR code display
- **Utilities:**
  - `blockchain.js` - Ethereum interactions
  - `ipfs.js` - IPFS upload/download
  - `pdfGenerator.js` - Certificate PDF creation
  - `validation.js` - Form validation

---

## 🧪 Testing

### Manual Testing Checklist

1. **Institution Registration:**
   - Connect with admin wallet
   - Register institution with valid details
   - Verify registration persists on reload

2. **Certificate Issuance:**
   - Fill form with valid data
   - Approve MetaMask transaction
   - Verify certificate appears in list
   - Check PDF uploaded to IPFS

3. **Certificate Verification:**
   - Copy certificate hash
   - Open in private/incognito window (or disconnect wallet)
   - Paste hash and verify
   - Download PDF from IPFS
   - View QR code

4. **Certificate Revocation:**
   - Select certificate from list
   - Click Revoke
   - Approve transaction
   - Verify status changes to "Revoked"
   - Verify revoked certificate shows as invalid in verification

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# Blockchain
REACT_APP_NETWORK_URL=http://127.0.0.1:8545
REACT_APP_CHAIN_ID=31337

# Backend API
REACT_APP_API_URL=http://localhost:5001

# IPFS
REACT_APP_IPFS_URL=http://127.0.0.1:5001
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### Using Infura IPFS

Update `.env`:
```env
REACT_APP_IPFS_URL=https://ipfs.infura.io:5001
REACT_APP_IPFS_PROJECT_ID=your_project_id
REACT_APP_IPFS_PROJECT_SECRET=your_secret
```

---

## 📝 Project Structure

```
cs50p-projects/
├── contracts/              # Solidity smart contracts
│   └── BlockVerify.sol
├── scripts/               # Deployment scripts
│   └── deploy.js
├── src/
│   ├── components/        # React components
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── data/             # JSON data storage
├── public/               # Static assets
├── server.js            # Express backend server
├── hardhat.config.js    # Hardhat configuration
├── package.json         # Dependencies
└── .env                # Environment variables
```

---

## 🐛 Troubleshooting

### Common Issues

**"Contract not deployed" error:**
- Make sure Hardhat node is running
- Run deployment script: `npx hardhat run scripts/deploy.js --network localhost`

**"Backend server not running":**
- Start server: `node server.js`
- Check port 5001 is not in use

**"IPFS not accessible":**
- Start IPFS daemon: `ipfs daemon`
- Or configure Infura IPFS in `.env`

**"Wrong network" in MetaMask:**
- Switch to Hardhat Local network (Chain ID 31337)
- Or add network manually in MetaMask

**Transaction fails with "insufficient gas":**
- Make sure your account has ETH from Hardhat
- If using fresh account, send ETH from Hardhat account #0

---

## 📚 Learn More

- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [React Documentation](https://react.dev/)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## 📄 License

This project is part of academic research. Please cite the paper if you use this work.

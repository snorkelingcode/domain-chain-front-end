export interface ContractAddresses {
  domainNFT: string;
  token: string;
  treasury: string;
  escrow: string;
  verification: string;
}

const contractAddresses: ContractAddresses = {
  domainNFT: process.env.VITE_DOMAIN_NFT_CONTRACT_ADDRESS || '',
  token: process.env.VITE_TOKEN_CONTRACT_ADDRESS || '',
  treasury: process.env.VITE_TREASURY_CONTRACT_ADDRESS || '',
  escrow: process.env.VITE_ESCROW_CONTRACT_ADDRESS || '',
  verification: process.env.VITE_VERIFICATION_CONTRACT_ADDRESS || ''
};

export default contractAddresses;
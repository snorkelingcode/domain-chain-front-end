export interface ContractAddresses {
  domainNFT: string;
  token: string;
  treasury: string;
  escrow: string;
  verification: string;
}

const contractAddresses: ContractAddresses = {
  domainNFT: import.meta.env.VITE_DOMAIN_NFT_CONTRACT_ADDRESS,
  token: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS,
  treasury: import.meta.env.VITE_TREASURY_CONTRACT_ADDRESS,
  escrow: import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS,
  verification: import.meta.env.VITE_VERIFICATION_CONTRACT_ADDRESS
};

export default contractAddresses;
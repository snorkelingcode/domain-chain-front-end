export const config = {
  walletConnect: {
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
  },
  contracts: {
    domainNFT: import.meta.env.VITE_DOMAIN_NFT_CONTRACT_ADDRESS || '',
    token: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS || '',
    treasury: import.meta.env.VITE_TREASURY_CONTRACT_ADDRESS || '',
    escrow: import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS || '',
    verification: import.meta.env.VITE_VERIFICATION_CONTRACT_ADDRESS || '',
  }
};

export default config;
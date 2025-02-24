interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isBraveWallet?: boolean;
    };
  }
  
  interface Navigator {
    brave?: {
      isBrave: () => Promise<boolean>;
    };
  }
  
  export {};